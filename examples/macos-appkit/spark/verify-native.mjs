import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, appendFileSync, readdirSync, lstatSync, readlinkSync, copyFileSync, openSync, closeSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as pause } from 'node:timers/promises';
import { connectDriver } from './driver-client.mjs';

if (process.platform !== 'darwin' || process.arch !== 'arm64') throw new Error('Native AppKit acceptance requires macOS ARM64 and a real built Spark app.');
const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.APPKIT_EVIDENCE ?? join(root, 'native-evidence'));
if (existsSync(output)) throw new Error('Use a fresh evidence directory; existing receipts cannot satisfy this run.');
mkdirSync(output, { recursive: true });
const preparation = JSON.parse(readFileSync(join(root, 'package-preparation.json'), 'utf8'));
assert.match(preparation.sourceRevision, /^[a-f0-9]{40}$/);
assert.equal(preparation.installedFromArchives, true);
const revision = preparation.sourceRevision;
if (process.env.GITHUB_SHA) assert.equal(revision, process.env.GITHUB_SHA, 'Consumer and workflow source revisions differ');
const archive = preparation.archives.find(a => a.packageName === '@nyc-tron/macos-appkit');
assert.ok(archive?.files.length, 'Missing installed AppKit archive receipt');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const packed of preparation.archives) {
  assert.equal(hash(readFileSync(join(root, 'vendor', packed.file))), packed.sha256, 'Candidate archive changed after installation');
  const installed = join(root, 'node_modules', packed.packageName);
  assert.equal(lstatSync(installed).isSymbolicLink(), false, 'Native acceptance cannot use a workspace link');
  for (const file of packed.files) assert.equal(hash(readFileSync(join(installed, file.path))), file.sha256, `Installed package changed: ${file.path}`);
}
const pkg = JSON.parse(readFileSync(join(root, 'node_modules/@nyc-tron/macos-appkit/package.json'), 'utf8'));
const config = JSON.parse(readFileSync(join(root, 'desktop.config.json'), 'utf8'));
assert.equal(config.macos.testDriverInRelease, true, 'Generate this private acceptance consumer with --native-acceptance');
const app = process.argv[2] ? resolve(process.argv[2]) : join(root, '.spark/products/macos-arm64/release', `${config.name}.app`);
assert.ok(existsSync(join(app, 'Contents/Resources/main.jsbundle')), 'Expected a standalone app with bundled JavaScript');
const info = spawnSync('/usr/bin/plutil', ['-extract', 'CFBundleExecutable', 'raw', '-o', '-', join(app, 'Contents/Info.plist')], { encoding: 'utf8' });
if (info.status !== 0) throw new Error(`Cannot read native app identity: ${info.stderr}`);
const executable = join(app, 'Contents/MacOS', info.stdout.trim());
assert.ok(existsSync(executable), 'Native executable is missing');
const payload = [];
function manifest(directory, prefix = '') {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = join(directory, entry.name), path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) payload.push({ path, type: 'symlink', target: readlinkSync(file) });
    else if (entry.isDirectory()) manifest(file, path);
    else if (entry.isFile()) { const bytes = readFileSync(file); payload.push({ path, type: 'file', bytes: bytes.length, sha256: hash(bytes) }); }
    else throw new Error(`Unexpected native artifact entry: ${path}`);
  }
}
manifest(app);
const nativeArtifact = { schemaVersion: 1, sourceRevision: revision, platform: process.platform, architecture: process.arch, executableSha256: hash(readFileSync(executable)), payloadSha256: hash(Buffer.from(JSON.stringify(payload))), entries: payload };
writeFileSync(join(output, 'native-artifact.json'), JSON.stringify(nativeArtifact, null, 2) + '\n');
copyFileSync(join(root, 'package-preparation.json'), join(output, 'package-preparation.json'));
const driverDirectory = mkdtempSync('/tmp/nt-appkit-');
// Spark requires owner-only directory/token permissions and consumes this token.
spawnSync('/bin/chmod', ['700', driverDirectory]);
const token = randomBytes(32).toString('hex');
writeFileSync(join(driverDirectory, 'token'), token, { mode: 0o600 });
const descriptor = openSync(join(output, 'app.log'), 'w');
const child = spawn(executable, [], { cwd: root, env: { ...process.env, SPARK_TEST_DRIVER_DIR: driverDirectory }, stdio: ['ignore', descriptor, descriptor] });
closeSync(descriptor);
let launchError, driver;
child.on('error', error => { launchError = error; });
const checks = [], captures = [];
writeFileSync(join(output, 'invocation.json'), JSON.stringify({ sourceRevision: revision, app, executable, processId: child.pid, startedAt: new Date().toISOString(), driverProtocol: 1 }, null, 2) + '\n');
function assertRunning() {
  if (launchError || child.exitCode !== null || child.signalCode !== null) throw new Error(`Native application exited before acceptance: ${launchError?.message ?? child.exitCode ?? child.signalCode}`);
}
async function waitFor(check, label, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    assertRunning();
    const value = await check(); if (value) return value;
    await pause(50);
  }
  throw new Error(`Timed out waiting for ${label}`);
}
const inspect = (testID, window = 'main') => driver.request('tron.inspect', { window, ...(testID ? { testID } : {}) });
const control = (testID, action, options = {}, window = 'main') => driver.request('tron.control', { testID, action, window, ...options });
const mounted = testID => driver.request('waitFor', { testID, timeoutMs: 20000 });
const status = text => waitFor(async () => (await inspect('status-main')).label.includes(text), text);
async function capture(name, window = 'main') {
  const result = await driver.request('capture', { window: window === 'main' ? 'main' : `id:${window}`, name, timeoutMs: 10000 });
  const file = join(driverDirectory, result.file);
  assert.ok(result.width > 0 && result.height > 0 && existsSync(file), 'Native capture is empty');
  copyFileSync(file, join(output, result.file));
  captures.push({ file: result.file, width: result.width, height: result.height, sha256: hash(readFileSync(file)) });
}
try {
  await waitFor(() => existsSync(join(driverDirectory, 'driver.sock')), 'native Spark driver', 25000);
  driver = await connectDriver(join(driverDirectory, 'driver.sock'), token, step => appendFileSync(join(output, 'commands.jsonl'), JSON.stringify(step) + '\n'));
  await mounted('root-main'); await status('Native workspace ready');
  const native = await inspect();
  assert.equal(native.hasSplitView, true); assert.equal(native.hasTableView, true);
  assert.equal(native.hasButton, true); assert.equal(native.hasTextField, true);
  assert.ok(native.classes.some(name => /DragDrop/.test(name)), 'Expected a native drag source/destination view');
  checks.push('native-appkit-controls-and-display-module');
  await capture('workspace-light');

  await control('navigation', 'select', { index: 2 });
  await status('Selection rejected');
  assert.equal((await inspect('navigation')).selected, 0);
  await control('navigation', 'select', { index: 1 }); await mounted('appearance');
  await control('appearance', 'select', { index: 2 });
  await waitFor(async () => (await inspect('appearance')).appearance === 'NSAppearanceNameDarkAqua', 'native dark appearance');
  await capture('preferences-dark');
  await control('appearance', 'select', { index: 1 });
  await control('navigation', 'select', { index: 0 }); await mounted('title-main');
  checks.push('controlled-sidebar-and-native-appearance');

  await control('title-main', 'text', { value: 'Draft shared across native windows' });
  await status('Unsaved document changes');
  assert.equal((await inspect('title-main')).value, 'Draft shared across native windows');
  await control('title-main', 'text', { value: 'Rejected!' }); await status('Title rejected');
  await waitFor(async () => (await inspect('title-main')).value === 'Draft shared across native windows', 'controlled native text rollback');
  await control('collection-main', 'select', { index: 1 });
  await waitFor(async () => (await inspect('collection-main')).selected === 1, 'native selection');
  checks.push('controlled-native-text-and-selection');

  await control('open-main', 'press'); await mounted('root-document-1');
  await waitFor(async () => (await driver.request('tron.windows')).windows.length === 2, 'two real NSWindows');
  assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
  assert.equal((await inspect('collection-document-1', 'document-1')).selected, 1);
  const identity = (await inspect('title-document-1', 'document-1')).identity;
  const frame = await inspect(undefined, 'document-1');
  await control('remember-layout', 'press'); await status('layout remembered');
  await driver.request('tron.window', { window: 'document-1', action: 'resize', width: 840, height: 700 });
  await waitFor(async () => (await inspect(undefined, 'document-1')).width === 840, 'native window resize');
  assert.equal((await inspect('title-document-1', 'document-1')).identity, identity);
  assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
  checks.push('shared-document-and-resize-identity');
  await control('restore-layout', 'press'); await status('layout restored');
  const restored = await inspect(undefined, 'document-1');
  assert.equal(restored.width, frame.width); assert.equal(restored.height, frame.height);
  assert.equal((await inspect('title-document-1', 'document-1')).identity, identity);
  checks.push('native-layout-restoration');

  await driver.request('tron.window', { window: 'document-1', action: 'close' }); await status('Close blocked');
  assert.equal((await driver.request('tron.windows')).windows.length, 2);
  await control('save-document-1', 'press', {}, 'document-1'); await status('Saved in this local reference session');
  await control('minimize-document', 'press', {}, 'document-1');
  await waitFor(async () => (await inspect(undefined, 'document-1')).minimized, 'native minimization');
  await control('restore-document', 'press');
  await waitFor(async () => !(await inspect(undefined, 'document-1')).minimized, 'native deminiaturization');
  assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
  checks.push('native-close-veto-and-minimize-restore');
  await capture('document-window', 'document-1');
  await control('close-document', 'press', {}, 'document-1');
  await waitFor(async () => (await driver.request('tron.windows')).windows.length === 1, 'allowed native close');
  await control('open-main', 'press'); await mounted('title-document-1');
  assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
  checks.push('native-reopen-keeps-app-document');

  const required = ['native-appkit-controls-and-display-module', 'controlled-sidebar-and-native-appearance', 'controlled-native-text-and-selection', 'shared-document-and-resize-identity', 'native-layout-restoration', 'native-close-veto-and-minimize-restore', 'native-reopen-keeps-app-document'];
  assert.deepEqual(checks, required);
  const report = { schemaVersion: 1, status: 'passed', platform: 'macos', architecture: process.arch, sourceRevision: revision, processId: child.pid, packageSha256: archive.sha256, nativePayloadSha256: nativeArtifact.payloadSha256, checks, captures,
    boundaries: ['Native AppKit target/action tests; physical pointer/keyboard gestures were not exercised.', 'No physical multi-display, VoiceOver speech, headset or eight-platform acceptance claim.'] };
  writeFileSync(join(output, 'result.json'), JSON.stringify(report, null, 2) + '\n');
  const tested = resolve(process.env.APPKIT_TESTED_PACKAGE ?? join(root, 'tested-package'));
  if (existsSync(tested)) throw new Error('Tested-package output already exists; refusing stale artifact reuse');
  mkdirSync(tested, { recursive: true });
  copyFileSync(join(root, 'vendor', archive.file), join(tested, archive.file));
  assert.equal(hash(readFileSync(join(tested, archive.file))), archive.sha256);
  writeFileSync(join(tested, 'SHA256SUMS'), `${archive.sha256}  ${archive.file}\n`);
  const dependencies = preparation.archives.filter(a => a.packageName !== pkg.name).map(a => ({ packageName: a.packageName, filename: a.file, sha256: a.sha256 }));
  writeFileSync(join(tested, 'tested-package.json'), JSON.stringify({ schemaVersion: 1, status: 'passed', platform: 'macos', packageName: pkg.name, version: pkg.version, filename: archive.file, sha256: archive.sha256, sourceRevision: revision, checks, dependencies }, null, 2) + '\n');
  await driver.request('quit');
  console.info(`Native AppKit acceptance passed ${checks.length} checks at ${revision}; tested archive ${archive.sha256}`);
} catch (error) {
  writeFileSync(join(output, 'failure.json'), JSON.stringify({ schemaVersion: 1, status: 'failed', sourceRevision: revision, checks, error: error instanceof Error ? error.message : String(error) }, null, 2) + '\n');
  throw error;
} finally {
  driver?.close();
  if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
}
