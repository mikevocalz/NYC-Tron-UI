import type {FoldFeature, Rect} from "./folds.ts";

/**
 * Window lifecycle contract for multiwindow hosts. Pure TypeScript, no React,
 * no native code, no runtime or renderer dependencies.
 *
 * NOT IMPLEMENTED HERE: native multiwindow lifecycle. Nothing in this file
 * creates, shows, hides, resizes or destroys an OS window, listens to
 * UIScene, Android multi-instance or Windows AppWindow events, or reads display
 * geometry. A host adapter has to do that and feed the results in as plain
 * data. This module is the state machine such an adapter would drive, and it
 * has only been exercised by Node unit tests, not on a device or desktop.
 *
 * Shape of the contract:
 * - Every transition takes a state and returns a new {@linkcode Outcome}. The
 *   input state is never mutated. A rejected event returns the same state
 *   reference with `ok:false` and a {@linkcode RejectReason}.
 * - Drags between windows carry an opaque payload. The model never inspects or
 *   applies it. `dropDrag` produces an `offer`; the host decides, then calls
 *   `resolveDrop(state, token, accepted)`. Only an accepted resolve yields a
 *   `transfer`, and the host applies it to its own state.
 * - Each drag gets a request token (`drag-N`), in the spirit of
 *   `createActionOwner` in `@nyc-tron/ui`. Events with a token that is not the
 *   live drag's are rejected as `stale-token`, so a late pointer-up after a
 *   cancel, a close or a layout restore cannot complete anything.
 * - Layout snapshots are JSON-safe, exclude drag state, and restore onto any
 *   display set: rects are clamped into display bounds and moved off reserved
 *   regions (hinges, occluding folds). A window moved off a vanished display
 *   remembers its `home` and returns when that display reappears.
 */

export type WindowStatus="open"|"minimized";

/** Where a window lived before it was moved off a display that disappeared. */
export interface WindowHome {
  readonly displayId:string;
  readonly rect:Rect;
}
export interface WindowRecord {
  readonly id:string;
  readonly displayId:string;
  readonly rect:Rect;
  readonly status:WindowStatus;
  readonly home?:WindowHome;
}
export interface DragSession {
  readonly token:string;
  readonly sourceId:string;
  /** Hovered window, or null. Cleared when that window closes or minimizes. */
  readonly targetId:string|null;
  /** `dragging` until `dropDrag`, then `dropping` until the host resolves. */
  readonly phase:"dragging"|"dropping";
  /** Opaque to this module. Passed through by reference. */
  readonly payload:unknown;
}
export interface WindowRegistryState {
  /** Z-order, bottom to top. */
  readonly windows:readonly WindowRecord[];
  /** An open window, or null. Never a minimized one. */
  readonly focusedId:string|null;
  readonly drag:DragSession|null;
  /** Last issued drag token number. */
  readonly tokenSeq:number;
}

export type RejectReason=
  |"invalid-id"|"invalid-rect"|"duplicate-id"|"budget"
  |"unknown-window"|"minimized"|"already-minimized"|"not-minimized"
  |"drag-active"|"stale-token"|"wrong-phase"|"invalid-target";

export interface DragOffer {
  readonly sourceId:string;
  readonly targetId:string;
  readonly payload:unknown;
}
export interface Outcome {
  readonly state:WindowRegistryState;
  readonly ok:boolean;
  readonly reason?:RejectReason;
  /** Set by `beginDrag`. */
  readonly token?:string;
  /** Set by `dropDrag`: what the host should accept or refuse. */
  readonly offer?:DragOffer;
  /** Set by `resolveDrop` when the host accepted. */
  readonly transfer?:DragOffer;
  /** Set by `resolveDrop`: the host's verdict. */
  readonly accepted?:boolean;
  /** Set when a close or minimize cancelled the live drag. */
  readonly cancelledToken?:string;
}

export interface OpenWindowSpec {
  readonly id:string;
  readonly displayId:string;
  readonly rect:Rect;
}

/** Hard cap on windows, matching the 256 budget in `validateDockLayout`. */
export const MAX_WINDOWS=256;
const MAX_ID=256;
/** Reserved regions considered per display; extras are ignored to bound work. */
const MAX_RESERVED=32;

