package com.nyctron.instruments

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.ui.ModifierRegistry

@Composable
fun FunctionalComposableScope.TronPointerInputContent(props:TronPointerInputProps,onBatch:(TronPointerBatch)->Unit,onKey:(TronPointerKey)->Unit){
  val context=LocalContext.current
  val view=remember { TronPointerCaptureView(context) }
  SideEffect { view.contentDescription=props.label;view.emitBatch=onBatch;view.emitKey=onKey }
  DisposableEffect(view){onDispose{view.close()}}
  AndroidView(factory={view},modifier=ModifierRegistry.applyModifiers(props.modifiers,appContext,composableScope,globalEventDispatcher).fillMaxSize())
}
