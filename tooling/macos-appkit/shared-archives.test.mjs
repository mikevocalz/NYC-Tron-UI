import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
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
