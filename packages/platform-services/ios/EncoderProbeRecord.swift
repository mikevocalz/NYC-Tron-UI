// What probe reports: container plus per-codec encode support. Flat on
// purpose; JS reads it into MediaEncoderProbe (toMediaEncoderProbe in
// src/encoder/encoder.ts).
import ExpoModulesCore

@Record
struct EncoderProbeRecord {
  var container: String
  var video: Bool
  var audio: Bool
}
