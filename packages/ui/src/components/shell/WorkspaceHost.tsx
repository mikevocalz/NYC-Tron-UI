import {useEffect,useRef,type ComponentRef,type ReactNode} from "react";
import {Platform,Pressable,ScrollView,Text,View,type LayoutChangeEvent,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import type {FoldFeature} from "@nyc-tron/core/folds";
import {announce} from "../forge/announce.ts";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {AdaptiveDock,type DockPanel} from "./AdaptiveDock.tsx";
import type {DockDefaults,DockLayout} from "./dock-model.ts";
import {rovingTarget,shellKey} from "./shell-keys.ts";
import {
  documentLabel,layoutForMode,modeAnnouncement,modeShortcutIndex,modeShortcutLabel,validateWorkspace,
  type WorkspaceDocument,type WorkspaceMode,
} from "./workspace-model.ts";

export type {WorkspaceDocument,WorkspaceMode} from "./workspace-model.ts";
export type {DockLayout,DockPanel};

/** A {@linkcode WorkspaceMode} with an optional tab icon. */
export interface WorkspaceHostMode extends WorkspaceMode {
  /** Drawn by the app's icon set; `selected` lets it switch to its on-primary color. */
  readonly icon?:(state:{selected:boolean})=>ReactNode;
}

/**
 * Props for {@linkcode WorkspaceHost}. Everything is controlled: the host
 * app's store owns the active mode and one {@linkcode DockLayout} per mode,
 * and persisting them (MMKV, Zustand persist, a document sidecar) is the
 * app's job. The component only proposes changes.
 */
export interface WorkspaceHostProps extends Omit<ViewProps,"children"> {
  /** The one document being edited. */
  document:WorkspaceDocument;
  modes:readonly WorkspaceHostMode[];
  activeModeId:string;
  /** A tab, Ctrl/Cmd+1..9 or a screen-reader tab activation picked a mode. */
  onModeChange:(modeId:string)=>void;
  /** Every panel any mode can show. Each mode docks only the ones it names. */
  panels:readonly DockPanel[];
  /** Stored layout per mode id. A mode without one shows its `defaultLayout`. */
  layouts:Readonly<Record<string,DockLayout>>;
  /** The active mode's dock proposed a new layout. Store it under `modeId`. */
  onLayoutChange:(modeId:string,layout:DockLayout)=>void;
  /**
   * The document canvas. Rendered once and keyed by `document.id`: switching
   * modes or moving panels never remounts it; opening another document does.
   */
  canvas:ReactNode;
  /** Controls before the document title, e.g. a back button. */
  leading?:ReactNode;
  /** Controls after the mode tabs, e.g. a {@linkcode WorkspacePresetSwitcher}. */
  trailing?:ReactNode;
  /**
   * Ctrl+1..9 (Cmd on Apple platforms) switch modes while focus is inside the
   * workspace. Web only: on native, route hardware keys through
   * `modeShortcutIndex` from `@nyc-tron/ui/components/shell/workspace-model`.
   * @default true
   */
  enableModeShortcuts?:boolean;
  /** Show ⌘ rather than Ctrl+ in shortcut hints. @default true on iOS and macOS, and on Apple browsers */
  applePlatform?:boolean;
  /** Below this measured width the title and the mode tabs take two rows. @default 600 */
  compactBelow?:number;
  /** Passed to {@linkcode AdaptiveDock}: fold features, usable regions and placement defaults. */
  features?:readonly FoldFeature[];
  usableRegions?:readonly Rect2D[];
  dockDefaults?:Partial<DockDefaults>;
  /** Below this measured width the dock merges its panels into one stack. @default 600 */
  dockCompactBelow?:number;
  /** @default false */
  isRTL?:boolean;
  className?:string;
  unstyled?:boolean;
}

type Local={width:number;announcement:{text:string;seq:number}|undefined};

const appleByDefault=()=>{
  if(Platform.OS==="ios"||Platform.OS==="macos")return true;
  const nav=(globalThis as {navigator?:{platform?:string;userAgent?:string}}).navigator;
  return Platform.OS==="web"&&/Mac|iPhone|iPad/.test(nav?.platform??nav?.userAgent??"");
};

/**
 * One document, several editing modes. A header names the document (with an
 * unsaved marker) and lists the modes as tabs; the body is an
 * {@linkcode AdaptiveDock} showing the active mode's panels in that mode's
 * layout. The canvas renders once: switching modes swaps the panels around
 * it without remounting it. Mode tabs use manual activation (arrows move
 * focus, Enter or Space switches), because a switch rearranges every panel.
 * Each switch is announced politely.
 */
export function WorkspaceHost({
  document,modes,activeModeId,onModeChange,panels,layouts,onLayoutChange,canvas,leading,trailing,
  enableModeShortcuts=true,applePlatform,compactBelow=600,features,usableRegions,dockDefaults,dockCompactBelow,
  isRTL=false,className,unstyled=false,style,onLayout,...rest
}:WorkspaceHostProps){
  validateWorkspace(modes,layouts,panels.map(p=>p.id));
  const mode=modes.find(m=>m.id===activeModeId);
  if(!mode)throw new TypeError(`Active mode ${activeModeId} is not one of the modes`);
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({width:0,announcement:undefined}));
  const store=local.current;
  const width=useStore(store,s=>s.width);
  const announcement=useStore(store,s=>s.announcement);
  const latest=useRef({modes,mode,onModeChange,onLayoutChange});
  latest.current={modes,mode,onModeChange,onLayoutChange};
  const apple=applePlatform??appleByDefault();
  const styled=!unstyled;
  const dir={direction:isRTL?"rtl":"ltr"} as const;
  const narrow=width>0&&width<compactBelow;

  const spoken=useRef(activeModeId);
  useEffect(()=>{
    if(spoken.current===activeModeId)return;
    spoken.current=activeModeId;
    const text=modeAnnouncement(latest.current.modes,activeModeId);
    if(!text)return;
    if(Platform.OS==="web")store.setState(s=>({announcement:{text,seq:(s.announcement?.seq??0)+1}}));
    else announce(text);
  },[activeModeId,store]);

  const pick=(id:string)=>{if(id!==latest.current.mode.id)latest.current.onModeChange(id);};
  const onKeyDown=(event:unknown)=>{
    if(!enableModeShortcuts)return;
    const k=shellKey(event);
    const code=String((event as {nativeEvent?:{code?:unknown}}).nativeEvent?.code??"");
    const index=modeShortcutIndex({...k,code});
    if(index===null)return;
    const target=latest.current.modes[index];
    if(!target)return;
    k.preventDefault();
    pick(target.id);
  };

  const modePanels=panels.filter(p=>mode.panels.includes(p.id));
  const title=<View style={{flexDirection:"row",alignItems:"center",gap:8,flexShrink:1,minWidth:0}}>
    {document.dirty?<View pointerEvents="none" {...{className:joinClasses(styled&&"border-accent")}}
      style={{width:8,height:8,borderRadius:4,borderWidth:4}}/>:null}
    <Text accessibilityRole="header" accessibilityLabel={documentLabel(document)} numberOfLines={1}
      {...(Platform.OS==="web"?{"aria-level":1}:{})}
      {...{className:joinClasses(styled&&"text-base font-semibold text-text")}} style={{flexShrink:1}}>{document.title}</Text>
  </View>;
  const tabs=<ModeTabs modes={modes} active={mode.id} onPick={pick} apple={apple} rtl={isRTL} styled={styled}
    shortcuts={enableModeShortcuts}/>;

  return <View {...rest} onLayout={(event:LayoutChangeEvent)=>{store.setState({width:event.nativeEvent.layout.width});onLayout?.(event);}}
    {...{onKeyDown,className:joinClasses("min-h-0 min-w-0",className)}} style={[{flex:1,...dir},style]}>
    <View {...{className:joinClasses(styled&&"border-b border-border bg-surface-raised")}}
      style={{paddingHorizontal:8,paddingVertical:4,gap:4}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:8,minHeight:44}}>
        {leading?<View style={{flexDirection:"row",alignItems:"center",gap:4}}>{leading}</View>:null}
        {title}
        {narrow?<View style={{flex:1}}/>:<View style={{flex:1,minWidth:0}}>{tabs}</View>}
        {trailing?<View style={{flexDirection:"row",alignItems:"center",gap:4}}>{trailing}</View>:null}
      </View>
      {narrow?tabs:null}
    </View>
    <AdaptiveDock panels={modePanels} layout={layoutForMode(mode,layouts)}
      onLayoutChange={next=>latest.current.onLayoutChange(latest.current.mode.id,next)}
      workspaceLabel={documentLabel(document)} isRTL={isRTL}
      {...(features?{features}:{})} {...(usableRegions?{usableRegions}:{})} {...(dockDefaults?{defaults:dockDefaults}:{})}
      {...(dockCompactBelow!==undefined?{compactBelow:dockCompactBelow}:{})}
      {...(unstyled?{unstyled}:{})}>
      <View key={document.id} style={{flex:1}}>{canvas}</View>
    </AdaptiveDock>
    {Platform.OS==="web"?<View pointerEvents="none"
      // Visually hidden in place: an off-screen offset would widen the page in right-to-left layouts.
      style={{position:"absolute",width:1,height:1,overflow:"hidden",top:0,left:0,clipPath:"inset(50%)"} as object}>
      <Text key={announcement?.seq??0} accessibilityLiveRegion="polite" {...{"aria-atomic":true}}>{announcement?.text??""}</Text>
    </View>:null}
  </View>;
}

