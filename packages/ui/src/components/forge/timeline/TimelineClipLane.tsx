import {useEffect,useRef,type ReactNode} from "react";
import {Platform,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {useLocalStore,type LocalStore} from "../../local-store.ts";
import {keyboardKey,type KeyEventLike} from "../../gestures/drag-transport.ts";
import {useLocalPointer} from "../../gestures/useLocalPointer.ts";
import {formatTimecode,type FrameRate} from "../timebase.ts";
import {ClipTrimHandles} from "./ClipTrimHandles.tsx";
import {
  clipLength,moveEdit,movePreview,snapTargets,splitEdit,visibleClips,
  type EditPreview,type TimelineClip,type TimelineEdit,type TimelineTrack,
} from "./edits.ts";
import {framesToSeconds} from "./time.ts";
import {frameToX,scrollBy,visibleRange,zoomAt,type TimelineViewport} from "./viewport.ts";

/** What a press on a clip does. `razor` splits at the pressed frame (D-20). */
export type TimelineTool="select"|"razor";

/** Props for {@linkcode TimelineClipLane}. */
export interface TimelineClipLaneProps extends Omit<ViewProps,"children"> {
  /** Tracks top to bottom. Map the engine's timeline read (Splice `timeline`) to this shape. */
  readonly tracks:readonly TimelineTrack[];
  readonly viewport:TimelineViewport;
  /** Pan, pinch and Ctrl/Cmd-wheel zoom. View state, not an edit. */
  readonly onViewportChange:(viewport:TimelineViewport)=>void;
  readonly rate:FrameRate;
  readonly durationFrames:number;
  readonly playheadFrame:number;
  readonly selectedClipId?:string;
  readonly onSelect:(clipId:string|undefined)=>void;
  /** One edit per finished gesture: a move, a trim or a split. */
  readonly onEdit:(edit:TimelineEdit)=>void;
  /** @default "select" */
  readonly tool?:TimelineTool;
  /** Snap moves and trims to clip edges and the playhead within 8 layout units. @default true */
  readonly snapping?:boolean;
  /** Lane height, at least 44. @default 56 */
  readonly laneHeight?:number;
  /** Thumbnails, waveforms or other region content for a clip, drawn under its label. */
  readonly renderClipContent?:(clip:TimelineClip,track:TimelineTrack,size:{width:number;height:number})=>ReactNode;
  readonly dropFrame?:boolean;
  readonly disabled?:boolean;
  className?:string;
  unstyled?:boolean;
}

type Drag={clipId:string;preview:EditPreview}|undefined;
type Pan={pan:(dx:number)=>void;panStart:()=>void};
const NO_SELECT=(Platform.OS==="web"?{userSelect:"none",touchAction:"none"}:{}) as object;
const SNAP_PX=8;
const TAP_PX=4;

interface ClipViewProps {
  clip:TimelineClip;track:TimelineTrack;tracks:readonly TimelineTrack[];viewport:TimelineViewport;rate:FrameRate;
  laneHeight:number;selected:boolean;tool:TimelineTool;playheadFrame:number;snapping:boolean;disabled:boolean;styled:boolean;
  dropFrame:boolean;drag:LocalStore<Drag>;dragState:Drag;pan:Pan;
  onSelect:(id:string|undefined)=>void;onEdit:(e:TimelineEdit)=>void;
  renderClipContent?:TimelineClipLaneProps["renderClipContent"];
}

function ClipView(p:ClipViewProps){
  const {clip,track,viewport,rate,laneHeight,selected,tool,playheadFrame,snapping,disabled,styled,dropFrame,drag,dragState}=p;
  const latest=useRef(p);
  latest.current=p;
  const session=useRef<{x0:number;moved:boolean;moving:boolean}|undefined>(undefined);
  const targets=()=>snapping?snapTargets(latest.current.tracks,clip.id,[latest.current.playheadFrame]):[];
  const threshold=snapping?SNAP_PX/viewport.pxPerFrame:0;
  const mine=dragState?.clipId===clip.id?dragState.preview:undefined;
  const startFrame=mine?.startFrame??clip.startFrame;
  const geometry={...clip,startFrame,sourceIn:mine?.sourceIn??clip.sourceIn,sourceOut:mine?.sourceOut??clip.sourceOut};
  const left=frameToX(viewport,startFrame);
  const width=Math.max(2,clipLength(geometry)*viewport.pxPerFrame);
  const invalid=mine!==undefined&&!mine.valid;
  const clear=()=>drag.set(undefined);
  const handlers=useLocalPointer({
    disabled,
    onBegin:pt=>{
      const c=latest.current;
      session.current={x0:pt.x,moved:false,moving:c.selected&&c.tool==="select"};
      if(!session.current.moving)c.pan.panStart();
    },
    onMove:pt=>{
      const s=session.current;
      if(!s)return;
      const dx=pt.x-s.x0;
      if(Math.abs(dx)>TAP_PX)s.moved=true;
      if(!s.moved)return;
      const c=latest.current;
      if(!s.moving){c.pan.pan(dx);return;}
      drag.set({clipId:clip.id,preview:movePreview(c.track,c.clip,c.clip.startFrame+dx/c.viewport.pxPerFrame,{targets:targets(),threshold})});
    },
    onRelease:pt=>{
      const s=session.current;
      session.current=undefined;
      const c=latest.current;
      if(s&&!s.moved){
        clear();
        if(c.tool==="razor"){
          const e=splitEdit(c.clip,c.track.id,c.clip.startFrame+pt.x/c.viewport.pxPerFrame,c.rate);
          if(e)c.onEdit(e);
        }else c.onSelect(c.clip.id);
        return;
      }
      if(s?.moving){
        const d=drag.get();
        clear();
        if(d?.clipId===c.clip.id){const e=moveEdit(c.clip,c.track.id,d.preview,c.rate);if(e)c.onEdit(e);}
      }
    },
    onCancel:()=>{session.current=undefined;clear();},
  });
  useEffect(()=>()=>{if(drag.get()?.clipId===clip.id)drag.set(undefined);},[drag,clip.id]);
  const nudge=(d:number)=>{
    if(disabled)return;
    const e=moveEdit(clip,track.id,movePreview(track,clip,clip.startFrame+d,{}),rate);
    if(e)p.onEdit(e);
  };
  const split=()=>{
    if(disabled)return;
    const e=splitEdit(clip,track.id,playheadFrame,rate);
    if(e)p.onEdit(e);
  };
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    if(key==="Escape"){session.current=undefined;clear();return;}
    if(key==="Enter"||key===" "){p.onSelect(clip.id);}
    else if(selected&&(key==="ArrowLeft"||key==="ArrowRight"))nudge(key==="ArrowLeft"?-1:1);
    else if(key==="s"||key==="S")split();
    else return;
    (event as {preventDefault?:()=>void}).preventDefault?.();
  };
  const tc=(f:number)=>formatTimecode(Math.max(0,Math.round(f)),rate,{dropFrame});
  const seconds=framesToSeconds(clipLength(geometry),rate);
  const name=clip.label??"Clip";
  const height=laneHeight-8;
  return <>
    {mine?.snappedTo!==undefined?<View pointerEvents="none" {...{className:joinClasses(styled&&"bg-focus")}}
      style={{position:"absolute",left:frameToX(viewport,mine.snappedTo)-0.5,top:0,bottom:0,width:1,zIndex:3}}/>:null}
    <View {...handlers}
      {...{onKeyDown,focusable:!disabled,className:joinClasses(
        styled&&"rounded-control bg-surface-raised focus-visible:ring-2 focus-visible:ring-focus",
        styled&&(invalid?"border-2 border-danger":selected?"border-2 border-focus":"border border-border"))}}
      accessible accessibilityRole="button"
      accessibilityLabel={`${name}, ${track.label}, starts ${tc(clip.startFrame)}, ${seconds.toFixed(1)} seconds${selected?", selected":""}`}
      accessibilityHint={tool==="razor"?"Press to split here":selected?"Drag to move. Arrow keys nudge one frame.":"Press to select"}
      accessibilityState={{selected,disabled}}
      accessibilityActions={[
        {name:"activate",label:"Select"},{name:"moveEarlier",label:"Move one frame earlier"},
        {name:"moveLater",label:"Move one frame later"},{name:"split",label:"Split at playhead"},
      ]}
      onAccessibilityAction={e=>{
        const a=e.nativeEvent.actionName;
        if(a==="activate")p.onSelect(clip.id);
        else if(a==="moveEarlier")nudge(-1);
        else if(a==="moveLater")nudge(1);
        else if(a==="split")split();
      }}
      style={{position:"absolute",left,top:4,width,height,zIndex:selected?2:1,overflow:"visible",...NO_SELECT}}>
      <View pointerEvents="none" style={{flex:1,overflow:"hidden",paddingHorizontal:6,paddingVertical:4,gap:2}}>
        <View style={{flexDirection:"row",justifyContent:"space-between",gap:6}}>
          <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text text-xs font-semibold")}} style={{flexShrink:1}}>{name}</Text>
          {selected&&width>96?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{fontVariant:["tabular-nums"]}}>{seconds.toFixed(1)+" s"}</Text>:null}
        </View>
        {invalid?<Text {...{className:joinClasses(styled&&"text-danger text-xs")}} numberOfLines={1}>Overlaps another clip</Text>
          :p.renderClipContent?.(clip,track,{width,height:height-24})??null}
      </View>
      {selected&&tool==="select"?<ClipTrimHandles clip={clip} track={track} rate={rate} pxPerFrame={viewport.pxPerFrame} height={height}
        snapTargets={snapping?snapTargets(p.tracks,clip.id,[playheadFrame]):[]} snapThreshold={threshold}
        dropFrame={dropFrame} disabled={disabled} unstyled={!styled}
        onPreview={(_,preview)=>drag.set(preview?{clipId:clip.id,preview}:undefined)} onEdit={p.onEdit}/>:null}
    </View>
  </>;
}

