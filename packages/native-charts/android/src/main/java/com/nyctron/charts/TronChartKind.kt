package com.nyctron.charts

enum class TronChartKind(val wire: String, val spoken: String) {
  Line("line", "Line"),
  Column("column", "Column"),
  Area("area", "Area");

  companion object {
    fun fromWire(value: String): TronChartKind =
      entries.firstOrNull { it.wire == value } ?: throw IllegalArgumentException("Unknown chart kind: $value")
  }
}
