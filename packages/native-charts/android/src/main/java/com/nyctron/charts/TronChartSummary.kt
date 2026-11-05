package com.nyctron.charts

import java.util.Locale
import kotlin.math.abs
import kotlin.math.roundToLong

/**
 * Spoken description shared in wording with iOS TronChartSummary.
 * Format: "<Kind> chart. X axis: <x>. Y axis: <y>. <label>: <n> points, from <min> to <max>."
 */
internal fun tronChartSummary(
  kind: TronChartKind,
  xAxisLabel: String,
  yAxisLabel: String,
  series: List<TronChartSeries>
): String {
  val parts = mutableListOf(kind.spoken + " chart")
  if (xAxisLabel.isNotEmpty()) parts += "X axis: $xAxisLabel"
  if (yAxisLabel.isNotEmpty()) parts += "Y axis: $yAxisLabel"
  if (series.isEmpty()) parts += "No data"
  for (entry in series) {
    val ys = entry.points.map { it.y }
    val low = ys.minOrNull()
    val high = ys.maxOrNull()
    parts += if (low == null || high == null) {
      "${entry.label}: no points"
    } else {
      val noun = if (ys.size == 1) "point" else "points"
      "${entry.label}: ${ys.size} $noun, from ${tronChartNumber(low)} to ${tronChartNumber(high)}"
    }
  }
  return parts.joinToString(". ") + "."
}

/** Integers print bare; other values round to two decimals without trailing zeros. */
internal fun tronChartNumber(value: Double): String {
  val rounded = (value * 100).roundToLong() / 100.0
  if (rounded == Math.rint(rounded) && abs(rounded) < 1e15) return rounded.toLong().toString()
  return String.format(Locale.US, "%.2f", rounded).trimEnd('0')
}
