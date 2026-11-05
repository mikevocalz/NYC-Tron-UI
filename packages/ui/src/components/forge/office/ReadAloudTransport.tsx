import type {ReactNode} from "react";
import {Pressable,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {OFFICE_TOUCH_TARGET,PauseGlyph,PlayGlyph,SkipGlyph,ToolButton,officeKey,type OfficeKeyEvent} from "./office-controls.tsx";
import {clampRate,formatRate,readAloudPosition,stepRate,wordSpans,type ReadAloudSentence} from "./read-aloud-model.ts";

/**
 * Where the voice is. `unavailable` means the device has no usable voice; the
 * transport then shows {@linkcode ReadAloudTransportProps.unavailableReason}
 * and no play control.
 */
export type ReadAloudStatus="stopped"|"playing"|"paused"|"unavailable";

/** Props for {@linkcode ReadAloudTransport}. */
export interface ReadAloudTransportProps extends Omit<ViewProps,"children"> {
  /** The reading queue, from `readAloudSentences`. */
  readonly sentences:readonly ReadAloudSentence[];
  /** Index into `sentences` of the sentence being read or about to be read. */
  readonly index:number;
  /** Word being spoken inside the current sentence (from the voice's word-boundary event), if known. */
  readonly wordIndex?:number;
  readonly status:ReadAloudStatus;
  /** Shown when `status` is `unavailable`. @default "No voice is available on this device." */
  readonly unavailableReason?:string;
  /** Speed, 0.5–3 times the voice's normal rate. */
  readonly rate:number;
  readonly onRateChange:(rate:number)=>void;
  readonly onPlay:()=>void;
  readonly onPause:()=>void;
  /** Moves one sentence back (-1) or forward (1). Not called past either end. */
  readonly onSkip:(direction:-1|1)=>void;
  /** Ends the session. The stop control renders only when this is passed. */
  readonly onStop?:()=>void;
  /** Line above the sentence naming where the reader is: a heading, "Page 3 of 12". */
  readonly context?:string;
  /** Extra controls after the transport, such as page steppers. */
  readonly accessory?:ReactNode;
  /**
   * Repeat each new sentence through the screen reader. Off by default: with a
   * screen reader on, the voice and the reader would talk over each other.
   * @default false
   */
  readonly announceSentences?:boolean;
  /** @default "Read aloud" */
  readonly label?:string;
  className?:string;
  unstyled?:boolean;
}

/**
 * Controlled read-aloud transport shared by H-21 and K-18: the current
 * sentence with its spoken word marked, previous/play-pause/next, a speed
 * control and an optional stop. The app owns the voice (the platform's
 * text-to-speech) and feeds back status, sentence and word.
 *
 * Playback controls stay left to right in RTL layouts, as media controls do
 * on iOS, Android and the web; the text above them follows the layout.
 *
 * Keys on web: Space plays or pauses, Left/Right step a sentence, + and -
 * change speed.
 */
export function ReadAloudTransport({
  sentences,index,wordIndex,status,unavailableReason="No voice is available on this device.",rate,onRateChange,
  onPlay,onPause,onSkip,onStop,context,accessory,announceSentences=false,label="Read aloud",className,unstyled=false,...rest
}:ReadAloudTransportProps){
  const styled=!unstyled;
  const count=sentences.length;
  const current=count>0?sentences[Math.min(Math.max(index,0),count-1)]:undefined;
  const playing=status==="playing";
  const canPlay=status!=="unavailable"&&count>0;
  const canBack=canPlay&&index>0;
  const canForward=canPlay&&index<count-1;
  const r=clampRate(rate);
  const toggle=()=>{if(!canPlay)return;if(playing)onPause();else onPlay();};
  const onKeyDown=(e:OfficeKeyEvent)=>{
    const {key}=officeKey(e);
    let handled=true;
    if(key===" "||key==="Spacebar")toggle();
    else if(key==="ArrowRight"){if(canForward)onSkip(1);}
    else if(key==="ArrowLeft"){if(canBack)onSkip(-1);}
    else if(key==="+"||key==="=")onRateChange(stepRate(r,1));
    else if(key==="-"||key==="_")onRateChange(stepRate(r,-1));
    else handled=false;
    if(handled)(e as unknown as {preventDefault?:()=>void}).preventDefault?.();
  };
  const muted=joinClasses(styled&&"text-text-muted text-sm");
  return <View {...rest} accessibilityLabel={label} {...{role:"region",onKeyDown}}
    {...{className:joinClasses(styled&&"rounded-card border border-border bg-surface-raised",className)}}
    style={[{padding:12,gap:10},rest.style as object]}>
    <View style={{flexDirection:"row",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
      <Text numberOfLines={1} {...{className:muted}} style={{flexShrink:1}}>{context??label}</Text>
      <Text {...{className:muted}} style={{fontVariant:["tabular-nums"]}}>{readAloudPosition(index,count)}</Text>
    </View>
    {status==="unavailable"
      ?<Text accessibilityLiveRegion="polite" {...{className:joinClasses(styled&&"text-text")}}>{unavailableReason}</Text>
      :count===0
        ?<Text {...{className:joinClasses(styled&&"text-text")}}>This document has no text to read.</Text>
        :<SentenceText sentence={current!} wordIndex={playing||status==="paused"?wordIndex:undefined}
          styled={styled} announce={announceSentences}/>}
    <View style={{flexDirection:"row",alignItems:"center",gap:8,flexWrap:"wrap",direction:"ltr"}}>
      <ToolButton quiet label="Previous sentence" iconOnly disabled={!canBack} styled={styled} onPress={()=>onSkip(-1)}>
        <SkipGlyph styled={styled} back/>
      </ToolButton>
      <Pressable accessibilityRole="button" accessibilityLabel={playing?"Pause":"Play"}
        accessibilityState={{disabled:!canPlay}} disabled={!canPlay} onPress={toggle}
        {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken focus-visible:ring-2 focus-visible:ring-focus")}}
        style={{width:52,height:52,alignItems:"center",justifyContent:"center",opacity:canPlay?1:0.45}}>
        {playing?<PauseGlyph styled={styled} size={16}/>:<PlayGlyph styled={styled} size={16}/>}
      </Pressable>
      <ToolButton quiet label="Next sentence" iconOnly disabled={!canForward} styled={styled} onPress={()=>onSkip(1)}>
        <SkipGlyph styled={styled}/>
      </ToolButton>
      <Pressable accessibilityRole="adjustable" accessibilityLabel="Reading speed"
        accessibilityValue={{min:50,max:300,now:Math.round(r*100),text:formatRate(r)}}
        accessibilityActions={[{name:"increment"},{name:"decrement"}]}
        onAccessibilityAction={e=>onRateChange(stepRate(r,e.nativeEvent.actionName==="increment"?1:-1))}
        accessibilityHint="Tap for the next speed"
        onPress={()=>onRateChange(r>=3?0.5:stepRate(r,1))}
        {...{className:joinClasses(styled&&"rounded-control border border-border focus-visible:ring-2 focus-visible:ring-focus")}}
        style={{minWidth:64,minHeight:OFFICE_TOUCH_TARGET,paddingHorizontal:10,alignItems:"center",justifyContent:"center"}}>
        <Text {...{className:joinClasses(styled&&"text-text")}} style={{fontVariant:["tabular-nums"],fontWeight:"600"}}>{formatRate(r)}</Text>
      </Pressable>
      {onStop?<ToolButton label="Stop reading" styled={styled} onPress={onStop}/>:null}
      {accessory}
    </View>
  </View>;
}

function SentenceText({sentence,wordIndex,styled,announce}:{sentence:ReadAloudSentence;wordIndex:number|undefined;styled:boolean;announce:boolean}){
  const text=sentence.text;
  const span=wordIndex===undefined?undefined:wordSpans(text)[wordIndex];
  const chars=[...text];
  const body=joinClasses(styled&&"text-text");
  return <Text selectable accessibilityLiveRegion={announce?"polite":"none"} {...{className:body}}
    style={{fontSize:17,lineHeight:25}}>
    {span?<>
      {chars.slice(0,span[0]).join("")}
      <Text {...{className:joinClasses(styled&&"bg-accent/10 text-text")}} style={{fontWeight:"700"}}>{chars.slice(span[0],span[1]).join("")}</Text>
      {chars.slice(span[1]).join("")}
    </>:text}
  </Text>;
}
