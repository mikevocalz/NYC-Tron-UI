import ExpoModulesCore

final class TronPointerInputProps: ExpoSwiftUI.ViewProps {
  @Field var label: String = "Drawing surface"
  var onBatch = EventDispatcher()
  var onKey = EventDispatcher()
}
