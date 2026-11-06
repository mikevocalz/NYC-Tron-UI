// A media URI checked before AVFoundation opens it, so a missing or
// unreadable file reports "not-found" or "permission" instead of a generic
// decode failure.
import AVFoundation

struct MediaSource {
  let url: URL

  init(uri: String) throws {
    guard let url = URL(string: uri), url.scheme != nil else {
      throw MediaDecodeFailure(.notFound, "Not a URL: \(uri)")
    }
    self.url = url
  }

  func asset() throws -> AVURLAsset {
    if url.isFileURL {
      let path = url.path
      guard FileManager.default.fileExists(atPath: path) else {
        throw MediaDecodeFailure(.notFound, "No file at \(path)")
      }
      guard FileManager.default.isReadableFile(atPath: path) else {
        throw MediaDecodeFailure(.permission, "The app cannot read \(path)")
      }
    }
    return AVURLAsset(url: url, options: [AVURLAssetPreferPreciseDurationAndTimingKey: true])
  }
}
