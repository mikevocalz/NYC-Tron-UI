// A decode failure with the JS error code it maps to. The module turns it
// into an ExpoModulesCore Exception at the bridge.
struct MediaDecodeFailure: Error {
  enum Code: String {
    case notFound = "not-found"
    case unsupportedFormat = "unsupported-format"
    case decodeFailed = "decode-failed"
    case outOfRange = "out-of-range"
    case permission = "permission"
  }

  let code: Code
  let message: String

  init(_ code: Code, _ message: String) {
    self.code = code
    self.message = message
  }
}
