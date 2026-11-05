package com.nyctron.hardwarekeys

import android.app.Activity
import android.os.Build
import android.view.KeyEvent
import android.view.View
import android.view.ViewTreeObserver
import android.view.inspector.WindowInspector
import androidx.annotation.RequiresApi
import java.util.WeakHashMap

/**
 * Hangs an unhandled-key listener on the root view of every window in the
 * process, so keys reach the module from the Activity and from the Dialog
 * windows React Native's Modal opens.
 *
 * Unhandled is the point: a focused EditText or a control that consumes a key
 * keeps it, and only keys no view handled reach [onKey]. A new window (a
 * Modal opening) takes focus from the old one; each attached root reports
 * that focus change, and the attacher scans again to pick the window up.
 *
 * Main thread only. Android 9 (API 28) added the unhandled-key listener;
 * WindowInspector, which lists Dialog windows, needs Android 10 (API 29),
 * so on Android 9 only the Activity window is covered.
 */
@RequiresApi(Build.VERSION_CODES.P)
internal class UnhandledKeyAttacher(private val onKey: (KeyEvent) -> Boolean) {
  private val attached = WeakHashMap<View, WindowAttachment>()

  fun attachAll(activity: Activity?) {
    val roots = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      WindowInspector.getGlobalWindowViews()
    } else {
      listOfNotNull(activity?.window?.decorView)
    }
    roots.forEach { attach(it, activity) }
  }

  fun detachAll() {
    for ((root, attachment) in attached) {
      root.removeOnUnhandledKeyEventListener(attachment.keyListener)
      if (root.viewTreeObserver.isAlive) {
        root.viewTreeObserver.removeOnWindowFocusChangeListener(attachment.focusListener)
      }
    }
    attached.clear()
  }

  private fun attach(root: View, activity: Activity?) {
    if (attached.containsKey(root)) {
      return
    }
    val keyListener = View.OnUnhandledKeyEventListener { _, event -> onKey(event) }
    val focusListener = ViewTreeObserver.OnWindowFocusChangeListener { attachAll(activity) }
    root.addOnUnhandledKeyEventListener(keyListener)
    root.viewTreeObserver.addOnWindowFocusChangeListener(focusListener)
    attached[root] = WindowAttachment(keyListener, focusListener)
  }
}
