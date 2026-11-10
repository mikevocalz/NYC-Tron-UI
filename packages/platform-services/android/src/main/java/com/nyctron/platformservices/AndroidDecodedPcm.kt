package com.nyctron.platformservices

import android.media.AudioFormat
import android.media.MediaCodec
import android.media.MediaFormat
import android.net.Uri
import java.io.BufferedOutputStream
import java.io.Closeable
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.ceil

/** Streaming interleaved Float32 writer. Linear resampling retains phase across codec buffers. */
internal class AndroidDecodedPcm(private val file: File, private val startUs: Long,
  private val durationUs: Long, private val requestedRate: Int) : Closeable {
  private val stream = BufferedOutputStream(file.outputStream())
  private var rate = 0
  private var channels = 0
  private var sourceRate = 0
  private var frames = 0L
  private var nextFrame = 0L
  private var nextTime = startUs.toDouble()
  private var previousTime = Double.NaN
  private var previous = FloatArray(0)
  private val scalar = ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN)
  var endUs = (startUs + durationUs).toDouble()
    private set

  /** Codec packets can contain encoder padding beyond the declared track end. */
  fun limitToTrackDuration(trackDurationUs: Double) {
    check(rate == 0) { "The PCM interval must be set before accepting samples." }
    if (!trackDurationUs.isFinite() || trackDurationUs < 0)
      throw MediaDecodeFailure("unsupported-format", "Audio duration is invalid.")
    if (trackDurationUs <= startUs)
      throw MediaDecodeFailure("out-of-range", "Audio starts at or past the track duration.")
    endUs = minOf(endUs, trackDurationUs)
  }

  fun accept(buffer: ByteBuffer, info: MediaCodec.BufferInfo, format: MediaFormat, check: () -> Unit) {
    val inputRate = format.getInteger(MediaFormat.KEY_SAMPLE_RATE)
    val inputChannels = format.getInteger(MediaFormat.KEY_CHANNEL_COUNT)
    val encoding = if (format.containsKey(MediaFormat.KEY_PCM_ENCODING)) format.getInteger(MediaFormat.KEY_PCM_ENCODING) else AudioFormat.ENCODING_PCM_16BIT
    if (inputRate !in 8000..192000 || inputChannels !in 1..32 ||
      encoding !in listOf(AudioFormat.ENCODING_PCM_16BIT, AudioFormat.ENCODING_PCM_FLOAT))
      throw MediaDecodeFailure("unsupported-format", "Unsupported decoded PCM format.")
    if (rate == 0) {
      sourceRate = inputRate; channels = inputChannels; rate = if (requestedRate == 0) inputRate else requestedRate
      if (ceil(durationUs * rate / 1_000_000.0) * channels * 4 > 128 * 1024 * 1024)
        throw MediaDecodeFailure("out-of-range", "PCM exceeds the 128 MiB output budget.")
      previous = FloatArray(channels)
    } else if (inputRate != sourceRate || inputChannels != channels)
      throw MediaDecodeFailure("unsupported-format", "Midstream audio format changes are unsupported.")
    val bytes = buffer.duplicate().order(ByteOrder.LITTLE_ENDIAN)
    bytes.position(info.offset); bytes.limit(info.offset + info.size)
    val stride = channels * if (encoding == AudioFormat.ENCODING_PCM_FLOAT) 4 else 2
    if (info.size % stride != 0) throw MediaDecodeFailure("decode-failed", "PCM buffer is not frame-aligned.")
    val sample = FloatArray(channels)
    for (i in 0 until info.size / stride) {
      if (i % 1024 == 0) check()
      for (channel in 0 until channels) sample[channel] = if (encoding == AudioFormat.ENCODING_PCM_FLOAT) bytes.float else bytes.short / 32768f
      val time = info.presentationTimeUs + i * 1_000_000.0 / sourceRate
      if (previousTime.isNaN()) {
        if (time - nextTime > 1_500_000.0 / sourceRate)
          throw MediaDecodeFailure("unsupported-format",
            "Audio starts at $time us after the requested $nextTime us interval ($sourceRate Hz).")
        previousTime = time
        sample.copyInto(previous)
      }
      while (nextTime <= time + .0001 && nextTime < endUs) {
        val span = time - previousTime
        if (span > 2_000_000.0 / sourceRate) throw MediaDecodeFailure("unsupported-format", "Discontinuous audio timestamps require an edit-aware decoder.")
        val fraction = if (span > 0) ((nextTime - previousTime) / span).coerceIn(0.0, 1.0) else 1.0
        for (channel in 0 until channels) {
          val value = (previous[channel] + (sample[channel] - previous[channel]) * fraction).toFloat()
          if (!value.isFinite()) throw MediaDecodeFailure("decode-failed", "PCM contains non-finite samples.")
          scalar.putFloat(0, value); stream.write(scalar.array())
        }
        frames++
        if (frames * channels * 4 > 128 * 1024 * 1024) throw MediaDecodeFailure("out-of-range", "PCM output limit exceeded.")
        nextFrame++
        // Derive phase from the integer sample index, avoiding accumulated drift.
        nextTime = startUs + nextFrame * 1_000_000.0 / rate
      }
      // The boundary sample can interpolate an earlier upsampled output, but
      // no output sample may land at or beyond the requested/track end.
      if (time >= endUs) return
      previousTime = time; sample.copyInto(previous)
    }
  }

  fun record(): DecodedAudioRecord {
    if (rate == 0) throw MediaDecodeFailure("out-of-range", "No audio samples exist at this media time.")
    stream.flush()
    return DecodedAudioRecord(Uri.fromFile(file).toString(), rate.toDouble(), channels.toDouble(), frames.toDouble())
  }

  override fun close() { stream.close() }
}
