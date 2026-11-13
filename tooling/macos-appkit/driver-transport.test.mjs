import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { patchDriverTransport, driverRelativePath } from './patch-driver-transport.mjs';

async function fixture(t, { enabled = true, version = '0.0.3' } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'appkit-transport-guard-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(dirname(join(root, driverRelativePath)), { recursive: true });
  await writeFile(join(root, 'package.json'), JSON.stringify({ name: 'nyc-tron-appkit-reference', private: true }));
  await writeFile(join(root, 'desktop.config.json'), JSON.stringify({ macos: { testDriverInRelease: enabled } }));
  await writeFile(join(root, 'node_modules/@legendapp/spark/package.json'), JSON.stringify({ version }));
  await writeFile(join(root, driverRelativePath), 'Changed upstream bytes must remain unchanged.\n');
  return root;
}
const revision = '1'.repeat(40);
test('normal reference preparation cannot patch the installed SDK', async t => {
  const root = await fixture(t, { enabled: false });
  await assert.rejects(patchDriverTransport(root, revision), /private Spark 0.0.3 native acceptance/);
  assert.equal(await readFile(join(root, driverRelativePath), 'utf8'), 'Changed upstream bytes must remain unchanged.\n');
  await assert.rejects(access(join(root, 'acceptance-transport')), { code: 'ENOENT' });
});
test('a different SDK version cannot receive the private transport patch', async t => {
  const root = await fixture(t, { version: '0.0.2' });
  await assert.rejects(patchDriverTransport(root, revision), /private Spark 0.0.3 native acceptance/);
  await assert.rejects(access(join(root, 'acceptance-transport')), { code: 'ENOENT' });
});
test('changed pinned driver bytes fail before writing a patch or receipt', async t => {
  const root = await fixture(t);
  await assert.rejects(patchDriverTransport(root, revision), /preimage SHA-256 changed/);
  assert.equal(await readFile(join(root, driverRelativePath), 'utf8'), 'Changed upstream bytes must remain unchanged.\n');
  await assert.rejects(access(join(root, 'acceptance-transport')), { code: 'ENOENT' });
});
