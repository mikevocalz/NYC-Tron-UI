package com.nyctron.platformservices

import android.content.Intent
import android.net.Uri
import androidx.activity.ComponentActivity
import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContextOrNull
import io.github.expo.modules.v2.react.currentActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException

/**
 * Android side of @nyc-tron/platform-services/documents (N-12).
 *
 * - pick: ACTION_OPEN_DOCUMENT. "import" copies each file into the cache;
 *   "open-in-place" keeps the content URI and persists its read grant (and
 *   write, when the provider gave it), so the URI is the bookmark.
 * - restoreAccess: checks the grant is still held.
 * - releaseAccess: gives the persisted grant back.
 * - share: the system chooser; Android does not report whether the person
 *   finished, so it resolves true once the sheet opens.
 *
 * Threading: picker registration and the chooser run on the main thread;
 * provider queries and copies run on Dispatchers.IO.
 */
@ExpoModule("NYCTronDocuments")
class NYCTronDocumentsModule : Module() {
  /** [] when the person backs out or there is no Activity to launch from. */
  @JS
  suspend fun pick(options: PickOptionsRecord): List<PickedDocumentRecord> {
    val activity = currentActivity as? ComponentActivity ?: return emptyList()
    val uris = withContext(Dispatchers.Main.immediate) {
      DocumentPickLauncher.pick(activity, options.mimeTypes, options.multiple)
    }
    val resolver = activity.contentResolver
    return withContext(Dispatchers.IO) {
      uris.map { uri ->
        if (options.opensInPlace) {
          persistGrant(uri)
          resolver.pickedDocumentRecord(uri, bookmark = uri.toString())
        } else {
          val picked = resolver.pickedDocumentRecord(uri, bookmark = null)
          val copy = resolver.copyToCache(uri, picked.name, activity.cacheDir)
          picked.copy(uri = Uri.fromFile(copy).toString())
        }
      }
    }
  }

  /** A retained grant can outlive a deleted or unavailable provider file. */
  @JS
  suspend fun restoreAccess(bookmark: String): RestoredAccessRecord? {
    val resolver = androidContextOrNull?.contentResolver ?: return null
    val uri = Uri.parse(bookmark)
    if (uri.scheme != "content") return null
    val held = resolver.persistedUriPermissions.any { it.uri == uri && it.isReadPermission }
    if (!held) return null
    return withContext(Dispatchers.IO) {
      try {
        resolver.openAssetFileDescriptor(uri, "r")?.use {
          RestoredAccessRecord(uri = bookmark, bookmark = bookmark, stale = false)
        }
      } catch (_: IOException) { null }
        catch (_: SecurityException) { null }
        catch (_: IllegalArgumentException) { null }
    }
  }

  @JS
  fun releaseAccess(uri: String) {
    val resolver = androidContextOrNull?.contentResolver ?: return
    val parsed = Uri.parse(uri)
    val grant = resolver.persistedUriPermissions.firstOrNull { it.uri == parsed } ?: return
    var flags = 0
    if (grant.isReadPermission) flags = flags or Intent.FLAG_GRANT_READ_URI_PERMISSION
    if (grant.isWritePermission) flags = flags or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
    resolver.releasePersistableUriPermission(parsed, flags)
  }

  /** True once the chooser is shown; false with nothing to share or no Activity. */
  @JS
  suspend fun share(options: ShareOptionsRecord): Boolean {
    if (options.uris.isEmpty() && options.text == null) return false
    val activity = currentActivity ?: return false
    val chooser = options.chooserIntent(activity)
    withContext(Dispatchers.Main.immediate) { activity.startActivity(chooser) }
    return true
  }

  // Read is always offered for ACTION_OPEN_DOCUMENT; write only when the provider allows it.
  private fun persistGrant(uri: Uri) {
    val resolver = androidContextOrNull?.contentResolver ?: return
    try {
      resolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
    } catch (_: SecurityException) {
      resolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
    }
  }
}
