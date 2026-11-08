package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class EncodeAudioRecord(
  val uri: String,
  val sampleRate: Double,
  val channels: Double,
  val sampleFormat: String,
  val frames: Double,
)
