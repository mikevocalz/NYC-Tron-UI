package com.nyctron.platformservices

import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.currentActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Android side of @nyc-tron/platform-services/haptics (N-05).
 *
 * View.performHapticFeedback on the Activity's decor view: no VIBRATE
 * permission, and Android skips it when the person turned touch feedback off.
 * The opt-out and rate limit live in JS.
 */
@ExpoModule("NYCTronHaptics")
class NYCTronHapticsModule : Module() {
  /** False when there is no Activity, the kind is unknown, or the OS declined. */
  @JS
  suspend fun play(kind: String): Boolean {
    val constant = HapticConstant.forKind(kind) ?: return false
    val activity = currentActivity ?: return false
    return withContext(Dispatchers.Main.immediate) {
      activity.window?.decorView?.performHapticFeedback(constant) ?: false
    }
  }

  /** Android plays feedback without warm-up; kept so both platforms share one JS contract. */
  @JS
  fun prepare(kind: String) = Unit
}
