package com.nyctron.hardwarekeys

import io.github.expo.modules.v2.Record

/**
 * One binding JS asks Android to intercept. `binding` is the portable string
 * ("Mod+Shift+S"); `key` its canonical key ("S", "ArrowUp", "F5"). On Android
 * `Mod` is Control. `title` and `overridesSystem` serve iOS and are ignored here.
 */
@Record
data class KeyBindingRecord(
  val binding: String,
  val key: String,
  val mod: Boolean,
  val ctrl: Boolean,
  val alt: Boolean,
  val shift: Boolean,
  val title: String,
  val overridesSystem: Boolean,
)
