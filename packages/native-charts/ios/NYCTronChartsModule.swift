import ExpoModulesCore

/// Registered with Expo Modules Core's SwiftUI View DSL, the same path
/// @nyc-tron/native-controls uses. No ExpoUI symbols are needed in Swift.
public final class NYCTronChartsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NYCTronCharts")
    View(TronChartView.self)
  }
}
