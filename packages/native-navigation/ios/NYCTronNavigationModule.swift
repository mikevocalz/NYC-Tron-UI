import ExpoModulesCore
import ExpoUI

/// Expo SDK 58 supported native-view DSL (not future v2 view macros).
public final class NYCTronNavigationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NYCTronNavigation")
    ExpoUIView(TronNavigationRailView.self)
  }
}
