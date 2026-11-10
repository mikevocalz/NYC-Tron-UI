package com.nyctron.instruments

import android.content.Context
import android.graphics.Rect
import android.os.Build
import android.os.SystemClock
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.MotionPredictor
import android.view.View
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin

/** A transparent platform input layer; no document state or rendering is retained. */
class TronPointerCaptureView(context:Context):View(context){
  var emitBatch:((TronPointerBatch)->Unit)?=null
  var emitKey:((TronPointerKey)->Unit)?=null
  private val latest=mutableMapOf<Double,TronPointerSample>()
  private val predictors=mutableMapOf<Int,MotionPredictor>()
  private val hovering=mutableMapOf<Double,TronPointerSample>()
  private val heldKeys=mutableMapOf<Int,TronPointerKey>()
  init { isFocusable=true;isFocusableInTouchMode=true;importantForAccessibility=IMPORTANT_FOR_ACCESSIBILITY_YES }

  private fun sample(event:MotionEvent,index:Int,history:Int?=null):TronPointerSample {
    fun axis(axis:Int)=if(history==null)event.getAxisValue(axis,index) else event.getHistoricalAxisValue(axis,index,history)
    val kind=when(event.getToolType(index)){MotionEvent.TOOL_TYPE_STYLUS,MotionEvent.TOOL_TYPE_ERASER->"pen";MotionEvent.TOOL_TYPE_MOUSE->"mouse";else->"touch"}
    val tilt=axis(MotionEvent.AXIS_TILT).toDouble()
    val orientation=axis(MotionEvent.AXIS_ORIENTATION).toDouble()
    val hasForce=event.device?.getMotionRange(MotionEvent.AXIS_PRESSURE,event.source)!=null
    val hasTilt=kind=="pen" && event.device?.getMotionRange(MotionEvent.AXIS_TILT,event.source)!=null
    val density=resources.displayMetrics.density.toDouble()
    return TronPointerSample(event.deviceId.toDouble()*32+event.getPointerId(index),kind,
      axis(MotionEvent.AXIS_X)/density,axis(MotionEvent.AXIS_Y)/density,
      (if(history==null)event.eventTime else event.getHistoricalEventTime(history)).toDouble(),
      if(hasForce)axis(MotionEvent.AXIS_PRESSURE).toDouble().coerceIn(0.0,1.0) else null,
      if(hasTilt)Math.toDegrees(atan2(sin(orientation)*sin(tilt),cos(tilt))) else null,
      if(hasTilt)Math.toDegrees(atan2(-cos(orientation)*sin(tilt),cos(tilt))) else null,event.buttonState)
  }
  private fun samples(event:MotionEvent,index:Int)= (0 until event.historySize).map{sample(event,index,it)}+sample(event,index)
  override fun onTouchEvent(event:MotionEvent):Boolean {
    // Android can synthesize CANCEL without the active contacts' identity or coordinates.
    // It ends the whole gesture, so cancel the observed contacts before sampling the event.
    if(event.actionMasked==MotionEvent.ACTION_CANCEL){cancelContacts();return true}
    if(event.actionMasked==MotionEvent.ACTION_DOWN){requestFocus();parent?.requestDisallowInterceptTouchEvent(true)}
    var prediction:MotionEvent?=null
    if(Build.VERSION.SDK_INT>=34){
      if(event.actionMasked==MotionEvent.ACTION_DOWN)predictors[event.deviceId]=MotionPredictor(context)
      val predictor=predictors[event.deviceId]
      if(predictor!=null && predictor.isPredictionAvailable(event.deviceId,event.source)){
        predictor.record(event)
        if(event.actionMasked==MotionEvent.ACTION_MOVE){
          val refresh=display?.refreshRate?.takeIf{it>0f}?:60f
          prediction=predictor.predict((SystemClock.uptimeMillis()*1_000_000)+(1_000_000_000/refresh).toLong())
        }
      }
    }
    val phase=when(event.actionMasked){MotionEvent.ACTION_DOWN,MotionEvent.ACTION_POINTER_DOWN->"down";MotionEvent.ACTION_MOVE->"move";MotionEvent.ACTION_UP,MotionEvent.ACTION_POINTER_UP->"up";else->{prediction?.recycle();return false}}
    try {
      val indices=if(phase=="move")0 until event.pointerCount else event.actionIndex..event.actionIndex
      for(index in indices){
        val point=sample(event,index)
        val actual=if(phase=="move")samples(event,index) else listOf(point)
        val predictedIndex=prediction?.findPointerIndex(event.getPointerId(index))?:-1
        val predicted=if(predictedIndex>=0) samples(prediction!!,predictedIndex) else emptyList()
        if(phase=="up")latest.remove(point.pointerId) else latest[point.pointerId]=point
        emitBatch?.invoke(TronPointerBatch(phase,actual,predicted))
      }
    } finally {prediction?.recycle()}
    if(event.actionMasked==MotionEvent.ACTION_UP){predictors.remove(event.deviceId);parent?.requestDisallowInterceptTouchEvent(false)}
    return true
  }
  override fun onHoverEvent(event:MotionEvent):Boolean {
    val point=sample(event,0)
    val phase=if(event.actionMasked==MotionEvent.ACTION_HOVER_EXIT)"hover-exit" else "hover"
    if(phase=="hover-exit")hovering.remove(point.pointerId) else hovering[point.pointerId]=point
    emitBatch?.invoke(TronPointerBatch(phase,listOf(point),emptyList()));return true
  }
  override fun dispatchKeyEvent(event:KeyEvent):Boolean {
    if(event.action==KeyEvent.ACTION_DOWN||event.action==KeyEvent.ACTION_UP){
      val unicode=event.unicodeChar
      val value=TronPointerKey(if(event.action==KeyEvent.ACTION_DOWN)"down" else "up",if(unicode>0)String(Character.toChars(unicode)) else KeyEvent.keyCodeToString(event.keyCode),KeyEvent.keyCodeToString(event.keyCode),event.isShiftPressed,event.isAltPressed,event.isCtrlPressed,event.isMetaPressed,event.repeatCount>0)
      if(event.action==KeyEvent.ACTION_DOWN)heldKeys[event.keyCode]=value else heldKeys.remove(event.keyCode)
      emitKey?.invoke(value)
    }
    return super.dispatchKeyEvent(event)
  }
  override fun onWindowFocusChanged(hasWindowFocus:Boolean){super.onWindowFocusChanged(hasWindowFocus);if(!hasWindowFocus)cancelInput()}
  override fun onFocusChanged(gainFocus:Boolean,direction:Int,previouslyFocusedRect:Rect?){super.onFocusChanged(gainFocus,direction,previouslyFocusedRect);if(!gainFocus)cancelInput()}
  override fun onDetachedFromWindow(){cancelInput();super.onDetachedFromWindow()}
  private fun cancelContacts(){
    val pending=latest.values.toList();latest.clear();predictors.clear()
    parent?.requestDisallowInterceptTouchEvent(false)
    pending.forEach{emitBatch?.invoke(TronPointerBatch("cancel",listOf(it),emptyList()))}
  }
  private fun cancelInput(){
    cancelContacts()
    val hovers=hovering.values.toList();hovering.clear()
    hovers.forEach{emitBatch?.invoke(TronPointerBatch("hover-exit",listOf(it),emptyList()))}
    val keys=heldKeys.values.toList();heldKeys.clear();keys.forEach{emitKey?.invoke(it.copy(phase="up",repeat=false))}
  }
  fun close(){cancelInput();emitBatch=null;emitKey=null}
}
