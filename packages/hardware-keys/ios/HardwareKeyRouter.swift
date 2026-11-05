// Owns the UIKit side of hardware keys: the UIKeyCommands on the root view
// controller and the capture view used while recording. Main actor only, so
// no state here is shared across threads.
import UIKit

@MainActor
final class HardwareKeyRouter {
  static let shared = HardwareKeyRouter()

  /// Sends one chord to JS. Set by the module before every change.
  var emit: ((KeyChordRecord) -> Void)?

  private var bindings: [String: KeyBindingRecord] = [:]
  private var commands: [UIKeyCommand] = []
  private weak var host: UIViewController?
  private var captureView: HardwareKeyCaptureView?

  /// Replaces the registered bindings. The commands move to the current key
  /// window's root controller, which may have changed since the last call.
  func setBindings(_ records: [KeyBindingRecord]) {
    removeCommands()
    bindings = Dictionary(records.map { ($0.binding, $0) }, uniquingKeysWith: { first, _ in first })
    guard let root = UIWindow.keyRootViewController else { return }
    let action = #selector(UIViewController.nyctronHardwareKeyCommand(_:))
    commands = records.compactMap { $0.keyCommand(action: action) }
    commands.forEach(root.addKeyCommand)
    host = root
  }

  /// Starts or stops recording. While recording, the capture view is first
  /// responder and every keydown goes to JS with `recording: true`.
  func setRecording(_ active: Bool) {
    if active {
      startRecording()
    } else {
      stopRecording()
    }
  }

  /// A registered UIKeyCommand fired.
  func handle(_ command: UIKeyCommand) {
    guard let binding = command.propertyList as? String, let record = bindings[binding] else { return }
    emit?(record.chordRecord())
  }

  func reset() {
    stopRecording()
    removeCommands()
    bindings = [:]
    emit = nil
  }

  private func startRecording() {
    guard captureView == nil, let window = UIWindow.keyRootViewController?.view.window else { return }
    let view = HardwareKeyCaptureView(frame: .zero)
    view.onKey = { [weak self] key in
      guard let chord = key.chordRecord(recording: true) else { return }
      self?.emit?(chord)
    }
    window.addSubview(view)
    view.becomeFirstResponder()
    captureView = view
  }

  private func stopRecording() {
    guard let view = captureView else { return }
    view.resignFirstResponder()
    view.removeFromSuperview()
    captureView = nil
  }

  private func removeCommands() {
    if let host {
      commands.forEach(host.removeKeyCommand)
    }
    commands = []
    host = nil
  }
}
