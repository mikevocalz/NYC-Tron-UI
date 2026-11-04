package com.nyctron.instruments

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.semantics
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry

/** Native Compose adaptation of AudioKit Controls XYPad (MIT). */
@OptimizedComposeProps
data class TronXYPadProps(
  val label: String = "XY Pad",
  val x: Float = .5f,
  val y: Float = .5f,
  val enabled: Boolean = true,
  val accentColor: String = "#8B5CF6",
  val backgroundColor: String = "#13131A",
  val modifiers: ModifierList = emptyList()
) : ComposeProps
@OptimizedRecord
data class TronXYValuePayload(@Field val x:Float,@Field val y:Float) : Record

@Composable
fun FunctionalComposableScope.TronXYPadContent(
  props:TronXYPadProps,
  onPreview:(TronXYValuePayload)->Unit,
  onCommit:(TronXYValuePayload)->Unit
) {
  var dragging by remember { mutableStateOf(false) }
  var currentX by remember { mutableFloatStateOf(props.x.coerceIn(0f,1f)) }
  var currentY by remember { mutableFloatStateOf(props.y.coerceIn(0f,1f)) }
  LaunchedEffect(props.x,props.y) {
    if(!dragging){currentX=props.x.coerceIn(0f,1f);currentY=props.y.coerceIn(0f,1f)}
  }
  val latestProps by rememberUpdatedState(props)
  val latestPreview by rememberUpdatedState(onPreview)
  val latestCommit by rememberUpdatedState(onCommit)
  fun nudge(dx:Float,dy:Float):Boolean{
    if(!latestProps.enabled)return false
    val nx=(currentX+dx).coerceIn(0f,1f); val ny=(currentY+dy).coerceIn(0f,1f)
    if(nx==currentX&&ny==currentY)return false
    currentX=nx;currentY=ny;latestCommit(TronXYValuePayload(nx,ny))
    return true
  }
  val accent=instrumentColor(props.accentColor,Color(0xFF8B5CF6))
  val background=instrumentColor(props.backgroundColor,Color(0xFF13131A))
  Canvas(modifier=ModifierRegistry.applyModifiers(props.modifiers,appContext,composableScope,globalEventDispatcher)
    .fillMaxSize()
    .semantics {
      contentDescription=props.label
      stateDescription="X "+(currentX*100).toInt()+"%, Y "+(currentY*100).toInt()+"%"
      if(props.enabled)customActions=listOf(
        CustomAccessibilityAction("Increase X"){nudge(.05f,0f)},
        CustomAccessibilityAction("Decrease X"){nudge(-.05f,0f)},
        CustomAccessibilityAction("Increase Y"){nudge(0f,.05f)},
        CustomAccessibilityAction("Decrease Y"){nudge(0f,-.05f)}
      )
    }
    .pointerInput(props.enabled) {
      detectDragGestures(
        onDragStart={ if(props.enabled)dragging=true },
        onDragEnd={
          if(dragging){
            dragging=false
            if(currentX!=latestProps.x||currentY!=latestProps.y)latestCommit(TronXYValuePayload(currentX,currentY))
          }
        },
        onDragCancel={
          dragging=false
          currentX=latestProps.x.coerceIn(0f,1f);currentY=latestProps.y.coerceIn(0f,1f)
        }
      ){change,_->
        if(!dragging||!latestProps.enabled)return@detectDragGestures
        change.consume()
        val newX=(change.position.x/size.width.coerceAtLeast(1)).coerceIn(0f,1f)
        val newY=(1f-change.position.y/size.height.coerceAtLeast(1)).coerceIn(0f,1f)
        if(newX!=currentX||newY!=currentY){
          currentX=newX;currentY=newY;latestPreview(TronXYValuePayload(newX,newY))
        }
      }
    }) {
    drawRect(background)
    drawLine(accent.copy(alpha=.3f),Offset(size.width/2f,0f),Offset(size.width/2f,size.height),1.5f)
    drawLine(accent.copy(alpha=.3f),Offset(0f,size.height/2f),Offset(size.width,size.height/2f),1.5f)
    val radius=12f
    drawCircle(accent,radius,center=Offset(
      radius+currentX*(size.width-2*radius).coerceAtLeast(0f),
      radius+(1-currentY)*(size.height-2*radius).coerceAtLeast(0f)
    ))
  }
}
