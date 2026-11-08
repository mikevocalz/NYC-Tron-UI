// A raw encode source checked before AVFoundation reads it, so a missing,
// unreadable or wrongly sized file reports "not-found", "permission" or
// "encode-failed" instead of a generic writer error.
import Foundation

struct EncoderMediaSource {
  let url: URL

  init(uri: String) throws {
    guard let url = URL(string: uri), url.scheme != nil else {
      throw MediaEncodeFailure(.notFound, "Not a URL: \(uri)")
    }
    self.url = url
  }

  /// The file must exist, be readable, and be exactly `expectedBytes` long.
  func requireSize(_ expectedBytes: Int64) throws -> FileHandle {
    if url.isFileURL {
      let path = url.path
      guard FileManager.default.fileExists(atPath: path) else {
        throw MediaEncodeFailure(.notFound, "No file at \(path)")
      }
      guard FileManager.default.isReadableFile(atPath: path) else {
        throw MediaEncodeFailure(.permission, "The app cannot read \(path)")
      }
      let size = (try? FileManager.default.attributesOfItem(atPath: path)[.size] as? NSNumber)?.int64Value
      guard size == expectedBytes else {
        throw MediaEncodeFailure(.encodeFailed, "The raw source is \(size ?? -1) bytes, expected \(expectedBytes).")
      }
      guard let handle = try? FileHandle(forReadingFrom: url) else {
        throw MediaEncodeFailure(.permission, "The app cannot open \(path)")
      }
      return handle
    }
    // Remote sources are not supported by the native encoder: the host must
    // hand it a local file it wrote.
    throw MediaEncodeFailure(.unsupportedFormat, "The native encoder needs a local file URL.")
  }
}
