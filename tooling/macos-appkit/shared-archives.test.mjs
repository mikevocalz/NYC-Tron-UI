import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink, cp, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copySharedCore } from './shared-archives.mjs';

async function fixture(t, name = '@nyc-tron/core') {
  const root = await mkdtemp(join(tmpdir(), 'appkit-archive-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = join(root, 'input'), output = join(root, 'output');
  await mkdir(join(input, 'package'), { recursive: true }); await mkdir(output);
  await writeFile(join(input, 'package/package.json'), JSON.stringify({ name, version: '1.0.0' }));
  const filename = 'nyc-tron-core-1.0.0.tgz';
  const archive = join(input, filename);
  const tar = spawnSync('tar', ['-czf', archive, '-C', input, 'package']);
  assert.equal(tar.status, 0);
  const bytes = await readFile(archive);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  await writeFile(join(input, 'SHA256SUMS'), `${sha256}  ${filename}\n`);
  return { input, output, archive, filename, bytes, sha256 };
}

test('copies only the requested core archive and preserves its bytes', async t => {
  const value = await fixture(t);
  const sums = await readFile(join(value.input, 'SHA256SUMS'), 'utf8');
  await writeFile(join(value.input, 'SHA256SUMS'), sums + `${'a'.repeat(64)}  nyc-tron-windows-fluent-1.0.0.tgz\n`);
  const receipt = await copySharedCore(value.input, value.output, '1.0.0');
  assert.deepEqual(receipt, { packageName: '@nyc-tron/core', filename: value.filename, sha256: value.sha256 });
  assert.deepEqual(await readFile(join(value.output, value.filename)), value.bytes);
});

test('rejects a changed archive before installing or copying it', async t => {
  const value = await fixture(t);
  await writeFile(value.archive, Buffer.concat([value.bytes, Buffer.from('changed')]));
  await assert.rejects(copySharedCore(value.input, value.output, '1.0.0'), /checksum does not match/);
  await assert.rejects(readFile(join(value.output, value.filename)), { code: 'ENOENT' });
});

test('rejects a valid hash for the wrong package identity', async t => {
  const value = await fixture(t, '@nyc-tron/other');
  await assert.rejects(copySharedCore(value.input, value.output, '1.0.0'), /identity or version/);
});

test('rejects duplicate checksums and archive source links', async t => {
  const value = await fixture(t);
  const sums = await readFile(join(value.input, 'SHA256SUMS'), 'utf8');
  await writeFile(join(value.input, 'SHA256SUMS'), sums + sums);
  await assert.rejects(copySharedCore(value.input, value.output, '1.0.0'), /duplicate/);
  await writeFile(join(value.input, 'SHA256SUMS'), sums);
  const target = join(value.output, 'source.tgz');
  await writeFile(target, value.bytes); await rm(value.archive); await symlink(target, value.archive);
  await assert.rejects(copySharedCore(value.input, value.output, '1.0.0'), /regular file/);
});

// Exercise the actual CLI through the first install boundary, without fetching
// Spark or running a native build. Only npm is intercepted in the child process.
async function generatedConsumer(t, version, packedVersion = version) {
  const root = await mkdtemp(join(tmpdir(), 'appkit-preinstall-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const repo = join(root, 'repo'), consumer = join(root, 'consumer'), shared = join(root, 'shared');
  await mkdir(join(repo, 'tooling/macos-appkit'), { recursive: true });
  for (const file of ['prepare-consumer.mjs', 'shared-archives.mjs', 'patch-driver-transport.mjs', 'patch-expo-device-name.mjs']) {
    await cp(new URL(file, import.meta.url), join(repo, 'tooling/macos-appkit', file));
  }
  await mkdir(join(repo, 'examples/macos-appkit/spark'), { recursive: true });
  const template = await readFile(new URL('../../examples/macos-appkit/spark/package.json', import.meta.url));
  await writeFile(join(repo, 'examples/macos-appkit/spark/package.json'), template);
  await mkdir(join(repo, 'packages/core'), { recursive: true });
  await writeFile(join(repo, 'packages/core/package.json'), JSON.stringify({ name: '@nyc-tron/core', version }));
  await mkdir(join(repo, 'packages/macos-appkit/spark'), { recursive: true });
  await writeFile(join(repo, 'packages/macos-appkit/spark/package.json'), JSON.stringify({ name: '@nyc-tron/macos-appkit', version }));
  for (const args of [['init', '--quiet'], ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=fixture-no-hooks', 'commit', '--quiet', '--allow-empty', '-m', 'fixture']]) {
    assert.equal(spawnSync('git', args, { cwd: repo, encoding: 'utf8' }).status, 0);
  }
  await mkdir(join(shared, 'package'), { recursive: true });
  await writeFile(join(shared, 'package/package.json'), JSON.stringify({ name: '@nyc-tron/core', version: packedVersion }));
  const filename = `nyc-tron-core-${version}.tgz`;
  assert.equal(spawnSync('tar', ['-czf', join(shared, filename), '-C', shared, 'package']).status, 0);
  const bytes = await readFile(join(shared, filename)), sha256 = createHash('sha256').update(bytes).digest('hex');
  await writeFile(join(shared, 'SHA256SUMS'), `${sha256}  ${filename}\n`);
  const observer = join(root, 'observe-npm.mjs'), observed = join(root, 'observed.json');
  await writeFile(observer, `import childProcess from 'node:child_process';import{syncBuiltinESMExports}from'node:module';import{readFileSync,writeFileSync}from'node:fs';import{join}from'node:path';const original=childProcess.spawnSync;childProcess.spawnSync=(command,args,options)=>{if(command!=='npm')return original(command,args,options);writeFileSync(${JSON.stringify(observed)},JSON.stringify({args,manifest:JSON.parse(readFileSync(join(options.cwd,'package.json')))}));return {status:77};};syncBuiltinESMExports();`);
  const env = { ...process.env }; delete env.GITHUB_SHA;
  const result = spawnSync(process.execPath, ['--import', observer, join(repo, 'tooling/macos-appkit/prepare-consumer.mjs'), consumer, '--shared-archives', shared], { env, encoding: 'utf8' });
  return { result, observed, consumer, filename, bytes, template, templatePath: join(repo, 'examples/macos-appkit/spark/package.json') };
}
for (const version of ['1.0.0-rc.2', '1.0.0-rc.3']) {
  test(`actual generated ${version} consumer references the copied canonical archive before npm installs`, async t => {
    const f = await generatedConsumer(t, version);
    assert.match(f.result.stderr, /npm failed \(77\)/);
    const observed = JSON.parse(await readFile(f.observed, 'utf8'));
    assert.deepEqual(observed.args, ['install', '--no-audit', '--no-fund']);
    assert.equal(observed.manifest.dependencies['@nyc-tron/core'], `file:vendor/${f.filename}`);
    assert.equal(observed.manifest.dependencies['@nyc-tron/macos-appkit'], 'file:adapter-source');
    const expected = JSON.parse(f.template);
    expected.dependencies['@nyc-tron/core'] = `file:vendor/${f.filename}`;
    expected.dependencies['@nyc-tron/macos-appkit'] = 'file:adapter-source';
    assert.deepEqual(observed.manifest, expected);
    assert.deepEqual(await readFile(join(f.consumer, 'vendor', f.filename)), f.bytes);
    assert.deepEqual(await readFile(f.templatePath), f.template);
  });
}
test('actual consumer rejects a checksum-valid mismatched core version before the install boundary', async t => {
  const f = await generatedConsumer(t, '1.0.0-rc.3', '1.0.0-rc.2');
  assert.match(f.result.stderr, /identity or version does not match/);
  await assert.rejects(access(f.observed), { code: 'ENOENT' });
  await assert.rejects(access(join(f.consumer, 'vendor', f.filename)), { code: 'ENOENT' });
});
