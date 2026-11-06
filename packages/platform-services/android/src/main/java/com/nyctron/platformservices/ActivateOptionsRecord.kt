package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/** Options for activating the audio session; `category` is an AudioSessionCategory from src/playback/session.ts. */
@Record
data class ActivateOptionsRecord(
  val category: String,
  val mixWithOthers: Boolean,
)
