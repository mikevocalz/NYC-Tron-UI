// Duration plus the first video and audio track's format. Runs on the
// decoder queue, where the synchronous loading calls are allowed to block.
import AVFoundation

extension AVURLAsset {
  func probeRecord() throws -> MediaProbeRecord {
    let duration = try durationUs()
    let video = tracks(withMediaType: .video).first
    let audio = tracks(withMediaType: .audio).first
    guard video != nil || audio != nil else {
      throw MediaDecodeFailure(.unsupportedFormat, "No audio or video track this device can read")
    }
    let size = video?.displaySize ?? .zero
    let videoFormat = video?.formatDescriptions.first.map { $0 as! CMFormatDescription }
    let audioFormat = audio?.formatDescriptions.first.map { $0 as! CMAudioFormatDescription }
    let stream = audioFormat.flatMap { CMAudioFormatDescriptionGetStreamBasicDescription($0)?.pointee }
    return MediaProbeRecord(
      durationUs: Double(duration),
      hasVideo: video != nil,
      width: Double(size.width),
      height: Double(size.height),
      frameRate: Double(video?.nominalFrameRate ?? 0),
      videoCodec: videoFormat?.codecString ?? "",
      hasAudio: stream != nil,
      sampleRate: stream?.mSampleRate ?? 0,
      channels: Double(stream?.mChannelsPerFrame ?? 0),
      audioCodec: audioFormat?.codecString ?? "")
  }

  /// Exact duration in microseconds.
  /// - Throws: "unsupported-format" when the container reports none.
  func durationUs() throws -> Int64 {
    let time = duration
    guard time.isNumeric, time >= .zero else {
      throw MediaDecodeFailure(.unsupportedFormat, "The container reports no duration")
    }
    return time.microseconds
  }
}
