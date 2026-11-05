import SwiftUI
import Charts
import ExpoModulesCore
import ExpoUI

/// Swift Charts rendering of NativeChart. Every series is drawn with the
/// same mark family; colors come from the caller's theme tokens.
struct TronChartView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronChartProps

  private var labels: [String] { props.series.map(\.label) }
  private var colors: [Color] { props.series.map(\.color) }

  /// Columns group by x, so x becomes an ordered category.
  private var categories: [String] {
    var seen = Set<String>()
    let xs = props.series.flatMap { $0.points.map(\.x) }.sorted()
    return xs.map(TronChartSummary.number).filter { seen.insert($0).inserted }
  }

  var body: some View {
    chart
      .chartForegroundStyleScale(domain: labels, range: colors)
      .chartXAxis {
        AxisMarks { _ in
          AxisGridLine().foregroundStyle(props.gridColor)
          AxisTick().foregroundStyle(props.axisColor)
          AxisValueLabel().foregroundStyle(props.labelColor)
        }
      }
      .chartYAxis {
        AxisMarks { _ in
          AxisGridLine().foregroundStyle(props.gridColor)
          AxisTick().foregroundStyle(props.axisColor)
          AxisValueLabel().foregroundStyle(props.labelColor)
        }
      }
      .chartXAxisLabel(props.xAxisLabel)
      .chartYAxisLabel(props.yAxisLabel)
      .chartLegend(props.series.count > 1 ? .visible : .hidden)
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(TronChartSummary.describe(
        kind: props.kind, xAxisLabel: props.xAxisLabel,
        yAxisLabel: props.yAxisLabel, series: props.series))
  }

  @ViewBuilder
  private var chart: some View {
    switch props.kind {
    case .line:
      Chart(props.series, id: \.id) { entry in
        ForEach(Array(entry.points.enumerated()), id: \.offset) { _, point in
          LineMark(x: .value("X", point.x), y: .value("Y", point.y))
            .foregroundStyle(by: .value("Series", entry.label))
            .symbol(by: .value("Series", entry.label))
        }
      }
    case .area:
      Chart(props.series, id: \.id) { entry in
        ForEach(Array(entry.points.enumerated()), id: \.offset) { _, point in
          AreaMark(x: .value("X", point.x), y: .value("Y", point.y), stacking: .unstacked)
            .foregroundStyle(by: .value("Series", entry.label))
            .opacity(0.35)
          LineMark(x: .value("X", point.x), y: .value("Y", point.y))
            .foregroundStyle(by: .value("Series", entry.label))
        }
      }
    case .column:
      Chart(props.series, id: \.id) { entry in
        ForEach(Array(entry.points.enumerated()), id: \.offset) { _, point in
          BarMark(x: .value("X", TronChartSummary.number(point.x)), y: .value("Y", point.y))
            .foregroundStyle(by: .value("Series", entry.label))
            .position(by: .value("Series", entry.label))
        }
      }
      .chartXScale(domain: categories)
    }
  }
}
