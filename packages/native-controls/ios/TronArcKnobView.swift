import SwiftUI
import ExpoModulesCore

/// Native adaptation of AudioKit Controls' ArcKnob interaction idiom.
/// Upstream: https://github.com/AudioKit/Controls @ 717ce0d6d4e18f2849d484b578e0faf13bb38077
/// MIT, (c) 2022 Aurelius Prochazka. See LICENSE and THIRD_PARTY_NOTICES.md.
final class TronArcKnobProps: ExpoSwiftUI.ViewProps {
  @Field var label: String = "Parameter"
  @Field var value: Double = 0
  @Field var minimum: Double = 0
  @Field var maximum: Double = 1
  @Field var step: Double = 0.01
  @Field var enabled: Bool = true
  @Field var accentColor: Color = .purple
  @Field var textColor: Color = .primary
  var onPreview = EventDispatcher()
  var onCommit = EventDispatcher()
}

struct TronArcKnobView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronArcKnobProps
  @State private var draft: Double = 0
  @State private var gestureBase: Double = 0
  @State private var active: Bool = false

  private var valid: Bool {
    props.minimum.isFinite && props.maximum.isFinite && props.maximum > props.minimum &&
    props.step.isFinite && props.step > 0
  }

  private func quantize(_ raw: Double) -> Double {
    guard valid, raw.isFinite else { return props.minimum }
    let bound = min(props.maximum, max(props.minimum, raw))
    let stepCount = ((bound - props.minimum) / props.step).rounded()
    return min(props.maximum, max(props.minimum, props.minimum + stepCount * props.step))
  }

  private var shown: Double { active ? draft : quantize(props.value) }
  private var progress: Double { valid ? (shown - props.minimum) / (props.maximum - props.minimum) : 0 }

  var body: some View {
    GeometryReader { geometry in
      let diameter = min(geometry.size.width, geometry.size.height)
      ZStack {
        Circle()
          .trim(from: 0.125, to: 0.875)
          .stroke(props.accentColor.opacity(0.22),
                  style: StrokeStyle(lineWidth: diameter * 0.085, lineCap: .round))
          .rotationEffect(.degrees(90))
          .padding(diameter * 0.11)

        Circle()
          .trim(from: 0.125, to: 0.125 + 0.75 * max(0, min(1, progress)))
          .stroke(props.accentColor,
                  style: StrokeStyle(lineWidth: diameter * 0.085, lineCap: .round))
          .rotationEffect(.degrees(90))
          .padding(diameter * 0.11)

        VStack(spacing: 2) {
          Text(shown.formatted(.number.precision(.fractionLength(0...3))))
            .font(.system(size: max(11, diameter * 0.17), weight: .semibold, design: .rounded))
            .monospacedDigit()
          Text(props.label)
            .font(.system(size: max(10, diameter * 0.09), weight: .medium))
            .lineLimit(1)
        }
        .foregroundStyle(props.textColor)
        .minimumScaleFactor(0.6)
      }
      .frame(width: geometry.size.width, height: geometry.size.height)
      .contentShape(Rectangle())
      .gesture(DragGesture(minimumDistance: 0)
        .onChanged { event in
          guard props.enabled, valid else { return }
          if !active {
            gestureBase = quantize(props.value)
            draft = gestureBase
            active = true
          }
          let multiplier: Double = event.translation.height < -28 ? 0.1 :
            (event.translation.height > 28 ? 4 : 1)
          let next = quantize(gestureBase + Double(event.translation.width) / 8 * props.step * multiplier)
          if next != draft {
            draft = next
            props.onPreview(["value": next])
          }
        }
        .onEnded { _ in
          guard active else { return }
          active = false
          let finalValue = quantize(draft)
          if finalValue != quantize(props.value) {
            props.onCommit(["value": finalValue])
          }
        })
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(props.label)
      .accessibilityValue(shown.formatted(.number.precision(.fractionLength(0...3))))
      .accessibilityAddTraits(.updatesFrequently)
      .accessibilityAdjustableAction { direction in
        guard props.enabled && valid else { return }
        let delta = direction == .increment ? props.step : -props.step
        let next = quantize(shown + delta)
        if next != shown { props.onCommit(["value": next]) }
      }
      .opacity(props.enabled ? 1 : 0.4)
      .onChange(of: props.value) { next in
        if !active { draft = quantize(next) }
      }
    }
    .zeroContentOrigin(props.shadowNodeProxy)
  }
}
