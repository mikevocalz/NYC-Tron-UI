import { useRef } from "react";
import { View,type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";
import { peaksToBars,resamplePeaks,type WaveformPeak } from "./waveform.ts";

export interface WaveformLaneProps extends Omit<ViewProps,"children"> {
  /** Measured real source signal extrema; not synthetic waves. */
  readonly peaks:readonly WaveformPeak[];
  readonly columns?:number;
  readonly height?:number;
  readonly onSeekNormalized?:(position:number)=>void;
  /** Current playhead in [0, 1]; screen-reader steps move from here. */
  readonly position?:number;
  /** Normalized distance per accessibility increment/decrement. */
  readonly accessibilityStep?:number;
  className?:string;
  barClassName?:string;
  unstyled?:boolean;
}
/**
 * Per-component import: no audio API, Forge engines, Skia or Nitro.
 * Bounded native view count (<=128); a huge DAW timeline uses the separate
 * optional Skia renderer when its backend is independently verified.
 */
export function WaveformLane({
  peaks,columns=96,height=64,onSeekNormalized,position,accessibilityStep=0.05,
  className,barClassName,unstyled=false,style,...props
}:WaveformLaneProps){
  const width=useRef(0);
  const lastPosition=useRef(0);
  const clamp=(n:number)=>Math.min(1,Math.max(0,n));
  const current=position!==undefined&&Number.isFinite(position)?clamp(position):lastPosition.current;
  const seek=(next:number)=>{
    const value=clamp(next);
    lastPosition.current=value;
    onSeekNormalized?.(value);
  };
  if(!Number.isFinite(accessibilityStep)||accessibilityStep<=0||accessibilityStep>1)
    throw new RangeError("accessibilityStep must be within (0, 1]");
  if(!Number.isInteger(columns)||columns<1||columns>128)
    throw new RangeError("Waveform columns must be 1..128");
  const bars=peaksToBars(resamplePeaks(peaks,columns),height);
  return <View
    {...props}
    {...{className:joinClasses("w-full flex-row overflow-hidden",!unstyled&&"bg-surface-sunken",className)}}
    style={[{height},style]}
    accessible
    accessibilityRole={onSeekNormalized?"adjustable":"image"}
    accessibilityLabel={props.accessibilityLabel??"Audio waveform"}
    onLayout={e=>{width.current=e.nativeEvent.layout.width;}}
    onStartShouldSetResponder={()=>onSeekNormalized!=null}
    onResponderRelease={e=>{
      if(!onSeekNormalized||width.current<=0)return;
      seek(e.nativeEvent.locationX/width.current);
    }}
    accessibilityValue={onSeekNormalized?{min:0,max:100,now:Math.round(current*100)}:undefined}
    accessibilityActions={onSeekNormalized?[{name:"increment"},{name:"decrement"}]:undefined}
    onAccessibilityAction={onSeekNormalized?e=>{
      // Step from the playhead; jumping to 0 or 1 would discard the position.
      if(e.nativeEvent.actionName==="increment")seek(current+accessibilityStep);
      if(e.nativeEvent.actionName==="decrement")seek(current-accessibilityStep);
    }:undefined}
  >{bars.map((bar,i)=><View key={i} style={{flex:1,height}}>
    <View
      {...{className:joinClasses("self-center w-3/4",!unstyled&&"bg-accent",barClassName)}}
      style={{marginTop:bar.top,height:bar.height}}
    />
  </View>)}</View>;
}
