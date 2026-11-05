package com.nyctron.instruments

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

// SDK 58's supported ExpoUIView is used because 2.0 native-view macros are unavailable.
class NYCTronInstrumentsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NYCTronInstruments")
    ExpoUIView<TronArcKnobProps>("TronArcKnobView") {
      val onPreview by Event<TronValuePayload>()
      val onCommit by Event<TronValuePayload>()
      Content { props ->
        TronArcKnobContent(props, { onPreview(it) }, { onCommit(it) })
      }
    }
    ExpoUIView<TronXYPadProps>("TronXYPadView") {
      val onPreview by Event<TronXYValuePayload>()
      val onCommit by Event<TronXYValuePayload>()
      Content { props ->
        TronXYPadContent(props, { onPreview(it) }, { onCommit(it) })
      }
    }
  }
}
