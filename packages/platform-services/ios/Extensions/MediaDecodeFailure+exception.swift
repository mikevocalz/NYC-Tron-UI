// The Exception JS receives. The code is also the message prefix, so JS can
// read it whichever field the bridge keeps (toMediaDecodeError in decoder.ts).
import ExpoModulesCore

extension MediaDecodeFailure {
  var exception: Exception {
    Exception(name: "MediaDecodeError", description: "[\(code.rawValue)] \(message)", code: code.rawValue)
  }
}
