import Foundation

/// Spoken description shared in wording with Android's tronChartSummary.
/// Format: "<Kind> chart. X axis: <x>. Y axis: <y>. <label>: <n> points, from <min> to <max>."
enum TronChartSummary {
  static func describe(kind: TronChartKind, xAxisLabel: String, yAxisLabel: String,
                       series: [TronChartSeries]) -> String {
    var parts = [kindName(kind) + " chart"]
    if !xAxisLabel.isEmpty { parts.append("X axis: " + xAxisLabel) }
    if !yAxisLabel.isEmpty { parts.append("Y axis: " + yAxisLabel) }
    if series.isEmpty { parts.append("No data") }
    for entry in series {
      let ys = entry.points.map(\.y)
      if let low = ys.min(), let high = ys.max() {
        let noun = ys.count == 1 ? "point" : "points"
        parts.append("\(entry.label): \(ys.count) \(noun), from \(number(low)) to \(number(high))")
      } else {
        parts.append("\(entry.label): no points")
      }
    }
    return parts.joined(separator: ". ") + "."
  }

  private static func kindName(_ kind: TronChartKind) -> String {
    switch kind {
    case .line: return "Line"
    case .column: return "Column"
    case .area: return "Area"
    }
  }

  /// Integers print bare; other values round to two decimals without trailing zeros.
  static func number(_ value: Double) -> String {
    let rounded = (value * 100).rounded() / 100
    if rounded == rounded.rounded() && abs(rounded) < 1e15 { return String(Int64(rounded)) }
    var text = String(format: "%.2f", locale: Locale(identifier: "en_US_POSIX"), rounded)
    while text.hasSuffix("0") { text.removeLast() }
    return text
  }
}
