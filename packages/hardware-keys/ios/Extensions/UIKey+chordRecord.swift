// A pressed UIKey as the chord JS receives. Named keys come from the HID
// usage; everything else from charactersIgnoringModifiers, which keeps the
// Shift result ("!" for Shift+1) the way a browser's KeyboardEvent.key does.
import UIKit

extension UIKey {
  /// nil for a lone modifier or a key that produces no character.
  func chordRecord(recording: Bool) -> KeyChordRecord? {
    let name = keyCode.keyName ?? charactersIgnoringModifiers
    guard !name.isEmpty else { return nil }
    return KeyChordRecord(
      key: name,
      ctrlKey: modifierFlags.contains(.control),
      metaKey: modifierFlags.contains(.command),
      altKey: modifierFlags.contains(.alternate),
      shiftKey: modifierFlags.contains(.shift),
      isRepeat: false,
      recording: recording)
  }
}