const reject=(state:WindowRegistryState,reason:RejectReason):Outcome=>({state,ok:false,reason});
const validId=(id:unknown):id is string=>typeof id==="string"&&id.trim().length>0&&id.length<=MAX_ID;
const validRect=(r:unknown):r is Rect=>{
  if(typeof r!=="object"||r===null)return false;
  const v=r as Rect;
  return [v.x,v.y,v.width,v.height].every(n=>typeof n==="number"&&Number.isFinite(n))&&v.width>0&&v.height>0;
};
const copyRect=(r:Rect):Rect=>({x:r.x,y:r.y,width:r.width,height:r.height});
const rectEq=(a:Rect,b:Rect)=>a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height;
const homeEq=(a:WindowHome|undefined,b:WindowHome|undefined)=>
  a===b||(!!a&&!!b&&a.displayId===b.displayId&&rectEq(a.rect,b.rect));

export function createWindowRegistry():WindowRegistryState{
  return {windows:[],focusedId:null,drag:null,tokenSeq:0};
}

function topOpen(windows:readonly WindowRecord[]):string|null{
  for(let i=windows.length-1;i>=0;i--)if(windows[i].status==="open")return windows[i].id;
  return null;
}
function raise(windows:readonly WindowRecord[],id:string):WindowRecord[]{
  const w=windows.find(x=>x.id===id)!;
  return [...windows.filter(x=>x.id!==id),w];
}
/** What a window disappearing (close or minimize) does to the live drag. */
function dragAfterGone(drag:DragSession|null,id:string):{drag:DragSession|null;cancelled:boolean}{
  if(!drag)return {drag:null,cancelled:false};
  if(drag.sourceId===id)return {drag:null,cancelled:true};
  if(drag.targetId===id){
    if(drag.phase==="dropping")return {drag:null,cancelled:true};
    return {drag:{...drag,targetId:null},cancelled:false};
  }
  return {drag,cancelled:false};
}

/** Opens a window on top and focuses it. Ids are unique, even against minimized windows. */
export function openWindow(state:WindowRegistryState,spec:OpenWindowSpec):Outcome{
  if(!spec||!validId(spec.id)||!validId(spec.displayId))return reject(state,"invalid-id");
  if(!validRect(spec.rect))return reject(state,"invalid-rect");
  if(state.windows.some(w=>w.id===spec.id))return reject(state,"duplicate-id");
  if(state.windows.length>=MAX_WINDOWS)return reject(state,"budget");
  const record:WindowRecord={id:spec.id,displayId:spec.displayId,rect:copyRect(spec.rect),status:"open"};
  return {state:{...state,windows:[...state.windows,record],focusedId:record.id},ok:true};
}

export function focusWindow(state:WindowRegistryState,id:string):Outcome{
  const w=state.windows.find(x=>x.id===id);
  if(!w)return reject(state,"unknown-window");
  if(w.status==="minimized")return reject(state,"minimized");
  return {state:{...state,windows:raise(state.windows,id),focusedId:id},ok:true};
}

export function closeWindow(state:WindowRegistryState,id:string):Outcome{
  if(!state.windows.some(x=>x.id===id))return reject(state,"unknown-window");
  const windows=state.windows.filter(x=>x.id!==id);
  const gone=dragAfterGone(state.drag,id);
  const focusedId=state.focusedId===id?topOpen(windows):state.focusedId;
  return {
    state:{...state,windows,focusedId,drag:gone.drag},ok:true,
    ...(gone.cancelled&&state.drag?{cancelledToken:state.drag.token}:{}),
  };
}

export function minimizeWindow(state:WindowRegistryState,id:string):Outcome{
  const w=state.windows.find(x=>x.id===id);
  if(!w)return reject(state,"unknown-window");
  if(w.status==="minimized")return reject(state,"already-minimized");
  const windows=state.windows.map(x=>x.id===id?{...x,status:"minimized" as const}:x);
  const gone=dragAfterGone(state.drag,id);
  const focusedId=state.focusedId===id?topOpen(windows):state.focusedId;
  return {
    state:{...state,windows,focusedId,drag:gone.drag},ok:true,
    ...(gone.cancelled&&state.drag?{cancelledToken:state.drag.token}:{}),
  };
}

/** Restores a minimized window to the top and focuses it. */
export function restoreWindow(state:WindowRegistryState,id:string):Outcome{
  const w=state.windows.find(x=>x.id===id);
  if(!w)return reject(state,"unknown-window");
  if(w.status!=="minimized")return reject(state,"not-minimized");
  const windows=raise(state.windows.map(x=>x.id===id?{...x,status:"open" as const}:x),id);
  return {state:{...state,windows,focusedId:id},ok:true};
}

