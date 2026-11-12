import test from "node:test";
import assert from "node:assert/strict";
import { createWindowRegistry } from "@nyc-tron/core/window-lifecycle";
import { createWindowChromeController, describeTitleBar } from "@nyc-tron/core/window-chrome";
import { connectWindowsWindowHost } from "../dist/window-controller.js";
import { createWindowsChromeBridge } from "../dist/window-chrome.js";

const rect = { x: 20, y: 30, width: 800, height: 600 };
const display = { id: "monitor", bounds: { x: 0, y: 0, width: 1920, height: 1040 }, pixelBounds: { x: 0, y: 0, width: 1920, height: 1080 }, pixelWorkArea: { x: 0, y: 0, width: 1920, height: 1040 } };
const standardBar = { style: "standard", leading: 0, trailing: 0, height: 0 };
const observed = (id, primary = false) => ({ id, generation: id + "-1", primary, dpi: 96, rect: { ...rect }, pixelRect: { ...rect }, displayId: "monitor", status: "open", titleBar: { ...standardBar } });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const settle = () => new Promise(resolve => setImmediate(resolve));

/**
 * A fake native transport with the real host's close protocol: WM_CLOSE is
 * cancelled by AppWindow.Closing, which issues one token per window until the
 * app resolves it. The token is in the snapshot that requestClose returns.
 */
async function fixture({ beforeClose, pendingAtConnect = false } = {}) {
  let state = createWindowRegistry(), seq = 0, tokens = 0;
  let value = { schema: 1, ownerToken: "connection", sequence: 0, referenceDpi: 96, displays: [display], windows: [observed("main", true), observed("doc")], focusedId: "main", pendingCloses: [] };
  const listeners = new Set(), calls = [], errors = [], decisions = [];
  const report = () => JSON.stringify({ ...value, sequence: ++seq });
  const issueClose = id => {
    if (!value.pendingCloses.some(r => r.id === id)) value.pendingCloses = [...value.pendingCloses, { id, generation: id + "-1", token: "close-" + ++tokens }];
  };
  if (pendingAtConnect) issueClose("doc");
  const transport = {
    onSnapshot(listener) { listeners.add(listener); return { remove: () => listeners.delete(listener) }; },
    onError() { return { remove() {} }; },
    async connect() { return report(); },
    async read() { return report(); },
    async focus(owner, id) { calls.push(["focus", id]); value.focusedId = id; return report(); },
    async minimize(owner, id) { calls.push(["minimize", id]); value.windows.find(w => w.id === id).status = "minimized"; if (value.focusedId === id) value.focusedId = null; return report(); },
    async restore(owner, id) { calls.push(["restore", id]); value.windows.find(w => w.id === id).status = "open"; return report(); },
    async setTitleBar(owner, id, style) { calls.push(["setTitleBar", id, style]); value.windows.find(w => w.id === id).titleBar = { style, leading: 0, trailing: 138, height: 32 }; return report(); },
    async requestClose(owner, id) { calls.push(["requestClose", id]); issueClose(id); return report(); },
    async resolveClose(owner, id, generation, token, accepted) {
      calls.push(["resolveClose", id, accepted]);
      if (!value.pendingCloses.some(r => r.id === id && r.generation === generation && r.token === token)) throw new Error("Stale native close request");
      value.pendingCloses = value.pendingCloses.filter(r => r.id !== id);
      if (accepted) value.windows = value.windows.filter(w => w.id !== id);
      return report();
    },
    async dispose() {},
  };
  const bridge = createWindowsChromeBridge({
    owner: { getState: () => state, commit: next => { state = next; } },
    beforeClose: beforeClose ?? (id => { decisions.push(id); return false; }),
    onError: error => errors.push(error),
  });
  const host = await connectWindowsWindowHost(transport, { primaryWindowId: "main", componentName: "Document", owner: bridge.owner, onCloseRequested: bridge.onCloseRequested, onError: error => errors.push(error) });
  const chrome = bridge.attach(host);
  return { host, chrome, bridge, transport, calls, errors, decisions, state: () => state,
    systemClose(id) { issueClose(id); for (const listener of listeners) listener(report()); } };
}
const has = (f, id) => f.state().windows.some(w => w.id === id);
const count = (f, name) => f.calls.filter(c => c[0] === name).length;

test("chrome close while the app vetoes keeps the window and resolves vetoed", async () => {
  const f = await fixture();
  const title = createWindowChromeController(f.chrome, "doc");
  assert.deepEqual(await title.run("close"), { command: "close", status: "vetoed" });
  assert.deepEqual(f.decisions, ["doc"]);
  assert.deepEqual(f.calls.filter(c => c[0] === "resolveClose"), [["resolveClose", "doc", false]]);
  assert.equal(has(f, "doc"), true); assert.equal(f.host.snapshot().pendingCloses.length, 0);
  title.dispose(); await f.host.dispose();
});

test("chrome close the app allows resolves closed only after the native window is gone", async () => {
  const f = await fixture({ beforeClose: () => true });
  const result = await f.chrome.requestClose("doc");
  assert.deepEqual(result, { closed: true });
  assert.equal(has(f, "doc"), false); assert.equal(f.host.snapshot().windows.some(w => w.id === "doc"), false);
  await assert.rejects(f.chrome.requestClose("doc"), /not owned/);
  await f.host.dispose();
});

