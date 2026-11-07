import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {controlIdentity,useScopedControl,type ScopedControlProps} from './inputs/useScopedControl.ts';
import {ErrorMessage} from '../feedback/ErrorMessage.tsx';
import { useRef,useLayoutEffect } from "react";
import { PanResponder,Platform,View,type ViewProps,type ViewStyle } from "react-native";
import { joinClasses } from "../styles.ts";
import {
  FULL_RANGE,assertWaveformRange,peaksToBars,rangePosition,resamplePeaks,scrollRange,slicePeaks,
  type WaveformPeak,type WaveformRange,
} from "./waveform.ts";

/** Horizontal travel, in points, before a press becomes a scroll. */
const SLOP=6;

export interface WaveformLaneProps extends Omit<ViewProps,"children">,ScopedControlProps {
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
/**
 * Per-component import: no audio API, Forge engines, Skia or Nitro.
 * Bounded native view count (<=128) at any zoom: `visibleRange` picks the
 * window and only that window is resampled. A tap seeks; with
 * `onVisibleRangeCommit`, a sideways drag scrolls the window and commits
 * once on release. A GPU (Skia) lane for dense multitrack timelines is
 * deferred until that backend is verified on devices.
 */
export function WaveformLane({scope='waveform',revision=0,...props}:WaveformLaneProps){
 const owner=JSON.stringify([...controlIdentity(scope,revision),props.disabledReason,props.visibleRange,props.columns,props.height]);
 if(props.peaks.length>1048576||props.peaks.some(p=>!Number.isFinite(p.min)||!Number.isFinite(p.max)||p.min>p.max||p.min< -1||p.max>1))throw new RangeError('Invalid waveform peaks');
 const guard=useScopedControl(owner,props,props.disabledReason!==undefined);
 return <View style={{minWidth:0}}><WaveformLaneBody key={owner} {...props}
  onSeekNormalized={props.onSeekNormalized?value=>{guard.current()?.onSeekNormalized?.(value);}:undefined}
  onVisibleRangeChange={props.onVisibleRangeChange?value=>{guard.current()?.onVisibleRangeChange?.(value);}:undefined}
  onVisibleRangeCommit={props.onVisibleRangeCommit?value=>guard.run('range',host=>host.onVisibleRangeCommit?.(value)):undefined}/>
  <ErrorMessage message={guard.error??props.disabledReason} unstyled={props.unstyled}/></View>;
}
function WaveformLaneBody({

  peaks,columns=96,height=64,onSeekNormalized,position,accessibilityStep=0.05,
  visibleRange=FULL_RANGE,onVisibleRangeChange,onVisibleRangeCommit,
  className,barClassName,unstyled=false,style,disabledReason,...props
}:WaveformLaneProps){
  assertWaveformRange(visibleRange);
  const width=useRef(0);
  const lastPosition=useRef(0);
  const clamp=(n:number)=>Math.min(1,Math.max(0,n));
  const current=position!==undefined&&Number.isFinite(position)?clamp(position):lastPosition.current;
  const latest=useRef({onSeekNormalized,onVisibleRangeChange,onVisibleRangeCommit,visibleRange});
  useLayoutEffect(()=>{latest.current={onSeekNormalized,onVisibleRangeChange,onVisibleRangeCommit,visibleRange};});
  const local=useRef<ReturnType<typeof createWaveStore>|null>(null);
  if(!local.current)local.current=createWaveStore(visibleRange);
  const store=local.current;
  const snapshot=useStore(store,s=>s);
  const range=snapshot.active?snapshot.range:visibleRange;
  const seek=(next:number)=>{
    const value=clamp(next);
    lastPosition.current=value;
    latest.current.onSeekNormalized?.(value);
  };
  const responder=useRef<ReturnType<typeof PanResponder.create>|null>(null);
  if(!responder.current)responder.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>latest.current.onSeekNormalized!=null||latest.current.onVisibleRangeCommit!=null,
    onPanResponderGrant:()=>store.setState({active:false,range:latest.current.visibleRange}),
    onPanResponderMove:(_e,g)=>{
      const p=latest.current;
      if(!p.onVisibleRangeCommit||width.current<=0)return;
      if(!store.getState().active&&Math.abs(g.dx)<SLOP)return;
      const next=scrollRange(p.visibleRange,g.dx,width.current);
      const s=store.getState();
      if(!s.active||next.start!==s.range.start){
        store.setState({active:true,range:next});
        p.onVisibleRangeChange?.(next);
      }
    },
    onPanResponderRelease:e=>{
      const p=latest.current;
      const s=store.getState();
      if(s.active){
        store.setState({active:false});
        if(s.range.start!==p.visibleRange.start)p.onVisibleRangeCommit?.(s.range);
        return;
      }
      if(p.onSeekNormalized&&width.current>0)seek(rangePosition(p.visibleRange,e.nativeEvent.locationX,width.current));
    },
    onPanResponderTerminate:()=>{
      if(!store.getState().active)return;
      store.setState({active:false});
      latest.current.onVisibleRangeChange?.(latest.current.visibleRange);
    },
    onPanResponderTerminationRequest:()=>!store.getState().active,
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
    accessibilityState={{disabled:disabledReason!==undefined}}
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

function createWaveStore(range:WaveformRange){return createStore<Scroll>(()=>({active:false,range}));}
