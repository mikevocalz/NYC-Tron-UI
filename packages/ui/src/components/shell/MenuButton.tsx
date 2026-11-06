import {useLayoutEffect,useRef,type ComponentRef,type ReactNode,type Ref} from "react";
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
  /** Logical document/action identity; changes dismiss pending measurements and menus. */
  editScope?:string;
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
  label,editScope="menu",items,onSelect,children,usableRegions,menuWidth=240,disabled=false,className,unstyled=false,style,ref:forwarded,...rest
}:MenuButtonProps){
  if(!editScope.trim()||editScope.length>32768)throw new RangeError("Invalid menu edit scope");
  const window=useWindowDimensions();
  type Anchor={rect:Rect2D;scope:string;request:number};
  type Local={anchor:Anchor|undefined;request:number};
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({anchor:undefined,request:0}));
  const store=local.current,anchor=useStore(store,s=>s.anchor);
  const ref=useRef<ComponentRef<typeof Pressable>>(null);
  const off=disabled||!items.some(item=>!item.disabled);
  const committed=useRef<{scope:string;off:boolean;items:readonly CommandMenuItem[];onSelect:typeof onSelect}|null>(null);
  useLayoutEffect(()=>{committed.current={scope:editScope,off,items,onSelect};});
  useLayoutEffect(()=>{store.setState(s=>({anchor:undefined,request:s.request+1}));},[editScope,off,store]);
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const owns=(at:Anchor)=>committed.current?.scope===at.scope&&!committed.current.off&&store.getState().request===at.request;
  const open=()=>{
    const p=committed.current;
    if(!p||p.off||p.scope!==editScope)return;
    const node=ref.current as unknown as {measureInWindow?:(cb:(x:number,y:number,w:number,h:number)=>void)=>void}|null;
    if(!node?.measureInWindow)return;
    const request=store.getState().request+1;store.setState({request});
    node.measureInWindow((x,y,width,height)=>{
      const next={scope:editScope,request,rect:{x,y,width,height}};
      if(owns(next)&&[x,y,width,height].every(Number.isFinite)&&width>0&&height>0)store.setState({anchor:next});
    });
  };
  const regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];
  const shown=anchor?.scope===editScope&&!off?anchor:undefined;
  return <>
    <Pressable {...rest} ref={node=>{
      ref.current=node;
      if(typeof forwarded==="function")forwarded(node);else if(forwarded)forwarded.current=node;
    }} accessibilityRole="button" accessibilityLabel={label}
      aria-haspopup="menu" aria-expanded={shown!==undefined}
      accessibilityState={{disabled:off,expanded:shown!==undefined}}
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
    {shown?<CommandPopover key={shown.request} visible accessibilityLabel={label} anchor={shown.rect} usableRegions={regions}
      items={items} width={menuWidth} onSelect={id=>{const p=committed.current;if(owns(shown)&&p?.items.some(item=>item.id===id&&!item.disabled))p.onSelect(id);}}
      onDismiss={()=>{if(owns(shown))store.setState({anchor:undefined});}}/>:null}
  </>;
}
