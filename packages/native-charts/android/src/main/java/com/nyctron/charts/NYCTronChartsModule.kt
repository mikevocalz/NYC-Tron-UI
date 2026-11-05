package com.nyctron.charts

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

// Same SDK 58 ExpoUIView registration path as @nyc-tron/native-controls.
class NYCTronChartsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NYCTronCharts")
    ExpoUIView<TronChartProps>("TronChartView") {
      Content { props -> TronChartContent(props) }
    }
  }
}
