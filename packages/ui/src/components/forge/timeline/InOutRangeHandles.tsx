import {Platform,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {keyboardKey,type KeyEventLike} from "../../gestures/drag-transport.ts";
import {formatTimecode,type FrameRate} from "../timebase.ts";
import {setMark,type InOutRange} from "./edits.ts";
import {frameForKey} from "./frame-keys.ts";
import {frameToX,xToFrame,type TimelineViewport} from "./viewport.ts";
import {useFrameScrub} from "./useFrameScrub.ts";

/** Props for {@linkcode InOutRangeHandles}. */
export interface InOutRangeHandlesProps extends Omit<ViewProps,"children"> {
  readonly viewport:TimelineViewport;
  readonly range:InOutRange;
  readonly durationFrames:number;
  readonly rate:FrameRate;
  /** Where Set in / Set out place a mark. */
  readonly playheadFrame:number;
  /** Drag preview of the range. */
  readonly onPreview?:(range:InOutRange)=>void;
  /** One commit per handle release, key press or button. */
  readonly onCommit:(range:InOutRange)=>void;
  readonly dropFrame?:boolean;
  readonly disabled?:boolean;
  className?:string;
  unstyled?:boolean;
}

const NO_SELECT=(Platform.OS==="web"?{userSelect:"none",touchAction:"none"}:{}) as object;
const HIT=44;

function MarkHandle({mark,frame,range,viewport,durationFrames,rate,onPreview,onCommit,dropFrame,disabled,styled}:{
  mark:"in"|"out";frame:number;range:InOutRange;viewport:TimelineViewport;durationFrames:number;rate:FrameRate;
  onPreview?:(r:InOutRange)=>void;onCommit:(r:InOutRange)=>void;dropFrame:boolean;disabled:boolean;styled:boolean;
}){
  const left=frameToX(viewport,frame)-HIT/2;
  const commit=(f:number)=>onCommit(setMark(range,mark,f,durationFrames));
  const scrub=useFrameScrub({frame,disabled,
    onScrub:f=>onPreview?.(setMark(range,mark,f,durationFrames)),onCommit:commit,
    frameAt:p=>Math.min(durationFrames,Math.max(0,Math.round(xToFrame(viewport,left+p.x)))),
    grabPxPerFrame:viewport.pxPerFrame,durationFrames});
  const shownX=frameToX(viewport,scrub.shown);
  const label=mark==="in"?"In point":"Out point";
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    if(key==="Escape"){scrub.cancel();return;}
    const next=frameForKey(key,frame,durationFrames,rate);
    if(next===undefined||disabled)return;
    (event as {preventDefault?:()=>void}).preventDefault?.();
    if(next!==frame)commit(next);
  };
  if(shownX<-HIT||shownX>viewport.widthPx+HIT)return null;
  return <View {...scrub.handlers}
    {...{onKeyDown,focusable:!disabled,className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
    accessible accessibilityRole="adjustable" accessibilityLabel={label}
    aria-valuemin={0} aria-valuemax={durationFrames} aria-valuenow={scrub.shown}
    aria-valuetext={formatTimecode(scrub.shown,rate,{dropFrame})} aria-disabled={disabled}
    accessibilityActions={[{name:"increment",label:"Later"},{name:"decrement",label:"Earlier"}]}
    onAccessibilityAction={e=>{
      const d=e.nativeEvent.actionName==="increment"?1:e.nativeEvent.actionName==="decrement"?-1:0;
      if(d&&!disabled)commit(frame+d);
    }}
    style={{position:"absolute",left:shownX-HIT/2,top:0,width:HIT,height:HIT,alignItems:"center",justifyContent:"center",...NO_SELECT}}>
    <View pointerEvents="none" {...{className:joinClasses(styled&&"bg-accent")}}
      style={{width:4,height:30,borderRadius:2}}/>
  </View>;
}

/**
 * In and out marks (D-12): Set in / Set out / Clear buttons that act at the
 * playhead, above a 44pt band (place it right over the ruler) with the marked
 * range filled and a draggable, keyboard-adjustable handle per mark. Setting an in at or after the out (or the
 * reverse) clears the other mark instead of making an empty range.
 */
export function InOutRangeHandles({
  viewport,range,durationFrames,rate,playheadFrame,onPreview,onCommit,dropFrame=false,disabled=false,
  className,unstyled=false,testID,style,...rest
}:InOutRangeHandlesProps){
  const styled=!unstyled;
  const tc=(f:number)=>formatTimecode(f,rate,{dropFrame});
  const startX=range.inFrame===undefined?0:frameToX(viewport,range.inFrame);
  const endX=range.outFrame===undefined?viewport.widthPx:frameToX(viewport,range.outFrame);
  const hasRange=range.inFrame!==undefined||range.outFrame!==undefined;
  const id=(s:string)=>testID?{testID:testID+"-"+s}:{};
  const common={range,viewport,durationFrames,rate,onPreview,onCommit,dropFrame,disabled,styled};
  return <View {...rest} {...(testID?{testID}:{})} {...{className:joinClasses("gap-2",className)}} style={style}>
    <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}>
      <Button title="Set in" variant="secondary" size="sm" disabled={disabled} {...id("set-in")}
        onPress={()=>onCommit(setMark(range,"in",playheadFrame,durationFrames))}/>
      <Button title="Set out" variant="secondary" size="sm" disabled={disabled} {...id("set-out")}
        onPress={()=>onCommit(setMark(range,"out",playheadFrame,durationFrames))}/>
      <Button title="Clear" variant="ghost" size="sm" disabled={disabled||!hasRange} {...id("clear")}
        accessibilityHint={hasRange?"Remove the in and out marks":"No marks to clear"} onPress={()=>onCommit({})}/>
      <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{fontVariant:["tabular-nums"]}}>
        {hasRange?`In ${range.inFrame===undefined?"start":tc(range.inFrame)}, out ${range.outFrame===undefined?"end":tc(range.outFrame)}`:"No range marked"}
      </Text>
    </View>
    <View {...{className:joinClasses(styled&&"bg-surface-sunken border-b border-border")}}
      style={{height:HIT,width:viewport.widthPx,overflow:"hidden",direction:"ltr"}}>
      {hasRange?<View pointerEvents="none" {...{className:joinClasses(styled&&"bg-accent/10 border-y border-accent")}}
        style={{position:"absolute",top:8,bottom:8,left:Math.max(0,startX),width:Math.max(0,Math.min(viewport.widthPx,endX)-Math.max(0,startX))}}/>:null}
      {range.inFrame!==undefined?<MarkHandle mark="in" frame={range.inFrame} {...common}/>:null}
      {range.outFrame!==undefined?<MarkHandle mark="out" frame={range.outFrame} {...common}/>:null}
    </View>
  </View>;
}
