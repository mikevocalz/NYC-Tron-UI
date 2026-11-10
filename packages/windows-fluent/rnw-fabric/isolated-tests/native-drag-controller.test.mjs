import test from "node:test";
import assert from "node:assert/strict";
import { createWindowRegistry, openWindow, closeWindow, minimizeWindow } from "@nyc-tron/core/window-lifecycle";
import { createNativeDragController } from "../dist/native-drag-controller.js";
import { createOverlayBinding, newOverlayScopeToken } from "../dist/overlay-binding.js";
import { validateInspectorFields, validateOverlayItems } from "../dist/overlay-model.js";

const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const settle = () => new Promise(resolve => setImmediate(resolve));
function fixture() {
  let state = createWindowRegistry(), live = true, listener, start;
  for (const id of ["main", "document"]) state = openWindow(state, { id, displayId: "display", rect: { x: 0, y: 0, width: 600, height: 500 } }).state;
  const snapshot = { ownerToken: "connection", windows: state.windows.map(w => ({ ...w, generation: w.id + "-generation" })) };
  const completed = deferred(), resolutions = [], cancellations = [], errors = [];
  const transport = {
    onNativeDrag(callback) { listener = callback; return { remove() { listener = undefined; } }; },
    async startNativeDrag(...args) { start = args; return completed.promise; },
    async resolveNativeDrop(...args) { resolutions.push(args); return args[3]; },
    async cancelNativeDrag(...args) { cancellations.push(args); },
  };
  const scope = { snapshot: () => snapshot, getState: () => state, commit: value => { state = value; }, isLive: () => live, report: error => errors.push(error) };
  const controller = createNativeDragController(transport, scope);
  const message = patch => ({ ownerToken: "connection", token: start?.[2], sourceId: "main", sourceGeneration: "main-generation", targetId: "document", targetGeneration: "document-generation", ...patch });
  return { controller, scope, snapshot, resolutions, cancellations, errors, state: () => state, start: () => start,
    emit: patch => listener?.(JSON.stringify(message({ kind: "offer", requestId: "drop-request", ...patch }))),
    finish: patch => completed.resolve(JSON.stringify(message({ effect: "move", reason: "accepted", ...patch }))),
    gone(id, minimized = false) {
      state = (minimized ? minimizeWindow(state, id) : closeWindow(state, id)).state;
      snapshot.windows = minimized ? snapshot.windows.map(w => w.id === id ? { ...w, status: "minimized" } : w) : snapshot.windows.filter(w => w.id !== id);
    }, dispose() { live = false; controller.detach(); },
  };
}

