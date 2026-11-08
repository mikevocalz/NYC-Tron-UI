// The Exception JS receives. The code is also the message prefix, so JS can
// read it whichever field the bridge keeps (toSpeechError in recognizer.ts).
import ExpoModulesCore

extension SpeechFailure {
  var exception: Exception {
    Exception(name: "SpeechError", description: "[\(code.rawValue)] \(message)", code: code.rawValue)
  }
}
