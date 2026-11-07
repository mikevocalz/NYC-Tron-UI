import test from 'node:test';
import assert from 'node:assert/strict';
import { createMediaDecoder, toMediaPresentationIndex } from '../src/media/decoder.ts';

const baseNative = () => ({ probe: async () => ({}), decodeFrame: async () => ({}), decodeAudio: async () => ({}), clearCache: async () => {} });
const sample = () => ({ durationUs: 1_000_000, timesUs: [0, 40_000, 125_000, 900_000] });

test('old binaries and missing modules do not advertise a presentation index', () => {
  for (const decoder of [createMediaDecoder(null), createMediaDecoder(baseNative()), createMediaDecoder({ ...baseNative(), presentationIndexV1: 1 })]) {
    assert.equal(decoder.presentationIndexVersion, undefined);
    assert.equal(decoder.presentationIndex, undefined);
  }
});

test('the index preserves supplied nonuniform timestamps in an independent immutable result', () => {
  const input = sample();
  const result = toMediaPresentationIndex(input);
  assert.deepEqual(result, input);
  input.timesUs[1] = 1;
  assert.equal(result.timesUs[1], 40_000);
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.timesUs));
  assert.throws(() => { result.timesUs.push(950_000); }, TypeError);
});

test('invalid or incomplete timelines reject without sorting, truncating or synthesizing frames', () => {
  for (const payload of [null, {}, { ...sample(), durationUs: 0 }, { ...sample(), durationUs: Infinity },
    { ...sample(), durationUs: 1.5 }, { ...sample(), timesUs: [] }, { ...sample(), timesUs: [40_000, 0] },
    { ...sample(), timesUs: [0, 0] }, { ...sample(), timesUs: [-1] }, { ...sample(), timesUs: [0, 0.5] },
    { ...sample(), timesUs: [NaN] }, { ...sample(), timesUs: [1_000_000] },
    { ...sample(), timesUs: [Number.MAX_SAFE_INTEGER + 1] }]) {
    assert.throws(() => toMediaPresentationIndex(payload), { code: 'decode-failed' });
  }
  assert.throws(() => toMediaPresentationIndex(sample(), 3), { code: 'decode-failed' });
});

test('both the public parser and native facade independently validate the frame budget', async () => {
  let calls = 0;
  const decoder = createMediaDecoder({ ...baseNative(), presentationIndexV1: async () => { calls++; return sample(); } });
  assert.equal(decoder.presentationIndexVersion, 1);
  for (const maxFrames of [0, -1, 1.5, 200_001, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
    assert.throws(() => toMediaPresentationIndex(sample(), maxFrames), { code: 'out-of-range' });
    await assert.rejects(decoder.presentationIndex('file:///movie.mp4', { maxFrames }), { code: 'out-of-range' });
  }
  assert.equal(calls, 0);
});

test('the native call receives only the URI and frame budget and rejects an oversized result', async () => {
  const calls = [];
  const decoder = createMediaDecoder({ ...baseNative(), presentationIndexV1: async (...args) => { calls.push(args); return sample(); } });
  const result = await decoder.presentationIndex('file:///movie.mp4');
  assert.deepEqual(result.timesUs, sample().timesUs);
  assert.deepEqual(calls, [['file:///movie.mp4', 200_000]]);
  await assert.rejects(decoder.presentationIndex('file:///movie.mp4', { maxFrames: 3 }), { code: 'decode-failed' });
});

test('an already-cancelled lookup never allocates native indexing work', async () => {
  let calls = 0;
  const decoder = createMediaDecoder({ ...baseNative(), presentationIndexV1: async () => { calls++; return sample(); } });
  const cancellation = new AbortController(); cancellation.abort();
  await assert.rejects(decoder.presentationIndex('file:///movie.mp4', { signal: cancellation.signal }), { code: 'cancelled' });
  assert.equal(calls, 0);
});

test('late completion and rejection after cancellation are drained without publishing an index', async () => {
  for (const outcome of ['resolve', 'reject']) {
    let complete, fail;
    const native = new Promise((resolve, reject) => { complete = resolve; fail = reject; });
    let entered;
    const admission = new Promise(resolve => { entered = resolve; });
    const decoder = createMediaDecoder({ ...baseNative(), presentationIndexV1: () => { entered(); return native; } });
    const cancellation = new AbortController();
    const lookup = decoder.presentationIndex('file:///movie.mp4', { signal: cancellation.signal });
    await admission;
    cancellation.abort();
    await assert.rejects(lookup, { code: 'cancelled' });
    if (outcome === 'resolve') complete(sample()); else fail(Error('[decode-failed] Native lookup failed late'));
    await new Promise(resolve => setImmediate(resolve));
  }
});

test('native failures retain their public decoder error code', async () => {
  const decoder = createMediaDecoder({ ...baseNative(), presentationIndexV1: async () => { throw Error('[permission] Access expired'); } });
  await assert.rejects(decoder.presentationIndex('content://expired'), { code: 'permission' });
});
