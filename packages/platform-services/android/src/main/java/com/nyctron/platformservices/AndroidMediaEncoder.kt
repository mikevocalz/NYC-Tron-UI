package com.nyctron.platformservices

import android.content.Context
import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaCodecList
import android.media.MediaFormat
import android.media.MediaMuxer
import android.net.Uri
import android.os.SystemClock
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.withContext
import java.io.Closeable
import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.nio.ByteBuffer
import java.util.UUID
import java.util.concurrent.Executors
import kotlin.coroutines.CoroutineContext

/** One serial owner: no cache deletion races with a codec writing an output. */
internal class AndroidMediaEncoder(private val context: () -> Context?) {
  private val dispatcher = Executors.newSingleThreadExecutor { work ->
    Thread(work, "NYCTronMediaEncoder").apply { isDaemon = true }
  }.asCoroutineDispatcher()
  @Volatile private var closed = false
  private var activeContext: CoroutineContext? = null
  private var deadline = 0L

  suspend fun <T> run(work: AndroidMediaEncoder.() -> T): T = withContext(dispatcher) {
    if (closed) throw MediaEncodeFailure("encode-failed", "Encoder is closed.")
    activeContext = coroutineContext
    // Encoding is bounded by the declared source sizes; 30 minutes is the
    // outer guard, not a progress promise.
    deadline = SystemClock.elapsedRealtime() + 30 * 60_000
    try { return@withContext work() }
    catch (failure: MediaEncodeFailure) { throw failure }
    catch (failure: kotlinx.coroutines.CancellationException) { throw failure }
    catch (_: SecurityException) { throw MediaEncodeFailure("permission", "Media access was denied.") }
    catch (_: Exception) { throw MediaEncodeFailure("encode-failed", "Media could not be encoded.") }
    finally { activeContext = null }
  }

  fun close() { closed = true; dispatcher.close() }

  fun checkActive() {
    activeContext?.ensureActive()
    if (closed || SystemClock.elapsedRealtime() > deadline)
      throw MediaEncodeFailure("encode-failed", "Encoding stopped or exceeded its time budget.")
  }

  fun probe(): EncoderProbeRecord {
    val video = try {
      MediaCodecList(MediaCodecList.REGULAR_CODECS)
        .findEncoderForFormat(MediaFormat.createVideoFormat("video/avc", 64, 64)) != null
    } catch (_: Exception) { false }
    val audio = try {
      MediaCodecList(MediaCodecList.REGULAR_CODECS)
        .findEncoderForFormat(MediaFormat.createAudioFormat("audio/mp4a-latm", 48_000, 2)) != null
    } catch (_: Exception) { false }
    return EncoderProbeRecord("mp4", video, audio)
  }

  // MARK: - Sources

  /** A local raw file plus its verified length. */
  private class RawSource(val input: InputStream, val pfd: android.os.ParcelFileDescriptor?, val length: Long) : Closeable {
    override fun close() { input.close(); pfd?.close() }
  }

  private fun rawSource(uri: String, expectedBytes: Long): RawSource {
    val parsed = Uri.parse(uri)
    return when (parsed.scheme) {
      "file" -> {
        val file = File(parsed.path ?: "")
        if (!file.isFile) throw MediaEncodeFailure("not-found", "Media source is unavailable.")
        if (file.length() != expectedBytes)
          throw MediaEncodeFailure("encode-failed", "The raw source is ${file.length()} bytes, expected $expectedBytes.")
        RawSource(FileInputStream(file), null, file.length())
      }
      "content" -> {
        val ctx = context() ?: throw MediaEncodeFailure("encode-failed", "Application context is unavailable.")
        val pfd = try { ctx.contentResolver.openAssetFileDescriptor(parsed, "r") }
          catch (_: Exception) { null }
          ?: throw MediaEncodeFailure("not-found", "Media source is unavailable.")
        val length = pfd.length
        if (length != expectedBytes) {
          pfd.close()
          throw MediaEncodeFailure("encode-failed", "The raw source is $length bytes, expected $expectedBytes.")
        }
        RawSource(pfd.createInputStream(), pfd, length)
      }
      else -> throw MediaEncodeFailure("unsupported-format", "A local file or granted content URI is required.")
    }
  }

