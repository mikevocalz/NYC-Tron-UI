package com.nyctron.platformservices

import android.content.Context
import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaExtractor
import android.media.MediaFormat
import android.net.Uri
import android.os.SystemClock
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileNotFoundException
import java.util.UUID
import java.util.concurrent.Executors
import kotlin.coroutines.CoroutineContext

/** One serial owner: no cache deletion races with a codec writing an output. */
internal class AndroidMediaDecoder(private val context: () -> Context?) {
  private val dispatcher = Executors.newSingleThreadExecutor { work ->
    Thread(work, "NYCTronMediaDecoder").apply { isDaemon = true }
  }.asCoroutineDispatcher()
  @Volatile private var closed = false
  private var activeContext: CoroutineContext? = null
  private var deadline = 0L

  suspend fun <T> run(work: AndroidMediaDecoder.() -> T): T = withContext(dispatcher) {
    if (closed) throw MediaDecodeFailure("decode-failed", "Decoder is closed.")
    activeContext = coroutineContext
    deadline = SystemClock.elapsedRealtime() + 30_000
    try { return@withContext work() }
    catch (failure: MediaDecodeFailure) { throw failure }
    catch (failure: kotlinx.coroutines.CancellationException) { throw failure }
    catch (_: SecurityException) { throw MediaDecodeFailure("permission", "Media access was denied.") }
    catch (_: FileNotFoundException) { throw MediaDecodeFailure("not-found", "Media source is unavailable.") }
    catch (_: Exception) { throw MediaDecodeFailure("decode-failed", "Media could not be decoded.") }
    finally { activeContext = null }
  }

  fun close() { closed = true; dispatcher.close() }

  fun checkActive() {
    activeContext?.ensureActive()
    if (closed || SystemClock.elapsedRealtime() > deadline)
      throw MediaDecodeFailure("decode-failed", "Decoding stopped or exceeded its time budget.")
  }

  private fun extractor(uri: String): MediaExtractor {
    val parsed = Uri.parse(uri)
    if (parsed.scheme !in listOf("file", "content"))
      throw MediaDecodeFailure("unsupported-format", "A local file or granted content URI is required.")
    val ctx = context() ?: throw MediaDecodeFailure("decode-failed", "Application context is unavailable.")
    if (parsed.scheme == "file" && !File(parsed.path ?: "").isFile)
      throw MediaDecodeFailure("not-found", "Media source is unavailable.")
    val result = MediaExtractor()
    try { result.setDataSource(ctx, parsed, null); return result }
    catch (failure: Exception) { result.release(); throw failure }
  }

  fun probe(uri: String): MediaProbeRecord {
    val source = extractor(uri)
    try {
      var video: MediaFormat? = null; var audio: MediaFormat? = null; var duration = 0L
      for (i in 0 until source.trackCount) {
        checkActive()
        val format = source.getTrackFormat(i)
        if (format.containsKey(MediaFormat.KEY_DURATION)) duration = maxOf(duration, format.getLong(MediaFormat.KEY_DURATION))
        val mime = format.getString(MediaFormat.KEY_MIME) ?: continue
        if (mime.startsWith("video/") && video == null) video = format
        if (mime.startsWith("audio/") && audio == null) audio = format
      }
      if (video == null && audio == null) throw MediaDecodeFailure("unsupported-format", "No audio or video track was found.")
      return MediaProbeRecord(duration.toDouble(), video != null,
        number(video, MediaFormat.KEY_WIDTH), number(video, MediaFormat.KEY_HEIGHT), number(video, MediaFormat.KEY_FRAME_RATE),
        video?.getString(MediaFormat.KEY_MIME) ?: "", audio != null,
        number(audio, MediaFormat.KEY_SAMPLE_RATE), number(audio, MediaFormat.KEY_CHANNEL_COUNT), audio?.getString(MediaFormat.KEY_MIME) ?: "")
    } finally { source.release() }
  }

  private fun number(format: MediaFormat?, key: String): Double {
    if (format == null || !format.containsKey(key)) return 0.0
    return try { format.getInteger(key).toDouble() } catch (_: ClassCastException) { format.getFloat(key).toDouble() }
  }

