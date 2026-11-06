package com.nyctron.hardwarekeys

import android.view.View
import android.view.ViewTreeObserver

/** The two listeners UnhandledKeyAttacher puts on one window's root view, kept for removal. */
internal class WindowAttachment(
  val keyListener: View.OnUnhandledKeyEventListener,
  val focusListener: ViewTreeObserver.OnWindowFocusChangeListener,
)
