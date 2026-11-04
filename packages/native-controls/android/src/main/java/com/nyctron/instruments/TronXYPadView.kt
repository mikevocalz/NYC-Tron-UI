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
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.contentDescription
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
  val accent=instrumentColor(props.accentColor,Color(0xFF8B5CF6))
  val background=instrumentColor(props.backgroundColor,Color(0xFF13131A))
  Canvas(modifier=ModifierRegistry.applyModifiers(props.modifiers,appContext,composableScope,globalEventDispatcher)
    .fillMaxSize()
    .semantics { contentDescription=props.label+", X "+(currentX*100).toInt()+"%, Y "+(currentY*100).toInt()+"%" }
    .pointerInput(props.enabled) {
      detectDragGestures(
        onDragStart={ if(props.enabled)dragging=true },
        onDragEnd={
          if(dragging){
            dragging=false
            if(currentX!=props.x||currentY!=props.y)onCommit(TronXYValuePayload(currentX,currentY))
          }
        },
        onDragCancel={
          dragging=false
          currentX=props.x.coerceIn(0f,1f);currentY=props.y.coerceIn(0f,1f)
        }
      ){change,_->
        if(!dragging||!props.enabled)return@detectDragGestures
        change.consume()
        val newX=(change.position.x/size.width.coerceAtLeast(1)).coerceIn(0f,1f)
        val newY=(1f-change.position.y/size.height.coerceAtLeast(1)).coerceIn(0f,1f)
        if(newX!=currentX||newY!=currentY){
          currentX=newX;currentY=newY;onPreview(TronXYValuePayload(newX,newY))
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
