import { useRef,useSyncExternalStore } from "react";
import { PanResponder,Platform,View,type ViewProps,type ViewStyle } from "react-native";
import { joinClasses } from "../styles.ts";
import {
  FULL_RANGE,assertWaveformRange,peaksToBars,rangePosition,resamplePeaks,scrollRange,slicePeaks,
  type WaveformPeak,type WaveformRange,
} from "./waveform.ts";

/** Horizontal travel, in points, before a press becomes a scroll. */
const SLOP=6;

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
  /**
   * Part of the clip to draw, normalized. Only the peaks inside it are
   * resampled, so a zoomed-in view of a long clip costs the same as a short
   * one. @default FULL_RANGE
   */
  readonly visibleRange?:WaveformRange;
  /** Live preview of the range while the lane is dragged sideways. */
  readonly onVisibleRangeChange?:(range:WaveformRange)=>void;
  /**
   * Once per finished sideways drag. Without it the lane does not scroll and
   * every release seeks.
   */
  readonly onVisibleRangeCommit?:(range:WaveformRange)=>void;
  className?:string;
  barClassName?:string;
  unstyled?:boolean;
}

type Scroll={active:boolean;range:WaveformRange};
/** Gesture-local store. Plain React so the lane keeps no zustand dependency. */
type Local={get:()=>Scroll;set:(next:Partial<Scroll>)=>void;subscribe:(fn:()=>void)=>()=>void};
function createLocal(initial:Scroll):Local{
  let state=initial;
  const listeners=new Set<()=>void>();
  return {
    get:()=>state,
    set:next=>{state={...state,...next};listeners.forEach(fn=>fn());},
    subscribe:fn=>{listeners.add(fn);return()=>{listeners.delete(fn);};},
  };
}

/**
 * Per-component import: no audio API, Forge engines, Skia or Nitro.
 * Bounded native view count (<=128) at any zoom: `visibleRange` picks the
 * window and only that window is resampled. A tap seeks; with
 * `onVisibleRangeCommit`, a sideways drag scrolls the window and commits
 * once on release. A GPU (Skia) lane for dense multitrack timelines is
 * deferred until that backend is verified on devices.
 */
export function WaveformLane({
  peaks,columns=96,height=64,onSeekNormalized,position,accessibilityStep=0.05,
  visibleRange=FULL_RANGE,onVisibleRangeChange,onVisibleRangeCommit,
  className,barClassName,unstyled=false,style,...props
}:WaveformLaneProps){
  assertWaveformRange(visibleRange);
  const width=useRef(0);
  const lastPosition=useRef(0);
  const clamp=(n:number)=>Math.min(1,Math.max(0,n));
  const current=position!==undefined&&Number.isFinite(position)?clamp(position):lastPosition.current;
  const latest=useRef({onSeekNormalized,onVisibleRangeChange,onVisibleRangeCommit,visibleRange});
  latest.current={onSeekNormalized,onVisibleRangeChange,onVisibleRangeCommit,visibleRange};
  const local=useRef<Local|null>(null);
  if(!local.current)local.current=createLocal({active:false,range:visibleRange});
  const store=local.current;
  const snapshot=useSyncExternalStore(store.subscribe,store.get,store.get);
  const range=snapshot.active?snapshot.range:visibleRange;
  const seek=(next:number)=>{
    const value=clamp(next);
    lastPosition.current=value;
    latest.current.onSeekNormalized?.(value);
  };
  const responder=useRef<ReturnType<typeof PanResponder.create>|null>(null);
  if(!responder.current)responder.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>latest.current.onSeekNormalized!=null||latest.current.onVisibleRangeCommit!=null,
    onPanResponderGrant:()=>store.set({active:false,range:latest.current.visibleRange}),
    onPanResponderMove:(_e,g)=>{
      const p=latest.current;
      if(!p.onVisibleRangeCommit||width.current<=0)return;
      if(!store.get().active&&Math.abs(g.dx)<SLOP)return;
      const next=scrollRange(p.visibleRange,g.dx,width.current);
      const s=store.get();
      if(!s.active||next.start!==s.range.start){
        store.set({active:true,range:next});
        p.onVisibleRangeChange?.(next);
      }
    },
    onPanResponderRelease:e=>{
      const p=latest.current;
      const s=store.get();
      if(s.active){
        store.set({active:false});
        if(s.range.start!==p.visibleRange.start)p.onVisibleRangeCommit?.(s.range);
        return;
      }
      if(p.onSeekNormalized&&width.current>0)seek(rangePosition(p.visibleRange,e.nativeEvent.locationX,width.current));
    },
    onPanResponderTerminate:()=>{
      if(!store.get().active)return;
      store.set({active:false});
      latest.current.onVisibleRangeChange?.(latest.current.visibleRange);
    },
    onPanResponderTerminationRequest:()=>!store.get().active,
  });
  if(!Number.isFinite(accessibilityStep)||accessibilityStep<=0||accessibilityStep>1)
    throw new RangeError("accessibilityStep must be within (0, 1]");
  if(!Number.isInteger(columns)||columns<1||columns>128)
    throw new RangeError("Waveform columns must be 1..128");
  const bars=peaksToBars(resamplePeaks(slicePeaks(peaks,range),columns),height);
  const webTrack=Platform.OS==="web"&&onVisibleRangeCommit?{touchAction:"pan-y"} as unknown as ViewStyle:undefined;
  return <View
    {...props}
    {...responder.current.panHandlers}
    {...{className:joinClasses("w-full flex-row overflow-hidden",!unstyled&&"bg-surface-sunken",className)}}
    style={[{height,direction:"ltr"},webTrack,style]}
    accessible
    accessibilityRole={onSeekNormalized?"adjustable":"image"}
    accessibilityLabel={props.accessibilityLabel??"Audio waveform"}
    onLayout={e=>{width.current=e.nativeEvent.layout.width;props.onLayout?.(e);}}
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
