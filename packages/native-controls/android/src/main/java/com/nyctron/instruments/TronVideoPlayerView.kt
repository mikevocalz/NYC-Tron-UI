package com.nyctron.instruments

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.key
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.ui.ModifierRegistry
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive

@Composable
fun FunctionalComposableScope.TronVideoPlayerContent(props:TronVideoPlayerProps,onStatus:(TronVideoStatusPayload)->Unit){
  val context=LocalContext.current
  val owner=remember(props.sourceId,props.uri) { TronVideoOwner(context) }
  SideEffect { owner.emitEvent=onStatus;owner.update(props) }
  DisposableEffect(owner){onDispose{owner.close()}}
  LaunchedEffect(owner){while(isActive){owner.emit();delay(100)}}
  key(owner) { AndroidView(factory={owner.view},modifier=ModifierRegistry.applyModifiers(props.modifiers,appContext,composableScope,globalEventDispatcher).fillMaxSize()) }
}
