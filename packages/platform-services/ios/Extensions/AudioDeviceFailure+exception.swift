// The Exception JS receives. The code is also the message prefix, so JS can
// read it whichever field the bridge keeps (toAudioDeviceError in device.ts).
import ExpoModulesCore

extension AudioDeviceFailure {
  var exception: Exception {
    Exception(name: "AudioDeviceError", description: "[\(code.rawValue)] \(message)", code: code.rawValue)
  }
}
