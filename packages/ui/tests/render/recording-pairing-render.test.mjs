import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Runs the real components with mocked RN hosts and expands function
// components into host elements. Proves wiring and a11y props, not native
// reconciliation, layout or screen-reader output on a device.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/components");
function harness({ os = "ios", withOptions = true } = {}) {
  const announcements = [];
  let refs = [], cursor = 0;
  const element = (type, props, key) => ({ type, props: props ?? {}, key });
  const mocks = {
    react: {
      useRef: value => refs[cursor++] ?? (refs[cursor - 1] = { current: value }),
      useEffect: effect => { effect(); },
      useState: value => [value, () => {}],
      // Read the real waveform's gesture-store snapshot. This harness tests
      // parent wiring; subscription/reconciliation is covered by browser tests.
      useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
    },
    "react/jsx-runtime": { jsx: element, jsxs: element, Fragment: "Fragment" },
    "react-native": {
      View: "View", Text: "Text", Pressable: "Pressable", Modal: "Modal", ScrollView: "ScrollView",
      ActivityIndicator: "ActivityIndicator",
      Platform: { OS: os },
      PanResponder: { create: () => ({ panHandlers: {} }) },
      // react-native-web has only the plain announce; withOptions: false models it.
      AccessibilityInfo: withOptions
        ? { announceForAccessibilityWithOptions: (text, options) => announcements.push({ text, options }) }
        : { announceForAccessibility: text => announcements.push({ text, options: { priority: "low" } }) },
    },
  };
  const cache = new Map();
  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const exports = {};
    cache.set(path, exports);
    const code = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    runInNewContext(code, { exports, JSON, Math, Date, Number, String, RangeError, Array, Object,
      require: name => mocks[name] ?? load(resolve(dirname(path), name)) }, { filename: path });
    return exports;
  }
  const expand = node => {
    if (Array.isArray(node)) return node.flatMap(expand);
    if (!node || typeof node !== "object") return node === null || node === undefined || node === false ? [] : [node];
    if (typeof node.type === "function") return expand(node.type(node.props));
    const children = node.props.children === undefined ? [] : expand(node.props.children);
    return [{ type: node.type, props: { ...node.props, children } }];
  };
  const render = el => { cursor = 0; return expand(el); };
  const all = (tree, pred) => tree.filter(n => n && typeof n === "object").flatMap(n => [...(pred(n) ? [n] : []), ...all(n.props.children ?? [], pred)]);
  const text = n => (n.props.children ?? []).map(c => typeof c === "string" || typeof c === "number" ? String(c) : text(c)).join("");
  const buttons = tree => all(tree, n => n.type === "Pressable" && n.props.accessibilityRole === "button");
  const button = (tree, label) => buttons(tree).find(b => text(b).includes(label) || b.props.accessibilityLabel === label);
  return { load, render, all, text, buttons, button, announcements, reset: () => { refs = []; } };
}

