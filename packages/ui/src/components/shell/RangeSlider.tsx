import {useEffect,useRef,type ComponentRef} from "react";
import {I18nManager,Platform,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {formatStepValue,type RangeConfig} from "../forge/inputs/precision.ts";
import {createDragController,type DragController} from "../gestures/drag-controller.ts";
import type {DragPoint,DragTransport} from "../gestures/drag-transport.ts";
import {PanResponderDrag} from "../gestures/PanResponderDrag.tsx";
import {joinClasses} from "../styles.ts";
import {nodeIsRTL,shellKey} from "./shell-keys.ts";
import {
  applySliderKey,fractionOf,moveRangeThumb,nearestThumb,normalizeRange,sliderKeyAction,valueAtOffset,
  type RangeThumb,type RangeValue,
} from "./slider-model.ts";
import {UnitInput} from "./UnitInput.tsx";
import type {UnitContext} from "./unit-expression.ts";

export type {RangeThumb,RangeValue} from "./slider-model.ts";

/** Props for {@linkcode RangeSlider}. */
export interface RangeSliderProps extends Omit<ViewProps,"children">,RangeConfig {
  label:string;
  /** Committed `[low, high]`. */
  value:RangeValue;
  onPreview?:(value:RangeValue)=>void;
  /** Exactly once per drag, key press, typed endpoint or screen-reader action. */
  onCommit:(value:RangeValue)=>void;
  /** Smallest allowed distance between the ends. @default 0 */
  minGap?:number;
  /** Accessible names of the two ends. @default ["Minimum", "Maximum"] */
  thumbLabels?:readonly [string,string];
  unit?:string;
  /** Typed endpoints in units with conversion. */
  context?:UnitContext;
  disabled?:boolean;
  /** Hide the visible label, e.g. inside a {@linkcode PropertyRow} that already shows it. It stays the accessible name. @default false */
  hideLabel?:boolean;
  transport?:DragTransport;
  className?:string;
  unstyled?:boolean;
}

type Local={preview:RangeValue|undefined;thumb:RangeThumb|undefined;track:{x:number;width:number}|undefined;focus:RangeThumb|undefined};

/**
 * Controlled two-handle range with editable endpoints. A press on the track
 * moves the nearer end and a drag keeps moving it; the ends never cross and
 * stay `minGap` apart. Each end is its own slider for keyboards (arrows,
 * PageUp/PageDown, Home/End) and screen readers, and each has a typed field
 * that accepts unit arithmetic.
 */
export function RangeSlider({
  label,value,min,max,step,detents,onPreview,onCommit,minGap=0,thumbLabels=["Minimum","Maximum"],unit,context,
  disabled=false,hideLabel=false,transport:Transport=PanResponderDrag,className,unstyled=false,style,...rest
}:RangeSliderProps){
  const styled=!unstyled;
  const range={min,max,step,detents};
  const committed=normalizeRange(value,range,minGap);
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({preview:undefined,thumb:undefined,track:undefined,focus:undefined}));
  const store=local.current;
  const preview=useStore(store,s=>s.preview);
  const focus=useStore(store,s=>s.focus);
  const track=useRef<ComponentRef<typeof View>>(null);
  const rtl=useRef(I18nManager.isRTL);
  const latest=useRef({committed,range,minGap,disabled,onPreview,onCommit});
  latest.current={committed,range,minGap,disabled,onPreview,onCommit};
  const measure=()=>track.current?.measureInWindow?.((x,_y,width)=>{
    if(Number.isFinite(x)&&width>0)store.setState({track:{x,width}});
    rtl.current=nodeIsRTL(track.current)||I18nManager.isRTL;
  });
  const at=(point:DragPoint)=>{
    const t=store.getState().track;
    return t?valueAtOffset(point.x-t.x,t.width,latest.current.range,rtl.current):undefined;
  };
  const pending=useRef<DragPoint|undefined>(undefined);
  const controller=useRef<DragController|null>(null);
  if(!controller.current)controller.current=createDragController({
    disabled:()=>!!latest.current.disabled,
    start:()=>{
      const p=latest.current;
      const v=pending.current?at(pending.current):undefined;
      const thumb=v===undefined?"high":nearestThumb(p.committed,v);
      const next=v===undefined?p.committed:moveRangeThumb(p.committed,thumb,v,p.range,p.minGap);
      store.setState({thumb,preview:next});
      p.onPreview?.(next);
    },
    move:point=>{
      const s=store.getState(),p=latest.current,v=at(point);
      if(!s.thumb||v===undefined)return;
      const next=moveRangeThumb(s.preview??p.committed,s.thumb,v,p.range,p.minGap);
      store.setState({preview:next});
      p.onPreview?.(next);
    },
    commit:()=>{
      const next=store.getState().preview,p=latest.current;
      store.setState({preview:undefined,thumb:undefined});
      if(next&&(next[0]!==p.committed[0]||next[1]!==p.committed[1]))p.onCommit(next);
      else p.onPreview?.(p.committed);
    },
    cancel:()=>{
      store.setState({preview:undefined,thumb:undefined});
      latest.current.onPreview?.(latest.current.committed);
    },
  });
  const drag=controller.current;
  useEffect(()=>()=>drag.cancel(),[drag]);

  const shown=preview??committed;
  const [lo,hi]=[fractionOf(shown[0],range),fractionOf(shown[1],range)];
  const commitThumb=(thumb:RangeThumb,next:number)=>{
    if(disabled)return;
    const result=moveRangeThumb(committed,thumb,next,range,minGap);
    if(result[0]!==committed[0]||result[1]!==committed[1])onCommit(result);
  };
  const thumbIndex={low:0,high:1} as const;
  const thumbView=(thumb:RangeThumb)=>{
    const i=thumbIndex[thumb];
    const v=shown[i];
    const name=`${label} ${thumbLabels[i]}`;
    const onKeyDown=(event:unknown)=>{
      const k=shellKey(event);
      if(k.key==="Escape"){drag.cancel();return;}
      if(k.ctrlKey||k.metaKey)return;
      const action=sliderKeyAction(k.key,{rtl:nodeIsRTL(k.target)||I18nManager.isRTL,shift:k.shiftKey,alt:k.altKey});
      if(!action)return;
      k.preventDefault();
      commitThumb(thumb,applySliderKey(committed[i],action,range));
    };
    return <View key={thumb} accessible accessibilityRole="adjustable" accessibilityLabel={name}
      aria-valuemin={thumb==="low"?min:committed[0]+minGap} aria-valuemax={thumb==="high"?max:committed[1]-minGap}
      aria-valuenow={v} aria-valuetext={formatStepValue(v,step)+(unit??"")} aria-disabled={disabled}
      accessibilityActions={[{name:"increment",label:"Increase"},{name:"decrement",label:"Decrease"}]}
      onAccessibilityAction={event=>{
        if(event.nativeEvent.actionName==="increment")commitThumb(thumb,committed[i]+step);
        if(event.nativeEvent.actionName==="decrement")commitThumb(thumb,committed[i]-step);
      }}
      onFocus={()=>store.setState({focus:thumb})}
      onBlur={()=>store.setState({focus:undefined})}
      {...{onKeyDown,focusable:!disabled,className:joinClasses(styled&&"focus-visible:outline-none")}}
      style={{width:44,height:44,marginHorizontal:-22,alignItems:"center",justifyContent:"center",zIndex:1}}>
      <View pointerEvents="none" {...{className:joinClasses(styled&&"border-accent bg-surface-raised",styled&&focus===thumb&&"ring-2 ring-focus")}}
        style={{width:22,height:22,borderRadius:11,borderWidth:2}}/>
    </View>;
  };
  const entry=(thumb:RangeThumb)=>{
    const i=thumbIndex[thumb];
    return <UnitInput label={thumbLabels[i]} value={shown[i]} context={context}
      min={thumb==="low"?min:committed[0]+minGap} max={thumb==="high"?max:committed[1]-minGap} step={step}
      precision={Math.max(0,-Math.floor(Math.log10(step)))} disabled={disabled} unstyled={unstyled}
      onCommit={next=>commitThumb(thumb,next)} style={{flex:1,minWidth:96}}/>;
  };
  return <View {...rest} accessibilityLabel={label} {...{role:"group",className:joinClasses("gap-1",className)}}
    style={[{opacity:disabled?0.5:1},style]}>
    {!hideLabel?<Text {...{className:joinClasses(styled&&"text-text text-sm")}} style={{minHeight:24}}>{label}</Text>:null}
    <Transport disabled={disabled}
      onBegin={point=>{pending.current=point;measure();drag.begin();}}
      onMove={(point,touches)=>{if(touches===1)drag.move(point);else drag.cancel();}}
      onRelease={()=>drag.release()}
      onCancel={()=>drag.cancel()}>
      <View collapsable={false} style={{minHeight:44,justifyContent:"center",paddingHorizontal:22,
        ...(Platform.OS==="web"?{cursor:disabled?"default":"pointer",userSelect:"none"}:{})} as object}>
        <View ref={track} collapsable={false} onLayout={measure} style={{height:44,justifyContent:"center"}}>
          <View pointerEvents="none" {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken")}}
            style={{position:"absolute",left:0,right:0,top:19,height:6}}/>
          {/* Spacer, low thumb, fill, high thumb: a row follows the reading direction on web and native. */}
          <View style={{flexDirection:"row",alignItems:"center",height:44}}>
            <View style={{width:`${lo*100}%`}}/>
            {thumbView("low")}
            <View pointerEvents="none" {...{className:joinClasses(styled&&"border-accent")}}
              style={{width:`${(hi-lo)*100}%`,height:0,borderTopWidth:4}}/>
            {thumbView("high")}
          </View>
        </View>
      </View>
    </Transport>
    <View style={{flexDirection:"row",gap:8,flexWrap:"wrap"}}>
      {entry("low")}
      {entry("high")}
      {unit&&!context?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{alignSelf:"flex-end",paddingBottom:12}}>{unit}</Text>:null}
    </View>
  </View>;
}
