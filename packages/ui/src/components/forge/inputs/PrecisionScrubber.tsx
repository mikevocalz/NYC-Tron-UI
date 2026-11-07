import {useEditorBoundary} from '../../gestures/editor-interaction-scope.ts';
import {useLayoutEffect,useRef} from "react";
import {Platform,Pressable,Text,TextInput,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {formatStepValue,normalize,scaleTicks,type RangeConfig} from "./precision.ts";
import {createScrubberModel,initialScrubberState,type ScrubberModel,type ScrubberState} from "./precision-scrubber-model.ts";
import {keyboardKey,type DragTransport,type KeyEventLike} from "../../gestures/drag-transport.ts";
import {PanResponderDrag} from "../../gestures/PanResponderDrag.tsx";
import {joinClasses} from "../../styles.ts";

/** Props for {@linkcode PrecisionScrubber}. */
export interface PrecisionScrubberProps extends Omit<ViewProps,"children">,RangeConfig {
  label:string;
  /** App-owned touch target in layout points. Defaults to 44; comfortable hosts use 48. */
  targetSize?:number;
  /** Localized chrome. Numeric entry retains the existing decimal-input contract. */
  labels?:Partial<{increase:string;decrease:string;value:string;gestureHint:string;idleHint:string;fine:string;normal:string;coarse:string}>;
  scope?:string;
  revision?:string|number;
  /** The committed value. The scrubber never keeps its own copy after a gesture ends. */
  value:number;
  unit?:string;
  disabled?:boolean;
  /** Local visual preview during a drag, and the restored value on cancel. Never persist here. */
  onPreview?:(value:number)=>void;
  /**
   * Exactly once per completed drag, nudge or text entry. While a returned promise is
   * pending the control is disabled; a rejection shows its message.
   */
  onCommit:(value:number)=>unknown;
  /**
   * Web forced-colors (Windows High Contrast) is active. The scale then paints itself in
   * CanvasText/Highlight system colors instead of letting the browser blank it.
   * @default false
   */
  forcedColors?:boolean;
  /** Pointer recogniser. @default PanResponderDrag */
  transport?:DragTransport;
  className?:string;
  unstyled?:boolean;
  /** App-owned scale ink for native hosts without a CSS class pipeline. */
  scaleColor?:string;
  accentColor?:string;
}

type Pointer={hovered:boolean;focused:boolean};
const SYSTEM_INK={forcedColorAdjust:"none"} as object;
// Web only: without it a drag selects the label and value text. Not a ViewStyle key in RN.
const NO_SELECT=(Platform.OS==="web"?{userSelect:"none"}:{}) as object;
// React Native Web drops color keywords it cannot parse (CanvasText, Highlight),
// but passes var() through; the fallback is the system color itself.
const CANVAS_TEXT="var(--nyc-tron-canvas-text, CanvasText)";
const HIGHLIGHT="var(--nyc-tron-highlight, Highlight)";
const MODE_LABEL={fine:"Fine precision",normal:"Normal precision",coarse:"Coarse precision"} as const;

/**
 * Controlled numeric instrument: drag horizontally to adjust, move up for fine
 * (tenth-step) or down for coarse precision, optional detents, Escape or a second
 * pointer to cancel. Text entry, arrow keys, +/- buttons and screen-reader
 * increment/decrement all commit once through `onCommit`.
 */
export function PrecisionScrubber({scope,revision=0,...props}:PrecisionScrubberProps){
  const {label,min,max,step,detents,unit,disabled=false}=props;
  if(!label.trim()||scope!==undefined&&(!scope.trim()||scope.length>512)||typeof revision==='number'&&!Number.isFinite(revision)||typeof revision==='string'&&revision.length>512)throw new RangeError('Invalid scrubber identity');
  const signature=JSON.stringify([scope??label,revision,min,max,step,detents,unit,disabled]);
  const boundary=useEditorBoundary([signature]);
  const mounted=useRef(false),committed=useRef({boundary,props});
  useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  useLayoutEffect(()=>{committed.current={boundary,props};});
  const current=()=>mounted.current&&committed.current.boundary===boundary&&!committed.current.props.disabled?committed.current.props:null;
  return <PrecisionScrubberBody boundary={boundary} {...props} onCommit={value=>current()?.onCommit(value)}/>;
}
function PrecisionScrubberBody({
  boundary,label,value,min,max,step,detents,unit,disabled=false,onPreview,onCommit,
  forcedColors=false,transport:Transport=PanResponderDrag,className,unstyled=false,scaleColor,accentColor,targetSize=44,labels,style,...rest
}:PrecisionScrubberProps&{boundary:string}){
  if(!Number.isFinite(targetSize)||targetSize<44)throw new RangeError('Scrubber target must be at least 44 points');
  if(Object.values(labels??{}).some(value=>value!==undefined&&(typeof value!=='string'||!value.trim())))throw new RangeError('Scrubber labels must be nonempty strings');
  const copy={increase:'Increase '+label,decrease:'Decrease '+label,value:label+' value',
    gestureHint:'Drag horizontally to adjust. Move upward for fine precision or downward for coarse. Use arrow keys or the increase and decrease buttons.',
    idleHint:'Drag: up for fine, down for coarse',...MODE_LABEL,...Object.fromEntries(Object.entries(labels??{}).filter(([,value])=>value!==undefined))};
  const latest=useRef({value,min,max,step,detents,disabled,onPreview,onCommit});
  useLayoutEffect(()=>{latest.current={value,min,max,step,detents,disabled,onPreview,onCommit};});
  const local=useRef<{store:StoreApi<ScrubberState>;hover:StoreApi<Pointer>;model:ScrubberModel}|null>(null);
  if(!local.current){
    const store=createStore<ScrubberState>(()=>initialScrubberState(value,step));
    const hover=createStore<Pointer>(()=>({hovered:false,focused:false}));
    local.current={store,hover,model:createScrubberModel(store,()=>latest.current)};
  }
  const {store,hover,model:controller}=local.current;
  useLayoutEffect(()=>{controller.admit(boundary);},[boundary,controller]);
  const model=controller.scoped(boundary);
  const state=useStore(store,s=>s);
  const {hovered,focused}=useStore(hover,s=>s);
  useLayoutEffect(()=>controller.sync(),[value,step,controller]);
  useLayoutEffect(()=>()=>controller.invalidate(),[controller]);

  const blocked=disabled||state.pending;
  const display=formatStepValue(state.preview,step);
  const reached=normalize(state.preview,min,max);
  const forced=forcedColors&&Platform.OS==="web";
  const styled=!unstyled;
  const ink=forced?{line:{backgroundColor:CANVAS_TEXT,...SYSTEM_INK},accent:{backgroundColor:HIGHLIGHT,...SYSTEM_INK}}:{line:{backgroundColor:scaleColor},accent:{backgroundColor:accentColor}};
  const lineClass=joinClasses(styled&&!forced&&"bg-border");
  const accentClass=joinClasses(styled&&!forced&&"bg-accent");
  const scaleBorder=state.active?"border-accent":focused?"border-focus":hovered?"border-text-muted":"border-border";
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    if(key==="Escape"&&model.dragging)model.cancel();
    if(key==="ArrowRight"||key==="ArrowUp")void model.nudge(1);
    if(key==="ArrowLeft"||key==="ArrowDown")void model.nudge(-1);
  };
  const stepButton=(direction:-1|1)=><Pressable accessibilityRole="button"
    accessibilityLabel={direction<0?copy.decrease:copy.increase}
    aria-disabled={blocked} disabled={blocked} onPress={()=>void model.nudge(direction)}
    {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised")}}
    style={{minHeight:targetSize,minWidth:targetSize,alignItems:"center",justifyContent:"center"}}>
    <Text {...{className:joinClasses(styled&&"text-text text-xl")}}>{direction<0?"−":"+"}</Text>
  </Pressable>;

  return <View {...rest} {...{className:joinClasses("gap-2",className)}}
    style={[{opacity:disabled?0.5:1},state.active?NO_SELECT:null,style]}>
    <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",minHeight:targetSize,justifyContent:"space-between",gap:10}}>
      <Text {...{className:joinClasses(styled&&"text-text text-xs font-semibold")}} style={{flexGrow:1,flexShrink:1}}>{label}</Text>
      <View {...{className:joinClasses(styled&&"rounded-control border bg-surface-sunken",styled&&(state.editing?"border-focus":state.active?"border-accent":"border-border"))}}
        style={{flexDirection:"row",alignItems:"center",paddingHorizontal:10,minHeight:targetSize}}>
        <TextInput selectTextOnFocus keyboardType="decimal-pad" returnKeyType="done" editable={!blocked}
          accessibilityLabel={copy.value}
          value={state.editing?state.draft:display}
          onFocus={()=>model.startEditing()}
          onChangeText={draft=>model.changeDraft(draft)}
          onSubmitEditing={()=>void model.applyDraft()}
          onBlur={()=>void model.applyDraft()}
          {...{className:joinClasses(styled&&"text-text font-semibold")}}
          style={{minHeight:targetSize,width:64,textAlign:"right",fontVariant:["tabular-nums"],paddingVertical:6}}/>
        {unit?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{paddingLeft:2}}>{unit}</Text>:null}
      </View>
    </View>
    <View style={{flexDirection:"row",alignItems:"center",gap:6}}>
      {stepButton(-1)}
      <View style={{flex:1,minWidth:0}}>
        <Transport disabled={blocked}
          onBegin={point=>model.begin(point)}
          onMove={(point,touches)=>model.move(point,touches)}
          onRelease={point=>void model.release(point)}
          onCancel={()=>model.cancel()}>
          <View collapsable={false}
            {...{onKeyDown,focusable:!blocked,
              onPointerEnter:()=>{if(!blocked)hover.setState({hovered:true});},
              onPointerLeave:()=>hover.setState({hovered:false}),
              className:joinClasses(styled&&"rounded-control border",
                styled&&scaleBorder,
                styled&&(state.active?"bg-surface-raised":"bg-surface-sunken"))}}
            onFocus={()=>hover.setState({focused:true})}
            onBlur={()=>hover.setState({focused:false})}
            accessible accessibilityRole="adjustable" accessibilityLabel={label}
            accessibilityHint={copy.gestureHint}
            // aria-* rather than accessibilityValue/State: React Native Web 0.21
            // drops the latter, and React Native maps both forms the same way.
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={state.preview}
            aria-valuetext={display+(unit??"")}
            aria-disabled={blocked}
            accessibilityActions={[{name:"increment",label:copy.increase},{name:"decrement",label:copy.decrease}]}
            onAccessibilityAction={event=>{
              if(event.nativeEvent.actionName==="increment")void model.nudge(1);
              if(event.nativeEvent.actionName==="decrement")void model.nudge(-1);
            }}
            style={{minHeight:targetSize,paddingHorizontal:11,justifyContent:"center",overflow:"hidden",...NO_SELECT}}>
            <View pointerEvents="none" style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",minHeight:20}}>
              {scaleTicks(state.preview,min,max).map((tick,i)=><View key={i}
                {...{className:tick.reached?accentClass:lineClass}}
                style={{width:1,height:tick.major?12:5,opacity:forced?1:tick.major?0.9:0.55,...(tick.reached?ink?.accent:ink?.line)}}/>)}
            </View>
            <View pointerEvents="none" {...{className:lineClass}}
              style={{position:"absolute",left:11,right:11,bottom:5,height:3,...ink?.line}}>
              <View {...{className:accentClass}} style={{width:`${reached*100}%`,height:3,...ink?.accent}}/>
              {forced?<View style={{position:"absolute",left:`${reached*100}%`,bottom:-4,width:3,height:11,marginLeft:-1.5,...ink?.accent}}/>:null}
            </View>
          </View>
        </Transport>
      </View>
      {stepButton(1)}
    </View>
    <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",columnGap:8,rowGap:4}}>
      <Text style={{flexShrink:1,maxWidth:"100%"}} {...{className:joinClasses(styled&&"text-xs",styled&&(state.active?"text-text":"text-text-muted"))}}>
        {state.active?copy[state.mode]:copy.idleHint}
      </Text>
      <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{fontVariant:["tabular-nums"],flexShrink:1,maxWidth:"100%"}}>
        {formatStepValue(min,step)} – {formatStepValue(max,step)}{unit??""}
      </Text>
    </View>
    {state.error?<Text accessibilityLiveRegion="assertive" {...{className:joinClasses(styled&&"text-danger text-xs")}}>{state.error}</Text>:null}
  </View>;
}
