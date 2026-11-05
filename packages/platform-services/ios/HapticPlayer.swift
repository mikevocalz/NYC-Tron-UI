// Plays HapticFeedbackKinds through UIFeedbackGenerator. Generators are kept
// and prepared so a drag's first tick is not late; UIKit honors the System
// Haptics setting itself. Main actor only.
import UIKit

@MainActor
final class HapticPlayer {
  static let shared = HapticPlayer()

  private let selection = UISelectionFeedbackGenerator()
  private let lightImpact = UIImpactFeedbackGenerator(style: .light)
  private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
  private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
  private let rigidImpact = UIImpactFeedbackGenerator(style: .rigid)
  private let softImpact = UIImpactFeedbackGenerator(style: .soft)
  private let notification = UINotificationFeedbackGenerator()

  func play(_ kind: HapticFeedbackKind) {
    switch kind {
    case .selection: selection.selectionChanged()
    case .detent: rigidImpact.impactOccurred(intensity: 0.6)
    case .light: lightImpact.impactOccurred()
    case .medium: mediumImpact.impactOccurred()
    case .heavy: heavyImpact.impactOccurred()
    case .success: notification.notificationOccurred(.success)
    case .warning: notification.notificationOccurred(.warning)
    case .error: notification.notificationOccurred(.error)
    case .gestureStart: softImpact.impactOccurred()
    case .gestureEnd: lightImpact.impactOccurred(intensity: 0.7)
    }
  }

  func prepare(_ kind: HapticFeedbackKind) {
    switch kind {
    case .selection: selection.prepare()
    case .detent: rigidImpact.prepare()
    case .light, .gestureEnd: lightImpact.prepare()
    case .medium: mediumImpact.prepare()
    case .heavy: heavyImpact.prepare()
    case .success, .warning, .error: notification.prepare()
    case .gestureStart: softImpact.prepare()
    }
  }
}
