package com.nyctron.instruments

import android.content.Context
import android.media.MediaPlayer
import android.media.PlaybackParams
import android.net.Uri
import android.os.Build
import android.view.SurfaceHolder

/** Main-thread MediaPlayer owner. Audio focus belongs exclusively to the app. */
internal class TronVideoOwner(private val context:Context):SurfaceHolder.Callback {
  val view=TronVideoSurface(context)
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
  private var surfaceReady=false
  private var generation=0L
  private var restorePositionMs=0
  private var restoring=false
  init { view.surface.holder.addCallback(this) }
  private fun owns(mp:MediaPlayer,epoch:Long)=!closed&&epoch==generation&&mp===player
  override fun surfaceCreated(holder:SurfaceHolder){if(closed)return;surfaceReady=true;open()}
  override fun surfaceChanged(holder:SurfaceHolder,format:Int,width:Int,height:Int){}
  override fun surfaceDestroyed(holder:SurfaceHolder){
    surfaceReady=false
    if(prepared&&!failed)try{restorePositionMs=player?.currentPosition?:0}catch(_:IllegalStateException){}
    releasePlayer()
  }
  private fun releasePlayer(){
    generation++;val old=player;player=null;prepared=false;seeking=false;restoring=false;appliedRate=null;requestedToken=completedToken
    if(old!=null){
      old.setOnPreparedListener(null);old.setOnSeekCompleteListener(null);old.setOnCompletionListener(null);old.setOnErrorListener(null);old.setOnVideoSizeChangedListener(null)
      old.release()
    }
  }
  private fun open(){
    val p=props?:return
    if(closed||!surfaceReady||player!=null||failed)return
    val epoch=++generation
    val mp=try{MediaPlayer()}catch(_:Exception){failed=true;emit("error","Video player could not be created");return}
    player=mp
    mp.setOnPreparedListener { ready ->
      if(!owns(ready,epoch))return@setOnPreparedListener
      prepared=true;appliedRate=null;view.setVideoSize(ready.videoWidth,ready.videoHeight)
      try{
        if(restorePositionMs>0){restoring=true;seeking=true;val position=restorePositionMs;restorePositionMs=0;ready.seekTo(position)}else{apply();if(!failed)emit("ready")}
      }catch(_:Exception){failed=true;releasePlayer();emit("error","Video surface restoration failed")}
    }
    mp.setOnVideoSizeChangedListener { current,w,h -> if(owns(current,epoch))view.setVideoSize(w,h) }
    mp.setOnSeekCompleteListener { completed ->
      if(!owns(completed,epoch)||!prepared||failed)return@setOnSeekCompleteListener
      seeking=false
      if(restoring)restoring=false else completedToken=requestedToken?:""
      apply();if(!failed)emit("ready")
    }
    mp.setOnCompletionListener { current -> if(owns(current,epoch)&&prepared&&!failed){ended=true;emit("ended")} }
    mp.setOnErrorListener { current,_,_ -> if(owns(current,epoch)){failed=true;prepared=false;emit("error","Video decoding failed");releasePlayer()};true }
    try{mp.setDisplay(view.surface.holder);mp.setDataSource(context,Uri.parse(p.uri));mp.prepareAsync();emit("loading")}
    catch(_:Exception){failed=true;releasePlayer();emit("error","Video source could not be opened")}
  }
  fun update(next:TronVideoPlayerProps) {
    if(closed)return
    props=next;view.contentDescription=next.label
    val key=next.sourceId+"\n"+next.uri
    if(key!=sourceKey){
      releasePlayer();sourceKey=key;failed=false;ended=false;requestedToken="";completedToken="";restorePositionMs=0
      view.setVideoSize(0,0)
    }
    open()
    apply()
  }
  private fun apply(){
    val p=props?:return;val mp=player?:return
    if(!prepared||failed||closed)return
    try {
      if(!p.volume.isFinite()||!p.rate.isFinite()){
        if(mp.isPlaying)mp.pause()
        failed=true;releasePlayer();emit("error","Video volume and rate must be finite");return
      }
      if(requestedToken!=p.seekToken&&!seeking&&(!p.seekTimeUs.isFinite()||p.seekTimeUs<0||p.seekTimeUs>Int.MAX_VALUE.toDouble()*1000)){
        if(mp.isPlaying)mp.pause()
        failed=true;releasePlayer();emit("error","Video seek is outside the supported millisecond clock range");return
      }
      val volume=if(p.muted)0f else p.volume.coerceIn(0.0,1.0).toFloat()
      mp.setVolume(volume,volume)
      if(requestedToken!=p.seekToken){
        // Keep a single native seek in flight. Newer requests replace the pending target after completion.
        if(seeking)return
        // MediaPlayer exposes an Int millisecond clock on every supported API.
        // Reject an unrepresentable request rather than acknowledge a clamped seek.
        val targetMs=(p.seekTimeUs/1000).toLong()
        requestedToken=p.seekToken;seeking=true;ended=false;if(mp.isPlaying)mp.pause()
        if(Build.VERSION.SDK_INT>=26)mp.seekTo(targetMs,MediaPlayer.SEEK_CLOSEST) else mp.seekTo(targetMs.toInt())
        return
      }
      if(seeking)return
      if(p.paused||ended){
        if(mp.isPlaying)mp.pause()
      } else {
        val rate=p.rate.coerceIn(.25,4.0).toFloat()
        if(appliedRate!=rate){mp.playbackParams=PlaybackParams().setSpeed(rate).setPitch(1f);appliedRate=rate}
        if(!mp.isPlaying)mp.start()
      }
    } catch(_:Exception){
      // Stop the previous transport where possible; retain the original request failure.
      try { if(mp.isPlaying)mp.pause() } catch(_:Exception) {}
      failed=true;emit("error","Video playback request failed")
    }
  }
  fun emit(override:String?=null,error:String=""){
    val p=props?:return;if(closed)return
    try{emitEvent(TronVideoStatusPayload(p.sourceId,override?:if(failed)"error" else if(ended)"ended" else if(!prepared)"loading" else if(player?.isPlaying==true)"playing" else "paused",if(prepared)player!!.currentPosition.coerceAtLeast(0).toDouble()*1000 else 0.0,if(prepared)player!!.duration.coerceAtLeast(0).toDouble()*1000 else 0.0,completedToken,error))}catch(_:IllegalStateException){}
  }
  fun close(){
    if(closed)return
    closed=true;view.surface.holder.removeCallback(this);releasePlayer();props=null;emitEvent={}
  }
}
