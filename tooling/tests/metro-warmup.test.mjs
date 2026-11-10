import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { nativeBundleUrl, warmNativeBundle } from "../native/metro-warmup.mjs";

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "native-bundle-warmup-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return { directory, read: entry => JSON.parse(readFileSync(join(directory, "bundle-warmup-" + entry + ".json"), "utf8")) };
}

test("warmup requests the actual native Expo entry and consumes the complete JavaScript stream", async t => {
  const { directory, read } = fixture(t), source = "globalThis.nativeEntry = 'media';\n";
  const result = await warmNativeBundle({ platform: "ios", entry: "media", evidenceDirectory: directory,
    fetchImpl: async (url, options) => {
      const actual = new URL(url);
      assert.equal(actual.pathname, "/.expo/.virtual-metro-entry.bundle");
      assert.equal(actual.searchParams.get("platform"), "ios");
      assert.equal(actual.searchParams.get("runModule"), "true");
      assert.equal(options.redirect, "error");
      assert.ok(options.signal instanceof AbortSignal);
      return new Response(new ReadableStream({ start(controller) {
        controller.enqueue(new TextEncoder().encode(source.slice(0, 8)));
        controller.enqueue(new TextEncoder().encode(source.slice(8))); controller.close();
      } }), { headers: { "content-type": "application/javascript; charset=UTF-8" } });
    } });
  assert.equal(result.status, "ready");
  assert.equal(result.bytes, Buffer.byteLength(source));
  assert.equal(result.sha256, createHash("sha256").update(source).digest("hex"));
  assert.deepEqual(read("media"), result);
  assert.equal(new URL(nativeBundleUrl("android")).searchParams.get("platform"), "android");
  assert.throws(() => nativeBundleUrl("web"), /Unsupported/);
});

test("an available Metro status is insufficient: HTTP errors, wrong MIME and empty bundles fail", async t => {
  const { directory, read } = fixture(t);
  const cases = [
    { body: "transform error", status: 500, type: "application/javascript" },
    { body: "packager-status:running", status: 200, type: "text/plain" },
    { body: "", status: 200, type: "application/javascript" },
  ];
  for (const [i, value] of cases.entries()) {
    const entry = "failure-" + i;
    await assert.rejects(warmNativeBundle({ platform: "android", entry, evidenceDirectory: directory,
      fetchImpl: async () => new Response(value.body, { status: value.status, headers: { "content-type": value.type } }) }));
    assert.equal(read(entry).status, "failed");
    assert.equal(read(entry).sha256, undefined);
  }
});

test("warmup records bounded-download and timeout failures without a ready receipt", async t => {
  const { directory, read } = fixture(t);
  await assert.rejects(warmNativeBundle({ platform: "ios", entry: "large", evidenceDirectory: directory, maxBytes: 4,
    fetchImpl: async () => new Response("too large", { headers: { "content-type": "text/javascript" } }) }), /byte limit/);
  assert.equal(read("large").status, "failed");
  await assert.rejects(warmNativeBundle({ platform: "ios", entry: "timeout", evidenceDirectory: directory,
    fetchImpl: async () => { throw new DOMException("Bundle response timed out", "TimeoutError"); } }), /timed out/);
  assert.equal(read("timeout").status, "failed");
  assert.equal(read("timeout").sha256, undefined);
  await assert.rejects(warmNativeBundle({ platform: "ios", entry: "../unsafe", evidenceDirectory: directory }), /entry label/);
});
