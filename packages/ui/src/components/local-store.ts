/**
 * A per-instance store for transient gesture and draft state (a drag preview, a
 * text draft, a measured width). Components use it instead of `useState` so a
 * gesture's bookkeeping lives outside React's render cycle and can be read
 * synchronously from responder callbacks. Created by {@linkcode createLocalStore};
 * components use it through `useLocalStore`. Kept free of React so pure tests
 * can import it without an install.
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