/** Host-reported move. Clears `home`: the user chose this place. */
export function moveWindow(state:WindowRegistryState,id:string,to:{readonly displayId:string;readonly rect:Rect}):Outcome{
  const w=state.windows.find(x=>x.id===id);
  if(!w)return reject(state,"unknown-window");
  if(!to||!validId(to.displayId))return reject(state,"invalid-id");
  if(!validRect(to.rect))return reject(state,"invalid-rect");
  const next:WindowRecord={id:w.id,displayId:to.displayId,rect:copyRect(to.rect),status:w.status};
  return {state:{...state,windows:state.windows.map(x=>x.id===id?next:x)},ok:true};
}

// Drag ---------------------------------------------------------------

function liveDrag(state:WindowRegistryState,token:unknown):RejectReason|null{
  return state.drag&&typeof token==="string"&&state.drag.token===token?null:"stale-token";
}
function validTarget(state:WindowRegistryState,drag:DragSession,targetId:unknown):targetId is string{
  if(typeof targetId!=="string"||targetId===drag.sourceId)return false;
  return state.windows.some(w=>w.id===targetId&&w.status==="open");
}

/** Starts a drag from an open window. One drag at a time; cancel the old one first. */
export function beginDrag(state:WindowRegistryState,input:{readonly sourceId:string;readonly payload:unknown}):Outcome{
  if(state.drag)return reject(state,"drag-active");
  const source=state.windows.find(w=>w.id===input?.sourceId);
  if(!source)return reject(state,"unknown-window");
  if(source.status==="minimized")return reject(state,"minimized");
  const tokenSeq=state.tokenSeq+1;
  const token=`drag-${tokenSeq}`;
  const drag:DragSession={token,sourceId:source.id,targetId:null,phase:"dragging",payload:input.payload};
  return {state:{...state,tokenSeq,drag},ok:true,token};
}

/**
 * Updates the hovered window. A target that cannot take a drop (null, unknown,
 * minimized, or the source) clears the hover and still returns `ok:true`; read
 * `state.drag.targetId` for what to highlight.
 */
export function dragOver(state:WindowRegistryState,token:string|undefined,targetId:string|null):Outcome{
  const stale=liveDrag(state,token);
  if(stale)return reject(state,stale);
  const drag=state.drag!;
  if(drag.phase!=="dragging")return reject(state,"wrong-phase");
  const next=validTarget(state,drag,targetId)?targetId:null;
  if(next===drag.targetId)return {state,ok:true};
  return {state:{...state,drag:{...drag,targetId:next}},ok:true};
}

/**
 * Ends the pointer phase over `targetId` and hands an `offer` to the host. The
 * drag stays live in `dropping` until `resolveDrop` or `cancelDrag`. An invalid
 * target is rejected and leaves the drag running, so the host can cancel it.
 */
export function dropDrag(state:WindowRegistryState,token:string|undefined,targetId:string|null):Outcome{
  const stale=liveDrag(state,token);
  if(stale)return reject(state,stale);
  const drag=state.drag!;
  if(drag.phase!=="dragging")return reject(state,"wrong-phase");
  if(!validTarget(state,drag,targetId))return reject(state,"invalid-target");
  const next:DragSession={...drag,targetId,phase:"dropping"};
  return {state:{...state,drag:next},ok:true,offer:{sourceId:drag.sourceId,targetId,payload:drag.payload}};
}

/**
 * Host verdict on a pending drop. Accepted: returns a `transfer` for the host
 * to apply and raises the target. Refused: ends the drag with no transfer.
 */
export function resolveDrop(state:WindowRegistryState,token:string|undefined,accepted:boolean):Outcome{
  const stale=liveDrag(state,token);
  if(stale)return reject(state,stale);
  const drag=state.drag!;
  if(drag.phase!=="dropping"||drag.targetId===null)return reject(state,"wrong-phase");
  if(!accepted)return {state:{...state,drag:null},ok:true,accepted:false};
  const targetId=drag.targetId;
  return {
    state:{...state,windows:raise(state.windows,targetId),focusedId:targetId,drag:null},ok:true,accepted:true,
    transfer:{sourceId:drag.sourceId,targetId,payload:drag.payload},
  };
}

/** Cancels the live drag in either phase (Escape, focus loss, pointer cancel). */
export function cancelDrag(state:WindowRegistryState,token:string|undefined):Outcome{
  const stale=liveDrag(state,token);
  if(stale)return reject(state,stale);
  return {state:{...state,drag:null},ok:true};
}

// Persistence ----------------------------------------------------------

/** A display as the host reports it, in one shared logical coordinate space. */
export interface DisplayInfo {
  readonly id:string;
  readonly bounds:Rect;
  /** Hinge and occluding-fold rects inside `bounds`. See {@linkcode reservedFromFolds}. */
  readonly reserved?:readonly Rect[];
  /** Fallback display for windows whose display is gone. Defaults to the first. */
  readonly primary?:boolean;
}

