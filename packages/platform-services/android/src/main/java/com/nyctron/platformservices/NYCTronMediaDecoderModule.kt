package com.nyctron.platformservices

import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContextOrNull

/** Bounded local decoding; the worker owns codecs, extractor and cache lifetime. */
@ExpoModule("NYCTronMediaDecoder")
class NYCTronMediaDecoderModule : Module() {
  private val worker = AndroidMediaDecoder { androidContextOrNull }

  @JS
  suspend fun probe(uri: String): MediaProbeRecord = worker.run { probe(uri) }

  @JS
  suspend fun presentationIndexV1(uri: String, maxFrames: Double): PresentationIndexRecord =
    worker.run { presentationIndex(uri, maxFrames) }

  @JS
  suspend fun decodeFrame(uri: String, options: FrameRequestRecord): DecodedFrameRecord =
    worker.run { frame(uri, options) }

  @JS
  suspend fun decodeAudio(uri: String, options: AudioRequestRecord): DecodedAudioRecord =
    worker.run { audio(uri, options) }

  @JS
  suspend fun clearCache() { worker.run { clearCache() } }

  override fun onDestroy() { worker.close() }
}
