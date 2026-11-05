// One presentation of UIDocumentPickerViewController, bridged to async. The
// continuation resumes exactly once: with the picked URLs, or with [] when
// the person cancels. Main actor only, like the picker itself.
import UIKit
import UniformTypeIdentifiers

@MainActor
final class DocumentPickerSession: NSObject, UIDocumentPickerDelegate {
  private var continuation: CheckedContinuation<[URL], Never>?
  // The picker holds its delegate weakly; the session keeps itself alive until it finishes.
  private var retainedSelf: DocumentPickerSession?

  func present(types: [UTType], asCopy: Bool, multiple: Bool, from host: UIViewController) async -> [URL] {
    await withCheckedContinuation { continuation in
      self.continuation = continuation
      self.retainedSelf = self
      let picker = UIDocumentPickerViewController(forOpeningContentTypes: types, asCopy: asCopy)
      picker.allowsMultipleSelection = multiple
      picker.delegate = self
      host.present(picker, animated: true)
    }
  }

  nonisolated func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    MainActor.assumeIsolated { finish(urls) }
  }

  nonisolated func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
    MainActor.assumeIsolated { finish([]) }
  }

  private func finish(_ urls: [URL]) {
    continuation?.resume(returning: urls)
    continuation = nil
    retainedSelf = nil
  }
}
