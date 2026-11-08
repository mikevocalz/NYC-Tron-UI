// A raw video source as JS sends it: a file of tightly packed RGBA8 frames
// at a rational frame rate.
import ExpoModulesCore

@Record
struct EncodeVideoRecord {
  var uri: String
  var width: Double
  var height: Double
  var pixelFormat: String
  var frameRateNum: Double
  var frameRateDen: Double
  var frameCount: Double
}
