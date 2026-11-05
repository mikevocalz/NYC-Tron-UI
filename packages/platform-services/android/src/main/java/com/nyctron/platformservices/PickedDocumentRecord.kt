package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/** One picked document. `bookmark` is the persisted content URI, present only for open-in-place picks. */
@Record
data class PickedDocumentRecord(
  val uri: String,
  val name: String,
  val size: Double?,
  val mimeType: String?,
  val bookmark: String?,
)
