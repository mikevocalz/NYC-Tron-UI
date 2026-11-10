import test from "node:test";
import assert from "node:assert/strict";
import { createRowHeightIndex } from "../src/components/data/tree-row-heights.ts";

test("unmeasured rows use the estimate", () => {
  const index = createRowHeightIndex(10, 48);
  assert.equal(index.count, 10);
  assert.equal(index.totalHeight(), 480);
  assert.equal(index.offsetOf(0), 0);
  assert.equal(index.offsetOf(3), 144);
  assert.equal(index.offsetOf(10), 480);
  assert.equal(index.heightOf(4), 48);
  assert.equal(index.isMeasured(4), false);
});

test("setHeight updates prefix sums for later rows only", () => {
  const index = createRowHeightIndex(5, 40);
  assert.equal(index.setHeight(1, 100), true);
  assert.equal(index.offsetOf(1), 40);
  assert.equal(index.offsetOf(2), 140);
  assert.equal(index.offsetOf(5), 260);
  assert.equal(index.totalHeight(), 260);
  assert.equal(index.isMeasured(1), true);
  assert.equal(index.heightOf(1), 100);
});

test("setHeight reports no change for an identical measurement and handles shrinking", () => {
  const index = createRowHeightIndex(3, 40);
  assert.equal(index.setHeight(0, 40), true, "first measurement marks the row measured");
  assert.equal(index.setHeight(0, 40), false);
  assert.equal(index.setHeight(0, 20), true);
  assert.equal(index.totalHeight(), 100);
});

test("indexAtOffset finds the row containing a scroll offset", () => {
  const index = createRowHeightIndex(4, 50);
  index.setHeight(1, 150);
  // rows: [0,50) [50,200) [200,250) [250,300)
  assert.equal(index.indexAtOffset(0), 0);
  assert.equal(index.indexAtOffset(49.9), 0);
  assert.equal(index.indexAtOffset(50), 1);
  assert.equal(index.indexAtOffset(199), 1);
  assert.equal(index.indexAtOffset(200), 2);
  assert.equal(index.indexAtOffset(299), 3);
});

test("indexAtOffset clamps outside the content and returns -1 when empty", () => {
  const index = createRowHeightIndex(3, 10);
  assert.equal(index.indexAtOffset(-5), 0);
  assert.equal(index.indexAtOffset(30), 2);
  assert.equal(index.indexAtOffset(1e9), 2);
  assert.equal(createRowHeightIndex(0, 10).indexAtOffset(0), -1);
  assert.equal(createRowHeightIndex(0, 10).totalHeight(), 0);
});

test("visibleRange returns the rows overlapping a viewport", () => {
  const index = createRowHeightIndex(100, 20);
  assert.deepEqual(index.visibleRange(0, 100), { start: 0, end: 5 });
  assert.deepEqual(index.visibleRange(30, 100), { start: 1, end: 7 });
  assert.deepEqual(index.visibleRange(1990, 500), { start: 99, end: 100 });
  assert.deepEqual(createRowHeightIndex(0, 20).visibleRange(0, 100), { start: 0, end: 0 });
});

test("resize keeps measured heights of surviving rows and estimates new ones", () => {
  const index = createRowHeightIndex(3, 30);
  index.setHeight(2, 90);
  index.resize(5);
  assert.equal(index.count, 5);
  assert.equal(index.heightOf(2), 90);
  assert.equal(index.heightOf(4), 30);
  assert.equal(index.totalHeight(), 30 + 30 + 90 + 30 + 30);
  index.resize(2);
  assert.equal(index.totalHeight(), 60);
  assert.throws(() => index.heightOf(2), RangeError);
});

test("reset forgets measurements and can change the estimate", () => {
  const index = createRowHeightIndex(3, 30);
  index.setHeight(0, 100);
  index.reset(60);
  assert.equal(index.totalHeight(), 180);
  assert.equal(index.isMeasured(0), false);
});

test("invalid input is rejected", () => {
  assert.throws(() => createRowHeightIndex(-1, 10), RangeError);
  assert.throws(() => createRowHeightIndex(1.5, 10), RangeError);
  assert.throws(() => createRowHeightIndex(3, 0), RangeError);
  assert.throws(() => createRowHeightIndex(3, NaN), RangeError);
  const index = createRowHeightIndex(3, 10);
  for (const h of [0, -1, NaN, Infinity]) assert.throws(() => index.setHeight(0, h), RangeError);
  for (const i of [-1, 3, 0.5]) assert.throws(() => index.setHeight(i, 10), RangeError);
  assert.throws(() => index.offsetOf(4), RangeError);
  assert.throws(() => index.offsetOf(-1), RangeError);
});

test("agrees with a brute-force model across random measurements", () => {
  const n = 500;
  const index = createRowHeightIndex(n, 24);
  const heights = Array.from({ length: n }, () => 24);
  let seed = 12345;
  const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let step = 0; step < 2000; step++) {
    const i = Math.floor(rand() * n);
    const h = 1 + Math.floor(rand() * 200);
    index.setHeight(i, h);
    heights[i] = h;
  }
  let sum = 0;
  for (let i = 0; i < n; i++) {
    assert.equal(index.offsetOf(i), sum);
    assert.equal(index.indexAtOffset(sum), i);
    assert.equal(index.indexAtOffset(sum + heights[i] - 0.5), i);
    sum += heights[i];
  }
  assert.equal(index.totalHeight(), sum);
});

test("one million rows build, measure and look up quickly", () => {
  const n = 1_000_000;
  const start = performance.now();
  const index = createRowHeightIndex(n, 32);
  for (let i = 0; i < 20_000; i++) index.setHeight(i * 50, 64);
  assert.equal(index.totalHeight(), n * 32 + 20_000 * 32);
  const mid = index.indexAtOffset(index.totalHeight() / 2);
  assert.ok(index.offsetOf(mid) <= index.totalHeight() / 2);
  assert.ok(index.offsetOf(mid + 1) > index.totalHeight() / 2);
  assert.ok(performance.now() - start < 3000);
});
