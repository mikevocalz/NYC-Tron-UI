import {useEffect,useRef} from "react";
import {Platform,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {TextField} from "../../TextField.tsx";
import {useLocalStore} from "../../useLocalStore.ts";
import {keyboardKey,type KeyEventLike} from "../../gestures/drag-transport.ts";
import {useLocalPointer} from "../../gestures/useLocalPointer.ts";
import {formatTimecode,type FrameRate} from "../timebase.ts";
import {framesToSeconds} from "./time.ts";
import {adjacentMarker,moveMarker,resizeMarker,sortMarkers,type MarkerUpdate,type TimelineMarker} from "./markers.ts";
import {frameToX,type TimelineViewport} from "./viewport.ts";

/** Props for {@linkcode TimelineMarkers}. */
export interface TimelineMarkersProps extends Omit<ViewProps,"children"> {
  readonly markers:readonly TimelineMarker[];
  readonly viewport:TimelineViewport;
  readonly rate:FrameRate;
  readonly durationFrames:number;
  /** Where Add marker puts one. */
  readonly playheadFrame:number;
  readonly selectedMarkerId?:string;
  readonly onSelect:(id:string|undefined)=>void;
  /** Add at the playhead (Splice `addMarker`). */
  readonly onAdd:(at:{frame:number;seconds:number})=>void;
  /** Once per drag release, key press, button or committed text field (Splice `updateMarker`). */
  readonly onUpdate:(id:string,update:MarkerUpdate)=>void;
  readonly onRemove:(id:string)=>void;
  /** Jump to a marker. */
  readonly onSeek:(frame:number)=>void;
  readonly dropFrame?:boolean;
  readonly disabled?:boolean;
  className?:string;
  unstyled?:boolean;
}

const NO_SELECT=(Platform.OS==="web"?{userSelect:"none",touchAction:"none"}:{}) as object;
const HIT=44;
const TAP_PX=4;

function Flag({m,viewport,rate,durationFrames,selected,onSelect,onUpdate,onRemove,onSeek,dropFrame,disabled,styled}:{
  m:TimelineMarker;viewport:TimelineViewport;rate:FrameRate;durationFrames:number;selected:boolean;
  onSelect:(id:string|undefined)=>void;onUpdate:TimelineMarkersProps["onUpdate"];onRemove:(id:string)=>void;onSeek:(f:number)=>void;
  dropFrame:boolean;disabled:boolean;styled:boolean;
}){
  const [preview,store]=useLocalStore(()=>undefined as number|undefined);
  const latest=useRef({m,viewport,rate,durationFrames,onUpdate,onSelect,disabled});
  latest.current={m,viewport,rate,durationFrames,onUpdate,onSelect,disabled};
  const s=useRef({x0:0,moved:false});
  const target=(dx:number)=>{const l=latest.current;return Math.round(l.m.frame+dx/l.viewport.pxPerFrame);};
  const handlers=useLocalPointer({
    disabled,
    onBegin:pt=>{s.current={x0:pt.x,moved:false};},
    onMove:pt=>{
      const dx=pt.x-s.current.x0;
      if(Math.abs(dx)>TAP_PX)s.current.moved=true;
      if(!s.current.moved)return;
      const l=latest.current;
      const u=moveMarker(l.m,target(dx),l.durationFrames,l.rate);
      store.set(u?.frame??l.m.frame);
    },
    onRelease:pt=>{
      const l=latest.current;
      store.set(undefined);
      if(l.disabled)return;
      if(!s.current.moved){l.onSelect(l.m.id);return;}
      const u=moveMarker(l.m,target(pt.x-s.current.x0),l.durationFrames,l.rate);
      if(u)l.onUpdate(l.m.id,u);
    },
    onCancel:()=>store.set(undefined),
  });
  useEffect(()=>()=>store.set(undefined),[store]);
  const frame=preview??m.frame;
  const x=frameToX(viewport,frame);
  const len=(m.durationFrames??0)*viewport.pxPerFrame;
  if(x+len<-HIT||x>viewport.widthPx+HIT)return null;
  const tc=formatTimecode(frame,rate,{dropFrame});
  const step=(d:number)=>{const u=moveMarker(m,m.frame+d,durationFrames,rate);if(u&&!disabled)onUpdate(m.id,u);};
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    const second=Math.max(1,Math.round(rate.numerator/rate.denominator));
    if(key==="Escape"){store.set(undefined);return;}
    if(key==="ArrowLeft"||key==="ArrowRight")step(key==="ArrowLeft"?-1:1);
    else if(key==="PageUp"||key==="PageDown")step(key==="PageUp"?second:-second);
    else if(key==="Enter"){onSelect(m.id);onSeek(m.frame);}
    else if(key===" ")onSelect(selected?undefined:m.id);
    else if((key==="Delete"||key==="Backspace")&&!disabled)onRemove(m.id);
    else return;
    (event as {preventDefault?:()=>void}).preventDefault?.();
  };
  const ink=styled?(selected?"bg-focus":"bg-info"):"";
  return <>
    {len>0?<View pointerEvents="none" {...{className:joinClasses(styled&&(selected?"bg-focus/20 border-y border-focus":"bg-info/15 border-y border-info/60"))}}
      style={{position:"absolute",left:x,top:22,height:12,width:len}}/>:null}
    <View {...handlers}
      {...{onKeyDown,focusable:!disabled,className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
      accessible accessibilityRole="adjustable"
      accessibilityLabel={`Marker ${m.name}${m.durationFrames?", range":""}${selected?", selected":""}`}
      accessibilityHint="Drag or use arrow keys to move. Enter jumps to it. Delete removes it."
      aria-valuemin={0} aria-valuemax={durationFrames} aria-valuenow={frame} aria-valuetext={tc} aria-disabled={disabled}
      accessibilityState={{selected,disabled}}
      accessibilityActions={[{name:"increment",label:"Later"},{name:"decrement",label:"Earlier"},{name:"activate",label:"Jump to marker"},
        {name:"remove",label:"Remove marker"}]}
      onAccessibilityAction={e=>{
        const a=e.nativeEvent.actionName;
        if(a==="increment")step(1);else if(a==="decrement")step(-1);
        else if(a==="activate"){onSelect(m.id);onSeek(m.frame);}else if(a==="remove"&&!disabled)onRemove(m.id);
      }}
      style={{position:"absolute",left:x-HIT/2,top:0,width:HIT,height:HIT,alignItems:"center",...NO_SELECT}}>
      {/* A pennant on a staff. */}
      <View pointerEvents="none" style={{position:"absolute",left:HIT/2-1,top:6,width:2,height:32}} {...{className:ink}}/>
      <View pointerEvents="none" style={{position:"absolute",left:HIT/2+1,top:6,width:12,height:10,borderTopRightRadius:3,borderBottomRightRadius:3}} {...{className:ink}}/>
    </View>
  </>;
}

/**
 * Sequence markers (D-24): a 44pt row (place it above the ruler) with a flag
 * per marker and a band for range markers, plus Add marker at the playhead,
 * previous and next, and an editor for the selected marker (name, note,
 * length, jump, remove). Drag a flag or use the arrow keys to move it; each
 * release, key press or committed field is one update. Markers have no
 * color: the engine stores none and the app's tokens draw them.
 */
export function TimelineMarkers({
  markers,viewport,rate,durationFrames,playheadFrame,selectedMarkerId,onSelect,onAdd,onUpdate,onRemove,onSeek,
  dropFrame=false,disabled=false,className,unstyled=false,testID,style,...rest
}:TimelineMarkersProps){
  const styled=!unstyled;
  const id=(s:string)=>testID?{testID:testID+"-"+s}:{};
  const tc=(f:number)=>formatTimecode(Math.max(0,Math.round(f)),rate,{dropFrame});
  const selected=markers.find(m=>m.id===selectedMarkerId);
  const prev=adjacentMarker(markers,playheadFrame,-1),next=adjacentMarker(markers,playheadFrame,1);
  const go=(m:TimelineMarker|undefined)=>{if(m){onSelect(m.id);onSeek(m.frame);}};
  const second=Math.max(1,Math.round(rate.numerator/rate.denominator));
  const [draft,store]=useLocalStore(()=>({id:"",name:"",note:""}));
  // The fields edit a draft of the selected marker; switching markers reloads it.
  useEffect(()=>{store.set({id:selected?.id??"",name:selected?.name??"",note:selected?.note??""});},[selected?.id,selected?.name,selected?.note,store]);
  const commitText=(field:"name"|"note")=>{
    if(!selected||disabled)return;
    const value=store.get()[field].trim();
    if(field==="name"&&!value){store.set(d=>({...d,name:selected.name}));return;}
    if(value===(selected[field]??""))return;
    onUpdate(selected.id,{frame:selected.frame,seconds:framesToSeconds(selected.frame,rate),[field]:value});
  };
  return <View {...rest} {...(testID?{testID}:{})} {...{className:joinClasses("gap-2",className)}} style={style}>
    <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}>
      <Button title="Add marker" variant="secondary" size="sm" disabled={disabled||durationFrames<0} {...id("add")}
        accessibilityHint={`Adds a marker at ${tc(playheadFrame)}`}
        onPress={()=>{const f=Math.min(durationFrames,Math.max(0,Math.round(playheadFrame)));onAdd({frame:f,seconds:framesToSeconds(f,rate)});}}/>
      <Button title="Previous" variant="ghost" size="sm" disabled={!prev} {...id("prev")}
        accessibilityLabel="Previous marker" accessibilityHint={prev?`Jump to ${prev.name}`:"No marker before the playhead"} onPress={()=>go(prev)}/>
      <Button title="Next" variant="ghost" size="sm" disabled={!next} {...id("next")}
        accessibilityLabel="Next marker" accessibilityHint={next?`Jump to ${next.name}`:"No marker after the playhead"} onPress={()=>go(next)}/>
      <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>
        {markers.length?`${markers.length} marker${markers.length===1?"":"s"}`:"No markers. Add one at the playhead."}
      </Text>
    </View>
    <View accessibilityRole="list" accessibilityLabel="Markers" {...{className:joinClasses(styled&&"bg-surface-sunken border-b border-border")}}
      style={{height:HIT,width:viewport.widthPx,overflow:"hidden",direction:"ltr"}}>
      {sortMarkers(markers).map(m=><Flag key={m.id} m={m} viewport={viewport} rate={rate} durationFrames={durationFrames}
        selected={m.id===selectedMarkerId} onSelect={onSelect} onUpdate={onUpdate} onRemove={onRemove} onSeek={onSeek}
        dropFrame={dropFrame} disabled={disabled} styled={styled}/>)}
    </View>
    {selected?<View {...id("editor")} {...{className:joinClasses(styled&&"rounded-card border border-border bg-surface-raised")}}
      style={{padding:12,gap:10}}>
      <View style={{flexDirection:"row",flexWrap:"wrap",gap:12}}>
        <TextField id={"marker-name-"+selected.id} label="Marker name" value={draft.name} editable={!disabled} style={{minWidth:160}}
          className="grow" onChangeText={name=>store.set(d=>({...d,name}))} onBlur={()=>commitText("name")} onSubmitEditing={()=>commitText("name")}/>
        <TextField id={"marker-note-"+selected.id} label="Note" value={draft.note} editable={!disabled} style={{minWidth:160}}
          className="grow" onChangeText={note=>store.set(d=>({...d,note}))} onBlur={()=>commitText("note")} onSubmitEditing={()=>commitText("note")}/>
      </View>
      <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}>
        <Text {...{className:joinClasses(styled&&"text-text text-sm")}} style={{fontVariant:["tabular-nums"]}}>
          {selected.durationFrames?`${tc(selected.frame)} for ${tc(selected.durationFrames)}`:`At ${tc(selected.frame)}`}
        </Text>
        <Button title="Shorter" variant="secondary" size="sm" disabled={disabled||!selected.durationFrames} {...id("shorter")}
          accessibilityHint="One second shorter; at zero it becomes a point marker"
          onPress={()=>{const u=resizeMarker(selected,(selected.durationFrames??0)-second,durationFrames,rate);if(u)onUpdate(selected.id,u);}}/>
        <Button title="Longer" variant="secondary" size="sm" disabled={disabled||selected.frame+(selected.durationFrames??0)>=durationFrames} {...id("longer")}
          accessibilityHint="One second longer; a point marker becomes a range"
          onPress={()=>{const u=resizeMarker(selected,(selected.durationFrames??0)+second,durationFrames,rate);if(u)onUpdate(selected.id,u);}}/>
        <Button title="Jump to marker" variant="secondary" size="sm" {...id("jump")} onPress={()=>onSeek(selected.frame)}/>
        <Button title="Remove" variant="ghost" size="sm" disabled={disabled} {...id("remove")}
          accessibilityLabel={`Remove marker ${selected.name}`} onPress={()=>onRemove(selected.id)}/>
      </View>
    </View>:null}
  </View>;
}
