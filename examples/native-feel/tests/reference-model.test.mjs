import { test } from "node:test";
import assert from "node:assert/strict";
import { createReferenceModel, referenceLibrary } from "../reference-model.ts";

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test("a newer library read wins and a disposed owner rejects late commits", async () => {
  const first = deferred(), second = deferred();
  let calls = 0;
  const signals = [];
  const model = createReferenceModel({ loadLibrary: signal => { signals.push(signal); return calls++ === 0 ? first.promise : second.promise; } });
  const readA = model.loadLibrary();
  const readB = model.loadLibrary();
  assert.equal(signals[0].aborted, true);
  second.resolve(referenceLibrary);
  await readB;
  first.resolve([]);
  await readA;
  assert.equal(model.store.getState().library.items.length, 3);
  const pending = deferred();
  const abandoned = createReferenceModel({ loadLibrary: () => pending.promise });
  const read = abandoned.loadLibrary();
  abandoned.dispose();
  pending.resolve(referenceLibrary);
  await read;
  assert.equal(abandoned.store.getState().library.status, "loading");
});

test("library errors are distinct from emptiness and retry can recover", async () => {
  let failed = false;
  const model = createReferenceModel({ loadLibrary: async () => {
    if (!failed) { failed = true; throw new Error("Offline"); }
    return [];
  } });
  await model.loadLibrary();
  assert.equal(model.store.getState().library.status, "error");
  assert.equal(model.store.getState().library.error, "Offline");
  await model.loadLibrary();
  assert.equal(model.store.getState().library.status, "ready");
  assert.deepEqual(model.store.getState().library.items, []);
});

test("frame request ownership preserves notes and saves the reported frame time", async () => {
  const first = deferred(), second = deferred();
  const signals = [];
  let calls = 0;
  const model = createReferenceModel({ mediaSource: { label: "A source", loadFrame: (_time, signal) => {
    signals.push(signal); return calls++ === 0 ? first.promise : second.promise;
  } } });
  model.store.setState({ note: "  Keep this frame.  " });
  const a = model.loadFrame(0), b = model.loadFrame(300000);
  assert.equal(signals[0].aborted, true);
  second.resolve({ uri: "file://current.jpg", width: 64, height: 48, actualTimeUs: 275000, durationUs: 1000000, timing: "presentation" });
  await b;
  first.resolve({ uri: "file://old.jpg", width: 64, height: 48, actualTimeUs: 0, durationUs: 1000000, timing: "presentation" });
  await a;
  model.saveNote();
  assert.equal(model.store.getState().media.frame.uri, "file://current.jpg");
  assert.equal(model.store.getState().savedNote, "Keep this frame.");
  assert.equal(model.store.getState().savedTimeUs, 275000);
  model.navigate("settings");
  model.editPreferences({ name: "   " });
  model.savePreferences();
  assert.equal(model.store.getState().savedPreferences.name, "Fieldwork");
  assert.match(model.store.getState().preferenceError, /Enter a workspace name/);
  assert.equal(model.store.getState().savedNote, "Keep this frame.");
});
