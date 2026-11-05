package com.nyctron.charts

import androidx.compose.ui.graphics.Color

/** Parses a theme token color; the JS layer has already rejected empty values. */
internal fun tronChartColor(value: String, fallback: Color): Color =
  runCatching { Color(android.graphics.Color.parseColor(value)) }.getOrDefault(fallback)
