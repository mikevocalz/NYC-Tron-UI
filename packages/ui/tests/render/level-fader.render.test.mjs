import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Runs the real LevelFader with mocked RN hosts and the real PanResponder
// config. This proves the preview/commit contract, not React reconciliation,
// native gesture arbitration or screen-reader output on a device.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/components");
function harness({ rtl = false } = {}) {
  const refs = [];
  let cursor = 0;
  let responder;
  const element = (type, props) => ({ type, props });
  const mocks = {
    react: { useRef: v => refs[cursor++] ?? (refs[cursor - 1] = { current: v }) },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "react-native": {
      View: "View", Text: "Text", Pressable: "Pressable",
      I18nManager: { isRTL: rtl },
      PanResponder: { create: config => { responder = config; return { panHandlers: {} }; } },
    },
    "zustand/vanilla": { createStore: init => {
      let value = init();
      return { getState: () => value, setState: next => { value = { ...value, ...next }; } };
    } },
    zustand: { useStore: (store, selector) => selector(store.getState()) },
  };
  const cache = new Map();
  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const exports = {};
    const code = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, verbatimModuleSyntax: false },
    }).outputText;
    cache.set(path, exports);
    runInNewContext(code, { exports, require: name => mocks[name] ?? load(resolve(dirname(path), name)) },
      { filename: path });
    return exports;
  }
  const { LevelFader } = load(resolve(src, "forge/audio/LevelFader.tsx"));
  const level = load(resolve(src, "forge/audio/level.ts"));
  return {
    level,
    render: props => { cursor = 0; return LevelFader(props); },
    gesture: () => responder,
  };
}
const kids = n => [n?.props?.children].flat(Infinity).filter(x => x && typeof x === "object");
function find(n, pred) {
  if (pred(n)) return n;
  for (const c of kids(n)) { const r = find(c, pred); if (r) return r; }
}
const track = tree => find(tree, n => n.props?.accessibilityRole === "adjustable");

test("drag previews on every distinct value and commits once on release", () => {
  const h = harness(); const previews = []; const commits = [];
  const props = { value: 1, label: "Vocals", length: 116,
    onChange: g => previews.push(g), onCommit: g => commits.push(g) };
  h.render(props);
  const g = h.gesture();
  g.onPanResponderGrant();
  g.onPanResponderMove({}, { dx: 0, dy: 50 });
  g.onPanResponderMove({}, { dx: 0, dy: 50 });
  g.onPanResponderMove({}, { dx: 0, dy: 100 });
  assert.equal(previews.length, 2, "repeat positions are not re-emitted");
  assert.equal(commits.length, 0, "no commit mid-drag");
  const tree = h.render(props);
  assert.equal(track(tree).props.accessibilityValue.now, 0);
  g.onPanResponderRelease();
  assert.deepEqual(commits, [0]);
});
test("a drag at 100 pt of travel moves 30 dB on the unity range", () => {
  const h = harness(); const commits = [];
  h.render({ value: h.level.dbToGain(-30), label: "Bass", length: 116, onCommit: g => commits.push(g) });
  const g = h.gesture();
  g.onPanResponderGrant();
  g.onPanResponderMove({}, { dx: 0, dy: -25 });
  g.onPanResponderRelease();
  assert.equal(commits.length, 1);
  assert.ok(Math.abs(h.level.gainToDb(commits[0]) + 15) < 1e-9);
});
test("cancelled drag restores the committed value without committing", () => {
  const h = harness(); const previews = []; const commits = [];
  const props = { value: 0.5, label: "Pad", onChange: g => previews.push(g), onCommit: g => commits.push(g) };
  h.render(props);
  const g = h.gesture();
  g.onPanResponderGrant();
  g.onPanResponderMove({}, { dx: 0, dy: -40 });
  g.onPanResponderTerminate();
  assert.equal(commits.length, 0);
  assert.equal(previews.at(-1), 0.5);
  assert.equal(track(h.render(props)).props.accessibilityValue.text, "-6.0 dB");
});
test("unchanged release does not commit", () => {
  const h = harness(); const commits = [];
  h.render({ value: 1, label: "Keys", onCommit: g => commits.push(g) });
  const g = h.gesture();
  g.onPanResponderGrant();
  g.onPanResponderMove({}, { dx: 0, dy: -30 });
  g.onPanResponderRelease();
  assert.equal(commits.length, 0, "already at the top of travel");
});
test("screen-reader actions step in dB and commit each step", () => {
  const h = harness(); const commits = []; const previews = [];
  const tree = h.render({ value: h.level.dbToGain(-6), label: "Drums",
    onChange: g => previews.push(g), onCommit: g => commits.push(g) });
  const t = track(tree);
  assert.equal(t.props.accessibilityLabel, "Drums");
  assert.equal(t.props.accessibilityActions.map(a => a.name).join(), "increment,decrement");
  assert.equal(t.props.accessibilityValue.text, "-6.0 dB");
  t.props.onAccessibilityAction({ nativeEvent: { actionName: "increment" } });
  t.props.onAccessibilityAction({ nativeEvent: { actionName: "decrement" } });
  assert.equal(commits.length, 2);
  assert.deepEqual(previews, commits);
  assert.ok(Math.abs(h.level.gainToDb(commits[0]) + 5) < 1e-9);
  assert.ok(Math.abs(h.level.gainToDb(commits[1]) + 7) < 1e-9);
});
test("disabled fader refuses gestures and steps", () => {
  const h = harness(); const commits = [];
  const tree = h.render({ value: 0.5, label: "FX", disabled: true, onCommit: g => commits.push(g) });
  assert.equal(h.gesture().onStartShouldSetPanResponder(), false);
  track(tree).props.onAccessibilityAction({ nativeEvent: { actionName: "increment" } });
  assert.equal(track(tree).props.accessibilityState.disabled, true);
  assert.equal(commits.length, 0);
});
test("horizontal travel follows reading direction in RTL", () => {
  for (const [rtl, dx] of [[false, 30], [true, -30]]) {
    const h = harness({ rtl }); const commits = [];
    h.render({ value: 0, label: "Send", orientation: "horizontal", onCommit: g => commits.push(g) });
    const g = h.gesture();
    g.onPanResponderGrant();
    g.onPanResponderMove({}, { dx, dy: 0 });
    g.onPanResponderRelease();
    assert.equal(commits.length, 1, `rtl=${rtl}`);
    assert.ok(commits[0] > 0);
  }
});
test("every pressable target is at least 44 pt", () => {
  const h = harness();
  const tree = h.render({ value: 0.5, label: "Mix", onCommit: () => {} });
  const t = track(tree);
  assert.ok(t.props.style.width >= 44);
  const buttons = [];
  (function walk(n) { if (n?.type === "Pressable") buttons.push(n); kids(n).forEach(walk); })(tree);
  assert.equal(buttons.length, 2);
  for (const b of buttons) {
    assert.ok(b.props.style.minWidth >= 44 && b.props.style.minHeight >= 44);
    assert.match(b.props.accessibilityLabel, /(Raise|Lower) Mix by 1 dB/);
  }
});
test("invalid values throw instead of rendering a fake level", () => {
  const h = harness();
  assert.throws(() => h.render({ value: NaN, label: "X", onCommit: () => {} }), { name: "RangeError" });
  assert.throws(() => h.render({ value: 1, label: "X", length: 20, onCommit: () => {} }), { name: "RangeError" });
});
