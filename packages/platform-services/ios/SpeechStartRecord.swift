// Start options as JS sends them. `locale` is "" for the platform default;
// `onDeviceOnly` maps to SFSpeechRecognitionRequest.requiresOnDeviceRecognition.
import ExpoModulesCore

@Record
struct SpeechStartRecord {
  var locale: String = ""
  var onDeviceOnly: Bool = true
  var hints: [String] = []
}
