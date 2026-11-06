// The frame at an exact media time. Zero tolerances make the generator
// decode forward from the previous sync sample to the requested time instead
// of returning the nearest keyframe; actualTime is the frame it landed on.
import AVFoundation
import UIKit

extension AVURLAsset {
  func decodedFrame(_ request: FrameRequest) throws -> DecodedFrameRecord {
    let duration = try durationUs()
    guard let track = tracks(withMediaType: .video).first else {
      throw MediaDecodeFailure(.unsupportedFormat, "This media has no video track")
    }
    guard request.timeUs < duration else {
      throw MediaDecodeFailure(.outOfRange, "timeUs \(request.timeUs) is at or past the end (\(duration))")
    }
    let generator = AVAssetImageGenerator(asset: self)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    generator.maximumSize = CGSize(width: request.maxWidth, height: request.maxHeight)
    var actual = CMTime.zero
    let image: CGImage
    do {
      image = try generator.copyCGImage(at: CMTime(microseconds: request.timeUs), actualTime: &actual)
    } catch {
      throw MediaDecodeFailure(avError: error)
    }
    guard let jpeg = UIImage(cgImage: image).jpegData(compressionQuality: 0.9) else {
      throw MediaDecodeFailure(.decodeFailed, "Could not encode the \(track.displaySize) frame as JPEG")
    }
    let file = try MediaOutputDirectory.newFile(pathExtension: "jpg")
    do {
      try jpeg.write(to: file, options: .atomic)
      try MediaOutputDirectory.trim(keeping: file)
    } catch {
      throw MediaDecodeFailure(.permission, "Cannot write the frame: \(error.localizedDescription)")
    }
    return DecodedFrameRecord(
      uri: file.absoluteString,
      actualTimeUs: Double(actual.isNumeric ? actual.microseconds : request.timeUs),
      width: Double(image.width),
      height: Double(image.height))
  }
}
