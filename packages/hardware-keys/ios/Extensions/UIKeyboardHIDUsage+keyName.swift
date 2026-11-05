// The kit's canonical name for a non-character key, matching the names
// shortcut-model accepts ("ArrowUp", "Enter", "F5"). Modifier keys map to
// "" so a lone modifier never becomes a chord.
import UIKit

extension UIKeyboardHIDUsage {
  var keyName: String? {
    switch self {
    case .keyboardReturnOrEnter, .keypadEnter: return "Enter"
    case .keyboardEscape: return "Escape"
    case .keyboardTab: return "Tab"
    case .keyboardSpacebar: return "Space"
    case .keyboardDeleteOrBackspace: return "Backspace"
    case .keyboardDeleteForward: return "Delete"
    case .keyboardHome: return "Home"
    case .keyboardEnd: return "End"
    case .keyboardPageUp: return "PageUp"
    case .keyboardPageDown: return "PageDown"
    case .keyboardUpArrow: return "ArrowUp"
    case .keyboardDownArrow: return "ArrowDown"
    case .keyboardLeftArrow: return "ArrowLeft"
    case .keyboardRightArrow: return "ArrowRight"
    case .keyboardInsert: return "Insert"
    case .keyboardF1: return "F1"
    case .keyboardF2: return "F2"
    case .keyboardF3: return "F3"
    case .keyboardF4: return "F4"
    case .keyboardF5: return "F5"
    case .keyboardF6: return "F6"
    case .keyboardF7: return "F7"
    case .keyboardF8: return "F8"
    case .keyboardF9: return "F9"
    case .keyboardF10: return "F10"
    case .keyboardF11: return "F11"
    case .keyboardF12: return "F12"
    case .keyboardLeftShift, .keyboardRightShift, .keyboardLeftControl, .keyboardRightControl,
      .keyboardLeftAlt, .keyboardRightAlt, .keyboardLeftGUI, .keyboardRightGUI, .keyboardCapsLock:
      return ""
    default: return nil
    }
  }
}