/**
 * Rects a window must not cross: folds that occlude, and separating folds
 * (including zero-width ones). Non-separating, non-occluding creases are skipped
 * because a window may span them.
 */
export function reservedFromFolds(features:readonly FoldFeature[]):Rect[]{
  return features.filter(f=>f.occlusion==="full"||f.separating).map(f=>copyRect(f.bounds));
}

export interface SnapshotWindow {
  readonly id:string;
  readonly displayId:string;
  readonly rect:Rect;
  readonly status:WindowStatus;
  readonly home?:WindowHome;
}
export interface LayoutSnapshot {
  readonly version:1;
  /** Z-order, bottom to top. */
  readonly windows:readonly SnapshotWindow[];
  readonly focusedId:string|null;
}

/** JSON-safe copy of the layout. Drag state and tokens are not persisted. */
export function snapshotLayout(state:WindowRegistryState):LayoutSnapshot{
  return {
    version:1,
    windows:state.windows.map(w=>({
      id:w.id,displayId:w.displayId,rect:copyRect(w.rect),status:w.status,
      ...(w.home?{home:{displayId:w.home.displayId,rect:copyRect(w.home.rect)}}:{}),
    })),
    focusedId:state.focusedId,
  };
}

/**
 * Validates untrusted persisted data. Returns null for anything malformed
 * (wrong version, duplicate ids, non-finite rects, unknown or minimized
 * focused window, more than 256 windows) instead of repairing it.
 */
export function parseLayoutSnapshot(value:unknown):LayoutSnapshot|null{
  if(typeof value!=="object"||value===null||Array.isArray(value))return null;
  const v=value as {version?:unknown;windows?:unknown;focusedId?:unknown};
  if(v.version!==1||!Array.isArray(v.windows)||v.windows.length>MAX_WINDOWS)return null;
  const seen=new Set<string>();
  const windows:SnapshotWindow[]=[];
  for(const raw of v.windows as unknown[]){
    if(typeof raw!=="object"||raw===null)return null;
    const w=raw as {id?:unknown;displayId?:unknown;rect?:unknown;status?:unknown;home?:unknown};
    if(!validId(w.id)||!validId(w.displayId)||!validRect(w.rect)||seen.has(w.id))return null;
    if(w.status!=="open"&&w.status!=="minimized")return null;
    seen.add(w.id);
    let home:WindowHome|undefined;
    if(w.home!==undefined){
      const h=w.home as {displayId?:unknown;rect?:unknown}|null;
      if(typeof h!=="object"||h===null||!validId(h.displayId)||!validRect(h.rect))return null;
      home={displayId:h.displayId,rect:copyRect(h.rect)};
    }
    windows.push({id:w.id,displayId:w.displayId,rect:copyRect(w.rect),status:w.status,...(home?{home}:{})});
  }
  let focusedId:string|null=null;
  if(v.focusedId!==null&&v.focusedId!==undefined){
    const f=windows.find(w=>w.id===v.focusedId);
    if(!f||f.status!=="open")return null;
    focusedId=f.id;
  }
  return {version:1,windows,focusedId};
}

function checkDisplays(displays:readonly DisplayInfo[]):void{
  if(!Array.isArray(displays)||displays.length===0)throw new RangeError("At least one display is required");
  const seen=new Set<string>();
  for(const d of displays){
    if(!d||!validId(d.id)||!validRect(d.bounds))throw new RangeError("Invalid display");
    if(seen.has(d.id))throw new RangeError(`Duplicate display ${d.id}`);
    seen.add(d.id);
  }
}

const clamp=(v:number,lo:number,hi:number)=>hi<lo?lo:Math.min(Math.max(v,lo),hi);
/** Shrinks `r` to fit `area` if needed, then shifts it inside. */
function fit(r:Rect,area:Rect):Rect{
  const width=Math.min(r.width,area.width),height=Math.min(r.height,area.height);
  return {
    x:clamp(r.x,area.x,area.x+area.width-width),
    y:clamp(r.y,area.y,area.y+area.height-height),
    width,height,
  };
}
/** Strict overlap: touching an edge is fine, crossing a zero-width fold is not. */
const crosses=(a:Rect,b:Rect)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;
const dist=(a:Rect,b:Rect)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);

/**
 * Clamps `r` into the display, then moves it off reserved regions: to the
 * nearest position that clears them, else shrunk into the largest clear strip,
 * else (reserved regions leave no room) just clamped.
 */
