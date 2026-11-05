import {useEffect,useRef,type ComponentRef} from "react";
import {I18nManager,Platform,Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {formatStepValue,type RangeConfig} from "../forge/inputs/precision.ts";
import {createDragController,type DragController} from "../gestures/drag-controller.ts";
import type {DragPoint,DragTransport} from "../gestures/drag-transport.ts";
import {PanResponderDrag} from "../gestures/PanResponderDrag.tsx";
import {joinClasses} from "../styles.ts";
import {nodeIsRTL,shellKey} from "./shell-keys.ts";
import {applySliderKey,fractionOf,sliderKeyAction,valueAtOffset} from "./slider-model.ts";
import {UnitInput} from "./UnitInput.tsx";
import type {UnitContext} from "./unit-expression.ts";

/** Props for {@linkcode SliderField}. */
export interface SliderFieldProps extends Omit<ViewProps,"children">,RangeConfig {
  label:string;
  /** Committed value. The field keeps only a drag preview of its own. */
  value:number;
  /** During a drag, for a live canvas preview. Never persist here. */
  onPreview?:(value:number)=>void;
  /** Exactly once per drag, key press, typed entry, screen-reader action or reset. */
  onCommit:(value:number)=>void;
  /** Shows a Reset button whenever the value differs from it. */
  defaultValue?:number;
  /** Unit text after the value, e.g. "%". Ignored when `context` is given. */
  unit?:string;
  /** Typed entry in units with conversion; the value is in the context's base unit. */
  context?:UnitContext;
  disabled?:boolean;
  /** Hide the visible label, e.g. inside a {@linkcode PropertyRow} that already shows it. It stays the accessible name. @default false */
  hideLabel?:boolean;
  /** Pointer recogniser. @default PanResponderDrag */
  transport?:DragTransport;
  className?:string;
  unstyled?:boolean;
}

type Local={preview:number|undefined;track:{x:number;width:number}|undefined;focused:boolean};

/**
 * Controlled precision slider with typed entry, reset and a bounded range.
 * Press or drag anywhere on the track; the thumb previews and the value
 * commits once on release. Escape or a second pointer cancels. Arrow keys
 * step (Shift ten, Alt a tenth), PageUp/PageDown move ten steps, Home/End
 * jump. Screen readers adjust it with increment and decrement. The track is
 * 44pt tall and fills from the reading-direction start.
 */
export function SliderField({
  label,value,min,max,step,detents,onPreview,onCommit,defaultValue,unit,context,disabled=false,hideLabel=false,
  transport:Transport=PanResponderDrag,className,unstyled=false,style,...rest
}:SliderFieldProps){
  const styled=!unstyled;
  const range={min,max,step,detents};
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({preview:undefined,track:undefined,focused:false}));
  const store=local.current;
  const preview=useStore(store,s=>s.preview);
  const focused=useStore(store,s=>s.focused);
  const track=useRef<ComponentRef<typeof View>>(null);
  const rtl=useRef(I18nManager.isRTL);
  const latest=useRef({value,range,disabled,onPreview,onCommit});
  latest.current={value,range,disabled,onPreview,onCommit};
  const measure=()=>track.current?.measureInWindow?.((x,_y,width)=>{
    if(Number.isFinite(x)&&width>0)store.setState({track:{x,width}});
    rtl.current=nodeIsRTL(track.current)||I18nManager.isRTL;
  });
  const at=(point:DragPoint)=>{
    const t=store.getState().track;
    return t?valueAtOffset(point.x-t.x,t.width,latest.current.range,rtl.current):latest.current.value;
  };
  const pending=useRef<DragPoint|undefined>(undefined);
  const controller=useRef<DragController|null>(null);
  if(!controller.current)controller.current=createDragController({
    disabled:()=>!!latest.current.disabled,
    start:()=>{
      const next=pending.current?at(pending.current):latest.current.value;
      store.setState({preview:next});
      latest.current.onPreview?.(next);
    },
    move:point=>{
      const next=at(point);
      if(next===store.getState().preview)return;
      store.setState({preview:next});
      latest.current.onPreview?.(next);
    },
    commit:()=>{
      const next=store.getState().preview;
      store.setState({preview:undefined});
      if(next!==undefined&&next!==latest.current.value)latest.current.onCommit(next);
      else latest.current.onPreview?.(latest.current.value);
    },
    cancel:()=>{
      store.setState({preview:undefined});
      latest.current.onPreview?.(latest.current.value);
    },
  });
  const drag=controller.current;
  useEffect(()=>()=>drag.cancel(),[drag]);

  const shown=preview??value;
  const fraction=fractionOf(shown,range);
  const commit=(next:number)=>{if(!disabled&&next!==value)onCommit(next);};
  const onKeyDown=(event:unknown)=>{
    const k=shellKey(event);
    if(k.key==="Escape"){drag.cancel();return;}
    if(k.ctrlKey||k.metaKey)return;
    const action=sliderKeyAction(k.key,{rtl:nodeIsRTL(k.target)||I18nManager.isRTL,shift:k.shiftKey,alt:k.altKey});
    if(!action)return;
    k.preventDefault();
    commit(applySliderKey(value,action,range));
  };
  const text=formatStepValue(shown,step)+(unit??"");
  const canReset=defaultValue!==undefined&&defaultValue!==value;
  return <View {...rest} {...{className:joinClasses("gap-1",className)}} style={[{opacity:disabled?0.5:1},style]}>
    <View style={{flexDirection:"row",alignItems:"center",gap:8,minHeight:44}}>
      {hideLabel?<View style={{flex:1}}/>:<Text {...{className:joinClasses(styled&&"text-text text-sm")}} style={{flex:1}} numberOfLines={1}>{label}</Text>}
      {canReset?<Pressable accessibilityRole="button" accessibilityLabel={"Reset "+label} disabled={disabled}
        onPress={()=>commit(defaultValue!)}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control px-2 focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken")}}>
        <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Reset</Text>
      </Pressable>:null}
      <UnitInput label={label+" value"} hideLabel value={shown} context={context} min={min} max={max} step={step}
        precision={Math.max(0,-Math.floor(Math.log10(step)))} disabled={disabled}
        onCommit={next=>commit(applySliderKey(next,{kind:"step",steps:0},range))}
        style={{width:context?104:80}} unstyled={unstyled}/>
      {unit&&!context?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>{unit}</Text>:null}
    </View>
    <Transport disabled={disabled}
      onBegin={point=>{pending.current=point;drag.begin();}}
      onMove={(point,touches)=>{if(touches===1)drag.move(point);else drag.cancel();}}
      onRelease={()=>drag.release()}
      onCancel={()=>drag.cancel()}>
      <View ref={track} collapsable={false} onLayout={measure}
        accessible accessibilityRole="adjustable" accessibilityLabel={label}
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={shown} aria-valuetext={text}
        aria-disabled={disabled}
        accessibilityActions={[{name:"increment",label:"Increase"},{name:"decrement",label:"Decrease"}]}
        onAccessibilityAction={event=>{
          if(event.nativeEvent.actionName==="increment")commit(applySliderKey(value,{kind:"step",steps:1},range));
          if(event.nativeEvent.actionName==="decrement")commit(applySliderKey(value,{kind:"step",steps:-1},range));
        }}
        onFocus={()=>store.setState({focused:true})}
        onBlur={()=>store.setState({focused:false})}
        {...{onKeyDown,focusable:!disabled,onPointerEnter:measure,
          className:joinClasses(styled&&"rounded-control focus-visible:outline-none",styled&&focused&&"ring-2 ring-focus")}}
        style={{minHeight:44,justifyContent:"center",paddingHorizontal:14,...(Platform.OS==="web"?{cursor:disabled?"default":"pointer",userSelect:"none"}:{})} as object}>
        <View pointerEvents="none" {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken")}}
          style={{height:6,flexDirection:"row",alignItems:"center"}}>
          {/* The fill is a border so forced-colors mode keeps it. */}
          <View {...{className:joinClasses(styled&&"border-accent")}} style={{width:`${fraction*100}%`,height:0,borderTopWidth:4}}/>
          {/* A zero-width wrapper centres the thumb on the fill's end in either direction. */}
          <View style={{width:0,alignItems:"center",overflow:"visible"}}>
            <View {...{className:joinClasses(styled&&"border-accent bg-surface-raised")}}
              style={{width:22,height:22,borderRadius:11,borderWidth:2}}/>
          </View>
        </View>
      </View>
    </Transport>
  </View>;
}
