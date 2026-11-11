import { cloneElement, useLayoutEffect, useRef, type ComponentRef, type ReactElement } from "react";
import { Text, View, useWindowDimensions, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { DEFAULT_TOOLTIP_DELAY_MS, validateTooltipLabel, type TooltipProps } from "./Tooltip.types.ts";
export type { TooltipProps } from "./Tooltip.types.ts";

type Rect={x:number;y:number;width:number;height:number};
type Size={width:number;height:number};
type State={anchor:Rect|null;size:Size|null};
type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];
const EDGE=8,GAP=4,MAX_WIDTH=280;

/**
 * A supplementary RN surface for the Qt hosts. Native measurement places it
 * beside the anchor; it never opens a Modal or takes pointer/keyboard focus.
 * The anchor retains its own handlers and exposes the full accessibility hint.
 */
export function Tooltip({label,children,delayMs=DEFAULT_TOOLTIP_DELAY_MS,disabled=false,testID}:TooltipProps){
  const text=validateTooltipLabel(label);
  if(!Number.isFinite(delayMs)||delayMs<0)throw new RangeError("Tooltip delayMs must be finite and nonnegative");
  const window=useWindowDimensions();
  const local=useRef<StoreApi<State>|null>(null);
  if(!local.current)local.current=createStore<State>(()=>({anchor:null,size:null}));
  const store=local.current,anchor=useStore(store,s=>s.anchor),size=useStore(store,s=>s.size);
  const wrapper=useRef<ComponentRef<typeof View>>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null),generation=useRef(0);
  const activity=useRef({hover:false,focus:false,touch:false,dismissed:false});
  const committed=useRef<{disabled:boolean;delayMs:number}|null>(null);
  const active=()=>activity.current.hover||activity.current.focus||activity.current.touch;
  const cancel=()=>{if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}generation.current++;};
  const hide=()=>{cancel();store.setState({anchor:null,size:null});};
  const show=()=>{
    if(!committed.current||committed.current.disabled||!active()||activity.current.dismissed||timer.current!==null||store.getState().anchor)return;
    const request=++generation.current;
    timer.current=setTimeout(()=>{
      timer.current=null;
      if(request!==generation.current||!committed.current||committed.current.disabled||!active()||activity.current.dismissed)return;
      wrapper.current?.measureInWindow((x,y,width,height)=>{
        if(request!==generation.current||!committed.current||committed.current.disabled||!active()||activity.current.dismissed)return;
        if(![x,y,width,height].every(Number.isFinite)||width<=0||height<=0)return;
        store.setState({anchor:{x,y,width,height},size:null});
      });
    },committed.current.delayMs);
  };
  const enter=(kind:"hover"|"focus"|"touch")=>{
    if(!active())activity.current.dismissed=false;
    activity.current[kind]=true;show();
  };
  const leave=(kind:"hover"|"focus"|"touch")=>{
    activity.current[kind]=false;
    if(!active()){activity.current.dismissed=false;hide();}
  };
  useLayoutEffect(()=>{committed.current={disabled,delayMs};});
  // A resize, changed label or disabled anchor invalidates outstanding native
  // measurements. A new input event can request the new geometry.
  useLayoutEffect(()=>{hide();activity.current={hover:false,focus:false,touch:false,dismissed:false};},
    [disabled,delayMs,text,window.width,window.height]);
  useLayoutEffect(()=>()=>{committed.current=null;cancel();},[]);
  const maxWidth=Math.max(1,Math.min(MAX_WIDTH,window.width-EDGE*2));
  const maxHeight=Math.max(1,window.height-EDGE*2);
  let left=0,top=anchor?.height??0;
  if(anchor&&size){
    const x=Math.max(EDGE,Math.min(anchor.x,window.width-EDGE-size.width));
    const below=anchor.y+anchor.height+GAP;
    const y=Math.max(EDGE,Math.min(below+size.height<=window.height-EDGE?below:anchor.y-size.height-GAP,
      window.height-EDGE-size.height));
    left=x-anchor.x;top=y-anchor.y;
  }
  const ownHint=(children.props as {accessibilityHint?:string}).accessibilityHint;
  const hint=disabled?ownHint:ownHint&&ownHint!==text?ownHint+". "+text:text;
  return <View ref={wrapper} collapsable={false} style={{alignSelf:"flex-start",position:"relative",overflow:"visible"}}
    onPointerEnter={event=>{if(event.nativeEvent.pointerType!=="touch")enter("hover");}}
    onPointerLeave={()=>leave("hover")}
    onFocus={()=>enter("focus")} onBlur={()=>leave("focus")}
    onTouchStart={()=>enter("touch")} onTouchEnd={()=>leave("touch")}
    onTouchMove={()=>{activity.current.dismissed=true;hide();}}
    onTouchCancel={()=>leave("touch")}
    onKeyDown={(event:KeyEvent)=>{
      const key=(event.nativeEvent??event) as unknown as {key?:string};
      if(key.key==="Escape"&&(timer.current!==null||store.getState().anchor)){
        activity.current.dismissed=true;hide();event.stopPropagation?.();
      }
    }}>
    {cloneElement(children as ReactElement<{accessibilityHint?:string}>,{accessibilityHint:hint})}
    {anchor&&!disabled?<View testID={testID} role="tooltip" pointerEvents="none" accessible={false}
      accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      {...{className:"rounded-control bg-surface-raised border border-border px-2 py-1"}}
      style={{position:"absolute",zIndex:10,left,top,maxWidth,maxHeight,overflow:"hidden",opacity:size?1:0}}
      onLayout={event=>{
        const {width,height}=event.nativeEvent.layout;
        if(![width,height].every(Number.isFinite)||width<=0||height<=0)return;
        const current=store.getState();
        if(current.anchor===anchor&&(current.size?.width!==width||current.size.height!==height))store.setState({size:{width,height}});
      }}>
      <Text {...{className:"text-sm text-text"}}>{text}</Text>
    </View>:null}
  </View>;
}
