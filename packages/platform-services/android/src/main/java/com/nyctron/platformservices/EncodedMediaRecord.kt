package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class EncodedMediaRecord(
  val uri: String,
  val mimeType: String,
  val byteLength: Double,
  val durationUs: Double,
)
