// iOS side of @nyc-tron/platform-services/haptics (N-05). The opt-out and
// rate limit live in JS; this module only plays what it is sent.
import ExpoModulesCore

@ExpoModule("NYCTronHaptics")
public final class NYCTronHapticsModule: Module {
  /// False for a kind this build does not know; JS validates kinds first.
  @JS
  @MainActor
  func play(_ kind: String) async -> Bool {
    guard let feedback = HapticFeedbackKind(rawValue: kind) else { return false }
    HapticPlayer.shared.play(feedback)
    return true
  }

  @JS
  @MainActor
  func prepare(_ kind: String) async {
    guard let feedback = HapticFeedbackKind(rawValue: kind) else { return }
    HapticPlayer.shared.prepare(feedback)
  }
}
