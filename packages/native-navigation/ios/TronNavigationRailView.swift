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
  /// Selected pill fill from the app theme; nil falls back to activeColor at 15%.
  @Field var indicatorColor: Color?
  var onSelect = EventDispatcher()
}

/// The host determines physical edge: RIGHT on native foldables/tablets/headsets.
struct TronNavigationRailView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronNavigationRailProps
  /// Glyph size and box follow Dynamic Type, matching the scalable labels.
  @ScaledMetric(relativeTo: .title3) private var glyphSize: CGFloat = 20
  @ScaledMetric(relativeTo: .title3) private var glyphBox: CGFloat = 28

  var body: some View {
    GeometryReader { geometry in
      ScrollView(.vertical) {
        VStack(spacing: 6) {
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
                  .font(.system(size: glyphSize, weight: selected ? .bold : .medium))
                  .frame(width: glyphBox, height: glyphBox)
                  .accessibilityHidden(true)
                if props.expanded {
                  Text(label)
                    .font(.subheadline.weight(selected ? .semibold : .regular))
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
              }
              .foregroundStyle(selected ? props.activeColor : props.foregroundColor)
              .frame(minWidth: 44, minHeight: 44)
              .padding(.horizontal, props.expanded ? 12 : 4)
              // Fully rounded selected pill; contentShape keeps the whole
              // 44pt target tappable even where the unselected fill is clear.
              .background(
                Capsule().fill(selected ? (props.indicatorColor ?? props.activeColor.opacity(0.15)) : Color.clear)
              )
              .contentShape(Capsule())
            }
            .buttonStyle(.plain)
            .disabled(disabled)
            .accessibilityLabel(label)
            .accessibilityAddTraits(selected ? .isSelected : [])
          }
        }
        .frame(maxWidth: .infinity, minHeight: geometry.size.height, alignment: .center)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(props.backgroundColor)
  }
}
