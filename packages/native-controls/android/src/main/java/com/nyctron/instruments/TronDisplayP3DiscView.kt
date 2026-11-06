package com.nyctron.instruments

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.colorspace.ColorSpaces
import expo.modules.kotlin.views.FunctionalComposableScope
import kotlin.math.atan2
import kotlin.math.abs
import kotlin.math.hypot

/** Input-free, bounded native P3 raster. Activity color mode belongs to the host. */
@Composable
fun FunctionalComposableScope.TronDisplayP3DiscContent(props: TronDisplayP3DiscProps) {
  Canvas(Modifier.fillMaxSize().clip(CircleShape)) {
    val edge = 64
    val brightness = if (props.value.isFinite()) props.value.coerceIn(0f, 1f) else 1f
    val width = size.width / edge
    val height = size.height / edge
    for (row in 0 until edge) {
      for (column in 0 until edge) {
        val x = (column + .5f) / edge * 2 - 1
        val y = (row + .5f) / edge * 2 - 1
        val saturation = hypot(x, y).coerceAtMost(1f)
        val sector = (((atan2(-y, x) / (2 * Math.PI) + 1) % 1) * 6).toFloat()
        val chroma = brightness * saturation
        val secondary = chroma * (1 - abs(sector % 2 - 1))
        val offset = brightness - chroma
        val rgb = when (sector.toInt()) {
          0 -> Triple(chroma, secondary, 0f)
          1 -> Triple(secondary, chroma, 0f)
          2 -> Triple(0f, chroma, secondary)
          3 -> Triple(0f, secondary, chroma)
          4 -> Triple(secondary, 0f, chroma)
          else -> Triple(chroma, 0f, secondary)
        }
        drawRect(Color(rgb.first + offset, rgb.second + offset, rgb.third + offset,
          colorSpace = ColorSpaces.DisplayP3), Offset(column * width, row * height),
          Size(width + .25f, height + .25f))
      }
    }
  }
}
