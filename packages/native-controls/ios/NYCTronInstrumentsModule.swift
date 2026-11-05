import ExpoModulesCore
import ExpoUI

/// SDK 58 ExpoUIView is the supported custom-view bridge. The proposed
/// @ExpoView/@ViewProps v2 macros are not yet available in Expo Modules Core.
/// Do not invent their codegen. Revisit this module as soon as they ship.
public final class NYCTronInstrumentsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NYCTronInstruments")
    ExpoUIView(TronArcKnobView.self)
    ExpoUIView(TronXYPadView.self)
  }
}
