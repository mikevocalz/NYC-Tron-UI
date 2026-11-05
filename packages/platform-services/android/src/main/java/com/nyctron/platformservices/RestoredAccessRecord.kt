package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/** A bookmark turned back into a readable URI. Android content URIs do not go stale, so `stale` is always false. */
@Record
data class RestoredAccessRecord(
  val uri: String,
  val bookmark: String,
  val stale: Boolean,
)
