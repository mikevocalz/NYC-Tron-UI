package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class EncodeVideoRecord(
  val uri: String,
  val width: Double,
  val height: Double,
  val pixelFormat: String,
  val frameRateNum: Double,
  val frameRateDen: Double,
  val frameCount: Double,
)
