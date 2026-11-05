package com.nyctron.platformservices

import android.net.Uri
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.UUID
import kotlin.coroutines.resume

/**
 * ACTION_OPEN_DOCUMENT through the Activity's ActivityResultRegistry, so no
 * change to the host's MainActivity is needed. Each call registers under a
 * fresh key and unregisters when the result arrives or the caller is cancelled.
 * Main thread only: registration and launch must happen there.
 */
internal object DocumentPickLauncher {
  /** The picked URIs, or an empty list when the person backs out. */
  suspend fun pick(activity: ComponentActivity, mimeTypes: Array<String>, multiple: Boolean): List<Uri> =
    suspendCancellableCoroutine { continuation ->
      val key = "nyctron.documents." + UUID.randomUUID()
      var launcher: ActivityResultLauncher<Array<String>>? = null
      val finish = { uris: List<Uri> ->
        launcher?.unregister()
        if (continuation.isActive) {
          continuation.resume(uris)
        }
      }
      val registered = if (multiple) {
        activity.activityResultRegistry.register(key, ActivityResultContracts.OpenMultipleDocuments()) { finish(it) }
      } else {
        activity.activityResultRegistry.register(key, ActivityResultContracts.OpenDocument()) { finish(listOfNotNull(it)) }
      }
      launcher = registered
      continuation.invokeOnCancellation { registered.unregister() }
      registered.launch(mimeTypes)
    }
}
