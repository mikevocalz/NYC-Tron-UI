// A span of the first audio track as interleaved Float32 PCM, streamed to a
// file one sample buffer at a time so a full minute never sits in memory.
import AVFoundation

extension AVURLAsset {
  func decodedAudio(_ request: AudioRequest) throws -> DecodedAudioRecord {
    let duration = try durationUs()
    guard let track = tracks(withMediaType: .audio).first,
      let format = track.formatDescriptions.first.map({ $0 as! CMAudioFormatDescription }),
      let source = CMAudioFormatDescriptionGetStreamBasicDescription(format)?.pointee
    else {
      throw MediaDecodeFailure(.unsupportedFormat, "This media has no audio track")
    }
    guard request.startUs < duration else {
      throw MediaDecodeFailure(.outOfRange, "startUs \(request.startUs) is at or past the end (\(duration))")
    }
    let sampleRate = request.sampleRate > 0 ? request.sampleRate : source.mSampleRate
    let channels = Int(max(1, source.mChannelsPerFrame))
    guard sampleRate.isFinite, sampleRate >= 8000, sampleRate <= 192000, channels <= 32, Double(request.durationUs) * sampleRate / 1_000_000 * Double(channels) * 4 <= 256 * 1024 * 1024 else { throw MediaDecodeFailure(.outOfRange, "The PCM request exceeds the channel or 256 MiB limit") }
    let reader: AVAssetReader
    do {
      reader = try AVAssetReader(asset: self)
    } catch {
      throw MediaDecodeFailure(avError: error)
    }
    let output = AVAssetReaderTrackOutput(track: track, outputSettings: [
      AVFormatIDKey: kAudioFormatLinearPCM,
      AVLinearPCMIsFloatKey: true,
      AVLinearPCMBitDepthKey: 32,
      AVLinearPCMIsNonInterleaved: false,
      AVLinearPCMIsBigEndianKey: false,
      AVSampleRateKey: sampleRate,
      AVNumberOfChannelsKey: channels,
    ])
    output.alwaysCopiesSampleData = false
    guard reader.canAdd(output) else {
      throw MediaDecodeFailure(.unsupportedFormat, "This audio cannot be converted to Float32 PCM")
    }
    reader.add(output)
    reader.timeRange = CMTimeRange(start: CMTime(microseconds: request.startUs), duration: CMTime(microseconds: request.durationUs))
    guard reader.startReading() else {
      throw MediaDecodeFailure(avError: reader.error ?? MediaDecodeFailure(.decodeFailed, "The reader did not start"))
    }
    defer { reader.cancelReading() }

    let file = try MediaOutputDirectory.newFile(pathExtension: "f32")
    guard FileManager.default.createFile(atPath: file.path, contents: nil),
      let handle = try? FileHandle(forWritingTo: file)
    else {
      throw MediaDecodeFailure(.permission, "Cannot create the PCM file")
    }
    var complete = false
    defer { try? handle.close(); if !complete { try? FileManager.default.removeItem(at: file) } }
    let bytesPerFrame = 4 * channels
    let maxFrames = Int((Double(request.durationUs) * sampleRate / 1_000_000).rounded(.up))
    var frames = 0
    while frames < maxFrames, let buffer = output.copyNextSampleBuffer() {
      guard let block = CMSampleBufferGetDataBuffer(buffer) else { continue }
      let available = CMBlockBufferGetDataLength(block) / bytesPerFrame
      let take = min(available, maxFrames - frames)
      guard take > 0 else { continue }
      var bytes = Data(count: take * bytesPerFrame)
      let status = bytes.withUnsafeMutableBytes { raw in
        CMBlockBufferCopyDataBytes(block, atOffset: 0, dataLength: raw.count, destination: raw.baseAddress!)
      }
      guard status == kCMBlockBufferNoErr else {
        throw MediaDecodeFailure(.decodeFailed, "Could not read a PCM buffer (\(status))")
      }
      do {
        try handle.write(contentsOf: bytes)
      } catch {
        throw MediaDecodeFailure(.permission, "Cannot write PCM: \(error.localizedDescription)")
      }
      frames += take
    }
    if reader.status == .failed {
      throw MediaDecodeFailure(avError: reader.error ?? MediaDecodeFailure(.decodeFailed, "The reader failed"))
    }
    try handle.close()
    try MediaOutputDirectory.trim(keeping: file)
    complete = true
    return DecodedAudioRecord(uri: file.absoluteString, sampleRate: sampleRate, channels: Double(channels), frames: Double(frames))
  }
}