test("DevicePairingDialog wires every state to the right callback", () => {
  const h = harness();
  const { DevicePairingDialog } = h.load(resolve(src, "forge/devices/DevicePairingDialog.tsx"));
  const calls = [];
  const cb = name => (...args) => calls.push([name, ...args]);
  const base = { visible: true, onScan: cb("scan"), onSelect: cb("select"), onCancel: cb("cancel"),
    onRetry: cb("retry"), onDone: cb("done"), deviceNoun: "pen" };
  const pen = { id: "p1", name: "Stylus", signalDbm: -70, detail: "Model S" };
  const at = state => h.render({ type: DevicePairingDialog, props: { ...base, state } });

  let tree = at({ kind: "idle" });
  h.button(tree, "Search for devices").props.onPress();
  tree = at({ kind: "scanning" });
  assert.ok(h.all(tree, n => n.type === "ActivityIndicator").length, "scanning shows progress");
  h.button(tree, "Stop searching").props.onPress();
  tree = at({ kind: "found", devices: [pen] });
  const row = h.buttons(tree).find(b => b.props.accessibilityLabel.startsWith("Connect to Stylus"));
  assert.equal(row.props.accessibilityLabel, "Connect to Stylus, Model S · Fair signal");
  assert.equal(row.props.accessibilityHint, undefined, "detail is content, not a hint");
  row.props.onPress();
  tree = at({ kind: "found", devices: [] });
  assert.match(h.text(h.all(tree, n => n.props.accessibilityLiveRegion === "polite")[0]), /No pen found/);
  h.button(tree, "Search again").props.onPress();
  tree = at({ kind: "connecting", device: pen });
  h.button(tree, "Cancel").props.onPress();
  tree = at({ kind: "connected", device: pen });
  h.button(tree, "Done").props.onPress();
  const modal = tree[0];
  modal.props.onRequestClose();
  tree = at({ kind: "error", code: "connection-failed" });
  h.button(tree, "Try again").props.onPress();
  h.all(tree, n => n.type === "Modal")[0].props.onRequestClose();
  assert.deepEqual(calls, [
    ["scan"], ["cancel"], ["select", "p1"], ["scan"], ["cancel"], ["done"], ["done"], ["retry"], ["cancel"],
  ]);
  // 44pt: every Pressable in the dialog uses the md Button (min-h-11) or a min-h-14 row.
  for (const state of [{ kind: "idle" }, { kind: "found", devices: [pen] }, { kind: "error", code: "radio-off" }]) {
    for (const b of h.buttons(at(state))) assert.match(b.props.className, /min-h-(11|14)/);
  }
});

test("permission errors offer Settings only when the app can open it", () => {
  const h = harness();
  const { DevicePairingDialog } = h.load(resolve(src, "forge/devices/DevicePairingDialog.tsx"));
  const noop = () => {};
  const props = { visible: true, onScan: noop, onSelect: noop, onCancel: noop, onRetry: noop, onDone: noop,
    state: { kind: "error", code: "permission-denied" } };
  assert.equal(h.button(h.render({ type: DevicePairingDialog, props }), "Open Settings"), undefined);
  let opened = 0;
  const tree = h.render({ type: DevicePairingDialog, props: { ...props, onOpenSettings: () => opened++ } });
  h.button(tree, "Open Settings").props.onPress();
  assert.equal(opened, 1);
  assert.ok(h.button(tree, "Ask again"));
});

test("RecordingTrack shows the meter only while recording and maps actions", () => {
  const h = harness();
  const { RecordingTrack } = h.load(resolve(src, "forge/audio/RecordingTrack.tsx"));
  const calls = [];
  const props = { peaks: [{ min: -0.5, max: 0.5 }], level: 0.3, onStart: () => calls.push("start"),
    onStop: () => calls.push("stop"), onRetry: () => calls.push("retry") };
  const at = state => { h.reset(); return h.render({ type: RecordingTrack, props: { ...props, state } }); };
  let tree = at({ kind: "idle" });
  assert.equal(h.all(tree, n => n.props.accessibilityRole === "progressbar").length, 0);
  h.button(tree, "Start recording").props.onPress();
  tree = at({ kind: "recording", durationMs: 61_000 });
  const meter = h.all(tree, n => n.props.accessibilityRole === "progressbar")[0];
  assert.equal(meter.props.accessibilityValue.text, "Input level good");
  assert.ok(h.all(tree, n => n.props.accessibilityLabel === "Elapsed 1 minute 1 second").length);
  assert.ok(h.all(tree, n => n.props.accessibilityLabel === "Live input waveform").length, "lane comes from WaveformLane");
  h.button(tree, "Stop and save").props.onPress();
  h.button(at({ kind: "interrupted", durationMs: 5, message: "Call started" }), "Save what was recorded").props.onPress();
  h.button(at({ kind: "no-input-device" }), "Try again").props.onPress();
  h.button(at({ kind: "error", message: "Stream failed" }), "Try again").props.onPress();
  assert.equal(h.buttons(at({ kind: "preparing" })).length, 0, "busy state has no action");
  assert.deepEqual(calls, ["start", "stop", "stop", "retry", "retry"]);
  assert.ok(h.announcements.length >= 1 && h.announcements.every(a => a.options.priority === "low"));
});

