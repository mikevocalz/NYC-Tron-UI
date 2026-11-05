package com.nyctron.charts

import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList

/** Mirrors NativeChartWireProps in src/NativeChart.types.ts key for key. */
@OptimizedComposeProps
data class TronChartProps(
  val series: List<TronChartSeries> = emptyList(),
  val kind: String = "line",
  val xAxisLabel: String = "",
  val yAxisLabel: String = "",
  val axisColor: String = "",
  val gridColor: String = "",
  val labelColor: String = "",
  val modifiers: ModifierList = emptyList()
) : ComposeProps
