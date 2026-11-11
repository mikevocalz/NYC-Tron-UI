import AVFoundation

extension AVURLAsset {
  /// The real image generator owner shared by ordinary and indexed frame decoding.
  func decodedImage(at time: CMTime, maximumSize: CGSize, requiredTimeUs: Int64? = nil) throws -> DecodedImageData {
    if requiredTimeUs != nil, (!time.isNumeric || time.epoch != 0) {
      throw MediaDecodeFailure(.decodeFailed, "The indexed frame has an invalid rational timestamp")
    }
    let generator = AVAssetImageGenerator(asset: self)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    generator.maximumSize = maximumSize
    var actual = CMTime.zero
    let image: CGImage
    do { image = try generator.copyCGImage(at: time, actualTime: &actual) }
    catch { throw MediaDecodeFailure(avError: error) }
    guard actual.isNumeric, actual.epoch == 0, actual.microseconds >= 0 else {
      throw MediaDecodeFailure(.decodeFailed, "The decoded frame has no valid presentation timestamp")
    }
    if let requiredTimeUs, (CMTimeCompare(actual, time) != 0 || actual.microseconds != requiredTimeUs) {
      throw MediaDecodeFailure(.decodeFailed, "The decoded frame does not match the indexed presentation time")
    }
    return DecodedImageData(image: image, presentationTime: actual)
  }
}
