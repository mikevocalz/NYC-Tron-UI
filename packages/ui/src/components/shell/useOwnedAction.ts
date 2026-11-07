import { useLayoutEffect, useRef } from "react";
import { useStore } from "zustand";
import { createActionOwner } from "./action-owner.ts";

/** Cancel stale requests at the committed document boundary, before new controls accept input. */
export function useOwnedAction(scope: string) {
  const committed = useRef(scope);
  const ref = useRef<ReturnType<typeof createActionOwner> | null>(null);
  ref.current ??= createActionOwner(() => committed.current);
  const owner = ref.current;
  useLayoutEffect(() => {
    committed.current = scope;
    owner.activate();
    return () => owner.deactivate();
  }, [owner, scope]);
  const state = useStore(owner.store, value => value);
  const run: typeof owner.run = (id, operation, consume, options) => committed.current === scope ? owner.run(id, operation, consume, options) : Promise.resolve(false);
  return { ...state, run, cancel: owner.cancel };
}
