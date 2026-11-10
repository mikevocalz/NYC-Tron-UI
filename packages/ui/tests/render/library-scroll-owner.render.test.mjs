import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { createStore } from "zustand/vanilla";
import ts from "typescript";

// Executes the actual screen, layout and AssetBrowser components with RN host
// nodes. This checks scroll ownership and callbacks, not native layout or gestures.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const ui = resolve(root, "packages/ui/src/components");
function harness(platform = "ios", options = {}) {
  const refs = [];
  let cursor = 0;
  const element = (type, props) => ({ type, props });
  const hosts = name => ({ [name]: props => element(name, props) });
  const mocks = {
    react: { useRef: value => refs[cursor++] ?? (refs[cursor - 1] = { current: value }),
      useMemo: fn => fn(), useLayoutEffect: () => {} },
    "react/jsx-runtime": { jsx: element, jsxs: element, Fragment: "Fragment" },
    "react-native": { View: "View", Text: "Text", Image: "Image", Pressable: "Pressable",
      ScrollView: "ScrollView", FlatList: "FlatList", ActivityIndicator: "ActivityIndicator", Platform: { OS: platform } },
    "zustand/vanilla": { createStore },
    zustand: { useStore: (store, select) => select(store.getState()) },
  };
  const cache = new Map([
    ...["Button", "Select", "SegmentedControl", "feedback/EmptyState", "feedback/ErrorMessage", "shell/InspectorSearch"]
      .map(path => [resolve(ui, `${path}.tsx`), hosts(path.split("/").at(-1))]),
    [resolve(ui, "shell/useOwnedAction.ts"), { useOwnedAction: () => ({ pending: null, error: undefined,
      run: (_id, fn) => fn(new AbortController().signal), cancel() {} }) }],
  ]);
  function load(path) {
    if (!existsSync(path)) path += ".tsx";
    if (cache.has(path)) return cache.get(path);
    const exports = {};
    cache.set(path, exports);
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
    } }).outputText;
    runInNewContext(code, { exports, AbortController, require: name => mocks[name] ?? load(
      name.startsWith("@nyc-tron/ui/components/") ? resolve(ui, name.slice("@nyc-tron/ui/components/".length))
        : resolve(dirname(path), name)) }, { filename: path });
    return exports;
  }
  const { LibraryDetailScreen } = load(resolve(root, "examples/native-feel/LibraryDetailScreen.tsx"));
  const { AssetBrowser } = load(resolve(ui, "shell/AssetBrowser.tsx"));
  const { createReferenceModel } = load(resolve(root, "examples/native-feel/reference-model.ts"));
  const model = createReferenceModel(options);
  function expand(node) {
    if (Array.isArray(node)) return node.map(expand);
    if (!node || typeof node !== "object") return node;
    if (typeof node.type === "function") return expand(node.type(node.props));
    if (node.type === "FlatList") {
      const header = expand(node.props.ListHeaderComponent), footer = expand(node.props.ListFooterComponent);
      const empty = expand(node.props.ListEmptyComponent);
      return { ...node, props: { ...node.props, ListHeaderComponent: header, ListFooterComponent: footer,
        ListEmptyComponent: empty, children: [header, node.props.data.length
          ? node.props.data.map((item, index) => expand(node.props.renderItem({ item, index }))) : empty, footer] } };
    }
    return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
  }
  return { model,
    render: () => { cursor = 0; return expand(LibraryDetailScreen({ model })); },
    renderAssets: props => { cursor = 0; return expand(AssetBrowser(props)); },
  };
}
function findAll(node, predicate, found = []) {
  if (Array.isArray(node)) { for (const child of node) findAll(child, predicate, found); return found; }
  if (!node || typeof node !== "object") return found;
  if (predicate(node)) found.push(node);
  findAll(node.props?.children, predicate, found);
  return found;
}
const byType = (tree, type) => findAll(tree, node => node.type === type);
const byId = (tree, testID) => findAll(tree, node => node.props?.testID === testID)[0];
const button = (tree, title) => findAll(tree, node => node.type === "Button" && node.props.title === title)[0];
const style = node => Object.assign({}, ...[node.props.style].flat(Infinity).filter(Boolean));
const values = tree => byType(tree, "Text").map(node => node.props.children);

