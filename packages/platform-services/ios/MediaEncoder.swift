// Media encoding on iOS: H.264 video and AAC audio into a faststart MP4 via
// AVAssetWriter. Sources are raw files the host wrote: tightly packed RGBA8
// frames for video, little-endian interleaved PCM ("f32" or "s16") for
// audio. All work is synchronous and runs on the module's serial queue.
import AVFoundation
import AudioToolbox
import CoreMedia
import CoreVideo
import Foundation
import VideoToolbox

/// Validated video track parameters.
private struct VideoSpec {
  let source: EncoderMediaSource
  let handle: FileHandle
  let width: Int
  let height: Int
  let frameRateNum: Int64
  let frameRateDen: Int64
  let frameCount: Int
  let frameBytes: Int

  var fps: Double { Double(frameRateNum) / Double(frameRateDen) }
  var frameSeconds: Double { Double(frameRateDen) / Double(frameRateNum) }
  var durationSeconds: Double { frameSeconds * Double(frameCount) }
}

/// Validated audio track parameters.
private struct AudioSpec {
  let source: EncoderMediaSource
  let handle: FileHandle
  let sampleRate: Int
  let channels: Int
  let isFloat: Bool
  let frames: Int

  var bytesPerSample: Int { isFloat ? 4 : 2 }
  var bytesPerFrame: Int { channels * bytesPerSample }
  var durationSeconds: Double { Double(frames) / Double(sampleRate) }
}

final class MediaEncoder: Sendable {
  /// Codec/container support probe. VideoToolbox and AudioConverter answer
  /// whether the OS exposes the codecs; a passing probe does not guarantee a
  /// given device accepts a given frame size.
  func probe() -> EncoderProbeRecord {
    var session: VTCompressionSession?
    let attributes: CFDictionary = [kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32BGRA] as CFDictionary
    let videoStatus = VTCompressionSessionCreate(
      allocator: nil, width: 64, height: 64, codecType: kCMVideoCodecType_H264,
      encoderSpecification: nil, imageBufferAttributes: attributes,
      compressedDataAllocator: nil, outputCallback: nil, refcon: nil,
      compressionSessionOut: &session)
    if let session { VTCompressionSessionInvalidate(session) }

    var input = AudioStreamBasicDescription()
    input.mSampleRate = 48_000
    input.mFormatID = kAudioFormatLinearPCM
    input.mFormatFlags = kAudioFormatFlagIsFloat | kAudioFormatFlagIsPacked
    input.mBitsPerChannel = 32
    input.mChannelsPerFrame = 2
    input.mBytesPerFrame = 8
    input.mFramesPerPacket = 1
    input.mBytesPerPacket = 8
    var output = AudioStreamBasicDescription()
    output.mSampleRate = 48_000
    output.mFormatID = kAudioFormatMPEG4AAC
    output.mChannelsPerFrame = 2
    var converter: AudioConverterRef?
    let audioStatus = AudioConverterNew(&input, &output, &converter)
    if let converter { AudioConverterDispose(converter) }

    return EncoderProbeRecord(container: "mp4", video: videoStatus == noErr, audio: audioStatus == noErr)
    // hardwareAccelerated is not reported: VideoToolbox/AudioConverter do not
    // expose a reliable hardware/software answer at probe time.
  }

  func encode(video: EncodeVideoRecord?, audio: EncodeAudioRecord?) throws -> EncodedMediaRecord {
    let videoSpec = try video.map { try validateVideo($0) }
    let audioSpec = try audio.map { try validateAudio($0) }
    if videoSpec == nil && audioSpec == nil {
      throw MediaEncodeFailure(.outOfRange, "encode requires a video or an audio track")
    }
    // The FileHandles opened during validation are ours to close on every path.
    defer {
      videoSpec?.handle.closeFile()
      audioSpec?.handle.closeFile()
    }

    let output = try MediaEncoderOutputDirectory.newFile()
    do {
      try write(output, video: videoSpec, audio: audioSpec)
      try MediaEncoderOutputDirectory.trim(keeping: output)
      let attributes = try FileManager.default.attributesOfItem(atPath: output.path)
      let byteLength = (attributes[.size] as? NSNumber)?.int64Value ?? 0
      guard byteLength > 0 else {
        throw MediaEncodeFailure(.encodeFailed, "The encoder produced an empty file.")
      }
      let durationUs = Int64(max(videoSpec?.durationSeconds ?? 0, audioSpec?.durationSeconds ?? 0) * 1_000_000)
      return EncodedMediaRecord(
        uri: output.absoluteString, mimeType: "video/mp4",
        byteLength: Double(byteLength), durationUs: Double(durationUs))
    } catch {
      try? FileManager.default.removeItem(at: output)
      throw error
    }
  }

