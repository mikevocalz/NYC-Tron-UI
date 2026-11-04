import { useRef } from "react";
import { View,type ViewProps } from "react-native";
import { joinClasses } from "../styles";
import { peaksToBars,resamplePeaks,type WaveformPeak } from "./waveform";

export interface WaveformLaneProps extends Omit<ViewProps,"children"> {
  /** Measured real source signal extrema; not synthetic waves. */
  readonly peaks:readonly WaveformPeak[];
  readonly columns?:number;
  readonly height?:number;
  readonly onSeekNormalized?:(position:number)=>void;
  className?:string;
  barClassName?:string;
}
/**
 * Per-component import: no audio API, Forge engines, Skia or Nitro.
 * Bounded native view count (<=128); a huge DAW timeline uses the separate
 * optional Skia renderer when its backend is independently verified.
 */
export function WaveformLane({
  peaks,columns=96,height=64,onSeekNormalized,
  className,barClassName,style,...props
}:WaveformLaneProps){
  const width=useRef(0);
  if(!Number.isInteger(columns)||columns<1||columns>128)
    throw new RangeError("Waveform columns must be 1..128");
  const bars=peaksToBars(resamplePeaks(peaks,columns),height);
  return <View
    {...props}
    {...{className:joinClasses("w-full flex-row overflow-hidden bg-surface-sunken",className)}}
    style={[{height},style]}
    accessible
    accessibilityRole={onSeekNormalized?"adjustable":"image"}
    accessibilityLabel={props.accessibilityLabel??"Audio waveform"}
    onLayout={e=>{width.current=e.nativeEvent.layout.width;}}
    onStartShouldSetResponder={()=>onSeekNormalized!=null}
    onResponderRelease={e=>{
      if(!onSeekNormalized||width.current<=0)return;
      onSeekNormalized(Math.min(1,Math.max(0,e.nativeEvent.locationX/width.current)));
    }}
    accessibilityActions={onSeekNormalized?[{name:"increment"},{name:"decrement"}]:undefined}
    onAccessibilityAction={onSeekNormalized?e=>{
      if(e.nativeEvent.actionName==="increment")onSeekNormalized(1);
      if(e.nativeEvent.actionName==="decrement")onSeekNormalized(0);
    }:undefined}
  >{bars.map((bar,i)=><View key={i} style={{flex:1,height}}>
    <View
      {...{className:joinClasses("self-center w-3/4 bg-accent",barClassName)}}
      style={{marginTop:bar.top,height:bar.height}}
    />
  </View>)}</View>;
}
