package com.nyctron.platformservices

import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Build

/**
 * Requests and abandons audio focus and reports focus changes as session
 * events. Main thread only: AudioManager delivers focus changes on the
 * looper of the thread that requested, which is the main thread here.
 */
internal class AudioFocusController(
  private val audioManager: AudioManager,
  private val emit: (SessionEventRecord) -> Unit,
) {
  private var request: AudioFocusRequest? = null
  private var holding = false

  private val listener = AudioManager.OnAudioFocusChangeListener { change ->
    val event = when (change) {
      AudioManager.AUDIOFOCUS_LOSS -> SessionEvents.of("focus-lost")
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT -> SessionEvents.of("focus-lost", transient = true)
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> SessionEvents.of("focus-lost", transient = true, canDuck = true)
      AudioManager.AUDIOFOCUS_GAIN -> SessionEvents.of("focus-gained")
      else -> null
    }
    event?.let(emit)
  }

  /** True when focus was granted. A delayed grant counts as refused. */
  fun request(usage: Int, contentType: Int): Boolean {
    abandon()
    val granted = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val attributes = AudioAttributes.Builder().setUsage(usage).setContentType(contentType).build()
      val focusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
        .setAudioAttributes(attributes)
        .setOnAudioFocusChangeListener(listener)
        .setWillPauseWhenDucked(false)
        .build()
      request = focusRequest
      audioManager.requestAudioFocus(focusRequest)
    } else {
      @Suppress("DEPRECATION")
      audioManager.requestAudioFocus(listener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN)
    }
    holding = granted == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
    return holding
  }

  fun abandon() {
    if (!holding) {
      return
    }
    val focusRequest = request
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && focusRequest != null) {
      audioManager.abandonAudioFocusRequest(focusRequest)
    } else {
      @Suppress("DEPRECATION")
      audioManager.abandonAudioFocus(listener)
    }
    request = null
    holding = false
  }
}