  // MARK: - Validation

  private func intField(_ value: Double, _ name: String, _ range: ClosedRange<Int>) throws -> Int {
    guard value == value.rounded(.towardZero), value >= Double(range.lowerBound), value <= Double(range.upperBound) else {
      throw MediaEncodeFailure(.outOfRange, "\(name) must be an integer in \(range.lowerBound)...\(range.upperBound)")
    }
    return Int(value)
  }

  private func validateVideo(_ record: EncodeVideoRecord) throws -> VideoSpec {
    guard record.pixelFormat == "rgba8" else {
      throw MediaEncodeFailure(.unsupportedFormat, "pixelFormat must be rgba8")
    }
    let width = try intField(record.width, "width", 1...4096)
    let height = try intField(record.height, "height", 1...4096)
    guard width * height <= 8_294_400 else {
      throw MediaEncodeFailure(.outOfRange, "width×height is limited to 8294400 pixels")
    }
    let num = try intField(record.frameRateNum, "frameRateNum", 1...1_000_000)
    let den = try intField(record.frameRateDen, "frameRateDen", 1...1_000_000)
    let fps = Double(num) / Double(den)
    guard fps >= 0.01 && fps <= 240 else {
      throw MediaEncodeFailure(.outOfRange, "frame rate must be within 0.01–240 fps")
    }
    let count = try intField(record.frameCount, "frameCount", 1...100_000)
    let frameBytes = width * height * 4
    let total = Int64(count) * Int64(frameBytes)
    guard total <= 8 * 1024 * 1024 * 1024 else {
      throw MediaEncodeFailure(.outOfRange, "the raw video source is limited to 8 GiB")
    }
    let source = try EncoderMediaSource(uri: record.uri)
    let handle = try source.requireSize(total)
    return VideoSpec(source: source, handle: handle, width: width, height: height,
                     frameRateNum: Int64(num), frameRateDen: Int64(den), frameCount: count, frameBytes: frameBytes)
  }

  private func validateAudio(_ record: EncodeAudioRecord) throws -> AudioSpec {
    guard record.sampleFormat == "f32" || record.sampleFormat == "s16" else {
      throw MediaEncodeFailure(.unsupportedFormat, "sampleFormat must be f32 or s16")
    }
    let sampleRate = try intField(record.sampleRate, "sampleRate", 8_000...192_000)
    let channels = try intField(record.channels, "channels", 1...2)
    let frames = try intField(record.frames, "frames", 1...1_000_000_000)
    let bytesPerSample = record.sampleFormat == "f32" ? 4 : 2
    let total = Int64(frames) * Int64(channels) * Int64(bytesPerSample)
    guard total <= 1024 * 1024 * 1024 else {
      throw MediaEncodeFailure(.outOfRange, "the raw audio source is limited to 1 GiB")
    }
    let source = try EncoderMediaSource(uri: record.uri)
    let handle = try source.requireSize(total)
    return AudioSpec(source: source, handle: handle, sampleRate: sampleRate, channels: channels,
                     isFloat: record.sampleFormat == "f32", frames: frames)
  }

  // MARK: - Writing

