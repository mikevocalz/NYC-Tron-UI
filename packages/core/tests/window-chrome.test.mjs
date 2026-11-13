import test from "node:test";
import assert from "node:assert/strict";
import {
  createPageWindowHost, createWindowChromeController, describeTitleBar,
  DEFAULT_WINDOW_CONTROL_LABELS, NO_TITLE_BAR_INSETS,
} from "../src/window-chrome.ts";

const rect = { x: 0, y: 0, width: 640, height: 480 };
const commands = list => list.map(c => c.command);

test("drawn macos layout puts close, minimize and zoom before the title", () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  const model = describeTitleBar(host.getState(), "doc", { controls: { kind: "drawn", layout: "macos" }, zoomed: false });
  assert.deepEqual(commands(model.leading), ["close", "minimize", "zoom"]);
  assert.deepEqual(model.trailing, []);
  assert.equal(model.focused, true);
  assert.equal(model.leading[0].label, "Close window");
  assert.deepEqual(model.insets, NO_TITLE_BAR_INSETS);
});

test("drawn windows layout puts minimize, maximize and close after the title, and labels reflect zoom", () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  const rest = describeTitleBar(host.getState(), "doc", { controls: { kind: "drawn", layout: "windows" }, zoomed: false });
  assert.deepEqual(commands(rest.trailing), ["minimize", "zoom", "close"]);
  assert.equal(rest.trailing[1].label, "Maximize");
  const zoomed = describeTitleBar(host.getState(), "doc", { controls: { kind: "drawn", layout: "windows" }, zoomed: true });
  assert.equal(zoomed.trailing[1].label, DEFAULT_WINDOW_CONTROL_LABELS.windows.unzoom);
  assert.equal(zoomed.trailing[1].pressed, true);
});

test("no zoom control without host zoom; minimized windows show only restore", async () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  assert.deepEqual(commands(describeTitleBar(host.getState(), "doc", { controls: { kind: "drawn", layout: "macos" } }).leading), ["close", "minimize"]);
  await host.minimize("doc");
  const model = describeTitleBar(host.getState(), "doc", { controls: { kind: "drawn", layout: "windows" }, zoomed: false });
  assert.equal(model.status, "minimized");
  assert.deepEqual(commands(model.trailing), ["restore"]);
});

test("native mode draws nothing, carries insets and rejects invalid ones", () => {
  const state = createPageWindowHost().getState();
  const insets = { leading: 78, trailing: 0, height: 28 };
  const model = describeTitleBar(state, "gone", { controls: { kind: "native", insets } });
  assert.equal(model.status, "closed");
  assert.deepEqual(model.leading, []);
  assert.deepEqual(model.insets, insets);
  assert.throws(() => describeTitleBar(state, "gone", { controls: { kind: "native", insets: { ...insets, leading: -1 } } }), RangeError);
  assert.throws(() => describeTitleBar(state, "gone", { controls: { kind: "native", insets: { ...insets, height: Number.NaN } } }), RangeError);
});

test("pending command disables every drawn control; labels can be localized", () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  const model = describeTitleBar(host.getState(), "doc", { controls: { kind: "drawn", layout: "macos" }, pending: "close", labels: { close: "Fenster schließen" } });
  assert.ok(model.leading.every(control => control.enabled === false));
  assert.equal(model.leading[0].label, "Fenster schließen");
});

test("close guard that cancels keeps the window; one that proceeds removes it through the registry", async () => {
  let dirty = true;
  const host = createPageWindowHost({ beforeClose: () => !dirty });
  host.open({ id: "doc", displayId: "page", rect });
  const chrome = createWindowChromeController(host, "doc");
  assert.deepEqual(await chrome.run("close"), { command: "close", status: "vetoed" });
  assert.equal(host.getState().windows.length, 1);
  dirty = false;
  assert.deepEqual(await chrome.run("close"), { command: "close", status: "done" });
  assert.equal(host.getState().windows.length, 0);
  assert.equal(chrome.getSnapshot().status, "closed");
  assert.deepEqual(await chrome.run("minimize"), { command: "minimize", status: "ignored", reason: "closed" });
  chrome.dispose();
});

