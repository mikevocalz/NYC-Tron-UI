import { cloneElement, isValidElement, useEffect, useId, useRef } from "react";
import { Text, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { DEFAULT_TOOLTIP_DELAY_MS, validateTooltipLabel, type TooltipProps } from "./Tooltip.types.ts";
export type { TooltipProps } from "./Tooltip.types.ts";

type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];

/**
 * RN web tooltip: appears after `delayMs` of hover or keyboard focus on the
 * anchor, hides on pointer leave, blur or Escape, and describes the anchor
 * through aria-describedby. It never takes focus and ignores pointer input,
 * so it cannot cover or block the control it explains.
 */
export function Tooltip({label,children,delayMs=DEFAULT_TOOLTIP_DELAY_MS,disabled=false,testID}:TooltipProps){
  const text=validateTooltipLabel(label);
  const local=useRef<StoreApi<{visible:boolean}>|null>(null);
  if(!local.current)local.current=createStore(()=>({visible:false}));
  const store=local.current;
  const visible=useStore(store,state=>state.visible);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const id="tron-tooltip-"+useId().replace(/[^a-zA-Z0-9_-]/g,"");
  const cancel=()=>{if(timer.current){clearTimeout(timer.current);timer.current=null;}};
  const show=()=>{
    if(disabled)return;
    cancel();
    timer.current=setTimeout(()=>{timer.current=null;store.setState({visible:true});},Math.max(0,delayMs));
  };
  const hide=()=>{cancel();store.setState({visible:false});};
  useEffect(()=>cancel,[]);
  useEffect(()=>{if(disabled)hide();},[disabled]);
  return <View style={{alignSelf:"flex-start",position:"relative"}}
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
      style={{position:"absolute",top:"100%",left:0,marginTop:4,zIndex:10,maxWidth:280}}>
      <Text {...{className:"text-sm text-text"}}>{text}</Text>
    </View>:null}
  </View>;
}
