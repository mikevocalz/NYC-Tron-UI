import {
  closeWindow, openWindow, moveWindow, minimizeWindow, restoreWindow, focusWindow,
  snapshotLayout, restoreLayout as planRestore,
  beginDrag, dragOver, dropDrag, resolveDrop, cancelDrag, type Outcome,
} from "@nyc-tron/core/window-lifecycle";
import type { Rect } from "@nyc-tron/core/folds";
import { createNativeDragController, type WindowsNativeDragTransport } from "./native-drag-controller.ts";
import { parseDesktopSnapshot, validWindowId, validWindowRect, convertDesktopLayout } from "./window-protocol.ts";
import type {
  WindowsCloseRequest, WindowsDesktopSnapshot, WindowsWindowHost,
  WindowsWindowHostOptions, WindowsDesktopLayout, WindowsOpenWindow,
} from "./window-types.ts";

/** Native transport injected by the real RNW adapter; also used by lifecycle tests. */
export interface WindowsDesktopTransport extends WindowsNativeDragTransport {
  connect(primaryWindowId: string, componentName: string): Promise<string>;
  read(ownerToken: string): Promise<string>;
  open(ownerToken: string, request: string): Promise<string>;
  move(ownerToken: string, id: string, request: string): Promise<string>;
  focus(ownerToken: string, id: string): Promise<string>;
  minimize(ownerToken: string, id: string): Promise<string>;
  restore(ownerToken: string, id: string): Promise<string>;
  requestClose(ownerToken: string, id: string): Promise<string>;
  resolveClose(ownerToken: string, id: string, generation: string, token: string, accepted: boolean): Promise<string>;
  dispose(ownerToken: string): Promise<void>;
  onSnapshot(listener: (json: string) => void): { remove(): void };
  onError(listener: (message: string) => void): { remove(): void };
}

