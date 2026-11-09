package com.nyctron.platformservices

import io.github.expo.modules.v2.Event
import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContextOrNull

/**
 * Android side of @nyc-tron/platform-services/audio.
 *
 * AudioTrack (PCM_16BIT, MODE_STREAM) playback fed by a writer thread over a
 * bounded chunk queue, and AudioRecord (PCM_16BIT) capture into a Float ring
 * drained by readInput. RECORD_AUDIO is declared by this library's manifest
 * and must be granted at runtime before openInput ("permission" otherwise).
 */
@ExpoModule("NYCTronAudioDevice")
class NYCTronAudioDeviceModule : Module() {
  @Event("audio")
  val onAudio = event<AudioDeviceEventRecord>()

  private val worker by lazy { AndroidAudioDevice({ androidContextOrNull }, { onAudio.emit(it) }) }

  @JS
  suspend fun probe(): AudioDeviceProbeRecord = worker.probe()

  @JS
  suspend fun openOutput(options: AudioOpenOptionsRecord): AudioStreamHandleRecord =
    worker.openOutput(options)

  @JS
  suspend fun writeOutput(request: AudioWriteRecord) { worker.writeOutput(request) }

  @JS
  suspend fun stats(stream: String): AudioStatsRecord = worker.stats(stream)

  @JS
  suspend fun closeOutput(stream: String) { worker.closeOutput(stream) }

  @JS
  suspend fun openInput(options: AudioOpenOptionsRecord): AudioStreamHandleRecord =
    worker.openInput(options)

  @JS
  suspend fun readInput(stream: String, maxFrames: Int): AudioPcmRecord =
    worker.readInput(stream, maxFrames)

  @JS
  suspend fun closeInput(stream: String) { worker.closeInput(stream) }

  override fun onDestroy() {
    worker.closeAll()
  }
}
