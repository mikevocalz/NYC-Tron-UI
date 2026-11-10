import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildQtCoverage, checkReactNativeApi, createSourceAuditor, renderQtCoverage, selectRuntimeExport, validateQtRows, verifyGeneratedReport } from "../qt-component-coverage.mjs";
import { parseCanonicalBaseline } from "../verify-component-program.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const canonical = parseCanonicalBaseline(readFileSync(join(root, "docs/completion/baseline-roster.tsv")));

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "nyc-tron-qt-"));
  t.after(() => rmSync(directory, { force: true, recursive: true }));
  const write = (path, contents) => {
    mkdirSync(dirname(join(directory, path)), { recursive: true });
    writeFileSync(join(directory, path), typeof contents === "string" ? contents : JSON.stringify(contents));
  };
  write("packages/control/package.json", {
    name: "@nyc-tron/control", exports: {
      ".": { types: "./dist/index.d.ts", qnx: "./dist/qt.js", marathon: "./dist/qt.js", "react-native": "./dist/mobile.js", default: "./dist/web.js" },
    },
  });
  write("packages/control/src/qt.ts", "export { value } from './service';\n");
  write("packages/control/src/mobile.ts", "import { Host } from '@expo/ui'; export const value = Host;\n");
  write("packages/control/src/web.ts", "export const value = 'web';\n");
  write("packages/control/src/service.ts", "export const value = 'default';\n");
  write("packages/control/src/service.native.ts", "import { provider } from 'native-service'; export const value = provider;\n");
  write("packages/control/src/service.qnx.ts", "export const value = 'qnx';\n");
  return { directory, write };
}

test("the checked-in map covers the exact frozen roster and matches current source resolution", () => {
  const report = buildQtCoverage();
  assert.equal(report.summary.canonical, 341);
  assert.equal(report.summary.local + report.summary.external, 341);
  assert.deepEqual(report.components.map(({ id, name }) => ({ id, name })), canonical);
  assert.deepEqual(report, JSON.parse(readFileSync(join(root, "docs/qt/component-coverage.json"), "utf8")));
  verifyGeneratedReport(join(root, "docs/qt/component-coverage.md"), renderQtCoverage(report));
  for (const target of ["qnx", "marathon"]) {
    assert.equal(Object.values(report.summary.targets[target].classifications).reduce((sum, count) => sum + count, 0), 341);
    assert.equal(report.summary.targets[target].runtimeAccepted, 0);
  }
});

test("generated-report validation accepts Windows checkouts but rejects stale content and whitespace", t => {
  const directory = mkdtempSync(join(tmpdir(), "nyc-tron-qt-newlines-"));
  t.after(() => rmSync(directory, { force: true, recursive: true }));
  for (const name of ["component-coverage.json", "component-coverage.md"]) {
    const path = join(directory, name);
    const canonical = readFileSync(join(root, "docs/qt", name), "utf8").replace(/\r\n/g, "\n");
    const windows = canonical.replace(/\n/g, "\r\n");
    assert.notEqual(windows, canonical, "the fixture must exercise CRLF conversion");
    writeFileSync(path, windows);
    assert.doesNotThrow(() => verifyGeneratedReport(path, canonical));
    writeFileSync(path, canonical);
    assert.doesNotThrow(() => verifyGeneratedReport(path, windows));
    for (const changed of [windows.replace("341", "340"), windows + " ", windows.replace(/\r\n$/, "")]) {
      assert.notEqual(changed, windows, "the stale fixture must change the report");
      writeFileSync(path, changed);
      assert.throws(() => verifyGeneratedReport(path, canonical), /is stale/);
    }
    rmSync(path);
    assert.throws(() => verifyGeneratedReport(path, canonical), /is stale/);
  }
});

test("row validation rejects scope loss, unsupported mappings and static-to-runtime promotion", () => {
  const rows = JSON.parse(readFileSync(join(root, "docs/qt/component-coverage.json"), "utf8")).components;
  for (const [mutate, pattern] of [
    [value => value.pop(), /341 canonical rows/],
    [value => value[1].id = value[0].id, /duplicate canonical/],
    [value => value[0].name = "InventedControl", /renamed/],
    [value => value[0].qtProfile = "automatic-native-support", /Unknown Qt profile/],
    [value => value[0].targets.qnx.runtimeAcceptance = "accepted", /static analysis into runtime acceptance/],
    [value => value[0].targets.marathon.unresolvedImports = ["./lost-provider"], /unresolved imports/],
    [value => value[0].publicExports = [], /no resolved public export/],
  ]) {
    const copy = structuredClone(rows);
    mutate(copy);
    assert.throws(() => validateQtRows(copy, canonical), pattern);
  }
});

