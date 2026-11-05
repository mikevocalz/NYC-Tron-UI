import {Pressable,ScrollView,Text,TextInput,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {useLocalStore} from "../../useLocalStore.ts";
import {CloseMark,OFFICE_TOUCH_TARGET} from "../office/office-controls.tsx";
import {effectLabel,formatSeconds,parseSeconds,playOrder,timelineEnd,type AnimationCategory,type AnimationEffect,type SlideAnimation} from "./animation-model.ts";

/** Props for {@linkcode SlideAnimationPane}. */
export interface SlideAnimationPaneProps extends Omit<ViewProps,"children"> {
  readonly animations:readonly SlideAnimation[];
  /** Effects the host's engine plays. Categories with no effect are not shown. */
  readonly effects:readonly AnimationEffect[];
  /** Names an object for the list ("Title", "Rectangle 2"). */
  readonly objectLabel:(objectId:string)=>string;
  /** The object selected on the canvas; new animations apply to it. */
  readonly selectedObjectId?:string;
  /** Adds an animation. Rejecting keeps the form and shows the message. */
  readonly onAdd?:(animation:{objectId:string;kind:string;startS:number;durationS:number})=>void|Promise<unknown>;
  /** Removes the animation at the engine's `index`. */
  readonly onRemove?:(index:number)=>void|Promise<unknown>;
  /** Plays the slide's animations once on the canvas. */
  readonly onPreview?:()=>void;
  className?:string;
  unstyled?:boolean;
}

type Local={kind:string|undefined;start:string;duration:string;error:string|undefined;busy:boolean};

const CATEGORY_LABEL:Record<AnimationCategory,string>={entrance:"Entrance",emphasis:"Emphasis",exit:"Exit"};

/**
 * Animation pane for a slide (J-09): the slide's animations in play order with
 * object, effect and timing; an add form (effect grouped by entrance, emphasis
 * and exit, start and duration in seconds) for the object selected on the
 * canvas; remove; and preview.
 */
export function SlideAnimationPane({
  animations,effects,objectLabel,selectedObjectId,onAdd,onRemove,onPreview,className,unstyled=false,...rest
}:SlideAnimationPaneProps){
  const styled=!unstyled;
  const [local,store]=useLocalStore<Local>(()=>({kind:undefined,start:"0",duration:"0.5",error:undefined,busy:false}));
  const ordered=playOrder(animations);
  const kind=local.kind??effects[0]?.kind;
  const muted=joinClasses(styled&&"text-text-muted text-sm");
  const text=joinClasses(styled&&"text-text");
  const field=joinClasses(styled&&"rounded-control border border-border bg-surface-sunken text-text px-3 focus:border-focus");
  const add=async()=>{
    if(!onAdd||!selectedObjectId||!kind)return;
    const s=parseSeconds(local.start,{allowZero:true});
    const d=parseSeconds(local.duration,{allowZero:false});
    if("error" in s){store.set(x=>({...x,error:"Start: "+s.error}));return;}
    if("error" in d){store.set(x=>({...x,error:"Duration: "+d.error}));return;}
    store.set(x=>({...x,busy:true,error:undefined}));
    try{await onAdd({objectId:selectedObjectId,kind,startS:s.value,durationS:d.value});store.set(x=>({...x,busy:false}));}
    catch(e){store.set(x=>({...x,busy:false,error:e instanceof Error?e.message:"The animation was not added."}));}
  };
  return <View {...rest} accessibilityLabel="Animations" {...{role:"region",className:joinClasses("min-w-0",className)}}
    style={[{gap:12},rest.style as object]}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:8}}>
      <Text {...{className:muted}} style={{fontVariant:["tabular-nums"]}}>
        {ordered.length===0?"No animations on this slide":(ordered.length===1?"1 animation":ordered.length+" animations")+", "+formatSeconds(timelineEnd(ordered))}
      </Text>
      {onPreview&&ordered.length?<Button title="Preview" variant="secondary" size="sm" onPress={onPreview}/>:null}
    </View>
    {ordered.length?<ScrollView style={{flexShrink:1}} contentContainerStyle={{gap:2}}>
      {ordered.map((a,i)=>{
        const name=objectLabel(a.objectId);
        const on=a.objectId===selectedObjectId;
        return <View key={a.index} {...{className:joinClasses(styled&&"rounded-control",styled&&on&&"bg-accent/10")}}
          style={{flexDirection:"row",alignItems:"center",gap:8,minHeight:OFFICE_TOUCH_TARGET,paddingStart:8}}>
          <Text {...{className:muted}} style={{width:22,fontVariant:["tabular-nums"]}}>{i+1}</Text>
          <View accessible accessibilityLabel={(i+1)+". "+name+", "+effectLabel(a.kind,effects)+", starts at "+formatSeconds(a.startS)+", lasts "+formatSeconds(a.durationS)}
            style={{flex:1,minWidth:0}}>
            <Text numberOfLines={1} {...{className:text}} style={{fontWeight:"600"}}>{name}</Text>
            <Text numberOfLines={1} {...{className:muted}}>{effectLabel(a.kind,effects)+", "+formatSeconds(a.startS)+" for "+formatSeconds(a.durationS)}</Text>
          </View>
          {onRemove?<Pressable accessibilityRole="button" accessibilityLabel={"Remove "+effectLabel(a.kind,effects)+" on "+name}
            onPress={()=>void onRemove(a.index)}
            {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
            style={{width:OFFICE_TOUCH_TARGET,height:OFFICE_TOUCH_TARGET,alignItems:"center",justifyContent:"center"}}>
            <CloseMark styled={styled}/>
          </Pressable>:null}
        </View>;
      })}
    </ScrollView>:null}
    {onAdd&&effects.length?<View {...{className:joinClasses(styled&&"rounded-card border border-border bg-surface-raised")}} style={{padding:10,gap:10}}>
      <Text accessibilityRole="header" {...{className:text}} style={{fontWeight:"600"}}>
        {selectedObjectId?"Add animation to "+objectLabel(selectedObjectId):"Select an object on the slide to animate it"}
      </Text>
      {(["entrance","emphasis","exit"] as const).map(cat=>{
        const list=effects.filter(e=>e.category===cat);
        if(!list.length)return null;
        return <View key={cat} accessibilityLabel={CATEGORY_LABEL[cat]+" effects"} {...{role:"radiogroup"}} style={{gap:4}}>
          <Text {...{className:muted}}>{CATEGORY_LABEL[cat]}</Text>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:4}}>
            {list.map(e=><Pressable key={e.kind} accessibilityRole="radio" accessibilityState={{checked:kind===e.kind,disabled:!selectedObjectId}}
              disabled={!selectedObjectId} onPress={()=>store.set(x=>({...x,kind:e.kind}))}
              {...{className:joinClasses(styled&&"rounded-control border focus-visible:ring-2 focus-visible:ring-focus",
                styled&&(kind===e.kind?"border-accent bg-accent/10":"border-border"))}}
              style={{minHeight:OFFICE_TOUCH_TARGET,paddingHorizontal:12,justifyContent:"center",opacity:selectedObjectId?1:0.45}}>
              <Text {...{className:joinClasses(styled&&"text-text text-sm")}}>{e.label}</Text>
            </Pressable>)}
          </View>
        </View>;
      })}
      <View style={{flexDirection:"row",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
        <View style={{gap:4,flexGrow:1,flexBasis:100}}>
          <Text {...{className:muted}}>Start (seconds)</Text>
          <TextInput value={local.start} onChangeText={v=>store.set(x=>({...x,start:v,error:undefined}))} inputMode="decimal"
            accessibilityLabel="Start, in seconds" editable={!!selectedObjectId} {...{className:field}} style={{minHeight:OFFICE_TOUCH_TARGET}}/>
        </View>
        <View style={{gap:4,flexGrow:1,flexBasis:100}}>
          <Text {...{className:muted}}>Duration (seconds)</Text>
          <TextInput value={local.duration} onChangeText={v=>store.set(x=>({...x,duration:v,error:undefined}))} inputMode="decimal"
            accessibilityLabel="Duration, in seconds" editable={!!selectedObjectId} {...{className:field}} style={{minHeight:OFFICE_TOUCH_TARGET}}/>
        </View>
        <Button title="Add animation" loading={local.busy} disabled={!selectedObjectId||!kind} onPress={()=>void add()}/>
      </View>
      {local.error?<Text accessibilityLiveRegion="assertive" {...{className:joinClasses(styled&&"text-danger text-sm")}}>{local.error}</Text>:null}
    </View>:null}
  </View>;
}
