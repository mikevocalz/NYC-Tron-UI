import {useEffect,useMemo,useRef} from "react";
import type {GestureResponderHandlers} from "react-native";
import {useLocalStore} from "../../useLocalStore.ts";
import type {LocalPoint} from "../../gestures/local-pointer.ts";
import {useLocalPointer} from "../../gestures/useLocalPointer.ts";
import {createValueGesture} from "../../gestures/value-gesture.ts";

/** Options for {@linkcode useFrameScrub}. */
export interface FrameScrubOptions {
  /** The committed frame. */
  readonly frame:number;
  /** Maps a view-local point to a whole frame. */
  readonly frameAt:(point:LocalPoint)=>number;
  readonly onScrub?:(frame:number)=>void;
  /** Once per release that changed the frame. */
  readonly onCommit:(frame:number)=>void;
  readonly disabled?:boolean;
  /**
   * Grab mode for handles: pressing does not move the frame, and a drag moves it
   * by the pointer's travel at this zoom. Without it the press jumps to
   * `frameAt` (a ruler or a seek track).
   */
  readonly grabPxPerFrame?:number;
  /** Clamp for grab mode. */
  readonly durationFrames?:number;
}
/** Returned by {@linkcode useFrameScrub}. */
export interface FrameScrub {
  readonly handlers:GestureResponderHandlers;
  /** The frame to draw: the scrub preview during a drag, else the committed frame. */
  readonly shown:number;
  readonly active:boolean;
  /** Restores the start frame (Escape). */
  cancel():void;
}

/**
 * Press-and-drag frame scrubbing for the seek bar, ruler, playhead and in/out
 * handles: the press jumps, moves preview through `onScrub`, release commits
 * once, and cancel restores the start frame through `onScrub`.
 */
export function useFrameScrub({frame,frameAt,onScrub,onCommit,disabled=false,grabPxPerFrame,durationFrames}:FrameScrubOptions):FrameScrub{
  const [preview,store]=useLocalStore(()=>undefined as number|undefined);
  const latest=useRef({frame,frameAt,onScrub,onCommit,disabled,grabPxPerFrame,durationFrames});
  latest.current={frame,frameAt,onScrub,onCommit,disabled,grabPxPerFrame,durationFrames};
  const grab=useRef({x0:0,frame0:0});
  const target=(p:LocalPoint)=>{
    const l=latest.current;
    if(l.grabPxPerFrame===undefined)return l.frameAt(p);
    const f=Math.round(grab.current.frame0+(p.x-grab.current.x0)/l.grabPxPerFrame);
    return Math.max(0,Math.min(l.durationFrames??Number.MAX_SAFE_INTEGER,f));
  };
  const gesture=useMemo(()=>createValueGesture<number>({
    disabled:()=>latest.current.disabled,
    equals:(a,b)=>a===b,
    preview:f=>{store.set(f);latest.current.onScrub?.(f);},
    commit:f=>latest.current.onCommit(f),
  }),[store]);
  useEffect(()=>()=>gesture.cancel(),[gesture]);
  const end=()=>store.set(undefined);
  const handlers=useLocalPointer({
    disabled,
    onBegin:p=>{
      grab.current={x0:p.x,frame0:latest.current.frame};
      gesture.begin(latest.current.frame);
      if(latest.current.grabPxPerFrame===undefined)gesture.update(target(p));
    },
    onMove:p=>gesture.update(target(p)),
    onRelease:()=>{gesture.release();end();},
    onCancel:()=>{gesture.cancel();end();},
  });
  return {handlers,shown:preview??frame,active:preview!==undefined,cancel:()=>{gesture.cancel();end();}};
}
