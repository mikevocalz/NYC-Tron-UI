import {useRef,useLayoutEffect,type ComponentRef,type ReactNode} from "react";
import {Platform,Pressable,useWindowDimensions,type GestureResponderEvent,type PressableProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {CommandPopover,type CommandMenuItem} from "../overlays/CommandPopover.tsx";
import {hasUsableRegion,type Rect2D} from "../overlays/popover-position.ts";
import {shellKey} from "./shell-keys.ts";

export type {CommandMenuItem} from "../overlays/CommandPopover.tsx";

/** How a {@linkcode ContextMenu} was opened, for apps that log or adapt to it. */
export type ContextMenuSource="pointer"|"long-press"|"keyboard"|"assistive";

/** Props for {@linkcode ContextMenu}. */
export interface ContextMenuProps extends Omit<PressableProps,"children"|"onLongPress"|"onContextMenu"> {
  /** Name of the target, e.g. "Harbor photo layer". The menu is named "Actions for" it. */
  scope?:string;revision?:string|number;
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
  scope="context-menu",revision=0,label,items,onSelect,children,onOpen,disabled=false,usableRegions,style,onKeyDown,accessibilityActions,onAccessibilityAction,...rest
}:ContextMenuProps){
  const window=useWindowDimensions();
  const local=useRef<StoreApi<{anchor:Rect2D|undefined}>|null>(null);
  if(!local.current)local.current=createStore<{anchor:Rect2D|undefined}>(()=>({anchor:undefined}));
  const store=local.current;
  const anchor=useStore(store,s=>s.anchor);
  const target=useRef<ComponentRef<typeof Pressable>>(null);
  const wasOpen=useRef(false);
  useLayoutEffect(()=>{
    if(wasOpen.current&&!anchor&&(String(Platform.OS)==="qnx"||String(Platform.OS)==="marathon"))target.current?.focus?.();
    wasOpen.current=anchor!==undefined;
  },[anchor]);
  const regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];
  const usable=!disabled&&items.some(i=>!i.disabled)&&hasUsableRegion(regions);
  const boundary=JSON.stringify([scope,revision,disabled]);
  const committed=useRef<{boundary:string;items:typeof items;onSelect:typeof onSelect;onOpen:typeof onOpen}|null>(null),request=useRef(0);
  useLayoutEffect(()=>{committed.current={boundary,items,onSelect,onOpen};});
  useLayoutEffect(()=>{request.current++;store.setState({anchor:undefined});},[boundary,usable,store]);
  useLayoutEffect(()=>()=>{committed.current=null;request.current++;},[]);
  const current=()=>usable&&committed.current?.boundary===boundary?committed.current:null;
  const select=(id:string)=>{const p=current();if(p?.items.some(i=>i.id===id&&!i.disabled))p.onSelect(id);};
  const openAt=(rect:Rect2D,source:ContextMenuSource)=>{
    const p=current();if(!p)return;
    store.setState({anchor:rect});
    p.onOpen?.(source);
  };
  const openBeside=(source:ContextMenuSource)=>{
    const node=target.current as unknown as {measureInWindow?:(cb:(x:number,y:number,w:number,h:number)=>void)=>void}|null;
    const ticket=++request.current;
    node?.measureInWindow?.((x,y,w,h)=>{if(ticket===request.current&&current()&&[x,y,w,h].every(Number.isFinite)&&w>0&&h>0)openAt({x,y,width:w,height:h},source);});
  };
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
      style={state=>[{minWidth:44,minHeight:44},typeof style==="function"?style(state):style]}>
      {children}
    </Pressable>
    {anchor&&usable?<CommandPopover testID={rest.testID?`${rest.testID}-menu`:undefined} visible accessibilityLabel={"Actions for "+label} anchor={anchor} usableRegions={regions}
      items={items} onSelect={select} onDismiss={()=>store.setState({anchor:undefined})}/>:null}
  </>;
}
