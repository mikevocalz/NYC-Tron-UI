// The Exception JS receives. The code is also the message prefix, so JS can
// read it whichever field the bridge keeps (toMediaEncodeError in encoder.ts).
import ExpoModulesCore

extension MediaEncodeFailure {
  var exception: Exception {
    Exception(name: "MediaEncodeError", description: "[\(code.rawValue)] \(message)", code: code.rawValue)
  }
}
