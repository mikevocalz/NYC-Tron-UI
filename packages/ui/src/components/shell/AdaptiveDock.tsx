import {useEffect,useRef,type ComponentRef,type ReactNode} from "react";
import {Pressable,ScrollView,Text,View,type LayoutChangeEvent,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import type {FoldFeature} from "@nyc-tron/core/folds";
import {DragGrabHandle,type DragPoint} from "../DragGrabHandle.tsx";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {MenuButton} from "./MenuButton.tsx";
import {PaneSplitter} from "./PaneSplitter.tsx";
import {rovingTarget,shellKey} from "./shell-keys.ts";
import {
  activatePanel,clampFloatingRect,closePanel,dockedPanelIds,dockTargetAt,movePanel,panelLocation,resizeStack,
  validateDockLayout,type DockDefaults,type DockEdge,type DockLayout,type DockTarget,
} from "./dock-model.ts";

export type {DockEdge,DockLayout,DockStack,DockTarget,FloatingPanel} from "./dock-model.ts";

/** One panel an {@linkcode AdaptiveDock} can place. */
export interface DockPanel {
  readonly id:string;
  /** Tab and header title; also the accessible name of the panel. */
  readonly title:string;
  readonly content:ReactNode;
}

/** Props for {@linkcode AdaptiveDock}. */
export interface AdaptiveDockProps extends Omit<ViewProps,"children"> {
  panels:readonly DockPanel[];
  /** Controlled arrangement. Validated on every render. */
  layout:DockLayout;
  /** Every move, resize, tab switch, float and close proposes a whole new layout. */
  onLayoutChange:(next:DockLayout)=>void;
  /** The document workspace in the middle. */
  children:ReactNode;
  /** Window-space fold features. Dividers seat on hinges instead of resting on them. */
  features?:readonly FoldFeature[];
  /** Dock-local regions that floating panels must stay inside (one per screen on a foldable). */
  usableRegions?:readonly Rect2D[];
  /** Below this measured width every panel joins one stack under the workspace. @default 600 */
  compactBelow?:number;
  defaults?:Partial<DockDefaults>;
  /** Text direction of panel content. Edges stay physical. @default false */
  isRTL?:boolean;
  className?:string;
  unstyled?:boolean;
}

type Drag={id:string;origin:DragPoint|undefined;from:Rect2D;rect:Rect2D;target:DockTarget|undefined};
type Local={width:number;height:number;window:Rect2D|undefined;drag:Drag|undefined};
const EDGE_NAME:Record<DockTarget,string>={left:"left dock",right:"right dock",bottom:"bottom dock",floating:"floating window"};
const MIN_EDGE=160,MIN_WORKSPACE=200;

/**
 * Controlled docking shell: panels stack as tabs on the left, right and bottom
 * edges, or float over the workspace. Each stack has a menu that moves its
 * active panel to another edge, floats it or closes it, so every move has a
 * non-drag path; floating panels also drag by their grip and dock when dropped
 * on an edge. Edges resize with {@linkcode PaneSplitter}, which keeps dividers
 * off hinges, and floating panels stay inside one usable region. Below
 * `compactBelow` every panel joins a single stack under the workspace.
 */
export function AdaptiveDock({
  panels,layout,onLayoutChange,children,features,usableRegions,compactBelow=600,defaults,isRTL=false,
  className,unstyled=false,style,onLayout,...rest
}:AdaptiveDockProps){
  validateDockLayout(layout,panels.map(p=>p.id));
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({width:0,height:0,window:undefined,drag:undefined}));
  const store=local.current;
  const width=useStore(store,s=>s.width);
  const height=useStore(store,s=>s.height);
  const drag=useStore(store,s=>s.drag);
  const host=useRef<ComponentRef<typeof View>>(null);
  const byId=new Map(panels.map(p=>[p.id,p]));
  const resolved:DockDefaults={
    edgeSize:defaults?.edgeSize??280,
    floatingRect:defaults?.floatingRect??{x:Math.max(0,width/2-160),y:Math.max(0,height/4),width:320,height:280},
  };
  const latest=useRef({layout,onLayoutChange,usableRegions,resolved});
  latest.current={layout,onLayoutChange,usableRegions,resolved};
  const change=(next:DockLayout)=>{if(next!==latest.current.layout)latest.current.onLayoutChange(next);};
  const styled=!unstyled;
  const dir={direction:isRTL?"rtl":"ltr"} as const;
  const compact=width>0&&width<compactBelow;

  const onHostLayout=(event:LayoutChangeEvent)=>{
    const {width:w,height:h}=event.nativeEvent.layout;
    store.setState({width:w,height:h});
    host.current?.measureInWindow?.((x,y,mw,mh)=>store.setState({window:{x,y,width:mw,height:mh}}));
    onLayout?.(event);
  };

  const menuFor=(id:string,where:DockTarget|undefined,compactStack:boolean)=>{
    const title=byId.get(id)?.title??id;
    const targets:DockTarget[]=compactStack?[]:(["left","right","bottom","floating"] as const).filter(t=>t!==where);
    return <MenuButton label={"Options for "+title}
      items={[...targets.map(t=>({id:"move:"+t,label:t==="floating"?"Float":"Move to "+EDGE_NAME[t]})),
        {id:"close",label:"Close "+title}]}
      onSelect={choice=>{
        const p=latest.current;
        if(choice==="close")change(closePanel(p.layout,id));
        else change(movePanel(p.layout,id,choice.slice(5) as DockTarget,p.resolved));
      }}>
      <OptionsGlyph styled={styled}/>
    </MenuButton>;
  };

  const stackView=(key:string,ids:readonly string[],active:string,onActivate:(id:string)=>void,label:string,compactStack=false)=>
    <StackView key={key} ids={ids} active={active} onActivate={onActivate} label={label} styled={styled}
      titleOf={id=>byId.get(id)?.title??id} dir={dir}
      menu={menuFor(active,compactStack?undefined:panelLocation(layout,active),compactStack)}>
      {byId.get(active)?.content}
    </StackView>;
  const edgeView=(edge:DockEdge)=>{
    const stack=layout[edge]!;
    return stackView(edge,stack.panels,stack.active,id=>change(activatePanel(latest.current.layout,id)),
      edge[0]!.toUpperCase()+edge.slice(1)+" dock panels");
  };
  const resize=(edge:DockEdge)=>(size:number)=>change(resizeStack(latest.current.layout,edge,size));
  const workspace=<View style={{flex:1,...dir}} accessibilityLabel="Workspace">{children}</View>;

  let body:ReactNode;
  if(compact){
    const ids=dockedPanelIds(layout);
    const active=layout.bottom?.active??ids[0];
    body=ids.length&&active?<PaneSplitter axis="vertical" label="Resize panels" features={features}
      size={layout.compactSize??Math.round(height*0.45)} sizeEdge="end" minStart={160} minEnd={160}
      onCommit={size=>change({...latest.current.layout,compactSize:size})}
      start={workspace}
      end={stackView("compact",ids,active,id=>{
        const p=latest.current;
        // Bring the panel into the bottom stack so the compact choice survives a resize back to wide.
        change(panelLocation(p.layout,id)==="bottom"?activatePanel(p.layout,id):movePanel(p.layout,id,"bottom",p.resolved));
      },"Panels",true)}/>:workspace;
  }else{
    body=workspace;
    if(layout.bottom)body=<PaneSplitter axis="vertical" label="Resize bottom dock" features={features}
      size={layout.bottom.size} sizeEdge="end" minStart={MIN_WORKSPACE} minEnd={MIN_EDGE}
      onCommit={resize("bottom")} start={body} end={edgeView("bottom")}/>;
    if(layout.right)body=<PaneSplitter axis="horizontal" label="Resize right dock" features={features}
      size={layout.right.size} sizeEdge="end" minStart={MIN_WORKSPACE} minEnd={MIN_EDGE}
      onCommit={resize("right")} start={body} end={edgeView("right")}/>;
    if(layout.left)body=<PaneSplitter axis="horizontal" label="Resize left dock" features={features}
      size={layout.left.size} sizeEdge="start" minStart={MIN_EDGE} minEnd={MIN_WORKSPACE}
      onCommit={resize("left")} start={edgeView("left")} end={body}/>;
  }

  const dragTo=(id:string)=>({
    onStart:()=>{
      const rect=latest.current.layout.floating.find(f=>f.id===id)!.rect;
      store.setState({drag:{id,origin:undefined,from:rect,rect,target:undefined}});
    },
    onMove:(point:DragPoint)=>{
      const d=store.getState().drag;
      if(!d)return;
      if(!d.origin){store.setState({drag:{...d,origin:point}});return;}
      const rect={...d.from,x:d.from.x+point.x-d.origin.x,y:d.from.y+point.y-d.origin.y};
      const win=store.getState().window;
      const target=win?dockTargetAt({x:point.x-win.x,y:point.y-win.y},{width:win.width,height:win.height}):undefined;
      store.setState({drag:{...d,rect,target}});
    },
    onCommit:()=>{
      const d=store.getState().drag;
      store.setState({drag:undefined});
      if(!d)return;
      const p=latest.current;
      if(d.target&&d.target!=="floating")change(movePanel(p.layout,d.id,d.target,p.resolved));
      else change({...p.layout,floating:p.layout.floating.map(f=>f.id===d.id
        ?{id:f.id,rect:clampFloatingRect(d.rect,p.usableRegions??[{x:0,y:0,width:store.getState().width,height:store.getState().height}])}:f)});
    },
    onCancel:()=>store.setState({drag:undefined}),
  });

  const hint=drag?.target&&drag.target!=="floating"?drag.target:undefined;
  return <View {...rest} ref={host} onLayout={onHostLayout}
    {...{className:joinClasses("min-h-0 min-w-0",className)}} style={[{flex:1,direction:"ltr"},style]}>
    {width>0?body:null}
    {!compact?layout.floating.map(f=>{
      const panel=byId.get(f.id)!;
      const rect=drag?.id===f.id?drag.rect:f.rect;
      return <View key={f.id} accessibilityLabel={panel.title}
        {...{role:"region",className:joinClasses(styled&&"rounded-card border border-border bg-surface-raised")}}
        style={{position:"absolute",left:rect.x,top:rect.y,width:rect.width,height:rect.height,overflow:"hidden",
          boxShadow:styled?"0 8px 24px rgba(0,0,0,0.18)":undefined,...dir}}>
        <View {...{className:joinClasses(styled&&"border-b border-border")}}
          style={{flexDirection:"row",alignItems:"center",minHeight:44,paddingHorizontal:4}}>
          <DragGrabHandle label={"Move "+panel.title} {...dragTo(f.id)}/>
          <Pressable accessibilityRole="button" accessibilityLabel={"Bring "+panel.title+" to front"}
            onPress={()=>change(activatePanel(latest.current.layout,f.id))}
            style={{flex:1,minHeight:44,justifyContent:"center"}}>
            <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text text-sm font-semibold")}}>{panel.title}</Text>
          </Pressable>
          {menuFor(f.id,"floating",false)}
        </View>
        <View style={{flex:1}}>{panel.content}</View>
      </View>;
    }):null}
    {hint?<View pointerEvents="none" {...{className:joinClasses(styled&&"border-2 border-focus bg-primary/10")}}
      style={{position:"absolute",...(hint==="left"?{left:0,top:0,bottom:0,width:"20%"}
        :hint==="right"?{right:0,top:0,bottom:0,width:"20%"}:{left:0,right:0,bottom:0,height:"20%"})}}/>:null}
  </View>;
}

