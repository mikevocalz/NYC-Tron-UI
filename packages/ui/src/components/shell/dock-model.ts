import type {Rect2D} from "../overlays/popover-position.ts";

/**
 * A docking edge of an {@linkcode AdaptiveDock}. Edges are physical: the app
 * mirrors left and right for right-to-left layouts if its product wants that.
 */
export type DockEdge="left"|"right"|"bottom";
/** Where a panel can be put: one of the edges, or floating over the workspace. */
export type DockTarget=DockEdge|"floating";

/** Panels stacked on one edge. Only the active one is shown; the others are tabs. */
export interface DockStack {
  readonly panels:readonly string[];
  readonly active:string;
  /** Width (left/right) or height (bottom) in points. */
  readonly size:number;
}
/** A panel floating over the workspace, in dock-local coordinates. */
export interface FloatingPanel {
  readonly id:string;
  readonly rect:Rect2D;
}
/**
 * Complete, serializable dock arrangement. The app owns it (and persists it
 * per workspace); {@linkcode AdaptiveDock} only renders it and proposes changes.
 */
export interface DockLayout {
  readonly left?:DockStack;
  readonly right?:DockStack;
  readonly bottom?:DockStack;
  readonly floating:readonly FloatingPanel[];
  /** Height of the merged panel stack on compact widths. */
  readonly compactSize?:number;
}
/** Defaults used when a panel lands on an empty edge or starts floating. */
export interface DockDefaults {
  readonly edgeSize:number;
  readonly floatingRect:Rect2D;
}

const EDGES:readonly DockEdge[]=["left","right","bottom"];

/** Every panel id in the layout, edges first, then floating panels. */
export function dockedPanelIds(layout:DockLayout):string[]{
  return [...EDGES.flatMap(e=>layout[e]?.panels??[]),...layout.floating.map(f=>f.id)];
}

/** Where a panel currently is, or undefined if the layout does not contain it. */
export function panelLocation(layout:DockLayout,id:string):DockTarget|undefined{
  for(const e of EDGES)if(layout[e]?.panels.includes(id))return e;
  return layout.floating.some(f=>f.id===id)?"floating":undefined;
}

/**
 * Throws when a panel appears twice, an active id is not in its stack, a stack
 * is empty, a size is not positive, or a referenced id is not in `known`.
 */
