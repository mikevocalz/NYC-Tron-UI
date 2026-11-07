package com.nyctron.instruments

import android.content.Context
import android.view.SurfaceView
import android.widget.FrameLayout
import kotlin.math.min

/** One aspect-fit surface inside the unchanged host bounds. */
internal class TronVideoSurface(context:Context):FrameLayout(context) {
  val surface=SurfaceView(context)
  private var videoWidth=0
  private var videoHeight=0
  init { addView(surface) }
  fun setVideoSize(width:Int,height:Int){videoWidth=width;videoHeight=height;requestLayout()}
  override fun onLayout(changed:Boolean,left:Int,top:Int,right:Int,bottom:Int){
    val width=right-left;val height=bottom-top
    val scale=if(videoWidth>0&&videoHeight>0)min(width.toDouble()/videoWidth,height.toDouble()/videoHeight) else 0.0
    val w=if(scale>0)(videoWidth*scale).toInt() else width
    val h=if(scale>0)(videoHeight*scale).toInt() else height
    surface.layout((width-w)/2,(height-h)/2,(width+w)/2,(height+h)/2)
  }
}
