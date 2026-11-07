package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class MediaProbeRecord(
  val durationUs: Double,
  val hasVideo: Boolean,
  val width: Double,
  val height: Double,
  val frameRate: Double,
  val videoCodec: String,
  val hasAudio: Boolean,
  val sampleRate: Double,
  val channels: Double,
  val audioCodec: String,
)
