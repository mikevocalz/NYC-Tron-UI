import test from "node:test";
import assert from "node:assert/strict";
import { createMediaCache, estimateMediaCacheValue } from "../src/media-cache/media-cache.ts";

test("media cache evicts least-recently-used entries to satisfy byte and entry bounds", () => {
  const evicted = [];
  const cache = createMediaCache({ maxBytes: 100, maxEntries: 10,
    estimate: (_key, value) => value.size, onEvict: (key, value) => evicted.push([key, value.size]) });
  cache.set("a", { size: 40 });
  cache.set("b", { size: 40 });
  cache.get("a"); // refresh: b is now oldest
  cache.set("c", { size: 40 }); // evicts b (80 -> would be 120)
  assert.equal(cache.get("b"), undefined);
  assert.equal(cache.get("a").size, 40);
  assert.equal(cache.get("c").size, 40);
  assert.deepEqual(evicted, [["b", 40]]);
  assert.deepEqual(cache.stats(), { entries: 2, bytes: 80 });
  cache.close();
});

test("entry bound evicts even when bytes remain under the limit", () => {
  const cache = createMediaCache({ maxBytes: 1000, maxEntries: 2,
    estimate: (_key, value) => value });
  cache.set("one", 1);
  cache.set("two", 2);
  cache.set("three", 3);
  assert.equal(cache.has("one"), false);
  assert.equal(cache.has("two"), true);
  assert.equal(cache.has("three"), true);
  cache.close();
});

test("oversized and unestimable values are rejected without mutating the cache", () => {
  const cache = createMediaCache({ maxBytes: 10 });
  assert.throws(() => cache.set("big", new Uint8Array(11)), RangeError);
  assert.throws(() => cache.set("mystery", { nested: true }), TypeError);
  assert.deepEqual(cache.stats(), { entries: 0, bytes: 0 });
  cache.set("ok", new Uint8Array(10));
  assert.equal(cache.stats().bytes, 10);
  assert.throws(() => cache.set("", new Uint8Array(1)), RangeError);
  assert.throws(() => cache.set("x".repeat(513), new Uint8Array(1)), RangeError);
  cache.close();
});

test("replacement keeps accounting exact and peek does not refresh recency", () => {
  const evicted = [];
  const cache = createMediaCache({ maxBytes: 25,
    estimate: (_key, value) => value,
    onEvict: key => evicted.push(key) });
  cache.set("a", 10);
  cache.set("b", 10);
  cache.peek("a"); // must not refresh: b stays oldest
  cache.set("a", 20); // replaces a; 10+20 > 25 evicts b
  assert.equal(cache.get("b"), undefined);
  assert.deepEqual(evicted, ["b"]);
  assert.equal(cache.get("a"), 20);
  assert.equal(cache.stats().bytes, 20);
  cache.close();
});

test("close and clear drop references, report evictions and reject later writes", () => {
  const evicted = [];
  const cache = createMediaCache({ maxBytes: 100,
    estimate: (_key, value) => value.length,
    onEvict: key => evicted.push(key) });
  cache.set("x", new Uint8Array(4));
  cache.clear();
  assert.deepEqual(evicted, ["x"]);
  assert.equal(cache.get("x"), undefined);
  cache.set("y", new Uint8Array(4));
  cache.close();
  assert.equal(cache.get("y"), undefined);
  assert.throws(() => cache.set("z", new Uint8Array(1)), /closed/);
  cache.close(); // idempotent
  assert.deepEqual(cache.stats(), { entries: 0, bytes: 0 });
});

test("default estimator measures bytes-like values and wrappers only", () => {
  assert.equal(estimateMediaCacheValue(new Uint8Array(12)), 12);
  assert.equal(estimateMediaCacheValue(new ArrayBuffer(7)), 7);
  assert.equal(estimateMediaCacheValue({ bytes: new Uint8Array(5) }), 5);
  assert.throws(() => estimateMediaCacheValue({ peaks: [1, 2] }), TypeError);
  const cache = createMediaCache({ maxBytes: 4 });
  cache.set("view", new Float32Array(1));
  assert.equal(cache.stats().bytes, 4);
  cache.close();
});
