import {
  createWindowRegistry, openWindow as opened, closeWindow as closed, focusWindow,
  minimizeWindow as minimized, restoreWindow, moveWindow, beginDrag, dragOver,
  dropDrag, resolveDrop, cancelDrag, snapshotLayout, reflowWindows,
  parseLayoutSnapshot, restoreLayout as planRestoration,
  type WindowRegistryState, type WindowRecord, type DragOffer, type Outcome, type LayoutSnapshot,
} from '@nyc-tron/core/window-lifecycle';
import type { Rect } from '@nyc-tron/core/folds';
import type { WindowOpenOptions, WindowInfo, WindowBounds, WindowUpdateOptions, CloseResult } from '@legendapp/spark/windows';

export interface HostDisplay {
  readonly id: string;
  readonly primary: boolean;
  /** Top-left of the full NSScreen in the shared logical space. */
  readonly origin: { readonly x: number; readonly y: number };
  /** Actual NSScreen.visibleFrame in the same shared logical space. */
  readonly bounds: Rect;
  readonly scaleFactor: number;
}
export interface Registration { remove(): Promise<void> }
export type HostWindowEvent = 'focusChanged' | 'boundsChanged' | 'visibilityChanged' | 'fullscreenChanged' | 'closed';
/** Injection is for tests/host ownership; createMacOSWindowHost supplies real Spark APIs. */
export interface WindowTransport {
  open(options: WindowOpenOptions): Promise<WindowInfo>;
  get(id: string): Promise<WindowInfo>;
  close(id: string): Promise<CloseResult>;
  show(id: string, options?: { focus?: boolean }): Promise<void>;
  minimize(id: string): Promise<void>;
  bounds(id: string, bounds: WindowBounds): Promise<void>;
  options(id: string, options: WindowUpdateOptions): Promise<void>;
  listen(id: string, event: HostWindowEvent, listener: () => void): Promise<Registration>;
  beforeClose(id: string, allow: () => boolean | Promise<boolean>): Promise<Registration>;
  displays(): Promise<readonly HostDisplay[]>;
  displayChanges(listener: () => void): Promise<Registration>;
}
export interface WindowControllerOptions {
  /** App-owned unsaved document policy. A rejected/throwing guard vetoes closing. */
  beforeClose?: (windowId: string) => boolean | Promise<boolean>;
  onError?: (error: unknown) => void;
}
interface OwnedWindow { id: string; registrations: Registration[]; refreshQueued: boolean; removal?: Promise<void> }

export function validateDisplays(value: unknown): readonly HostDisplay[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 256) throw new Error('Invalid native display count');
  const ids = new Set<string>();
  for (const d of value as HostDisplay[]) {
    if (!d || typeof d.id !== 'string' || !d.id || ids.has(d.id) || typeof d.primary !== 'boolean'
      || !d.origin || !Number.isFinite(d.origin.x) || !Number.isFinite(d.origin.y)
      || !d.bounds || ![d.bounds.x, d.bounds.y, d.bounds.width, d.bounds.height, d.scaleFactor].every(Number.isFinite)
      || d.bounds.width <= 0 || d.bounds.height <= 0 || d.scaleFactor <= 0) throw new Error('Invalid native display geometry');
    ids.add(d.id);
  }
  if (value.filter(d => d.primary).length !== 1) throw new Error('Expected exactly one primary display');
  return value.map(d => ({ ...d, origin: { ...d.origin }, bounds: { ...d.bounds } }));
}
export function toSharedBounds(bounds: WindowBounds, displays: readonly HostDisplay[]): Rect {
  const display = displays.find(d => d.id === bounds.displayId);
  if (!display) throw new Error(`Display disconnected: ${bounds.displayId}`);
  return { x: display.origin.x + bounds.x, y: display.origin.y + bounds.y, width: bounds.width, height: bounds.height };
}
export function toSparkBounds(displayId: string, rect: Rect, displays: readonly HostDisplay[]): WindowBounds {
  const display = displays.find(d => d.id === displayId);
  if (!display) throw new Error(`Display disconnected: ${displayId}`);
  return { displayId, x: rect.x - display.origin.x, y: rect.y - display.origin.y, width: rect.width, height: rect.height };
}

