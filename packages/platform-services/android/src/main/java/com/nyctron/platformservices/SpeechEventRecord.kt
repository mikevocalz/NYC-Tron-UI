package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/**
 * One speech session event as JS receives it. Flat on purpose: JS reads it
 * into SpeechSessionEvent (toSpeechSessionEvent in src/speech/recognizer.ts)
 * and ignores the fields a kind does not use. Empty strings mean absent.
 */
@Record
data class SpeechEventRecord(
  val session: String,
  val kind: String,
  /** partial/final transcript text. */
  val text: String,
  /** final only: JSON array of {text,startS,endS}; empty when the platform has no word timings. */
  val wordsJson: String,
  /** end only: "finished" | "stopped" | "aborted" | "no-speech" | "ended". */
  val reason: String,
  /** error only: the JS SpeechErrorCode. */
  val code: String,
  val message: String,
)
