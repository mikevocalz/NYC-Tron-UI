import type {Rect2D} from "./popover-position.ts";

/** A host view that can report its frame in window coordinates (RN and RN web both can). */
export type MeasurableView={measureInWindow?:(callback:(x:number,y:number,width:number,height:number)=>void)=>void};

/**
 * Window-space frame of a mounted trigger view, for {@linkcode placePopover}.
 * Resolves `undefined` when the node is missing, cannot measure, or reports a
 * non-finite or negative frame (an unmounted or detached view), so callers
 * keep the popover closed instead of placing it at the window origin.
 */
export function measureAnchor(node:unknown):Promise<Rect2D|undefined>{
  const view=node as MeasurableView|null|undefined;
  if(!view||typeof view.measureInWindow!=="function")return Promise.resolve(undefined);
  return new Promise(resolve=>{
    view.measureInWindow!((x,y,width,height)=>{
      const ok=[x,y,width,height].every(Number.isFinite)&&width>=0&&height>=0;
      resolve(ok?{x,y,width,height}:undefined);
    });
  });
}

/**
 * The whole window as the single usable region. Only the default for
 * trigger-anchored popovers: on a foldable or dual-screen device the layout
 * owner passes its nonoccluded regions instead, and a hinge is never guessed
 * from width.
 */
export function windowRegions(width:number,height:number):readonly Rect2D[]{
  return [{x:0,y:0,width:Math.max(1,width),height:Math.max(1,height)}];
}
