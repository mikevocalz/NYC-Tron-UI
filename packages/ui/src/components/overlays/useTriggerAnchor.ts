import {useLayoutEffect,useRef,type ComponentRef,type RefObject} from "react";
import {useWindowDimensions,type View} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {measureAnchor} from "./measure-anchor.ts";
import type {Rect2D} from "./popover-position.ts";

/** What {@linkcode useTriggerAnchor} returns: the ref to put on the trigger wrapper and its last measured frame. */
export interface TriggerAnchor{
  readonly ref:RefObject<ComponentRef<typeof View>|null>;
  /** Window-space frame from the last measurement; `undefined` until the first open has been measured. */
  readonly anchor:Rect2D|undefined;
  /**
   * `true` once `anchor` was measured for the current open. It turns `false`
   * on close while `anchor` keeps its value, so a closing surface can stay
   * mounted long enough to return focus, and a reopen never shows the old frame.
   */
  readonly measured:boolean;
}
type AnchorState={anchor:Rect2D|undefined;measured:boolean};

/**
 * Measures the trigger each time a popover opens, so trigger-based popovers
 * never ask the app for a rect. A moved or resized trigger is measured again
 * on the next open.
 */
export function useTriggerAnchor(open:boolean,scope?:string,layoutRevision?:string):TriggerAnchor{
  const window=useWindowDimensions();
  const ref=useRef<ComponentRef<typeof View>|null>(null);
  const local=useRef<StoreApi<AnchorState>|null>(null);
  if(!local.current)local.current=createStore<AnchorState>(()=>({anchor:undefined,measured:false}));
  const store=local.current;
  const anchor=useStore(store,s=>s.anchor);
  const measured=useStore(store,s=>s.measured);
  const session=useRef<{open:boolean;scope:string|undefined}>({open:false,scope});
  useLayoutEffect(()=>{
    const fresh=!session.current.open||session.current.scope!==scope;session.current={open,scope};
    if(!open){store.setState({measured:false});return;}
    if(fresh)store.setState({measured:false});
    let live=true;
    void measureAnchor(ref.current).then(next=>{
      if(live&&next)store.setState({anchor:next,measured:true});
    });
    return ()=>{live=false;};
  },[open,scope,window.width,window.height,layoutRevision,store]);
  return {ref,anchor,measured};
}
