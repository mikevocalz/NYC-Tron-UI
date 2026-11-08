// One speech session event as JS receives it. Flat on purpose: JS reads it
// into SpeechSessionEvent (toSpeechSessionEvent in src/speech/recognizer.ts)
// and ignores the fields a kind does not use. Empty strings mean absent.
import ExpoModulesCore

@Record
struct SpeechEventRecord {
  var session: String
  var kind: String
  /// partial/final transcript text.
  var text: String = ""
  /// final only: JSON array of {text,startS,endS}; empty when the platform has no word timings.
  var wordsJson: String = ""
  /// end only: "finished" | "stopped" | "aborted" | "no-speech" | "ended".
  var reason: String = ""
  /// error only: the JS SpeechErrorCode.
  var code: String = ""
  var message: String = ""
}
