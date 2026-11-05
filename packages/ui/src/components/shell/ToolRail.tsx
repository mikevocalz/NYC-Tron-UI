import {useRef,type ComponentRef,type ReactNode} from "react";
import {I18nManager,Platform,Pressable,Text,useWindowDimensions,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {CommandPopover} from "../overlays/CommandPopover.tsx";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {nodeIsRTL,rovingTarget,shellKey,type ShellAxis} from "./shell-keys.ts";
import {shownVariantId,toolIsActive,type RailTool} from "./tool-rail-model.ts";

export type {RailTool,RailToolVariant,ToolIcon} from "./tool-rail-model.ts";
export {shownVariantId,toolIsActive} from "./tool-rail-model.ts";


/** Props for {@linkcode ToolRail}. */
export interface ToolRailProps extends Omit<ViewProps,"children"> {
  tools:readonly RailTool[];
  /** The active tool or variant id. */
  activeToolId:string|undefined;
  onSelectTool:(id:string)=>void;
  /** Which variant each group button shows and selects on press. @default the first variant */
  groupSelection?:Readonly<Record<string,string>>;
  /** Accessible name of the toolbar. @default "Tools" */
  label?:string;
  /** Physical screen edge the rail sits on. Flyouts open away from it. @default "left" */
  edge?:"left"|"right"|"bottom";
  /** Shows labels beside the icons. Hit targets do not change. @default false */
  expanded?:boolean;
  /** Window-space regions flyouts may use, from the foldable layout owner. @default the whole window */
  usableRegions?:readonly Rect2D[];
  className?:string;
  unstyled?:boolean;
}

type Flyout={toolId:string;anchor:Rect2D};

/**
 * Compact professional tool palette. Each tool is a 44pt toggle button that
 * shows its active state; grouped tools carry a corner mark and open a flyout
 * of variants on long press, on the arrow pointing away from the rail's edge,
 * or through a screen-reader action. On web the rail is one Tab stop with
 * arrow-key focus. The app owns the active tool and every shortcut binding.
 */
export function ToolRail({
  tools,activeToolId,onSelectTool,groupSelection,label="Tools",edge="left",expanded=false,usableRegions,
  className,unstyled=false,style,...rest
}:ToolRailProps){
  const styled=!unstyled;
  const window=useWindowDimensions();
  const local=useRef<StoreApi<{flyout:Flyout|undefined;focus:number}>|null>(null);
  if(!local.current)local.current=createStore<{flyout:Flyout|undefined;focus:number}>(()=>({flyout:undefined,focus:-1}));
  const store=local.current;
  const flyout=useStore(store,s=>s.flyout);
  const focus=useStore(store,s=>s.focus);
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const axis:ShellAxis=edge==="bottom"?"horizontal":"vertical";
  const activeIndex=tools.findIndex(t=>toolIsActive(t,activeToolId)&&!t.disabled);
  const stop=focus>=0&&!tools[focus]?.disabled?focus:activeIndex>=0?activeIndex:tools.findIndex(t=>!t.disabled);
  const regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];

  const openFlyout=(i:number)=>{
    const tool=tools[i];
    if(!tool?.variants?.length||tool.disabled)return;
    const node=refs.current[i] as unknown as {measureInWindow?:(cb:(x:number,y:number,w:number,h:number)=>void)=>void}|null;
    const show=(anchor:Rect2D)=>store.setState({flyout:{toolId:tool.id,anchor}});
    if(node?.measureInWindow)node.measureInWindow((x,y,width,height)=>show({x,y,width,height}));
    else show({x:0,y:0,width:44,height:44});
  };
  const onKeyDown=(i:number)=>(event:unknown)=>{
    const k=shellKey(event);
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    const rtl=nodeIsRTL(k.target)||I18nManager.isRTL;
    const outward=edge==="left"?"ArrowRight":edge==="right"?"ArrowLeft":"ArrowUp";
    if(k.key===outward&&tools[i]?.variants?.length){k.preventDefault();openFlyout(i);return;}
    const next=rovingTarget(i,k.key,tools.map(t=>!!t.disabled),axis,rtl);
    if(next===null)return;
    k.preventDefault();
    store.setState({focus:next});
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
  };
  const flyoutTool=flyout?tools.find(t=>t.id===flyout.toolId):undefined;
  const horizontal=axis==="horizontal";

  return <View {...rest} accessibilityRole="toolbar" accessibilityLabel={label}
    aria-orientation={horizontal?"horizontal":"vertical"}
    {...{className:joinClasses("gap-1",styled&&"bg-surface-raised p-1",
      styled&&(edge==="left"?"border-r border-border":edge==="right"?"border-l border-border":"border-t border-border"),className)}}
    style={[{flexDirection:horizontal?"row":"column",alignItems:horizontal?"center":"stretch",
      flexWrap:horizontal?"wrap":"nowrap"},style]}>
    {tools.map((tool,i)=>{
      const shown=tool.variants?.length?tool.variants.find(v=>v.id===(toolIsActive(tool,activeToolId)?activeToolId:shownVariantId(tool,groupSelection))):undefined;
      const current=shown??tool;
      const active=toolIsActive(tool,activeToolId);
      const grouped=!!tool.variants?.length;
      const name=grouped?`${tool.label}: ${current.label}`:tool.label;
      const shortcut=current.shortcut??tool.shortcut;
      const icon=typeof current.icon==="function"?current.icon({active}):current.icon;
      return <Pressable key={tool.id} ref={node=>{refs.current[i]=node;}}
        accessibilityRole="button" accessibilityLabel={name}
        accessibilityHint={[shortcut?"Shortcut "+shortcut:"",grouped?"Long press for more tools.":""].filter(Boolean).join(". ")||undefined}
        accessibilityState={{selected:active,disabled:!!tool.disabled}} aria-pressed={active}
        {...(grouped?{"aria-haspopup":"menu" as const}:{})}
        accessibilityActions={grouped?[{name:"activate"},{name:"showVariants",label:"More "+tool.label+" tools"}]:undefined}
        onAccessibilityAction={grouped?event=>{
          if(event.nativeEvent.actionName==="activate")onSelectTool(current.id);
          if(event.nativeEvent.actionName==="showVariants")openFlyout(i);
        }:undefined}
        disabled={tool.disabled}
        onPress={()=>onSelectTool(grouped?current.id:tool.id)}
        onLongPress={grouped?()=>openFlyout(i):undefined}
        onFocus={()=>store.setState({focus:i})}
        {...(Platform.OS==="web"?{onKeyDown:onKeyDown(i),tabIndex:i===stop?0:-1}:{})}
        {...{className:joinClasses("min-h-11 min-w-11 flex-row items-center gap-2",
          styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
          styled&&(active?"bg-primary forced-colors:border-2 forced-colors:border-[Highlight]":"bg-transparent hover:bg-surface-sunken"),
          expanded?"px-2":"justify-center",tool.disabled&&"opacity-40")}}>
        <View pointerEvents="none" style={{width:28,height:28,alignItems:"center",justifyContent:"center"}}>{icon}</View>
        {expanded?<Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm",styled&&(active?"text-on-primary":"text-text"))}}
          style={{flex:1}}>{current.label}</Text>:null}
        {grouped?<View pointerEvents="none" {...{className:joinClasses(styled&&(active?"border-b-on-primary":"border-b-text-muted"))}}
          style={{position:"absolute",right:3,bottom:3,width:0,height:0,borderLeftWidth:5,borderBottomWidth:5,
            borderLeftColor:"transparent"}}/>:null}
      </Pressable>;
    })}
    {flyout&&flyoutTool?.variants?<CommandPopover visible accessibilityLabel={flyoutTool.label+" tools"}
      anchor={edge==="bottom"?flyout.anchor:{...flyout.anchor,
        // Open beside the rail instead of over the next tool.
        x:edge==="left"?flyout.anchor.x+flyout.anchor.width+4:flyout.anchor.x-236,y:flyout.anchor.y-flyout.anchor.height-8}}
      usableRegions={regions} width={232}
      items={flyoutTool.variants.map(v=>({id:v.id,label:v.label,
        description:[v.id===activeToolId?"Current tool":"",v.shortcut?"Shortcut "+v.shortcut:""].filter(Boolean).join(", ")||undefined}))}
      onSelect={id=>onSelectTool(id)}
      onDismiss={()=>store.setState({flyout:undefined})}/>:null}
  </View>;
}
