// An audio device failure with the JS error code it maps to. The module
// turns it into an ExpoModulesCore Exception at the bridge.
struct AudioDeviceFailure: Error {
  enum Code: String {
    case deviceNotFound = "device-not-found"
    case unsupportedFormat = "unsupported-format"
    case busy = "busy"
    case permission = "permission"
    case outOfRange = "out-of-range"
    case cancelled = "cancelled"
    case deviceLost = "device-lost"
    case deviceError = "device-error"
  }

  let code: Code
  let message: String

  init(_ code: Code, _ message: String) {
    self.code = code
    self.message = message
  }
}
