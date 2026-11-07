package com.nyctron.instruments

import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList

@OptimizedComposeProps
data class TronVideoPlayerProps(
  val sourceId:String="", val uri:String="", val paused:Boolean=true,
  val muted:Boolean=false, val volume:Double=1.0, val rate:Double=1.0,
  val seekTimeUs:Double=0.0, val seekToken:String="", val label:String="Video",
  val modifiers:ModifierList=emptyList()
):ComposeProps