test("native Move plus live approval releases one original opaque payload only after DropCompleted", async () => {
  const f = fixture(), payload = { document: {}, undo: () => {} }; payload.self = payload;
  let offered; f.controller.bindTarget("document", offer => { offered = offer; return true; });
  const result = f.controller.start("real-native-start-request", "main", payload);
  assert.deepEqual(f.start(), ["connection", "main", "drag-1", "real-native-start-request"]);
  f.emit({ kind: "hover" }); f.emit({}); await settle();
  assert.equal(offered.payload, payload); assert.equal(f.state().drag.phase, "dropping");
  assert.deepEqual(f.resolutions, [["connection", "drag-1", "drop-request", true]]);
  f.finish({}); const completed = await result;
  assert.equal(completed.effect, "move"); assert.equal(completed.outcome.transfer.payload, payload);
  assert.equal(completed.outcome.transfer.sourceId, "main"); assert.equal(completed.outcome.transfer.targetId, "document");
  assert.equal(f.state().drag, null); assert.deepEqual(f.errors, []);
});
test("application rejection completes the native deferral with None and retains the payload", async () => {
  const f = fixture(); f.controller.bindTarget("document", () => false);
  const result = f.controller.start("start", "main", {}); f.emit({}); await settle();
  assert.equal(f.resolutions[0][3], false); f.finish({ effect: "none", reason: "rejected" });
  const completed = await result; assert.equal(completed.outcome.transfer, undefined); assert.equal(completed.outcome.accepted, false);
});
for (const effect of ["none", "copy", "link", "unknown"]) test(`approved native ${effect} result never authorizes a move`, async () => {
  const f = fixture(); f.controller.bindTarget("document", () => true);
  const result = f.controller.start("start", "main", {}); f.emit({}); await settle(); f.finish({ effect, reason: "cancelled" });
  assert.equal((await result).outcome.transfer, undefined); assert.equal(f.state().drag, null);
});
test("foreign connections and replaced source lifetimes cannot reach the app drop policy", async () => {
  const f = fixture(); let offers = 0; f.controller.bindTarget("document", () => { offers++; return true; });
  const result = f.controller.start("start", "main", {});
  f.emit({ ownerToken: "other" }); f.emit({ sourceGeneration: "replaced" }); await settle();
  assert.equal(offers, 0); assert.equal(f.resolutions.length, 0);
  f.finish({ effect: "none", reason: "cancelled" }); await result;
});
for (const [id, minimized] of [["main", false], ["document", false], ["main", true], ["document", true]]) test(`${id} ${minimized ? "minimize" : "close"} invalidates an unresolved native drop`, async () => {
  const f = fixture(), approval = deferred(); f.controller.bindTarget("document", () => approval.promise);
  const result = f.controller.start("start", "main", {}); f.emit({}); f.gone(id, minimized);
  approval.resolve(true); await settle(); assert.equal(f.resolutions[0][3], false);
  f.finish({ effect: "unknown", reason: "unavailable" }); assert.equal((await result).outcome.transfer, undefined);
});
test("unmounting the target cancels the dropping token and rejects late application approval", async () => {
  const f = fixture(), approval = deferred(), remove = f.controller.bindTarget("document", () => approval.promise);
  const result = f.controller.start("start", "main", {}); f.emit({}); remove();
  assert.equal(f.state().drag, null); assert.deepEqual(f.cancellations, [["connection", "drag-1"]]);
  f.finish({ effect: "none", reason: "unavailable" }); assert.equal((await result).outcome.transfer, undefined);
  approval.resolve(true); await settle(); assert.equal(f.resolutions.length, 0);
});
test("native deadline finishes without waiting for an unresponsive application callback", async () => {
  const f = fixture(), approval = deferred(); f.controller.bindTarget("document", () => approval.promise);
  const result = f.controller.start("start", "main", {}); f.emit({}); f.finish({ effect: "none", reason: "timeout" });
  assert.equal((await result).reason, "timeout"); approval.resolve(true); await settle(); assert.equal(f.resolutions.length, 0);
});
test("disposal and a replaced target generation cannot authorize the reported OS Move", async () => {
  for (const change of [f => f.dispose(), f => { f.snapshot.windows[1].generation = "replacement"; }]) {
    const f = fixture(); f.controller.bindTarget("document", () => true);
    const result = f.controller.start("start", "main", {}); f.emit({}); await settle(); change(f); f.finish({});
    assert.equal((await result).outcome.transfer, undefined);
  }
});
test("native drag requires the registered transport and a currently observed source", async () => {
  const f = fixture(), absent = createNativeDragController({}, f.scope);
  await assert.rejects(absent.start("start", "main", {}), /transport is unavailable/);
  f.snapshot.windows = f.snapshot.windows.filter(w => w.id !== "main");
  assert.equal((await f.controller.start("start", "main", {})).reason, "unavailable");
  assert.equal(f.state().drag, null); assert.deepEqual(f.cancellations, [["connection", "start"]]);
});
test("malformed completion cannot transfer and cancels the native request", async () => {
  const f = fixture(), result = f.controller.start("start", "main", {}); f.finish({ ownerToken: "other" });
  await assert.rejects(result, /Malformed native drag completion/); assert.equal(f.state().drag, null);
  assert.deepEqual(f.cancellations, [["connection", "drag-1"]]);
});
test("overlay events consult only the live committed scope and disabled state", () => {
  const binding = createOverlayBinding(), first = newOverlayScopeToken(), next = newOverlayScopeToken();
  const a = { scopeId: "document-a", label: "Actions" }, b = { scopeId: "document-b", label: "Actions" };
  const releaseA = binding.commit(first, a); assert.equal(binding.current(first), a);
  const releaseB = binding.commit(next, b); releaseA();
  assert.equal(binding.current(first), undefined); assert.equal(binding.current(next), b);
  binding.commit(next, { ...b, disabled: true }); releaseB();
  assert.equal(binding.current(next), undefined); assert.equal(binding.current(next, true).disabled, true);
  const release = binding.commit(next, b); release(); assert.equal(binding.current(next), undefined);
});
test("inspector acknowledgments are bounded nonnegative integer counts", () => {
  const field = { id: "name", label: "Name", value: "Native draft" };
  for (const count of [undefined, 0, 1, 2147483647]) validateInspectorFields([{ ...field, acknowledgedEventCount: count }]);
  for (const count of [-1, 0.5, Infinity, NaN, 2147483648, "1"]) assert.throws(() => validateInspectorFields([{ ...field, acknowledgedEventCount: count }]), /bounded/);
  assert.throws(() => validateInspectorFields([field, field]), /unique/);
  assert.throws(() => validateOverlayItems([{ id: "x", label: "Action", disabled: "false" }]), /valid state/);
});
