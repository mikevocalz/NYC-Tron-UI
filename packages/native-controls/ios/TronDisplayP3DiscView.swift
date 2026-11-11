import SwiftUI
import ExpoModulesCore

/// Original bounded raster of HSV in Display P3 primaries. The native drawing
/// context retains the color space; no RGB8 image or hex conversion intervenes.
struct TronDisplayP3DiscView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronDisplayP3DiscProps
  var body: some View {
    Canvas { context, size in
      let edge = 64
      let brightness = props.value.isFinite ? min(1, max(0, props.value)) : 1
      let cell = CGSize(width: size.width / Double(edge), height: size.height / Double(edge))
      for row in 0..<edge {
        for column in 0..<edge {
          let x = (Double(column) + 0.5) / Double(edge) * 2 - 1
          let y = (Double(row) + 0.5) / Double(edge) * 2 - 1
          let saturation = min(1, hypot(x, y))
          let hue = (atan2(-y, x) / (2 * .pi) + 1).truncatingRemainder(dividingBy: 1)
          let sector = hue * 6
          let chroma = brightness * saturation
          let secondary = chroma * (1 - abs(sector.truncatingRemainder(dividingBy: 2) - 1))
          let offset = brightness - chroma
          let rgb: (Double, Double, Double)
          switch Int(sector) {
          case 0: rgb = (chroma, secondary, 0)
          case 1: rgb = (secondary, chroma, 0)
          case 2: rgb = (0, chroma, secondary)
          case 3: rgb = (0, secondary, chroma)
          case 4: rgb = (secondary, 0, chroma)
          default: rgb = (chroma, 0, secondary)
          }
          let color = Color(.displayP3, red: rgb.0 + offset, green: rgb.1 + offset, blue: rgb.2 + offset)
          let rect = CGRect(x: Double(column) * cell.width, y: Double(row) * cell.height,
                            width: cell.width + 0.25, height: cell.height + 0.25)
          context.fill(Path(rect), with: .color(color))
        }
      }
    }
    .clipShape(Circle())
    .allowsHitTesting(false)
    .accessibilityHidden(true)
    .zeroContentOrigin(props.shadowNodeProxy)
  }
}
