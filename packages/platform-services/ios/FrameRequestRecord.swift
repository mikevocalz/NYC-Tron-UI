// A decodeFrame request as JS sends it: media time in microseconds and the
// box the frame is scaled down to fit. JS fills the defaults.
import ExpoModulesCore

@Record
struct FrameRequestRecord {
  var timeUs: Double
  var maxWidth: Double
  var maxHeight: Double
}
