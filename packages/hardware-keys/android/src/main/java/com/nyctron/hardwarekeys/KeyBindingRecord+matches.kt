package com.nyctron.hardwarekeys

/**
 * Whether `chord` is this binding, by the rule bindingFromChord applies off
 * Apple hardware: Control is `Mod`, Meta is ignored, and character keys
 * compare case-insensitively (canonical keys are uppercase).
 */
internal fun KeyBindingRecord.matches(chord: KeyChordRecord): Boolean {
  if (ctrl) {
    // "Ctrl" is a distinct modifier only on Apple keyboards; JS never sends it here.
    return false
  }
  val sameKey = if (key.length == 1) key.equals(chord.key, ignoreCase = true) else key == chord.key
  return sameKey && mod == chord.ctrlKey && alt == chord.altKey && shift == chord.shiftKey
}
