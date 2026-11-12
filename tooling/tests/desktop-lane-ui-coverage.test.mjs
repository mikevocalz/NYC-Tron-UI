import assert from "node:assert/strict";
import test from "node:test";
import { buildMatrix, classify, supportedExports } from "../desktop-lane/ui-coverage-matrix.mjs";
import { importSpecifiers, packageNameOf, selectExport } from "../desktop-lane/ui-coverage-model.mjs";

test("export conditions follow manifest order per lane", () => {
  const value = { types: "./a.d.ts", browser: "./a.web.js", "react-native": "./a.native.js", default: "./a.web.js" };
  assert.equal(selectExport(value, ["react-native", "import", "require", "default"]), "./a.native.js");
  assert.equal(selectExport(value, ["browser", "import", "require", "default"]), "./a.web.js");
});

test("import scanning ignores string contents and keeps real specifiers", () => {
  const source = 'import { a } from "./a.js";\nexport * from "./b.js";\nconst s = " from \\"fake\\" ";\nimport("lazy-peer");\n';
  assert.deepEqual(importSpecifiers(source).sort(), ["./a.js", "./b.js", "lazy-peer"]);
  assert.equal(packageNameOf("@expo/ui/swift-ui"), "@expo/ui");
  assert.equal(packageNameOf("zustand/vanilla"), "zustand");
});

test("a lane failure is only attributed when the web reference mounted the component", () => {
  assert.equal(classify("ok", "TypeError"), "pass");
  assert.equal(classify("Error: NYCTRON_UNRESOLVED uniwind is not resolvable", "ok"), "missing-peer");
  assert.equal(classify("TypeError: undefined is not a function", "ok"), "lane-failure");
  assert.equal(classify("RangeError: Invalid clip", "RangeError: Invalid clip"), "not-attributed");
  assert.equal(classify(undefined, "ok"), "not-run");
});

test("supported exports need a clean build, load and every component", () => {
  const run = entries => ({ results: { entries }, model: { entries: entries.map(e => ({ subpath: e.s, bare: e.s === "./c" ? ["uniwind"] : ["react"] })) }, resolution: new Map([["react", true], ["uniwind", false]]) });
  const reference = { results: { entries: [{ s: "./a", i: "ok", c: [["A", "ok"]] }, { s: "./b", i: "ok", c: [["B", "ok"], ["B2", "ok"]] }, { s: "./c", i: "ok", c: [["C", "ok"]] }] } };
  const lane = run([{ s: "./a", i: "ok", c: [["A", "ok"]] }, { s: "./b", i: "ok", c: [["B", "ok"], ["B2", "TypeError: x"]] }, { s: "./c", i: "Error: NYCTRON_UNRESOLVED uniwind", c: [] }]);
  const matrix = buildMatrix(reference, { windows: lane });
  assert.deepEqual(supportedExports(matrix, "windows"), ["./a"]);
  assert.equal(matrix.rows.find(r => r.subpath === "./b").lanes.windows.components.B2.status, "lane-failure");
  assert.equal(matrix.rows.find(r => r.subpath === "./c").lanes.windows.build, "unresolved");
  assert.equal(matrix.rows.find(r => r.subpath === "./c").lanes.windows.components.C.status, "missing-peer");
  assert.deepEqual(matrix.summary.windows.byStatus, { pass: 2, "lane-failure": 1, "missing-peer": 1 });
});

// Mirrors metro-runtime 0.83 guardedLoadModule: outside a module factory an
// evaluation error goes to ErrorUtils.reportFatalError and require returns
// undefined. That is how the Spark lane aborted and the RNW lane recorded
// failing exports as loaded with no components.
function metroLike(factory) {
  let handler = () => {};
  const errorUtils = {
    getGlobalHandler: () => handler,
    setGlobalHandler: next => { handler = next; },
    reportFatalError: error => handler(error, true),
  };
  const require = () => { try { return factory(); } catch (error) { errorUtils.reportFatalError(error); return undefined; } };
  return { errorUtils, require, current: () => handler };
}

test("an export that throws inside Metro's guard is reported to the harness, not the app", async () => {
  const { loadEntry } = await import("../desktop-lane/load-entry.js");
  const fatal = [];
  const metro = metroLike(() => { throw new Error("NYCTRON_UNRESOLVED uniwind is not resolvable in the macos lane"); });
  const original = error => fatal.push(error);
  metro.errorUtils.setGlobalHandler(original);
  assert.throws(() => loadEntry(metro.require, metro.errorUtils), /NYCTRON_UNRESOLVED uniwind/);
  assert.equal(fatal.length, 0);
  assert.equal(metro.current(), original);
});

test("a clean export loads and leaves the app's handler in place", async () => {
  const { loadEntry } = await import("../desktop-lane/load-entry.js");
  const metro = metroLike(() => ({ Button: () => null }));
  const original = () => {};
  metro.errorUtils.setGlobalHandler(original);
  assert.equal(typeof loadEntry(metro.require, metro.errorUtils).Button, "function");
  assert.equal(metro.current(), original);
  assert.throws(() => loadEntry(() => undefined, metro.errorUtils), /NYCTRON_EMPTY_MODULE/);
  assert.throws(() => loadEntry(() => { throw new TypeError("plain"); }, undefined), /plain/);
});

test("the support list strikes stubbed peers and keeps unattributed failures off the list", async () => {
  const { supportList } = await import("../desktop-lane/support-list.mjs");
  const cell = (build, load, components, unresolved = []) => ({ build, load, loadError: null, unresolved, components });
  const matrix = { summary: { macos: {} }, rows: [
    { subpath: "./a", lanes: { macos: cell("pass", "pass", { A: { status: "pass" } }) } },
    { subpath: "./b", lanes: { macos: cell("unresolved", "pass", { B: { status: "pass" } }, ["react-native-gesture-handler"]) } },
    { subpath: "./c", lanes: { macos: cell("pass", "pass", { C: { status: "not-attributed", error: "RangeError" } }) } },
    { subpath: "./d", lanes: { macos: cell("pass", "pass", { D: { status: "lane-failure", error: "TypeError" } }) } },
    { subpath: "./m", lanes: { macos: cell("pass", "pass", {}) } },
  ] };
  const list = supportList(matrix).macos;
  assert.deepEqual(list.supported, ["./a#A"]);
  assert.deepEqual(list.struck.map(s => [s.component, s.reason]), [["./b#B", "missing-peer"], ["./d#D", "lane-failure"]]);
  assert.deepEqual(list.unmeasured.map(s => s.component), ["./c#C"]);
  assert.deepEqual(list.modulesLoaded, ["./m"]);
});
