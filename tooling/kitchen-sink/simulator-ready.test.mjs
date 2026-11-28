import test from 'node:test';
import assert from 'node:assert/strict';
import { requireBootedSimulator } from './native-proof.mjs';

const inventory = state => JSON.stringify({ devices: { 'com.apple.CoreSimulator.SimRuntime.iOS-27-2-iPhone19-4': [{ udid: 'UDID-1', state }] } });

test('a booted simulator is confirmed with bootstatus and no warning', () => {
  const calls = [], written = [];
  const result = requireBootedSimulator('UDID-1', args => { calls.push(args); return args[0] === 'list' ? inventory('Booted') : ''; }, text => written.push(text));
  assert.deepEqual(result, { before: 'Booted', after: 'Booted' });
  assert.deepEqual(calls.map(args => args[0]), ['list', 'bootstatus']);
  assert.deepEqual(calls[1], ['bootstatus', 'UDID-1', '-b']);
  assert.equal(written.length, 0);
});

test('a simulator that dropped out is waited for and the state is printed', () => {
  const states = ['Shutdown', 'Booted'], written = [];
  const result = requireBootedSimulator('UDID-1', args => args[0] === 'list' ? inventory(states.shift()) : '', text => written.push(text));
  assert.deepEqual(result, { before: 'Shutdown', after: 'Booted' });
  assert.match(written.join(''), /UDID-1 was Shutdown before the flow/);
});

test('a simulator that never boots, or is missing, stops the proof before Maestro runs', () => {
  assert.throws(() => requireBootedSimulator('UDID-1', args => args[0] === 'list' ? inventory('Shutdown') : '', () => {}), /is Shutdown, not Booted/);
  assert.throws(() => requireBootedSimulator('OTHER', args => args[0] === 'list' ? inventory('Booted') : '', () => {}), /is missing, not Booted/);
});
