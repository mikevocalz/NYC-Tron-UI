package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/** One enumerated audio endpoint. `id` is "ad-<AudioDeviceInfo.id>" or "" for the system default. */
@Record
data class AudioDeviceDescriptorRecord(
  val id: String,
  val name: String,
  val kind: String, // "input" | "output" | "duplex"
)

@Record
data class AudioDeviceProbeRecord(
  val available: Boolean,
  val defaultSampleRate: Int,
  val outputs: List<AudioDeviceDescriptorRecord>,
  val inputs: List<AudioDeviceDescriptorRecord>,
)

/** Open options as JS sends them; 0/"" mean "platform default". */
@Record
data class AudioOpenOptionsRecord(
  val deviceId: String = "",
  val sampleRate: Int = 0,
  val channels: Int = 0,
  val sampleFormat: String = "",
  val bufferMs: Int = 2000,
)

@Record
data class AudioStreamHandleRecord(
  val stream: String,
  val sampleRate: Int,
  val channels: Int,
  val sampleFormat: String, // actual negotiated encoding ("s16" on Android v1)
  val latencyMs: Double,
)

@Record
data class AudioWriteRecord(
  val stream: String,
  val samples: ByteArray,   // interleaved little-endian PCM
  val sampleFormat: String, // must match the negotiated format
  val frames: Int,
)

@Record
data class AudioStatsRecord(
  val stream: String,
  val sampleRate: Int,
  val channels: Int,
  val sampleFormat: String,
  val queuedFrames: Int,
  val capacityFrames: Int,
  val droppedFrames: Long,
  val underrunFrames: Long,
)

@Record
data class AudioPcmRecord(
  val stream: String,
  val samples: ByteArray, // interleaved f32le
  val frames: Int,
  val sampleRate: Int,
  val channels: Int,
  val sampleFormat: String,
)

@Record
data class AudioDeviceEventRecord(
  val stream: String,
  val kind: String, // "device-lost" | "error"
  val message: String = "",
)
