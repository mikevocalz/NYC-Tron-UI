import {useLayoutEffect,useRef,type ComponentRef} from "react";
import {Platform,Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {assertRange,formatStepValue,stepDecimalPlaces,type RangeConfig} from "../forge/inputs/precision.ts";
import {createDragController,type DragController} from "../gestures/drag-controller.ts";
import type {DragPoint,DragTransport} from "../gestures/drag-transport.ts";
import {PanResponderDrag} from "../gestures/PanResponderDrag.tsx";
import {joinClasses} from "../styles.ts";
import {shellKey} from "./shell-keys.ts";
import {angleAround,applySliderKey,knobAngle,sliderKeyAction,valueFromAngle,valueFromDrag} from "./slider-model.ts";
import {UnitInput} from "./UnitInput.tsx";
import type {UnitContext} from "./unit-expression.ts";

/**
 * How pointer travel maps to a {@linkcode RotaryKnob} value. `relative`:
 * dragging up raises it (touch and mouse). `circular`: the value follows the
 * pointer's angle around the knob (stylus and pen).
 */
export type KnobInput="relative"|"circular";

/** Props for {@linkcode RotaryKnob}. */
export interface RotaryKnobProps extends Omit<ViewProps,"children">,RangeConfig {
  /** Document/parameter identity and host revision invalidate unfinished input. */
  scope?:string;revision?:string|number;
  label:string;
  value:number;
  onPreview?:(value:number)=>void;
  /** Exactly once per drag, key press, typed entry, screen-reader action or reset. */
  onCommit:(value:number)=>void;
  /** Pointer mapping. Apps that detect a stylus pass `circular` for it. @default "relative" */
  input?:KnobInput;
  /** Shows a Reset button whenever the value differs from it. */
  defaultValue?:number;
  unit?:string;
  context?:UnitContext;
  /** Knob diameter in points; the touch target never drops below 44. @default 72 */
  size?:number;
  disabled?:boolean;
  /** Hide the visible label, e.g. inside a {@linkcode PropertyRow} that already shows it. It stays the accessible name. @default false */
  hideLabel?:boolean;
  transport?:DragTransport;
  className?:string;
  unstyled?:boolean;
}

type Local={preview:number|undefined;fine:boolean;focused:boolean;center:DragPoint|undefined};
const FINE_HOLD_PX=28;

/**
 * Controlled rotary control with exact entry. Touch and mouse drag up to
 * raise the value; moving more than 28pt sideways from the start switches to
 * fine adjustment. In `circular` mode (the stylus path) the
 * value follows the pen's angle and holds at an end across the bottom gap.
 * Arrows, PageUp/PageDown and Home/End adjust from the keyboard, Escape
 * cancels a drag, screen readers use increment and decrement, and the typed
 * field accepts unit arithmetic.
 */
export function RotaryKnob({
  scope="RotaryKnob",revision=0,label,value,min,max,step,detents,onPreview,onCommit,input="relative",defaultValue,unit,context,size=72,disabled=false,hideLabel=false,
  transport:Transport=PanResponderDrag,className,unstyled=false,style,...rest
}:RotaryKnobProps){
  const styled=!unstyled;
  if(!Number.isFinite(size)||size<=0||size>4096||!["relative","circular"].includes(input))throw new RangeError("Invalid knob geometry/input");
  const range={min,max,step,detents};
  assertRange(range);
  if(!Number.isFinite(value)||defaultValue!==undefined&&(!Number.isFinite(defaultValue)||defaultValue<min||defaultValue>max))throw new RangeError("Invalid slider value/default");
  if(!label.trim()||!scope.trim()||scope.length>512)throw new RangeError("Invalid control identity");
  const boundary=JSON.stringify([scope,revision,disabled,min,max,step,detents,value,context,unit,input,size]);
  const mounted=useRef(false),gestureScope=useRef<string|null>(null);
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({preview:undefined,fine:false,focused:false,center:undefined}));
  const store=local.current;
  const preview=useStore(store,s=>s.preview);
  const fine=useStore(store,s=>s.fine);
  const focused=useStore(store,s=>s.focused);
  const dial=useRef<ComponentRef<typeof View>>(null);
  const latest=useRef({boundary,value,range,input,disabled,onPreview,onCommit});
  useLayoutEffect(()=>{latest.current={boundary,value,range,input,disabled,onPreview,onCommit};});
  const allowed=()=>mounted.current&&!disabled&&latest.current.boundary===boundary;
  const validDrag=()=>mounted.current&&!latest.current.disabled&&gestureScope.current===latest.current.boundary;
  const gesture=useRef<{origin:DragPoint|undefined;from:number}>({origin:undefined,from:value});
  const measure=()=>dial.current?.measureInWindow?.((x,y,w,h)=>{
    if(mounted.current&&latest.current.boundary===boundary&&[x,y,w,h].every(Number.isFinite)&&w>0&&h>0){const center={x:x+w/2,y:y+h/2},before=store.getState().center;if(before&&(before.x!==center.x||before.y!==center.y))controller.current?.cancel();store.setState({center});}
  });
  const show=(next:number,isFine:boolean)=>{
    if(next===store.getState().preview&&isFine===store.getState().fine)return;
    store.setState({preview:next,fine:isFine});
    latest.current.onPreview?.(next);
  };
  const controller=useRef<DragController|null>(null);
  if(!controller.current)controller.current=createDragController({
    disabled:()=>!mounted.current||!!latest.current.disabled,
    start:()=>{gestureScope.current=latest.current.boundary;gesture.current.from=latest.current.value;store.setState({preview:latest.current.value,fine:false});},
    move:point=>{
      if(!validDrag())return;
      const g=gesture.current,p=latest.current;
      if(!g.origin){g.origin=point;return;}
      if(p.input==="circular"){
        const c=store.getState().center;
        if(c)show(valueFromAngle(angleAround(point,c),store.getState().preview??p.value,p.range),false);
        return;
      }
      // Vertical travel sets the value; sideways distance from the start selects fine precision.
      const isFine=Math.abs(point.x-g.origin.x)>FINE_HOLD_PX;
      show(valueFromDrag(g.from,0,point.y-g.origin.y,p.range,{fine:isFine}),isFine);
    },
    commit:()=>{
      const valid=validDrag();gestureScope.current=null;
      const next=store.getState().preview,p=latest.current;
      store.setState({preview:undefined,fine:false});
      if(valid&&next!==undefined&&next!==p.value)p.onCommit(next);
      else if(valid)p.onPreview?.(p.value);
    },
    cancel:()=>{
      const valid=validDrag();gestureScope.current=null;
      store.setState({preview:undefined,fine:false});
      if(valid)latest.current.onPreview?.(latest.current.value);
    },
  });
  const drag=controller.current;
  useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;gestureScope.current=null;drag.cancel();};},[drag]);
  useLayoutEffect(()=>{drag.cancel();measure();},[boundary,drag]);

  const shown=preview??value;
  const commit=(next:number)=>{if(allowed()&&next!==latest.current.value)latest.current.onCommit(next);};
  const onKeyDown=(event:unknown)=>{
    if(!allowed())return;
    const k=shellKey(event);
    if(k.key==="Escape"){drag.cancel();return;}
    if(k.ctrlKey||k.metaKey)return;
    // A knob turns clockwise for both Right and Up, so arrows do not flip in RTL.
    const action=sliderKeyAction(k.key,{shift:k.shiftKey,alt:k.altKey});
    if(!action)return;
    k.preventDefault();
    commit(applySliderKey(value,action,range));
  };
  const angle=knobAngle(shown,range);
  const canReset=defaultValue!==undefined&&defaultValue!==value;
  const dialSize=Math.max(44,size);
  return <View {...rest} {...{className:joinClasses("items-center gap-1",className)}} style={[{opacity:disabled?0.5:1},style]}>
    {!hideLabel?<Text {...{className:joinClasses(styled&&"text-text text-sm")}} numberOfLines={1}>{label}</Text>:null}
    <Transport disabled={disabled}
      onBegin={point=>{if(!allowed())return;gesture.current.origin=point;measure();drag.begin();}}
      onMove={(point,touches)=>{if(touches===1)drag.move(point);else drag.cancel();}}
      onRelease={()=>drag.release()}
      onCancel={()=>drag.cancel()}>
      <View ref={dial} collapsable={false} onLayout={measure}
        accessible accessibilityRole="adjustable" accessibilityLabel={label}
        accessibilityHint={input==="circular"?"Turn around the knob to set the value.":"Drag up to raise the value. Move sideways while dragging for fine control."}
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={shown}
        aria-valuetext={formatStepValue(shown,step)+(unit??"")} aria-disabled={disabled}
        accessibilityState={{disabled}} accessibilityActions={disabled?[]:[{name:"increment",label:"Increase"},{name:"decrement",label:"Decrease"}]}
        onAccessibilityAction={event=>{
          if(event.nativeEvent.actionName==="increment")commit(applySliderKey(value,{kind:"step",steps:1},range));
          if(event.nativeEvent.actionName==="decrement")commit(applySliderKey(value,{kind:"step",steps:-1},range));
        }}
        onFocus={()=>store.setState({focused:true})}
        onBlur={()=>store.setState({focused:false})}
        {...{onKeyDown,focusable:!disabled,className:joinClasses(styled&&"border-2 bg-surface-sunken focus-visible:outline-none",
          styled&&(preview!==undefined?"border-accent":focused?"border-focus":"border-border"))}}
        style={{width:dialSize,height:dialSize,borderRadius:dialSize/2,alignItems:"center",justifyContent:"center",
          ...(Platform.OS==="web"?{cursor:disabled?"default":"grab",userSelect:"none",touchAction:"none"}:{})} as object}>
        <View pointerEvents="none" style={{position:"absolute",width:dialSize,height:dialSize,transform:[{rotate:`${angle}deg`}],alignItems:"center"}}>
          <View {...{className:joinClasses(styled&&"border-accent")}} style={{marginTop:6,width:0,height:dialSize*0.28,borderLeftWidth:3}}/>
        </View>
      </View>
    </Transport>
    {fine?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Fine adjustment</Text>:null}
    <View style={{flexDirection:"row",alignItems:"center",gap:4}}>
      <UnitInput scope={boundary} label={label+" value"} hideLabel value={shown} context={context} min={min} max={max} step={step}
        precision={Math.min(100,stepDecimalPlaces(step)+1)} disabled={disabled} unstyled={unstyled}
        onCommit={next=>commit(applySliderKey(next,{kind:"step",steps:0},range))} style={{width:context?104:72}}/>
      {unit&&!context?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>{unit}</Text>:null}
      {canReset?<Pressable accessibilityRole="button" accessibilityLabel={"Reset "+label} disabled={disabled}
        onPress={()=>commit(defaultValue!)}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control px-2 focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken")}}>
        <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Reset</Text>
      </Pressable>:null}
    </View>
  </View>;
}
