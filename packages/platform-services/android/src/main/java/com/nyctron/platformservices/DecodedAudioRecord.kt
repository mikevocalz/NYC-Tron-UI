package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class DecodedAudioRecord(
  val uri: String,
  val sampleRate: Double,
  val channels: Double,
  val frames: Double,
)
