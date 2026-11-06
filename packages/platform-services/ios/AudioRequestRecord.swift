// A decodeAudio request as JS sends it. `sampleRate` 0 keeps the file's rate.
import ExpoModulesCore

@Record
struct AudioRequestRecord {
  var startUs: Double
  var durationUs: Double
  var sampleRate: Double
}
