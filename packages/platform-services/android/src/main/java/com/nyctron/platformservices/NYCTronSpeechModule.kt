package com.nyctron.platformservices

import io.github.expo.modules.v2.Event
import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContextOrNull

/**
 * Android side of @nyc-tron/platform-services/speech.
 *
 * android.speech.SpeechRecognizer with EXTRA_PREFER_OFFLINE for on-device
 * sessions and the on-device recognizer on API 31+. The system owns the
 * microphone; RECORD_AUDIO is declared by this library's manifest and must
 * be granted at runtime by the host before start ("permission" otherwise).
 */
@ExpoModule("NYCTronSpeech")
class NYCTronSpeechModule : Module() {
  @Event("speech")
  val onSpeech = event<SpeechEventRecord>()

  private val worker by lazy { AndroidSpeechRecognizer({ androidContextOrNull }, { onSpeech.emit(it) }) }

  @JS
  suspend fun probe(): SpeechProbeRecord = worker.probe()

  @JS
  suspend fun start(options: SpeechStartRecord): SpeechSessionRecord = worker.start(options)

  @JS
  suspend fun stop(session: String) { worker.stop(session) }

  @JS
  suspend fun abort(session: String) { worker.abort(session) }

  override fun onDestroy() { worker.close() }
}
