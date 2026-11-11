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
    async run<T>(id: string, operation: (signal: AbortSignal) => T | Promise<T>, consume?: (value: T) => void, options?: { pendingForAsyncOnly?: boolean }): Promise<boolean> {
      if (!active) return false;
      cancel();
      const request = { scope: currentScope(), abort: new AbortController() };
      current = request;
      const valid = () => active && current === request && request.scope === currentScope();
      if (options?.pendingForAsyncOnly) store.setState({ error: null });
      else store.setState({ pending: id, error: null });
      try {
        if (!valid()) return false;
        const result = operation(request.abort.signal);
        let value: T;
        if (options?.pendingForAsyncOnly) {
          if (result && typeof (result as Promise<T>).then === 'function') {
            // A synchronous acknowledgement or already-resolved promise must not
            // disable (and blur) the focused control between keyboard commands.
            let settled = false;
            const completion = Promise.resolve(result).then(value => { settled = true; return value; }, error => { settled = true; throw error; });
            void Promise.resolve().then(() => { if (!settled && valid()) store.setState({ pending: id, error: null }); });
            value = await completion;
          } else value = result as T;
        } else value = await result;
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