test("AudioPreview maps play, stop and retry and reports position", () => {
  const h = harness();
  const { AudioPreview } = h.load(resolve(src, "forge/audio/AudioPreview.tsx"));
  const calls = [];
  const props = { onPlay: () => calls.push("play"), onStop: () => calls.push("stop"), peaks: [] };
  const at = state => h.render({ type: AudioPreview, props: { ...props, state } });
  assert.equal(h.buttons(at({ kind: "empty" })).length, 0);
  h.button(at({ kind: "ready", durationMs: 2000 }), "Play recording").props.onPress();
  const playing = at({ kind: "playing", durationMs: 2000, positionMs: 1000 });
  assert.ok(h.all(playing, n => n.props.accessibilityLabel === "1 second of 2 seconds").length);
  h.button(playing, "Stop").props.onPress();
  h.button(at({ kind: "error", message: "Codec" }), "Try again").props.onPress();
  assert.deepEqual(calls, ["play", "stop", "play"]);
});

test("LevelMeter announces on react-native-web, which lacks the options variant", () => {
  const h = harness({ os: "web", withOptions: false });
  const { LevelMeter } = h.load(resolve(src, "forge/audio/LevelMeter.tsx"));
  assert.doesNotThrow(() => h.render({ type: LevelMeter, props: { level: 1, announce: true } }));
  assert.deepEqual(h.announcements.map(a => a.text), ["Input clipping"]);
});

test("a peak held at full scale stays inside the clipped track", () => {
  const h = harness();
  const { LevelMeter } = h.load(resolve(src, "forge/audio/LevelMeter.tsx"));
  const tree = h.render({ type: LevelMeter, props: { level: 1, peakHold: 1 } });
  const marker = h.all(tree, n => n.props.style?.width === 2)[0];
  assert.equal(marker.props.style.left, "100.0%");
  assert.equal(marker.props.style.marginLeft, -2, "pulled back by its own width");
});

test("disabled never traps a live take", () => {
  const h = harness();
  const { RecordingTrack } = h.load(resolve(src, "forge/audio/RecordingTrack.tsx"));
  const noop = () => {};
  const at = state => { h.reset(); return h.render({ type: RecordingTrack, props: { peaks: [], disabled: true, onStart: noop, onStop: noop, state } }); };
  assert.equal(h.button(at({ kind: "recording", durationMs: 1 }), "Stop and save").props.disabled, false);
  assert.equal(h.button(at({ kind: "interrupted", durationMs: 1, message: "x" }), "Save what was recorded").props.disabled, false);
  assert.equal(h.button(at({ kind: "idle" }), "Start recording").props.disabled, true);
});

test("AudioPreview tolerates a slightly negative playhead", () => {
  const h = harness();
  const { AudioPreview } = h.load(resolve(src, "forge/audio/AudioPreview.tsx"));
  const noop = () => {};
  assert.doesNotThrow(() => h.render({ type: AudioPreview,
    props: { onPlay: noop, onStop: noop, state: { kind: "playing", durationMs: 5000, positionMs: -12 } } }));
});

test("phase changes are announced on iOS only, where live regions are ignored", () => {
  for (const [os, expected] of [["ios", ["Recording"]], ["android", []], ["web", []]]) {
    const h = harness({ os });
    const { RecordingTrack } = h.load(resolve(src, "forge/audio/RecordingTrack.tsx"));
    const props = { peaks: [], onStart: () => {}, onStop: () => {} };
    h.render({ type: RecordingTrack, props: { ...props, state: { kind: "idle" } } });
    h.render({ type: RecordingTrack, props: { ...props, state: { kind: "recording", durationMs: 0 } } });
    assert.deepEqual(h.announcements.map(a => a.text), expected, os);
  }
});