/** One controller per app runtime, above registered React roots and geometry. */
export function createWindowController(transport: WindowTransport, options: WindowControllerOptions = {}) {
  let state = createWindowRegistry();
  let disposed = false;
  let disposal: Promise<void> | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  let displays: readonly HostDisplay[] = [];
  let displayRegistration: Registration | undefined;
  let displayRefreshQueued = false;
  const owned = new Map<string, OwnedWindow>();
  const removals = new Set<Promise<void>>();
  const listeners = new Set<() => void>();
  const report = (error: unknown) => {
    // An application diagnostic callback cannot break resource cleanup or turn
    // a rejected close guard into an unhandled native callback rejection.
    try { (options.onError ?? console.error)(error); } catch (cause) { console.error(cause); }
  };
  const assertLive = () => { if (disposed) throw new Error('Window host is disposed'); };
  const live = (entry: OwnedWindow) => !disposed && owned.get(entry.id) === entry;
  const publish = (next: WindowRegistryState) => {
    if (disposed || next === state) return;
    state = next;
    for (const listener of listeners) { try { listener(); } catch (error) { report(error); } }
  };
  function apply(outcome: Outcome) { if (outcome.ok) publish(outcome.state); return outcome; }
  function enqueue<T>(work: () => Promise<T>): Promise<T> {
    const result = queue.then(() => { assertLive(); return work(); });
    queue = result.catch(() => undefined);
    return result;
  }
  function remove(entry: OwnedWindow): Promise<void> {
    if (entry.removal) return entry.removal;
    const registrations = entry.registrations.splice(0);
    const pending = Promise.allSettled(registrations.map(r => Promise.resolve().then(() => r.remove()))).then(results => {
      for (const result of results) if (result.status === 'rejected') report(result.reason);
    });
    entry.removal = pending;
    removals.add(pending);
    void pending.then(() => removals.delete(pending));
    return pending;
  }
  function forget(entry: OwnedWindow) {
    if (owned.get(entry.id) !== entry) return;
    owned.delete(entry.id);
    apply(closed(state, entry.id));
    void remove(entry);
  }
  async function geometry() { displays = validateDisplays(await transport.displays()); return displays; }
  async function observe(entry: OwnedWindow, planned?: WindowRecord) {
    const info = await transport.get(entry.id);
    if (!live(entry)) return;
    // Screen changes can race getWindow. Re-read real geometry before conversion.
    await geometry();
    if (!live(entry)) return;
    if (!displays.some(display => display.id === info.bounds.displayId) && !planned && state.windows.some(w => w.id === entry.id)) {
      // The OS can report the old screen between its disconnect event and its
      // native window relocation. Reflow the existing owner once through the
      // serialized display path; never invent the old display's new origin.
      refreshDisplays(); return;
    }
    const rect = toSharedBounds(info.bounds, displays);
    const current = state.windows.find(w => w.id === entry.id);
    const sameBounds = current && current.displayId === info.bounds.displayId &&
      ['x', 'y', 'width', 'height'].every(key => current.rect[key as keyof Rect] === rect[key as keyof Rect]);
    // Focus/visibility notifications and an echo of our own bounds command must
    // retain the remembered home display. A genuine native move clears it.
    const outcome: Outcome = sameBounds ? { state, ok: true } : current
      ? moveWindow(state, entry.id, { displayId: info.bounds.displayId, rect })
      : opened(state, { id: entry.id, displayId: info.bounds.displayId, rect });
    if (!outcome.ok) throw new Error(`Window observation rejected: ${outcome.reason}`);
    let next = outcome.state;
    if (planned && info.bounds.displayId === planned.displayId) {
      next = { ...next, windows: next.windows.map(w => {
        if (w.id !== entry.id) return w;
        const { home: _previous, ...record } = w;
        return planned.home ? { ...record, home: { displayId: planned.home.displayId, rect: { ...planned.home.rect } } } : record;
      }) };
    }
    const record = next.windows.find(w => w.id === entry.id)!;
    if (info.minimized && record.status !== 'minimized') next = minimized(next, entry.id).state;
    if (!info.minimized && record.status === 'minimized') next = restoreWindow(next, entry.id).state;
    if (info.focused && !info.minimized) {
      if (next.focusedId !== entry.id) next = focusWindow(next, entry.id).state;
    }
    else if (next.focusedId === entry.id) next = { ...next, focusedId: null };
    publish(next);
  }
  function refresh(entry: OwnedWindow) {
    if (!live(entry) || entry.refreshQueued) return;
    entry.refreshQueued = true;
    void enqueue(async () => {
      entry.refreshQueued = false;
      if (live(entry)) await observe(entry);
    }).catch(error => { if (!disposed) report(error); });
  }
  async function register(entry: OwnedWindow) {
    for (const event of ['closed', 'boundsChanged', 'focusChanged', 'visibilityChanged', 'fullscreenChanged'] as const) {
      const registration = await transport.listen(entry.id, event, () => {
        if (!live(entry)) return;
        if (event === 'closed') forget(entry); else refresh(entry);
      });
      if (!live(entry)) { await registration.remove(); throw new Error('Window closed during registration'); }
      entry.registrations.push(registration);
    }
    const guard = await transport.beforeClose(entry.id, async () => {
      if (!live(entry)) return false;
      try { const allow = await (options.beforeClose?.(entry.id) ?? true); return live(entry) && allow === true; }
      catch (error) { report(error); return false; }
    });
    if (!live(entry)) { await guard.remove(); throw new Error('Window closed during guard registration'); }
    entry.registrations.push(guard);
  }
  function reserve(id: string): OwnedWindow {
    if (!id.trim() || id.length > 256 || owned.has(id) || owned.size >= 256) throw new Error('Invalid, duplicate, or excess window ID');
    const entry = { id, registrations: [], refreshQueued: false };
    owned.set(id, entry);
    return entry;
  }
  async function reflow() {
    await geometry();
    assertLive();
    const plan = reflowWindows(state, displays);
    for (const id of plan.relocated) {
      const entry = owned.get(id); if (!entry) continue;
      const record = plan.state.windows.find(w => w.id === id)!;
      if (!live(entry)) continue;
      await transport.bounds(id, toSparkBounds(record.displayId, record.rect, displays));
      if (!live(entry)) continue;
      // Commit only actual successful native bounds. Native constraints may clamp.
      await observe(entry, record);
    }
    return snapshotLayout(state);
  }
  async function start() {
    await geometry(); assertLive();
    if (displayRegistration) return;
    const registration = await transport.displayChanges(refreshDisplays);
    if (disposed) { await registration.remove(); return; }
    displayRegistration = registration;
  }
  function refreshDisplays() {
    if (disposed || displayRefreshQueued) return;
    displayRefreshQueued = true;
    void enqueue(async () => { displayRefreshQueued = false; await reflow(); }).catch(error => { if (!disposed) report(error); });
  }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { assertLive(); listeners.add(listener); return () => { listeners.delete(listener); }; },
    start: () => enqueue(start),
    /** Attach the Spark-owned main/restored window without reopening its document. */
    attach(id: string) { return enqueue(async () => {
      const entry = reserve(id);
      try { await start(); await register(entry); await observe(entry); }
      catch (error) { forget(entry); await remove(entry); throw error; }
    }); },
    open(input: WindowOpenOptions) { return enqueue(async () => {
      const entry = reserve(input.id); let created = false;
      try {
        await start();
        await transport.open({ ...input, show: false }); created = true;
        assertLive(); await register(entry); await observe(entry);
        if (input.show !== false) { await transport.show(input.id); await observe(entry); }
        return state.windows.find(w => w.id === input.id)!;
      } catch (error) {
        forget(entry); await remove(entry);
        if (created) { try { await transport.close(input.id); } catch (cleanup) { report(cleanup); } }
        throw error;
      }
    }); },
    close(id: string) { return enqueue(async () => {
      const entry = owned.get(id); if (!entry) throw new Error('Window is not owned by this host');
      const result = await transport.close(id);
      if (result.closed) forget(entry);
      return result;
    }); },
    focus(id: string) { return enqueue(async () => {
      const entry = owned.get(id); if (!entry) throw new Error('Window is not owned by this host');
      await transport.show(id, { focus: true }); await observe(entry);
    }); },
    minimize(id: string) { return enqueue(async () => {
      const entry = owned.get(id); if (!entry) throw new Error('Window is not owned by this host');
      await transport.minimize(id); await observe(entry);
    }); },
    setBounds(id: string, displayId: string, rect: Rect) { return enqueue(async () => {
      const entry = owned.get(id); if (!entry) throw new Error('Window is not owned by this host');
      const validation = moveWindow(state, id, { displayId, rect });
      if (!validation.ok) throw new Error(`Invalid window bounds: ${validation.reason}`);
      await geometry();
      if (!live(entry)) throw new Error('Window closed or host disposed before resize');
      await transport.bounds(id, toSparkBounds(displayId, rect, displays)); await observe(entry);
    }); },
    setOptions(id: string, value: WindowUpdateOptions) { return enqueue(async () => {
      if (!owned.has(id)) throw new Error('Window is not owned by this host');
      await transport.options(id, value);
    }); },
    refresh(id: string) { return enqueue(async () => { const entry = owned.get(id); if (entry) await observe(entry); }); },
    reflow: () => enqueue(reflow),
    snapshot: (): LayoutSnapshot => snapshotLayout(state),
    /**
     * Restore geometry/order/minimization for the same already-owned windows.
     * The app first reopens its documents and registers their React roots.
     * Invalid/mismatched snapshots reject before any native mutation. If a
     * native command fails, the registry retains each actual completed change.
     */
    restore(snapshot: LayoutSnapshot) {
      const saved = parseLayoutSnapshot(snapshot);
      if (!saved) return Promise.reject(new TypeError('Invalid window layout snapshot'));
      return enqueue(async () => {
        if (saved.windows.length !== owned.size || saved.windows.some(w => !owned.has(w.id))) {
          throw new Error('Restore requires exactly the currently owned window IDs');
        }
        await geometry(); assertLive();
        const plan = planRestoration(saved, displays, state);
        if (state.drag) apply(cancelDrag(state, state.drag.token));
        for (const record of plan.state.windows) {
          const entry = owned.get(record.id);
          if (!entry || !live(entry)) throw new Error('Window closed during layout restoration');
          await transport.bounds(entry.id, toSparkBounds(record.displayId, record.rect, displays));
          await observe(entry, record);
          if (!live(entry)) throw new Error('Window closed during layout restoration');
          if (record.status === 'minimized') await transport.minimize(entry.id);
          else await transport.show(entry.id, { focus: false });
          await observe(entry);
          if (!live(entry)) throw new Error('Window closed during layout restoration');
          const observed = state.windows.find(window => window.id === entry.id)!;
          // AppKit show(focus:false) orders the window front without changing
          // focus. Preserve this completed ordering pass, and the saved slots
          // for minimized windows, even when the focused ID stays unchanged.
          if (observed.status === record.status && state.windows.at(-1)?.id !== entry.id) {
            publish({ ...state, windows: [...state.windows.filter(window => window.id !== entry.id), observed] });
          }
        }
        if (plan.state.focusedId) {
          const entry = owned.get(plan.state.focusedId);
          if (!entry || !live(entry)) throw new Error('Focused window closed during layout restoration');
          await transport.show(entry.id, { focus: true }); await observe(entry);
        }
        return snapshotLayout(state);
      });
    },
    beginDrag(sourceId: string, payload: unknown) { assertLive(); return apply(beginDrag(state, { sourceId, payload })); },
    dragOver(token: string, targetId: string | null) { assertLive(); return apply(dragOver(state, token, targetId)); },
    /** Host approval is awaited; close/minimize/cancel invalidates any late verdict. */
    async drop(token: string, targetId: string, approve: (offer: DragOffer) => boolean | Promise<boolean>): Promise<Outcome> {
      assertLive(); const offer = apply(dropDrag(state, token, targetId));
      if (!offer.ok || !offer.offer) return offer;
      let accepted = false;
      try { accepted = await approve(offer.offer) === true; } catch (error) { report(error); }
      if (disposed) return { state, ok: false, reason: 'stale-token' };
      // Only the returned transfer authorizes application mutation. Never move documents here.
      return apply(resolveDrop(state, token, accepted));
    },
    cancelDrag(token: string) { assertLive(); return apply(cancelDrag(state, token)); },
    /**
     * Invalidate commands immediately, then drain in-flight ownership/cleanup.
     * Detaches observation only; the app explicitly closes documents first.
     * Repeated calls return the same completion promise.
     */
    dispose() {
      if (disposal) return disposal;
      disposed = true; listeners.clear();
      const entries = [...owned.values()]; owned.clear();
      const registration = displayRegistration; displayRegistration = undefined;
      disposal = Promise.allSettled([
        ...entries.map(remove),
        ...(registration ? [Promise.resolve().then(() => registration.remove())] : []),
      ]).then(async results => {
        for (const result of results) if (result.status === 'rejected') report(result.reason);
        await queue;
        await Promise.all([...removals]);
      });
      return disposal;
    },
  };
}
export type WindowController = ReturnType<typeof createWindowController>;