/**
 * Clip lanes (D-15): one lane per track, clips positioned by frame, only the
 * visible ones mounted. Press a clip to select it; drag the selected clip to
 * move it (snapping to edges and the playhead, refusing overlaps), drag its
 * edges to trim (D-19). With the razor tool a press splits there (D-20).
 * Dragging empty lane space or an unselected clip pans; two fingers pinch-zoom
 * around their midpoint; on web, Ctrl/Cmd + wheel zooms at the pointer and
 * Shift + wheel scrolls. Every finished gesture emits one `TimelineEdit`.
 */
export function TimelineClipLane({
  tracks,viewport,onViewportChange,rate,durationFrames,playheadFrame,selectedClipId,onSelect,onEdit,
  tool="select",snapping=true,laneHeight=56,renderClipContent,dropFrame=false,disabled=false,
  className,unstyled=false,testID,style,...rest
}:TimelineClipLaneProps){
  if(!Number.isFinite(laneHeight)||laneHeight<44)throw new RangeError("laneHeight must be at least 44");
  const [dragState,drag]=useLocalStore(()=>undefined as Drag);
  const latest=useRef({viewport,onViewportChange,durationFrames,rate});
  latest.current={viewport,onViewportChange,durationFrames,rate};
  const base=useRef(viewport);
  const pan:Pan={
    panStart:()=>{base.current=latest.current.viewport;},
    pan:dx=>{const l=latest.current;l.onViewportChange(scrollBy(base.current,-dx,l.durationFrames));},
  };
  const press=useRef({x0:0,moved:false});
  const handlers=useLocalPointer({
    disabled,
    onBegin:pt=>{press.current={x0:pt.x,moved:false};pan.panStart();},
    onMove:pt=>{
      const dx=pt.x-press.current.x0;
      if(Math.abs(dx)>TAP_PX)press.current.moved=true;
      if(press.current.moved)pan.pan(dx);
    },
    onRelease:()=>{if(!press.current.moved)onSelect(undefined);},
    // A second finger cancels the pan; the pinch then zooms from where the pan left off.
    onCancel:()=>{press.current.moved=true;base.current=latest.current.viewport;},
    onPinch:(scale,center)=>{const l=latest.current;l.onViewportChange(zoomAt(base.current,center.x,scale,l.durationFrames,l.rate));},
    onPinchEnd:()=>{},
  });
  const container=useRef<unknown>(null);
  useEffect(()=>{
    if(Platform.OS!=="web")return;
    const el=container.current as HTMLElement|null;
    if(!el?.addEventListener)return;
    const onWheel=(e:WheelEvent)=>{
      const l=latest.current;
      if(e.ctrlKey||e.metaKey){
        e.preventDefault();
        const x=e.clientX-el.getBoundingClientRect().left;
        l.onViewportChange(zoomAt(l.viewport,x,Math.exp(-e.deltaY/300),l.durationFrames,l.rate));
      }else if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)){
        e.preventDefault();
        l.onViewportChange(scrollBy(l.viewport,e.shiftKey?e.deltaY:e.deltaX,l.durationFrames));
      }
    };
    el.addEventListener("wheel",onWheel,{passive:false});
    return ()=>el.removeEventListener("wheel",onWheel);
  },[]);
  const styled=!unstyled;
  const range=visibleRange(viewport);
  return <View {...rest} ref={container as never} {...(testID?{testID}:{})} accessibilityRole="list" accessibilityLabel="Timeline tracks"
    {...{className:joinClasses(className)}} style={[{width:viewport.widthPx,direction:"ltr"},style]}>
    {tracks.map(track=>{
      const clips=visibleClips(track,{start:range.start-1,end:range.end+1});
      const sel=track.clips.find(c=>c.id===selectedClipId);
      if(sel&&!clips.includes(sel))clips.push(sel);
      return <View key={track.id} {...handlers}
        {...{className:joinClasses(styled&&"bg-surface-sunken border-b border-border")}}
        style={{height:laneHeight,overflow:"hidden",...NO_SELECT}}>
        <Text pointerEvents="none" numberOfLines={1} {...{className:joinClasses(styled&&"text-text-muted text-xs")}}
          style={{position:"absolute",left:6,bottom:2,zIndex:0}}>{track.label}</Text>
        {clips.map(clip=><ClipView key={clip.id} clip={clip} track={track} tracks={tracks} viewport={viewport} rate={rate}
          laneHeight={laneHeight} selected={clip.id===selectedClipId} tool={tool} playheadFrame={playheadFrame}
          snapping={snapping} disabled={disabled} styled={styled} dropFrame={dropFrame} drag={drag} dragState={dragState}
          pan={pan} onSelect={onSelect} onEdit={onEdit} renderClipContent={renderClipContent}/>)}
      </View>;
    })}
  </View>;
}
