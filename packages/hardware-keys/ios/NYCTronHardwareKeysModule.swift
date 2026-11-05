// iOS side of @nyc-tron/hardware-keys.
//
// React Native delivers no hardware key events on iOS. Two UIKit paths cover
// what the kit needs:
// - Registered bindings become UIKeyCommands on the key window's root view
//   controller. That controller is in every responder chain React Native
//   builds, a presented Modal's included (a presented controller's next
//   responder is its presenter), and the commands show in the iPad
//   Command-key overlay under their titles.
// - Recording makes a hidden capture view first responder and reads UIPress
//   keys in pressesBegan, so any chord can be recorded, not only registered ones.
// HardwareKeyRouter owns all of that state on the main actor.
import ExpoModulesCore
import UIKit

@ExpoModule("NYCTronHardwareKeys")
public final class NYCTronHardwareKeysModule: Module {
  @Event("chord")
  var onChord: (KeyChordRecord) -> Void

  // UIKey needs iOS 13.4; the pod's deployment target is 16.4.
  @JS
  func isSupported() -> Bool {
    true
  }

  @JS
  @MainActor
  func setBindings(_ bindings: [KeyBindingRecord]) async {
    attachRouter()
    HardwareKeyRouter.shared.setBindings(bindings)
  }

  @JS
  @MainActor
  func setRecording(_ active: Bool) async {
    attachRouter()
    HardwareKeyRouter.shared.setRecording(active)
  }

  public override func willDestroy() {
    DispatchQueue.main.async { HardwareKeyRouter.shared.reset() }
  }

  @MainActor
  private func attachRouter() {
    HardwareKeyRouter.shared.emit = { [weak self] chord in self?.onChord(chord) }
  }
}