  private fun intField(value: Double, name: String, min: Int, max: Int): Int {
    if (!value.isFinite() || value % 1.0 != 0.0 || value < min || value > max)
      throw MediaEncodeFailure("out-of-range", "$name must be an integer in $min..$max.")
    return value.toInt()
  }

  private class VideoSpec(
    val width: Int, val height: Int, val fpsNum: Int, val fpsDen: Int,
    val frameCount: Int, val source: RawSource,
  ) {
    val frameBytes get() = width * height * 4
    val fps get() = fpsNum.toDouble() / fpsDen.toDouble()
    val frameDurationUs get() = fpsDen.toDouble() * 1_000_000.0 / fpsNum
    val durationUs get() = frameDurationUs * frameCount
  }

  private class AudioSpec(
    val sampleRate: Int, val channels: Int, val isFloat: Boolean,
    val frames: Int, val source: RawSource,
  ) {
    val sourceBytesPerSample get() = if (isFloat) 4 else 2
    val sourceBytesPerFrame get() = channels * sourceBytesPerSample
    // The encoder always consumes interleaved signed 16-bit PCM.
    val codecBytesPerFrame get() = channels * 2
    val durationUs get() = frames.toDouble() * 1_000_000.0 / sampleRate
  }

  private fun validateVideo(record: EncodeVideoRecord): VideoSpec {
    if (record.pixelFormat != "rgba8")
      throw MediaEncodeFailure("unsupported-format", "pixelFormat must be rgba8.")
    val width = intField(record.width, "width", 1, 4096)
    val height = intField(record.height, "height", 1, 4096)
    if (width.toLong() * height > 8_294_400L)
      throw MediaEncodeFailure("out-of-range", "width×height is limited to 8294400 pixels.")
    if (width % 2 != 0 || height % 2 != 0)
      throw MediaEncodeFailure("unsupported-format", "Android H.264 encoding requires even width and height.")
    val num = intField(record.frameRateNum, "frameRateNum", 1, 1_000_000)
    val den = intField(record.frameRateDen, "frameRateDen", 1, 1_000_000)
    val fps = num.toDouble() / den
    if (fps < 0.01 || fps > 240) throw MediaEncodeFailure("out-of-range", "frame rate must be within 0.01–240 fps.")
    val count = intField(record.frameCount, "frameCount", 1, 100_000)
    val total = count.toLong() * width * height * 4L
    if (total > 8L * 1024 * 1024 * 1024)
      throw MediaEncodeFailure("out-of-range", "the raw video source is limited to 8 GiB.")
    return VideoSpec(width, height, num, den, count, rawSource(record.uri, total))
  }

  private fun validateAudio(record: EncodeAudioRecord): AudioSpec {
    if (record.sampleFormat != "f32" && record.sampleFormat != "s16")
      throw MediaEncodeFailure("unsupported-format", "sampleFormat must be f32 or s16.")
    val sampleRate = intField(record.sampleRate, "sampleRate", 8_000, 192_000)
    val channels = intField(record.channels, "channels", 1, 2)
    val frames = intField(record.frames, "frames", 1, 1_000_000_000)
    val isFloat = record.sampleFormat == "f32"
    val total = frames.toLong() * channels * (if (isFloat) 4L else 2L)
    if (total > 1024L * 1024 * 1024)
      throw MediaEncodeFailure("out-of-range", "the raw audio source is limited to 1 GiB.")
    return AudioSpec(sampleRate, channels, isFloat, frames, rawSource(record.uri, total))
  }

  // MARK: - Encode

  fun output(extension: String): File {
    val ctx = context() ?: throw MediaEncodeFailure("encode-failed", "Application context is unavailable.")
    val directory = File(ctx.cacheDir, "nyc-tron-encoder")
    if (!directory.isDirectory && !directory.mkdirs()) throw MediaEncodeFailure("encode-failed", "Encoder cache is unavailable.")
    return File(directory, UUID.randomUUID().toString() + extension)
  }

