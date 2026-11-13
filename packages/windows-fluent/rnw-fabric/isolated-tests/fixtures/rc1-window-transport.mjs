import { createWindowRegistry } from "@nyc-tron/core/window-lifecycle";

// Fixture copied from v1.0.0-rc.1 isolated-tests/window-controller.test.mjs
// (blob 4fe8ddd33258254b78e4eb06f6df6fd16e1a2dc6); keep its wire reports unchanged.
const rect = { x: 20, y: 30, width: 800, height: 600 };
const display = { id: "monitor", bounds: { x: 0, y: 0, width: 1920, height: 1040 }, pixelBounds: { x: 0, y: 0, width: 1920, height: 1080 }, pixelWorkArea: { x: 0, y: 0, width: 1920, height: 1040 } };
const observed = (id, primary = false, generation = id + "-1") => ({ id, generation, primary, dpi: 96, rect: { ...rect }, pixelRect: { ...rect }, displayId: "monitor", status: "open" });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
export function legacyFixture() {
  let state = createWindowRegistry(), seq = 0, generation = 0;
  let value = { schema: 1, ownerToken: "connection", sequence: 0, referenceDpi: 96, displays: [display], windows: [observed("main", true)], focusedId: "main", pendingCloses: [] };
  const listeners = new Set(), errors = new Set(), calls = [], closes = [], failures = [];
  const report = () => JSON.stringify({ ...value, sequence: ++seq });
  const transport = {
    onSnapshot(listener) { listeners.add(listener); return { remove: () => listeners.delete(listener) }; },
    onError(listener) { errors.add(listener); return { remove: () => errors.delete(listener) }; },
    async connect() { calls.push("connect"); return report(); },
    async read() { calls.push("read"); return report(); },
    async open(owner, json) { const spec = JSON.parse(json); calls.push(["open", spec]); value.windows.push({ ...observed(spec.id, false, "window-" + ++generation), rect: spec.rect, pixelRect: spec.rect }); return report(); },
    async move(owner, id, json) { const target = JSON.parse(json); calls.push(["move", id]); Object.assign(value.windows.find(w => w.id === id), { rect: target.rect, pixelRect: target.rect, displayId: target.displayId }); return report(); },
    async focus(owner, id) { calls.push(["focus", id]); value.focusedId = id; return report(); },
    async minimize(owner, id) { calls.push(["minimize", id]); value.windows.find(w => w.id === id).status = "minimized"; if (value.focusedId === id) value.focusedId = null; return report(); },
    async restore(owner, id) { calls.push(["restore", id]); value.windows.find(w => w.id === id).status = "open"; return report(); },
    async requestClose(owner, id) { value.pendingCloses = [{ id, generation: value.windows.find(w => w.id === id).generation, token: "close-" + ++generation }]; return report(); },
    async resolveClose(owner, id, gen, token, accepted) {
      const request = value.pendingCloses.find(r => r.id === id && r.generation === gen && r.token === token);
      if (!request) throw new Error("Stale native close request");
      value.pendingCloses = [];
      if (accepted) value.windows = value.windows.filter(w => w.id !== id);
      return report();
    },
    async dispose() { calls.push("dispose"); },
  };
  const options = { primaryWindowId: "main", componentName: "Document", owner: { getState: () => state, commit: next => { state = next; } }, onCloseRequested: r => closes.push(r), onError: e => failures.push(e) };
  return { transport, options, calls, closes, failures, listeners, state: () => state, value: () => value,
    patch: patch => { value = { ...value, ...patch }; }, emit: json => { for (const f of listeners) f(json ?? report()); }, report };
}

