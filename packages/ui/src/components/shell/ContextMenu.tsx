import {useRef,type ComponentRef,type ReactNode} from "react";
import {Pressable,useWindowDimensions,type GestureResponderEvent,type PressableProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {CommandPopover,type CommandMenuItem} from "../overlays/CommandPopover.tsx";
import type {Rect2D} from "../overlays/popover-position.ts";
import {shellKey} from "./shell-keys.ts";

export type {CommandMenuItem} from "../overlays/CommandPopover.tsx";

/** How a {@linkcode ContextMenu} was opened, for apps that log or adapt to it. */
export type ContextMenuSource="pointer"|"long-press"|"keyboard"|"assistive";

/** Props for {@linkcode ContextMenu}. */
export interface ContextMenuProps extends Omit<PressableProps,"children"|"onLongPress"|"onContextMenu"> {
  /** Name of the target, e.g. "Harbor photo layer". The menu is named "Actions for" it. */
  label:string;
  items:readonly CommandMenuItem[];
  onSelect:(id:string)=>void;
  /** The target. It keeps its own primary press through `onPress`. */
  children:ReactNode;
  /** Called with the input that opened the menu. */
  onOpen?:(source:ContextMenuSource)=>void;
  disabled?:boolean;
  /** Window-space regions the menu may use. @default the whole window */
  usableRegions?:readonly Rect2D[];
}

/** A zero-size anchor at a window point. */
export function pointAnchor(x:number,y:number):Rect2D{
  if(!Number.isFinite(x)||!Number.isFinite(y))throw new RangeError("Invalid menu point");
  return {x,y,width:0,height:0};
}
/** True for the keys that open a context menu from the keyboard: Shift+F10 and the Menu key. */
export function isContextMenuKey(key:string,shift:boolean):boolean{
  return key==="ContextMenu"||(shift&&key==="F10");
}

/**
 * Secondary actions for any target. Opens at the pointer on a mouse
 * right-click or a stylus barrel click (both arrive as `contextmenu` on web),
 * at the touch point on a long press, beside the target on Shift+F10 or the
 * Menu key, and through a "Show actions" screen-reader action. The menu is
 * a {@linkcode CommandPopover}: arrows, Home/End, Tab cycling, Escape, and
 * focus returns to the target. The OS menu (`NativeActionMenu`) is the
 * native choice in `@nyc-tron/expo-controls/ContextMenu`.
 */
export function ContextMenu({
  label,items,onSelect,children,onOpen,disabled=false,usableRegions,style,onKeyDown,accessibilityActions,onAccessibilityAction,...rest
}:ContextMenuProps){
  const window=useWindowDimensions();
  const local=useRef<StoreApi<{anchor:Rect2D|undefined}>|null>(null);
  if(!local.current)local.current=createStore<{anchor:Rect2D|undefined}>(()=>({anchor:undefined}));
  const store=local.current;
  const anchor=useStore(store,s=>s.anchor);
  const target=useRef<ComponentRef<typeof Pressable>>(null);
  const usable=!disabled&&items.some(i=>!i.disabled);
  const openAt=(rect:Rect2D,source:ContextMenuSource)=>{
    if(!usable)return;
    store.setState({anchor:rect});
    onOpen?.(source);
  };
  const openBeside=(source:ContextMenuSource)=>{
    const node=target.current as unknown as {measureInWindow?:(cb:(x:number,y:number,w:number,h:number)=>void)=>void}|null;
    if(node?.measureInWindow)node.measureInWindow((x,y,w,h)=>openAt({x,y,width:w,height:h},source));
    else openAt(pointAnchor(window.width/2,window.height/2),source);
  };
  const regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];
  return <>
    <Pressable {...rest} ref={target} disabled={disabled}
      aria-haspopup="menu"
      accessibilityHint={usable?"Has actions. Long press, right-click or press Shift F10.":undefined}
      accessibilityActions={[...(accessibilityActions??[]),...(usable?[{name:"longpress",label:"Show actions"}]:[])]}
      onAccessibilityAction={event=>{
        if(event.nativeEvent.actionName==="longpress")openBeside("assistive");
        else onAccessibilityAction?.(event);
      }}
      onLongPress={(event:GestureResponderEvent)=>openAt(pointAnchor(event.nativeEvent.pageX,event.nativeEvent.pageY),"long-press")}
      {...{onContextMenu:(event:{preventDefault?:()=>void;nativeEvent?:{clientX?:number;clientY?:number}})=>{
        if(!usable)return;
        event.preventDefault?.();
        const x=event.nativeEvent?.clientX,y=event.nativeEvent?.clientY;
        if(Number.isFinite(x)&&Number.isFinite(y))openAt(pointAnchor(x!,y!),"pointer");
        else openBeside("pointer");
      }}}
      onKeyDown={event=>{
        const k=shellKey(event);
        if(isContextMenuKey(k.key,k.shiftKey)){k.preventDefault();openBeside("keyboard");return;}
        onKeyDown?.(event);
      }}
      style={style}>
      {children}
    </Pressable>
    {anchor?<CommandPopover visible accessibilityLabel={"Actions for "+label} anchor={anchor} usableRegions={regions}
      items={items} onSelect={onSelect} onDismiss={()=>store.setState({anchor:undefined})}/>:null}
  </>;
}
