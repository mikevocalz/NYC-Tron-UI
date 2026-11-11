import test from 'node:test';
import assert from 'node:assert/strict';
import { before, after, patchConstantsProvider } from './patch-expo-device-name.mjs';

test('replaces the single hostName read and nothing else', () => {
  const source = `a\n${before}b\n`;
  const patched = patchConstantsProvider(source);
  assert.equal(patched, `a\n${after}b\n`);
  assert.doesNotMatch(patched, /hostName/);
});
test('refuses a changed or duplicated context', () => {
  assert.throws(() => patchConstantsProvider('nothing'), /context changed/);
  assert.throws(() => patchConstantsProvider(before + before), /context changed/);
});
