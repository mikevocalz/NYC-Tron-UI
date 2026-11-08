// A finished encode: the MP4 file URI, its MIME type, byte length and the
// longest track duration in microseconds.
import ExpoModulesCore

@Record
struct EncodedMediaRecord {
  var uri: String
  var mimeType: String
  var byteLength: Double
  var durationUs: Double
}