  private fun trim(current: File) {
    val files = current.parentFile?.listFiles()?.filter { it.isFile }?.sortedBy { it.lastModified() } ?: return
    var bytes = files.sumOf { it.length() }
    var count = files.size
    for (file in files) {
      if (bytes <= 256L * 1024 * 1024 && count <= 256) break
      if (file == current) continue
      checkActive()
      val size = file.length()
      if (!file.delete()) throw MediaEncodeFailure("encode-failed", "Encoder cache could not be trimmed.")
      bytes -= size; count--
    }
  }

  fun clearCache() {
    val ctx = context() ?: return
    val directory = File(ctx.cacheDir, "nyc-tron-encoder")
    directory.listFiles()?.forEach { file -> checkActive(); if (file.isFile && !file.delete()) throw MediaEncodeFailure("encode-failed", "Encoder cache could not be cleared.") }
  }

  fun encode(video: EncodeVideoRecord?, audio: EncodeAudioRecord?): EncodedMediaRecord {
    val videoSpec = video?.let { validateVideo(it) }
    val audioSpec = audio?.let { validateAudio(it) }
    if (videoSpec == null && audioSpec == null)
      throw MediaEncodeFailure("out-of-range", "encode requires a video or an audio track.")

    val output = output(".mp4")
    try {
      write(output, videoSpec, audioSpec)
      trim(output)
      val durationUs = maxOf(videoSpec?.durationUs ?: 0.0, audioSpec?.durationUs ?: 0.0)
      return EncodedMediaRecord(Uri.fromFile(output).toString(), "video/mp4", output.length().toDouble(), durationUs)
    } catch (failure: Exception) {
      output.delete()
      throw failure
    } finally {
      videoSpec?.source?.close(); audioSpec?.source?.close()
    }
  }

  // MARK: - Codec session

  private var videoCodec: MediaCodec? = null
  private var audioCodec: MediaCodec? = null
  private var muxer: MediaMuxer? = null
  private var videoTrack = -1
  private var audioTrack = -1
  private var muxerStarted = false
  private var videoFormatReady = false
  private var audioFormatReady = false
  private var videoInputDone = false
  private var audioInputDone = false
  private var videoOutputDone = false
  private var audioOutputDone = false
  private var videoSamples = 0L
  private var audioSamples = 0L
  private var videoFrame = 0
  private var audioFrameCursor = 0
  private var audioPending: ByteArray? = null
  private var audioPendingOffset = 0
  private var audioPendingPtsUs = 0L
  // Set by createVideoEncoder before any frame is converted; Flexible is
  // never accepted (see preferredColorFormat).
  private var videoColorFormat = MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420SemiPlanar
  private var rgbaFrame: ByteArray? = null
  private var yuvFrame: ByteArray? = null

