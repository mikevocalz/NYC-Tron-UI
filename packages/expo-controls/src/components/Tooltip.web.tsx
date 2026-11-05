import { cloneElement, isValidElement, useEffect, useId, useRef, type ComponentRef } from "react";
import { Text, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { DEFAULT_TOOLTIP_DELAY_MS, validateTooltipLabel, type TooltipProps } from "./Tooltip.types.ts";
export type { TooltipProps } from "./Tooltip.types.ts";

type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];
type Side={vertical:"below"|"above";horizontal:"start"|"end"};
type Rect={left:number;right:number;top:number;bottom:number};
const TOOLTIP_MAX_WIDTH=280;
const TOOLTIP_CLEARANCE=48;
/** Opens toward the side of the viewport with room, so the tooltip never leaves the window. */
function tooltipSide(anchor:Rect,viewport:{width:number;height:number}):Side{
  return {
    vertical:anchor.bottom+TOOLTIP_CLEARANCE>viewport.height&&anchor.top>TOOLTIP_CLEARANCE?"above":"below",
    horizontal:anchor.left+TOOLTIP_MAX_WIDTH>viewport.width&&anchor.right>=TOOLTIP_MAX_WIDTH?"end":"start",
  };
}

/**
 * RN web tooltip: appears after `delayMs` of hover or keyboard focus on the
 * anchor, hides on pointer leave, blur or Escape, and describes the anchor
 * through aria-describedby. It never takes focus and ignores pointer input,
 * so it cannot cover or block the control it explains.
 */
export function Tooltip({label,children,delayMs=DEFAULT_TOOLTIP_DELAY_MS,disabled=false,testID}:TooltipProps){
  const text=validateTooltipLabel(label);
  const local=useRef<StoreApi<{visible:boolean;side:Side}>|null>(null);
  if(!local.current)local.current=createStore(()=>({visible:false,side:{vertical:"below",horizontal:"start"} as Side}));
  const store=local.current;
  const visible=useStore(store,state=>state.visible);
  const side=useStore(store,state=>state.side);
  const wrapper=useRef<ComponentRef<typeof View>>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const id="tron-tooltip-"+useId().replace(/[^a-zA-Z0-9_-]/g,"");
  const cancel=()=>{if(timer.current){clearTimeout(timer.current);timer.current=null;}};
  const show=()=>{
    if(disabled)return;
    cancel();
    timer.current=setTimeout(()=>{
      timer.current=null;
      const node=wrapper.current as unknown as {getBoundingClientRect?:()=>Rect}|null;
      const rect=node?.getBoundingClientRect?.();
      const win=globalThis as {innerWidth?:number;innerHeight?:number};
      store.setState({visible:true,side:rect&&win.innerWidth&&win.innerHeight
        ?tooltipSide(rect,{width:win.innerWidth,height:win.innerHeight}):store.getState().side});
    },Math.max(0,delayMs));
  };
  const hide=()=>{cancel();store.setState({visible:false});};
  useEffect(()=>cancel,[]);
  useEffect(()=>{if(disabled)hide();},[disabled]);
  return <View ref={wrapper} style={{alignSelf:"flex-start",position:"relative"}}
    onPointerEnter={show} onPointerLeave={hide}
    onFocus={show} onBlur={hide}
    onKeyDown={(event:KeyEvent)=>{
      if((event.nativeEvent as unknown as {key:string}).key==="Escape"&&store.getState().visible){
        event.stopPropagation();hide();
      }
    }}>
    {/* The control itself carries the description, not this wrapper. */}
    {isValidElement<{"aria-describedby"?:string}>(children)
      ?cloneElement(children,{"aria-describedby":visible?id:children.props["aria-describedby"]})
      :children}
    {visible?<View nativeID={id} role="tooltip" testID={testID} pointerEvents="none"
      {...{className:"rounded-control bg-surface-raised border border-border px-2 py-1"}}
      style={{position:"absolute",zIndex:10,maxWidth:TOOLTIP_MAX_WIDTH,width:"max-content" as unknown as number,
        ...(side.vertical==="below"?{top:"100%",marginTop:4}:{bottom:"100%",marginBottom:4}),
        ...(side.horizontal==="start"?{left:0}:{right:0})}}>
      <Text {...{className:"text-sm text-text"}}>{text}</Text>
    </View>:null}
  </View>;
}