interface ModeTabsProps {
  modes:readonly WorkspaceHostMode[];
  active:string;
  onPick:(id:string)=>void;
  apple:boolean;
  rtl:boolean;
  styled:boolean;
  shortcuts:boolean;
}
function ModeTabs({modes,active,onPick,apple,rtl,styled,shortcuts}:ModeTabsProps){
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const onKeyDown=(i:number)=>(event:unknown)=>{
    const k=shellKey(event);
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    if(k.key==="Enter"||k.key===" "){k.preventDefault();onPick(modes[i]!.id);return;}
    const next=rovingTarget(i,k.key,modes.map(()=>false),"horizontal",rtl);
    if(next===null)return;
    k.preventDefault();
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
  };
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:"row"}}>
    <View accessibilityRole="tablist" accessibilityLabel="Modes" style={{flexDirection:"row",gap:2}}>
      {modes.map((m,i)=>{
        const selected=m.id===active;
        const shortcut=shortcuts?modeShortcutLabel(i,apple):undefined;
        return <Pressable key={m.id} ref={node=>{refs.current[i]=node;}} accessibilityRole="tab"
          accessibilityLabel={m.label} accessibilityState={{selected}} aria-selected={selected}
          {...(shortcut?{accessibilityHint:shortcut}:{})}
          onPress={()=>onPick(m.id)}
          {...{onKeyDown:onKeyDown(i),tabIndex:selected?0:-1,
            ...(shortcut?{"aria-keyshortcuts":(apple?"Meta+":"Control+")+(i+1)}:{}),
            className:joinClasses("min-h-11 min-w-11 flex-row items-center justify-center gap-2 px-3",
              styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
              styled&&(selected?"bg-primary forced-colors:border-2 forced-colors:border-[Highlight]":"bg-transparent hover:bg-surface-sunken"))}}>
          {m.icon?<View pointerEvents="none">{m.icon({selected})}</View>:null}
          <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm",styled&&(selected?"text-on-primary font-semibold":"text-text"))}}>{m.label}</Text>
        </Pressable>;
      })}
    </View>
  </ScrollView>;
}
