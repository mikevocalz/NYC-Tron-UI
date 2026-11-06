// The frame size as shown, after the track's rotation.
import AVFoundation

extension AVAssetTrack {
  var displaySize: CGSize {
    let rect = CGRect(origin: .zero, size: naturalSize).applying(preferredTransform)
    return CGSize(width: abs(rect.width), height: abs(rect.height))
  }
}
