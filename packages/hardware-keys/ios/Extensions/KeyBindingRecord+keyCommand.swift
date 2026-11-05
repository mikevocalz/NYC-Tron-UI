// A registered binding as a UIKeyCommand. The portable binding string rides
// in propertyList so the router can map the fired command back to it.
import UIKit

extension KeyBindingRecord {
  /// nil for a key UIKeyCommand has no input for (Insert).
  @MainActor
  func keyCommand(action: Selector) -> UIKeyCommand? {
    guard let input = keyCommandInput else { return nil }
    let command = UIKeyCommand(
      title: title, image: nil, action: action, input: input,
      modifierFlags: modifierFlags, propertyList: binding)
    // Text editing chords (Mod+C, Mod+Z) stay with a focused field.
    command.wantsPriorityOverSystemBehavior = overridesSystem
    return command
  }

  /// The chord JS receives when this binding fires. Apple keyboards: Mod is Command.
  func chordRecord() -> KeyChordRecord {
    KeyChordRecord(
      key: key, ctrlKey: ctrl, metaKey: mod, altKey: alt, shiftKey: shift,
      isRepeat: false, recording: false)
  }

  private var modifierFlags: UIKeyModifierFlags {
    var flags: UIKeyModifierFlags = []
    if mod { flags.insert(.command) }
    if ctrl { flags.insert(.control) }
    if alt { flags.insert(.alternate) }
    if shift { flags.insert(.shift) }
    return flags
  }

  private var keyCommandInput: String? {
    switch key {
    case "Space": return " "
    case "Enter": return "\r"
    case "Tab": return "\t"
    case "Backspace": return "\u{8}"
    case "Escape": return UIKeyCommand.inputEscape
    case "Delete": return UIKeyCommand.inputDelete
    case "ArrowUp": return UIKeyCommand.inputUpArrow
    case "ArrowDown": return UIKeyCommand.inputDownArrow
    case "ArrowLeft": return UIKeyCommand.inputLeftArrow
    case "ArrowRight": return UIKeyCommand.inputRightArrow
    case "Home": return UIKeyCommand.inputHome
    case "End": return UIKeyCommand.inputEnd
    case "PageUp": return UIKeyCommand.inputPageUp
    case "PageDown": return UIKeyCommand.inputPageDown
    case "F1": return UIKeyCommand.f1
    case "F2": return UIKeyCommand.f2
    case "F3": return UIKeyCommand.f3
    case "F4": return UIKeyCommand.f4
    case "F5": return UIKeyCommand.f5
    case "F6": return UIKeyCommand.f6
    case "F7": return UIKeyCommand.f7
    case "F8": return UIKeyCommand.f8
    case "F9": return UIKeyCommand.f9
    case "F10": return UIKeyCommand.f10
    case "F11": return UIKeyCommand.f11
    case "F12": return UIKeyCommand.f12
    case "Insert": return nil
    default:
      // Canonical keys are uppercase letters; UIKeyCommand matches the
      // unshifted character and takes Shift from the flags.
      return key.count == 1 ? key.lowercased() : nil
    }
  }
}
