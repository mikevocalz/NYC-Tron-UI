import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { candidateArchives, prepareConsumer, sha256 } from './prepare-consumer.mjs';
import { proveNative } from './native-proof.mjs';

function packs(directory) {
  const output = join(directory, 'packs'); mkdirSync(output);
  for (const name of ['core', 'ui']) {
    const stage = join(directory, name); mkdirSync(join(stage, 'package'), { recursive: true });
    writeFileSync(join(stage, 'package/package.json'), JSON.stringify({ name: '@nyc-tron/' + name, version: '1.0.0-rc.2', private: true }));
    execFileSync('tar', ['-czf', join(output, `nyc-tron-${name}-1.0.0-rc.2.tgz`), '-C', stage, 'package']);
  }
  return output;
}
test('candidate identity and digest come from archive bytes; duplicate packages are rejected', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-archive-test-'));
  try {
    const output = packs(directory), actual = candidateArchives(output);
    assert.equal(actual.length, 2);
    assert.equal(actual[1].sha256, sha256(readFileSync(join(output, actual[1].filename))));
    writeFileSync(join(output, 'nyc-tron-ui-9.0.0.tgz'), readFileSync(join(output, actual[1].filename)));
    assert.throws(() => candidateArchives(output), /exactly one/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test('a downloaded archive index from another source revision cannot become consumer proof', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-index-test-'));
  try {
    const output = packs(directory), archives = candidateArchives(output);
    writeFileSync(join(output, 'candidate.json'), JSON.stringify({ sourceCommit: '0'.repeat(40), sourceDirty: false, version: archives[0].version, archives }));
    assert.throws(() => prepareConsumer({ packs: output, destination: join(directory, 'consumer'), install: false }), /index does not match/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('unindexed same-version archives cannot be assigned to the current source checkout', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-no-index-test-'));
  try {
    const output = packs(directory), destination = join(directory, 'consumer');
    assert.throws(() => prepareConsumer({ packs: output, destination, install: false }), /source-bound candidate index is required/);
    assert.equal(existsSync(destination), false);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

// Deliberately synthetic CLI/consumer fixtures exercise collector rejection only;
// these tests never interact with a device or produce usable release evidence.
function nativeHarness(directory, { version = '2.12.1', xml = '<testsuites><testsuite tests="1" failures="0"><testcase name="synthetic" status="SUCCESS"></testcase></testsuite></testsuites>' } = {}) {
  const consumer = join(directory, 'consumer'); mkdirSync(join(consumer, 'vendor'), { recursive: true });
  const archives = ['core', 'ui'].map(name => {
    const filename = `nyc-tron-${name}-1.0.0-rc.2.tgz`, bytes = Buffer.from('collector-test-only-' + name), integrity = 'collector-test-integrity-' + name;
    writeFileSync(join(consumer, 'vendor', filename), bytes);
    const installed = join(consumer, 'node_modules', '@nyc-tron', name); mkdirSync(installed, { recursive: true });
    writeFileSync(join(installed, 'package.json'), JSON.stringify({ name: '@nyc-tron/' + name, version: '1.0.0-rc.2' }));
    return { package: '@nyc-tron/' + name, filename, version: '1.0.0-rc.2', sha256: sha256(bytes), integrity };
  });
  writeFileSync(join(consumer, 'candidate.json'), JSON.stringify({ sourceDirty: true, version: '1.0.0-rc.2', archives }));
  writeFileSync(join(consumer, 'package-lock.json'), JSON.stringify({ packages: Object.fromEntries(archives.map(archive => ['node_modules/' + archive.package, { integrity: archive.integrity }])) }));
  const maestro = join(directory, 'synthetic-maestro');
  writeFileSync(maestro, `#!${process.execPath}\nconst fs=require('fs');const args=process.argv.slice(2);if(args.includes('--version')){console.log(${JSON.stringify(version)});}else{fs.writeFileSync(args[args.indexOf('--output')+1],${JSON.stringify(xml)});}\n`);
  chmodSync(maestro, 0o755);
  return { consumer, platform: 'android', device: 'synthetic-no-device', maestro, output: join(directory, 'proof') };
}
test('native collector rejects a different version containing the expected version as a prefix', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-native-version-'));
  try {
    const options = nativeHarness(directory, { version: '2.12.10' });
    assert.throws(() => proveNative(options), /exact pinned/);
    assert.equal(existsSync(join(options.output, 'android.json')), false);
    const diagnostics = JSON.parse(readFileSync(join(options.output, 'maestro-version.json'), 'utf8'));
    assert.equal(diagnostics.status, 0);
    assert.equal(diagnostics.stdout.trim(), '2.12.10');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test('native collector refuses an existing output containing prior screenshots', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-native-stale-'));
  try {
    const options = nativeHarness(directory); mkdirSync(options.output);
    writeFileSync(join(options.output, 'kitchen-direct-retained-shell.png'), Buffer.from('89504e470d0a1a0a', 'hex'));
    assert.throws(() => proveNative(options), { code: 'EEXIST' });
    assert.equal(existsSync(join(options.output, 'android.json')), false);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test('a successful new JUnit flow without a current-stage screenshot cannot emit a pass receipt', () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-native-image-'));
  try {
    const options = nativeHarness(directory);
    assert.throws(() => proveNative(options), /current-stage native screenshot/);
    assert.equal(existsSync(join(options.output, 'android.json')), false);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
for (const [name, xml] of [
  ['missing executed case', '<testsuites><testsuite tests="0"></testsuite></testsuites>'],
  ['failed case', '<testsuites><testsuite failures="1"><testcase status="SUCCESS"><failure/></testcase></testsuite></testsuites>'],
  ['skipped case', '<testsuites><testsuite skipped="1"><testcase status="SUCCESS"><skipped/></testcase></testsuite></testsuites>'],
]) test(`native collector rejects ${name} even when the CLI exits zero`, () => {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kitchen-native-junit-'));
  try {
    const options = nativeHarness(directory, { xml });
    assert.throws(() => proveNative(options), /executed passing flow/);
    assert.equal(existsSync(join(options.output, 'android.json')), false);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