/** Connect native observations to the app's existing core registry without owning its documents. */
export async function connectWindowsWindowHost(transport: WindowsDesktopTransport, options: WindowsWindowHostOptions): Promise<WindowsWindowHost> {
  if (!validWindowId(options.primaryWindowId) || !validWindowId(options.componentName))
    throw new TypeError("Primary window and registered component names must be nonempty");
  if (options.owner.getState().windows.length !== 0)
    throw new Error("A new native desktop connection requires an empty app window registry");
  let current: WindowsDesktopSnapshot | undefined;
  let disposed = false;
  let disposing: Promise<void> | undefined;
  let queued: Promise<unknown> = Promise.resolve();
  const seenCloses = new Set<string>();
  const early: WindowsDesktopSnapshot[] = [];
  const report = (error: unknown) => {
    const value = error instanceof Error ? error : new Error(String(error));
    if (options.onError) options.onError(value); else console.error(value);
  };
  const requireLive = () => { if (disposed || disposing) throw new Error("Windows window host has been disposed"); };
  const snapshot = () => {
    if (!current) throw new Error("Windows window host is not connected");
    return current;
  };
  const nativeDrag = createNativeDragController(transport, { snapshot, getState: () => options.owner.getState(), commit: state => options.owner.commit(state), isLive: () => !disposed && !disposing, report });
  const sameGeometry = (a: { displayId: string; rect: Rect }, b: { displayId: string; rect: Rect }) =>
    a.displayId === b.displayId && a.rect.x === b.rect.x && a.rect.y === b.rect.y && a.rect.width === b.rect.width && a.rect.height === b.rect.height;
  function observe(next: WindowsDesktopSnapshot) {
    if (disposed || (current && (next.ownerToken !== current.ownerToken || next.sequence <= current.sequence))) return;
    let state = options.owner.getState();
    for (const previous of state.windows) {
      const observed = next.windows.find(w => w.id === previous.id);
      const generation = current?.windows.find(w => w.id === previous.id)?.generation;
      if (!observed || (generation !== undefined && generation !== observed.generation)) state = closeWindow(state, previous.id).state;
    }
    for (const window of next.windows) {
      const prior = state.windows.find(w => w.id === window.id);
      // Focus/status echoes do not discard a disconnected display's remembered home.
      const transition: Outcome = prior ? sameGeometry(prior, window) ? { ok: true, state } : moveWindow(state, window.id, window) : openWindow(state, window);
      if (!transition.ok) throw new Error(`Native window observation rejected: ${transition.reason}`);
      state = transition.state;
      if (window.status === "minimized") state = minimizeWindow(state, window.id).state;
      else if (prior?.status === "minimized") state = restoreWindow(state, window.id).state;
    }
    state = next.focusedId === null ? { ...state, focusedId: null } : focusWindow(state, next.focusedId).state;
    current = next;
    options.owner.commit(state);
    const pending = new Set(next.pendingCloses.map(r => r.token));
    for (const token of seenCloses) if (!pending.has(token)) seenCloses.delete(token);
    for (const request of next.pendingCloses) {
      if (seenCloses.has(request.token)) continue;
      seenCloses.add(request.token);
      try { options.onCloseRequested(request); } catch (error) { report(error); }
    }
  }
  const updates = transport.onSnapshot(json => {
    try {
      const next = parseDesktopSnapshot(json);
      if (!current) { if (early.length >= 256) throw new Error("Desktop connection exceeded its event budget"); early.push(next); }
      else observe(next);
    } catch (error) { report(error); }
  });
  const errors = transport.onError(message => { if (!disposed) report(new Error(message)); });
  try {
    observe(parseDesktopSnapshot(await transport.connect(options.primaryWindowId, options.componentName)));
    for (const next of early) observe(next);
    early.length = 0;
  } catch (error) {
    updates.remove(); errors.remove(); nativeDrag.detach(); disposed = true;
    if (current) await transport.dispose(current.ownerToken).catch(report);
    throw error;
  }
  function command(work: () => Promise<string>): Promise<WindowsDesktopSnapshot> {
    requireLive();
    const operation = queued.then(async () => {
      if (disposed) throw new Error("Windows window host has been disposed");
      observe(parseDesktopSnapshot(await work())); return snapshot();
    });
    queued = operation.catch(() => undefined);
    return operation;
  }
  const known = (id: string) => {
    if (!snapshot().windows.some(w => w.id === id)) throw new Error(`Window is not owned by this connection: ${id}`);
    return id;
  };
  const token = () => snapshot().ownerToken;
  const apply = (outcome: Outcome) => { if (outcome.ok) options.owner.commit(outcome.state); return outcome; };
  return {
    snapshot,
    refresh: () => command(() => transport.read(token())),
    async open(spec: WindowsOpenWindow) {
      if (!validWindowId(spec.id) || !validWindowId(spec.displayId) || typeof spec.title !== "string" || spec.title.length > 1024 || !validWindowRect(spec.rect))
        throw new TypeError("Invalid native window name, title, or bounds");
      const id = spec.id;
      const request = JSON.stringify(spec); // Capture caller-owned data before queueing.
      const next = await command(() => transport.open(token(), request));
      const window = next.windows.find(w => w.id === id);
      if (!window) throw new Error("Native window closed before its open operation completed");
      return window;
    },
    async move(id: string, target: { readonly displayId: string; readonly rect: Rect }) {
      if (!validWindowId(target.displayId) || !validWindowRect(target.rect)) throw new TypeError("Invalid target display or bounds");
      const request = JSON.stringify(target);
      await command(() => transport.move(token(), known(id), request));
    },
    async focus(id) { await command(() => transport.focus(token(), known(id))); },
    async minimize(id) { await command(() => transport.minimize(token(), known(id))); },
    async restore(id) { await command(() => transport.restore(token(), known(id))); },
    async requestClose(id) { await command(() => transport.requestClose(token(), known(id))); },
    async resolveClose(request: WindowsCloseRequest, accepted: boolean) {
      const { id, generation, token: closeToken } = request;
      await command(() => transport.resolveClose(token(), id, generation, closeToken, accepted));
    },
    captureLayout: (): WindowsDesktopLayout => ({ schema: 1, referenceDpi: snapshot().referenceDpi, layout: snapshotLayout(options.owner.getState()) }),
    async restoreLayout(value) {
      // Validate the complete plan before moving any native surface. Existing app sessions are reused.
      const layout = convertDesktopLayout(value, snapshot().referenceDpi);
      if (layout.windows.length !== snapshot().windows.length || layout.windows.some(w => !snapshot().windows.some(n => n.id === w.id)))
        throw new Error("Layout restore must name exactly the existing native windows");
      const plan = planRestore(layout, snapshot().displays, options.owner.getState()).state;
      await command(async () => {
        // Restoring layout invalidates transfers issued before that restore, even if an OS move later fails.
        const before = options.owner.getState();
        if (before.drag) await nativeDrag.cancel(before.drag.token);
        options.owner.commit({ ...options.owner.getState(), drag: null });
        for (const window of plan.windows) {
          observe(parseDesktopSnapshot(await transport.move(token(), known(window.id), JSON.stringify({ displayId: window.displayId, rect: window.rect, raise: true }))));
          if (window.home) {
            const observedState = options.owner.getState();
            options.owner.commit({ ...observedState, windows: observedState.windows.map(w => w.id === window.id ? { ...w, home: window.home } : w) });
          }
          observe(parseDesktopSnapshot(await (window.status === "minimized" ? transport.minimize(token(), window.id) : transport.restore(token(), window.id))));
        }
        if (plan.focusedId) observe(parseDesktopSnapshot(await transport.focus(token(), plan.focusedId)));
        const final = await transport.read(token());
        observe(parseDesktopSnapshot(final));
        // Every native raise above succeeded. Preserve this replayed order,
        // keeping the actually observed foreground window on top.
        const observedState = options.owner.getState();
        const ordered = plan.windows.map(w => observedState.windows.find(actual => actual.id === w.id)).filter(w => w !== undefined);
        const replayed = { ...observedState, windows: [...ordered, ...observedState.windows.filter(w => !plan.windows.some(saved => saved.id === w.id))] };
        options.owner.commit(replayed.focusedId === null ? replayed : focusWindow(replayed, replayed.focusedId).state);
        return final;
      });
    },
    beginDrag(sourceId, payload) { requireLive(); return apply(beginDrag(options.owner.getState(), { sourceId, payload })); },
    dragOver(dragToken, targetId) { requireLive(); return apply(dragOver(options.owner.getState(), dragToken, targetId)); },
    async drop(dragToken, targetId, approve) {
      requireLive();
      const proposal = apply(dropDrag(options.owner.getState(), dragToken, targetId));
      if (!proposal.ok || !proposal.offer) return proposal;
      let accepted = false;
      try { accepted = await approve(proposal.offer) === true; } catch (error) { report(error); }
      if (disposed || disposing) return { state: options.owner.getState(), ok: false, reason: "stale-token" };
      return apply(resolveDrop(options.owner.getState(), dragToken, accepted));
    },
    cancelDrag(dragToken) { requireLive(); const result = apply(cancelDrag(options.owner.getState(), dragToken)); if (result.ok) void nativeDrag.cancel(dragToken).catch(report); return result; },
    startNativeDrag: nativeDrag.start,
    bindNativeDropTarget: nativeDrag.bindTarget,
    dispose() {
      if (disposing) return disposing;
      disposing = queued.then(async () => {
        if (disposed) return;
        await nativeDrag.cancelCurrent();
        await transport.dispose(token());
        disposed = true; updates.remove(); errors.remove(); nativeDrag.detach(); seenCloses.clear();
        let state = options.owner.getState();
        for (const window of state.windows) state = closeWindow(state, window.id).state;
        options.owner.commit(state);
      }).catch(error => { disposing = undefined; throw error; });
      return disposing;
    },
  };
}
