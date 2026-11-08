package com.nyctron.platformservices

import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContextOrNull

/** Bounded local encoding; the worker owns codecs, muxer and cache lifetime. */
@ExpoModule("NYCTronMediaEncoder")
class NYCTronMediaEncoderModule : Module() {
  private val worker = AndroidMediaEncoder { androidContextOrNull }

  @JS
  suspend fun probe(): EncoderProbeRecord = worker.run { probe() }

  @JS
  suspend fun encode(video: EncodeVideoRecord?, audio: EncodeAudioRecord?): EncodedMediaRecord =
    worker.run { encode(video, audio) }

  @JS
  suspend fun clearCache() { worker.run { clearCache() } }

  override fun onDestroy() { worker.close() }
}
