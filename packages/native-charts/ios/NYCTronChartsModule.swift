import ExpoModulesCore
import ExpoUI

/// Registered through SDK 58's ExpoUIView bridge, the same path
/// @nyc-tron/native-controls uses.
public final class NYCTronChartsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NYCTronCharts")
    ExpoUIView(TronChartView.self)
  }
}