  private fun write(output: File, video: VideoSpec?, audio: AudioSpec?) {
    val videoInfo = MediaCodec.BufferInfo()
    val audioInfo = MediaCodec.BufferInfo()

    try {
      // Everything that can throw lives inside the try so the finally below
      // always releases the muxer and codecs, even when encoder creation
      // fails after the muxer exists.
      muxer = MediaMuxer(output.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
      video?.let { videoCodec = createVideoEncoder(it) }
      audio?.let { audioCodec = createAudioEncoder(it) }
      while (true) {
        checkActive()
        var progress = false
        video?.let { progress = feedVideoInput(it) || progress }
        audio?.let { progress = feedAudioInput(it) || progress }
        videoCodec?.let { progress = drainOutput(it, videoInfo, true) || progress }
        audioCodec?.let { progress = drainOutput(it, audioInfo, false) || progress }
        maybeStartMuxer()
        val settled = (video == null || (videoInputDone && videoOutputDone)) &&
          (audio == null || (audioInputDone && audioOutputDone))
        if (settled) break
        if (!progress) Thread.sleep(1)
      }
      checkActive()
      if (videoSamples + audioSamples == 0L)
        throw MediaEncodeFailure("encode-failed", "The encoders produced no samples.")
    } finally {
      // MediaMuxer must be stopped (to finalize the moov atom) and released on
      // every path, including failures thrown before the happy-path stop().
      try { if (muxerStarted) muxer?.stop() } catch (_: Exception) {}
      try { muxer?.release() } catch (_: Exception) {}
      try { videoCodec?.stop() } catch (_: Exception) {}
      try { audioCodec?.stop() } catch (_: Exception) {}
      videoCodec?.release(); audioCodec?.release()
      videoCodec = null; audioCodec = null; muxer = null
      // The worker is reused across encode() calls: every piece of per-encode
      // session state must return to its initial value or the next encode
      // sees stale done-flag/sample counters.
      videoTrack = -1; audioTrack = -1
      muxerStarted = false
      videoFormatReady = false; audioFormatReady = false
      videoInputDone = false; audioInputDone = false
      videoOutputDone = false; audioOutputDone = false
      videoSamples = 0L; audioSamples = 0L
      videoFrame = 0; audioFrameCursor = 0
      audioPending = null; audioPendingOffset = 0; audioPendingPtsUs = 0L
    }
  }

  private fun maybeStartMuxer() {
    if (muxerStarted || muxer == null) return
    val vReady = videoCodec == null || videoFormatReady
    val aReady = audioCodec == null || audioFormatReady
    if (!vReady || !aReady) return
    if (videoTrack < 0 && audioTrack < 0) return
    muxer?.start()
    muxerStarted = true
  }

  private fun createVideoEncoder(spec: VideoSpec): MediaCodec {
    val codec = MediaCodec.createEncoderByType("video/avc")
    val colorFormat = preferredColorFormat(codec)
    videoColorFormat = colorFormat
    val bitrate = minOf(60_000_000, maxOf(1_000_000, (spec.width * spec.height * spec.fps * 0.1).toInt()))
    val format = MediaFormat.createVideoFormat("video/avc", spec.width, spec.height).apply {
      setInteger(MediaFormat.KEY_COLOR_FORMAT, colorFormat)
      setInteger(MediaFormat.KEY_BIT_RATE, bitrate)
      setInteger(MediaFormat.KEY_FRAME_RATE, spec.fps.toInt().coerceIn(1, 240))
      setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 2)
    }
    codec.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
    codec.start()
    return codec
  }

  /** Prefer semi-planar NV12, then planar I420. */
  private fun preferredColorFormat(codec: MediaCodec): Int {
    val caps = try { codec.codecInfo.getCapabilitiesForType("video/avc").colorFormats } catch (_: Exception) { intArrayOf() }
    for (wanted in intArrayOf(
      MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420SemiPlanar,
      MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Planar)) {
      if (caps.contains(wanted)) return wanted
    }
    // COLOR_FormatYUV420Flexible is deliberately not accepted: its plane
    // layout is codec-defined (often strided), and the ByteBuffer input API
    // used here cannot express those strides, so packed NV12 could be
    // misread. A device offering only Flexible is rejected honestly instead
    // of producing a corrupt picture.
    throw MediaEncodeFailure("unsupported-format",
      "No H.264 encoder on this device accepts tightly packed NV12 or I420 input.")
  }

  private fun createAudioEncoder(spec: AudioSpec): MediaCodec {
    val codec = MediaCodec.createEncoderByType("audio/mp4a-latm")
    val format = MediaFormat.createAudioFormat("audio/mp4a-latm", spec.sampleRate, spec.channels).apply {
      setInteger(MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC)
      setInteger(MediaFormat.KEY_BIT_RATE, if (spec.channels > 1) 128_000 else 64_000)
    }
    codec.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
    codec.start()
    return codec
  }

  // MARK: - Feeding

  private fun readFully(input: InputStream, buffer: ByteArray, offset: Int, length: Int) {
    var filled = 0
    while (filled < length) {
      checkActive()
      val n = input.read(buffer, offset + filled, length - filled)
      if (n < 0) throw MediaEncodeFailure("encode-failed", "The raw source ended early.")
      filled += n
    }
  }

