// Where encoded MP4s go: Caches/nyctron-encoder. The OS may purge it under
// storage pressure; clearCache empties it on request.
import Foundation

enum MediaEncoderOutputDirectory {
  static var url: URL {
    FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("nyctron-encoder", isDirectory: true)
  }

  /// A new, unused .mp4 URL, creating the directory when needed.
  static func newFile() throws -> URL {
    do {
      try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
    } catch {
      throw MediaEncodeFailure(.permission, "Cannot create the encoder cache: \(error.localizedDescription)")
    }
    return url.appendingPathComponent(UUID().uuidString).appendingPathExtension("mp4")
  }

  /// Called on the encoder owner queue after a completed write. Old URIs may be evicted.
  static func trim(keeping current: URL) throws {
    let manager = FileManager.default
    let files = try manager.contentsOfDirectory(at: url, includingPropertiesForKeys: [.fileSizeKey, .contentModificationDateKey])
    let entries = try files.map { file in (file, try file.resourceValues(forKeys: [.fileSizeKey, .contentModificationDateKey])) }
    var total = entries.reduce(0) { $0 + ($1.1.fileSize ?? 0) }
    for entry in entries.sorted(by: { ($0.1.contentModificationDate ?? .distantPast) < ($1.1.contentModificationDate ?? .distantPast) }) where entry.0 != current {
      if total <= 256 * 1024 * 1024 { break }
      try manager.removeItem(at: entry.0)
      total -= entry.1.fileSize ?? 0
    }
  }

  static func clear() throws {
    guard FileManager.default.fileExists(atPath: url.path) else { return }
    do {
      try FileManager.default.removeItem(at: url)
    } catch {
      throw MediaEncodeFailure(.permission, "Cannot clear the encoder cache: \(error.localizedDescription)")
    }
  }
}