function place(r:Rect,display:DisplayInfo):Rect{
  const b=display.bounds;
  const base=fit(r,b);
  const reserved=(display.reserved??[]).filter(x=>validRectOrZero(x)).slice(0,MAX_RESERVED);
  if(!reserved.some(x=>crosses(base,x)))return base;
  const clear=(c:Rect)=>!reserved.some(x=>crosses(c,x));

  // Candidate x and y positions come from every reserved edge, so a window
  // pinned by a vertical and a horizontal fold can move on both axes.
  const xs=[base.x],ys=[base.y];
  for(const x of reserved){
    xs.push(x.x-base.width,x.x+x.width);
    ys.push(x.y-base.height,x.y+x.height);
  }
  let best:Rect|null=null;
  for(const cx of xs)for(const cy of ys){
    const c=fit({...base,x:cx,y:cy},b);
    if(clear(c)&&(best===null||dist(c,base)<dist(best,base)))best=c;
  }
  if(best)return best;

  const right=b.x+b.width,bottom=b.y+b.height;
  let strip:Rect|null=null,stripArea=-1,stripDist=0;
  for(const x of reserved){
    const strips:Rect[]=[
      {x:b.x,y:b.y,width:Math.min(x.x,right)-b.x,height:b.height},
      {x:Math.max(x.x+x.width,b.x),y:b.y,width:right-Math.max(x.x+x.width,b.x),height:b.height},
      {x:b.x,y:b.y,width:b.width,height:Math.min(x.y,bottom)-b.y},
      {x:b.x,y:Math.max(x.y+x.height,b.y),width:b.width,height:bottom-Math.max(x.y+x.height,b.y)},
    ];
    for(const s of strips){
      if(!(s.width>0&&s.height>0))continue;
      const c=fit(base,s);
      if(!clear(c))continue;
      const area=c.width*c.height,d=dist(c,base);
      if(area>stripArea||(area===stripArea&&d<stripDist)){strip=c;stripArea=area;stripDist=d}
    }
  }
  return strip??base;
}
const validRectOrZero=(r:Rect)=>
  !!r&&[r.x,r.y,r.width,r.height].every(n=>Number.isFinite(n))&&r.width>=0&&r.height>=0;

export interface ReflowResult {
  readonly state:WindowRegistryState;
  /** Ids whose display, rect or home changed, in z-order. */
  readonly relocated:readonly string[];
}

/**
 * Fits every window to the current displays. Use it after a display is added,
 * removed or resized, and after loading a snapshot. A window goes to its home
 * display if that exists again, else to its own display, else to the primary
 * one. Returns the same state reference when nothing moves. Throws RangeError
 * for an empty list, an invalid display or duplicate display ids.
 */
export function reflowWindows(state:WindowRegistryState,displays:readonly DisplayInfo[]):ReflowResult{
  checkDisplays(displays);
  const byId=new Map(displays.map(d=>[d.id,d]));
  const primary=displays.find(d=>d.primary)??displays[0];
  const relocated:string[]=[];
  const windows=state.windows.map(w=>{
    const origin:WindowHome=w.home??{displayId:w.displayId,rect:w.rect};
    const home=byId.get(origin.displayId);
    const display=home??primary;
    const rect=place(origin.rect,display);
    const nextHome=home?undefined:origin;
    if(w.displayId===display.id&&rectEq(w.rect,rect)&&homeEq(w.home,nextHome))return w;
    relocated.push(w.id);
    const next:WindowRecord={id:w.id,displayId:display.id,rect,status:w.status,...(nextHome?{home:nextHome}:{})};
    return next;
  });
  if(relocated.length===0)return {state,relocated};
  return {state:{...state,windows},relocated};
}

/**
 * Builds registry state from a snapshot and fits it to `displays`. Pass the
 * previous state (if any) so drag tokens keep counting up and tokens issued
 * before the restore stay stale. The restored state never has a live drag.
 * Throws TypeError for an invalid snapshot, RangeError for invalid displays.
 */
export function restoreLayout(snapshot:LayoutSnapshot,displays:readonly DisplayInfo[],previous?:WindowRegistryState):ReflowResult{
  const parsed=parseLayoutSnapshot(snapshot);
  if(!parsed)throw new TypeError("Invalid window layout snapshot");
  const base:WindowRegistryState={
    windows:parsed.windows.map(w=>({...w})),
    focusedId:parsed.focusedId,
    drag:null,
    tokenSeq:previous?.tokenSeq??0,
  };
  return reflowWindows(base,displays);
}