  private func write(_ output: URL, video: VideoSpec?, audio: AudioSpec?) throws {
    let writer = try AVAssetWriter(url: output, fileType: .mp4)
    var videoInput: AVAssetWriterInput?
    var pixelAdaptor: AVAssetWriterInputPixelBufferAdaptor?
    var audioInput: AVAssetWriterInput?

    if let video {
      // Rough CBR estimate: ~0.1 bits per pixel per frame-second, clamped.
      let bitrate = min(60_000_000, max(1_000_000, Int(Double(video.width * video.height) * video.fps * 0.1)))
      let settings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: video.width,
        AVVideoHeightKey: video.height,
        AVVideoCompressionPropertiesKey: [
          AVVideoAverageBitRateKey: bitrate,
          AVVideoExpectedSourceFrameRateKey: video.fps,
          AVVideoMaxKeyFrameIntervalKey: max(1, Int((video.fps * 2).rounded())),
        ] as [String: Any],
      ]
      let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
      input.expectsMediaDataInRealTime = false
      let attributes: [String: Any] = [
        String(kCVPixelBufferPixelFormatTypeKey): kCVPixelFormatType_32BGRA,
        String(kCVPixelBufferWidthKey): video.width,
        String(kCVPixelBufferHeightKey): video.height,
      ]
      let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: attributes)
      writer.add(input)
      videoInput = input
      pixelAdaptor = adaptor
    }

    if let audio {
      let settings: [String: Any] = [
        AVFormatIDKey: kAudioFormatMPEG4AAC,
        AVSampleRateKey: audio.sampleRate,
        AVNumberOfChannelsKey: audio.channels,
        AVEncoderBitRateKey: audio.channels > 1 ? 128_000 : 64_000,
      ]
      let input = AVAssetWriterInput(mediaType: .audio, outputSettings: settings,
                                     sourceFormatHint: try audioFormatDescription(audio))
      input.expectsMediaDataInRealTime = false
      writer.add(input)
      audioInput = input
    }

    do {
      guard writer.startWriting() else {
        throw MediaEncodeFailure(.encodeFailed, "AVAssetWriter refused to start: \(writer.error?.localizedDescription ?? "unknown")")
      }
      writer.startSession(atSourceTime: .zero)

      if let video, let input = videoInput, let adaptor = pixelAdaptor {
        try feedVideo(video, input: input, adaptor: adaptor, writer: writer)
      }
      if let audio, let input = audioInput {
        try feedAudio(audio, input: input, writer: writer)
      }
      videoInput?.markAsFinished()
      audioInput?.markAsFinished()

      let finished = DispatchSemaphore(value: 0)
      writer.finishWriting { finished.signal() }
      _ = finished.wait(timeout: .now() + 86_400)
      guard writer.status == .completed else {
        throw MediaEncodeFailure(.encodeFailed, "AVAssetWriter finished with status \(writer.status.rawValue)")
      }
    } catch {
      // A writer left in .writing leaks its inputs and the output file handle.
      if writer.status == .writing { writer.cancelWriting() }
      throw error
    }
  }

  /// Reads the RGBA8 file frame by frame, swizzles to BGRA inside a pooled
  /// CVPixelBuffer and appends at exact rational-rate timestamps.
  private func feedVideo(_ spec: VideoSpec, input: AVAssetWriterInput, adaptor: AVAssetWriterInputPixelBufferAdaptor, writer: AVAssetWriter) throws {
    var rgba = [UInt8](repeating: 0, count: spec.frameBytes)
    let timescale: Int32 = 600
    for index in 0..<spec.frameCount {
      try readFully(spec.handle, into: &rgba)
      while !input.isReadyForMoreMediaData {
        Thread.sleep(forTimeInterval: 0.001)
      }
      let pixelBuffer = try makePixelBuffer(adaptor: adaptor, width: spec.width, height: spec.height)
      try swizzleRGBA(toBGRA: pixelBuffer, rgba: rgba, width: spec.width, height: spec.height)
      let pts = CMTime(seconds: Double(index) * spec.frameSeconds, preferredTimescale: timescale)
      guard adaptor.append(pixelBuffer, withPresentationTime: pts) else {
        throw MediaEncodeFailure(.encodeFailed, "The pixel buffer was rejected: \(writer.error?.localizedDescription ?? "unknown")")
      }
    }
  }

  private func readFully(_ handle: FileHandle, into buffer: inout [UInt8]) throws {
    var filled = 0
    while filled < buffer.count {
      guard let chunk = try handle.read(upToCount: buffer.count - filled), !chunk.isEmpty else {
        throw MediaEncodeFailure(.encodeFailed, "The raw source ended early.")
      }
      buffer.withUnsafeMutableBytes { dest in
        chunk.withUnsafeBytes { src in
          dest.baseAddress!.advanced(by: filled).copyMemory(from: src.baseAddress!, byteCount: src.count)
        }
      }
      filled += chunk.count
    }
  }

  private func makePixelBuffer(adaptor: AVAssetWriterInputPixelBufferAdaptor, width: Int, height: Int) throws -> CVPixelBuffer {
    var pixelBuffer: CVPixelBuffer?
    if let pool = adaptor.pixelBufferPool {
      let status = CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &pixelBuffer)
      guard status == kCVReturnSuccess, let pixelBuffer else {
        throw MediaEncodeFailure(.encodeFailed, "CVPixelBufferPoolCreatePixelBuffer failed (\(status)).")
      }
      return pixelBuffer
    }
    let attributes: [String: Any] = [
      String(kCVPixelBufferPixelFormatTypeKey): kCVPixelFormatType_32BGRA,
      String(kCVPixelBufferWidthKey): width,
      String(kCVPixelBufferHeightKey): height,
      String(kCVPixelBufferIOSurfacePropertiesKey): [:] as CFDictionary,
    ]
    let status = CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32BGRA,
                                     attributes as CFDictionary, &pixelBuffer)
    guard status == kCVReturnSuccess, let pixelBuffer else {
      throw MediaEncodeFailure(.encodeFailed, "CVPixelBufferCreate failed (\(status)).")
    }
    return pixelBuffer
  }

  /// Copies RGBA bytes into a BGRA CVPixelBuffer, swapping the R and B bytes.
  private func swizzleRGBA(toBGRA pixelBuffer: CVPixelBuffer, rgba: [UInt8], width: Int, height: Int) throws {
    CVPixelBufferLockBaseAddress(pixelBuffer, [])
    defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, []) }
    guard let base = CVPixelBufferGetBaseAddress(pixelBuffer) else {
      throw MediaEncodeFailure(.encodeFailed, "The pixel buffer has no base address.")
    }
    let dst = base.assumingMemoryBound(to: UInt8.self)
    let dstStride = CVPixelBufferGetBytesPerRow(pixelBuffer)
    rgba.withUnsafeBufferPointer { src in
      for y in 0..<height {
        let sRow = y * width * 4
        let dRow = y * dstStride
        for x in 0..<width {
          let s = sRow + x * 4
          let d = dRow + x * 4
          dst[d] = src[s + 2]
          dst[d + 1] = src[s + 1]
          dst[d + 2] = src[s]
          dst[d + 3] = src[s + 3]
        }
      }
    }
  }

  /// The LPCM format description AVAssetWriter wants as the audio source hint.
  private func audioFormatDescription(_ spec: AudioSpec) throws -> CMAudioFormatDescription {
    var asbd = AudioStreamBasicDescription()
    asbd.mSampleRate = Double(spec.sampleRate)
    asbd.mFormatID = kAudioFormatLinearPCM
    asbd.mChannelsPerFrame = UInt32(spec.channels)
    asbd.mFramesPerPacket = 1
    if spec.isFloat {
      asbd.mFormatFlags = kAudioFormatFlagIsFloat | kAudioFormatFlagIsPacked
      asbd.mBitsPerChannel = 32
      asbd.mBytesPerFrame = UInt32(spec.bytesPerFrame)
      asbd.mBytesPerPacket = UInt32(spec.bytesPerFrame)
    } else {
      asbd.mFormatFlags = kAudioFormatFlagIsSignedInteger | kAudioFormatFlagIsPacked
      asbd.mBitsPerChannel = 16
      asbd.mBytesPerFrame = UInt32(spec.bytesPerFrame)
      asbd.mBytesPerPacket = UInt32(spec.bytesPerFrame)
    }
    var description: CMAudioFormatDescription?
    let status = CMAudioFormatDescriptionCreate(allocator: kCFAllocatorDefault, asbd: &asbd,
                                                layoutSize: 0, layout: nil,
                                                magicCookieSize: 0, magicCookie: nil,
                                                extensions: nil, formatDescriptionOut: &description)
    guard status == noErr, let description else {
      throw MediaEncodeFailure(.encodeFailed, "CMAudioFormatDescriptionCreate failed (\(status)).")
    }
    return description
  }

  /// Reads PCM in bounded chunks and appends CMSampleBuffers of AAC-ready LPCM.
  private func feedAudio(_ spec: AudioSpec, input: AVAssetWriterInput, writer: AVAssetWriter) throws {
    let chunkFrames = 8192
    var frameCursor = 0
    while frameCursor < spec.frames {
      let want = min(chunkFrames, spec.frames - frameCursor)
      let byteCount = want * spec.bytesPerFrame
      var pcm = [UInt8](repeating: 0, count: byteCount)
      try readFully(spec.handle, into: &pcm)
      while !input.isReadyForMoreMediaData {
        Thread.sleep(forTimeInterval: 0.001)
      }
      let buffer = try makeSampleBuffer(pcm: pcm, spec: spec, startFrame: frameCursor, frames: want)
      guard input.append(buffer) else {
        throw MediaEncodeFailure(.encodeFailed, "The audio sample was rejected: \(writer.error?.localizedDescription ?? "unknown")")
      }
      frameCursor += want
    }
  }

  private func makeSampleBuffer(pcm: [UInt8], spec: AudioSpec, startFrame: Int, frames: Int) throws -> CMSampleBuffer {
    var blockBuffer: CMBlockBuffer?
    let byteCount = pcm.count
    let raw = UnsafeMutableRawPointer.allocate(byteCount: byteCount, alignment: 16)
    pcm.withUnsafeBufferPointer { src in
      raw.copyMemory(from: src.baseAddress!, byteCount: byteCount)
    }
    // CMBlockBufferCreateWithMemoryBlock does not take ownership of
    // `memoryBlock`: without a deallocator the raw allocation leaks on every
    // successful encode. The custom block source frees it when the block
    // buffer is released (the sample buffer retains it for the writer).
    var blockSource = CMBlockBufferCustomBlockSource(
      version: kCMBlockBufferCustomBlockSourceVersion,
      AllocateBlock: nil,
      FreeBlock: { _, doomedMemoryBlock, _ in
        doomedMemoryBlock.deallocate()
      },
      refCon: nil)
    let blockStatus = CMBlockBufferCreateWithMemoryBlock(
      allocator: kCFAllocatorDefault, memoryBlock: raw, blockLength: byteCount,
      blockAllocator: kCFAllocatorDefault, customBlockSource: &blockSource,
      offsetToData: 0, dataLength: byteCount, flags: kCMBlockBufferAssureMemoryNowFlag,
      blockBufferOut: &blockBuffer)
    guard blockStatus == kCMBlockBufferNoErr, blockBuffer != nil else {
      raw.deallocate()
      throw MediaEncodeFailure(.encodeFailed, "CMBlockBufferCreateWithMemoryBlock failed (\(blockStatus)).")
    }

    var asbd = AudioStreamBasicDescription()
    asbd.mSampleRate = Double(spec.sampleRate)
    asbd.mFormatID = kAudioFormatLinearPCM
    asbd.mChannelsPerFrame = UInt32(spec.channels)
    asbd.mFramesPerPacket = 1
    if spec.isFloat {
      asbd.mFormatFlags = kAudioFormatFlagIsFloat | kAudioFormatFlagIsPacked
      asbd.mBitsPerChannel = 32
      asbd.mBytesPerFrame = UInt32(spec.bytesPerFrame)
      asbd.mBytesPerPacket = UInt32(spec.bytesPerFrame)
    } else {
      asbd.mFormatFlags = kAudioFormatFlagIsSignedInteger | kAudioFormatFlagIsPacked
      asbd.mBitsPerChannel = 16
      asbd.mBytesPerFrame = UInt32(spec.bytesPerFrame)
      asbd.mBytesPerPacket = UInt32(spec.bytesPerFrame)
    }
    var formatDescription: CMFormatDescription?
    let formatStatus = CMAudioFormatDescriptionCreate(allocator: kCFAllocatorDefault, asbd: &asbd,
                                                     layoutSize: 0, layout: nil,
                                                     magicCookieSize: 0, magicCookie: nil,
                                                     extensions: nil, formatDescriptionOut: &formatDescription)
    guard formatStatus == noErr, formatDescription != nil else {
      // Dropping the block buffer runs FreeBlock above, freeing `raw`.
      blockBuffer = nil
      throw MediaEncodeFailure(.encodeFailed, "CMAudioFormatDescriptionCreate failed (\(formatStatus)).")
    }

    let timescale = Int32(spec.sampleRate)
    // One timing entry covers the whole buffer: its duration is a single
    // sample (one PCM frame), per the CMSampleBufferCreateReady contract.
    var timing = CMSampleTimingInfo(
      duration: CMTime(value: 1, timescale: timescale),
      presentationTimeStamp: CMTime(value: Int64(startFrame), timescale: timescale),
      decodeTimeStamp: .invalid)
    var sampleBuffer: CMSampleBuffer?
    // Interleaved LPCM: every sample (one frame across all channels) is
    // spec.bytesPerFrame bytes.
    let status = CMSampleBufferCreateReady(
      allocator: kCFAllocatorDefault,
      dataBuffer: blockBuffer,
      formatDescription: formatDescription,
      sampleCount: frames,
      sampleTimingEntryCount: 1,
      sampleTimingArray: &timing,
      sampleSizeEntryCount: 1,
      sampleSizeArray: [spec.bytesPerFrame],
      sampleBufferOut: &sampleBuffer)
    guard status == noErr, sampleBuffer != nil else {
      blockBuffer = nil
      formatDescription = nil
      throw MediaEncodeFailure(.encodeFailed, "CMSampleBufferCreateReady failed (\(status)).")
    }
    return sampleBuffer!
  }
}
