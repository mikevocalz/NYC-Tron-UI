import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Source-level contract; the list is not rendered, so no FlatList measurement is exercised here.
const here = dirname(fileURLToPath(import.meta.url));
const tree = readFileSync(resolve(here, "../src/components/data/TreeGrid.tsx"), "utf8");

test("TreeGrid records measured row heights and uses them when a scroll-to-index fails", () => {
  assert.match(tree, /from ["']\.\/tree-row-heights\.ts["']/);
  assert.match(tree, /createRowHeightIndex\(/);
  assert.match(tree, /createRowHeightIndex\(rows\.length/);
  assert.match(tree, /heights\.current\.setHeight\(/);
  assert.match(tree, /heights\.current\.offsetOf\(info\.index\)/);
});

test("TreeGrid still does not assume a fixed row height", () => {
  assert.ok(!/getItemLayout/.test(tree));
});
