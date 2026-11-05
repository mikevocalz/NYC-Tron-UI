import SwiftUI
import ExpoModulesCore

/// Mirrors NativeChartWireProps in src/NativeChart.types.ts key for key.
final class TronChartProps: ExpoSwiftUI.ViewProps {
  @Field var series: [TronChartSeries] = []
  @Field var kind: TronChartKind = .line
  @Field var xAxisLabel: String = ""
  @Field var yAxisLabel: String = ""
  @Field var axisColor: Color = .secondary
  @Field var gridColor: Color = .gray
  @Field var labelColor: Color = .primary
}