export function validateDockLayout(layout:DockLayout,known:readonly string[]):void{
  if(known.length>256||new Set(known).size!==known.length||known.some(id=>typeof id!=="string"||!id.trim()||id.length>256)||layout.floating.length>256)throw new RangeError("Invalid known dock panel identities or budget");
  if(layout.compactSize!==undefined&&(!Number.isFinite(layout.compactSize)||layout.compactSize<=0))throw new RangeError("Invalid compact dock size");
  const seen=new Set<string>();
  const knownIds=new Set(known);
  const add=(id:string)=>{
    if(seen.has(id))throw new TypeError(`Panel ${id} is docked twice`);
    if(!knownIds.has(id))throw new TypeError(`Unknown panel ${id}`);
    seen.add(id);
  };
  for(const e of EDGES){
    const stack=layout[e];
    if(!stack)continue;
    if(!stack.panels.length)throw new TypeError(`Empty ${e} dock stack`);
    if(!stack.panels.includes(stack.active))throw new TypeError(`Active panel ${stack.active} is not in the ${e} stack`);
    if(!Number.isFinite(stack.size)||stack.size<=0)throw new RangeError(`Invalid ${e} dock size`);
    stack.panels.forEach(add);
  }
  for(const f of layout.floating){
    const r=f.rect;
    if(![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<=0||r.height<=0)
      throw new RangeError(`Invalid floating rect for ${f.id}`);
    add(f.id);
  }
}

function without(layout:DockLayout,id:string):DockLayout{
  const next:{-readonly [K in keyof DockLayout]:DockLayout[K]}={...layout,floating:layout.floating.filter(f=>f.id!==id)};
  for(const e of EDGES){
    const stack=layout[e];
    if(!stack?.panels.includes(id))continue;
    const panels=stack.panels.filter(p=>p!==id);
    if(!panels.length){delete next[e];continue;}
    const at=stack.panels.indexOf(id);
    const active=stack.active===id?panels[Math.min(at,panels.length-1)]!:stack.active;
    next[e]={...stack,panels,active};
  }
  return next;
}

/**
 * Move a panel to `target`. On an edge it joins the end of that stack and
 * becomes active; floating, it keeps its old floating rect or takes
 * `defaults.floatingRect`. Moving a panel where it already is only activates it.
 */
export function movePanel(layout:DockLayout,id:string,target:DockTarget,defaults:DockDefaults):DockLayout{
  const from=panelLocation(layout,id);
  if(from===target)return target==="floating"?layout:activatePanel(layout,id);
  const previous=layout.floating.find(f=>f.id===id)?.rect;
  const rest=without(layout,id);
  if(target==="floating")return {...rest,floating:[...rest.floating,{id,rect:previous??defaults.floatingRect}]};
  const stack=rest[target];
  return {...rest,[target]:stack
    ?{...stack,panels:[...stack.panels,id],active:id}
    :{panels:[id],active:id,size:defaults.edgeSize}};
}

/** Show `id` in its stack. Floating panels are raised to the top. */
export function activatePanel(layout:DockLayout,id:string):DockLayout{
  const at=panelLocation(layout,id);
  if(at==="floating"){
    const panel=layout.floating.find(f=>f.id===id)!;
    return {...layout,floating:[...layout.floating.filter(f=>f.id!==id),panel]};
  }
  if(!at)return layout;
  const stack=layout[at]!;
  return stack.active===id?layout:{...layout,[at]:{...stack,active:id}};
}

/** Remove a panel from the layout. The app decides how a closed panel is reopened. */
export function closePanel(layout:DockLayout,id:string):DockLayout{
  return panelLocation(layout,id)?without(layout,id):layout;
}

/** Resize one edge stack. */
export function resizeStack(layout:DockLayout,edge:DockEdge,size:number):DockLayout{
  const stack=layout[edge];
  if(!stack||!Number.isFinite(size)||size<=0)return layout;
  return {...layout,[edge]:{...stack,size}};
}

/**
 * Drop target under a dock-local point: the outer `edgeFraction` of the width
 * docks left or right, the bottom fraction docks to the bottom, the rest
 * floats. Returns undefined outside the dock.
 */
export function dockTargetAt(point:{x:number;y:number},size:{width:number;height:number},edgeFraction=0.2):DockTarget|undefined{
  const {x,y}=point,{width,height}=size;
  if(![x,y,width,height,edgeFraction].every(Number.isFinite)||width<=0||height<=0)return undefined;
  if(x<0||y<0||x>width||y>height)return undefined;
  if(x<width*edgeFraction)return "left";
  if(x>width*(1-edgeFraction))return "right";
  if(y>height*(1-edgeFraction))return "bottom";
  return "floating";
}

/**
 * Keep a floating rect inside one usable region (from the foldable layout
 * owner), so it never spans a hinge. It stays in the region holding its
 * centre, or the largest one, and shrinks only if the region is smaller.
 */
export function clampFloatingRect(rect:Rect2D,regions:readonly Rect2D[]):Rect2D{
  const valid=regions.filter(r=>[r.x,r.y,r.width,r.height].every(Number.isFinite)&&r.width>0&&r.height>0);
  if(!valid.length)return rect;
  const cx=rect.x+rect.width/2,cy=rect.y+rect.height/2;
  const region=valid.find(r=>cx>=r.x&&cx<=r.x+r.width&&cy>=r.y&&cy<=r.y+r.height)
    ??valid.reduce((a,b)=>b.width*b.height>a.width*a.height?b:a);
  const width=Math.min(rect.width,region.width),height=Math.min(rect.height,region.height);
  return {
    x:Math.max(region.x,Math.min(region.x+region.width-width,rect.x)),
    y:Math.max(region.y,Math.min(region.y+region.height-height,rect.y)),
    width,height,
  };
}
