package com.nyctron.platformservices

import android.os.Build
import android.view.HapticFeedbackConstants

/**
 * HapticFeedbackConstants for the kinds JS sends (HapticKind in
 * src/haptics/kinds.ts), with the closest older constant where a newer one
 * is unavailable.
 */
internal object HapticConstant {
  /** Null for a kind this build does not know. */
  fun forKind(kind: String): Int? = when (kind) {
    "selection" -> HapticFeedbackConstants.CLOCK_TICK
    "detent" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      HapticFeedbackConstants.SEGMENT_FREQUENT_TICK
    } else {
      HapticFeedbackConstants.CLOCK_TICK
    }
    "light" -> HapticFeedbackConstants.VIRTUAL_KEY
    "medium" -> HapticFeedbackConstants.CONTEXT_CLICK
    "heavy" -> HapticFeedbackConstants.LONG_PRESS
    "success" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      HapticFeedbackConstants.CONFIRM
    } else {
      HapticFeedbackConstants.VIRTUAL_KEY
    }
    "warning", "error" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      HapticFeedbackConstants.REJECT
    } else {
      HapticFeedbackConstants.LONG_PRESS
    }
    "gesture-start" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      HapticFeedbackConstants.GESTURE_START
    } else {
      HapticFeedbackConstants.VIRTUAL_KEY
    }
    "gesture-end" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      HapticFeedbackConstants.GESTURE_END
    } else {
      HapticFeedbackConstants.CONTEXT_CLICK
    }
    else -> null
  }
}
