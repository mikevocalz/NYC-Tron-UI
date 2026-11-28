import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { printFlowFailure } from './native-proof.mjs';

test('a failed flow prints the failing command and the timestamped debug log', () => {
  const directory = mkdtempSync(join(tmpdir(), 'flow-failure-'));
  const junit = join(directory, 'report.xml'), debug = join(directory, 'debug'), stamp = join(debug, '2026-11-28_044259');
  mkdirSync(stamp, { recursive: true });
  writeFileSync(junit, '<failure>Unknown error</failure>\n');
  writeFileSync(join(stamp, 'commands-(flow.yaml).json'), JSON.stringify([
    { command: { launchAppCommand: { appId: 'x' } }, metadata: { status: 'COMPLETED', duration: 900 } },
    { command: { tapOnElement: null, assertConditionCommand: { condition: {} } }, metadata: { status: 'FAILED', duration: 30000, error: { message: 'Request for viewHierarchy failed' } } },
  ]));
  writeFileSync(join(stamp, 'maestro.log'), 'first\nXCTest driver stopped responding\n');
  let out = '';
  printFlowFailure({ label: 'ios/root', junit, debug }, text => { out += text; });
  assert.match(out, /--- ios\/root report\.xml ---\n<failure>Unknown error<\/failure>/);
  assert.match(out, /1\. launchAppCommand COMPLETED 900ms\n2\. assertConditionCommand FAILED 30000ms error: Request for viewHierarchy failed/);
  assert.match(out, /debug 2026-11-28_044259\/maestro\.log \(last 80 lines\) ---\nfirst\nXCTest driver stopped responding/);
});

test('a failed flow with no debug files says so instead of printing nothing', () => {
  const directory = mkdtempSync(join(tmpdir(), 'flow-failure-'));
  let out = '';
  printFlowFailure({ label: 'android/direct', junit: join(directory, 'report.xml'), debug: join(directory, 'debug') }, text => { out += text; });
  assert.match(out, /--- android\/direct debug output ---\nno debug files/);
});
