import ExpoModulesCore

/// Registered with Expo Modules Core's SwiftUI View DSL, which names each view
/// after its type. The @ExpoView/@ViewProps v2 macros are not in Expo Modules
/// Core yet; revisit this module when they ship. The views stay inside the JS
/// @expo/ui Host, but the Swift side needs nothing from ExpoUI, so the pod does
/// not depend on it and SwiftPM builds it as a plain Expo module.
public final class NYCTronInstrumentsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NYCTronInstruments")
    View(TronArcKnobView.self)
    View(TronXYPadView.self)
    View(TronVideoPlayerView.self)
    View(TronDisplayP3DiscView.self)
  }
}
