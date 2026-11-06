import {useRef,type ComponentRef,type ReactNode,type Ref} from "react";
import {Pressable,useWindowDimensions,type PressableProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {CommandPopover,type CommandMenuItem} from "../overlays/CommandPopover.tsx";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {shellKey} from "./shell-keys.ts";

export type {CommandMenuItem} from "../overlays/CommandPopover.tsx";

/** Props for {@linkcode MenuButton}. */
export interface MenuButtonProps extends Omit<PressableProps,"children"|"onPress"|"accessibilityLabel"|"aria-label"> {
  /** Accessible name of the button, e.g. "Panel options". */
  label:string;
  items:readonly CommandMenuItem[];
  onSelect:(id:string)=>void;
  /** Visible content. The button is at least 44 by 44 points. */
  children:ReactNode;
  /**
   * Window-space regions the menu may use, from the foldable layout owner.
   * @default the whole window
   */
  usableRegions?:readonly Rect2D[];
  /** @default 240 */
  menuWidth?:number;
  disabled?:boolean;
  className?:string;
  unstyled?:boolean;
  /** The trigger, for moving focus to it (roving toolbars, closing a follow-up dialog). */
  ref?:Ref<ComponentRef<typeof Pressable>>;
}

/**
 * A button that opens a {@linkcode CommandPopover} anchored to itself. Enter,
 * Space, ArrowDown and screen-reader activation open it; focus returns to the
 * button when it closes.
 */
export function MenuButton({
  label,items,onSelect,children,usableRegions,menuWidth=240,disabled=false,className,unstyled=false,style,ref:forwarded,...rest
}:MenuButtonProps){
  const window=useWindowDimensions();
  const local=useRef<StoreApi<{anchor:Rect2D|undefined}>|null>(null);
  if(!local.current)local.current=createStore<{anchor:Rect2D|undefined}>(()=>({anchor:undefined}));
  const store=local.current;
  const anchor=useStore(store,s=>s.anchor);
  const ref=useRef<ComponentRef<typeof Pressable>>(null);
  const off=disabled||!items.some(item=>!item.disabled);
  const open=()=>{
    if(off)return;
    const node=ref.current as unknown as {measureInWindow?:(cb:(x:number,y:number,w:number,h:number)=>void)=>void}|null;
    if(!node?.measureInWindow){store.setState({anchor:{x:0,y:0,width:0,height:0}});return;}
    node.measureInWindow((x,y,width,height)=>store.setState({anchor:{x,y,width,height}}));
  };
  const regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];
  return <>
    <Pressable {...rest} ref={node=>{
      ref.current=node;
      if(typeof forwarded==="function")forwarded(node);else if(forwarded)forwarded.current=node;
    }} accessibilityRole="button" accessibilityLabel={label}
      aria-haspopup="menu" aria-expanded={anchor!==undefined}
      accessibilityState={{disabled:off,expanded:anchor!==undefined}}
      disabled={off} onPress={open}
      {...{onKeyDown:(event:unknown)=>{
        const k=shellKey(event);
        if(k.key==="ArrowDown"&&!k.altKey&&!k.ctrlKey&&!k.metaKey){k.preventDefault();open();}
      }}}
      {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",
        !unstyled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
        off&&"opacity-40",className)}}
      style={style}>
      {children}
    </Pressable>
    {anchor?<CommandPopover visible accessibilityLabel={label} anchor={anchor} usableRegions={regions}
      items={items} width={menuWidth} onSelect={onSelect}
      onDismiss={()=>store.setState({anchor:undefined})}/>:null}
  </>;
}
