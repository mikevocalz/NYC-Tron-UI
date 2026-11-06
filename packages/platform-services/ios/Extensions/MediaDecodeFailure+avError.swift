// Maps an AVFoundation error to the JS code: formats and codecs the device
// cannot handle are "unsupported-format", missing files "not-found",
// sandbox refusals "permission", the rest "decode-failed".
import AVFoundation

extension MediaDecodeFailure {
  init(avError error: Error) {
    let nsError = error as NSError
    let message = nsError.localizedDescription
    if nsError.domain == NSCocoaErrorDomain {
      switch nsError.code {
      case NSFileReadNoSuchFileError, NSFileNoSuchFileError: self.init(.notFound, message)
      case NSFileReadNoPermissionError: self.init(.permission, message)
      default: self.init(.decodeFailed, message)
      }
      return
    }
    guard nsError.domain == AVFoundationErrorDomain else {
      self.init(.decodeFailed, message)
      return
    }
    switch AVError.Code(rawValue: nsError.code) {
    case .fileFormatNotRecognized, .decoderNotFound, .formatUnsupported, .contentIsUnavailable:
      self.init(.unsupportedFormat, message)
    case .noLongerPlayable:
      self.init(.notFound, message)
    case .contentIsProtected, .applicationIsNotAuthorized:
      self.init(.permission, message)
    default:
      self.init(.decodeFailed, message)
    }
  }
}
