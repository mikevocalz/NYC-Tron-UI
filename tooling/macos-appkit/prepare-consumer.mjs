import { cp, mkdir, readFile, writeFile, rm, lstat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, resolve, join, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copySharedCore } from './shared-archives.mjs';
import { patchDriverTransport } from './patch-driver-transport.mjs';
import { patchExpoDeviceName } from './patch-expo-device-name.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' });
const sourceRevision = revision.stdout?.trim();
if (revision.status !== 0 || !/^[a-f0-9]{40}$/.test(sourceRevision ?? '')) throw new Error('Cannot determine the consumer source revision');
if (process.env.GITHUB_SHA && process.env.GITHUB_SHA !== sourceRevision) throw new Error('Workflow and checked out source revisions differ');
const nativeAcceptance = process.argv.includes('--native-acceptance');
const destination = process.argv[2] && resolve(process.argv[2]);
const sharedIndex = process.argv.indexOf('--shared-archives');
if (sharedIndex < 0 || !process.argv[sharedIndex + 1] || process.argv[sharedIndex + 1].startsWith('--')) throw new Error('Supply --shared-archives with the canonical release package directory.');
const sharedDirectory = resolve(process.argv[sharedIndex + 1]);
const rel = destination && relative(repo, destination);
if (!destination || !(rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel))) throw new Error('Supply a fresh consumer directory outside the repository.');
if (existsSync(destination)) throw new Error('Consumer directory already exists; choose a fresh output path.');
const run = (command, args, cwd = destination) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`${command} failed (${result.signal ?? result.status})`);
};
const copySource = (source, target) => cp(source, target, { recursive: true, filter: source => !/(?:^|[/\\])(?:node_modules|\.spark|dist|macos-build|vendor|adapter-source)(?:[/\\]|$)/.test(source) });
await mkdir(destination, { recursive: true });
await copySource(join(repo, 'examples/macos-appkit/spark'), destination);
if (nativeAcceptance) {
  const path = join(destination, 'desktop.config.json');
  const config = JSON.parse(await readFile(path, 'utf8'));
  config.macos.testDriverInRelease = true;
  await writeFile(path, JSON.stringify(config, null, 2) + '\n');
}
await copySource(join(repo, 'packages/macos-appkit/spark'), join(destination, 'adapter-source'));
await mkdir(join(destination, 'vendor'));
const core = JSON.parse(await readFile(join(repo, 'packages/core/package.json'), 'utf8'));
const sharedCore = await copySharedCore(sharedDirectory, join(destination, 'vendor'), core.version);
const manifestFile = join(destination, 'package.json');
let manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
manifest.dependencies['@nyc-tron/macos-appkit'] = 'file:adapter-source';
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
run('npm', ['install', '--no-audit', '--no-fund']);
run(process.execPath, [join(repo, 'tooling/macos-appkit/install-spark-sdk.mjs'), destination]);
run('npm', ['install', '--no-audit', '--no-fund']);
manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
run(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'adapter-source/tsconfig.build.json']);
run(process.execPath, ['--test', ...((await readdir(join(destination, 'adapter-source/tests'))).filter(f => f.endsWith('.test.mjs')).map(f => join('adapter-source/tests', f)))]);
run(process.execPath, ['scripts/check-package.mjs'], join(destination, 'adapter-source'));
run('npm', ['pack', '--ignore-scripts', '--pack-destination', join(destination, 'vendor')], join(destination, 'adapter-source'));
const adapter = JSON.parse(await readFile(join(repo, 'packages/macos-appkit/spark/package.json'), 'utf8'));
manifest.dependencies['@nyc-tron/macos-appkit'] = `file:vendor/nyc-tron-macos-appkit-${adapter.version}.tgz`;
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
// Acceptance must install the distribution, never retain the bootstrap source symlink.
await rm(join(destination, 'node_modules'), { recursive: true });
await rm(join(destination, 'adapter-source'), { recursive: true });
// Generate the distribution lock without the bootstrap source dependency or
// its resolved peer tree, then prove it supports a clean npm ci installation.
await rm(join(destination, 'package-lock.json'));
run('npm', ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund']);
run('npm', ['ci', '--no-audit', '--no-fund']);
run(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit']);
run(process.execPath, [join(repo, 'tooling/macos-appkit/initialize-spark-project.mjs'), destination]);
// This diagnosed transport repair is private to the generated acceptance app.
// The adapter/core archives and the installed SDK in ordinary references stay intact.
const acceptanceTransport = nativeAcceptance ? await patchDriverTransport(destination, sourceRevision) : undefined;
const acceptanceDeviceName = nativeAcceptance ? await patchExpoDeviceName(destination) : undefined;
// Execute Spark's native patch-provenance and Metro graph gates before Xcode.
run(process.execPath, ['node_modules/@legendapp/spark/bin/spark.cjs', 'analyze']);
const pins = { '@legendapp/spark': '0.0.3', 'react-native': '0.83.10', 'react-native-macos': '0.83.0', react: '19.2.0', expo: '55.0.32', 'react-native-nitro-modules': '0.37.0', '@nyc-tron/core': core.version, '@nyc-tron/macos-appkit': adapter.version };
for (const [name, expected] of Object.entries(pins)) {
  const path = join(destination, 'node_modules', name);
  if ((await lstat(path)).isSymbolicLink()) throw new Error(`Acceptance dependency is a source link: ${name}`);
  const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'));
  if (pkg.version !== expected) throw new Error(`${name}: expected ${expected}, found ${pkg.version}`);
}
const archives = [];
const lock = JSON.parse(await readFile(join(destination, 'package-lock.json'), 'utf8'));
for (const file of (await readdir(join(destination, 'vendor'))).filter(f => f.endsWith('.tgz'))) {
  const bytes = await readFile(join(destination, 'vendor', file));
  const name = file.includes('macos-appkit') ? '@nyc-tron/macos-appkit' : '@nyc-tron/core';
  const installed = lock.packages[`node_modules/${name}`];
  const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
  if (installed?.link || installed?.resolved !== `file:vendor/${file}` || installed?.integrity !== integrity) throw new Error(`Installed package differs from candidate archive: ${name}`);
  const unpacked = join(destination, '.archive-verification', name.split('/')[1]);
  await mkdir(unpacked, { recursive: true });
  run('tar', ['-xzf', join(destination, 'vendor', file), '-C', unpacked]);
  const files = [];
  async function compare(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name), local = join(prefix, entry.name);
      if (entry.isDirectory()) { await compare(path, local); continue; }
      if (!entry.isFile()) throw new Error(`Unexpected archive entry: ${local}`);
      const expected = await readFile(path), actual = await readFile(join(destination, 'node_modules', name, local));
      if (!expected.equals(actual)) throw new Error(`Installed package bytes differ: ${name}/${local}`);
      files.push({ path: local.split(sep).join('/'), bytes: actual.length, sha256: createHash('sha256').update(actual).digest('hex') });
    }
  }
  await compare(join(unpacked, 'package'));
  archives.push({ file, packageName: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), files });
}
await rm(join(destination, '.archive-verification'), { recursive: true });
if (archives.find(archive => archive.packageName === sharedCore.packageName)?.sha256 !== sharedCore.sha256) throw new Error('The tested core archive differs from the canonical shared input');
const preparation = { schema: 1, sourceRevision, installedFromArchives: true, sharedCore, pins, archives, ...(acceptanceTransport ? { acceptanceTransport } : {}), ...(acceptanceDeviceName ? { acceptanceDeviceName } : {}) };
await writeFile(join(destination, 'package-preparation.json'), JSON.stringify(preparation, null, 2) + '\n');
console.log(`Prepared installed AppKit consumer at ${destination}`);
