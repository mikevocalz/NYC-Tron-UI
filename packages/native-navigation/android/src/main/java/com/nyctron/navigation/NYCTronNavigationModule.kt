package com.nyctron.navigation

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

class NYCTronNavigationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NYCTronNavigation")
    ExpoUIView<TronRailProps>("TronNavigationRailView") {
      val onSelect by Event<TronRailSelectPayload>()
      Content { props -> TronRailContent(props) { onSelect(it) } }
    }
  }
}