  /** BT.601 limited-range RGBA → YUV for one frame, written into `dst`. */
  private fun convertFrame(rgba: ByteArray, dst: ByteArray, width: Int, height: Int, colorFormat: Int) {
    val yPlane = width * height
    // Luma for every pixel.
    for (i in 0 until yPlane) {
      val p = i * 4
      val r = rgba[p].toInt() and 0xFF; val g = rgba[p + 1].toInt() and 0xFF; val b = rgba[p + 2].toInt() and 0xFF
      val y = ((66 * r + 129 * g + 25 * b + 128) shr 8) + 16
      dst[i] = y.coerceIn(0, 255).toByte()
    }
    val chromaW = width / 2; val chromaH = height / 2
    val semiPlanar = colorFormat != MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Planar
    for (cy in 0 until chromaH) {
      for (cx in 0 until chromaW) {
        var r = 0; var g = 0; var b = 0
        for (dy in 0..1) for (dx in 0..1) {
          val p = ((cy * 2 + dy) * width + (cx * 2 + dx)) * 4
          r += rgba[p].toInt() and 0xFF; g += rgba[p + 1].toInt() and 0xFF; b += rgba[p + 2].toInt() and 0xFF
        }
        val u = (((-38 * r - 74 * g + 112 * b + 2048) shr 12) + 128).coerceIn(0, 255)
        val v = (((112 * r - 94 * g - 18 * b + 2048) shr 12) + 128).coerceIn(0, 255)
        if (semiPlanar) {
          // NV12: interleaved V then U per chroma sample.
          val idx = yPlane + (cy * chromaW + cx) * 2
          dst[idx] = v.toByte(); dst[idx + 1] = u.toByte()
        } else {
          // I420: separate U then V planes after luma.
          val plane = chromaW * chromaH
          dst[yPlane + cy * chromaW + cx] = u.toByte()
          dst[yPlane + plane + cy * chromaW + cx] = v.toByte()
        }
      }
    }
  }

