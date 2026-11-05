import ExpoModulesCore
import ExpoUI
import SwiftUI

final class TronNavigationRailProps: UIBaseViewProps {
  @Field var destinationIds: [String] = []
  @Field var destinationLabels: [String] = []
  @Field var destinationGlyphs: [String] = []
  @Field var disabledIds: [String] = []
  @Field var selectedId: String = ""
  @Field var expanded: Bool = false
  @Field var enabled: Bool = true
  @Field var activeColor: Color = .accentColor
  @Field var foregroundColor: Color = .primary
  @Field var backgroundColor: Color = .clear
  var onSelect = EventDispatcher()
}

/// The host determines physical edge: RIGHT on native foldables/tablets/headsets.
struct TronNavigationRailView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronNavigationRailProps

  var body: some View {
    VStack(spacing: 6) {
      Spacer(minLength: 0)
      ForEach(Array(props.destinationIds.enumerated()), id: \.element) { index, id in
        let label = index < props.destinationLabels.count ? props.destinationLabels[index] : id
        let glyph = index < props.destinationGlyphs.count ? props.destinationGlyphs[index] : ""
        let disabled = props.disabledIds.contains(id) || !props.enabled
        let selected = props.selectedId == id
        Button {
          guard !disabled && !selected else { return }
          props.onSelect(["id": id])
        } label: {
          HStack(spacing: 8) {
            Text(glyph.isEmpty ? String(label.prefix(1)) : glyph)
              .font(.system(size: 20, weight: selected ? .bold : .medium))
              .frame(width: 28, height: 28)
            if props.expanded {
              Text(label)
                .font(.system(size: 14, weight: selected ? .semibold : .regular))
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
          }
          .foregroundStyle(selected ? props.activeColor : props.foregroundColor)
          .frame(minWidth: 44, minHeight: 44)
          .padding(.horizontal, props.expanded ? 12 : 4)
          .background(selected ? props.activeColor.opacity(0.15) : Color.clear)
          .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .accessibilityLabel(label)
        .accessibilityAddTraits(selected ? .isSelected : [])
      }
      Spacer(minLength: 0)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(props.backgroundColor)
  }
}
