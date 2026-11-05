// iOS side of @nyc-tron/platform-services/documents (N-12).
//
// - pick: UIDocumentPickerViewController. "import" copies the file into the
//   app's sandbox; "open-in-place" returns the original with its security
//   scope started and a bookmark that reopens it in a later launch.
// - restoreAccess: a bookmark back to a URL, scope started, refreshed when stale.
// - releaseAccess: stops a scope once the app is done with the file.
// - share: UIActivityViewController for files and text.
// Presentation and scope bookkeeping happen on the main actor.
import ExpoModulesCore
import UIKit

@ExpoModule("NYCTronDocuments")
public final class NYCTronDocumentsModule: Module {
  /// [] when the person cancels or there is no window to present from.
  @JS
  @MainActor
  func pick(_ options: PickOptionsRecord) async -> [PickedDocumentRecord] {
    guard let host = UIViewController.topPresented else { return [] }
    let inPlace = options.opensInPlace
    let urls = await DocumentPickerSession().present(
      types: options.contentTypes, asCopy: !inPlace, multiple: options.multiple, from: host)
    return urls.compactMap { url in
      guard inPlace else { return url.pickedDocumentRecord(bookmark: nil) }
      // A file whose scope cannot start is unreadable; leave it out rather than hand JS a dead URI.
      guard SecurityScopedAccess.shared.start(url) else { return nil }
      return url.pickedDocumentRecord(bookmark: url.bookmarkString)
    }
  }

  /// Nil when the bookmark no longer resolves (file deleted, volume gone).
  @JS
  @MainActor
  func restoreAccess(_ bookmark: String) async -> RestoredAccessRecord? {
    guard let data = Data(base64Encoded: bookmark) else { return nil }
    var stale = false
    guard let url = try? URL(resolvingBookmarkData: data, options: [], relativeTo: nil, bookmarkDataIsStale: &stale),
      SecurityScopedAccess.shared.start(url)
    else { return nil }
    let current = stale ? (url.bookmarkString ?? bookmark) : bookmark
    return RestoredAccessRecord(uri: url.absoluteString, bookmark: current, stale: stale)
  }

  @JS
  @MainActor
  func releaseAccess(_ uri: String) async {
    SecurityScopedAccess.shared.release(uri)
  }

  /// True when the person completed a share; false when they dismissed the sheet.
  @JS
  @MainActor
  func share(_ options: ShareOptionsRecord) async -> Bool {
    guard let host = UIViewController.topPresented else { return false }
    var items: [Any] = options.uris.compactMap(URL.init(string:))
    if let text = options.text {
      items.append(text)
    }
    guard !items.isEmpty else { return false }
    return await ShareSession().present(items: items, title: options.title, from: host)
  }

  public override func willDestroy() {
    DispatchQueue.main.async { SecurityScopedAccess.shared.releaseAll() }
  }
}
