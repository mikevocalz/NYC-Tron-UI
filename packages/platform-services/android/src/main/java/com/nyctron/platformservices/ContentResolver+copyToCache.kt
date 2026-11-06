package com.nyctron.platformservices

import android.content.ContentResolver
import android.net.Uri
import java.io.File
import java.util.UUID

/**
 * Copies a picked document into `cacheDir/nyctron-imports/<id>/<name>` for an
 * "import" pick, so the app owns a file it can read without a grant. Blocking
 * I/O: call off the main thread. The name is reduced to its last path
 * segment so a provider cannot write outside the import folder.
 */
internal fun ContentResolver.copyToCache(uri: Uri, displayName: String, cacheDir: File): File {
  val safeName = File(displayName).name.ifBlank { "document" }
  val folder = File(cacheDir, "nyctron-imports/" + UUID.randomUUID()).apply { mkdirs() }
  val target = File(folder, safeName)
  val input = openInputStream(uri) ?: error("The document provider returned no data for $uri")
  input.use { source -> target.outputStream().use { source.copyTo(it) } }
  return target
}
