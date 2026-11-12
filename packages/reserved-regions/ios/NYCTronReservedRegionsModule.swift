// iOS side of @nyc-tron/reserved-regions useReservedRegions(). Ported from
// NYC-MON apps/mobile/modules/reserved-regions by way of Nitro Forge.
//
// iOS 27.1 exposes where a fold divides the window and where the camera
// occludes it as `UIView.reservedRegions(kind:options:)`. UIKit publishes no
// change notification for them, so this is a query and nothing more; the kit
// re-queries when the window resizes, which every fold and unfold does, and
// does not subscribe to "changed" on iOS.
//
// SDK gate: SDKs before 27.1 do not declare UIView.ReservedRegion, and an
// @available check cannot rescue a compile-time reference to a missing type.
// `canImport(UIKit, _version:)` reads the SDK's UIKit module version (27.1 ships
// 9127.0.85), so the gate works the same under CocoaPods and SwiftPM, unlike
// a podspec xcconfig, which Expo's SwiftPM plugin never reads.
import ExpoModulesCore
import UIKit

@ExpoModule("NYCTronReservedRegions")
public final class NYCTronReservedRegionsModule: Module {
  // Main actor because UIKit views are read here. Inactive regions are kept on
  // purpose: a flat device reports its fold at zero width but still says where
  // it runs, which a layout wants before the next fold.
  @JS
  @MainActor
  func query() async -> [ReservedRegionRecord] {
#if canImport(UIKit, _version: 9127.0.85)
    guard #available(iOS 27.1, *), let view = UIWindow.keyRootView else { return [] }
    let regions =
      view.reservedRegions(kind: .division, options: [.includeInactive])
      + view.reservedRegions(kind: .occlusion, options: [.includeInactive])
    return regions.map { ReservedRegionRecord(region: $0) }
#else
    return []
#endif
  }

  // iPadOS 26 windowed apps show window controls in the top leading corner.
  // UIKit reports the space they need as the difference between the safe area
  // adapted around them and the plain safe area: horizontal adaptation moves
  // the leading edge past the controls, vertical adaptation moves the top edge
  // below them. Toolbars inset by these values never sit under the controls.
  // Like query(), this is a read with no change notification; JS re-reads it
  // when the window resizes, which entering and leaving windowed mode does.
  @JS
  @MainActor
  func windowControlsInsets() async -> WindowControlsInsetsRecord {
    let none = WindowControlsInsetsRecord(leading: 0, trailing: 0, height: 0)
#if compiler(>=6.2)
    guard #available(iOS 26.0, *), let view = UIWindow.keyRootView else { return none }
    let plain = view.directionalEdgeInsets(for: .safeArea())
    let horizontal = view.directionalEdgeInsets(for: .safeArea(cornerAdaptation: .horizontal))
    let vertical = view.directionalEdgeInsets(for: .safeArea(cornerAdaptation: .vertical))
    return WindowControlsInsetsRecord(
      leading: max(0, horizontal.leading - plain.leading),
      trailing: max(0, horizontal.trailing - plain.trailing),
      height: max(0, vertical.top - plain.top)
    )
#else
    return none
#endif
  }
}
