package com.nyctron.platformservices

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioDeviceInfo
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioRecord
import android.media.AudioTrack
import android.media.MediaRecorder
import android.os.Build
import androidx.core.content.ContextCompat
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Android audio device backend for @nyc-tron/platform-services/audio.
 *
 * Playback: AudioTrack in MODE_STREAM fed by a dedicated writer thread that
 * pops bounded chunks from a ring queue. The JS host pushes lookahead PCM
 * through writeOutput; the writer only ever sees queued bytes — engine code
 * never runs on an audio path. Empty polls write a counted silence burst so
 * underruns surface in stats() instead of stalling.
 *
 * Capture: AudioRecord (PCM_16BIT) read on a worker thread into a bounded
 * Float ring; readInput drains interleaved f32. RECORD_AUDIO is declared by
 * the library manifest and must be granted at runtime ("permission").
 *
 * v1 honesty notes: output negotiates PCM_16BIT only (f32 requests report
 * "s16"); channels are limited to mono/stereo on both directions; input
 * sample rate must match the device rate — no resampling. Per-device
 * selection uses AudioDeviceInfo.setPreferredDevice where the platform
 * allows it.
 */
internal class AndroidAudioDevice(
  private val context: () -> Context?,
  private val emit: (AudioDeviceEventRecord) -> Unit,
) {
  private val lock = Any()
  private val outputs = HashMap<String, OutputStream>()
  private val inputs = HashMap<String, InputStream>()
  private val counter = java.util.concurrent.atomic.AtomicInteger(0)

  // MARK: - probe

  fun probe(): AudioDeviceProbeRecord {
    val ctx = context() ?: return AudioDeviceProbeRecord(available = false, defaultSampleRate = 0,
      outputs = emptyList(), inputs = emptyList())
    val am = ctx.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
      ?: return AudioDeviceProbeRecord(available = false, defaultSampleRate = 0,
        outputs = emptyList(), inputs = emptyList())
    fun describe(kind: Int, device: AudioDeviceInfo) = AudioDeviceDescriptorRecord(
      id = "ad-${device.id}",
      name = device.productName?.toString()?.takeIf { it.isNotBlank() } ?: "type ${device.type}",
      kind = kind,
    )
    if (Build.VERSION.SDK_INT < 23) {
      // AudioDeviceInfo enumeration needs API 23; report the honest empty list.
      return AudioDeviceProbeRecord(available = true, defaultSampleRate = 48000,
        outputs = emptyList(), inputs = emptyList())
    }
    val out = am.getDevices(AudioManager.GET_DEVICES_OUTPUTS).map { describe("output", it) }
    val `in` = am.getDevices(AudioManager.GET_DEVICES_INPUTS).map { describe("input", it) }
    val rate = am.getProperty(AudioManager.PROPERTY_OUTPUT_SAMPLE_RATE)?.toIntOrNull() ?: 48000
    return AudioDeviceProbeRecord(available = true, defaultSampleRate = rate, outputs = out, inputs = `in`)
  }

  private fun findDevice(id: String, output: Boolean): AudioDeviceInfo? {
    if (id.isEmpty() || Build.VERSION.SDK_INT < 23) return null
    val numeric = id.removePrefix("ad-").toIntOrNull() ?: return null
    val ctx = context() ?: return null
    val am = ctx.getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return null
    val flag = if (output) AudioManager.GET_DEVICES_OUTPUTS else AudioManager.GET_DEVICES_INPUTS
    return am.getDevices(flag).firstOrNull { it.id == numeric }
  }

  // MARK: - output

  fun openOutput(options: AudioOpenOptionsRecord): AudioStreamHandleRecord {
    val ctx = context() ?: throw AudioDeviceFailure("unsupported-format", "No Android context is available.")
    val am = ctx.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
      ?: throw AudioDeviceFailure("unsupported-format", "No AudioManager is available.")
    val sampleRate = if (options.sampleRate > 0) options.sampleRate
      else am.getProperty(AudioManager.PROPERTY_OUTPUT_SAMPLE_RATE)?.toIntOrNull() ?: 48000
    if (sampleRate < 8000 || sampleRate > 384000)
      throw AudioDeviceFailure("unsupported-format", "sampleRate $sampleRate is outside 8000...384000.")
    // v1: mono/stereo only — wider masks need per-layout channel masks.
    val channels = if (options.channels > 0) options.channels.coerceIn(1, 8) else 2
    if (channels > 2) throw AudioDeviceFailure("unsupported-format", "Android output supports mono/stereo in v1; requested $channels channels.")
    val channelConfig = if (channels == 1) AudioFormat.CHANNEL_OUT_MONO else AudioFormat.CHANNEL_OUT_STEREO
    val minBuf = AudioTrack.getMinBufferSize(sampleRate, channelConfig, AudioFormat.ENCODING_PCM_16BIT)
    if (minBuf <= 0) throw AudioDeviceFailure("unsupported-format", "AudioTrack rejects ${sampleRate} Hz x $channels ch PCM16.")
    val capacityFrames = (sampleRate.toLong() * options.bufferMs.coerceIn(1, 10000) / 1000).toInt().coerceIn(256, sampleRate * 10)
    val bytesPerFrame = channels * 2

    val audioFormat = AudioFormat.Builder()
      .setSampleRate(sampleRate)
      .setChannelMask(channelConfig)
      .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
      .build()
    // AudioTrack.Builder is API 26+; older releases get the legacy
    // constructor (STREAM_MUSIC, no per-device attributes).
    val track = if (Build.VERSION.SDK_INT >= 26) {
      AudioTrack.Builder()
        .setAudioAttributes(
          android.media.AudioAttributes.Builder()
            .setUsage(android.media.AudioAttributes.USAGE_MEDIA)
            .setContentType(android.media.AudioAttributes.CONTENT_TYPE_MUSIC)
            .build())
        .setAudioFormat(audioFormat)
        .setBufferSizeInBytes(minBuf * 4)
        .setTransferMode(AudioTrack.MODE_STREAM)
        .build()
    } else {
      @Suppress("DEPRECATION")
      AudioTrack(AudioManager.STREAM_MUSIC, sampleRate, channelConfig,
        AudioFormat.ENCODING_PCM_16BIT, minBuf * 4, AudioTrack.MODE_STREAM)
    }
    val preferred = findDevice(options.deviceId, output = true)
    if (preferred != null && !track.setPreferredDevice(preferred)) {
      runCatching { track.release() }
      throw AudioDeviceFailure("device-error", "Could not select audio device \"${options.deviceId}\" for output.")
    }
    track.play()

    val id = "android-out-${counter.incrementAndGet()}"
    val stream = OutputStream(id, track, capacityFrames, bytesPerFrame, sampleRate, channels)
    synchronized(lock) { outputs[id] = stream }
    stream.start()
    val latency = if (Build.VERSION.SDK_INT >= 26) runCatching { track.latency }.getOrDefault(0) else 0
    // AudioTrack.getLatency() reports MICROSECONDS (API 26+); the contract is ms.
    return AudioStreamHandleRecord(stream = id, sampleRate = sampleRate, channels = channels,
      sampleFormat = "s16", latencyMs = latency / 1000.0)
  }

  fun writeOutput(request: AudioWriteRecord) {
    val stream = synchronized(lock) { outputs[request.stream] }
      ?: throw AudioDeviceFailure("device-not-found", "Unknown output stream \"${request.stream}\".")
    val bytesPerSample = if (request.sampleFormat == "s16") 2 else 4
    val expected = request.frames * stream.channels * bytesPerSample
    if (request.samples.size != expected)
      throw AudioDeviceFailure("out-of-range",
        "PCM chunk is ${request.samples.size} bytes but ${request.frames} frames at ${stream.channels} channels/${request.sampleFormat} needs $expected.")
    // PCM_16BIT is the only negotiated output format; the JS layer already
    // enforced the match, so a mismatch here is a contract violation.
    if (request.sampleFormat != "s16")
      throw AudioDeviceFailure("unsupported-format", "Android output accepts s16 chunks in v1.")
    stream.offer(request.samples, request.frames)
  }

  fun stats(streamId: String): AudioStatsRecord {
    val out = synchronized(lock) { outputs[streamId] }
    if (out != null) {
      val s = out.snapshot()
      return AudioStatsRecord(stream = streamId, sampleRate = out.sampleRate, channels = out.channels,
        sampleFormat = "s16", queuedFrames = s.queuedFrames, capacityFrames = s.capacityFrames,
        droppedFrames = s.droppedFrames, underrunFrames = s.underrunFrames)
    }
    val `in` = synchronized(lock) { inputs[streamId] }
    if (`in` != null) {
      val s = `in`.ring.statsSnapshot()
      return AudioStatsRecord(stream = streamId, sampleRate = `in`.sampleRate, channels = `in`.channels,
        sampleFormat = "f32", queuedFrames = s.queuedFrames, capacityFrames = s.capacityFrames,
        droppedFrames = s.droppedFrames, underrunFrames = s.underrunFrames)
    }
    throw AudioDeviceFailure("device-not-found", "Unknown stream \"$streamId\".")
  }

  fun closeOutput(streamId: String) {
    val stream = synchronized(lock) { outputs.remove(streamId) } ?: return
    stream.close()
  }

  // MARK: - input

  fun openInput(options: AudioOpenOptionsRecord): AudioStreamHandleRecord {
    val ctx = context() ?: throw AudioDeviceFailure("unsupported-format", "No Android context is available.")
    if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED)
      throw AudioDeviceFailure("permission", "Microphone permission was denied.")
    val sampleRate = if (options.sampleRate > 0) options.sampleRate else 48000
    if (sampleRate < 8000 || sampleRate > 384000)
      throw AudioDeviceFailure("unsupported-format", "sampleRate $sampleRate is outside 8000...384000.")
    val channels = if (options.channels > 0) options.channels.coerceIn(1, 2) else 1
    val channelConfig = if (channels == 1) AudioFormat.CHANNEL_IN_MONO else AudioFormat.CHANNEL_IN_STEREO
    val minBuf = AudioRecord.getMinBufferSize(sampleRate, channelConfig, AudioFormat.ENCODING_PCM_16BIT)
    if (minBuf <= 0) throw AudioDeviceFailure("unsupported-format", "AudioRecord rejects ${sampleRate} Hz x $channels ch PCM16.")
    val capacityFrames = (sampleRate.toLong() * options.bufferMs.coerceIn(1, 10000) / 1000).toInt().coerceIn(256, sampleRate * 10)

    val record = AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, channelConfig,
      AudioFormat.ENCODING_PCM_16BIT, minBuf * 2)
    if (record.state != AudioRecord.STATE_INITIALIZED) {
      record.release()
      throw AudioDeviceFailure("device-error", "AudioRecord failed to initialize at ${sampleRate} Hz.")
    }
    val preferred = findDevice(options.deviceId, output = false)
    if (preferred != null && !record.setPreferredDevice(preferred)) {
      runCatching { record.release() }
      throw AudioDeviceFailure("device-error", "Could not select audio device \"${options.deviceId}\" for input.")
    }

    val id = "android-in-${counter.incrementAndGet()}"
    val stream = InputStream(id, record, capacityFrames, sampleRate, channels)
    synchronized(lock) { inputs[id] = stream }
    try {
      record.startRecording()
    } catch (e: Exception) {
      synchronized(lock) { inputs.remove(id) }
      runCatching { record.release() }
      throw AudioDeviceFailure("device-error", "AudioRecord failed to start: ${e.message}")
    }
    if (record.recordingState != AudioRecord.RECORDSTATE_RECORDING) {
      synchronized(lock) { inputs.remove(id) }
      runCatching { record.stop() }
      runCatching { record.release() }
      throw AudioDeviceFailure("device-error", "AudioRecord did not enter RECORDSTATE_RECORDING.")
    }
    stream.start()
    return AudioStreamHandleRecord(stream = id, sampleRate = sampleRate, channels = channels,
      sampleFormat = "f32", latencyMs = 0.0)
  }

  fun readInput(streamId: String, maxFrames: Int): AudioPcmRecord {
    val stream = synchronized(lock) { inputs[streamId] }
      ?: throw AudioDeviceFailure("device-not-found", "Unknown input stream \"$streamId\".")
    val want = maxFrames.coerceIn(0, stream.ring.capacityFrames)
    val floats = FloatArray(want * stream.channels)
    val got = stream.ring.pop(floats, want)
    val out = ByteArray(got * stream.channels * 4)
    var o = 0
    for (i in 0 until got * stream.channels) {
      val bits = floats[i].toRawBits()
      out[o] = (bits and 0xff).toByte(); out[o + 1] = ((bits shr 8) and 0xff).toByte()
      out[o + 2] = ((bits shr 16) and 0xff).toByte(); out[o + 3] = ((bits shr 24) and 0xff).toByte()
      o += 4
    }
    return AudioPcmRecord(stream = streamId, samples = out, frames = got,
      sampleRate = stream.sampleRate, channels = stream.channels, sampleFormat = "f32")
  }

  fun closeInput(streamId: String) {
    val stream = synchronized(lock) { inputs.remove(streamId) } ?: return
    stream.close()
  }

  fun closeAll() {
    val out: List<OutputStream>
    val `in`: List<InputStream>
    synchronized(lock) {
      out = outputs.values.toList(); outputs.clear()
      `in` = inputs.values.toList(); inputs.clear()
    }
    out.forEach { it.close() }
    `in`.forEach { it.close() }
  }

  // MARK: - shared ring

  /** Bounded interleaved Float32 ring. Overflow drops the incoming tail and
   *  counts it; stats() exposes the counters. All mutation under one monitor —
   *  short critical sections, not formally wait-free (flagged unverified). */
  private class FloatRing(val capacityFrames: Int, val channels: Int) {
    private val buf = FloatArray(capacityFrames * channels)
    private var head = 0
    private var tail = 0
    private var count = 0
    var droppedFrames = 0L; private set
    var underrunFrames = 0L; private set

    @Synchronized
    fun push(floats: FloatArray, frames: Int, offset: Int = 0) {
      if (frames <= 0) return
      val free = capacityFrames - count
      val n = minOf(free, frames)
      if (n <= 0) { droppedFrames += frames; return }
      for (i in 0 until n) {
        val src = offset + i * channels
        val dst = head * channels
        for (c in 0 until channels) buf[dst + c] = if (src + c < floats.size) floats[src + c] else 0f
        head = (head + 1) % capacityFrames
      }
      count += n
      droppedFrames += frames - n
    }

    @Synchronized
    fun pop(out: FloatArray, frames: Int): Int {
      val n = minOf(frames, count)
      for (i in 0 until n) {
        val src = tail * channels
        val dst = i * channels
        for (c in 0 until channels) if (dst + c < out.size) out[dst + c] = buf[src + c]
        tail = (tail + 1) % capacityFrames
      }
      count -= n
      return n
    }

    @Synchronized
    fun statsSnapshot() = StreamSnapshot(count, capacityFrames, droppedFrames, underrunFrames)
  }

  private data class StreamSnapshot(val queuedFrames: Int, val capacityFrames: Int,
                                    val droppedFrames: Long, val underrunFrames: Long)

  // MARK: - output stream

  private inner class OutputStream(
    val id: String,
    private val track: AudioTrack,
    val capacityFrames: Int,
    private val bytesPerFrame: Int,
    val sampleRate: Int,
    val channels: Int,
  ) {
    private val queue = ArrayBlockingQueue<QueuedChunk>(512)
    private val queueLock = Any()
    private var queuedFrames = 0
    private var droppedFrames = 0L
    private var underrunFrames = 0L
    private val running = AtomicBoolean(false)
    private var thread: Thread? = null
    /** Unconsumed whole frames from a partially written chunk; writer-thread only. */
    private var carry: QueuedChunk? = null

    fun offer(bytes: ByteArray, frames: Int) {
      synchronized(queueLock) {
        val free = capacityFrames - queuedFrames
        val accept = minOf(free, frames)
        if (accept <= 0) { droppedFrames += frames; return }
        val take = accept * bytesPerFrame
        val chunk = if (take == bytes.size) bytes else bytes.copyOf(take)
        // The queue is sized far above any legal chunk count, but a hostile
        // stream of tiny chunks could still fill it — count that as dropped.
        if (queue.offer(QueuedChunk(chunk, accept))) {
          queuedFrames += accept
          droppedFrames += frames - accept
        } else {
          droppedFrames += frames
        }
      }
    }

    fun snapshot() = synchronized(queueLock) {
      StreamSnapshot(queuedFrames, capacityFrames, droppedFrames, underrunFrames)
    }

    fun start() {
      if (!running.compareAndSet(false, true)) return
      val burstFrames = maxOf(64, sampleRate / 50)
      val silence = ByteArray(burstFrames * bytesPerFrame)
      thread = Thread({
        while (running.get()) {
          // A partially written chunk's remainder takes priority over newly
          // queued audio so playback order and frame accounting stay exact.
          val chunk = carry ?: queue.poll(50, TimeUnit.MILLISECONDS)
          carry = null
          if (chunk == null) {
            // Nothing queued: keep the stream alive with counted silence so
            // underruns are visible in stats() rather than silent gaps.
            if (writeAll(silence) < 0) { fail("AudioTrack write failed"); break }
            synchronized(queueLock) { underrunFrames += burstFrames }
            continue
          }
          val written = writeAll(chunk.bytes)
          if (written < 0) {
            fail("AudioTrack write failed")
            accountWrite(chunk, 0) // running is false now: remainder counts dropped
            break
          }
          accountWrite(chunk, written)
        }
      }, "nyc-tron-audio-out").apply { isDaemon = true; start() }
    }

    /** Blocking write loop: returns bytes consumed, or -1 on track error. */
    private fun writeAll(bytes: ByteArray): Int {
      var offset = 0
      while (offset < bytes.size) {
        if (!running.get()) return offset
        val written = track.write(bytes, offset, bytes.size - offset)
        if (written < 0) return -1
        if (written == 0) {
          try { Thread.sleep(5) } catch (_: InterruptedException) {
            Thread.currentThread().interrupt(); return offset
          }
          continue
        }
        offset += written
      }
      return offset
    }

    /**
     * Accounts a chunk after AudioTrack consumed `written` bytes. Only whole
     * PCM frames count; unconsumed whole frames are carried to the next loop
     * iteration instead of being dropped, and bytes that can never form a
     * frame are counted as dropped so queuedFrames never drifts.
     */
    private fun accountWrite(chunk: QueuedChunk, written: Int) {
      val consumedFrames = written / bytesPerFrame
      val remainingFrames = chunk.frames - consumedFrames
      var carryFrames = 0
      if (running.get() && written % bytesPerFrame == 0 && remainingFrames > 0) {
        carryFrames = minOf(remainingFrames, (chunk.bytes.size - written) / bytesPerFrame)
        if (carryFrames > 0) {
          carry = QueuedChunk(
            chunk.bytes.copyOfRange(written, written + carryFrames * bytesPerFrame), carryFrames)
        }
      }
      val droppedNow = remainingFrames - carryFrames
      synchronized(queueLock) {
        queuedFrames = maxOf(0, queuedFrames - consumedFrames)
        if (droppedNow > 0) droppedFrames += droppedNow
      }
    }

    private fun fail(message: String) {
      running.set(false)
      emit(AudioDeviceEventRecord(stream = id, kind = "device-lost", message = message))
    }

    fun close() {
      running.set(false)
      thread?.join(500)
      carry = null
      runCatching { track.stop() }
      runCatching { track.release() }
      queue.clear()
    }
  }

  private data class QueuedChunk(val bytes: ByteArray, val frames: Int)

  // MARK: - input stream

  private inner class InputStream(
    val id: String,
    private val record: AudioRecord,
    val capacityFrames: Int,
    val sampleRate: Int,
    val channels: Int,
  ) {
    val ring = FloatRing(capacityFrames, channels)
    private val running = AtomicBoolean(false)
    private var thread: Thread? = null

    fun start() {
      if (!running.compareAndSet(false, true)) return
      // startRecording() already ran (and was verified) in openInput.
      val shortCount = maxOf(256, AudioRecord.getMinBufferSize(sampleRate,
        if (channels == 1) AudioFormat.CHANNEL_IN_MONO else AudioFormat.CHANNEL_IN_STEREO,
        AudioFormat.ENCODING_PCM_16BIT) / 2)
      val shorts = ShortArray(shortCount)
      val floats = FloatArray(shortCount)
      thread = Thread({
        while (running.get()) {
          val read = record.read(shorts, 0, shortCount)
          if (read < 0) { fail("AudioRecord read failed ($read)"); break }
          val frames = read / channels
          if (frames <= 0) continue
          for (i in 0 until frames * channels) floats[i] = shorts[i] / 32768f
          ring.push(floats, frames)
        }
      }, "nyc-tron-audio-in").apply { isDaemon = true; start() }
    }

    private fun fail(message: String) {
      running.set(false)
      emit(AudioDeviceEventRecord(stream = id, kind = "device-lost", message = message))
    }

    fun close() {
      running.set(false)
      thread?.join(500)
      runCatching { record.stop() }
      runCatching { record.release() }
    }
  }
}
