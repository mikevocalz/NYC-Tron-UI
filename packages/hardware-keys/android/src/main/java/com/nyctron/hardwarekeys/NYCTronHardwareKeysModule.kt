package com.nyctron.hardwarekeys

import android.os.Build
import android.view.KeyEvent
import com.facebook.react.bridge.LifecycleEventListener
import io.github.expo.modules.v2.Event
import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.currentActivity
import io.github.expo.modules.v2.react.reactContextOrNull
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

/**
 * Android side of @nyc-tron/hardware-keys.
 *
 * React Native delivers no hardware key events on Android. This module
 * listens for the key events no view handled (see [UnhandledKeyAttacher]) and
 * sends JS the ones that match a registered binding, consuming them; while
 * recording it sends and consumes every key.
 *
 * Threading: the bindings, the recording flag and the attacher are touched
 * only on the main thread. The JS entry points arrive on the JS thread and
 * cross into [scope] once.
 */
@ExpoModule("NYCTronHardwareKeys")
class NYCTronHardwareKeysModule : Module() {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
  private var bindings: List<KeyBindingRecord> = emptyList()
  private var recording = false
  private var lifecycleRegistered = false
  private val attacher: UnhandledKeyAttacher? =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) UnhandledKeyAttacher(::onKey) else null

  // The Activity a resume brings back may be a new one; scan its windows again.
  private val lifecycleListener = object : LifecycleEventListener {
    override fun onHostResume() {
      refresh()
    }

    override fun onHostPause() = Unit

    override fun onHostDestroy() {
      attacher?.detachAll()
    }
  }

  /** JS subscribes with `addListener("chord", listener)`. */
  @Event("chord")
  val onChord = event<KeyChordRecord>()

  /** The unhandled-key listener needs Android 9 (API 28). */
  @JS
  fun isSupported(): Boolean = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P

  @JS
  fun setBindings(bindings: List<KeyBindingRecord>) {
    scope.launch {
      this@NYCTronHardwareKeysModule.bindings = bindings
      refresh()
    }
  }

  @JS
  fun setRecording(active: Boolean) {
    scope.launch {
      recording = active
      refresh()
    }
  }

  override fun onDestroy() {
    scope.cancel()
    attacher?.detachAll()
    if (lifecycleRegistered) {
      reactContextOrNull?.removeLifecycleEventListener(lifecycleListener)
      lifecycleRegistered = false
    }
  }

  // Main thread. Attach while anything wants keys; detach when nothing does.
  private fun refresh() {
    val attacher = attacher ?: return
    if (bindings.isEmpty() && !recording) {
      attacher.detachAll()
      return
    }
    if (!lifecycleRegistered) {
      reactContextOrNull?.let {
        it.addLifecycleEventListener(lifecycleListener)
        lifecycleRegistered = true
      }
    }
    attacher.attachAll(currentActivity)
  }

  // Main thread (ViewRootImpl delivers unhandled keys there). Key-up is
  // consumed with its key-down so no view sees half of a press.
  private fun onKey(event: KeyEvent): Boolean {
    val chord = event.toKeyChordRecord(recording) ?: return false
    if (recording) {
      if (event.action == KeyEvent.ACTION_DOWN) {
        onChord.emit(chord)
      }
      return true
    }
    if (bindings.none { it.matches(chord) }) {
      return false
    }
    if (event.action == KeyEvent.ACTION_DOWN) {
      onChord.emit(chord)
    }
    return true
  }
}
