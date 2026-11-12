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
