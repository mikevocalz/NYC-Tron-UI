package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/** What to hand the share sheet: file or content URIs, text, or both. */
@Record
data class ShareOptionsRecord(
  val uris: List<String>,
  val text: String?,
  val title: String?,
)
