import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "@typescript/typescript6";

// Execute the actual component with mocked RN hosts and hook/store boundaries.
// These component-tree contracts do not claim React reconciliation or device focus.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
function harness() {
  const refs = [];
  let cursor = 0;
  let back;
  const element = (type, props) => ({ type, props });
  const mocks = {
    react: {
      useRef: value => refs[cursor++] ?? (refs[cursor - 1] = { current: value }),
      useEffect: effect => { effect(); },
    },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "react-native": {
      View: "View", Pressable: "Pressable", Text: "Text",
      BackHandler: { addEventListener: (_name, handler) => {
        back = handler; return { remove() {} };
      }},
    },
    "zustand/vanilla": { createStore: init => {
      let value = init();
      return { getState: () => value, setState: next => { value = {...value, ...next}; } };
    }},
    zustand: { useStore: (store, selector) => selector(store.getState()) },
  };
  const cache = new Map();
  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const exports = {};
    const code = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    runInNewContext(code, { exports, require: name => {
      if (mocks[name]) return mocks[name];
      if (name.startsWith("@nyc-tron/core/"))
        return load(resolve(root, "packages/core/src", name.split("/").at(-1) + ".ts"));
      return load(resolve(dirname(path), name));
    }}, { filename: path });
    cache.set(path, exports);
    return exports;
  }
  const { AdaptivePaneHost } = load(resolve(root, "packages/panes/src/components/AdaptivePaneHost.tsx"));
  return { render: props => { cursor = 0; return AdaptivePaneHost(props); },
    back: () => back?.() };
}
function children(node) {
  return [node?.props?.children].flat(Infinity).filter(Boolean);
}
function find(node, label) {
  if (node?.props?.accessibilityLabel === label) return node;
  for (const child of children(node)) {
    const result = find(child, label);
    if (result) return result;
  }
}
const base = {
  master: { type: "MasterContent" }, detail: { type: "DetailContent" },
  inspector: { type: "InspectorContent" },
  masterConfig: { present:true, minWidth:220, preferredWidth:300 },
  detailConfig: { minWidth:460 },
  inspectorConfig: { minWidth:210, preferredWidth:280 },
  container: { x:30, y:50, width:190, height:700 },
};
test("contained inspector owns its accessible close action and escape handler", () => {
  const h = harness(); let closes = 0;
  const tree = h.render({...base, inspectorOpen:true, onDismissInspector:()=>{closes++;}});
  const pane = find(tree, "Inspector pane");
  assert.equal(pane.props.accessibilityViewIsModal, true);
  const close = find(pane, "Close inspector");
  assert.ok(close, "Close belongs inside the modal subtree");
  close.props.onPress(); pane.props.onAccessibilityEscape();
  assert.equal(closes, 2);
  assert.equal(find(tree, "Detail pane").props.accessibilityElementsHidden, true);
});
test("compact master has an internal close action and hides covered detail", () => {
  const h = harness(); let closes = 0;
  const tree = h.render({...base, masterOpenOnCompact:true, onDismissMaster:()=>{closes++;}});
  const pane = find(tree, "Master pane");
  assert.equal(pane.props.accessibilityViewIsModal, true);
  find(pane, "Close master pane").props.onPress();
  pane.props.onAccessibilityEscape();
  assert.equal(closes, 2);
  assert.equal(find(tree, "Detail pane").props.importantForAccessibility, "no-hide-descendants");
});
test("top inspector is the sole modal when layered above a compact master", () => {
  const h = harness(); let masterCloses = 0, inspectorCloses = 0;
  const tree = h.render({...base, container:{...base.container,width:430},
    masterOpenOnCompact:true, inspectorOpen:true,
    onDismissMaster:()=>{masterCloses++;}, onDismissInspector:()=>{inspectorCloses++;}});
  assert.equal(find(tree, "Inspector pane").props.accessibilityViewIsModal, true);
  assert.equal(find(tree, "Master pane").props.accessibilityViewIsModal, false);
  assert.equal(find(tree, "Master pane").props.accessibilityElementsHidden, true);
  assert.equal(find(tree, "Master pane").props.pointerEvents, "none");
  assert.equal(h.back(), true);
  assert.equal(inspectorCloses, 1);
  assert.equal(masterCloses, 0);
});
test("closed panes disable pointer and accessibility exposure without dropping content", () => {
  const h = harness();
  const tree = h.render(base);
  for (const label of ["Master pane","Inspector pane"]) {
    const pane = find(tree,label);
    assert.equal(pane.props.pointerEvents,"none");
    assert.equal(pane.props.accessibilityElementsHidden,true);
    assert.equal(pane.props.onAccessibilityEscape,undefined);
  }
  assert.equal(children(find(tree,"Master pane"))[0],base.master);
  assert.equal(children(find(tree,"Inspector pane"))[0],base.inspector);
});
test("pane child slots and detail frame stay stable across inspector toggles", () => {
  const h = harness();
  const props = {...base,container:{...base.container,width:1000}};
  const closed = h.render(props);
  const open = h.render({...props,inspectorOpen:true});
  for (const label of ["Master pane","Detail pane","Inspector pane"]) {
    assert.equal(children(find(closed,label))[0],children(find(open,label))[0]);
  }
  assert.deepEqual(find(closed,"Detail pane").props.style[0],find(open,"Detail pane").props.style[0]);
});
const margins = { top:0, left:0, bottom:0, right:0 };
const duoHinge = { kind:"division", x:570, y:50, width:24, height:700, margins, active:true,
  orientation:"vertical", state:"flat", occlusionType:"full", separating:true };
test("regions from useReservedRegions place master and detail on opposite sides of the hinge", () => {
  const h = harness(); let plan;
  h.render({...base, container:{...base.container,width:1100}, regions:[duoHinge], onPlanChange:p=>{plan=p;}});
  assert.equal(plan.arrangement, "book");
  // Container starts at x=30, so the window hinge at 570 is local 540..564.
  assert.deepEqual({...plan.master.rect}, { x:0, y:0, width:540, height:700 });
  assert.deepEqual({...plan.detail.rect}, { x:564, y:0, width:536, height:700 });
  assert.ok(plan.master.rect.x + plan.master.rect.width <= 540, "master never crosses the hinge");
});
test("a half-opened horizontal fold in regions sets tabletop posture", () => {
  const h = harness(); let plan;
  const tabletop = { ...duoHinge, x:30, y:400, width:1000, height:0, orientation:"horizontal", state:"halfOpened" };
  h.render({...base, container:{...base.container,width:1000}, regions:[tabletop],
    masterConfig:{...base.masterConfig, minHeight:200}, detailConfig:{...base.detailConfig, minHeight:200},
    onPlanChange:p=>{plan=p;}});
  assert.equal(plan.arrangement, "tabletop");
});
test("explicit features and posture win over regions; regions still need a container", () => {
  const h = harness(); let plan;
  h.render({...base, container:{...base.container,width:1000}, regions:[duoHinge], features:[], onPlanChange:p=>{plan=p;}});
  assert.equal(plan.arrangement, "side-by-side");
  const { container: _c, ...noContainer } = base;
  assert.throws(() => h.render({...noContainer, regions:[duoHinge]}), /window-space container/);
  // An inactive UIKit division (flat Duo) is not separating and needs nothing.
  assert.doesNotThrow(() => h.render({...noContainer, regions:[{ ...duoHinge, active:false,
    orientation:undefined, state:undefined, occlusionType:undefined, separating:undefined }]}));
});
