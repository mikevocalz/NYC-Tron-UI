package com.nyctron.platformservices

import android.content.ContentResolver
import android.net.Uri
import android.provider.OpenableColumns

/**
 * The record JS receives for `uri`: display name and size from the
 * provider's OpenableColumns, type from the resolver. Blocking query: call
 * off the main thread.
 */
internal fun ContentResolver.pickedDocumentRecord(uri: Uri, bookmark: String?): PickedDocumentRecord {
  var name: String? = null
  var size: Double? = null
  query(uri, arrayOf(OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE), null, null, null)?.use { cursor ->
    if (cursor.moveToFirst()) {
      val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
      val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
      if (nameIndex >= 0 && !cursor.isNull(nameIndex)) name = cursor.getString(nameIndex)
      if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) size = cursor.getLong(sizeIndex).toDouble()
    }
  }
  return PickedDocumentRecord(
    uri = uri.toString(),
    name = name ?: uri.lastPathSegment ?: "Document",
    size = size,
    mimeType = getType(uri),
    bookmark = bookmark,
  )
}
