import { copyFile, lstat, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

/** Import the canonical release archive; native hosts must never repack it. */
export async function copySharedCore(directory, destination, expectedVersion) {
  const packageName = '@nyc-tron/core';
  const filename = `nyc-tron-core-${expectedVersion}.tgz`;
  if (!/^nyc-tron-core-[0-9A-Za-z.+-]+\.tgz$/.test(filename)) throw new Error('Invalid core release version');
  const sums = (await readFile(join(directory, 'SHA256SUMS'), 'utf8')).trim().split(/\r?\n/);
  const checksums = new Map();
  for (const line of sums) {
    const entry = /^([a-f0-9]{64})  ([A-Za-z0-9._+-]+\.tgz)$/.exec(line);
    if (!entry || checksums.has(entry[2])) throw new Error('Malformed or duplicate shared archive checksum');
    checksums.set(entry[2], entry[1]);
  }
  const sha256 = checksums.get(filename);
  if (!sha256) throw new Error(`Shared archive checksum is missing: ${filename}`);
  const source = join(directory, filename);
  const stat = await lstat(source);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('The shared core archive must be a regular file');
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  if (hash(await readFile(source)) !== sha256) throw new Error('The shared core archive checksum does not match');
  const packed = spawnSync('tar', ['-xzOf', source, 'package/package.json'], { encoding: 'utf8', maxBuffer: 1024 * 1024 });
  if (packed.error || packed.status !== 0) throw new Error('Cannot read the shared core package identity');
  const manifest = JSON.parse(packed.stdout);
  if (manifest.name !== packageName || manifest.version !== expectedVersion) throw new Error('The shared core package identity or version does not match this checkout');
  await copyFile(source, join(destination, filename));
  if (hash(await readFile(join(destination, filename))) !== sha256) throw new Error('The copied shared core archive changed');
  return { packageName, filename, sha256 };
}
