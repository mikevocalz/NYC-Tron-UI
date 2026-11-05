import {useEffect,useRef} from "react";
import {Text,TextInput,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {IconButton} from "../../IconButton.tsx";
import {useLocalStore} from "../../useLocalStore.ts";
import {trackSilenced,type TimelineTrack,type TrackKind} from "./edits.ts";

/** A track switch Splice stores (`setTrackFlags`). */
export type TrackFlag="locked"|"hidden"|"muted"|"solo";

/** Props for {@linkcode TrackHeaders}. */
export interface TrackHeadersProps extends Omit<ViewProps,"children"> {
  /** The same tracks, in the same order, as the lanes beside it. */
  readonly tracks:readonly TimelineTrack[];
  /** Match `TimelineClipLane` `laneHeight`. @default 56 */
  readonly laneHeight?:number;
  /** One call per toggle press. */
  readonly onSetFlag:(trackId:string,flag:TrackFlag,value:boolean)=>void;
  /** On Enter or blur with a changed, nonblank name. Escape restores the old one. */
  readonly onRename:(trackId:string,name:string)=>void;
  /** Move to `toIndex` in the host's track list (Splice `moveTrack`). */
  readonly onMove?:(trackId:string,toIndex:number)=>void;
  /**
   * Where a track goes when moved up (`-1`) or down (`1`). Defaults to its
   * neighbour in `tracks`; `OverlayAndEffectsTrackStack` keeps moves inside
   * a kind's group.
   */
  readonly moveTarget?:(trackId:string,direction:-1|1)=>number|undefined;
  /** Shows up/down buttons in place of the switches. */
  readonly reorder?:boolean;
  /** Header width. @default 216 */
  readonly width?:number;
  readonly disabled?:boolean;
  className?:string;
  unstyled?:boolean;
}

export const TRACK_KIND_LABEL:Readonly<Record<TrackKind,string>>={video:"Video",overlay:"Overlay",audio:"Audio"};
/** Which switches a kind of track has: hide on picture tracks, mute and solo on audio, lock on all. */
export const trackFlags=(kind:TrackKind):readonly TrackFlag[]=>kind==="audio"?["locked","muted","solo"]:["locked","hidden"];

function LockGlyph({open,styled}:{open:boolean;styled:boolean}){
  const ink=styled?"border-text":"";
  return <View style={{alignItems:"center",width:16,height:18}}>
    <View {...{className:ink}} style={{width:10,height:8,borderWidth:2,borderBottomWidth:0,borderTopLeftRadius:5,borderTopRightRadius:5,
      marginLeft:open?8:0}}/>
    <View {...{className:styled?"bg-text":""}} style={{width:14,height:9,borderRadius:2}}/>
  </View>;
}
function EyeGlyph({off,styled}:{off:boolean;styled:boolean}){
  return <View style={{width:20,height:16,alignItems:"center",justifyContent:"center"}}>
    <View {...{className:styled?"border-text":""}} style={{width:18,height:11,borderWidth:2,borderRadius:9,alignItems:"center",justifyContent:"center"}}>
      <View {...{className:styled?"bg-text":""}} style={{width:5,height:5,borderRadius:3}}/>
    </View>
    {off?<View {...{className:styled?"bg-text":""}} style={{position:"absolute",width:22,height:2,transform:[{rotate:"-35deg"}]}}/>:null}
  </View>;
}
function Letter({ch,styled}:{ch:string;styled:boolean}){
  return <Text {...{className:joinClasses(styled&&"text-text font-semibold")}}>{ch}</Text>;
}
function Chevron({up,styled}:{up:boolean;styled:boolean}){
  return <View {...{className:styled?(up?"border-b-text":"border-t-text"):""}} style={{width:0,height:0,borderLeftWidth:7,borderRightWidth:7,
    borderLeftColor:"transparent",borderRightColor:"transparent",...(up?{borderBottomWidth:9}:{borderTopWidth:9})}}/>;
}

function NameField({track,onRename,disabled,styled}:{track:TimelineTrack;onRename:(id:string,name:string)=>void;disabled:boolean;styled:boolean}){
  const [draft,store]=useLocalStore(()=>track.label);
  const editing=useRef(false);
  // A rename from elsewhere (undo, another view) replaces the draft unless the user is typing.
  useEffect(()=>{if(!editing.current)store.set(track.label);},[track.label,store]);
  const commit=()=>{
    editing.current=false;
    const name=store.get().trim();
    if(!name){store.set(track.label);return;}
    if(name!==track.label)onRename(track.id,name);
  };
  return <TextInput value={draft} editable={!disabled} accessibilityLabel={`Name of ${TRACK_KIND_LABEL[track.kind].toLowerCase()} track ${track.label}`}
    onFocus={()=>{editing.current=true;}} onChangeText={t=>store.set(t)} onSubmitEditing={commit} onBlur={commit}
    onKeyPress={e=>{if(e.nativeEvent.key==="Escape"){editing.current=false;store.set(track.label);}}}
    {...{className:joinClasses(styled&&"rounded-control text-text text-sm font-semibold px-1 focus-visible:ring-2 focus-visible:ring-focus")}}
    style={{minHeight:28,minWidth:0,flexShrink:1,paddingVertical:2}}/>;
}

/**
 * Track headers (D-18): one row per track, the height of its lane. Each row
 * has the track's name (edit in place; Enter or leaving the field renames,
 * Escape restores), its kind, and 44pt switches: lock on every track, hide
 * on video and overlay tracks, mute and solo on audio tracks. Solo silences
 * every audio track that is not soloed, and the header says so. In `reorder`
 * mode the switches give way to move up and move down buttons.
 */
export function TrackHeaders({
  tracks,laneHeight=56,onSetFlag,onRename,onMove,moveTarget,reorder=false,width=216,disabled=false,
  className,unstyled=false,testID,style,...rest
}:TrackHeadersProps){
  if(!Number.isFinite(laneHeight)||laneHeight<44)throw new RangeError("laneHeight must be at least 44");
  const styled=!unstyled;
  const target=moveTarget??((id:string,d:-1|1)=>{const i=tracks.findIndex(t=>t.id===id);const j=i+d;return i<0||j<0||j>=tracks.length?undefined:j;});
  const id=(s:string)=>testID?{testID:testID+"-"+s}:{};
  return <View {...rest} {...(testID?{testID}:{})} accessibilityRole="list" accessibilityLabel="Track headers"
    {...{className:joinClasses(className)}} style={[{width},style]}>
    {tracks.map(track=>{
      const silenced=trackSilenced(track,tracks);
      const soloedAway=track.kind==="audio"&&!track.muted&&silenced;
      const status=track.locked?"Locked":soloedAway?"Silent: another track is soloed":silenced?(track.kind==="audio"?"Muted":"Hidden"):TRACK_KIND_LABEL[track.kind];
      const flagButton=(flag:TrackFlag)=>{
        const on=track[flag]===true;
        const label={locked:on?"Unlock":"Lock",hidden:on?"Show":"Hide",muted:on?"Unmute":"Mute",solo:on?"Unsolo":"Solo"}[flag];
        const icon=flag==="locked"?<LockGlyph open={!on} styled={styled}/>:flag==="hidden"?<EyeGlyph off={on} styled={styled}/>
          :<Letter ch={flag==="muted"?"M":"S"} styled={styled}/>;
        return <IconButton key={flag} size="sm" variant="ghost" selected={on} disabled={disabled} unstyled={unstyled}
          aria-label={`${label} ${track.label}`} icon={icon} onPress={()=>onSetFlag(track.id,flag,!on)} {...id(track.id+"-"+flag)}/>;
      };
      const up=target(track.id,-1),down=target(track.id,1);
      return <View key={track.id} accessibilityLabel={`${track.label}, ${status}`}
        {...{className:joinClasses(styled&&"bg-surface-raised border-b border-border")}}
        style={{height:laneHeight,flexDirection:"row",alignItems:"center",gap:4,paddingStart:8,paddingEnd:2}}>
        <View style={{flex:1,minWidth:0,gap:1}}>
          <NameField track={track} onRename={onRename} disabled={disabled} styled={styled}/>
          <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text-muted text-xs px-1")}}>{status}</Text>
        </View>
        {reorder&&onMove?<>
          <IconButton size="sm" variant="ghost" disabled={disabled||up===undefined} unstyled={unstyled} aria-label={`Move ${track.label} up`}
            icon={<Chevron up styled={styled}/>} onPress={()=>{if(up!==undefined)onMove(track.id,up);}} {...id(track.id+"-up")}/>
          <IconButton size="sm" variant="ghost" disabled={disabled||down===undefined} unstyled={unstyled} aria-label={`Move ${track.label} down`}
            icon={<Chevron up={false} styled={styled}/>} onPress={()=>{if(down!==undefined)onMove(track.id,down);}} {...id(track.id+"-down")}/>
        </>:trackFlags(track.kind).map(flagButton)}
      </View>;
    })}
  </View>;
}
