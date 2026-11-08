package com.nyctron.platformservices

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Locale
import java.util.concurrent.atomic.AtomicInteger

/**
 * Owns android.speech.SpeechRecognizer sessions. The recognizer owns the
 * microphone itself; this class only configures the intent, routes results
 * to "speech" events and enforces the session cap. All recognizer calls run
 * on the main thread, where RecognitionListener callbacks arrive.
 *
 * On-device honesty: `onDeviceOnly` is a privacy promise, so it requires
 * the API-31+ on-device recognizer; when that is unavailable `start`
 * rejects "unsupported-format" instead of silently falling back to a
 * network-capable recognizer. `onDeviceOnly: false` may still route audio
 * off-device — `probe().networkPossible` stays true and the JS consent
 * gate requires `networkRecognition` before that path is reachable.
 * EXTRA_PREFER_OFFLINE remains only a hint, never a guarantee.
 */
internal class AndroidSpeechRecognizer(
  private val context: () -> Context?,
  private val emit: (SpeechEventRecord) -> Unit,
) {
  /** Matches MAX_SPEECH_SESSIONS in src/speech/recognizer.ts. */
  private val maxSessions = 4

  private class Entry(
    val id: String,
    val recognizer: SpeechRecognizer,
    var ended: Boolean = false,
    var aborted: Boolean = false,
    var stopping: Boolean = false,
  )

  private val counter = AtomicInteger(0)
  private val sessions = HashMap<String, Entry>()

  fun probe(): SpeechProbeRecord {
    val ctx = context() ?: return SpeechProbeRecord(available = false, onDevice = false, networkPossible = true)
    val available = SpeechRecognizer.isRecognitionAvailable(ctx)
    // The on-device API exists from API 31; older releases only get the
    // EXTRA_PREFER_OFFLINE hint, which is not a guarantee.
    val onDevice = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
      SpeechRecognizer.isOnDeviceRecognitionAvailable(ctx)
    return SpeechProbeRecord(available = available, onDevice = onDevice, networkPossible = true)
  }

  suspend fun start(options: SpeechStartRecord): SpeechSessionRecord = withContext(Dispatchers.Main) {
    val ctx = context() ?: throw SpeechFailure("unsupported-format", "No Android context is available.")
    if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED)
      throw SpeechFailure("permission", "Microphone permission was denied.")
    if (!SpeechRecognizer.isRecognitionAvailable(ctx))
      throw SpeechFailure("unsupported-format", "No speech recognizer is available on this device.")
    if (sessions.size >= maxSessions)
      throw SpeechFailure("busy", "At most $maxSessions speech sessions may run at once.")

    val recognizer = if (options.onDeviceOnly) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
        SpeechRecognizer.isOnDeviceRecognitionAvailable(ctx)
      ) {
        SpeechRecognizer.createOnDeviceSpeechRecognizer(ctx)
      } else {
        // No honest fallback: the network-capable recognizer could send
        // audio off-device, and onDeviceOnly callers never granted
        // networkRecognition consent.
        throw SpeechFailure("unsupported-format", "On-device speech recognition is unavailable on this device.")
      }
    } else {
      // onDeviceOnly=false may route audio off-device; the JS layer has
      // already required networkRecognition consent to reach this branch.
      SpeechRecognizer.createSpeechRecognizer(ctx)
    }

    val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
      putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
      putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
      putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
      putExtra(RecognizerIntent.EXTRA_LANGUAGE, options.locale.ifEmpty { Locale.getDefault().toLanguageTag() })
      if (options.onDeviceOnly) putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
      // EXTRA_BIASING_STRINGS exists from API 33; older releases ignore hints.
      if (options.hints.isNotEmpty() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
        putStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, ArrayList(options.hints))
    }

    val id = "android-${counter.incrementAndGet()}"
    val entry = Entry(id, recognizer)
    sessions[id] = entry
    recognizer.setRecognitionListener(object : RecognitionListener {
      override fun onReadyForSpeech(params: Bundle?) {}
      override fun onBeginningOfSpeech() {}
      override fun onRmsChanged(rmsdB: Float) {}
      override fun onBufferReceived(buffer: ByteArray?) {}
      override fun onEndOfSpeech() {}
      override fun onEvent(eventType: Int, params: Bundle?) {}

      override fun onPartialResults(partialResults: Bundle?) {
        val text = partialResults
          ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
          ?.firstOrNull()?.trim().orEmpty()
        if (text.isNotEmpty()) emitEvent(entry, "partial", text = text)
      }

      override fun onResults(results: Bundle?) {
        val text = results
          ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
          ?.firstOrNull()?.trim().orEmpty()
        if (text.isNotEmpty()) emitEvent(entry, "final", text = text)
        // Android has no separate "session ended" callback: results (or an
        // error) are terminal, so the end event is emitted here.
        finish(entry, "end", reason = if (entry.stopping) "stopped" else "finished")
      }

      override fun onError(error: Int) {
        when {
          entry.aborted -> finish(entry, "end", reason = "aborted")
          error == SpeechRecognizer.ERROR_NO_MATCH || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT ->
            finish(entry, "end", reason = "no-speech")
          error == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS || error == SpeechRecognizer.ERROR_AUDIO ->
            finish(entry, "error", code = "permission", message = "Speech recognition lost audio access.")
          else -> finish(entry, "error", code = "recognition-failed", message = "Speech recognition failed (error $error).")
        }
      }
    })
    try {
      recognizer.startListening(intent)
    } catch (failure: SecurityException) {
      sessions.remove(id)
      recognizer.destroy()
      throw SpeechFailure("permission", "Microphone permission was denied.")
    } catch (failure: Exception) {
      sessions.remove(id)
      recognizer.destroy()
      throw SpeechFailure("recognition-failed", "The recognizer refused to start.")
    }
    SpeechSessionRecord(session = id)
  }

  suspend fun stop(session: String) = withContext(Dispatchers.Main) {
    val entry = sessions[session] ?: throw SpeechFailure("not-found", "The speech session is unknown or already finished.")
    if (entry.ended) throw SpeechFailure("not-found", "The speech session is unknown or already finished.")
    entry.stopping = true
    entry.recognizer.stopListening()
  }

  suspend fun abort(session: String) = withContext(Dispatchers.Main) {
    val entry = sessions[session] ?: return@withContext
    entry.aborted = true
    entry.recognizer.cancel()
    finish(entry, "end", reason = "aborted")
  }

  fun close() {
    // Sessions live on the main thread; post the teardown there.
    android.os.Handler(android.os.Looper.getMainLooper()).post {
      // Snapshot: finish() removes from `sessions` during iteration.
      for (entry in sessions.values.toList()) finish(entry, "end", reason = "aborted")
    }
  }

  // MARK: - Events (main thread only)

  private fun emitEvent(entry: Entry, kind: String, text: String = "") {
    if (entry.ended) return
    emit(SpeechEventRecord(session = entry.id, kind = kind, text = text, wordsJson = "", reason = "", code = "", message = ""))
  }

  /** Tears the session down and emits exactly one terminal event. Idempotent. */
  private fun finish(entry: Entry, kind: String, reason: String = "", code: String = "", message: String = "") {
    if (entry.ended) return
    entry.ended = true
    sessions.remove(entry.id)
    entry.recognizer.destroy()
    emit(SpeechEventRecord(session = entry.id, kind = kind, text = "", wordsJson = "", reason = reason, code = code, message = message))
  }
}
