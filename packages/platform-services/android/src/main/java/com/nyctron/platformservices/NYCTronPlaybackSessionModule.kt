package com.nyctron.platformservices

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.os.Handler
import android.os.Looper
import io.github.expo.modules.v2.Event
import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContextOrNull
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Android side of @nyc-tron/platform-services/playback (N-17).
 *
 * Audio focus through AudioManager (focus lost, transient, duckable, regained)
 * and output loss through an AudioDeviceCallback (wired or Bluetooth output
 * removed), reported as "session" events. The pause/resume policy is
 * nextPlaybackState in JS; the player stays the app's.
 *
 * Threading: the focus controller and the device callback are created,
 * used and released on the main thread; activate/deactivate cross into it once.
 */
@ExpoModule("NYCTronPlaybackSession")
class NYCTronPlaybackSessionModule : Module() {
  private var focus: AudioFocusController? = null
  private var outputLoss: OutputLossCallback? = null

  /** JS subscribes with `addListener("session", listener)`. */
  @Event("session")
  val onSession = event<SessionEventRecord>()

  /**
   * False when the category is unknown or focus was refused. With
   * `mixWithOthers` no focus is requested, so other apps keep playing and no
   * focus events arrive; output loss is still reported.
   */
  @JS
  suspend fun activate(options: ActivateOptionsRecord): Boolean {
    val (usage, contentType) = when (options.category) {
      "playback" -> AudioAttributes.USAGE_MEDIA to AudioAttributes.CONTENT_TYPE_MUSIC
      "play-and-record" -> AudioAttributes.USAGE_MEDIA to AudioAttributes.CONTENT_TYPE_SPEECH
      "ambient" -> AudioAttributes.USAGE_MEDIA to AudioAttributes.CONTENT_TYPE_SONIFICATION
      else -> return false
    }
    val audioManager = androidContextOrNull?.getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return false
    return withContext(Dispatchers.Main.immediate) {
      if (outputLoss == null) {
        val callback = OutputLossCallback { onSession.emit(it) }
        audioManager.registerAudioDeviceCallback(callback, Handler(Looper.getMainLooper()))
        outputLoss = callback
      }
      // Ambient audio mixes by definition; it never takes focus from another app.
      if (options.mixWithOthers || options.category == "ambient") {
        focus?.abandon()
        true
      } else {
        val controller = focus ?: AudioFocusController(audioManager) { onSession.emit(it) }.also { focus = it }
        controller.request(usage, contentType)
      }
    }
  }

  /** Abandons focus so other apps return to full volume, and stops output-loss reports. */
  @JS
  suspend fun deactivate() {
    val audioManager = androidContextOrNull?.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    withContext(Dispatchers.Main.immediate) {
      focus?.abandon()
      outputLoss?.let { audioManager?.unregisterAudioDeviceCallback(it) }
      outputLoss = null
    }
  }

  override fun onDestroy() {
    val audioManager = androidContextOrNull?.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    Handler(Looper.getMainLooper()).post {
      focus?.abandon()
      outputLoss?.let { audioManager?.unregisterAudioDeviceCallback(it) }
      outputLoss = null
    }
  }
}
