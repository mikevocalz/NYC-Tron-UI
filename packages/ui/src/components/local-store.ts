import {createStore} from "zustand/vanilla";

/**
 * A per-instance store for transient gesture and draft state (a drag preview, a
 * text draft, a measured width). Components use it instead of `useState` so a
 * gesture's bookkeeping lives outside React's render cycle and can be read
 * synchronously from responder callbacks. Created by {@linkcode createLocalStore};
 * components use it through `useLocalStore`. Zustand owns the state; this value-replacement
 * adapter remains independent of React.
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
  const store=createStore<{value:T}>(()=>({value:initial}));
  return {
    get:()=>store.getState().value,
    set(next){
      store.setState(current=>{
        const value=typeof next==="function"?(next as (p:T)=>T)(current.value):next;
        return Object.is(value,current.value)?current:{value};
      });
    },
    subscribe(listener){return store.subscribe(()=>listener());},
  };
}
