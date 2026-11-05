// The open-in-place files this app is reading right now. Each URL's
// security scope is started once and stopped once; a release without a
// start does nothing. Main actor only.
import Foundation

@MainActor
final class SecurityScopedAccess {
  static let shared = SecurityScopedAccess()

  private var active: [String: URL] = [:]

  /// Starts access; false when the system refused it.
  func start(_ url: URL) -> Bool {
    if active[url.absoluteString] != nil { return true }
    guard url.startAccessingSecurityScopedResource() else { return false }
    active[url.absoluteString] = url
    return true
  }

  func release(_ uri: String) {
    active.removeValue(forKey: uri)?.stopAccessingSecurityScopedResource()
  }

  func releaseAll() {
    active.values.forEach { $0.stopAccessingSecurityScopedResource() }
    active = [:]
  }
}
