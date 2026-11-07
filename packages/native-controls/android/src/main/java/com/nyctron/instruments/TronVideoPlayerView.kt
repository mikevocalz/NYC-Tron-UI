package com.nyctron.instruments

import android.content.Context
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.PlaybackParams
import android.net.Uri
import android.os.Build
import android.widget.VideoView
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
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive

@OptimizedComposeProps
data class TronVideoPlayerProps(
  val sourceId:String="", val uri:String="", val paused:Boolean=true,
  val muted:Boolean=false, val volume:Double=1.0, val rate:Double=1.0,
  val seekTimeUs:Double=0.0, val seekToken:String="", val label:String="Video",
  val modifiers:ModifierList=emptyList()
):ComposeProps
@OptimizedRecord
data class TronVideoStatusPayload(
  @Field val sourceId:String, @Field val status:String,
  @Field val positionUs:Double, @Field val durationUs:Double,
  @Field val seekToken:String, @Field val error:String
):Record

/** All VideoView/MediaPlayer calls run on Compose's main-thread owner. The app retains audio-focus arbitration. */
private class TronVideoOwner(context:Context) {
  val view=VideoView(context)
  var emitEvent:(TronVideoStatusPayload)->Unit={}
  private var props:TronVideoPlayerProps?=null
  private var sourceKey=""
  private var player:MediaPlayer?=null
  private var prepared=false
  private var failed=false
  private var ended=false
  private var seeking=false
  private var requestedToken:String?=null
  private var completedToken=""
  private var closed=false
  private var appliedRate:Float?=null
  init {
    if(Build.VERSION.SDK_INT>=26)view.setAudioFocusRequest(AudioManager.AUDIOFOCUS_NONE)
    view.setOnPreparedListener { mp ->
      if(closed)return@setOnPreparedListener
      player=mp;prepared=true;failed=false
      mp.setOnSeekCompleteListener { completed ->
        if(closed||completed!==player)return@setOnSeekCompleteListener
        seeking=false;completedToken=requestedToken?:"";apply();emit("ready")
      }
      apply();emit("ready")
    }
    view.setOnCompletionListener { mp -> if(!closed&&mp===player){ended=true;emit("ended")} }
    view.setOnErrorListener { _, _, _ -> failed=true;prepared=false;emit("error","Video decoding failed");true }
  }
  fun update(next:TronVideoPlayerProps) {
    if(closed)return
    props=next;view.contentDescription=next.label
    val key=next.sourceId+"\n"+next.uri
    if(key!=sourceKey){
      sourceKey=key;prepared=false;failed=false;ended=false;seeking=false;requestedToken="";completedToken="";player=null
      view.stopPlayback()
      try { view.setVideoURI(Uri.parse(next.uri));emit("loading") }
      catch(_:Exception){failed=true;emit("error","Video source could not be opened")}
    }
    apply()
  }
  private fun apply(){
    val p=props?:return;val mp=player?:return
    if(!prepared||failed||closed)return
    try {
      val volume=if(p.muted)0f else p.volume.coerceIn(0.0,1.0).toFloat()
      mp.setVolume(volume,volume)
      if(requestedToken!=p.seekToken){
        // Keep a single native seek in flight. Newer requests replace the pending target after completion.
        if(seeking)return
        requestedToken=p.seekToken;seeking=true;ended=false;view.pause()
        val targetMs=(p.seekTimeUs/1000).toLong().coerceIn(0,Int.MAX_VALUE.toLong())
        if(Build.VERSION.SDK_INT>=26)mp.seekTo(targetMs,MediaPlayer.SEEK_CLOSEST) else mp.seekTo(targetMs.toInt())
        return
      }
      if(seeking)return
      if(p.paused||ended)view.pause() else {
        val rate=p.rate.coerceIn(.25,4.0).toFloat()
        if(appliedRate!=rate){mp.playbackParams=PlaybackParams().setSpeed(rate).setPitch(1f);appliedRate=rate}
        if(!view.isPlaying)view.start()
      }
    } catch(_:Exception){failed=true;emit("error","Video playback request failed")}
  }
  fun emit(override:String?=null,error:String=""){
    val p=props?:return;if(closed)return
    try{emitEvent(TronVideoStatusPayload(p.sourceId,override?:if(failed)"error" else if(ended)"ended" else if(!prepared)"loading" else if(view.isPlaying)"playing" else "paused",if(prepared)view.currentPosition.coerceAtLeast(0).toDouble()*1000 else 0.0,if(prepared)view.duration.coerceAtLeast(0).toDouble()*1000 else 0.0,completedToken,error))}catch(_:IllegalStateException){}
  }
  fun close(){if(closed)return;closed=true;view.setOnPreparedListener(null);view.setOnCompletionListener(null);view.setOnErrorListener(null);player?.setOnSeekCompleteListener(null);view.stopPlayback();player=null;props=null;emitEvent={}}
}
@Composable
fun FunctionalComposableScope.TronVideoPlayerContent(props:TronVideoPlayerProps,onStatus:(TronVideoStatusPayload)->Unit){
  val context=LocalContext.current
  val owner=remember(props.sourceId,props.uri) { TronVideoOwner(context) }
  SideEffect { owner.emitEvent=onStatus;owner.update(props) }
  DisposableEffect(owner){onDispose{owner.close()}}
  LaunchedEffect(owner){while(isActive){owner.emit();delay(100)}}
  key(owner) { AndroidView(factory={owner.view},modifier=ModifierRegistry.applyModifiers(props.modifiers,appContext,composableScope,globalEventDispatcher).fillMaxSize()) }
}
