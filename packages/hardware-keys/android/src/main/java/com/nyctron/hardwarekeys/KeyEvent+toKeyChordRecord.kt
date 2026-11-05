package com.nyctron.hardwarekeys

import android.view.KeyEvent

/**
 * The chord for a key event, or null for a lone modifier or a key with no
 * name or character. The character keeps Shift but drops Control, Alt and
 * Meta, which matches a browser's KeyboardEvent.key ("!" for Shift+1).
 */
internal fun KeyEvent.toKeyChordRecord(recording: Boolean): KeyChordRecord? {
  val name = KitKeyName.fromKeyCode(keyCode) ?: run {
    val char = getUnicodeChar(metaState and KeyEvent.META_SHIFT_MASK)
    if (char <= 0 || Character.isISOControl(char)) null else String(Character.toChars(char))
  } ?: return null
  return KeyChordRecord(
    key = name,
    ctrlKey = isCtrlPressed,
    metaKey = isMetaPressed,
    altKey = isAltPressed,
    shiftKey = isShiftPressed,
    isRepeat = repeatCount > 0,
    recording = recording,
  )
}
