import {useRef,useSyncExternalStore} from "react";

/**
 * A per-instance store for transient gesture and draft state (a drag preview, a
 * text draft, a measured width). Components use it instead of `useState` so a
 * gesture's bookkeeping lives outside React's render cycle and can be read
 * synchronously from responder callbacks. Created by {@linkcode createLocalStore}.
 */
export interface LocalStore<T> {
  get():T;
  /** Replaces the state, or derives it from the previous state. Listeners run only when it changes. */
  set(next:T|((previous:T)=>T)):void;
  /** Returns the unsubscribe function. */
  subscribe(listener:()=>void):()=>void;
}

/** Creates a {@linkcode LocalStore}. Equal states (by `Object.is`) do not notify. */
export function createLocalStore<T>(initial:T):LocalStore<T>{
  let state=initial;
  const listeners=new Set<()=>void>();
  return {
    get:()=>state,
    set(next){
      const value=typeof next==="function"?(next as (p:T)=>T)(state):next;
      if(Object.is(value,state))return;
      state=value;
      for(const listener of [...listeners])listener();
    },
    subscribe(listener){
      listeners.add(listener);
      return ()=>{listeners.delete(listener);};
    },
  };
}

/**
 * Creates one {@linkcode LocalStore} for the calling component on first render and
 * subscribes to it. Returns the current state and the store.
 */
export function useLocalStore<T>(initial:()=>T):readonly [T,LocalStore<T>]{
  const ref=useRef<LocalStore<T>|null>(null);
  if(!ref.current)ref.current=createLocalStore(initial());
  const store=ref.current;
  const state=useSyncExternalStore(store.subscribe,store.get,store.get);
  return [state,store] as const;
}
