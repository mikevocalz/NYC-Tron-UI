package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class FrameRequestRecord(
  val timeUs: Double,
  val maxWidth: Double,
  val maxHeight: Double,
)
