import test from "node:test";
import assert from "node:assert/strict";
import { createWindowRegistry, beginDrag } from "@nyc-tron/core/window-lifecycle";
import { connectWindowsWindowHost } from "../dist/window-controller.js";
import { parseDesktopSnapshot, convertDesktopLayout } from "../dist/window-protocol.js";
import { createWindowsNavigationBinding, navigationBindingOwner } from "../dist/navigation-binding.js";
import { legacyFixture } from "./fixtures/rc1-window-transport.mjs";

const rect = { x: 20, y: 30, width: 800, height: 600 };
const display = { id: "monitor", bounds: { x: 0, y: 0, width: 1920, height: 1040 }, pixelBounds: { x: 0, y: 0, width: 1920, height: 1080 }, pixelWorkArea: { x: 0, y: 0, width: 1920, height: 1040 } };
const standardBar = { style: "standard", leading: 0, trailing: 0, height: 0 };
const observed = (id, primary = false, generation = id + "-1") => ({ id, generation, primary, dpi: 96, rect: { ...rect }, pixelRect: { ...rect }, displayId: "monitor", status: "open", titleBar: { ...standardBar } });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function fixture() {
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
    async setTitleBar(owner, id, style) { calls.push(["setTitleBar", id, style]); value.windows.find(w => w.id === id).titleBar = style === "extended" ? { style, leading: 0, trailing: 138, height: 32 } : { ...standardBar }; return report(); },
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

test("native protocol validates geometry and freezes all leases", () => {
  const f = fixture(), report = parseDesktopSnapshot(f.report());
  assert.throws(() => { report.windows[0].rect.width = 1; }, TypeError);
  assert.throws(() => parseDesktopSnapshot(JSON.stringify({ ...report, windows: [observed("main")] })), /primary/);
  assert.throws(() => parseDesktopSnapshot(JSON.stringify({ ...report, pendingCloses: [{ id: "main", generation: "wrong", token: "token" }] })), /ownership/);
  const layout = { schema: 1, referenceDpi: 144, layout: { version: 1, focusedId: null, windows: [{ id: "one", displayId: "monitor", rect, status: "open" }] } };
  assert.equal(convertDesktopLayout(layout, 96).windows[0].rect.width, 1200);
});
test("an unchanged rc.1 transport keeps ordinary window operations without title-bar customization", async () => {
  const f = legacyFixture();
  assert.equal("setTitleBar" in f.transport, false);
  assert.equal("titleBar" in JSON.parse(f.report()).windows[0], false);
  const connect = f.transport.connect;
  f.transport.connect = async (...args) => { f.emit(); return connect(...args); };
  const host = await connectWindowsWindowHost(f.transport, f.options);
  assert.deepEqual(host.snapshot().windows[0].titleBar, standardBar);
  assert.equal(Object.isFrozen(host.snapshot().windows[0].titleBar), true);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  const saved = host.captureLayout();
  await host.move("doc", { displayId: "monitor", rect: { ...rect, x: 200 } });
  await host.minimize("doc"); await host.restore("doc"); await host.focus("doc");
  await host.restoreLayout(saved); await host.refresh();
  assert.deepEqual(host.snapshot().windows.find(w => w.id === "doc").rect, rect);
  f.value().focusedId = "doc"; f.emit();
  assert.equal(f.state().focusedId, "doc");
  const before = host.snapshot();
  await assert.rejects(host.setTitleBar("doc", "extended"), /unsupported/);
  assert.equal(host.snapshot(), before);
  assert.equal(f.value().windows.some(w => "titleBar" in w), false);
  await host.focus("main");
  await host.requestClose("doc"); await host.resolveClose(f.closes[0], false);
  assert.equal(f.state().windows.length, 2);
  await host.requestClose("doc"); await host.resolveClose(f.closes[1], true);
  assert.equal(f.state().windows.length, 1);
  assert.deepEqual(f.failures, []);
  await host.dispose();
  assert.equal(f.listeners.size, 0); assert.equal(f.state().windows.length, 0);
});
test("legacy compatibility rejects malformed present title bars and invalid geometry", async () => {
  for (const patch of [{ titleBar: null }, { titleBar: { style: "standard", leading: 0, trailing: 1, height: 0 } },
    { rect: { ...rect, width: -1 } }]) {
    const f = legacyFixture(); Object.assign(f.value().windows[0], patch);
    await assert.rejects(connectWindowsWindowHost(f.transport, f.options), /window observation/);
    assert.equal(f.listeners.size, 0);
  }
  const f = legacyFixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  f.value().windows[0].titleBar = null; f.emit();
  assert.match(f.failures[0].message, /title bar null/);
  await assert.rejects(host.refresh(), /title bar null/);
  await host.dispose();
});
test("a modern transport must provide title bars in its snapshots", async () => {
  const f = fixture(); delete f.value().windows[0].titleBar;
  await assert.rejects(connectWindowsWindowHost(f.transport, f.options), /title bar null/);
  assert.equal(f.listeners.size, 0);
});
test("native protocol requires a valid title bar on every window", () => {
  const f = fixture(), report = JSON.parse(f.report());
  const withBar = titleBar => JSON.stringify({ ...report, windows: [{ ...report.windows[0], titleBar }] });
  assert.equal(parseDesktopSnapshot(withBar({ style: "extended", leading: 0, trailing: 138, height: 32 })).windows[0].titleBar.trailing, 138);
  for (const bad of [undefined, null, "extended", { style: "hidden", leading: 0, trailing: 0, height: 0 },
    { style: "extended", leading: -1, trailing: 138, height: 32 }, { style: "extended", leading: 0, trailing: Number.NaN, height: 32 },
    { style: "extended", leading: 0, trailing: 138, height: 10_001 }, { style: "extended", leading: 0, trailing: "138", height: 32 },
    { style: "standard", leading: 0, trailing: 138, height: 0 }, { style: "standard", leading: 0, trailing: 0, height: 32 }])
    assert.throws(() => parseDesktopSnapshot(withBar(bad)), /window observation/, JSON.stringify(bad));
  assert.throws(() => parseDesktopSnapshot(withBar({ style: "extended", leading: 0, trailing: -46, height: 32 })),
    /title bar \{"style":"extended","leading":0,"trailing":-46,"height":32\}/);
});
test("setTitleBar validates the style, sends it natively and returns the observed insets", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  await assert.rejects(host.setTitleBar("doc", "hidden"), TypeError);
  await assert.rejects(host.setTitleBar("absent", "extended"), /not owned/);
  assert.deepEqual(await host.setTitleBar("doc", "extended"), { style: "extended", leading: 0, trailing: 138, height: 32 });
  assert.deepEqual(f.calls.filter(c => c[0] === "setTitleBar"), [["setTitleBar", "doc", "extended"]]);
  assert.equal(host.snapshot().windows.find(w => w.id === "doc").titleBar.height, 32);
  f.transport.setTitleBar = async () => f.report();
  await assert.rejects(host.setTitleBar("doc", "standard"), /reports title bar style extended/);
  await host.dispose();
});
test("setTitleBar rejects as unsupported when the transport has no setTitleBar, and the window is unchanged", async () => {
  const f = fixture(); delete f.transport.setTitleBar;
  const host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  const before = JSON.stringify(host.snapshot());
  await assert.rejects(host.setTitleBar("doc", "extended"), /unsupported/);
  await assert.rejects(host.setTitleBar("doc", "hidden"), TypeError);
  assert.equal(JSON.stringify(host.snapshot()), before);
  assert.equal(f.calls.filter(c => c[0] === "setTitleBar").length, 0);
  await host.dispose();
});
test("connection attaches one primary and ignores stale and foreign-owner observations", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  const before = f.state();
  f.emit(JSON.stringify({ ...host.snapshot(), ownerToken: "other", sequence: 100 }));
  f.emit(JSON.stringify({ ...host.snapshot(), sequence: 0, focusedId: null }));
  assert.equal(f.state(), before);
  await host.dispose(); assert.equal(f.listeners.size, 0); assert.equal(f.state().windows.length, 0);
});
test("open owns request bytes before queueing and observes actual native geometry", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  const spec = { id: "document", title: "Document", displayId: "monitor", rect: { ...rect } };
  const opening = host.open(spec); spec.id = "mutated"; spec.rect.width = 1;
  const result = await opening; assert.equal(result.id, "document"); assert.equal(result.rect.width, 800);
  await host.dispose();
});
test("failed native move leaves the committed window registry unchanged", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  const before = f.state(); f.transport.move = async () => { throw new Error("OS rejected"); };
  await assert.rejects(host.move("main", { displayId: "monitor", rect: { ...rect, x: 200 } }), /rejected/);
  assert.equal(f.state(), before); await host.dispose();
});
test("actual native focus updates the core stacking order used by saved layouts", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  await host.focus("doc"); assert.equal(host.captureLayout().layout.windows.at(-1).id, "doc");
  await host.focus("main"); assert.equal(host.captureLayout().layout.windows.at(-1).id, "main");
  await host.dispose();
});
test("close requests are delivered once and veto retains the native surface", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  await host.requestClose("doc"); f.emit(); assert.equal(f.closes.length, 1);
  await host.resolveClose(f.closes[0], false); assert.equal(f.state().windows.length, 2);
  await assert.rejects(host.resolveClose(f.closes[0], true), /Stale/);
  await host.requestClose("doc"); await host.resolveClose(f.closes[1], true);
  assert.equal(f.state().windows.length, 1); await host.dispose();
});
test("reusing a window ID cancels transfers addressed to the previous native lifetime", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  f.options.owner.commit(beginDrag(f.state(), { sourceId: "doc", payload: { documentId: "app-owned" } }).state);
  f.value().windows[1].generation = "replacement"; f.emit();
  assert.equal(f.state().drag, null); await host.dispose();
});
test("minimization cancels an active drag and native restore retains identity", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  const before = host.snapshot().windows[0].generation;
  f.options.owner.commit(beginDrag(f.state(), { sourceId: "main", payload: {} }).state);
  await host.minimize("main"); assert.equal(f.state().drag, null); assert.equal(f.state().windows[0].status, "minimized");
  await host.restore("main"); assert.equal(host.snapshot().windows[0].generation, before); await host.dispose();
});
test("only a live app-approved drop authorizes a transfer of the original payload", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  const payload = { documentId: "owned-by-app" }, started = host.beginDrag("main", payload);
  const result = await host.drop(started.token, "doc", offer => { assert.equal(offer.payload, payload); return true; });
  assert.equal(result.accepted, true); assert.equal(result.transfer.payload, payload); assert.equal(f.state().drag, null);
  const stale = host.beginDrag("main", payload), verdict = deferred();
  const pending = host.drop(stale.token, "doc", () => verdict.promise);
  await host.minimize("doc"); verdict.resolve(true);
  assert.equal((await pending).reason, "stale-token"); await host.dispose();
});
test("restoring a layout invalidates pending drops and retains a disconnected home through focus echoes", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options);
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  const started = host.beginDrag("main", {}), verdict = deferred();
  const pending = host.drop(started.token, "doc", () => verdict.promise);
  const layout = host.captureLayout(); layout.layout.windows.find(w => w.id === "doc").displayId = "disconnected";
  await host.restoreLayout(layout); f.emit();
  assert.equal(f.state().windows.find(w => w.id === "doc").home.displayId, "disconnected");
  verdict.resolve(true); assert.equal((await pending).reason, "stale-token"); await host.dispose();
});
test("layout restore validates all window identities before issuing any OS move", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options), layout = host.captureLayout();
  layout.layout.windows.push({ id: "absent", displayId: "monitor", rect, status: "open" });
  await assert.rejects(host.restoreLayout(layout), /exactly/);
  assert.equal(f.calls.some(c => Array.isArray(c) && c[0] === "move"), false);
  await host.dispose();
});
test("layout restore replays every native surface in saved bottom-to-top order", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options), raised = [];
  await host.open({ id: "doc", title: "Document", displayId: "monitor", rect });
  await host.focus("doc"); const saved = host.captureLayout();
  await host.focus("main");
  const move = f.transport.move;
  f.transport.move = async (owner, id, request) => { if (JSON.parse(request).raise) raised.push(id); return move(owner, id, request); };
  await host.restoreLayout(saved);
  assert.deepEqual(raised, saved.layout.windows.map(w => w.id));
  assert.deepEqual(host.captureLayout().layout.windows.map(w => w.id), saved.layout.windows.map(w => w.id));
  await host.dispose();
});
test("dispose drains accepted native operations and rejects new commands", async () => {
  const f = fixture(), host = await connectWindowsWindowHost(f.transport, f.options), wait = deferred();
  const original = f.transport.read; f.transport.read = async () => { await wait.promise; return original(); };
  const reading = host.refresh(), disposing = host.dispose();
  assert.throws(() => host.refresh(), /disposed/); wait.resolve(); await reading; await disposing;
  assert.deepEqual(f.calls, ["connect", "read", "dispose"]); assert.equal(host.dispose(), disposing);
});
test("connection failure releases both native subscriptions", async () => {
  const f = fixture(); f.transport.connect = async () => { throw new Error("Host missing"); };
  await assert.rejects(connectWindowsWindowHost(f.transport, f.options), /Host missing/);
  assert.equal(f.listeners.size, 0);
});
test("navigation transport owns destination arrays and detaches stale native hosts", () => {
  const binding = createWindowsNavigationBinding(), owner = navigationBindingOwner(binding), events = [], first = {}, second = {};
  const items = [{ id: "home", label: "Home" }]; binding.transport.setDestinations(items, []); items[0].label = "Changed";
  assert.equal(owner.getSnapshot().items[0].label, "Home");
  const detach = owner.attach(first); assert.throws(() => owner.attach(second), /one mounted/);
  binding.transport.subscribe(event => events.push(event)); owner.emit(first, { type: "settingsInvoked" }); detach();
  owner.emit(first, { type: "settingsInvoked" }); assert.equal(events.length, 1);
  assert.throws(() => binding.transport.setDestinations([{ id: " ", label: "Invalid" }], []), /IDs/);
  binding.dispose(); assert.throws(() => binding.transport.setPaneOpen(true), /disposed/);
});
