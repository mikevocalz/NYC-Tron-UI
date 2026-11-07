import AVFoundation
import CoreMedia

extension AVURLAsset {
  /// Enumerates compressed samples without synthesizing a nominal-FPS timeline.
  func presentationIndex(maxFrames: Double) throws -> PresentationIndexRecord {
    guard url.isFileURL else {
      throw MediaDecodeFailure(.unsupportedFormat, "A local file is required for a presentation index.")
    }
    guard maxFrames.isFinite, maxFrames.rounded() == maxFrames, maxFrames >= 1, maxFrames <= 200_000 else {
      throw MediaDecodeFailure(.outOfRange, "maxFrames must be an integer from 1 to 200000.")
    }
    func micros(_ time: CMTime) throws -> Int64 {
      let scaled = CMTimeConvertScale(time, timescale: 1_000_000, method: .roundHalfAwayFromZero)
      guard time.isNumeric, time.epoch == 0, scaled.isNumeric, scaled.value >= 0,
            scaled.value <= 9_007_199_254_740_991 else {
        throw MediaDecodeFailure(.unsupportedFormat, "The video has an invalid presentation timeline.")
      }
      return scaled.value
    }
    let durationUs = try micros(duration)
    guard durationUs > 0, let track = tracks(withMediaType: .video).first else {
      throw MediaDecodeFailure(.unsupportedFormat, "A finite video timeline is required.")
    }
    let reader: AVAssetReader
    do { reader = try AVAssetReader(asset: self) }
    catch { throw MediaDecodeFailure(avError: error) }
    let output = AVAssetReaderTrackOutput(track: track, outputSettings: nil)
    output.alwaysCopiesSampleData = false
    guard reader.canAdd(output) else {
      throw MediaDecodeFailure(.unsupportedFormat, "The video track cannot be enumerated.")
    }
    reader.add(output)
    guard reader.startReading() else {
      throw MediaDecodeFailure(.decodeFailed, "The video index could not be opened.")
    }
    defer { reader.cancelReading() }
    let deadline = ProcessInfo.processInfo.systemUptime + 30
    var times: [Int64] = []
    var visited = 0
    while true {
      guard ProcessInfo.processInfo.systemUptime <= deadline else {
        throw MediaDecodeFailure(.decodeFailed, "Video indexing exceeded its time budget.")
      }
      guard let sample = output.copyNextSampleBuffer() else { break }
      visited += 1
      guard visited <= Int(maxFrames) * 2 + 256 else {
        throw MediaDecodeFailure(.outOfRange, "The video exceeds the index sample budget.")
      }
      let count = CMSampleBufferGetNumSamples(sample)
      if count == 0 { continue } // AVAssetReader marker-only buffers carry no media sample.
      guard count == 1, CMSampleBufferGetTotalSampleSize(sample) <= 32 * 1024 * 1024 else {
        throw MediaDecodeFailure(.unsupportedFormat, "The video uses unsupported sample aggregation or size.")
      }
      if let attachments = CMSampleBufferGetSampleAttachmentsArray(sample, createIfNecessary: false) as? [[String: Any]],
         attachments.contains(where: { ($0[kCMSampleAttachmentKey_DoNotDisplay as String] as? Bool) == true }) {
        throw MediaDecodeFailure(.unsupportedFormat, "The video contains nondisplay samples.")
      }
      let time = try micros(CMSampleBufferGetPresentationTimeStamp(sample))
      guard time < durationUs else {
        throw MediaDecodeFailure(.unsupportedFormat, "A presentation timestamp lies outside the video duration.")
      }
      guard times.count < Int(maxFrames) else {
        throw MediaDecodeFailure(.outOfRange, "The complete video index exceeds maxFrames.")
      }
      times.append(time)
    }
    guard reader.status == .completed, !times.isEmpty else {
      throw MediaDecodeFailure(.decodeFailed, "The complete video index could not be read.")
    }
    times.sort() // Compressed samples are emitted in decode order, including B frames.
    for index in times.indices.dropFirst() where times[index] <= times[index - 1] {
      throw MediaDecodeFailure(.unsupportedFormat, "The video has duplicate presentation timestamps at microsecond precision.")
    }
    return PresentationIndexRecord(durationUs: Double(durationUs), timesUs: times.map { Double($0) })
  }
}
