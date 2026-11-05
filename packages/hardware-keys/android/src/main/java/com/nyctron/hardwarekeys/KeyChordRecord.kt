package com.nyctron.hardwarekeys

import io.github.expo.modules.v2.Record

/**
 * One hardware keydown as JS receives it. Modifier fields are the physical
 * keys; JS maps Control to `Mod` with bindingFromChord(chord, false).
 */
@Record
data class KeyChordRecord(
  val key: String,
  val ctrlKey: Boolean,
  val metaKey: Boolean,
  val altKey: Boolean,
  val shiftKey: Boolean,
  val isRepeat: Boolean,
  val recording: Boolean,
)
