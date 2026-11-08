// A speech failure with the JS error code it maps to. The module turns it
// into an ExpoModulesCore Exception at the bridge.
struct SpeechFailure: Error {
  enum Code: String {
    case notFound = "not-found"
    case unsupportedFormat = "unsupported-format"
    case permission = "permission"
    case consentRequired = "consent-required"
    case recognitionFailed = "recognition-failed"
    case outOfRange = "out-of-range"
    case busy
    case cancelled = "cancelled"
  }

  let code: Code
  let message: String

  init(_ code: Code, _ message: String) {
    self.code = code
    self.message = message
  }
}
