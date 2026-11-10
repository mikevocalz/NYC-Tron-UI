package com.nyctron.instruments

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

// SDK 58's supported ExpoUIView is used because 2.0 native-view macros are unavailable.
class NYCTronInstrumentsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NYCTronInstruments")
    ExpoUIView<TronPointerInputProps>("TronPointerInputView") {
      val onBatch by Event<TronPointerBatch>()
      val onKey by Event<TronPointerKey>()
      Content { props -> TronPointerInputContent(props, { onBatch(it) }, { onKey(it) }) }
    }
    ExpoUIView<TronVideoPlayerProps>("TronVideoPlayerView") {
      val onStatus by Event<TronVideoStatusPayload>()
      Content { props -> TronVideoPlayerContent(props) { onStatus(it) } }
    }
    ExpoUIView<TronArcKnobProps>("TronArcKnobView") {
      val onPreview by Event<TronValuePayload>()
      val onCommit by Event<TronValuePayload>()
      Content { props ->
        TronArcKnobContent(props, { onPreview(it) }, { onCommit(it) })
      }
    }
    ExpoUIView<TronDisplayP3DiscProps>("TronDisplayP3DiscView") {
      Content { props -> TronDisplayP3DiscContent(props) }
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
