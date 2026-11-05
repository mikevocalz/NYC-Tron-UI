import SwiftUI
import ExpoModulesCore

/// Native, unsnapped two-parameter controller adapted from the interaction
/// pattern of AudioKit/Controls XYPad, MIT © 2022 Aurelius Prochazka.
final class TronXYPadProps: ExpoSwiftUI.ViewProps {
  @Field var label: String = "XY Pad"
  @Field var x: Double = 0.5
  @Field var y: Double = 0.5
  @Field var enabled: Bool = true
  @Field var accentColor: Color = .purple
  @Field var backgroundColor: Color = .black.opacity(0.85)
  var onPreview = EventDispatcher()
  var onCommit = EventDispatcher()
}

struct TronXYPadView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronXYPadProps
  @State private var active = false
  @State private var previewX: Double = 0.5
  @State private var previewY: Double = 0.5
  private func clamp(_ value: Double) -> Double {
    value.isFinite ? min(1, max(0, value)) : 0.5
  }
  var body: some View {
    GeometryReader { geo in
      let x = active ? previewX : clamp(props.x)
      let y = active ? previewY : clamp(props.y)
      ZStack {
        RoundedRectangle(cornerRadius: 14)
          .fill(props.backgroundColor)
        Rectangle()
          .fill(props.accentColor.opacity(0.25))
          .frame(height: 1)
        Rectangle()
          .fill(props.accentColor.opacity(0.25))
          .frame(width: 1)
        Circle()
          .fill(props.accentColor)
          .frame(width: 24, height: 24)
          .position(x: 12 + x * max(0, geo.size.width - 24),
                    y: 12 + (1-y) * max(0, geo.size.height - 24))
      }
      .contentShape(Rectangle())
      .gesture(DragGesture(minimumDistance: 0)
        .onChanged { event in
          guard props.enabled, geo.size.width > 0, geo.size.height > 0 else { return }
          active = true
          let newX = clamp(Double(event.location.x / geo.size.width))
          let newY = clamp(1 - Double(event.location.y / geo.size.height))
          if newX != previewX || newY != previewY {
            previewX = newX
            previewY = newY
            props.onPreview(["x": newX, "y": newY])
          }
        }
        .onEnded { _ in
          guard active else { return }
          active = false
          if previewX != clamp(props.x) || previewY != clamp(props.y) {
            props.onCommit(["x": previewX, "y": previewY])
          }
        })
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(props.label)
      .accessibilityValue("X \(Int(x * 100)) percent, Y \(Int(y * 100)) percent")
      .accessibilityAdjustableAction { direction in
        guard props.enabled else { return }
        let nextX = clamp(x + (direction == .increment ? 0.05 : -0.05))
        if nextX != x { props.onCommit(["x": nextX, "y": y]) }
      }
      // The adjustable rotor moves X only; Y needs its own actions or
      // VoiceOver users cannot reach half of the control.
      .accessibilityAction(named: "Increase Y") {
        guard props.enabled else { return }
        let nextY = clamp(y + 0.05)
        if nextY != y { props.onCommit(["x": x, "y": nextY]) }
      }
      .accessibilityAction(named: "Decrease Y") {
        guard props.enabled else { return }
        let nextY = clamp(y - 0.05)
        if nextY != y { props.onCommit(["x": x, "y": nextY]) }
      }
      .opacity(props.enabled ? 1 : 0.4)
      .onChange(of: props.x) { newX in
        if !active { previewX = clamp(newX) }
      }
      .onChange(of: props.y) { newY in
        if !active { previewY = clamp(newY) }
      }
    }
    .zeroContentOrigin(props.shadowNodeProxy)
  }
}
