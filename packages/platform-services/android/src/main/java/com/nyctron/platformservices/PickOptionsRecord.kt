package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/**
 * What JS asks the document picker for. `types` holds MIME types or
 * extensions (".nfd"); `mode` is "import" (a copy in the app's cache) or
 * "open-in-place" (the original, with a persisted read grant).
 */
@Record
data class PickOptionsRecord(
  val types: List<String>,
  val multiple: Boolean,
  val mode: String,
)