test("runtime export selection respects condition order and excludes declarations", () => {
  const exports = { types: "./index.d.ts", qnx: "./qt.js", marathon: "./qt.js", "react-native": "./mobile.js", default: "./web.js" };
  assert.equal(selectRuntimeExport(exports, "qnx"), "./qt.js");
  assert.equal(selectRuntimeExport(exports, "marathon"), "./qt.js");
  assert.equal(selectRuntimeExport(exports, "source"), "./mobile.js");
  assert.equal(selectRuntimeExport({ "react-native": "./mobile.js", qnx: "./qt.js" }, "qnx"), "./mobile.js", "a late platform condition cannot override an already selected native export");
  const split = { import: "./esm.js", require: "./commonjs.js", default: "./fallback.js" };
  assert.equal(selectRuntimeExport(split, "qnx", "import"), "./esm.js");
  assert.equal(selectRuntimeExport(split, "qnx", "require"), "./commonjs.js");
});

test("selected package paths follow actual target-relative imports without counting unused mobile providers", t => {
  const f = fixture(t);
  const qnx = createSourceAuditor(f.directory, "qnx", []);
  assert.equal(qnx.exportedFile("@nyc-tron/control"), join(f.directory, "packages/control/src/qt.ts"));
  assert.deepEqual(qnx.audit(["packages/control/src/qt.ts"]).runtimeDependencies, []);
  const marathon = createSourceAuditor(f.directory, "marathon", []);
  assert.deepEqual(marathon.audit(["packages/control/src/qt.ts"]).runtimeDependencies, ["native-service"]);
});

test("explicit relative filenames preserve the emitted file instead of selecting a platform variant", t => {
  const f = fixture(t);
  f.write("packages/control/src/explicit.ts", "export { value } from './service.js';\n");
  const audit = createSourceAuditor(f.directory, "qnx", []).audit(["packages/control/src/explicit.ts"]);
  assert.ok(audit.sourceFiles.includes("packages/control/src/service.ts"));
  assert.ok(!audit.sourceFiles.includes("packages/control/src/service.qnx.ts"));
  assert.deepEqual(audit.runtimeDependencies, []);
});

test("runtime imports expose missing APIs and native providers while type-only imports stay erased", t => {
  const f = fixture(t);
  f.write("packages/control/src/probe.ts", `
    import type { Keyboard } from 'react-native';
    import { type ViewProps, View, AccessibilityInfo as A11y } from 'react-native';
    import { type Unused } from 'types-only-provider';
    import { requireNativeView } from 'expo';
    const view = requireNativeView('ActualNativeControl');
    const provider = import('lazy-native-provider');
    export const result = [View, A11y, view, provider];
  `);
  const audit = createSourceAuditor(f.directory, "qnx", ["View"]).audit(["packages/control/src/probe.ts"]);
  assert.deepEqual(audit.runtimeDependencies, ["expo", "lazy-native-provider", "react-native"]);
  assert.deepEqual(audit.reactNativeExports, ["AccessibilityInfo", "View"]);
  assert.deepEqual(audit.missingReactNativeExports, ["AccessibilityInfo"]);
  assert.equal(audit.nativeProviderCalls.length, 1);
  assert.match(audit.nativeProviderCalls[0], /ActualNativeControl/);
});

test("computed imports, namespace APIs and unresolved local edges remain visible", t => {
  const f = fixture(t);
  f.write("packages/control/src/probe.ts", `
    import * as RN from 'react-native';
    import './missing.js';
    export const result = [RN.View, require(providerName)];
  `);
  const audit = createSourceAuditor(f.directory, "qnx", ["View"]).audit(["packages/control/src/probe.ts"]);
  assert.equal(audit.namespaceReactNativeImport, true);
  assert.equal(audit.computedImports.length, 1);
  assert.deepEqual(audit.unresolvedImports, ["packages/control/src/probe.ts: ./missing.js"]);
});

test("mixed import and require edges select distinct internal package conditions", t => {
  const f = fixture(t);
  f.write("packages/dependency/package.json", { name: "@nyc-tron/dependency", exports: { ".": { import: "./dist/esm.js", require: "./dist/commonjs.js" } } });
  f.write("packages/dependency/src/esm.ts", "import 'esm-peer'; export const value = 1;\n");
  f.write("packages/dependency/src/commonjs.ts", "require('commonjs-peer');\n");
  f.write("packages/control/src/probe.ts", "import { value } from '@nyc-tron/dependency'; require('@nyc-tron/dependency'); export { value };\n");
  const audit = createSourceAuditor(f.directory, "qnx", []).audit(["packages/control/src/probe.ts"]);
  assert.deepEqual(audit.runtimeDependencies, ["commonjs-peer", "esm-peer"]);
});

test("the cross-repository public API check rejects drift instead of assuming generic RN parity", t => {
  const f = fixture(t);
  f.write("PublicAPI.js", "const api = { get View() { return actualView; }, get Text() { return actualText; } };\n");
  assert.equal(checkReactNativeApi(join(f.directory, "PublicAPI.js"), { exports: ["Text", "View"] }), 2);
  assert.throws(() => checkReactNativeApi(join(f.directory, "PublicAPI.js"), { exports: ["Text", "View", "Keyboard"] }), /exports drifted/);
  assert.throws(() => checkReactNativeApi(join(f.directory, "PublicAPI.js"), { exports: ["Text", "View"], sourceSha256: "0".repeat(64) }), /public entry changed/);
});
