package com.nyctron.charts

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.patrykandpatrick.vico.compose.cartesian.CartesianChartHost
import com.patrykandpatrick.vico.compose.cartesian.axis.HorizontalAxis
import com.patrykandpatrick.vico.compose.cartesian.axis.VerticalAxis
import com.patrykandpatrick.vico.compose.cartesian.axis.rememberAxisGuidelineComponent
import com.patrykandpatrick.vico.compose.cartesian.axis.rememberAxisLabelComponent
import com.patrykandpatrick.vico.compose.cartesian.axis.rememberAxisLineComponent
import com.patrykandpatrick.vico.compose.cartesian.axis.rememberAxisTickComponent
import com.patrykandpatrick.vico.compose.cartesian.data.CartesianChartModelProducer
import com.patrykandpatrick.vico.compose.cartesian.data.columnSeries
import com.patrykandpatrick.vico.compose.cartesian.data.lineSeries
import com.patrykandpatrick.vico.compose.cartesian.layer.ColumnCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.layer.LineCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.layer.rememberColumnCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.layer.rememberLine
import com.patrykandpatrick.vico.compose.cartesian.layer.rememberLineCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.rememberCartesianChart
import com.patrykandpatrick.vico.compose.common.Fill
import com.patrykandpatrick.vico.compose.common.ProvideVicoTheme
import com.patrykandpatrick.vico.compose.common.component.rememberLineComponent
import com.patrykandpatrick.vico.compose.common.component.rememberTextComponent
import com.patrykandpatrick.vico.compose.common.data.ExtraStore
import com.patrykandpatrick.vico.compose.m3.common.rememberM3VicoTheme
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.ui.ModifierRegistry

private val AXIS_FALLBACK = Color(0xFF8A8A99)
private val SERIES_FALLBACK = Color(0xFF8B5CF6)

/**
 * Vico rendering of NativeChart. Every series is drawn with the same layer
 * type; colors come from the caller's theme tokens, never from Vico defaults.
 */
@Composable
fun FunctionalComposableScope.TronChartContent(props: TronChartProps) {
  val kind = TronChartKind.fromWire(props.kind)
  val axisColor = tronChartColor(props.axisColor, AXIS_FALLBACK)
  val gridColor = tronChartColor(props.gridColor, AXIS_FALLBACK)
  val labelColor = tronChartColor(props.labelColor, AXIS_FALLBACK)
  // Vico cannot draw a series with no entries; those still appear in the summary.
  val drawn = props.series.filter { it.points.isNotEmpty() }
  val seriesColors = drawn.map { tronChartColor(it.color, SERIES_FALLBACK) }
  val summary = tronChartSummary(kind, props.xAxisLabel, props.yAxisLabel, props.series)

  val modifier = ModifierRegistry.applyModifiers(props.modifiers, appContext, composableScope, globalEventDispatcher)
    .fillMaxSize()
    .clearAndSetSemantics { contentDescription = summary }

  if (drawn.isEmpty()) {
    Box(modifier, contentAlignment = Alignment.Center) {
      Text("No data", color = axisColor)
    }
    return
  }

  val modelProducer = remember { CartesianChartModelProducer() }
  LaunchedEffect(drawn, kind) {
    modelProducer.runTransaction {
      if (kind == TronChartKind.Column) {
        columnSeries { drawn.forEach { s -> series(s.points.map { it.x }, s.points.map { it.y }) } }
      } else {
        lineSeries { drawn.forEach { s -> series(s.points.map { it.x }, s.points.map { it.y }) } }
      }
    }
  }

  val labelStyle = TextStyle(color = labelColor)
  val titleComponent = rememberTextComponent(style = labelStyle)
  val xTitle = props.xAxisLabel
  val yTitle = props.yAxisLabel
  val xTitleProvider = remember(xTitle) { { _: ExtraStore -> xTitle.ifEmpty { null } } }
  val yTitleProvider = remember(yTitle) { { _: ExtraStore -> yTitle.ifEmpty { null } } }
  val axisLine = rememberAxisLineComponent(fill = Fill(axisColor))
  val axisTick = rememberAxisTickComponent(fill = Fill(axisColor))
  val guideline = rememberAxisGuidelineComponent(fill = Fill(gridColor))
  val axisLabel = rememberAxisLabelComponent(style = labelStyle)
  val startAxis = VerticalAxis.rememberStart(
    line = axisLine, label = axisLabel, tick = axisTick, guideline = guideline,
    titleComponent = if (yTitle.isEmpty()) null else titleComponent, title = yTitleProvider
  )
  val bottomAxis = HorizontalAxis.rememberBottom(
    line = axisLine, label = axisLabel, tick = axisTick, guideline = guideline,
    titleComponent = if (xTitle.isEmpty()) null else titleComponent, title = xTitleProvider
  )

  val layer = if (kind == TronChartKind.Column) {
    val columns = seriesColors.map { rememberLineComponent(fill = Fill(it), thickness = 10.dp) }
    rememberColumnCartesianLayer(
      columnProvider = ColumnCartesianLayer.ColumnProvider.series(columns)
    )
  } else {
    val lines = seriesColors.map { color ->
      LineCartesianLayer.rememberLine(
        fill = LineCartesianLayer.LineFill.single(Fill(color)),
        areaFill = if (kind == TronChartKind.Area) {
          LineCartesianLayer.AreaFill.single(Fill(color.copy(alpha = 0.35f)))
        } else {
          null
        }
      )
    }
    rememberLineCartesianLayer(lineProvider = LineCartesianLayer.LineProvider.series(lines))
  }

  ProvideVicoTheme(
    rememberM3VicoTheme(
      columnCartesianLayerColors = seriesColors,
      lineColor = axisColor,
      textColor = labelColor
    )
  ) {
    CartesianChartHost(
      chart = rememberCartesianChart(layer, startAxis = startAxis, bottomAxis = bottomAxis),
      modelProducer = modelProducer,
      modifier = modifier
    )
  }
}
