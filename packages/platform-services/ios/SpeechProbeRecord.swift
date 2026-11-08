// What this build's recognizer reports. `networkPossible` is always true on
// iOS: requiresOnDeviceRecognition=false enables server recognition, which is
// why the JS consent gate exists.
import ExpoModulesCore

@Record
struct SpeechProbeRecord {
  var available: Bool
  var onDevice: Bool
  var networkPossible: Bool
}
