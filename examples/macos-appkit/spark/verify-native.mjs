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
const transportDirectory = join(root, 'acceptance-transport');
const transportReceipt = JSON.parse(readFileSync(join(transportDirectory, 'patch-receipt.json'), 'utf8'));
assert.deepEqual(transportReceipt, preparation.acceptanceTransport, 'The private transport patch differs from preparation');
assert.equal(transportReceipt.scope, 'private-native-acceptance-consumer-only');
assert.equal(transportReceipt.sourceRevision, revision);
assert.equal(transportReceipt.before.sha256, 'c2d7bf074d6d2c2c92806d7fe9e85b79fa2fa2ff4a75acd548e3cdc474cc99fc');
assert.equal(transportReceipt.file, 'node_modules/@legendapp/spark/vendor/node_modules/@legendapp/spark-desktop-app/macos/SparkTestDriver.mm');
assert.equal(hash(readFileSync(join(root, transportReceipt.file))), transportReceipt.after.sha256, 'Compiled private driver input changed after preparation');
const transportProbe = JSON.parse(readFileSync(join(transportDirectory, 'probe-result.json'), 'utf8'));
assert.equal(transportProbe.status, 'passed'); assert.equal(transportProbe.scope, 'foundation-socketpair-probe');
assert.equal(transportProbe.nativeInteractionsAccepted, false); assert.equal(transportProbe.sourceRevision, revision);
assert.equal(transportProbe.patchSha256, transportReceipt.patchSha256); assert.equal(transportProbe.afterSha256, transportReceipt.after.sha256);
for (const file of ['patch-receipt.json', 'probe-result.json', 'probe-trace.log']) copyFileSync(join(transportDirectory, file), join(output, file));
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
const checks = [], captures = [], popovers = [], dragProtocols = [], responderEvents = [];
let pointerEvidence, tooltipEvidence;
writeFileSync(join(output, 'invocation.json'), JSON.stringify({ sourceRevision: revision, app, executable, processId: child.pid, startedAt: new Date().toISOString(), driverProtocol: 1 }, null, 2) + '\n');
function assertRunning() {
  if (launchError || child.exitCode !== null || child.signalCode !== null) throw new Error(`Native application exited before acceptance: ${launchError?.message ?? child.exitCode ?? child.signalCode}`);
}
function retainProcessFailure() {
  const processState = { processId: child.pid, exitCode: child.exitCode, signalCode: child.signalCode, launchError: launchError?.message, observedAt: new Date().toISOString() };
  if (Number.isInteger(child.pid) && child.exitCode === null && child.signalCode === null) {
    const processSnapshot = () => {
      const result = spawnSync('/bin/ps', ['-p', String(child.pid), '-o', 'pid=,ppid=,state=,comm='], { encoding: 'utf8', timeout: 2000, maxBuffer: 64 * 1024 });
      return { observedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal, error: result.error?.message, stdout: result.stdout, stderr: result.stderr };
    };
    // Sample only this spawned app, before closing the driver or terminating it.
    // Denied task access is retained as a diagnostic result, never bypassed.
    processState.beforeSample = processSnapshot();
    const file = join(output, 'native-process-sample.txt');
    const sample = spawnSync('/usr/bin/sample', [String(child.pid), '2', '10', '-file', file], { encoding: 'utf8', timeout: 8000, maxBuffer: 256 * 1024 });
    processState.afterSample = processSnapshot();
    const sampleText = existsSync(file) ? readFileSync(file, 'utf8') : '';
    const callGraph = sampleText.split('Call graph:')[1]?.split('Total number in stack')[0] ?? '';
    const threadGroups = [...callGraph.matchAll(/^\s+\d+\s+Thread_/gm)].length;
    processState.sample = { durationSeconds: 2, intervalMilliseconds: 10, exitCode: sample.status, signal: sample.signal, error: sample.error?.message, stdout: sample.stdout, stderr: sample.stderr,
      threadGroups, hasThreadStacks: threadGroups > 0,
      ...(threadGroups ? {} : { limitation: 'No thread stacks were captured; sampler exit status alone cannot establish process or thread state.' }),
      ...(existsSync(file) ? { file: 'native-process-sample.txt', sha256: hash(readFileSync(file)) } : {}) };
  }
  writeFileSync(join(output, 'native-process-failure.json'), JSON.stringify(processState, null, 2) + '\n');
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
async function show(window = 'main') {
  const request = await driver.request('tron.window', { window, action: 'show' });
  assert.equal(request.activationPath, 'NSWorkspace.openApplication');
  assert.equal(request.processId, child.pid, 'Workspace activation must retain the launched acceptance process');
  return waitFor(async () => {
    const observed = await inspect(undefined, window);
    assert.equal(observed.processId, child.pid);
    assert.equal(observed.activationPolicy, 0, 'Interactive acceptance requires regular AppKit activation policy');
    assert.equal(observed.canBecomeKey, true, 'The requested owner must be able to become key');
    return observed.visible && observed.key && observed.applicationActive && observed.frontmostProcessId === child.pid ? observed : undefined;
  }, `visible, key and active native owner window (${window})`);
}
const control = (testID, action, options = {}, window = 'main') => driver.request('tron.control', { testID, action, window, ...options });
const mounted = testID => driver.request('waitFor', { testID, timeoutMs: 20000 });
const status = text => waitFor(async () => (await inspect('status-main')).label.includes(text), text);
const popover = (window = 'main', action) => driver.request('tron.popover', { window, testID: `inspector-${window}`, ...(action ? { action } : {}) });
async function shownPopover(window = 'main') {
  const value = await waitFor(async () => { const current = await popover(window); return current.shown && current.contentVisible ? current : undefined; }, 'shown native NSPopover');
  assert.equal(value.nativePopover, true);
  assert.ok(value.frame.width > 0 && value.frame.height > 0);
  assert.ok(value.frame.x >= value.region.x && value.frame.y >= value.region.y, 'Native popover chrome crossed the start of its usable region');
  assert.ok(value.frame.x + value.frame.width <= value.region.x + value.region.width && value.frame.y + value.frame.height <= value.region.y + value.region.height, 'Native popover chrome crossed the end of its usable region');
  popovers.push({ window, ...value });
  writeFileSync(join(output, 'popovers.json'), JSON.stringify(popovers, null, 2) + '\n');
  return value;
}
async function dragProtocol(action, source, target) {
  const result = await driver.request('tron.drag-protocol', { action, ...(source ? { source, target } : {}) });
  assert.equal(result.boundary, 'native-protocol');
  dragProtocols.push({ action, source, target, ...result });
  writeFileSync(join(output, 'drag-protocol.json'), JSON.stringify({ boundary: 'Native NSDraggingSource/NSDraggingDestination methods with a real NSPasteboard; no physical pointer gesture or NSDraggingSession', commands: dragProtocols }, null, 2) + '\n');
  return result;
}
function retainResponder(action, native, react) {
  responderEvents.push({ action, native, react });
  writeFileSync(join(output, 'responder-events.json'), JSON.stringify({
    boundary: 'Synthetic NSEvent down/move/up delivered to the installed RCTSurfaceTouchHandler, followed by Fabric dispatch and ordinary React Pressability. No Spark target/action or physical OS pointer delivery.',
    coordinates: 'Top-left NSWindow.frame logical points, including the actual popover content inset.',
    declarationAncestorOffset: { x: 160, y: 96 }, events: responderEvents,
  }, null, 2) + '\n');
}
async function capture(name, window = 'main') {
  const result = await driver.request('capture', { window: window === 'main' ? 'main' : `id:${window}`, name, timeoutMs: 10000 });
  const file = join(driverDirectory, result.file);
  assert.ok(result.width > 0 && result.height > 0 && existsSync(file), 'Native capture is empty');
  copyFileSync(file, join(output, result.file));
  captures.push({ file: result.file, width: result.width, height: result.height, sha256: hash(readFileSync(file)) });
}
try {
  await waitFor(() => existsSync(join(driverDirectory, 'driver.sock')), 'native Spark driver', 25000);
  driver = connectDriver(join(driverDirectory, 'driver.sock'), token, step => appendFileSync(join(output, 'commands.jsonl'), JSON.stringify(step) + '\n'));
  await driver.ready;
  // Authentication runs on Spark's socket thread; ping proves the native main
  // queue can answer before waiting for the first React component to mount.
  await driver.request('ping');
  // The pinned host creates spark.main before starting React. Opt into the
  // visible, active owner required by this interactive acceptance suite before
  // waiting for its React content; Spark's stock driver leaves it hidden with
  // prohibited activation for offscreen capture. show() still requires this
  // exact process/bundle and observed key/active/frontmost state.
  await show();
  await mounted('root-main'); await status('Native workspace ready');
  const native = await inspect();
  assert.equal(native.hasSplitView, true); assert.equal(native.hasTableView, true);
  assert.equal(native.hasButton, true); assert.equal(native.hasTextField, true);
  assert.equal(native.hasNativeDragView, true, 'Expected the installed RNDesktopDragView native source/destination class');
  checks.push('native-appkit-controls-and-display-module');

  const applicationMenu = await driver.request('tron.menu', { itemId: 'menu-save' });
  assert.equal(applicationMenu.nativeMenu, true); assert.equal(applicationMenu.enabled, true);
  assert.equal(applicationMenu.keyEquivalent.toLowerCase(), 's');
  assert.equal((await driver.request('tron.menu', { itemId: 'menu-disabled' })).enabled, false);
  await control('title-main', 'text', { value: 'Checkpoint from the application menu' });
  await status('Unsaved document changes');
  await driver.request('tron.menu', { itemId: 'menu-save', action: 'select' });
  await status('Saved in this local reference session');
  assert.ok((await inspect('saved-main')).labels.includes('Checkpoint from the application menu'));
  await control('title-main', 'text', { value: 'Checkpoint from the context menu' });
  await status('Unsaved document changes');
  await control('context-main', 'press');
  const contextMenu = await waitFor(async () => { const menu = await driver.request('tron.context-menu', {}); return menu.shown ? menu : undefined; }, 'native context-menu tracking');
  assert.equal(contextMenu.nativeMenu, true);
  assert.equal(contextMenu.items.find(item => item.id === 'context-disabled').enabled, false);
  await driver.request('tron.context-menu', { action: 'select', itemId: 'context-save' });
  await status('Saved in this local reference session');
  assert.ok((await inspect('saved-main')).labels.includes('Checkpoint from the context menu'));
  await control('context-main', 'press');
  await waitFor(async () => (await driver.request('tron.context-menu', {})).shown, 'second native context menu');
  await driver.request('tron.context-menu', { action: 'cancel' }); await status('Native context menu dismissed');
  checks.push('native-application-and-context-menu-commands');
  const tooltip = await inspect('tooltip-main');
  assert.equal(tooltip.tooltip, "Save this document's local checkpoint");
  assert.equal(tooltip.help, "Save this document's local checkpoint");
  checks.push('native-tooltip-property-and-accessibility-help');

  const tooltipRequest = options => driver.request('tron.tooltip', { window: 'main', testID: 'tooltip-main', ...options });
  const tooltipInitial = await tooltipRequest({ action: 'inspect' });
  assert.equal(typeof tooltipInitial.postEventsAllowed, 'boolean');
  assert.equal(typeof tooltipInitial.accessibilityTrusted, 'boolean');
  tooltipEvidence = { schemaVersion: 1, status: tooltipInitial.postEventsAllowed ? 'pending' : 'blocked',
    boundary: 'CGEvent-posted mouse movement followed by public NSApp.windows and NSAccessibility help-tag observation; no physical mouse hardware or human gesture.',
    coordinates: 'AppKit global screen logical points, with a bottom-left origin on the primary display.',
    permission: { postEventsAllowed: tooltipInitial.postEventsAllowed, accessibilityTrusted: tooltipInitial.accessibilityTrusted }, initial: tooltipInitial,
    ...(tooltipInitial.postEventsAllowed ? {} : { reason: 'CGPreflightPostEventAccess returned false on the actual native CI process. Native hover presentation and dismissal remain untested; no TCC change or permission prompt was attempted.' }) };
  const retainTooltip = () => writeFileSync(join(output, 'tooltip-hover.json'), JSON.stringify(tooltipEvidence, null, 2) + '\n');
  retainTooltip();
  checks.push('native-tooltip-hover-permission-observed');
  if (tooltipInitial.postEventsAllowed) {
    const observeTooltip = async phase => {
      const observation = await tooltipRequest({ action: 'inspect' });
      tooltipEvidence.lastObservation = { phase, ...observation }; retainTooltip();
      assert.equal(observation.boundary, 'public-native-help-tag-observation');
      assert.equal(observation.traversalTruncated, false, 'The bounded native accessibility traversal could not establish tooltip visibility');
      assert.equal(observation.ownerVisible, true); assert.equal(observation.ownerKey, true); assert.equal(observation.applicationActive, true);
      return observation;
    };
    const matchingTags = observation => observation.helpTags.filter(tag => tag.strings.includes(tooltip.tooltip));
    tooltipEvidence.initialExit = await tooltipRequest({ action: 'leave', outsideTestID: 'title-main' });
    tooltipEvidence.baseline = await waitFor(async () => {
      const observation = await observeTooltip('outside-before-hover');
      return !observation.cursorInsideTrigger && !observation.pointerRunning && matchingTags(observation).length === 0 ? observation : undefined;
    }, 'actual cursor outside the tooltip trigger and no matching native help tag');
    tooltipEvidence.enter = await tooltipRequest({ action: 'enter' }); retainTooltip();
    tooltipEvidence.shown = await waitFor(async () => {
      const observation = await observeTooltip('hover');
      const tag = matchingTags(observation).find(candidate => candidate.role === 'AXHelpTag' && candidate.frame.width > 0 && candidate.frame.height > 0 && candidate.windowFrame.width > 0 && candidate.windowFrame.height > 0);
      return observation.cursorInsideTrigger && !observation.pointerRunning && tag ? { observation, tag } : undefined;
    }, 'new visible native help-tag text after the posted pointer reaches the trigger');
    const image = await tooltipRequest({ action: 'capture', windowNumber: tooltipEvidence.shown.tag.windowNumber });
    const png = Buffer.from(image.pngBase64, 'base64');
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.ok(image.width > 0 && image.height > 0);
    assert.equal(png.readUInt32BE(16), image.width); assert.equal(png.readUInt32BE(20), image.height);
    const tooltipCapture = { file: 'native-tooltip-visible.png', width: image.width, height: image.height, sha256: hash(png), boundary: image.boundary, windowNumber: image.windowNumber };
    writeFileSync(join(output, tooltipCapture.file), png); captures.push(tooltipCapture); tooltipEvidence.capture = tooltipCapture;
    tooltipEvidence.beforeExit = await observeTooltip('before-exit');
    assert.ok(matchingTags(tooltipEvidence.beforeExit).some(tag => tag.windowNumber === tooltipEvidence.shown.tag.windowNumber), 'The native help tag disappeared before the tested exit movement');
    tooltipEvidence.exit = await tooltipRequest({ action: 'leave', outsideTestID: 'title-main' }); retainTooltip();
    tooltipEvidence.dismissed = await waitFor(async () => {
      const observation = await observeTooltip('outside-after-hover');
      const stillVisible = observation.windows.some(window => window.number === tooltipEvidence.shown.tag.windowNumber && window.onscreen);
      return !observation.cursorInsideTrigger && !observation.pointerRunning && matchingTags(observation).length === 0 && !stillVisible ? observation : undefined;
    }, 'actual native help-tag window disappearance after pointer exit');
    // Spark capture waits for Fabric to settle and forces owner layout/display.
    // Keep that context capture outside the hover/exit observation interval.
    await capture('tooltip-hover-owner-after-exit');
    tooltipEvidence.status = 'passed'; retainTooltip();
    checks.push('native-cgevent-tooltip-hover-presentation-and-dismissal');
  }

  await control('title-main', 'text', { value: 'Opening the native inspector' });
  await status('Unsaved document changes');
  const opener = (await inspect()).firstResponderIdentity;
  assert.ok(opener);
  await control('inspect-main', 'press');
  const firstPopover = await shownPopover();
  assert.equal((await inspect('inspector-react-main')).fullyVisible, true, 'The React press target is clipped');
  assert.equal((await inspect('inspector-react-report-main')).fullyVisible, true, 'The responder evidence label is clipped');
  const responder = async () => JSON.parse((await inspect('inspector-react-report-main')).label);
  const initialResponder = await responder();
  const down = await driver.request('tron.react-responder', { action: 'down', window: 'main', testID: 'inspector-react-main' });
  assert.equal(down.boundary, 'synthetic-native-responder');
  assert.equal(down.handlerClass, 'RCTSurfaceTouchHandler');
  const pressedResponder = await waitFor(async () => {
    const current = await responder(); return current.ins === initialResponder.ins + 1 && current.measured && current.active ? current : undefined;
  }, 'ordinary React responder grant and Fabric measurement');
  retainResponder('down', down, pressedResponder);
  for (const key of ['x', 'y']) assert.ok(Math.abs(down.handlerBounds[key] - down.handlerWindowBounds[key]) <= 1, 'The content bounds origin omits native popover chrome');
  for (const key of ['x', 'y', 'width', 'height']) {
    assert.ok(Math.abs(pressedResponder.measured[key] - down.nativeBounds[key]) <= 1, `Fabric measure ${key} does not match the detached native window`);
  }
  assert.ok(Math.abs(pressedResponder.point.x - down.point.x) <= 1 && Math.abs(pressedResponder.point.y - down.point.y) <= 1);
  const move = await driver.request('tron.react-responder', { action: 'move', token: down.token, dx: 4, dy: 1 });
  await waitFor(async () => (await responder()).moves === initialResponder.moves + 1, 'real RN responder move');
  // Allow Pressability's minimum press duration to expire so a false leave
  // cannot be hidden by its delayed onPressOut callback.
  await pause(170);
  const movedResponder = await responder(); retainResponder('move', move, movedResponder);
  assert.equal(movedResponder.active, true, 'Moving within the actual popover target left its Fabric press region');
  assert.equal(movedResponder.outs, initialResponder.outs);
  const up = await driver.request('tron.react-responder', { action: 'up', token: down.token });
  const completedResponder = await waitFor(async () => {
    const current = await responder(); return current.presses === initialResponder.presses + 1 && current.outs === initialResponder.outs + 1 && !current.active ? current : undefined;
  }, 'one ordinary React press from native responder release');
  retainResponder('up', up, completedResponder);
  checks.push('native-react-responder-in-popover-coordinate-boundary');
  const inspectorIdentity = (await inspect('inspector-title-main')).identity;
  await control('inspector-title-main', 'text', { value: 'Edited inside the actual NSPopover' });
  await waitFor(async () => (await inspect('title-main')).value === 'Edited inside the actual NSPopover', 'shared document edits from NSPopover');
  const editingPopover = await inspect('inspector-title-main');
  assert.equal(editingPopover.editing, true); assert.ok(editingPopover.editorIdentity);
  const mainFrameBeforePopoverResize = await inspect();
  await driver.request('tron.window', { window: 'main', action: 'resize', width: mainFrameBeforePopoverResize.width + 80, height: mainFrameBeforePopoverResize.height + 40 });
  await waitFor(async () => { const root = await inspect('root-main'); return root.width === mainFrameBeforePopoverResize.width + 80 && root.viewBounds.width === root.contentBounds.width; }, 'owner and React root resize with an active popover field editor');
  const resizedPopover = await shownPopover();
  assert.equal(resizedPopover.contentIdentity, firstPopover.contentIdentity);
  assert.equal((await inspect('inspector-title-main')).editorIdentity, editingPopover.editorIdentity);
  assert.equal((await inspect('inspector-title-main')).editing, true, 'Safe popover reposition interrupted native field editing');
  await popover('main', 'escape'); await status('Native inspector dismissed');
  await waitFor(async () => !(await popover()).shown, 'native Escape dismissal');
  assert.equal((await inspect()).firstResponderIdentity, opener, 'Closing NSPopover did not restore its original native responder');
  await control('inspect-main', 'press');
  const reopenedPopover = await shownPopover();
  assert.equal(reopenedPopover.contentIdentity, firstPopover.contentIdentity);
  assert.equal((await inspect('inspector-title-main')).identity, inspectorIdentity);
  assert.equal((await inspect('inspector-title-main')).value, 'Edited inside the actual NSPopover');
  await control('inspector-close-main', 'press'); await status('Inspector closed');
  await waitFor(async () => !(await popover()).shown, 'controlled native popover close');
  await driver.request('tron.window', { window: 'main', action: 'resize', width: mainFrameBeforePopoverResize.width, height: mainFrameBeforePopoverResize.height });
  checks.push('native-popover-safe-region-shared-content-retained-identity-and-focus');
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
  await show('document-1');
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

  let offer = await dragProtocol('enter', 'main', 'document-1');
  assert.ok(offer.operation > 0); assert.equal(offer.operation, offer.sourceMask); assert.ok(offer.pasteboardTypes.length);
  await status('Document move offered to document-1');
  await dragProtocol('cancel'); await status('Native document drag canceled');
  assert.equal((await inspect('owner-main')).label, 'Document owner: main');
  await dragProtocol('enter', 'main', 'document-1'); await status('Document move offered to document-1');
  assert.equal((await dragProtocol('drop')).nativeAccepted, true);
  await status('Move blocked');
  assert.equal((await inspect('owner-main')).label, 'Document owner: main');
  await control('title-main', 'text', { value: 'Native drag checkpoint' });
  await waitFor(async () => (await inspect('title-document-1', 'document-1')).value === 'Native drag checkpoint', 'shared title before document move');
  await control('save-main', 'press'); await status('Saved in this local reference session');
  await dragProtocol('enter', 'main', 'document-1'); await status('Document move offered to document-1');
  await dragProtocol('drop'); await status('Document moved to document-1');
  assert.equal((await inspect('owner-main')).label, 'Document owner: document-1');
  await dragProtocol('enter', 'document-1', 'main'); await status('Document move offered to main');
  await dragProtocol('drop'); await status('Document moved to main');
  assert.equal((await inspect('owner-main')).label, 'Document owner: main');
  assert.equal((await inspect('title-document-1', 'document-1')).identity, identity);
  await control('title-main', 'text', { value: 'Draft shared across native windows' }); await status('Unsaved document changes');
  checks.push('native-drag-protocol-pasteboard-acceptance-rejection-cancellation-and-ownership');

  await control('restore-layout', 'press'); await status('layout restored');
  const restored = await inspect(undefined, 'document-1');
  assert.equal(restored.width, frame.width); assert.equal(restored.height, frame.height);
  assert.equal((await inspect('title-document-1', 'document-1')).identity, identity);
  checks.push('native-layout-restoration');

  await show();
  await control('inspect-main', 'press'); await shownPopover();
  await show('document-1');
  await popover('main', 'close'); await status('Native inspector dismissed');
  await waitFor(async () => !(await popover()).shown, 'popover close after another window gained focus');
  assert.equal((await inspect(undefined, 'document-1')).key, true);
  assert.equal((await inspect()).key, false);
  checks.push('native-popover-dismissal-preserves-newer-window-focus');

  await driver.request('tron.window', { window: 'document-1', action: 'close' }); await status('Close blocked');
  assert.equal((await driver.request('tron.windows')).windows.length, 2);
  await control('save-document-1', 'press', {}, 'document-1'); await status('Saved in this local reference session');
  await control('inspect-document-1', 'press', {}, 'document-1');
  const beforeMinimizePopover = await shownPopover('document-1');
  const beforeMinimizeContent = (await inspect('inspector-title-document-1', 'document-1')).identity;
  await control('minimize-document', 'press', {}, 'document-1');
  await waitFor(async () => (await inspect(undefined, 'document-1')).minimized, 'native minimization');
  await waitFor(async () => !(await popover('document-1')).shown, 'popover dismissed with its minimized owner');
  await control('restore-document', 'press');
  await waitFor(async () => !(await inspect(undefined, 'document-1')).minimized, 'native deminiaturization');
  await control('inspect-document-1', 'press', {}, 'document-1');
  assert.equal((await shownPopover('document-1')).contentIdentity, beforeMinimizePopover.contentIdentity);
  assert.equal((await inspect('inspector-title-document-1', 'document-1')).identity, beforeMinimizeContent);
  await control('inspector-close-document-1', 'press', {}, 'document-1');
  await waitFor(async () => !(await popover('document-1')).shown, 'restored owner popover close');
  checks.push('native-popover-owner-minimize-retains-content');
  assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
  checks.push('native-close-veto-and-minimize-restore');
  await capture('document-window', 'document-1');
  await control('close-document', 'press', {}, 'document-1');
  await waitFor(async () => (await driver.request('tron.windows')).windows.length === 1, 'allowed native close');
  await control('open-main', 'press'); await mounted('title-document-1');
  assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
  checks.push('native-reopen-keeps-app-document');

  const permission = await driver.request('tron.pointer', { action: 'status' });
  assert.equal(typeof permission.postEventsAllowed, 'boolean');
  assert.equal(typeof permission.accessibilityTrusted, 'boolean');
  pointerEvidence = { schemaVersion: 1, permission, status: permission.postEventsAllowed ? 'pending' : 'blocked',
    boundary: 'CGEvent-posted pointer path and actual NSDraggingSession; physical mouse hardware and human gestures are not tested',
    ...(permission.postEventsAllowed ? {} : { reason: 'CGPreflightPostEventAccess returned false on the actual native CI process; no TCC changes or permission prompt was attempted.' }) };
  writeFileSync(join(output, 'native-pointer.json'), JSON.stringify(pointerEvidence, null, 2) + '\n');
  checks.push('native-pointer-posting-permission-observed');
  const required = ['native-appkit-controls-and-display-module', 'native-application-and-context-menu-commands', 'native-tooltip-property-and-accessibility-help', 'native-tooltip-hover-permission-observed', ...(tooltipEvidence.status === 'passed' ? ['native-cgevent-tooltip-hover-presentation-and-dismissal'] : []), 'native-react-responder-in-popover-coordinate-boundary', 'native-popover-safe-region-shared-content-retained-identity-and-focus', 'controlled-sidebar-and-native-appearance', 'controlled-native-text-and-selection', 'shared-document-and-resize-identity', 'native-drag-protocol-pasteboard-acceptance-rejection-cancellation-and-ownership', 'native-layout-restoration', 'native-popover-dismissal-preserves-newer-window-focus', 'native-popover-owner-minimize-retains-content', 'native-close-veto-and-minimize-restore', 'native-reopen-keeps-app-document', 'native-pointer-posting-permission-observed'];
  assert.deepEqual(checks, required);
  if (permission.postEventsAllowed) {
    pointerEvidence.arrangement = await driver.request('tron.pointer', { action: 'arrange', source: 'main', target: 'document-1' });
    await waitFor(async () => {
      const [main, document] = await Promise.all([inspect('root-main'), inspect('root-document-1', 'document-1')]);
      return main.viewBounds.width === main.contentBounds.width && document.viewBounds.width === document.contentBounds.width;
    }, 'resized native React roots before pointer input');
    pointerEvidence.invocation = await driver.request('tron.pointer', { action: 'drag', source: 'main', target: 'document-1' });
    writeFileSync(join(output, 'native-pointer.json'), JSON.stringify(pointerEvidence, null, 2) + '\n');
    const session = await waitFor(async () => {
      const state = await driver.request('tron.pointer', { action: 'status' });
      if (state.session?.nativeSession) { pointerEvidence.session = state.session; writeFileSync(join(output, 'native-pointer.json'), JSON.stringify(pointerEvidence, null, 2) + '\n'); }
      return state.session?.nativeSession && !state.running ? state.session : undefined;
    }, 'actual AppKit NSDraggingSession from posted mouse events');
    assert.equal(session.source, 'drop-main');
    assert.ok(session.pasteboardTypes.length);
    await status('Document moved to document-1');
    assert.equal((await inspect('owner-main')).label, 'Document owner: document-1');
    assert.equal((await inspect('title-document-1', 'document-1')).value, 'Draft shared across native windows');
    pointerEvidence.status = 'passed';
    writeFileSync(join(output, 'native-pointer.json'), JSON.stringify(pointerEvidence, null, 2) + '\n');
    checks.push('native-cgevent-pointer-session-and-cross-window-document-transfer');
  }
  const requiredNativeInteractions = [
    'native-cgevent-tooltip-hover-presentation-and-dismissal',
    'native-cgevent-pointer-session-and-cross-window-document-transfer',
  ];
  const missingNativeInteractions = requiredNativeInteractions.filter(check => !checks.includes(check));
  if (missingNativeInteractions.length || tooltipEvidence.status !== 'passed' || pointerEvidence.status !== 'passed') {
    const blocked = tooltipEvidence.status === 'blocked' || pointerEvidence.status === 'blocked';
    writeFileSync(join(output, 'native-interaction-gate.json'), JSON.stringify({
      schemaVersion: 1, status: blocked ? 'blocked' : 'failed', sourceRevision: revision,
      requiredChecks: requiredNativeInteractions, missingChecks: missingNativeInteractions, completedChecks: checks,
      tooltip: tooltipEvidence, pointer: pointerEvidence,
      reason: blocked ? 'The native host denied required CGEvent interaction capability; protocol and property checks cannot satisfy native hover or NSDraggingSession acceptance.' : 'Required native interaction evidence is incomplete.',
    }, null, 2) + '\n');
    throw new Error(`${blocked ? 'Native OS interaction acceptance blocked by host capability' : 'Native OS interaction acceptance incomplete'}: ${missingNativeInteractions.join(', ') || 'interaction result is not passed'}`);
  }
  const report = { schemaVersion: 1, status: 'passed', platform: 'macos', architecture: process.arch, sourceRevision: revision, processId: child.pid, packageSha256: archive.sha256, nativePayloadSha256: nativeArtifact.payloadSha256, checks, captures,
    pointer: pointerEvidence, tooltip: tooltipEvidence,
    boundaries: ['The React responder proof delivers synthetic NSEvents to the real RCTSurfaceTouchHandler and measures Fabric/Pressability behavior; it is not physical OS pointer delivery.', 'The required drag proof uses native source/destination protocol methods and a real NSPasteboard. It does not by itself create an NSDraggingSession.', 'The additional tooltip hover check observed cursor readback, native help-tag text and window disappearance after CGEvent movement; physical mouse hardware and human gestures were not exercised.', 'The additional CGEvent check observed an actual AppKit NSDraggingSession and cross-window app transfer; physical mouse hardware and human gestures were not exercised.', 'No physical multi-display, VoiceOver speech, headset or eight-platform acceptance claim.'] };
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
  try { retainProcessFailure(); }
  catch (diagnosticError) { writeFileSync(join(output, 'native-process-diagnostic-error.txt'), String(diagnosticError) + '\n'); }
  if (tooltipEvidence?.status === 'pending') { tooltipEvidence.status = 'failed'; tooltipEvidence.error = error instanceof Error ? error.message : String(error); writeFileSync(join(output, 'tooltip-hover.json'), JSON.stringify(tooltipEvidence, null, 2) + '\n'); }
  if (pointerEvidence?.status === 'pending') { pointerEvidence.status = 'failed'; pointerEvidence.error = error instanceof Error ? error.message : String(error); writeFileSync(join(output, 'native-pointer.json'), JSON.stringify(pointerEvidence, null, 2) + '\n'); }
  writeFileSync(join(output, 'failure.json'), JSON.stringify({ schemaVersion: 1, status: 'failed', sourceRevision: revision, checks, error: error instanceof Error ? error.message : String(error) }, null, 2) + '\n');
  throw error;
} finally {
  driver?.close();
  if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
}
