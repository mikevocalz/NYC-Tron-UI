package com.nyctron.platformservices

import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File

/**
 * The system share sheet for these items. `file://` URIs inside the app's
 * cache or files directory go out through NYCTronFileProvider; content URIs
 * are shared as they are. Read access is granted to the receiving app only.
 * @throws IllegalArgumentException for a file outside the shareable directories
 */
internal fun ShareOptionsRecord.chooserIntent(context: Context): Intent {
  val authority = context.packageName + ".nyctron.files"
  val streams = uris.map { raw ->
    val uri = Uri.parse(raw)
    if (uri.scheme == "file") FileProvider.getUriForFile(context, authority, File(requireNotNull(uri.path))) else uri
  }
  val send = when {
    streams.size > 1 -> Intent(Intent.ACTION_SEND_MULTIPLE).putParcelableArrayListExtra(Intent.EXTRA_STREAM, ArrayList(streams))
    streams.size == 1 -> Intent(Intent.ACTION_SEND).putExtra(Intent.EXTRA_STREAM, streams.first())
    else -> Intent(Intent.ACTION_SEND)
  }
  text?.let { send.putExtra(Intent.EXTRA_TEXT, it) }
  send.type = when {
    streams.isEmpty() -> "text/plain"
    streams.size == 1 -> context.contentResolver.getType(streams.first()) ?: "application/octet-stream"
    else -> "*/*"
  }
  if (streams.isNotEmpty()) {
    // ClipData carries the grant to the chosen app on every Android version.
    val clip = ClipData.newRawUri(null, streams.first())
    streams.drop(1).forEach { clip.addItem(ClipData.Item(it)) }
    send.clipData = clip
    send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
  }
  return Intent.createChooser(send, title).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
}
