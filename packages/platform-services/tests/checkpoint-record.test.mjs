import test from "node:test";
import assert from "node:assert/strict";
import { encodeRecord, decodeRecord, validateStorageName, ownCheckpointStorage } from "../src/checkpoints/record.ts";

test("checkpoint records reject torn writes, wrong versions and byte corruption", async () => {
  const encoded = await encodeRecord(new Uint8Array([1, 2, 3, 4]), 7);
  assert.deepEqual(await decodeRecord(encoded), { generation: 7, bytes: new Uint8Array([1, 2, 3, 4]) });
  for (let length = 0; length < encoded.length; length++)
    assert.equal(await decodeRecord(encoded.subarray(0, length)), undefined);
  for (const offset of [0, 3, 12, 16, 20, 23]) {
    const corrupt = encoded.slice(); corrupt[offset] ^= 1;
    assert.equal(await decodeRecord(corrupt), undefined, `corrupt byte ${offset}`);
  }
});

test("checkpoint checksum respects selected byte views and owns bytes before yielding", async () => {
  const source = new Uint8Array(2 * 1024 * 1024 + 2).fill(37);
  const writing = encodeRecord(source.subarray(1, -1), 1);
  source.fill(99);
  const encoded = await writing;
  const padded = new Uint8Array(encoded.length + 2); padded.set(encoded, 1);
  const decoded = await decodeRecord(padded.subarray(1, -1));
  assert.equal(decoded.bytes.length, 2 * 1024 * 1024);
  assert.ok(decoded.bytes.every(byte => byte === 37));
  encoded.fill(0);
  assert.equal(decoded.bytes[0], 37);
});

test("checkpoint generation and path names cannot escape storage or silently overflow", async () => {
  for (const generation of [0, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])
    await assert.rejects(encodeRecord(new Uint8Array(), generation), RangeError);
  for (const key of ["", ".", "..", "../outside", "/tmp/file", "x\\file", "x\0file", "a".repeat(81)])
    assert.throws(() => validateStorageName(key), RangeError);
  validateStorageName("cadence-01_accepted");
});

test("closing storage drains accepted writes and rejects later work before releasing its backend", async () => {
  let finish; let released = false;
  const blocked = new Promise(resolve => { finish = resolve; });
  const storage = ownCheckpointStorage({ read: async () => undefined,
    write: async () => blocked, remove: async () => {} }, () => { released = true; });
  const writing = storage.write("document", new Uint8Array());
  const closing = storage.close();
  assert.equal(storage.close(), closing);
  await assert.rejects(storage.read("document"), /closed/);
  assert.equal(released, false);
  finish(); await writing; await closing;
  assert.equal(released, true);
});