interface StackViewProps {
  ids:readonly string[];
  active:string;
  onActivate:(id:string)=>void;
  label:string;
  titleOf:(id:string)=>string;
  menu:ReactNode;
  children:ReactNode;
  styled:boolean;
  dir:{direction:"rtl"|"ltr"};
}
function StackView({ids,active,onActivate,label,titleOf,menu,children,styled,dir}:StackViewProps){
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const scroller=useRef<ComponentRef<typeof ScrollView>>(null);
  const offsets=useRef(new Map<string,{x:number;width:number}>());
  const viewport=useRef(0);
  const reveal=()=>{
    const at=offsets.current.get(active);
    if(at&&viewport.current)scroller.current?.scrollTo({x:Math.max(0,at.x+at.width-viewport.current),animated:false});
  };
  useEffect(reveal,[active]);
  const onKeyDown=(i:number)=>(event:unknown)=>{
    const k=shellKey(event);
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    const next=rovingTarget(i,k.key,ids.map(()=>false),"horizontal",dir.direction==="rtl");
    if(next===null)return;
    k.preventDefault();
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
    onActivate(ids[next]!);
  };
  return <View {...{className:joinClasses(styled&&"bg-surface-raised")}} style={{flex:1,minHeight:0,...dir}}>
    <View {...{className:joinClasses(styled&&"border-b border-border")}}
      style={{flexDirection:"row",alignItems:"center",minHeight:44,paddingHorizontal:4,gap:2}}>
      {/* A narrow stack scrolls its tabs instead of wrapping them under the menu. */}
      <ScrollView ref={scroller} horizontal showsHorizontalScrollIndicator={false} style={{flex:1}}
        onLayout={e=>{viewport.current=e.nativeEvent.layout.width;reveal();}}
        contentContainerStyle={{flexDirection:"row"}}>
      <View accessibilityRole="tablist" accessibilityLabel={label} style={{flexDirection:"row",gap:2}}>
        {ids.map((id,i)=>{
          const selected=id===active;
          return <Pressable key={id} ref={node=>{refs.current[i]=node;}} accessibilityRole="tab"
            onLayout={e=>{offsets.current.set(id,{x:e.nativeEvent.layout.x,width:e.nativeEvent.layout.width});if(id===active)reveal();}}
            accessibilityLabel={titleOf(id)} accessibilityState={{selected}} aria-selected={selected}
            onPress={()=>onActivate(id)}
            {...{onKeyDown:onKeyDown(i),tabIndex:selected?0:-1,
              className:joinClasses("min-h-11 justify-center px-3",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
                styled&&(selected?"bg-surface-sunken forced-colors:border-2 forced-colors:border-[Highlight]":"bg-transparent"))}}>
            <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm",styled&&(selected?"text-text font-semibold":"text-text-muted"))}}>{titleOf(id)}</Text>
          </Pressable>;
        })}
      </View>
      </ScrollView>
      {menu}
    </View>
    <View style={{flex:1,minHeight:0}}>{children}</View>
  </View>;
}

function OptionsGlyph({styled}:{styled:boolean}){
  return <View pointerEvents="none" style={{flexDirection:"row",gap:3}}>
    {[0,1,2].map(i=><View key={i} {...{className:joinClasses(styled&&"border-text-muted")}} style={{width:4,height:4,borderRadius:2,borderWidth:2}}/>)}
  </View>;
}
