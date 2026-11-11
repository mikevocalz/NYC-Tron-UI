import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pinnedDriverSha256, driverRelativePath } from './patch-driver-transport.mjs';

if (process.platform !== 'darwin' || process.arch !== 'arm64') throw new Error('The Foundation/socketpair probe requires the authorized native macOS ARM64 CI host.');
const consumer = process.argv[2] && resolve(process.argv[2]);
if (!consumer) throw new Error('Supply the prepared native acceptance consumer');
const proof = join(consumer, 'acceptance-transport');
const hash = value => createHash('sha256').update(value).digest('hex');
const receipt = JSON.parse(readFileSync(join(proof, 'patch-receipt.json'), 'utf8'));
assert.equal(receipt.scope, 'private-native-acceptance-consumer-only');
assert.equal(receipt.file, driverRelativePath); assert.equal(receipt.before.sha256, pinnedDriverSha256);
for (const version of ['before', 'after']) assert.equal(hash(readFileSync(join(proof, receipt[version].file))), receipt[version].sha256);
assert.equal(hash(readFileSync(join(consumer, driverRelativePath))), receipt.after.sha256);
const before = readFileSync(join(proof, receipt.before.file), 'utf8');
const after = readFileSync(join(proof, receipt.after.file), 'utf8');
const original = readFileSync(join(proof, 'SparkSend.original.inc.mm'), 'utf8');
const patched = readFileSync(join(proof, 'SparkSend.patched.inc.mm'), 'utf8');
assert.equal(hash(original), receipt.extractedFunctions.original.sha256);
assert.equal(hash(patched), receipt.extractedFunctions.patched.sha256);
assert.ok(before.includes(original.replace('SparkSendOriginal(', 'SparkSend(')), 'Probe original is not extracted from the verified original driver');
assert.ok(after.includes(patched.trimEnd()), 'Probe patched implementation is not the compiled driver implementation');
for (const [name, source] of [['probe.mm', 'driver-transport-probe.mm'], ['SparkSend.patched.inc.mm', 'driver-transport.inc.mm']]) {
  const input = receipt.inputs.find(value => value.path.endsWith(`/${source}`));
  assert.equal(hash(readFileSync(join(proof, name))), input.sha256);
}
let stage = 'compile';
try {
  const compile = spawnSync('/usr/bin/xcrun', ['clang++', '-std=c++20', '-fobjc-arc', '-fblocks', '-framework', 'Foundation', join(proof, 'probe.mm'), '-o', join(proof, 'probe')], { encoding: 'utf8', timeout: 60000, maxBuffer: 1024 * 1024 });
  writeFileSync(join(proof, 'probe-build.log'), (compile.stdout ?? '') + (compile.stderr ?? ''));
  if (compile.error || compile.status !== 0) throw compile.error ?? new Error(`Foundation probe compilation failed (${compile.status})`);
  stage = 'native-socketpair';
  const run = spawnSync(join(proof, 'probe'), [], { encoding: 'utf8', timeout: 20000, maxBuffer: 1024 * 1024 });
  writeFileSync(join(proof, 'probe-output.json'), run.stdout ?? '');
  writeFileSync(join(proof, 'probe-trace.log'), run.stderr ?? '');
  if (run.error || run.status !== 0) throw run.error ?? new Error(`Foundation/socketpair probe failed (${run.status})`);
  assert.doesNotMatch(run.stderr, /probe-private-/, 'Native trace exposed a request ID, argument, command, field, payload or exception reason');
  const result = JSON.parse(run.stdout);
  assert.equal(result.status, 'passed'); assert.equal(result.nativeInteractionsAccepted, false); assert.equal(result.cases.length, 7);
  assert.equal(result.cases[0].original.outcome, 'finite-response-preserved'); assert.equal(result.cases[0].patched.outcome, 'finite-response-preserved');
  assert.ok(result.cases.slice(1).every(value => value.patched.outcome === 'structured-failure'));
  const passed = { ...result, sourceRevision: receipt.sourceRevision, patchSha256: receipt.patchSha256, beforeSha256: receipt.before.sha256, afterSha256: receipt.after.sha256,
    platform: process.platform, architecture: process.arch, probeSourceSha256: hash(readFileSync(join(proof, 'probe.mm'))), executableSha256: hash(readFileSync(join(proof, 'probe'))),
    traceSha256: hash(readFileSync(join(proof, 'probe-trace.log'))), tracePrivacy: 'passed' };
  writeFileSync(join(proof, 'probe-result.json'), JSON.stringify(passed, null, 2) + '\n');
  console.info('Pinned Spark transport: seven original/patched native cases, trace privacy and explicit closed-peer failure passed. Native application acceptance remains separate.');
} catch (error) {
  writeFileSync(join(proof, 'probe-failure.json'), JSON.stringify({ schemaVersion: 1, status: 'failed', stage, sourceRevision: receipt.sourceRevision, patchSha256: receipt.patchSha256, error: error.message }, null, 2) + '\n');
  throw error;
}
