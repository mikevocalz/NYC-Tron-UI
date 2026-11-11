package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class DecodedFrameRecord(
  val uri: String,
  val actualTimeUs: Double,
  val width: Double,
  val height: Double,
)
