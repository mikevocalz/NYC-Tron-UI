package com.nyctron.instruments

import android.content.Context
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.PlaybackParams
import android.net.Uri
import android.os.Build
import android.widget.VideoView

/** All VideoView/MediaPlayer calls run on Compose's main-thread owner. API 26+ disables automatic audio focus; pre-26 focus policy remains platform-owned. */
internal class TronVideoOwner(context:Context) {
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
      if(player!==mp)appliedRate=null
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
      sourceKey=key;prepared=false;failed=false;ended=false;seeking=false;requestedToken="";completedToken="";player=null;appliedRate=null
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
        // VideoView exposes an Int millisecond clock on every supported API.
        // Reject an unrepresentable request rather than acknowledge a clamped seek.
        if(!p.seekTimeUs.isFinite()||p.seekTimeUs<0||p.seekTimeUs>Int.MAX_VALUE.toDouble()*1000){
          view.pause()
          failed=true;emit("error","Video seek is outside the supported millisecond clock range");return
        }
        val targetMs=(p.seekTimeUs/1000).toLong()
        requestedToken=p.seekToken;seeking=true;ended=false;view.pause()
        if(Build.VERSION.SDK_INT>=26)mp.seekTo(targetMs,MediaPlayer.SEEK_CLOSEST) else mp.seekTo(targetMs.toInt())
        return
      }
      if(seeking)return
      if(p.paused||ended)view.pause() else {
        val rate=p.rate.coerceIn(.25,4.0).toFloat()
        if(appliedRate!=rate){mp.playbackParams=PlaybackParams().setSpeed(rate).setPitch(1f);appliedRate=rate}
        if(!view.isPlaying)view.start()
      }
    } catch(_:Exception){
      // Stop the previous transport where possible; retain the original request failure.
      try { view.pause() } catch(_:Exception) {}
      failed=true;emit("error","Video playback request failed")
    }
  }
  fun emit(override:String?=null,error:String=""){
    val p=props?:return;if(closed)return
    try{emitEvent(TronVideoStatusPayload(p.sourceId,override?:if(failed)"error" else if(ended)"ended" else if(!prepared)"loading" else if(view.isPlaying)"playing" else "paused",if(prepared)view.currentPosition.coerceAtLeast(0).toDouble()*1000 else 0.0,if(prepared)view.duration.coerceAtLeast(0).toDouble()*1000 else 0.0,completedToken,error))}catch(_:IllegalStateException){}
  }
  fun close(){if(closed)return;closed=true;view.setOnPreparedListener(null);view.setOnCompletionListener(null);view.setOnErrorListener(null);player?.setOnSeekCompleteListener(null);view.stopPlayback();player=null;props=null;emitEvent={}}
}
