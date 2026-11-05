// One presentation of the share sheet, bridged to async. Resolves true when
// the person completed an activity, false when they dismissed the sheet.
// On iPad the sheet is a popover anchored at the host view's center.
import UIKit

@MainActor
final class ShareSession {
  func present(items: [Any], title: String?, from host: UIViewController) async -> Bool {
    await withCheckedContinuation { continuation in
      let sheet = UIActivityViewController(activityItems: items, applicationActivities: nil)
      if let title {
        sheet.title = title
      }
      sheet.completionWithItemsHandler = { _, completed, _, _ in
        continuation.resume(returning: completed)
      }
      if let popover = sheet.popoverPresentationController {
        popover.sourceView = host.view
        popover.sourceRect = CGRect(x: host.view.bounds.midX, y: host.view.bounds.midY, width: 0, height: 0)
        popover.permittedArrowDirections = []
      }
      host.present(sheet, animated: true)
    }
  }
}
