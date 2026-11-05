package com.nyctron.platformservices

import android.webkit.MimeTypeMap

/**
 * MIME types for the picker. An extension maps through MimeTypeMap; one it
 * does not know (a custom ".nfd") widens the pick to all files, because
 * ACTION_OPEN_DOCUMENT filters by MIME type only and would otherwise hide it.
 */
internal val PickOptionsRecord.mimeTypes: Array<String>
  get() {
    val mapped = types.map { entry ->
      when {
        entry.contains("/") -> entry
        entry.startsWith(".") -> MimeTypeMap.getSingleton().getMimeTypeFromExtension(entry.drop(1).lowercase())
        else -> null
      }
    }
    return if (mapped.isEmpty() || mapped.any { it == null }) arrayOf("*/*") else mapped.filterNotNull().distinct().toTypedArray()
  }

internal val PickOptionsRecord.opensInPlace: Boolean
  get() = mode == "open-in-place"