test("a system close with no caller runs the same app decision", async () => {
  let allow = false;
  const f = await fixture({ beforeClose: id => { f.decisions.push(id); return allow; } });
  f.systemClose("doc"); await settle(); await settle();
  assert.deepEqual(f.decisions, ["doc"]); assert.equal(has(f, "doc"), true);
  assert.equal(count(f, "requestClose"), 0);
  allow = true; f.systemClose("doc"); await settle(); await settle();
  assert.deepEqual(f.decisions, ["doc", "doc"]); assert.equal(has(f, "doc"), false);
  assert.deepEqual(f.errors, []); await f.host.dispose();
});

test("concurrent close requests for one window share one decision", async () => {
  const gate = deferred(), decided = [];
  const f = await fixture({ beforeClose: id => { decided.push(id); return gate.promise; } });
  const first = f.chrome.requestClose("doc"), second = f.chrome.requestClose("doc");
  assert.equal(first, second);
  await settle();
  // A system close arriving meanwhile joins the same decision instead of starting another.
  assert.equal(f.chrome.requestClose("doc"), first);
  gate.resolve(true);
  assert.deepEqual(await first, { closed: true });
  assert.deepEqual(decided, ["doc"]); assert.equal(count(f, "requestClose"), 1); assert.equal(count(f, "resolveClose"), 1);
  await f.host.dispose();
});

test("a chrome close joins a system close that is already being decided", async () => {
  const gate = deferred(), decided = [];
  const f = await fixture({ beforeClose: id => { decided.push(id); return gate.promise; } });
  f.systemClose("doc"); await settle();
  const joined = f.chrome.requestClose("doc");
  gate.resolve(false);
  assert.deepEqual(await joined, { closed: false, reason: "vetoed" });
  assert.deepEqual(decided, ["doc"]); assert.equal(count(f, "requestClose"), 0);
  await f.host.dispose();
});

test("a throwing or rejecting decision vetoes and is reported", async () => {
  for (const beforeClose of [() => { throw new Error("guard threw"); }, () => Promise.reject(new Error("guard rejected"))]) {
    const f = await fixture({ beforeClose });
    assert.deepEqual(await f.chrome.requestClose("doc"), { closed: false, reason: "vetoed" });
    assert.equal(has(f, "doc"), true);
    assert.match(String(f.errors[0]), /guard (threw|rejected)/);
    assert.deepEqual(f.calls.filter(c => c[0] === "resolveClose"), [["resolveClose", "doc", false]]);
    await f.host.dispose();
  }
});

test("a failed native close rejects the waiting caller; on the system path it is reported", async () => {
  const f = await fixture({ beforeClose: () => true });
  f.transport.resolveClose = async () => { throw new Error("OS refused"); };
  await assert.rejects(f.chrome.requestClose("doc"), /OS refused/);
  assert.equal(f.errors.length, 0);
  f.transport.requestClose = async () => { throw new Error("WM_CLOSE failed"); };
  await assert.rejects(f.chrome.requestClose("main"), /WM_CLOSE failed/);
  const g = await fixture({ beforeClose: () => true });
  g.transport.resolveClose = async () => { throw new Error("OS refused"); };
  g.systemClose("doc"); await settle(); await settle();
  assert.match(String(g.errors[0]), /OS refused/);
  await f.host.dispose(); await g.host.dispose();
});

test("a close request issued during connection is decided once the host is attached", async () => {
  const decided = [];
  const f = await fixture({ pendingAtConnect: true, beforeClose: id => { decided.push(id); return true; } });
  await settle(); await settle();
  assert.deepEqual(decided, ["doc"]); assert.equal(has(f, "doc"), false);
  await f.host.dispose();
});

test("chrome minimize and restore go through the native host, and subscribers follow owner commits", async () => {
  const f = await fixture();
  const title = createWindowChromeController(f.chrome, "doc"), seen = [];
  title.subscribe(() => seen.push(title.getSnapshot().status));
  assert.deepEqual(await title.run("minimize"), { command: "minimize", status: "done" });
  assert.equal(f.state().windows.find(w => w.id === "doc").status, "minimized");
  assert.deepEqual(await title.run("restore"), { command: "restore", status: "done" });
  assert.equal(f.state().windows.find(w => w.id === "doc").status, "open");
  assert.equal(f.state().focusedId, "doc");
  assert.deepEqual(f.calls.filter(c => ["minimize", "restore", "focus"].includes(c[0])), [["minimize", "doc"], ["restore", "doc"], ["focus", "doc"]]);
  assert.ok(seen.includes("minimized") && seen.at(-1) === "open");
  title.dispose(); await f.host.dispose();
});

test("observed title-bar insets reach chrome subscribers and the core title-bar model", async () => {
  const f = await fixture();
  let notified = 0;
  f.chrome.subscribe(() => { notified++; });
  assert.deepEqual(f.chrome.titleBar("doc"), standardBar);
  await f.host.setTitleBar("doc", "extended");
  assert.ok(notified > 0);
  const bar = f.chrome.titleBar("doc");
  assert.deepEqual(bar, { style: "extended", leading: 0, trailing: 138, height: 32 });
  const model = describeTitleBar(f.chrome.getState(), "doc", { controls: { kind: "native", insets: bar } });
  assert.deepEqual(model.insets, { leading: 0, trailing: 138, height: 32 });
  assert.equal(f.chrome.titleBar("absent"), undefined);
  await f.host.dispose();
});

test("bridge attaches once and disposal rejects pending closes", async () => {
  const gate = deferred();
  const f = await fixture({ beforeClose: () => gate.promise });
  assert.throws(() => f.bridge.attach(f.host), /already attached/);
  const pending = f.chrome.requestClose("doc"); await settle();
  f.bridge.dispose();
  await assert.rejects(pending, /disposed/);
  await assert.rejects(f.chrome.requestClose("main"), /disposed/);
  gate.resolve(false); await settle();
  await f.host.dispose();
});
