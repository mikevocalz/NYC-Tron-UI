package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/** Start options as JS sends them. `locale` is "" for the platform default. */
@Record
data class SpeechStartRecord(
  val locale: String,
  val onDeviceOnly: Boolean,
  val hints: List<String>,
)