  fun output(extension: String): File {
    val ctx = context() ?: throw MediaDecodeFailure("decode-failed", "Application context is unavailable.")
    val directory = File(ctx.cacheDir, "nyc-tron-decoder")
    if (!directory.isDirectory && !directory.mkdirs()) throw MediaDecodeFailure("decode-failed", "Decoder cache is unavailable.")
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
      if (!file.delete()) throw MediaDecodeFailure("decode-failed", "Decoder cache could not be trimmed.")
      bytes -= size; count--
    }
  }

  fun clearCache() {
    val ctx = context() ?: return
    val directory = File(ctx.cacheDir, "nyc-tron-decoder")
    directory.listFiles()?.forEach { file -> checkActive(); if (file.isFile && !file.delete()) throw MediaDecodeFailure("decode-failed", "Decoder cache could not be cleared.") }
  }

  private fun micros(value: Double): Long {
    if (!value.isFinite() || value < 0 || value % 1 != 0.0 || value > 9_007_199_254_740_991.0)
      throw MediaDecodeFailure("out-of-range", "Media time must be a nonnegative integer.")
    return value.toLong()
  }

  fun frame(uri: String, request: FrameRequestRecord): DecodedFrameRecord {
    val time = micros(request.timeUs)
    if (request.maxWidth !in 1.0..4096.0 || request.maxHeight !in 1.0..4096.0 || request.maxWidth % 1 != 0.0 || request.maxHeight % 1 != 0.0)
      throw MediaDecodeFailure("out-of-range", "Frame bounds must be integers from 1 to 4096.")
    var result: DecodedFrameRecord? = null
    decode(uri, "video/", time, { format ->
      format.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Flexible)
    }) { codec, index, info, format ->
      if (info.size == 0 || info.presentationTimeUs < time) return@decode false
      val image = codec.getOutputImage(index) ?: throw MediaDecodeFailure("unsupported-format", "Codec does not expose YUV frames.")
      image.use { frame ->
        val output = output(".jpg")
        try {
          val dimensions = AndroidDecodedImage.write(frame, format, request, output, ::checkActive)
          trim(output)
          result = DecodedFrameRecord(Uri.fromFile(output).toString(), info.presentationTimeUs.toDouble(), dimensions.first.toDouble(), dimensions.second.toDouble())
        } catch (failure: Exception) { output.delete(); throw failure }
      }
      true
    }
    return result ?: throw MediaDecodeFailure("out-of-range", "No video frame exists at this media time.")
  }

  fun audio(uri: String, request: AudioRequestRecord): DecodedAudioRecord {
    val start = micros(request.startUs); val duration = micros(request.durationUs)
    if (duration !in 1..60_000_000L || (request.sampleRate != 0.0 && (request.sampleRate !in 8000.0..192000.0 || request.sampleRate % 1 != 0.0)))
      throw MediaDecodeFailure("out-of-range", "Invalid audio span or sample rate.")
    val output = output(".f32")
    try {
      AndroidDecodedPcm(output, start, duration, request.sampleRate.toInt()).use { sink ->
        decode(uri, "audio/", start, {}) { codec, index, info, format ->
          if (info.size > 0) {
            val bytes = codec.getOutputBuffer(index) ?: throw MediaDecodeFailure("decode-failed", "Audio buffer is unavailable.")
            sink.accept(bytes, info, format, ::checkActive)
          }
          info.presentationTimeUs >= start + duration
        }
        val record = sink.record()
        trim(output)
        return record
      }
    } catch (failure: Exception) { output.delete(); throw failure }
  }

  /** Decode from a preceding sync sample; report actual output PTS, never a guessed seek target. */
  private fun decode(uri: String, prefix: String, start: Long, configure: (MediaFormat) -> Unit,
    consume: (MediaCodec, Int, MediaCodec.BufferInfo, MediaFormat) -> Boolean) {
    val source = extractor(uri)
    var codec: MediaCodec? = null
    try {
      val track = (0 until source.trackCount).firstOrNull { source.getTrackFormat(it).getString(MediaFormat.KEY_MIME)?.startsWith(prefix) == true }
        ?: throw MediaDecodeFailure("unsupported-format", "The requested media track is absent.")
      val format = source.getTrackFormat(track)
      if (format.containsKey(MediaFormat.KEY_DURATION) && start >= format.getLong(MediaFormat.KEY_DURATION))
        throw MediaDecodeFailure("out-of-range", "Media time is past the track duration.")
      if (prefix == "video/" && number(format, MediaFormat.KEY_WIDTH) * number(format, MediaFormat.KEY_HEIGHT) > 33_554_432)
        throw MediaDecodeFailure("unsupported-format", "Source frame exceeds the decoder memory budget.")
      source.selectTrack(track)
      // AAC/Opus decoders need preroll; trimming begins only after decoded PTS reaches the requested interval.
      val seek = if (prefix == "audio/") maxOf(0L, start - 1_000_000) else start
      source.seekTo(seek, MediaExtractor.SEEK_TO_PREVIOUS_SYNC)
      configure(format)
      val mime = format.getString(MediaFormat.KEY_MIME) ?: throw MediaDecodeFailure("unsupported-format", "Track codec is absent.")
      val decoder = MediaCodec.createDecoderByType(mime); codec = decoder
      decoder.configure(format, null, null, 0); decoder.start()
      var endedInput = false
      val info = MediaCodec.BufferInfo()
      while (true) {
        checkActive()
        if (!endedInput) {
          val input = decoder.dequeueInputBuffer(10_000)
          if (input >= 0) {
            val buffer = decoder.getInputBuffer(input) ?: throw MediaDecodeFailure("decode-failed", "Input buffer is unavailable.")
            val size = source.readSampleData(buffer, 0)
            if (size < 0) {
              decoder.queueInputBuffer(input, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM); endedInput = true
            } else {
              if (source.sampleFlags and MediaExtractor.SAMPLE_FLAG_ENCRYPTED != 0)
                throw MediaDecodeFailure("unsupported-format", "Encrypted tracks require an application DRM session.")
              decoder.queueInputBuffer(input, 0, size, source.sampleTime, 0); source.advance()
            }
          }
        }
        val index = decoder.dequeueOutputBuffer(info, 10_000)
        if (index >= 0) {
          val done = try { consume(decoder, index, info, decoder.outputFormat) }
            finally { decoder.releaseOutputBuffer(index, false) }
          if (done || info.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) return
        }
      }
    } finally { try { codec?.release() } finally { source.release() } }
  }
}
