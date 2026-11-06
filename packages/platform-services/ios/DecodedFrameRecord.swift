// A decoded frame: a JPEG file URI and the presentation time of the frame
// that was actually decoded.
import ExpoModulesCore

@Record
struct DecodedFrameRecord {
  var uri: String
  var actualTimeUs: Double
  var width: Double
  var height: Double
}
