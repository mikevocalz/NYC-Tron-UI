/*
 * Original implementation for NYC-Tron UI; no third-party source. Provenance
 * is recorded in docs/COMPONENT_OWNERSHIP.md.
 *
 * STRUCK 2026-11-05: effects and adjustment tracks. Forge has no video effects
 * pipeline (D-38 is deferred on the video-processing backend), so such a
 * track would hold clips nothing can render. No button adds one. The stack
 * gains that kind when Splice gets an effect track and a renderer for it.
 */
import {Pressable,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {useLocalStore} from "../../useLocalStore.ts";
import {TrackHeaders,type TrackFlag} from "./TrackHeaders.tsx";
import {TimelineClipLane,type TimelineClipLaneProps} from "./TimelineClipLane.tsx";
import {stackMoveTarget,stackOrder} from "./track-stack.ts";
import type {TrackKind} from "./edits.ts";

/** Props for {@linkcode OverlayAndEffectsTrackStack}. */
export interface OverlayAndEffectsTrackStackProps extends Omit<TimelineClipLaneProps,"tracks"> {
  /** The host's tracks in engine order; the stack groups them overlay, video, audio. */
  readonly tracks:TimelineClipLaneProps["tracks"];
  readonly onSetFlag:(trackId:string,flag:TrackFlag,value:boolean)=>void;
  readonly onRename:(trackId:string,name:string)=>void;
  /** Splice `moveTrack`: `toIndex` is a position in the host's list. */
  readonly onMoveTrack:(trackId:string,toIndex:number)=>void;
  /** Splice `addTrack`. */
  readonly onAddTrack:(kind:TrackKind)=>void;
  /** Header column width; the lanes take `viewport.widthPx`. @default 216 */
  readonly headerWidth?:number;
}

/**
 * The track stack (D-31): `TrackHeaders` beside `TimelineClipLane`, with
 * overlay tracks above video tracks above audio tracks, Add video, Add
 * overlay and Add audio track, and a Reorder switch that turns the header
 * switches into move up and move down within each group. Overlay tracks are
 * picture over the video tracks and take the same clips. Every lane prop
 * passes through to `TimelineClipLane`.
 */
export function OverlayAndEffectsTrackStack({
  tracks,onSetFlag,onRename,onMoveTrack,onAddTrack,headerWidth=216,laneHeight=56,disabled=false,unstyled=false,testID,
  style,className,...lane
}:OverlayAndEffectsTrackStackProps){
  const styled=!unstyled;
  const id=(s:string)=>testID?{testID:testID+"-"+s}:{};
  const shown=stackOrder(tracks);
  // Reorder mode is view state for this stack only.
  const [reorder,reorderStore]=useLocalStore(()=>false);
  const setReorder=(v:boolean)=>reorderStore.set(v);
  return <View {...(testID?{testID}:{})} {...{className:joinClasses("gap-2",className)}} style={style}>
    <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}>
      <Button title="Add video track" variant="secondary" size="sm" disabled={disabled} onPress={()=>onAddTrack("video")} {...id("add-video")}/>
      <Button title="Add overlay track" variant="secondary" size="sm" disabled={disabled} onPress={()=>onAddTrack("overlay")} {...id("add-overlay")}/>
      <Button title="Add audio track" variant="secondary" size="sm" disabled={disabled} onPress={()=>onAddTrack("audio")} {...id("add-audio")}/>
      <Pressable accessibilityRole="switch" aria-checked={reorder} accessibilityState={{checked:reorder,disabled:disabled||tracks.length<2}}
        disabled={disabled||tracks.length<2} accessibilityLabel="Reorder tracks" onPress={()=>setReorder(!reorder)} {...id("reorder")}
        {...{className:joinClasses(styled&&"rounded-control border-2 px-3 focus-visible:ring-2 focus-visible:ring-focus",
          styled&&(reorder?"border-focus bg-surface-sunken":"border-border bg-surface-raised"))}}
        style={{minHeight:44,justifyContent:"center",opacity:disabled||tracks.length<2?0.4:1}}>
        <Text {...{className:joinClasses(styled&&(reorder?"text-text font-semibold":"text-text"))}}>{reorder?"Done reordering":"Reorder"}</Text>
      </Pressable>
    </View>
    {/* Headers stay at the start of time, left, in RTL too: the lanes never mirror. */}
    {shown.length?<View style={{flexDirection:"row",direction:"ltr"}}>
      <TrackHeaders tracks={shown} laneHeight={laneHeight} width={headerWidth} onSetFlag={onSetFlag} onRename={onRename}
        onMove={onMoveTrack} moveTarget={(trackId,d)=>stackMoveTarget(tracks,trackId,d)} reorder={reorder}
        disabled={disabled} unstyled={unstyled} {...id("headers")}
        {...{className:joinClasses(styled&&"border-e border-border")}}/>
      <TimelineClipLane {...lane} tracks={shown} laneHeight={laneHeight} disabled={disabled} unstyled={unstyled} {...id("lanes")}/>
    </View>:<Text {...{className:joinClasses(styled&&"text-text-muted text-sm")}} style={{paddingVertical:12}}>
      No tracks yet. Add a video or audio track to start.</Text>}
  </View>;
}

