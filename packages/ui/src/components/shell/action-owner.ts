import { createStore } from "zustand/vanilla";

/** UI request state. Abort controllers stay in the owner's closure. */
export interface ActionState { readonly pending: string | null; readonly error: string | null }
export function createActionOwner(currentScope: () => string) {
  const store = createStore<ActionState>(() => ({ pending: null, error: null }));
  let active = false;
  let current: { readonly scope: string; readonly abort: AbortController } | null = null;
  function cancel() {
    const previous = current; current = null;
    previous?.abort.abort();
  }
  return {
    store,
    activate() { cancel(); active = true; store.setState({ pending: null, error: null }); },
    deactivate() { active = false; cancel(); },
    cancel() { cancel(); store.setState({ pending: null }); },
    async run<T>(id: string, operation: (signal: AbortSignal) => T | Promise<T>, consume?: (value: T) => void): Promise<boolean> {
      if (!active) return false;
      cancel();
      const request = { scope: currentScope(), abort: new AbortController() };
      current = request;
      const valid = () => active && current === request && request.scope === currentScope();
      store.setState({ pending: id, error: null });
      try {
        if (!valid()) return false;
        const value = await operation(request.abort.signal);
        if (!valid()) return false;
        consume?.(value);
        if (!valid()) return false;
        store.setState({ pending: null });
        return true;
      } catch (error) {
        if (!valid()) return false;
        store.setState({ pending: null, error: error instanceof Error ? error.message : String(error) });
        return false;
      } finally { if (current === request) current = null; }
    },
  };
}
