import {useRef,useSyncExternalStore} from "react";
import {createLocalStore,type LocalStore} from "./local-store.ts";

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
