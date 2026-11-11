// A span of the first audio track as interleaved Float32 PCM, streamed to a
// file through bounded source/converter buffers so a full minute never sits in
// memory. Explicit converter EOF preserves the resampler's real filter tail.
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
    guard source.mSampleRate.isFinite, source.mSampleRate > 0,
      let sourceFormat = AVAudioFormat(commonFormat: .pcmFormatFloat32,
        sampleRate: source.mSampleRate, channels: AVAudioChannelCount(channels), interleaved: true),
      let destinationFormat = AVAudioFormat(commonFormat: .pcmFormatFloat32,
        sampleRate: sampleRate, channels: AVAudioChannelCount(channels), interleaved: true),
      let converter = AVAudioConverter(from: sourceFormat, to: destinationFormat),
      let converted = AVAudioPCMBuffer(pcmFormat: destinationFormat, frameCapacity: 4096)
    else { throw MediaDecodeFailure(.unsupportedFormat, "This audio cannot be converted to Float32 PCM") }
    // Normal priming keeps output frame zero aligned with input frame zero.
    // AVAudioConverter supplies its filter boundary treatment at endOfStream;
    // the application never appends silent or duplicated output samples.
    converter.primeMethod = .normal
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
      AVSampleRateKey: source.mSampleRate,
      AVNumberOfChannelsKey: channels,
    ])
    output.alwaysCopiesSampleData = false
    guard reader.canAdd(output) else {
      throw MediaDecodeFailure(.unsupportedFormat, "This audio cannot be converted to Float32 PCM")
    }
    reader.add(output)
    // Decode native-rate preroll, then convert and trim on that PCM timeline.
    // A reader that also resamples cannot be explicitly drained at EOF.
    let readStart = max(Int64(0), request.startUs - 1_000_000)
    let readEnd = min(duration, request.startUs + request.durationUs + 100_000)
    reader.timeRange = CMTimeRange(start: CMTime(microseconds: readStart), duration: CMTime(microseconds: readEnd - readStart))
    guard reader.startReading() else {
      throw MediaDecodeFailure(avError: reader.error ?? MediaDecodeFailure(.decodeFailed, "The reader did not start"))
    }
    defer { reader.cancelReading() }
    let input = try MediaPcmInput(reader: reader, output: output, format: sourceFormat)

    let file = try MediaOutputDirectory.newFile(pathExtension: "f32")
    guard FileManager.default.createFile(atPath: file.path, contents: nil),
      let handle = try? FileHandle(forWritingTo: file)
    else {
      throw MediaDecodeFailure(.permission, "Cannot create the PCM file")
    }
    var complete = false
    defer { try? handle.close(); if !complete { try? FileManager.default.removeItem(at: file) } }
    let bytesPerFrame = 4 * channels
    // A compressed packet may straddle the reader's timeRange. Bound copied
    // PCM too, so encoder padding cannot extend the declared media timeline.
    let outputDurationUs = min(request.durationUs, duration - request.startUs)
    let maxFrames = Int((Double(outputDurationUs) * sampleRate / 1_000_000).rounded(.up))
    var frames = 0, convertedFrames = 0
    conversion: while frames < maxFrames {
      var conversionError: NSError?, inputError: Error?
      let suppliedBefore = input.suppliedFrames
      converted.frameLength = 0
      // Sample-rate conversion requires the callback API, including an explicit
      // EOF: https://developer.apple.com/documentation/technotes/tn3136-avaudioconverter-performing-sample-rate-conversions
      let status = converter.convert(to: converted, error: &conversionError) { requested, state in
        do {
          if let buffer = try input.next(requested) {
            state.pointee = .haveData
            return buffer
          }
        } catch { inputError = error }
        state.pointee = .endOfStream
        return nil
      }
      if let inputError { throw inputError }
      if status == .error {
        if let conversionError { throw MediaDecodeFailure(avError: conversionError) }
        throw MediaDecodeFailure(.decodeFailed, "PCM conversion failed")
      }
      let available = Int(converted.frameLength)
      if available > 0 {
        guard let origin = input.firstTime, let samples = converted.floatChannelData?[0] else {
          throw MediaDecodeFailure(.decodeFailed, "Converted PCM contains no source timeline")
        }
        let start = Double(request.startUs) / 1_000_000
        if origin - start > 1.5 / source.mSampleRate {
          throw MediaDecodeFailure(.unsupportedFormat, "Audio starts after the requested interval")
        }
        let firstFrame = max(0, Int(((start - origin) * sampleRate).rounded()))
        let offset = max(0, firstFrame - convertedFrames)
        let take = min(max(0, available - offset), maxFrames - frames)
        if take > 0 {
          let bytes = Data(bytes: samples.advanced(by: offset * channels), count: take * bytesPerFrame)
          do { try handle.write(contentsOf: bytes) }
          catch { throw MediaDecodeFailure(.permission, "Cannot write PCM: \(error.localizedDescription)") }
          frames += take
        }
        convertedFrames += available
      }
      // An endOfStream result can still contain the final converted frames.
      // Consume them before ending; do not truncate or synthesize filter output.
      switch status {
      case .endOfStream: break conversion
      case .haveData, .inputRanDry:
        if available == 0 && input.suppliedFrames == suppliedBefore {
          throw MediaDecodeFailure(.decodeFailed, "PCM conversion stopped making progress")
        }
      case .error: break conversion // Handled before touching output above.
      @unknown default: throw MediaDecodeFailure(.decodeFailed, "Unknown PCM conversion status")
      }
    }
    if reader.status == .failed {
      throw MediaDecodeFailure(avError: reader.error ?? MediaDecodeFailure(.decodeFailed, "The reader failed"))
    }
    guard frames > 0 else { throw MediaDecodeFailure(.outOfRange, "No audio samples exist at this media time") }
    try handle.close()
    try MediaOutputDirectory.trim(keeping: file)
    complete = true
    return DecodedAudioRecord(uri: file.absoluteString, sampleRate: sampleRate, channels: Double(channels), frames: Double(frames))
  }
}