for (const platform of ["ios", "android"]) test(`${platform}: Library has one virtualized scroll owner including heading and detail`, async () => {
  const h = harness(platform);
  await h.model.loadLibrary();
  let tree = h.render();
  assert.equal(byType(tree, "ScrollView").length, 0);
  assert.equal(byType(tree, "FlatList").length, 1);
  let list = byType(tree, "FlatList")[0];
  assert.equal(style(list).flex, 1);
  assert.equal(style(list).height, undefined);
  assert.equal(list.props.keyboardShouldPersistTaps, "handled");
  assert.ok(values(list.props.ListHeaderComponent).includes("Library"));
  assert.equal(byType(list.props.ListHeaderComponent, "SegmentedControl").length, 1);
  assert.ok(byId(list.props.ListFooterComponent, "reference-library-detail"));
  const row = byType(tree, "Pressable").find(node => node.props.accessibilityLabel.startsWith("Quiet forms,"));
  row.props.onPress({ nativeEvent: {} });
  assert.deepEqual([...h.model.store.getState().selectedIds], ["cover"]);
  tree = h.render(); list = byType(tree, "FlatList")[0];
  assert.equal(byId(list.props.ListFooterComponent, "reference-item-title").props.children, "Quiet forms");
  button(list.props.ListFooterComponent, "Save to collection").props.onPress();
  assert.deepEqual([...h.model.store.getState().favorites], ["cover"]);
});

test("native loading, retry and empty collection stay inside the same list slots", async () => {
  let fail = true;
  const h = harness("ios", { loadLibrary: async () => { if (fail) throw new Error("Source unavailable"); return []; } });
  let list = byType(h.render(), "FlatList")[0];
  assert.ok(byId(list.props.ListEmptyComponent, "reference-library-loading"));
  await h.model.loadLibrary();
  list = byType(h.render(), "FlatList")[0];
  assert.ok(byId(list.props.ListEmptyComponent, "reference-library-error"));
  fail = false;
  button(list.props.ListEmptyComponent, "Try library again").props.onPress();
  await new Promise(resolve => setImmediate(resolve));
  list = byType(h.render(), "FlatList")[0];
  assert.equal(byType(list.props.ListEmptyComponent, "EmptyState")[0].props.title, "Your library is empty");
  h.model.store.setState({ collection: "saved" });
  const empty = byType(byType(h.render(), "FlatList")[0].props.ListEmptyComponent, "EmptyState")[0];
  assert.equal(empty.props.exitAction.title, "Browse all work");
  empty.props.exitAction.onPress();
  assert.equal(h.model.store.getState().collection, "all");
  assert.equal(byType(h.render(), "ScrollView").length, 0);
});

test("web keeps its page scroll, adaptive columns and fixed asset viewport", async () => {
  const h = harness("web");
  await h.model.loadLibrary();
  const tree = h.render();
  assert.equal(byType(tree, "ScrollView").length, 1);
  assert.equal(style(byId(tree, "reference-library-columns")).flexWrap, "wrap");
  assert.equal(style(byType(tree, "FlatList")[0]).height, 510);
  assert.equal(byId(byType(tree, "FlatList")[0].props.ListFooterComponent, "reference-library-detail"), undefined);
  assert.ok(byId(tree, "reference-library-detail"));
});

test("AssetBrowser preserves defaults and measures composed headers for offscreen focus", () => {
  const h = harness();
  const props = { locationId: "root", revision: "1", entries: [], path: [], selectedIds: [],
    onSelectionChange() {}, onOpen() {}, onNavigate() {} };
  assert.equal(style(byType(h.renderAssets(props), "FlatList")[0]).height, 360);
  const header = { type: "Text", props: { children: "Before assets" } };
  const footer = { type: "Text", props: { children: "After assets" } };
  let list = byType(h.renderAssets({ ...props, height: "fill", header, footer }), "FlatList")[0];
  assert.ok(values(list.props.ListHeaderComponent).includes("Before assets"));
  assert.ok(values(list.props.ListFooterComponent).includes("After assets"));
  assert.ok(values(list.props.ListEmptyComponent).includes("This location is empty"));
  const calls = [];
  list.props.ref.current = { scrollToOffset: options => calls.push(options) };
  list.props.ListHeaderComponent.props.onLayout({ nativeEvent: { layout: { height: 241.2 } } });
  list = byType(h.renderAssets({ ...props, height: "fill", header, footer }), "FlatList")[0];
  list.props.onScrollToIndexFailed({ averageItemLength: 64, index: 8 });
  assert.equal(calls[0].offset, 242 + 64 * 8);
  assert.throws(() => h.renderAssets({ ...props, height: 43 }), /at least 44/);
  assert.throws(() => h.renderAssets({ ...props, height: Infinity }), /at least 44/);
});