  private fun feedVideoInput(spec: VideoSpec): Boolean {
    val codec = videoCodec ?: return false
    // Never feed before the muxer started: samples written early would have
    // no track to land on and would be silently dropped.
    if (!muxerStarted || videoInputDone) return false
    val index = codec.dequeueInputBuffer(0)
    if (index < 0) return false
    val buffer = codec.getInputBuffer(index)
      ?: throw MediaEncodeFailure("encode-failed", "Video input buffer is unavailable.")
    return if (videoFrame < spec.frameCount) {
      if (rgbaFrame == null || rgbaFrame!!.size != spec.frameBytes) rgbaFrame = ByteArray(spec.frameBytes)
      val rgba = rgbaFrame!!
      readFully(spec.source.input, rgba, 0, spec.frameBytes)
      val needed = spec.width * spec.height * 3 / 2
      if (yuvFrame == null || yuvFrame!!.size != needed) yuvFrame = ByteArray(needed)
      convertFrame(rgba, yuvFrame!!, spec.width, spec.height, videoColorFormat)
      if (buffer.capacity() < needed)
        throw MediaEncodeFailure("encode-failed", "The video input buffer is smaller than one frame.")
      buffer.clear()
      buffer.put(yuvFrame!!, 0, needed)
      val pts = Math.round(videoFrame * spec.frameDurationUs)
      codec.queueInputBuffer(index, 0, needed, pts, 0)
      videoFrame++
      true
    } else {
      codec.queueInputBuffer(index, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
      videoInputDone = true
      true
    }
  }

  // MARK: - Audio feeding

  private fun readAudioChunk(spec: AudioSpec): Pair<ByteArray, Int> {
    // 4096 codec frames per chunk (stereo s16 = 16 KiB).
    val frames = minOf(4096, spec.frames - audioFrameCursor)
    val sourceBytes = frames * spec.sourceBytesPerFrame
    val raw = ByteArray(sourceBytes)
    readFully(spec.source.input, raw, 0, sourceBytes)
    val out = ByteArray(frames * spec.codecBytesPerFrame)
    if (spec.isFloat) {
      // f32 little-endian interleaved → s16 little-endian interleaved.
      var si = 0; var di = 0
      val sampleCount = frames * spec.channels
      for (s in 0 until sampleCount) {
        val bits = (raw[si].toInt() and 0xFF) or ((raw[si + 1].toInt() and 0xFF) shl 8) or
          ((raw[si + 2].toInt() and 0xFF) shl 16) or ((raw[si + 3].toInt() and 0xFF) shl 24)
        val value = java.lang.Float.intBitsToFloat(bits)
        val clamped = value.coerceIn(-1.0f, 1.0f)
        val short = (clamped * 32767.0f).toInt().coerceIn(-32768, 32767)
        out[di] = (short and 0xFF).toByte(); out[di + 1] = ((short shr 8) and 0xFF).toByte()
        si += 4; di += 2
      }
    } else {
      raw.copyInto(out)
    }
    audioFrameCursor += frames
    return Pair(out, frames)
  }

  private fun feedAudioInput(spec: AudioSpec): Boolean {
    val codec = audioCodec ?: return false
    if (!muxerStarted || audioInputDone) return false
    val index = codec.dequeueInputBuffer(0)
    if (index < 0) return false
    val buffer = codec.getInputBuffer(index)
      ?: throw MediaEncodeFailure("encode-failed", "Audio input buffer is unavailable.")
    return try {
      if (audioPending == null) {
        val consumedBefore = audioFrameCursor
        if (consumedBefore >= spec.frames) {
          codec.queueInputBuffer(index, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
          audioInputDone = true
          return true
        }
        val (bytes, _) = readAudioChunk(spec)
        audioPending = bytes
        audioPendingOffset = 0
        audioPendingPtsUs = Math.round((consumedBefore) * 1_000_000.0 / spec.sampleRate)
      }
      val pending = audioPending!!
      val capacity = buffer.capacity()
      val remaining = pending.size - audioPendingOffset
      val n = minOf(capacity, remaining)
      // AAC input must be whole codec frames: a buffer boundary may not split
      // a frame, so round the write down to a frame multiple and leave the
      // tail in `audioPending` for the next input buffer.
      val aligned = n - (n % spec.codecBytesPerFrame)
      if (aligned <= 0)
        throw MediaEncodeFailure("encode-failed", "The audio input buffer is smaller than one codec frame.")
      buffer.clear()
      buffer.put(pending, audioPendingOffset, aligned)
      val pts = audioPendingPtsUs + Math.round((audioPendingOffset / spec.codecBytesPerFrame) * 1_000_000.0 / spec.sampleRate)
      audioPendingOffset += aligned
      codec.queueInputBuffer(index, 0, aligned, pts, 0)
      if (audioPendingOffset >= pending.size) {
        audioPending = null
        // If the chunk ended exactly at the source end, EOS rides the next buffer.
      }
      true
    } catch (failure: MediaEncodeFailure) {
      throw failure
    }
  }

  // MARK: - Draining

  /** Writes one codec's available outputs to the muxer. Returns true on progress. */
  private fun drainOutput(codec: MediaCodec, info: MediaCodec.BufferInfo, isVideo: Boolean): Boolean {
    var progress = false
    while (true) {
      checkActive()
      val index = codec.dequeueOutputBuffer(info, 0)
      when {
        index == MediaCodec.INFO_TRY_AGAIN_LATER -> return progress
        index == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED -> {
          progress = true
          if (isVideo) { videoTrack = muxer?.addTrack(codec.outputFormat) ?: -1; videoFormatReady = true }
          else { audioTrack = muxer?.addTrack(codec.outputFormat) ?: -1; audioFormatReady = true }
          maybeStartMuxer()
        }
        index >= 0 -> {
          progress = true
          val buffer = codec.getOutputBuffer(index)
          val eos = info.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0
          val hasData = info.size > 0 && buffer != null
          try {
            if (hasData && muxerStarted) {
              buffer!!.position(info.offset); buffer.limit(info.offset + info.size)
              if (isVideo) { muxer?.writeSampleData(videoTrack, buffer, info); videoSamples++ }
              else { muxer?.writeSampleData(audioTrack, buffer, info); audioSamples++ }
            }
          } finally {
            codec.releaseOutputBuffer(index, false)
          }
          if (eos) {
            if (isVideo) videoOutputDone = true else audioOutputDone = true
            return true
          }
        }
        else -> return progress
      }
    }
  }
}
