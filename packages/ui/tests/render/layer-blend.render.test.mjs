import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Shallow render of the real LayerBlendAndOpacity with mocked RN hosts and
// stubbed child components (MenuButton, PrecisionScrubber, ErrorMessage). It
// proves the element tree, props and callbacks the component hands to its
// children. It does not cover React reconciliation, native layout or what a
// screen reader says on a device.
const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../src/components/forge/layers/LayerBlendAndOpacity.tsx");
// Captured from LayerBlendAndOpacity.tsx at 1.0.0-rc.1 (main 693e068) with this
// harness, before alphaModes existed. Regenerate only from that source:
//   LAYER_BLEND_RC1_WRITE=1 node --experimental-strip-types --test <this file>
const goldenPath = resolve(here, "layer-blend-rc1.golden.json");

function harness() {
  const refs = [];
  let cursor = 0;
  const layoutEffects = [];
  const runs = [];
  const element = (type, props, key) => ({ type, props, key });
  const stub = name => ({ [name]: Object.defineProperty(() => null, "name", { value: name }) });
  const mocks = {
    react: { useRef: v => refs[cursor++] ?? (refs[cursor - 1] = { current: v }), useLayoutEffect: fn => { layoutEffects.push(fn); } },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "react-native": { View: "View", Text: "Text" },
    "../../shell/MenuButton.tsx": stub("MenuButton"),
    "../../feedback/ErrorMessage.tsx": stub("ErrorMessage"),
    "../inputs/PrecisionScrubber.tsx": stub("PrecisionScrubber"),
    "../../shell/useOwnedAction.ts": { useOwnedAction: () => ({ pending: null, error: undefined,
      run: (kind, operation) => { runs.push(kind); return Promise.resolve(operation(new AbortController().signal)); } }) },
    "../../styles.ts": { joinClasses: (...names) => names.filter(Boolean).join(" ") || undefined },
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
    runInNewContext(code, { exports, AbortController, JSON, Symbol, Promise,
      require: name => mocks[name] ?? load(resolve(dirname(path), name)) }, { filename: path });
    return exports;
  }
  const { LayerBlendAndOpacity } = load(source);
  return {
    runs,
    render: props => { cursor = 0; layoutEffects.length = 0; const tree = LayerBlendAndOpacity(props); for (const effect of layoutEffects) effect(); return tree; },
  };
}

// Functions become a marker so the snapshot compares structure, not identity.
const serialize = node => JSON.parse(JSON.stringify(node, (key, value) => {
  if (typeof value === "function") return value.name && /^[A-Z]/.test(value.name) ? "<" + value.name + ">" : "[Function]";
  return value;
}));
const kids = n => [n?.props?.children].flat(Infinity).filter(x => x && typeof x === "object");
function findAll(n, pred, out = []) {
  if (pred(n)) out.push(n);
  for (const c of kids(n)) findAll(c, pred, out);
  return out;
}
const named = name => n => n.type?.name === name;
const menu = (tree, label) => findAll(tree, n => named("MenuButton")(n) && n.props.label === label)[0];
const texts = tree => findAll(tree, n => n.type === "Text").map(n => [n.props.children].flat().join(""));

const modes = [{ id: "normal", label: "Normal" }, { id: "multiply", label: "Multiply" },
  { id: "legacy", label: "Legacy", unavailableReason: "Unsupported by compositor" }];
const spaces = [{ id: "linear", label: "Linear sRGB", transfer: "linear", modeIds: ["normal", "multiply", "legacy"] },
  { id: "encoded", label: "Encoded sRGB", transfer: "encoded", modeIds: ["normal"] }];
const value = { mode: "normal", opacity: 0.5, spaceId: "linear", alphaMode: "straight" };
const props = extra => ({ scope: "doc", layerId: "layer-1", value, modes, spaces, onCommit: () => {}, ...extra });

// Scenarios rendered without alphaModes. Each must match rc.1 element for element.
const rc1Scenarios = {
  straight: props(),
  premultiplied: props({ value: { ...value, alphaMode: "premultiplied" } }),
  retainedUnavailableMode: props({ value: { ...value, mode: "legacy" } }),
  disabledUnstyledEncoded: props({ disabled: true, unstyled: true, revision: 3, value: { ...value, spaceId: "encoded" } }),
};

test("without alphaModes the render matches rc.1 element for element", () => {
  const actual = Object.fromEntries(Object.entries(rc1Scenarios).map(([name, p]) => [name, serialize(harness().render(p))]));
  if (process.env.LAYER_BLEND_RC1_WRITE === "1") writeFileSync(goldenPath, JSON.stringify(actual, null, 1) + "\n");
  assert.deepEqual(actual, JSON.parse(readFileSync(goldenPath, "utf8")));
});