test("a throwing or rejecting close decision vetoes and is reported", async () => {
  const errors = [];
  let mode = "throw";
  const host = createPageWindowHost({
    beforeClose: () => { if (mode === "throw") throw new Error("guard failed"); return Promise.reject(new Error("guard rejected")); },
    onError: error => errors.push(error.message),
  });
  host.open({ id: "doc", displayId: "page", rect });
  assert.deepEqual(await host.requestClose("doc"), { closed: false, reason: "vetoed" });
  mode = "reject";
  assert.deepEqual(await host.requestClose("doc"), { closed: false, reason: "vetoed" });
  assert.deepEqual(errors, ["guard failed", "guard rejected"]);
  assert.equal(host.getState().windows.length, 1);
});

test("minimize and restore go through the registry and update focus", async () => {
  const host = createPageWindowHost();
  host.open({ id: "a", displayId: "page", rect });
  host.open({ id: "b", displayId: "page", rect });
  const chrome = createWindowChromeController(host, "b");
  const seen = [];
  chrome.subscribe(() => seen.push(chrome.getSnapshot()));
  assert.equal((await chrome.run("minimize")).status, "done");
  assert.equal(host.getState().windows.find(w => w.id === "b").status, "minimized");
  assert.equal(host.getState().focusedId, "a");
  assert.deepEqual(await chrome.run("minimize"), { command: "minimize", status: "ignored", reason: "unavailable" });
  assert.equal((await chrome.run("restore")).status, "done");
  assert.equal(host.getState().focusedId, "b");
  assert.ok(seen.some(s => s.pending === "minimize"));
  assert.equal(chrome.getSnapshot().pending, undefined);
});

test("a second command while one is in flight is ignored as busy; concurrent closes share one decision", async () => {
  let release, calls = 0;
  const host = createPageWindowHost({ beforeClose: () => { calls++; return new Promise(resolve => { release = resolve; }); } });
  host.open({ id: "doc", displayId: "page", rect });
  const chrome = createWindowChromeController(host, "doc");
  const first = chrome.run("close");
  assert.deepEqual(await chrome.run("close"), { command: "close", status: "ignored", reason: "busy" });
  const direct = host.requestClose("doc");
  release(true);
  assert.deepEqual(await first, { command: "close", status: "done" });
  assert.deepEqual(await direct, { closed: true });
  assert.equal(calls, 1);
});

test("zoom toggles through the host and appears in the snapshot", async () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  const chrome = createWindowChromeController(host, "doc");
  assert.equal(chrome.getSnapshot().zoomed, false);
  await chrome.run("zoom");
  assert.equal(chrome.getSnapshot().zoomed, true);
  await chrome.run("zoom");
  assert.equal(chrome.getSnapshot().zoomed, false);
});

test("host errors reject the command and clear the pending state", async () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  const failing = { ...host, minimize: async () => { throw new Error("native refused"); } };
  const chrome = createWindowChromeController(failing, "doc");
  await assert.rejects(chrome.run("minimize"), /native refused/);
  assert.equal(chrome.getSnapshot().pending, undefined);
  await assert.rejects(host.requestClose("missing"), /not owned/);
  await assert.rejects(chrome.run("explode"), TypeError);
  assert.throws(() => createWindowChromeController(host, " "), TypeError);
});

test("dispose stops notifications", async () => {
  const host = createPageWindowHost();
  host.open({ id: "doc", displayId: "page", rect });
  const chrome = createWindowChromeController(host, "doc");
  let count = 0;
  chrome.subscribe(() => count++);
  chrome.dispose();
  await host.minimize("doc");
  assert.equal(count, 0);
});
