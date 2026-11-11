package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class AudioRequestRecord(
  val startUs: Double,
  val durationUs: Double,
  val sampleRate: Double,
)
