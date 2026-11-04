package com.nyctron.instruments

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.setProgress
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry
import java.util.Locale
import kotlin.math.roundToInt

/** Native Compose adaptation of AudioKit Controls ArcKnob (MIT 2022 Aurelius Prochazka). */
@OptimizedComposeProps
data class TronArcKnobProps(
  val label: String = "Parameter",
  val value: Float = 0f,
  val minimum: Float = 0f,
  val maximum: Float = 1f,
  val step: Float = .01f,
  val enabled: Boolean = true,
  val accentColor: String = "#8B5CF6",
  val textColor: String = "#F5F5F7",
  val modifiers: ModifierList = emptyList()
) : ComposeProps

@OptimizedRecord
data class TronValuePayload(@Field val value: Float) : Record

internal fun quantize(raw: Float, min: Float, max: Float, step: Float): Float {
  if (!raw.isFinite() || !min.isFinite() || !max.isFinite() || max <= min ||
    !step.isFinite() || step <= 0f) return min
  return (min + ((raw.coerceIn(min,max)-min)/step).roundToInt()*step).coerceIn(min,max)
}
internal fun instrumentColor(hex: String, fallback: Color): Color =
  runCatching { Color(android.graphics.Color.parseColor(hex)) }.getOrDefault(fallback)

@Composable
fun FunctionalComposableScope.TronArcKnobContent(
  props: TronArcKnobProps,
  onPreview: (TronValuePayload) -> Unit,
  onCommit: (TronValuePayload) -> Unit
) {
  val valid = props.maximum > props.minimum && props.minimum.isFinite() &&
    props.maximum.isFinite() && props.step.isFinite() && props.step > 0f
  val min = if(valid)props.minimum else 0f
  val max = if(valid)props.maximum else 1f
  val step = if(valid)props.step else .01f
  var dragging by remember { mutableStateOf(false) }
  var current by remember { mutableFloatStateOf(quantize(props.value,min,max,step)) }
  var start by remember { mutableFloatStateOf(current) }
  var dx by remember { mutableFloatStateOf(0f) }
  var dy by remember { mutableFloatStateOf(0f) }
  // pointerInput only restarts on its keys; read the latest props and
  // callbacks through these so a gesture never compares against a stale value.
  val latestProps by rememberUpdatedState(props)
  val latestPreview by rememberUpdatedState(onPreview)
  val latestCommit by rememberUpdatedState(onCommit)
  LaunchedEffect(props.value,min,max,step) { if(!dragging)current=quantize(props.value,min,max,step) }
  val accent=instrumentColor(props.accentColor,Color(0xFF8B5CF6))
  val text=instrumentColor(props.textColor,Color(0xFFF5F5F7))
  val normalized=((current-min)/(max-min)).coerceIn(0f,1f)
  Box(modifier=ModifierRegistry.applyModifiers(props.modifiers,appContext,composableScope,globalEventDispatcher)
    .fillMaxSize().semantics {
      contentDescription=props.label
      progressBarRangeInfo=ProgressBarRangeInfo(current,min..max)
      setProgress { target ->
        if(!props.enabled||!valid)false else {
          val next=quantize(target,min,max,step)
          if(next!=current){current=next;onCommit(TronValuePayload(next))}
          true
        }
      }
    }) {
    Canvas(modifier=Modifier.fillMaxSize().pointerInput(props.enabled,min,max,step) {
      detectDragGestures(
        onDragStart={
          if(props.enabled && valid){
            dragging=true;start=current;dx=0f;dy=0f
          }
        },
        onDragEnd={
          if(dragging){
            dragging=false
            if(current!=quantize(latestProps.value,min,max,step))latestCommit(TronValuePayload(current))
          }
        },
        onDragCancel={
          dragging=false;current=quantize(latestProps.value,min,max,step)
        }
      ){change,delta->
        if(!props.enabled||!valid||!dragging)return@detectDragGestures
        change.consume()
        dx+=delta.x;dy+=delta.y
        val multiplier=if(dy < -28f) .1f else if(dy > 28f) 4f else 1f
        val next=quantize(start+dx/8f*step*multiplier,min,max,step)
        if(next!=current){current=next;latestPreview(TronValuePayload(next))}
      }
    }) {
      val stroke=size.minDimension*.08f
      val inset=stroke*1.3f
      val diameter=(size.minDimension-inset*2).coerceAtLeast(0f)
      val origin=Offset((size.width-diameter)/2f,(size.height-diameter)/2f)
      val arc=Size(diameter,diameter)
      drawArc(accent.copy(alpha=.25f),135f,270f,false,origin,arc,style=Stroke(stroke,cap=StrokeCap.Round))
      drawArc(accent,135f,270f*normalized,false,origin,arc,style=Stroke(stroke,cap=StrokeCap.Round))
    }
    Column(modifier=Modifier.align(Alignment.Center),horizontalAlignment=Alignment.CenterHorizontally){
      Text(String.format(Locale.US,"%.3f",current),color=text,style=MaterialTheme.typography.titleMedium)
      Text(props.label,color=text,style=MaterialTheme.typography.labelSmall)
    }
  }
}
