import type {FoldFeature,Rect} from "@nyc-tron/core/folds";

/**
 * Direction the panes of a {@linkcode PaneSplitter} are laid out in.
 * `horizontal` puts them side by side (the divider is a vertical line);
 * `vertical` stacks them (the divider is a horizontal line).
 */
export type SplitAxis="horizontal"|"vertical";

/** Size limits for a split, in points along the split axis. */
export interface SplitLimits {
  /** Length of the splitter along its axis. */
  readonly total:number;
  /** Smallest size the start pane may take. */
  readonly minStart:number;
  /** Smallest size the end pane may take. */
  readonly minEnd:number;
  /** Thickness of the divider when it is not seated on a hinge. */
  readonly divider:number;
}

/**
 * A hinge or fold that cuts across the split axis, as a span from the start
 * edge of the splitter. A zero-width separating fold has `start === end`.
 * @see {@linkcode hingeBands}
 */
export interface HingeBand {
  readonly start:number;
  readonly end:number;
}

/**
 * Resolved geometry for a split. When the divider is seated on a hinge it
 * spans the whole hinge, so neither pane draws under it.
 * @see {@linkcode resolveSplit}
 */
export interface SplitLayout {
  readonly startSize:number;
  readonly dividerStart:number;
  readonly dividerSize:number;
  readonly endStart:number;
  readonly endSize:number;
  /** Index into the bands the divider is seated on, or -1. */
  readonly hinge:number;
}

const finite=(...values:number[])=>values.every(Number.isFinite);

/**
 * Hinges that cross the split axis of a splitter whose window-space bounds are
 * `container`, as spans from its physical start edge (left or top). Only
 * separating or fully occluding features count, the same rule
 * `resolveUsableRegions` in `@nyc-tron/core/folds` applies.
 */
export function hingeBands(container:Rect,features:readonly FoldFeature[],axis:SplitAxis):HingeBand[]{
  if(!finite(container.x,container.y,container.width,container.height)||container.width<0||container.height<0)
    throw new RangeError("Invalid splitter container");
  const crossing=axis==="horizontal"?"vertical":"horizontal";
  const total=axis==="horizontal"?container.width:container.height;
  const bands:HingeBand[]=[];
  for(const f of features){
    const b=f.bounds;
    if(f.orientation!==crossing||(!f.separating&&f.occlusion==="none"))continue;
    if(!finite(b.x,b.y,b.width,b.height)||b.width<0||b.height<0)continue;
    const from=axis==="horizontal"?b.x-container.x:b.y-container.y;
    const span=axis==="horizontal"?b.width:b.height;
    const start=Math.max(0,from),end=Math.min(total,from+span);
    if(end<start||start>=total||end<=0)continue;
    bands.push({start,end});
  }
  return bands.sort((a,b)=>a.start-b.start);
}

/** Bands measured from the opposite edge, for a right-to-left horizontal split. */
export function mirrorBands(bands:readonly HingeBand[],total:number):HingeBand[]{
  return bands.map(b=>({start:total-b.end,end:total-b.start})).sort((a,b)=>a.start-b.start);
}

function layoutAt(startSize:number,dividerSize:number,total:number,hinge:number):SplitLayout{
  const endStart=startSize+dividerSize;
  return {startSize,dividerStart:startSize,dividerSize,endStart,endSize:Math.max(0,total-endStart),hinge};
}

/** The layout with the divider covering band `i`, or null if that breaks a minimum. */
function seat(band:HingeBand,i:number,limits:SplitLimits):SplitLayout|null{
  const width=band.end-band.start;
  const size=Math.max(limits.divider,width);
  const startSize=width>=limits.divider?band.start:(band.start+band.end)/2-limits.divider/2;
  const layout=layoutAt(startSize,size,limits.total,i);
  return layout.startSize>=limits.minStart&&layout.endSize>=limits.minEnd?layout:null;
}

/**
 * Clamp a requested start-pane size to the limits and keep the divider off any
 * hinge. A divider that would overlap a hinge, or lands within `snap` points
 * of one, is seated on it; if seating would break a minimum it moves to the
 * nearer side of the hinge instead.
 *
 * When the panes cannot both fit their minimums, the start pane keeps its
 * minimum and the end pane takes what is left.
 */
export function resolveSplit(requested:number,limits:SplitLimits,bands:readonly HingeBand[]=[],snap=0):SplitLayout{
  const {total,minStart,minEnd,divider}=limits;
  if(!finite(requested,total,minStart,minEnd,divider,snap)||total<0||minStart<0||minEnd<0||divider<0||snap<0)
    throw new RangeError("Invalid split");
  const lo=minStart,hi=total-minEnd-divider;
  if(hi<lo)return layoutAt(Math.max(0,Math.min(lo,total-divider)),divider,total,-1);
  const p=Math.max(lo,Math.min(hi,requested));
  for(let i=0;i<bands.length;i++){
    const band=bands[i]!;
    const seated=seat(band,i,limits);
    const overlaps=p<band.end&&p+divider>band.start;
    const near=seated!==null&&Math.abs(p-seated.dividerStart)<=snap;
    if(!overlaps&&!near)continue;
    if(seated)return seated;
    if(!overlaps)continue;
    const before=band.start-divider,after=band.end;
    const options=[before,after].filter(o=>o>=lo&&o<=hi);
    if(!options.length)break;
    const nearest=options.reduce((a,b)=>Math.abs(b-p)<Math.abs(a-p)?b:a);
    return layoutAt(nearest,divider,total,-1);
  }
  return layoutAt(p,divider,total,-1);
}

/**
 * Keyboard or screen-reader step from `current`. Moving off a seated hinge
 * jumps clear of it; moving into a hinge seats the divider on it.
 */
export function stepSplit(current:SplitLayout,direction:1|-1,step:number,limits:SplitLimits,bands:readonly HingeBand[]=[]):SplitLayout{
  if(!Number.isFinite(step)||step<=0)throw new RangeError("Invalid split step");
  const band=current.hinge>=0?bands[current.hinge]:undefined;
  if(band){
    const requested=direction>0?current.dividerStart+current.dividerSize+step:current.dividerStart-limits.divider-step;
    const next=resolveSplit(requested,limits,bands);
    if(next.hinge!==current.hinge)return next;
    return current;
  }
  return resolveSplit(current.startSize+direction*step,limits,bands);
}

/** Start-pane size for a controlled size measured on either pane. */
export function startSizeFor(size:number,edge:"start"|"end",limits:SplitLimits):number{
  return edge==="start"?size:limits.total-limits.divider-size;
}
/** The controlled size of the pane named by `edge` in a resolved layout. */
export function sizeForEdge(layout:SplitLayout,edge:"start"|"end"):number{
  return edge==="start"?layout.startSize:layout.endSize;
}
