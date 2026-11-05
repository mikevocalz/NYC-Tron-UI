import type {DragPoint} from "./drag-transport.ts";

/** Callbacks for {@linkcode createDragController}. */
export interface DragControllerCallbacks {
  /** Read on every transition so a control that becomes disabled mid-drag cancels. */
  disabled:()=>boolean;
  start:()=>void;
  move:(point:DragPoint)=>void;
  commit:()=>void;
  cancel:()=>void;
}
/** Handle returned by {@linkcode createDragController}. */
export interface DragController {
  begin():void;
  move(point:DragPoint):void;
  /** Commits at most once per begin; a second release is ignored. */
  release():void;
  /** No-op when no drag is active. */
  cancel():void;
}
/**
 * Gesture lifecycle shared by drag handles: moves are previews, a release commits
 * exactly once, and cancellation or becoming disabled never commits.
 */
export function createDragController(callbacks:DragControllerCallbacks):DragController {
  let active=false;
  const cancel=()=>{
    if(!active)return;
    active=false;
    callbacks.cancel();
  };
  return {
    begin(){
      cancel();
      if(callbacks.disabled())return;
      active=true;
      callbacks.start();
    },
    move(point){
      if(!active)return;
      if(callbacks.disabled())cancel();
      else callbacks.move(point);
    },
    release(){
      if(!active)return;
      active=false;
      if(callbacks.disabled())callbacks.cancel();
      else callbacks.commit();
    },
    cancel,
  };
}
