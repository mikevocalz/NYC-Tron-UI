// A hidden first responder that records keys. UIKit sends hardware key
// presses to the first responder, so while this view holds that role every
// keydown reaches onKey and nothing else in the app sees it.
import UIKit

final class HardwareKeyCaptureView: UIView {
  var onKey: ((UIKey) -> Void)?

  override var canBecomeFirstResponder: Bool {
    true
  }

  // Key presses are consumed here; anything else (a remote's buttons) keeps
  // the default path. All four press methods are overridden together, as
  // UIKit requires when pressesBegan does not call super.
  override func pressesBegan(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    let keys = presses.compactMap(\.key)
    keys.forEach { onKey?($0) }
    let others = presses.filter { $0.key == nil }
    if !others.isEmpty {
      super.pressesBegan(others, with: event)
    }
  }

  override func pressesEnded(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    let others = presses.filter { $0.key == nil }
    if !others.isEmpty {
      super.pressesEnded(others, with: event)
    }
  }

  override func pressesChanged(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    let others = presses.filter { $0.key == nil }
    if !others.isEmpty {
      super.pressesChanged(others, with: event)
    }
  }

  override func pressesCancelled(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    let others = presses.filter { $0.key == nil }
    if !others.isEmpty {
      super.pressesCancelled(others, with: event)
    }
  }
}
