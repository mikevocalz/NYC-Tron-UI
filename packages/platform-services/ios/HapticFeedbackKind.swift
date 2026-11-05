// The kinds JS sends, matching HapticKind in src/haptics/kinds.ts.
enum HapticFeedbackKind: String {
  case selection
  case detent
  case light
  case medium
  case heavy
  case success
  case warning
  case error
  case gestureStart = "gesture-start"
  case gestureEnd = "gesture-end"
}
