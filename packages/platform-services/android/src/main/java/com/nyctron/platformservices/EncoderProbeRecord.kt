package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class EncoderProbeRecord(
  val container: String,
  val video: Boolean,
  val audio: Boolean,
)
