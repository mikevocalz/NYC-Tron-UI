import {useEffect,useRef} from "react";
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
}

type Pointer={hovered:boolean;focused:boolean};
const SYSTEM_INK={forcedColorAdjust:"none"} as object;

/**
 * Controlled numeric instrument: drag horizontally to adjust, move up for fine
 * (tenth-step) or down for coarse precision, optional detents, Escape or a second
 * pointer to cancel. Text entry, arrow keys, +/- buttons and screen-reader
 * increment/decrement all commit once through `onCommit`.
 */
export function PrecisionScrubber({
  label,value,min,max,step,detents,unit,disabled=false,onPreview,onCommit,
  forcedColors=false,transport:Transport=PanResponderDrag,className,unstyled=false,style,...rest
}:PrecisionScrubberProps){
  const latest=useRef({value,min,max,step,detents,disabled,onPreview,onCommit});
  latest.current={value,min,max,step,detents,disabled,onPreview,onCommit};
  const local=useRef<{store:StoreApi<ScrubberState>;hover:StoreApi<Pointer>;model:ScrubberModel}|null>(null);
  if(!local.current){
    const store=createStore<ScrubberState>(()=>initialScrubberState(value,step));
    const hover=createStore<Pointer>(()=>({hovered:false,focused:false}));
    local.current={store,hover,model:createScrubberModel(store,()=>latest.current)};
  }
  const {store,hover,model}=local.current;
  const state=useStore(store,s=>s);
  const {hovered,focused}=useStore(hover,s=>s);
  useEffect(()=>model.sync(),[value,step,model]);
  useEffect(()=>()=>model.cancel(),[model]);

  const blocked=disabled||state.pending;
  const display=formatStepValue(state.preview,step);
  const reached=normalize(state.preview,min,max);
  const forced=forcedColors&&Platform.OS==="web";
  const styled=!unstyled;
  const ink=forced?{line:{backgroundColor:"CanvasText",...SYSTEM_INK},accent:{backgroundColor:"Highlight",...SYSTEM_INK}}:undefined;
  const lineClass=joinClasses(styled&&!forced&&"bg-border");
  const accentClass=joinClasses(styled&&!forced&&"bg-accent");
  const highlighted=state.active||focused;
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    if(key==="Escape"&&model.dragging)model.cancel();
    if(key==="ArrowRight"||key==="ArrowUp")void model.nudge(1);
    if(key==="ArrowLeft"||key==="ArrowDown")void model.nudge(-1);
  };
  const stepButton=(direction:-1|1)=><Pressable accessibilityRole="button"
    accessibilityLabel={(direction<0?"Decrease ":"Increase ")+label}
    accessibilityState={{disabled:blocked}} disabled={blocked} onPress={()=>void model.nudge(direction)}
    {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised")}}
    style={{minHeight:44,minWidth:44,alignItems:"center",justifyContent:"center"}}>
    <Text {...{className:joinClasses(styled&&"text-text text-xl")}}>{direction<0?"−":"+"}</Text>
  </Pressable>;

  return <View {...rest} {...{className:joinClasses("gap-2",className)}} style={[{opacity:disabled?0.5:1},style]}>
    <View style={{flexDirection:"row",alignItems:"center",minHeight:44,justifyContent:"space-between",gap:10}}>
      <Text {...{className:joinClasses(styled&&"text-text text-xs font-semibold")}} style={{flex:1}}>{label}</Text>
      <View {...{className:joinClasses(styled&&"rounded-control border bg-surface-sunken",styled&&(state.editing||state.active?"border-accent":"border-border"))}}
        style={{flexDirection:"row",alignItems:"center",paddingHorizontal:10,minHeight:44}}>
        <TextInput selectTextOnFocus keyboardType="decimal-pad" returnKeyType="done" editable={!blocked}
          accessibilityLabel={label+" value"}
          value={state.editing?state.draft:display}
          onFocus={()=>model.startEditing()}
          onChangeText={draft=>model.changeDraft(draft)}
          onSubmitEditing={()=>void model.applyDraft()}
          onBlur={()=>void model.applyDraft()}
          {...{className:joinClasses(styled&&"text-text font-semibold")}}
          style={{minWidth:58,textAlign:"right",fontVariant:["tabular-nums"],paddingVertical:6}}/>
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
                styled&&(highlighted?"border-accent":hovered?"border-text-muted":"border-border"),
                styled&&(state.active?"bg-surface-raised":"bg-surface-sunken"))}}
            onFocus={()=>hover.setState({focused:true})}
            onBlur={()=>hover.setState({focused:false})}
            accessible accessibilityRole="adjustable" accessibilityLabel={label}
            accessibilityHint="Drag horizontally to adjust. Move upward for fine precision or downward for coarse. Use arrow keys or the increase and decrease buttons."
            accessibilityValue={{min,max,now:state.preview,text:display+(unit??"")}}
            accessibilityState={{disabled:blocked}}
            accessibilityActions={[{name:"increment",label:"Increase"},{name:"decrement",label:"Decrease"}]}
            onAccessibilityAction={event=>{
              if(event.nativeEvent.actionName==="increment")void model.nudge(1);
              if(event.nativeEvent.actionName==="decrement")void model.nudge(-1);
            }}
            style={{minHeight:44,paddingHorizontal:11,justifyContent:"center",overflow:"hidden"}}>
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
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
      <Text {...{className:joinClasses(styled&&"text-xs",styled&&(highlighted?"text-accent":"text-text-muted"))}}>
        {state.active?state.mode.toUpperCase()+" PRECISION":"DRAG · FINE ↑ · COARSE ↓"}
      </Text>
      <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{fontVariant:["tabular-nums"]}}>
        {formatStepValue(min,step)} – {formatStepValue(max,step)}{unit??""}
      </Text>
    </View>
    {state.error?<Text accessibilityLiveRegion="assertive" {...{className:joinClasses(styled&&"text-danger text-xs")}}>{state.error}</Text>:null}
  </View>;
}
