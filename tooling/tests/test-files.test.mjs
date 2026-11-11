import assert from "node:assert/strict";
import { test } from "node:test";
import { discoverTests } from "../test-files.mjs";

const files = discoverTests();

test("discovery lists every package test directory, not a hand-kept subset", () => {
  for (const expected of [
    "packages/core/tests/folds.test.mjs",
    "packages/panes/tests/adaptive-pane-host.test.mjs",
    "packages/native-controls/tests/native-ports.test.mjs",
    "packages/native-navigation/tests/rail.test.mjs",
    "packages/windows-fluent/rnw-fabric/tests/fabric-source.test.mjs",
    "packages/ui/tests/render/layer-stack.render.test.mjs",
    "packages/icons/tests/ownership.test.js",
  ]) {
    assert.ok(files.includes(expected), "missing " + expected);
  }
});

test("discovery skips Playwright browser suites and fixtures", () => {
  assert.equal(files.filter((f) => /\/(browser|fixtures|node_modules)\//.test(f)).length, 0);
});

test("discovery returns forward-slash relative paths, sorted", () => {
  assert.ok(files.every((f) => !f.includes("\\") && !f.startsWith("/")));
  assert.deepEqual(files, [...files].sort());
});
