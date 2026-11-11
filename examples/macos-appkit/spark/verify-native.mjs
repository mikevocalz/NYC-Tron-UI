import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir as mkdirAsync } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, appendFileSync, readdirSync, lstatSync, readlinkSync, copyFileSync, openSync, closeSync, readSync, fstatSync } from 'node:fs';
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
let initialStartupObservation;
function startupObservationLive(owner, pid) {
  return child === owner && owner.pid === pid && Number.isSafeInteger(pid) && pid > 0 &&
    !launchError && owner.exitCode === null && owner.signalCode === null;
}
function startupObservationProcess(command, args, timeoutMs, pending) {
  const record = { attemptedAt: new Date().toISOString(), processId: null, spawnObserved: false, spawnFailed: false,
    requestPendingAtAttempt: pending(), requestPendingAtSpawnEvent: null, spawnedAt: null, exitObserved: false,
    exitedAt: null, closeObserved: false, closedAt: null, exitCode: null, signal: null, errorCode: null,
    timedOut: false, outputLimit: false, stdoutBytes: 0, stderrBytes: 0, termRequested: false, killRequested: false,
    cleanupUnconfirmed: false, cleanupLimitReached: false, captureFailed: false, settledAt: null };
  let subprocess, timeout, escalation, cleanup, settled = false, stopping = false, stdout = [], stderr = [];
  const limit = 64 * 1024, errors = ['EACCES', 'EPERM', 'ENOENT', 'ESRCH', 'EINVAL', 'EIO'];
  let finish;
  const promise = new Promise(resolveResult => {
    finish = () => {
      if (settled) return;
      settled = true; clearTimeout(timeout); clearTimeout(escalation); clearTimeout(cleanup);
      record.settledAt = new Date().toISOString();
      let text = ''; try { text = Buffer.concat(stdout).toString('utf8'); } catch { record.captureFailed = true; }
      resolveResult({ record, stdout: text });
    };
    const signal = name => {
      if (!subprocess || record.exitObserved || record.closeObserved || !Number.isSafeInteger(subprocess.pid)) return;
      if (name === 'SIGTERM') record.termRequested = true; else record.killRequested = true;
      try { subprocess.kill(name); } catch (error) { record.errorCode = errors.includes(error?.code) ? error.code : null; }
    };
    const stop = () => {
      if (settled || stopping) return;
      stopping = true; signal('SIGTERM');
      escalation = setTimeout(() => signal('SIGKILL'), 500);
      cleanup = setTimeout(() => {
        record.cleanupLimitReached = true; record.cleanupUnconfirmed = !record.closeObserved;
        // Signal delivery is not terminal-state evidence. Do not keep Node
        // alive indefinitely on diagnostic pipes after bounded cleanup.
        try { subprocess?.stdout?.destroy(); subprocess?.stderr?.destroy(); subprocess?.unref(); } catch {}
        finish();
      }, 1000);
    };
    try {
      subprocess = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      record.processId = Number.isSafeInteger(subprocess.pid) && subprocess.pid > 0 ? subprocess.pid : null;
      const collect = (kind, chunks, bytes) => {
        try {
          const key = kind + 'Bytes', previous = record[key];
          record[key] = Math.min(Number.MAX_SAFE_INTEGER, previous + bytes.length);
          const remaining = Math.max(0, limit - previous);
          if (remaining) chunks.push(Buffer.from(bytes.subarray(0, remaining)));
          if (record[key] > limit) { record.outputLimit = true; stop(); }
        } catch { record.captureFailed = true; stop(); }
      };
      subprocess.stdout.on('data', bytes => collect('stdout', stdout, bytes));
      subprocess.stderr.on('data', bytes => collect('stderr', stderr, bytes));
      subprocess.stdout.on('error', stop); subprocess.stderr.on('error', stop);
      subprocess.on('spawn', () => {
        record.spawnObserved = true; record.spawnedAt = new Date().toISOString();
        record.requestPendingAtSpawnEvent = pending();
      });
      subprocess.on('error', error => {
        record.errorCode = errors.includes(error?.code) ? error.code : null;
        if (!record.spawnObserved && record.processId === null) record.spawnFailed = true;
        stop();
      });
      subprocess.on('exit', (code, observedSignal) => {
        record.exitObserved = true; record.exitedAt = new Date().toISOString();
        record.exitCode = Number.isInteger(code) ? code : null;
        record.signal = ['SIGTERM', 'SIGKILL', 'SIGABRT', 'SIGSEGV', 'SIGBUS', 'SIGILL', 'SIGTRAP'].includes(observedSignal) ? observedSignal : null;
      });
      subprocess.on('close', (code, observedSignal) => {
        record.closeObserved = true; record.cleanupUnconfirmed = false; record.closedAt = new Date().toISOString();
        record.exitCode = Number.isInteger(code) ? code : null;
        record.signal = ['SIGTERM', 'SIGKILL', 'SIGABRT', 'SIGSEGV', 'SIGBUS', 'SIGILL', 'SIGTRAP'].includes(observedSignal) ? observedSignal : null;
        finish();
      });
      timeout = setTimeout(() => { record.timedOut = true; stop(); }, timeoutMs);
    } catch (error) {
      record.errorCode = errors.includes(error?.code) ? error.code : null;
      if (record.processId !== null) stop();
      else { record.spawnFailed = true; finish(); }
    }
  });
  return { record, promise };
}
function startupObservationIdentity(text, pid, parentPid, expectedCommand) {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  const match = lines.length === 1 ? lines[0].match(/^\s*(\d+)\s+(\d+)\s+(.+?)\s*$/) : null;
  const observedPid = match ? Number(match[1]) : null, observedParent = match ? Number(match[2]) : null;
  return { kind: 'pid-ppid-ps-comm-argv0-not-mapped-executable', parsed: !!match && Number.isSafeInteger(observedPid) && Number.isSafeInteger(observedParent),
    processId: Number.isSafeInteger(observedPid) ? observedPid : null,
    parentProcessId: Number.isSafeInteger(observedParent) ? observedParent : null,
    matchesPid: match ? observedPid === pid : null, matchesParent: match ? observedParent === parentPid : null,
    matchesExpectedCommand: match ? match[3] === expectedCommand : null };
}
function startupObservationSample(text, pid, applicationName) {
  const result = { status: 'unavailable', headerProcessId: null, headerCount: 0, analysisProcessId: null, analysisHeaderCount: 0, mainThreadGroups: 0,
    lineScanLimit: 4096, lineByteLimit: 8192, scannedLines: 0, unscannedLines: 0, oversizedLines: 0, frameLimit: 32, parsedFrameLines: 0,
    unparsedFrameLines: 0, omittedFrameLines: 0, frames: [] };
  const all = text.split(/\r?\n/);
  const headers = all.filter(line => /^Process:/.test(line));
  result.headerCount = headers.length;
  const header = headers.length === 1 && headers[0].length <= 4096 ? headers[0].match(/^Process:\s+.+\[(\d+)\]\s*$/) : null;
  if (!header || !Number.isSafeInteger(Number(header[1]))) { result.status = 'ambiguous-or-invalid-process-header'; return result; }
  result.headerProcessId = Number(header[1]);
  if (result.headerProcessId !== pid) { result.status = 'process-header-mismatch'; return result; }
  const analyses = all.filter(line => line.startsWith('Analysis of sampling '));
  result.analysisHeaderCount = analyses.length;
  if (analyses.length) {
    const declarations = analyses.length === 1 && analyses[0].length <= 4096 ? [...analyses[0].matchAll(/\(pid (\d+)\)/g)] : [];
    if (declarations.length !== 1 || !Number.isSafeInteger(Number(declarations[0][1]))) { result.status = 'ambiguous-or-invalid-analysis-header'; return result; }
    result.analysisProcessId = Number(declarations[0][1]);
    if (result.analysisProcessId !== pid) { result.status = 'process-declarations-mismatch'; return result; }
  }
  const graph = all.indexOf('Call graph:');
  if (graph < 0) { result.status = 'call-graph-unavailable'; return result; }
  const endOffset = all.slice(graph + 1).findIndex(line => line.startsWith('Total number in stack'));
  const graphLines = all.slice(graph + 1, endOffset < 0 ? undefined : graph + 1 + endOffset);
  const main = /^\s+\d+\s+Thread_\d+\s+DispatchQueue_\d+:\s+com\.apple\.main-thread\s+\(serial\)\s*$/;
  result.mainThreadGroups = graphLines.filter(line => main.test(line)).length;
  if (result.mainThreadGroups !== 1) { result.status = 'ambiguous-or-missing-main-thread'; return result; }
  const start = graphLines.findIndex(line => main.test(line));
  const next = graphLines.slice(start + 1).findIndex(line => /^\s+\d+\s+Thread_/.test(line));
  const lines = graphLines.slice(start + 1, next < 0 ? undefined : start + 1 + next);
  result.unscannedLines = Math.max(0, lines.length - result.lineScanLimit);
  const images = ['AppKit', 'Foundation', 'CoreFoundation', 'HIToolbox', 'QuartzCore', 'dyld', 'libdyld.dylib',
    'libdispatch.dylib', 'libsystem_kernel.dylib', 'libsystem_pthread.dylib', 'libsystem_c.dylib',
    'libsystem_trace.dylib', 'libsystem_platform.dylib', 'libsystem_malloc.dylib', 'libxpc.dylib', 'libsystem_blocks.dylib', 'libobjc.A.dylib'];
  const symbols = ['start', 'NSApplicationMain', '-[NSApplication run]',
    '-[NSApplication(NSEventRouting) _nextEventMatchingEventMask:untilDate:inMode:dequeue:]',
    '_DPSNextEvent', '_BlockUntilNextEventMatchingListInModeWithFilter', 'ReceiveNextEventCommon', 'RunCurrentEventLoopInMode',
    'CFRunLoopRunSpecific', '__CFRunLoopRun', '__CFRunLoopServiceMachPort', '__CFRunLoopDoBlocks', '__CFRUNLOOP_IS_CALLING_OUT_TO_A_BLOCK__',
    'mach_msg', 'mach_msg_overwrite', 'mach_msg2_internal', 'mach_msg2_trap', '_dispatch_main_queue_drain',
    '_dispatch_main_queue_callback_4CF', '_dispatch_client_callout', '_dispatch_call_block_and_release',
    'dispatch_async', '_dispatch_async_f_slow', '__DISPATCH_WAIT_FOR_QUEUE__', '_dispatch_sync_f_slow',
    'NSLog', 'NSLogv', '_NSLogv', '_CFLogvEx3', '_CFLogvEx2', '_os_log_impl',
    '__ulock_wait', '__ulock_wait2', '__psynch_mutexwait', '__psynch_cvwait', 'semaphore_wait_trap', 'semaphore_timedwait_trap',
    '_Block_copy', '_Block_release', '_Block_object_dispose', 'objc_release', 'objc_storeStrong',
    '_dispatch_block_async_invoke', '_dispatch_block_async_invoke2', '_dispatch_block_async_invoke_and_release',
    'dispatch_block_wait', 'dispatch_semaphore_wait', '_dispatch_semaphore_wait_slow', '_dispatch_sema4_wait'];
  for (const line of lines.slice(0, result.lineScanLimit)) {
    result.scannedLines++;
    if (Buffer.byteLength(line, 'utf8') > result.lineByteLimit) { result.oversizedLines++; continue; }
    const match = line.match(/^([ +!|:.\t-]*)(\d+)\s+(.+?)\s{2,}\(in ([^)\r\n]+)\)\s+(?:\+\s+(\d+)|load address 0x[a-fA-F0-9]+\s+\+\s+(0x[a-fA-F0-9]+))\s+\[0x[a-fA-F0-9]+\]\s*$/);
    if (!match) { if (line.trim()) result.unparsedFrameLines++; continue; }
    const count = Number(match[2]), offset = Number(match[5] ?? match[6]);
    if (!Number.isSafeInteger(count) || count < 0 || !Number.isSafeInteger(offset) || offset < 0) { result.unparsedFrameLines++; continue; }
    result.parsedFrameLines++;
    if (result.frames.length >= result.frameLimit) { result.omittedFrameLines++; continue; }
    let symbol = symbols.includes(match[3]) ? match[3] : 'unknown';
    if (symbol === 'unknown' && ['Foundation', 'AppKit', 'libobjc.A.dylib'].includes(match[4])) {
      const selector = match[3].match(/^-\[[A-Za-z_$][A-Za-z0-9_$]{0,100}(?:\([A-Za-z0-9_$]{1,100}\))? (dealloc|waitUntilFinished|waitUntilAllOperationsAreFinished)\]$/);
      if (selector) symbol = ({ dealloc: 'objc-dealloc-selector', waitUntilFinished: 'objc-wait-until-finished-selector', waitUntilAllOperationsAreFinished: 'objc-wait-all-operations-selector' })[selector[1]];
    }
    result.frames.push({ count, depthColumns: match[1].length, image: images.includes(match[4]) ? match[4] : match[4] === applicationName ? 'owned-application' : 'unknown',
      symbol, offset, offsetKind: match[5] === undefined ? 'image-relative' : 'symbol-relative' });
  }
  result.status = 'projected-main-thread';
  return result;
}
function readStartupObservationSample(observation, onComplete) {
  const file = join(output, 'startup-predeadline', 'sample.txt'), cap = 1024 * 1024;
  const result = { file: 'startup-predeadline/sample.txt', status: 'unavailable', processingByteLimit: cap,
    readByteLimit: cap + 1, bytesRead: 0, originalBytes: null, completeStableRead: false, originalSha256: null,
    prefixBytes: null, prefixSha256: null, digestScope: null, parsed: null };
  if (!observation.sample?.closeObserved || !observation.sample.spawnObserved) { result.status = 'sampler-close-or-spawn-unconfirmed'; return result; }
  let fd, bytes, before, after, current, failed = false;
  try {
    if (!lstatSync(file).isFile()) throw Error('not regular');
    fd = openSync(file, 'r'); before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size < 0) throw Error('invalid size');
    const buffer = Buffer.alloc(cap + 1);
    while (result.bytesRead < buffer.length) {
      const count = readSync(fd, buffer, result.bytesRead, buffer.length - result.bytesRead, result.bytesRead);
      if (!count) break; result.bytesRead += count;
    }
    bytes = buffer.subarray(0, result.bytesRead); after = fstatSync(fd); current = lstatSync(file);
    result.originalBytes = before.size;
    result.completeStableRead = bytes.length <= cap && bytes.length === before.size && current.isFile() &&
      [after, current].every(value => value.dev === before.dev && value.ino === before.ino && value.size === before.size &&
        value.mtimeMs === before.mtimeMs && value.ctimeMs === before.ctimeMs);
  } catch { failed = true; result.status = 'read-unavailable'; }
  finally { if (fd !== undefined) { try { closeSync(fd); } catch { failed = true; result.status = 'close-unavailable'; } } }
  if (failed) { result.completeStableRead = false; return result; }
  if (result.completeStableRead) {
    result.originalSha256 = hash(bytes); result.digestScope = 'complete-stable-file-after-sampler-close';
    result.status = 'complete-stable-read';
    const text = bytes.toString('utf8');
    result.parsed = startupObservationSample(text, observation.processId, executable.split('/').at(-1));
    if (onComplete) onComplete(text);
  } else {
    const prefix = bytes.subarray(0, cap);
    result.prefixBytes = prefix.length; result.prefixSha256 = hash(prefix);
    result.digestScope = 'read-prefix-only-not-whole-file'; result.status = 'incomplete-or-changing-read';
  }
  return result;
}
function startupSymbolUUID(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  const match = lines.length === 1 ? lines[0].match(/^UUID: ([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}) \(arm64\) .+$/) : null;
  return match ? match[1].toUpperCase() : null;
}
function startupSymbolInput(text, observation, original) {
  const result = { status: 'sample-input-unavailable', architecture: null, imageUUIDUnique: null, imageRangeBytes: null,
    ownedFrames: 0, selectedFrames: 0, omittedOwnedFrames: 0, frame: null };
  if (!original.completeStableRead || original.parsed?.status !== 'projected-main-thread' || typeof text !== 'string' ||
      original.parsed.headerCount !== 1 || original.parsed.headerProcessId !== observation.processId ||
      !Number.isSafeInteger(observation.processId) || observation.processId <= 0 ||
      Buffer.byteLength(text, 'utf8') > 1048576 || hash(Buffer.from(text, 'utf8')) !== original.originalSha256) return { result };
  const name = executable.split('/').at(-1), bundle = app.split('/').at(-1), identifier = config.macos?.bundleIdentifier;
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(name) || config.name !== name || bundle !== name + '.app' ||
      app !== join(root, '.spark', 'products', 'macos-arm64', 'release', bundle) ||
      executable !== join(app, 'Contents', 'MacOS', name) || typeof identifier !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9.-]{0,200}$/.test(identifier)) {
    result.status = 'owned-product-layout-unverified'; return { result };
  }
  const lines = text.split(/\r?\n/), graph = lines.indexOf('Call graph:'), images = lines.indexOf('Binary Images:');
  if (graph < 0 || images <= graph || lines.filter(line => line === 'Call graph:').length !== 1 || lines.filter(line => line === 'Binary Images:').length !== 1) { result.status = 'sample-sections-unavailable'; return { result }; }
  const header = lines.slice(0, graph);
  const one = key => { const values = header.filter(line => line.startsWith(key)); return values.length === 1 ? values[0].slice(key.length).trim() : null; };
  const suffix = '/' + bundle + '/Contents/MacOS/' + name;
  const path = one('Path:'), architecture = one('Code Type:'), loadText = one('Load Address:');
  if (architecture !== 'ARM64' || one('Identifier:') !== identifier || typeof path !== 'string' || !path.endsWith(suffix) ||
      typeof loadText !== 'string' || !/^0x[0-9a-fA-F]+$/.test(loadText)) {
    result.status = 'sample-owner-header-unverified'; return { result };
  }
  result.architecture = 'arm64';
  // Count candidate owner rows before parsing; malformed or oversized rows
  // cannot disappear and create a false uniqueness result.
  const token = new RegExp('(?:^|\\s)\\+?' + identifier.replace(/\./g, '\\.') + '(?:\\s|$)');
  const ownerRows = lines.slice(images + 1).filter(line => token.test(line) || line.trimEnd().endsWith(suffix));
  const row = ownerRows.length === 1 && Buffer.byteLength(ownerRows[0], 'utf8') <= 8192 ? ownerRows[0].match(/^\s*(0x[0-9a-fA-F]+)\s*-\s*(0x[0-9a-fA-F]+)\s+\+?(\S+)\s+\([^)]*\)\s+<([0-9A-Fa-f-]{36})>\s+(.+)$/) : null;
  if (!row || row[3] !== identifier || !row[5].endsWith(suffix)) {
    result.status = 'sample-owned-image-ambiguous'; return { result };
  }
  const load = Number(row[1]), end = Number(row[2]), headerLoad = Number(loadText);
  const uuid = row[4].toUpperCase();
  if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/.test(uuid) ||
      lines.slice(images + 1).filter(line => line.toUpperCase().includes('<' + uuid + '>')).length !== 1 ||
      ![load, end, headerLoad].every(Number.isSafeInteger) || load !== headerLoad || end < load || end - load > 0xffffffff) {
    result.status = 'sample-image-range-or-uuid-unverified'; return { result };
  }
  result.imageUUIDUnique = true; result.imageRangeBytes = end - load + 1;
  const main = /^\s+\d+\s+Thread_\d+\s+DispatchQueue_\d+:\s+com\.apple\.main-thread\s+\(serial\)\s*$/;
  const starts = lines.slice(graph + 1, images).map((line, i) => main.test(line) ? graph + 1 + i : -1).filter(i => i >= 0);
  if (starts.length !== 1) { result.status = 'sample-main-group-unverified'; return { result }; }
  const frames = [];
  for (const line of lines.slice(starts[0] + 1, Math.min(images, starts[0] + 4097))) {
    if (/^\s+\d+\s+Thread_/.test(line) || line.startsWith('Total number in stack')) break;
    if (Buffer.byteLength(line, 'utf8') > 8192) continue;
    const frame = line.match(/^([ +!|:.\t-]*)(\d+)\s+(.+?)\s{2,}\(in ([^)\r\n]+)\)\s+(?:\+\s+(\d+)|load address (0x[a-fA-F0-9]+)\s+\+\s+(0x[a-fA-F0-9]+))\s+\[(0x[a-fA-F0-9]+)\]\s*$/);
    if (!frame || frame[4] !== name) continue;
    const count = Number(frame[2]), pc = Number(frame[8]), offset = Number(frame[5] ?? frame[7]);
    if (![count, pc, offset].every(Number.isSafeInteger) || count < 0 || offset < 0 || pc < load || pc > end ||
        (frame[6] !== undefined && (Number(frame[6]) !== load || load + offset !== pc)) ||
        (frame[5] !== undefined && pc - offset < load)) {
      result.status = 'sample-owned-frame-outside-image'; return { result };
    }
    frames.push({ count, depthColumns: frame[1].length, offset, offsetKind: frame[5] === undefined ? 'image-relative' : 'symbol-relative',
      imageRelativeOffset: pc - load, address: frame[8] });
  }
  result.ownedFrames = frames.length; result.selectedFrames = Math.min(1, frames.length); result.omittedOwnedFrames = Math.max(0, frames.length - 1);
  if (!frames.length) { result.status = 'no-owned-main-frame'; return { result }; }
  const retained = original.parsed.frames.filter(frame => frame.image === 'owned-application' &&
    frame.count === frames[0].count && frame.depthColumns === frames[0].depthColumns &&
    frame.offset === frames[0].offset && frame.offsetKind === frames[0].offsetKind);
  if (retained.length !== 1) { result.status = 'owned-frame-not-uniquely-retained'; return { result }; }
  const { address, ...frame } = frames[0];
  result.frame = frame; result.status = 'sample-image-bound';
  // Addresses and source paths are private inputs only, never projected.
  return { result, uuid, address, loadAddress: row[1], name, bundle };
}
function startupSymbolFile(file, maximumBytes) {
  const result = { status: 'unavailable', bytes: null, sha256: null };
  let fd, failed = false, count = 0, before, after, current;
  try {
    if (!file.startsWith(root + '/')) return { ...result, status: 'outside-owned-product-root' };
    for (let at = file; at !== root; at = dirname(at)) {
      const value = lstatSync(at);
      if (value.isSymbolicLink()) return { ...result, status: 'symlink-refused' };
    }
    if (!lstatSync(file).isFile()) return { ...result, status: 'not-regular-file' };
    fd = openSync(file, 'r'); before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size <= 0 || before.size > maximumBytes) return { ...result, status: 'size-outside-bound' };
    const digest = createHash('sha256'), buffer = Buffer.alloc(65536);
    while (count <= maximumBytes) {
      const read = readSync(fd, buffer, 0, Math.min(buffer.length, maximumBytes + 1 - count), count);
      if (!read) break; digest.update(buffer.subarray(0, read)); count += read;
    }
    after = fstatSync(fd); current = lstatSync(file);
    if (count > maximumBytes || count !== before.size || !current.isFile() ||
        ![after, current].every(value => value.dev === before.dev && value.ino === before.ino && value.size === before.size && value.mtimeMs === before.mtimeMs && value.ctimeMs === before.ctimeMs)) {
      result.status = 'changed-or-incomplete-file'; return result;
    }
    result.bytes = count; result.sha256 = digest.digest('hex'); result.status = 'complete-stable-file';
  } catch (error) { failed = true; result.status = error?.code === 'ENOENT' ? 'file-absent' : 'file-unavailable'; }
  finally { if (fd !== undefined) { try { closeSync(fd); } catch { failed = true; result.status = 'close-unavailable'; } } }
  if (failed) { result.bytes = null; result.sha256 = null; }
  return result;
}
function startupSymbolClassification(text, expectedImage) {
  const result = { status: 'unresolved', sourceFile: 'unknown', functionFamily: 'unknown',
    uniqueSourceCallerEstablished: false, sourceLineValuesPrivate: true, inliningAndDeduplicationLimited: true };
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length !== 1 || Buffer.byteLength(lines[0] ?? '', 'utf8') > 8192) { result.status = 'multiple-or-invalid-symbol-results'; return result; }
  const line = lines[0];
  if (/<deduplicated_symbol>|inlined|inline frame/i.test(line)) { result.status = 'ambiguous-inline-or-deduplicated'; return result; }
  const match = line.match(/^(.+?) \(in ([^)\r\n]+)\)(?: \(([^()\r\n]+):(\d+)\))?$/);
  if (!match || /^0x[0-9a-f]+$/i.test(match[1]) || / \+ \d+$/.test(match[1])) return result;
  if (typeof expectedImage !== 'string' || match[2] !== expectedImage) { result.status = 'symbol-image-mismatch'; return result; }
  // A predecessor/symbol-table name without an actual source annotation is
  // insufficient for attribution. Keep the raw tool text in private evidence.
  if (!match[3] || !Number.isSafeInteger(Number(match[4]))) { result.status = 'symbol-name-without-source'; return result; }
  const file = match[3].split('/').at(-1);
  const sources = { 'NYCTronAcceptanceDriver.mm': 'private-acceptance-driver', 'SparkTestDriver.mm': 'pinned-spark-driver',
    'ConstantsProvider.swift': 'expo-constants-provider',
    'AppDelegate.mm': 'app-delegate', 'AppDelegate.m': 'app-delegate', 'main.m': 'app-entry', '<compiler-generated>': 'compiler-generated' };
  result.sourceFile = Object.hasOwn(sources, file) ? sources[file] : 'unknown';
  const name = match[1];
  const exact = { TraceActivation: 'activation-trace', ActivationWindowState: 'activation-state-read',
    SparkExecute: 'spark-command-dispatch', SparkSession: 'spark-server-session', SparkServe: 'spark-server-loop',
    '+[NYCTronAcceptanceDriver load]': 'acceptance-driver-registration' };
  // Unrecognized demangled parameter signatures stay unknown. Never strip
  // arguments to manufacture an exact function or unique caller attribution.
  const simple = name.startsWith('_') && !name.startsWith('__') ? name.slice(1) : name;
  if (Object.hasOwn(exact, simple)) result.functionFamily = exact[simple];
  else if (/^__destroy_helper_block_[A-Za-z0-9_]{1,160}$/.test(name)) result.functionFamily = 'compiler-block-destruction';
  else if (/^__copy_helper_block_[A-Za-z0-9_]{1,160}$/.test(name)) result.functionFamily = 'compiler-block-copy';
  else if (/^__\d+\+\[NYCTronAcceptanceDriver load\]_block_invoke(?:_\d+)?$/.test(name)) result.functionFamily = 'acceptance-driver-registration-block';
  result.status = result.sourceFile !== 'unknown' || result.functionFamily !== 'unknown' ? 'closed-source-or-family-observation' : 'unrecognized-source-and-function';
  return result;
}
async function startupSymbolication(observation, original, text) {
  const result = { status: 'unavailable', diagnosticOnly: true, offlineOnly: true, liveProcessAttachment: false,
    uniqueSourceCallerEstablished: false, originalSampleSha256: original.originalSha256, binding: null,
    executable: null, optionalDsym: { candidate: 'pinned-deriveddata-release-product', presenceEstablished: false, status: 'not-probed' },
    symbolProvider: null, tools: [], classification: null, toolLimit: 3, toolTimeoutMs: 3000, toolCleanupGraceMs: 1000,
    executableByteLimit: 67108864, symbolByteLimit: 134217728, selectedFrameLimit: 1 };
  try {
    const input = startupSymbolInput(text, observation, original); result.binding = input.result;
    if (input.result.status !== 'sample-image-bound') { result.status = input.result.status; return result; }
    const binary = startupSymbolFile(executable, result.executableByteLimit);
    result.executable = { status: binary.status, bytes: binary.bytes, sha256: binary.sha256, matchesLaunchHash: binary.sha256 === null ? null : binary.sha256 === nativeArtifact.executableSha256, uuidMatches: null, matchesBeforeToolsHashAndBytes: null };
    if (binary.status !== 'complete-stable-file' || !result.executable.matchesLaunchHash) { result.status = 'executable-launch-hash-unverified'; return result; }
    const run = async (label, args) => {
      const task = startupObservationProcess('/usr/bin/xcrun', args, result.toolTimeoutMs, () => false);
      const completed = await task.promise, state = completed.record;
      const record = { tool: label, status: 'unavailable', closeObserved: state.closeObserved, exitCode: state.exitCode,
        timedOut: state.timedOut, cleanupLimitReached: state.cleanupLimitReached, outputLimit: state.outputLimit,
        errorCode: state.errorCode, stdoutBytes: state.stdoutBytes, stderrBytes: state.stderrBytes,
        file: 'startup-symbol-' + label + '.txt', retained: false, retainedSha256: null, retainedEncoding: 'decoded-stdout-as-utf8' };
      result.tools.push(record);
      const usable = state.spawnObserved && state.closeObserved && state.exitCode === 0 && !state.timedOut && !state.outputLimit && !state.captureFailed && state.errorCode === null;
      record.status = usable ? 'completed' : state.closeObserved ? 'tool-failed' : 'tool-close-unconfirmed';
      try {
        writeFileSync(join(output, record.file), completed.stdout, { flag: 'wx' });
        record.retained = true; record.retainedSha256 = hash(Buffer.from(completed.stdout, 'utf8'));
      } catch { record.status = 'private-output-retention-failed'; }
      return usable && record.retained ? completed.stdout : null;
    };
    const executableUUID = startupSymbolUUID((await run('executable-uuid', ['dwarfdump', '--uuid', executable])) ?? '');
    result.executable.uuidMatches = executableUUID === null ? null : executableUUID === input.uuid;
    if (!result.executable.uuidMatches) { result.status = 'executable-uuid-or-architecture-unverified'; return result; }
    // Pinned Spark build.ts derives this product directory, but the existence
    // and contents of this optional dSYM have not been assumed or generated.
    const dsym = join(root, '.spark', 'DerivedData', 'macos-arm64', 'Build', 'Products', 'Release',
      input.bundle + '.dSYM', 'Contents', 'Resources', 'DWARF', input.name);
    const symbols = startupSymbolFile(dsym, result.symbolByteLimit);
    result.optionalDsym.status = symbols.status;
    let symbolFile = executable, selectedSymbols = binary;
    if (symbols.status === 'complete-stable-file') {
      result.optionalDsym.presenceEstablished = true; result.optionalDsym.bytes = symbols.bytes; result.optionalDsym.sha256 = symbols.sha256;
      const uuid = startupSymbolUUID((await run('dsym-uuid', ['dwarfdump', '--uuid', dsym])) ?? '');
      result.optionalDsym.uuidMatches = uuid === null ? null : uuid === executableUUID;
      if (!result.optionalDsym.uuidMatches) { result.status = 'optional-dsym-uuid-or-architecture-unverified'; return result; }
      symbolFile = dsym; selectedSymbols = symbols; result.symbolProvider = 'uuid-matched-existing-dsym';
    } else if (symbols.status === 'file-absent') result.symbolProvider = 'exact-launch-executable';
    else { result.status = 'optional-symbol-file-unverified'; return result; }
    const resolved = await run('atos', ['atos', '-arch', 'arm64', '-o', symbolFile, '-l', input.loadAddress, '-i', '-dedup', input.address]);
    // Unsupported flags fail closed; never retry with ambiguity flags removed.
    if (resolved === null) { result.status = 'atos-unavailable'; return result; }
    const binaryAfter = startupSymbolFile(executable, result.executableByteLimit);
    result.executable.matchesBeforeToolsHashAndBytes = binaryAfter.status === 'complete-stable-file' && binaryAfter.sha256 === binary.sha256 && binaryAfter.bytes === binary.bytes;
    let symbolsStable = true;
    if (symbolFile !== executable) {
      const after = startupSymbolFile(dsym, result.symbolByteLimit);
      symbolsStable = after.status === 'complete-stable-file' && after.sha256 === selectedSymbols.sha256 && after.bytes === selectedSymbols.bytes;
      result.optionalDsym.matchesBeforeToolsHashAndBytes = symbolsStable;
    }
    if (!result.executable.matchesBeforeToolsHashAndBytes || !symbolsStable) { result.status = 'symbol-input-changed'; return result; }
    result.classification = startupSymbolClassification(resolved, input.name);
    result.status = 'offline-symbol-observation-completed';
  } catch { result.status = 'symbol-observation-unavailable'; }
  return result;
}

async function reportStartupObservation(observation) {
  try {
    let sampleText;
    const original = readStartupObservationSample(observation, text => { sampleText = text; });
    const symbolication = await startupSymbolication(observation, original, sampleText);
    const record = { schemaVersion: 1, sourceRevision: revision, processId: observation.processId,
      diagnosticOnly: true, samplingMayPerturbScheduling: true, nativeAcceptancePermitted: false,
      firstRequestOnly: true, command: 'tron.window', action: 'show', triggerAfterMs: 10000,
      requestedDurationSeconds: 2, requestedIntervalMilliseconds: 10, samplerTimeoutMs: 8000, cleanupGraceMs: 1000,
      armedAt: observation.armedAt, firedAt: observation.firedAt, settledAt: observation.settledAt,
      requestOutcome: observation.requestOutcome, status: observation.status, statusScope: 'observer-task-outcome', reportedAt: new Date().toISOString(),
      ownerLiveAtFire: observation.ownerLiveAtFire, ownerLiveBeforeSample: observation.ownerLiveBeforeSample,
      ownerLiveAfterObservation: observation.ownerLiveAfterObservation,
      preflight: observation.preflight, identity: observation.identity, sample: observation.sample,
      skipPostFailureSample: observation.skipPostFailureSample, original, symbolication };
    const begin = 'NYCTRON_STARTUP_SAMPLE_BEGIN', end = 'NYCTRON_STARTUP_SAMPLE_END', limit = 16 * 1024;
    record.consoleByteLimit = limit;
    const encode = () => begin + '\n' + JSON.stringify(record) + '\n' + end + '\n';
    let envelope = encode();
    if (Buffer.byteLength(envelope, 'utf8') > limit && record.original.parsed) {
      record.original.parsed.omittedForOutputLimit = record.original.parsed.frames.length;
      record.original.parsed.frames = []; envelope = encode();
    }
    try { writeFileSync(join(output, 'startup-predeadline.json'), JSON.stringify(record, null, 2) + '\n', { flag: 'wx' }); } catch {}
    if (Buffer.byteLength(envelope, 'utf8') <= limit) console.info(envelope.slice(0, -1));
  } catch {
    // This reporting path cannot replace the original request rejection.
  }
}
async function observeInitialWindowRequest(request) {
  const owner = child, pid = child.pid, parentPid = process.pid;
  let pending = true, observation, timer, task;
  // Attach both handlers immediately, before any timer/preflight work.
  const outcome = Promise.resolve(request).then(
    value => { pending = false; return { resolved: true, value }; },
    error => { pending = false; return { resolved: false, error }; });
  try {
    observation = initialStartupObservation = { processId: Number.isSafeInteger(pid) && pid > 0 ? pid : null, fired: false, diagnosticOnly: false, armedAt: new Date().toISOString(),
      firedAt: null, settledAt: null, requestOutcome: null, status: 'armed', ownerLiveAtFire: null,
      ownerLiveBeforeSample: null, ownerLiveAfterObservation: null, preflight: null, identity: null,
      sample: null, skipPostFailureSample: false };
    timer = setTimeout(() => {
      if (!pending) return;
      // Conservative latch precedes every observer, directory or subprocess.
      observation.fired = true; observation.diagnosticOnly = true; observation.firedAt = new Date().toISOString();
      task = (async () => {
        try {
          observation.ownerLiveAtFire = startupObservationLive(owner, pid);
          if (!observation.ownerLiveAtFire) { observation.status = 'owner-unavailable'; return; }
          observation.status = 'preparing-output';
          let directoryTimer;
          try {
            await Promise.race([mkdirAsync(join(output, 'startup-predeadline'), { mode: 0o700 }),
              new Promise((_, reject) => { directoryTimer = setTimeout(() => reject(Error('directory timeout')), 2000); })]);
          } finally { clearTimeout(directoryTimer); }
          if (!pending || !startupObservationLive(owner, pid)) { observation.status = 'request-or-owner-settled-before-preflight'; return; }
          observation.status = 'preflight';
          const query = startupObservationProcess('/bin/ps', ['-ww', '-p', String(pid), '-o', 'pid=,ppid=,comm='], 2000, () => pending);
          observation.preflight = query.record;
          const result = await query.promise;
          if (!pending) { observation.status = 'request-settled-during-preflight'; return; }
          if (!result.record.closeObserved || result.record.exitCode !== 0 || result.record.outputLimit || result.record.captureFailed) { observation.status = 'preflight-unavailable'; return; }
          observation.identity = startupObservationIdentity(result.stdout, pid, parentPid, executable);
          observation.ownerLiveBeforeSample = startupObservationLive(owner, pid);
          if (!observation.ownerLiveBeforeSample || observation.identity.matchesPid !== true ||
              observation.identity.matchesParent !== true || observation.identity.matchesExpectedCommand !== true) {
            observation.status = 'owned-identity-unverified'; return;
          }
          observation.status = 'sampling';
          const sample = startupObservationProcess('/usr/bin/sample', [String(pid), '2', '10', '-file', join(output, 'startup-predeadline', 'sample.txt')], 8000, () => pending);
          observation.sample = sample.record;
          await sample.promise;
          observation.status = sample.record.closeObserved ? 'sampler-closed' : 'sampler-cleanup-unconfirmed';
        } catch { observation.status = 'observation-unavailable'; }
      })();
    }, 10000);
  } catch { clearTimeout(timer); }
  const result = await outcome;
  clearTimeout(timer);
  if (observation) {
    try {
      observation.settledAt = new Date().toISOString(); observation.requestOutcome = result.resolved ? 'resolved' : 'rejected';
      // No diagnostic task is awaited until the original request has settled.
      try { if (task) await task; } catch {}
      observation.ownerLiveAfterObservation = startupObservationLive(owner, pid);
      observation.skipPostFailureSample = !!observation.sample && !observation.sample.closeObserved &&
        !(observation.sample.spawnFailed && observation.sample.processId === null);
      if (observation.fired) await reportStartupObservation(observation);
    } catch {
      // Unknown cleanup must not overlap the existing postfailure sampler.
      observation.skipPostFailureSample = !!observation.sample && !observation.sample.closeObserved;
    }
  }
  if (!result.resolved) throw result.error;
  if (observation?.fired) {
    const error = new Error('Initial activation was observed by the startup watchdog; this run is diagnostic-only and cannot establish native acceptance.');
    error.code = 'E_STARTUP_DIAGNOSTIC_ONLY'; throw error;
  }
  return result.value;
}

function retainProcessFailure() {
  const processState = { processId: child.pid, exitCode: child.exitCode, signalCode: child.signalCode, launchError: launchError?.message, observedAt: new Date().toISOString() };
  if (initialStartupObservation?.skipPostFailureSample) {
    processState.sample = { status: 'skipped-predeadline-sampler-close-unconfirmed', diagnosticOnly: true };
  } else if (Number.isInteger(child.pid) && child.exitCode === null && child.signalCode === null) {
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
function tooltipFailureSummary(evidence) {
  const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const boolean = value => typeof value === 'boolean' ? value : null;
  const number = value => Number.isFinite(value) ? value : null;
  const integer = value => Number.isSafeInteger(value) ? value : null;
  const allowed = (value, values) => typeof value === 'string' ? (values.includes(value) ? value : 'other') : null;
  const roles = ['AXHelpTag', 'AXWindow', 'AXGroup', 'AXButton', 'AXStaticText', 'AXTextField', 'AXTextArea', 'AXScrollArea', 'AXUnknown', 'AXRow', 'AXTable', 'AXList', 'AXMenu', 'AXMenuItem', 'AXToolbar', 'AXSplitGroup', 'AXTabGroup', 'AXCheckBox', 'AXImage', 'AXRadioButton', 'AXSlider', 'AXComboBox'];
  const geometry = (value, fields) => isRecord(value) ? Object.fromEntries(fields.map(field => [field, number(value[field])])) : null;
  const point = value => geometry(value, ['x', 'y']);
  const frame = value => geometry(value, ['x', 'y', 'width', 'height']);
  const nonempty = value => Number.isFinite(value?.width) && Number.isFinite(value?.height) ? value.width > 0 && value.height > 0 : null;
  const conjunction = values => values.includes(false) ? false : values.every(value => value === true) ? true : null;
  const motion = value => isRecord(value) ? { action: allowed(value.action, ['enter', 'leave']), ok: boolean(value.ok), targetPoint: point(value.targetPoint), triggerFrame: frame(value.triggerFrame) } : null;
  const countValue = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
  const counts = (value, fields) => Object.fromEntries(fields.map(field => [field, isRecord(value) ? countValue(value[field]) : null]));
  const stringCollection = value => {
    const array = Array.isArray(value) ? value : null, inspected = array?.slice(0, 128);
    const strings = inspected?.filter(text => typeof text === 'string');
    return { type: array ? 'array' : value === undefined ? 'missing' : value === null ? 'null' : 'other',
      total: array?.length ?? null, inspected: inspected?.length ?? null, inspectionLimit: 128, complete: array ? array.length <= 128 : null,
      inspectedStringCount: strings?.length ?? null, inspectedNonStringCount: inspected ? inspected.length - strings.length : null,
      inspectedEmptyCount: strings?.filter(text => text.length === 0).length ?? null,
      inspectedNonemptyCount: strings?.filter(text => text.length > 0).length ?? null,
      inspectedExactExpectedCount: strings?.filter(text => text === "Save this document's local checkpoint").length ?? null };
  };
  const readDiagnostic = (value, budget) => {
    if (!isRecord(value) || value.schemaVersion !== 1 || value.status !== 'observed') return null;
    const rows = (value, legacy) => {
      if (!Array.isArray(value)) return { total: null, omitted: null, records: null };
      const key = legacy ? 'legacy' : 'current', selected = value.slice(0, budget[key]);
      budget[key] -= selected.length;
      return { total: value.length, omitted: value.length - selected.length, records: selected.map(row => {
        if (!isRecord(row)) return null;
        const read = allowed(row.read, legacy ? ['unavailable', 'nil', 'returned', 'selector-exception', 'read-exception'] : ['unavailable', 'nil', 'captured']);
        const metadataStatus = allowed(row.metadataStatus, ['observed', 'exception']);
        const returned = read === (legacy ? 'returned' : 'captured');
        const normalized = returned ? boolean(row.normalized) : null;
        return { node: countValue(row.node), ...(legacy ? {} : { field: allowed(row.field, ['value', 'label', 'title', 'text-field-value']), calls: countValue(row.calls) }),
          read, kind: returned ? allowed(row.kind, ['none', 'string', 'attributed-string', 'other', 'unknown']) : null,
          normalized, length: normalized === true ? countValue(row.length) : null,
          nonempty: normalized === true ? boolean(row.nonempty) : null,
          exactExpected: normalized === true && metadataStatus === 'observed' ? boolean(row.exactExpected) : null, metadataStatus };
      }) };
    };
    const privateValue = isRecord(value.private) && value.private.schemaVersion === 1 && value.private.status === 'observed' &&
      value.private.source === 'private-appkit-draw-view' ? value.private : null;
    const privateView = value => isRecord(value) ? {
      hasWindow: boolean(value.hasWindow), sameWindow: boolean(value.sameWindow), inContentSubtree: boolean(value.inContentSubtree),
      windowOnscreen: boolean(value.windowOnscreen), viewVisible: boolean(value.viewVisible), boundsNonempty: boolean(value.boundsNonempty),
      visibleIntersectionNonempty: boolean(value.visibleIntersectionNonempty), frameNonempty: boolean(value.frameNonempty),
      sourceWindowNumber: countValue(value.sourceWindowNumber), frameInSelectedWindow: frame(value.frameInSelectedWindow)
    } : null;
    const privateRows = value => {
      if (!Array.isArray(value)) return { total: null, omitted: null, records: null };
      const selected = value.slice(0, budget.private); budget.private -= selected.length;
      return { total: value.length, omitted: value.length - selected.length, records: selected.map(row => {
        if (!isRecord(row)) return null;
        const read = allowed(row.read, ['unavailable', 'ineligible', 'nil', 'captured', 'exception']);
        const normalized = read === 'captured' ? boolean(row.normalized) : null;
        return { node: countValue(row.node), read, stage: allowed(row.stage, ['class', 'eligibility', 'ivar', 'read', 'normalize', 'recheck', 'retain', 'complete']),
          classMatch: boolean(row.classMatch), ivarPresent: boolean(row.ivarPresent), objectEncoding: boolean(row.objectEncoding),
          kind: read === 'captured' ? allowed(row.kind, ['string', 'attributed-string', 'other']) : null,
          normalized, length: normalized === true ? countValue(row.length) : null,
          nonempty: normalized === true ? boolean(row.nonempty) : null,
          exactExpected: normalized === true ? boolean(row.exactExpected) : null,
          accepted: boolean(row.accepted), uniqueAdded: boolean(row.uniqueAdded),
          before: privateView(row.before), after: privateView(row.after) };
      }) };
    };
    return { schemaVersion: 1, status: 'observed', nodes: countValue(value.nodes), combinedRetainedStrings: countValue(value.combinedRetainedStrings),
      current: { ...counts(value.current, ['fieldSlots', 'calls', 'unavailable', 'nil', 'captured', 'string', 'attributedString', 'other', 'normalizedNil', 'empty', 'nonempty', 'retainedStrings', 'detailLimit', 'detailsOmitted']),
        rows: rows(value.current?.rows, false) },
      legacy: { ...counts(value.legacy, ['nodeLimit', 'nodesConsidered', 'supportedReadsAttempted', 'returned', 'thrown', 'selectorExceptions', 'metadataExceptions', 'nodesOmitted']),
        diagnosticOnly: boolean(value.legacy?.diagnosticOnly), rows: rows(value.legacy?.rows, true) },
      private: { schemaVersion: privateValue ? 1 : null, status: privateValue ? 'observed' : null, source: privateValue ? 'private-appkit-draw-view' : null,
        ...counts(privateValue, ['nodeLimit', 'detailLimit', 'nodesConsidered', 'nodesOmitted', 'classMatches', 'eligibleViews', 'postReadEligibleViews',
          'readAttempts', 'returned', 'nil', 'string', 'attributedString', 'other', 'normalizedNil', 'empty', 'nonempty',
          'acceptedValues', 'uniqueStringsAdded', 'unavailable', 'ineligible', 'exceptions', 'detailsOmitted']),
        rows: privateRows(privateValue?.rows) } };
  };
  const observation = (value, includeRecords) => {
    if (!isRecord(value)) return null;
    const tags = Array.isArray(value.helpTags) ? value.helpTags : null;
    const detailBudget = { current: 16, legacy: 8, private: 4 };
    const inspected = tags?.slice(0, 128).map((tag, index) => {
      const textMatchesExpected = Array.isArray(tag?.strings) && tag.strings.every(text => typeof text === 'string')
        ? tag.strings.includes("Save this document's local checkpoint") : null;
      const roleIsHelpTag = typeof tag?.role === 'string' ? tag.role === 'AXHelpTag' : null;
      const tagFrameNonempty = nonempty(tag?.frame), windowFrameNonempty = nonempty(tag?.windowFrame);
      return { index, windowNumber: integer(tag?.windowNumber), role: allowed(tag?.role, roles), textMatchesExpected, roleIsHelpTag,
        tagFrameNonempty, windowFrameNonempty, matchesShownTagPredicate: conjunction([textMatchesExpected, roleIsHelpTag, tagFrameNonempty, windowFrameNonempty]),
        frame: frame(tag?.frame), windowFrame: frame(tag?.windowFrame),
        stringCollection: includeRecords && index < 8 ? stringCollection(tag?.strings) : null,
        textReadDiagnostic: includeRecords && index < 8 ? readDiagnostic(tag?.textReadDiagnostic, detailBudget) : null };
    }) ?? null;
    const count = field => tags && tags.length <= 128 && inspected.every(tag => typeof tag[field] === 'boolean')
      ? inspected.filter(tag => tag[field]).length : null;
    const windows = Array.isArray(value.windows) ? value.windows : null;
    return {
      phase: allowed(value.phase, ['outside-before-hover', 'hover', 'before-exit', 'outside-after-hover']),
      postEventsAllowed: boolean(value.postEventsAllowed), accessibilityTrusted: boolean(value.accessibilityTrusted),
      ownerVisible: boolean(value.ownerVisible), ownerKey: boolean(value.ownerKey), applicationActive: boolean(value.applicationActive),
      traversalTruncated: boolean(value.traversalTruncated), cursorInsideTrigger: boolean(value.cursorInsideTrigger), pointerRunning: boolean(value.pointerRunning),
      triggerFrame: frame(value.triggerFrame), cursor: point(value.cursor),
      helpTags: { total: tags?.length ?? null, inspected: inspected?.length ?? null, inspectionLimit: 128,
        inspectionTruncated: tags ? tags.length > 128 : null, matchingExpectedTextCount: count('textMatchesExpected'), matchingShownTagPredicateCount: count('matchesShownTagPredicate'),
        retainedLimit: includeRecords ? 8 : 0, recordsOmitted: tags ? Math.max(0, tags.length - (includeRecords ? 8 : 0)) : null,
        records: includeRecords ? inspected?.slice(0, 8) ?? null : null },
      windows: { total: windows?.length ?? null, retainedLimit: includeRecords ? 12 : 0,
        recordsOmitted: windows ? Math.max(0, windows.length - (includeRecords ? 12 : 0)) : null,
        records: includeRecords ? windows?.slice(0, 12).map(window => {
          const observedRoles = Array.isArray(window?.roles) ? window.roles : null;
          return { number: integer(window?.number), visible: boolean(window?.visible), onscreen: boolean(window?.onscreen), frame: frame(window?.frame),
            roles: observedRoles?.slice(0, 12).map(role => allowed(role, roles)) ?? null,
            rolesOmitted: observedRoles ? Math.max(0, observedRoles.length - 12) : null };
        }) ?? null : null }
    };
  };
  const latest = isRecord(evidence?.lastObservation) ? 'lastObservation' : isRecord(evidence?.initial) ? 'initial' : null;
  return {
    status: allowed(evidence?.status, ['pending', 'blocked', 'failed', 'passed']),
    permission: { postEventsAllowed: boolean(evidence?.permission?.postEventsAllowed), accessibilityTrusted: boolean(evidence?.permission?.accessibilityTrusted) },
    pointerRequests: { initialExit: motion(evidence?.initialExit), enter: motion(evidence?.enter), exit: motion(evidence?.exit) },
    baseline: observation(evidence?.baseline, false), shownObservation: observation(evidence?.shown?.observation, true),
    observationSource: latest, observation: observation(latest ? evidence[latest] : null, true)
  };
}

function reportTooltipFailure() {
  const begin = 'NYCTRON_TOOLTIP_EVIDENCE_BEGIN', end = 'NYCTRON_TOOLTIP_EVIDENCE_END';
  const originalByteLimit = 1024 * 1024, logByteLimit = 16 * 1024;
  const report = {
    schemaVersion: 1, status: 'unavailable', sourceRevision: revision, processId: Number.isSafeInteger(child.pid) ? child.pid : null,
    diagnosticOnly: true, selection: 'allowlisted-derived-tooltip-subset', outputSummaryOmitted: false, diagnosticRowsOmittedForByteLimit: false, logByteLimit,
    omittedOriginalFields: ['error', 'reason', 'boundary', 'coordinates', 'helpTags.strings', 'windows.class', 'capture'],
    original: { filename: 'tooltip-hover.json', bytes: null, sha256: null, completeRead: null, readByteLimit: originalByteLimit + 1 }
  };
  try {
    const file = join(output, 'tooltip-hover.json');
    if (!lstatSync(file).isFile()) throw new Error('Expected the retained tooltip evidence file');
    const bytes = Buffer.alloc(originalByteLimit + 1);
    const descriptor = openSync(file, 'r');
    let length = 0;
    try {
      while (length < bytes.length) {
        const read = readSync(descriptor, bytes, length, bytes.length - length, null);
        if (read === 0) break;
        length += read;
      }
    } finally { closeSync(descriptor); }
    if (length > originalByteLimit) {
      report.status = 'original-over-read-limit'; report.original.bytesRead = length; report.original.completeRead = false;
    } else {
      const original = bytes.subarray(0, length);
      report.original.bytes = length; report.original.sha256 = hash(original); report.original.completeRead = true;
      const evidence = JSON.parse(original.toString('utf8'));
      if (evidence?.schemaVersion !== 1) throw new Error('Unexpected tooltip evidence schema');
      report.summary = tooltipFailureSummary(evidence);
      report.status = 'summary';
    }
  } catch { report.status = 'readback-unavailable'; }
  try {
    let message = begin + '\n' + JSON.stringify(report) + '\n' + end + '\n';
    if (Buffer.byteLength(message, 'utf8') > logByteLimit && (report.summary?.observation || report.summary?.shownObservation)) {
      // Drop detail rows from both snapshots first; preserve their omission
      // counts, public/private totals and shown/final tooltip predicates.
      for (const snapshot of [report.summary.shownObservation, report.summary.observation]) {
        for (const tag of snapshot?.helpTags.records ?? []) {
          for (const kind of ['current', 'legacy', 'private']) {
            const rows = tag.textReadDiagnostic?.[kind]?.rows;
            if (Array.isArray(rows?.records) && rows.records.length) {
              rows.omitted += rows.records.length; rows.records = [];
              report.diagnosticRowsOmittedForByteLimit = true;
            }
          }
        }
      }
      message = begin + '\n' + JSON.stringify(report) + '\n' + end + '\n';
    }
    if (Buffer.byteLength(message, 'utf8') > logByteLimit) {
      delete report.summary; report.status = 'omitted-over-log-limit'; report.outputSummaryOmitted = true;
      message = begin + '\n' + JSON.stringify(report) + '\n' + end + '\n';
    }
    // All envelope strings are fixed or validated identities. Reporting stays
    // secondary to the original failure and never modifies retained JSON bytes.
    if (Buffer.byteLength(message, 'utf8') <= logByteLimit) console.info(message.slice(0, -1));
  } catch {}
}

function startupProject(kind, value) {
  const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  if (!object(value)) return null;
  const bool = x => typeof x === 'boolean' ? x : null;
  const integer = x => Number.isSafeInteger(x) && x >= 0 ? x : null;
  const number = x => Number.isFinite(x) && x >= 0 && x <= Number.MAX_SAFE_INTEGER ? x : null;
  const time = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString() === x ? x : null;
  const commands = ['ping', 'waitFor', 'navigate', 'openFile', 'setAppAppearance', 'capture', 'quit', 'tron.inspect', 'tron.control', 'tron.window', 'tron.windows', 'tron.popover', 'tron.responder', 'tron.menu', 'tron.context-menu', 'tron.drag-protocol', 'tron.pointer', 'tron.tooltip', 'unrecognized-command'];
  const phases = {
    activation: ['policy-entered', 'policy-returned', 'workspace-request-entered', 'workspace-request-returned', 'workspace-completion-received', 'workspace-main-continuation', 'workspace-rejected', 'identity-checked', 'deminiaturize-entered', 'deminiaturize-returned', 'order-front-entered', 'order-front-returned', 'reply-prepared', 'trace-encoding-failed', 'trace-encoding-threw'],
    transport: ['request-received', 'main-dispatched', 'main-replied', 'serialization-failed', 'failure-serialization-failed', 'serialized', 'send-buffer-failed', 'send-failed', 'send-completed', 'trace-bound-reached', 'trace-encoding-failed', 'trace-encoding-threw'],
    commands: ['socket-connecting', 'socket-connected', 'authentication-started', 'authentication-response', 'authentication-failed', 'request-started', 'request-failed', 'response'],
  };
  if (!phases[kind]?.includes(value.phase)) return null;
  if (kind === 'commands') {
    const request = object(value.request) ? value.request : {}, response = object(value.response) ? value.response : {};
    return { phase: value.phase, at: time(value.at), command: commands.includes(request.command) ? request.command : null,
      requestId: integer(request.id), responseId: integer(response.id),
      ok: bool(value.phase === 'authentication-response' ? value.ok : response.ok), protocol: integer(value.protocol) };
  }
  const details = object(value.details) ? value.details : {};
  const result = { phase: value.phase, atEpochSeconds: number(value.at), mainThread: bool(value.mainThread) };
  if (kind === 'transport') {
    result.sequence = integer(value.sequence); result.command = commands.includes(value.command) ? value.command : null;
    result.details = {};
    for (const key of ['parsed', 'dictionary', 'nilResponse', 'validJSONObject', 'hasError', 'threwException', 'replacedWithFailure']) result.details[key] = bool(details[key]);
    for (const key of ['bytes', 'errno']) result.details[key] = integer(details[key]);
    result.details.errorCode = Number.isSafeInteger(details.errorCode) ? details.errorCode : null;
  } else {
    result.operation = integer(value.operation); result.details = {};
    for (const key of ['accepted', 'hasApplication', 'hasError', 'sameProcess', 'sameBundle', 'ok']) result.details[key] = bool(details[key]);
    const state = object(details.state) ? details.state : details;
    result.state = { policy: [0, 1, 2].includes(state.policy) ? state.policy : null };
    for (const key of ['applicationActive', 'visible', 'key', 'miniaturized', 'canBecomeKey']) result.state[key] = bool(state[key]);
    if (value.phase === 'workspace-main-continuation') {
      const timing = object(details.timing) ? details.timing : {}, knownClock = timing.clock === 'CACurrentMediaTime';
      result.timing = { clock: knownClock ? 'CACurrentMediaTime' : null,
        clockExcludesSystemSleep: knownClock && timing.clockExcludesSystemSleep === true ? true : null,
        intervalsAreNotQueueResidence: knownClock && timing.intervalsAreNotQueueResidence === true ? true : null,
        intervalsDoNotEstablishCause: knownClock && timing.intervalsDoNotEstablishCause === true ? true : null,
        completionTraceElapsedSeconds: knownClock ? number(timing.completionTraceElapsedSeconds) : null,
        submissionStartToMainEntrySeconds: knownClock ? number(timing.submissionStartToMainEntrySeconds) : null };
    }
  }
  return result;
}
function startupStream(kind, bytes, ownedPid, completeAtRead) {
  const result = { status: bytes ? 'projected' : 'unavailable', coverage: kind === 'commands' ? 'bounded-command-file-read' : 'retained-live-log-prefix',
    completeAtRead: completeAtRead === true, finalAppLogClaim: false, lineByteLimit: 8192, lineScanLimit: 4096,
    scannedLines: 0, unscannedLines: 0, partialTrailingLine: false, ignoredLines: 0, oversizedLines: 0,
    malformedRecords: 0, pidMismatchRecords: 0, unsupportedRecords: 0, matchedRecords: 0, selectedRecords: 0, omittedRecords: 0, outputOmittedRecords: 0,
    selection: 'first-16-and-last-16-with-oldest-removal-if-output-limit', records: [] };
  if (!bytes) return result;
  const lines = bytes.toString('utf8').split('\n');
  result.partialTrailingLine = lines.at(-1) !== ''; lines.pop();
  result.unscannedLines = Math.max(0, lines.length - result.lineScanLimit);
  const first = [], last = [];
  for (const [index, raw] of lines.slice(0, result.lineScanLimit).entries()) {
    result.scannedLines++;
    const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw;
    if (Buffer.byteLength(line, 'utf8') > result.lineByteLimit) { result.oversizedLines++; continue; }
    let text = line;
    if (kind !== 'commands') {
      const match = line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,9})? [^\r\n\[\]]{1,128}\[(\d{1,10}):\d{1,20}\] (NYCTronActivation|NYCTronDriverTransport) (.*)$/);
      const prefix = kind === 'activation' ? 'NYCTronActivation' : 'NYCTronDriverTransport';
      if (!match || match[2] !== prefix) { result.ignoredLines++; continue; }
      if (!Number.isSafeInteger(ownedPid) || ownedPid <= 0 || Number(match[1]) !== ownedPid) { result.pidMismatchRecords++; continue; }
      text = match[3];
    }
    let value;
    try { value = ['trace-encoding-failed', 'trace-encoding-threw'].includes(text) ? { phase: text } : JSON.parse(text); }
    catch { result.malformedRecords++; continue; }
    const selected = startupProject(kind, value);
    if (!selected) { result.unsupportedRecords++; continue; }
    const record = { line: index + 1, ...selected }; result.matchedRecords++;
    if (first.length < 16) first.push(record);
    else { last.push(record); if (last.length > 16) last.shift(); }
  }
  result.records = [...first, ...last]; result.selectedRecords = result.records.length;
  result.omittedRecords = result.matchedRecords - result.selectedRecords;
  return result;
}
function startupProcess(value, ownedPid) {
  const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const integer = x => Number.isSafeInteger(x) && x >= 0 ? x : null;
  const time = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString() === x ? x : null;
  if (!object(value)) return { status: 'unavailable' };
  const processId = integer(value.processId);
  if (!Number.isSafeInteger(ownedPid) || ownedPid <= 0 || processId !== ownedPid) return { status: 'pid-mismatch', processId };
  const signals = ['SIGABRT', 'SIGALRM', 'SIGBUS', 'SIGFPE', 'SIGHUP', 'SIGILL', 'SIGINT', 'SIGKILL', 'SIGPIPE', 'SIGQUIT', 'SIGSEGV', 'SIGTERM', 'SIGTRAP', 'SIGUSR1', 'SIGUSR2', 'SIGXCPU', 'SIGXFSZ'];
  const state = (item, signalKey = 'signal') => object(item) ? { observedAt: time(item.observedAt),
    exitCode: integer(item.exitCode), exitCodeAvailable: Object.hasOwn(item, 'exitCode') && (item.exitCode === null || integer(item.exitCode) !== null),
    signal: signals.includes(item[signalKey]) ? item[signalKey] : null,
    signalAvailable: Object.hasOwn(item, signalKey) && (item[signalKey] === null || signals.includes(item[signalKey])) } : null;
  const sample = object(value.sample) ? value.sample : null;
  return { status: 'projected', processId, ...state(value, 'signalCode'), beforeSample: state(value.beforeSample), afterSample: state(value.afterSample),
    sample: sample ? { ...state(sample), durationSeconds: integer(sample.durationSeconds), intervalMilliseconds: integer(sample.intervalMilliseconds),
      threadGroups: integer(sample.threadGroups), hasThreadStacks: typeof sample.hasThreadStacks === 'boolean' ? sample.hasThreadStacks : null,
      file: sample.file === 'native-process-sample.txt' ? sample.file : null,
      sha256: typeof sample.sha256 === 'string' && /^[a-f0-9]{64}$/.test(sample.sha256) ? sample.sha256 : null,
      digestScope: 'producer-recorded-sample-file-not-reread', stacksDoNotEstablishHealth: true } : null };
}
function readStartupInput(filename, live = false) {
  const cap = live ? 1024 * 1024 : 256 * 1024;
  const info = { filename, status: 'unavailable', readByteLimit: cap + (live ? 0 : 1), readBytes: 0,
    sourceLive: live, sourceBytesBefore: null, sourceBytesAfter: null, sameFileIdentity: null, changedDuringRead: null,
    completeAtRead: false, completeOriginalFile: false, originalSha256: null, truncated: null, laterAppendsPossible: live, unreadBytesObserved: null, snapshot: null };
  let fd, bytes, before, after, current, eof = false, failed = false, stage = 'open';
  try {
    if (!['app.log', 'commands.jsonl', 'native-process-failure.json'].includes(filename) || live !== (filename === 'app.log')) throw new Error('Unexpected startup input');
    const path = join(output, filename);
    if (!lstatSync(path).isFile()) throw new Error('Startup input is not a regular file');
    fd = openSync(path, 'r'); before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size < 0) throw new Error('Invalid startup input size');
    info.sourceBytesBefore = before.size;
    const maximum = live ? Math.min(cap, before.size) : cap + 1, buffer = Buffer.alloc(maximum);
    stage = 'read';
    while (info.readBytes < maximum) {
      const count = readSync(fd, buffer, info.readBytes, maximum - info.readBytes, info.readBytes);
      if (count === 0) { eof = true; break; }
      info.readBytes += count;
    }
    bytes = buffer.subarray(0, info.readBytes); after = fstatSync(fd); current = lstatSync(path);
    info.sourceBytesAfter = after.size;
    info.sameFileIdentity = current.isFile() && [after, current].every(x => x.dev === before.dev && x.ino === before.ino);
    info.changedDuringRead = !info.sameFileIdentity || [after, current].some(x => x.size !== before.size || x.mtimeMs !== before.mtimeMs || x.ctimeMs !== before.ctimeMs);
    info.truncated = live ? before.size > cap || bytes.length < before.size : bytes.length > cap;
    info.unreadBytesObserved = Math.max(0, after.size - bytes.length);
    info.completeAtRead = info.sameFileIdentity && !info.changedDuringRead && bytes.length === before.size && (live || eof);
    info.completeOriginalFile = !live && !info.truncated && !info.changedDuringRead && info.completeAtRead;
    if (info.completeOriginalFile) info.originalSha256 = hash(bytes);
  } catch { failed = true; info.status = stage + '-failed'; }
  finally {
    if (fd !== undefined) {
      try { closeSync(fd); }
      catch { failed = true; info.status = 'close-failed'; }
    }
  }
  if (failed) { info.completeOriginalFile = false; info.originalSha256 = null; return { info }; }
  if (live) {
    const filename = 'startup-app-log-snapshot.log';
    info.snapshot = { filename, kind: 'read-time-prefix-from-live-app-log', offset: 0, bytes: bytes.length, sha256: null, retained: false, eventualAppLogHash: false };
    try {
      writeFileSync(join(output, filename), bytes, { flag: 'wx' });
      info.snapshot.sha256 = hash(bytes); info.snapshot.retained = true; info.status = 'snapshot-retained';
    } catch { info.status = 'snapshot-retention-failed'; return { info }; }
  } else info.status = info.completeOriginalFile ? 'complete-stable-read' : 'incomplete-or-changing-read';
  return { info, bytes: bytes.subarray(0, cap) };
}
function reportStartupFailure() {
  // Only fixed existing files are read. This runs after failure capture while
  // the owner still holds the socket/app; it never sends a driver request.
  try {
    const app = readStartupInput('app.log', true), commands = readStartupInput('commands.jsonl'), processFile = readStartupInput('native-process-failure.json');
    const processId = Number.isSafeInteger(child.pid) && child.pid > 0 ? child.pid : null;
    let processRecord;
    processFile.info.jsonStatus = 'not-read-completely';
    if (processFile.info.completeOriginalFile) {
      try { processRecord = JSON.parse(processFile.bytes.toString('utf8')); processFile.info.jsonStatus = 'parsed'; }
      catch { processFile.info.jsonStatus = 'invalid-json'; }
    }
    const report = { schemaVersion: 1, diagnosticOnly: true, sourceRevision: revision, processId, capturedAt: new Date().toISOString(),
      selection: 'typed-startup-failure-projection', consoleByteLimit: 32768, missingTraceDoesNotProveNonexecution: true,
      inputs: { appLog: app.info, commands: commands.info, processFailure: processFile.info },
      activation: startupStream('activation', app.bytes, processId, app.info.completeAtRead),
      transport: startupStream('transport', app.bytes, processId, app.info.completeAtRead),
      commands: startupStream('commands', commands.bytes, processId, commands.info.completeOriginalFile),
      process: startupProcess(processRecord, processId) };
    const begin = 'NYCTRON_STARTUP_EVIDENCE_BEGIN', end = 'NYCTRON_STARTUP_EVIDENCE_END';
    const encode = () => begin + '\n' + JSON.stringify(report) + '\n' + end + '\n';
    let envelope = encode();
    while (Buffer.byteLength(envelope, 'utf8') > report.consoleByteLimit) {
      const selected = [report.activation, report.transport, report.commands].sort((a, b) => b.records.length - a.records.length)[0];
      if (selected.records.length <= 1) break;
      selected.records.shift(); selected.outputOmittedRecords++; selected.selectedRecords--; selected.omittedRecords++;
      envelope = encode();
    }
    if (Buffer.byteLength(envelope, 'utf8') > report.consoleByteLimit) {
      for (const selected of [report.activation, report.transport, report.commands]) {
        selected.outputOmittedRecords += selected.records.length; selected.omittedRecords += selected.records.length; selected.selectedRecords = 0; selected.records = [];
      }
      report.projectionOmittedForOutputLimit = true; envelope = encode();
    }
    if (Buffer.byteLength(envelope, 'utf8') <= report.consoleByteLimit) console.info(envelope.slice(0, -1));
  } catch {
    // Read, snapshot, projection and console failures remain secondary. No
    // arbitrary error string is logged and the caller rethrows its first error.
  }
}

// Failure-only observation of responses already returned to show's unchanged
// polling predicate. This never requests activation, focus, or another snapshot.
function projectShowResponse(value, expectedProcessId) {
  const record = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const boolean = input => typeof input === 'boolean' ? input : null;
  const pid = input => Number.isSafeInteger(input) && input > 0;
  const matchesPid = input => pid(input) && pid(expectedProcessId) ? input === expectedProcessId : null;
  return {
    assertions: {
      processIdMatches: matchesPid(record.processId),
      activationPolicyRegular: Number.isSafeInteger(record.activationPolicy) ? record.activationPolicy === 0 : null,
      canBecomeKey: boolean(record.canBecomeKey),
    },
    conjunction: {
      visible: boolean(record.visible), key: boolean(record.key),
      applicationActive: boolean(record.applicationActive),
      frontmostProcessMatches: matchesPid(record.frontmostProcessId),
    },
  };
}
function createShowObservation(window, expectedProcessId) {
  return { owner: window === 'main' || window === 'document-1' ? window : null,
    expectedProcessId: Number.isSafeInteger(expectedProcessId) && expectedProcessId > 0 ? expectedProcessId : null,
    returnedResponses: 0, stateChanges: 0, retained: [], last: null, lastSignature: null,
    captureFailed: false, countOverflow: false };
}
function captureShowResponse(observation, value) {
  try {
    const increment = name => {
      if (Number.isSafeInteger(observation[name]) && observation[name] < Number.MAX_SAFE_INTEGER) observation[name]++;
      else { observation[name] = null; observation.countOverflow = true; }
    };
    increment('returnedResponses');
    let state;
    try { state = projectShowResponse(value, observation.expectedProcessId); }
    catch { observation.captureFailed = true; state = projectShowResponse(null, observation.expectedProcessId); }
    const signature = JSON.stringify(state);
    const changed = observation.last !== null && signature !== observation.lastSignature;
    if (changed) increment('stateChanges');
    const record = { response: observation.returnedResponses, changed, state };
    if (observation.last === null || changed) {
      observation.retained.push(record);
      // First response + latest six changes; reserve the eighth slot for last.
      if (observation.retained.length > 7) observation.retained.splice(1, observation.retained.length - 7);
    }
    observation.last = record; observation.lastSignature = signature;
  } catch { observation.captureFailed = true; }
}
function showObservationSummary(observation) {
  const selected = observation.retained.slice();
  if (observation.last && selected.at(-1) !== observation.last) selected.push(observation.last);
  const retainedChanges = selected.filter(record => record.changed).length;
  return {
    schemaVersion: 1, status: 'failed-show-poll', diagnosticOnly: true,
    sourceRevision: typeof revision === 'string' && /^[a-f0-9]{40}$/.test(revision) ? revision : null,
    owner: observation.owner, expectedProcessId: observation.expectedProcessId,
    scope: 'already-returned-show-inspect-responses', recordLimit: 8, consoleByteLimit: 8192,
    selection: 'first-and-last-response-plus-latest-state-changes',
    returnedResponses: observation.returnedResponses, stateChanges: observation.stateChanges,
    selectedRecords: selected.length,
    omittedResponses: Number.isSafeInteger(observation.returnedResponses) ? observation.returnedResponses - selected.length : null,
    omittedStateChanges: Number.isSafeInteger(observation.stateChanges) ? observation.stateChanges - retainedChanges : null,
    captureFailed: observation.captureFailed, countOverflow: observation.countOverflow,
    records: selected.map(record => ({
      response: record.response, first: record === observation.retained[0], last: record === observation.last,
      stateChange: record.changed, assertions: record.state.assertions, conjunction: record.state.conjunction,
    })),
  };
}
function reportShowFailure(observation) {
  try {
    const summary = showObservationSummary(observation);
    const filename = 'window-show-failure.json';
    const original = { filename, writeStatus: 'not-attempted', writeErrorCode: null };
    const report = { ...summary, original };
    const encode = () => 'NYCTRON_WINDOW_SHOW_EVIDENCE_BEGIN\n' + JSON.stringify(report) + '\nNYCTRON_WINDOW_SHOW_EVIDENCE_END\n';
    if (Buffer.byteLength(encode(), 'utf8') > summary.consoleByteLimit) {
      report.omittedResponses = summary.returnedResponses;
      report.omittedStateChanges = summary.stateChanges;
      report.selectedRecords = 0; report.records = [];
      report.status = 'failed-show-poll-details-omitted';
    }
    if (Buffer.byteLength(encode(), 'utf8') > summary.consoleByteLimit) return;
    // The original file is observation data only; write status belongs to the
    // console receipt. A duplicate failure cannot replace the first file.
    const { original: omittedWriteStatus, ...fileRecord } = report;
    try {
      writeFileSync(join(output, filename), JSON.stringify(fileRecord) + '\n', { flag: 'wx' });
      original.writeStatus = 'retained';
    } catch (error) {
      original.writeStatus = 'failed';
      original.writeErrorCode = ['EACCES', 'EPERM', 'EEXIST', 'ENOSPC', 'EIO', 'ENOENT'].includes(error?.code) ? error.code : 'other';
    }
    const envelope = encode();
    if (Buffer.byteLength(envelope, 'utf8') <= summary.consoleByteLimit) console.info(envelope.slice(0, -1));
  } catch {
    // Diagnostic projection, file, and console failures never replace the
    // original show assertion, inspect rejection, or timeout object.
  }
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
async function show(window = 'main', observeStartupRequest = false) {
  const response = driver.request('tron.window', { window, action: 'show' });
  const request = await (observeStartupRequest ? observeInitialWindowRequest(response) : response);
  if (observeStartupRequest) assert.equal(request.activationPath, 'NSWorkspace.openApplication');
  else assert.ok(request.activationPath === 'NSWorkspace.openApplication' || request.activationPath === 'NSWindow.makeKeyAndOrderFront', 'Expected a supported native owner-selection path');
  if (request.activationPath === 'NSWindow.makeKeyAndOrderFront') assert.equal(request.priorWorkspaceIdentityVerified, true, 'Direct owner selection requires the prior verified Workspace identity');
  assert.equal(request.processId, child.pid, 'Window selection must retain the launched acceptance process');
  const observation = createShowObservation(window, child.pid);
  try {
    return await waitFor(async () => {
      const observed = await inspect(undefined, window);
      captureShowResponse(observation, observed);
      assert.equal(observed.processId, child.pid);
      assert.equal(observed.activationPolicy, 0, 'Interactive acceptance requires regular AppKit activation policy');
      assert.equal(observed.canBecomeKey, true, 'The requested owner must be able to become key');
      return observed.visible && observed.key && observed.applicationActive && observed.frontmostProcessId === child.pid ? observed : undefined;
    }, `visible, key and active native owner window (${window})`);
  } catch (error) {
    reportShowFailure(observation);
    throw error;
  }
}
const control = (testID, action, options = {}, window = 'main') => driver.request('tron.control', { testID, action, window, ...options });
const mounted = testID => driver.request('waitFor', { testID, timeoutMs: 20000 });
const status = text => waitFor(async () => (await inspect('status-main')).label.includes(text), text);
const popover = (window = 'main', action) => driver.request('tron.popover', { window, testID: `inspector-${window}`, ...(action ? { action } : {}) });
async function armPopoverCloseObservation(window, shown) {
  const armed = await popover(window, 'arm-close-observation');
  assert.equal(armed.nativePopover, true);
  assert.equal(armed.shown, true);
  assert.equal(armed.contentVisible, true);
  assert.ok(typeof shown?.contentIdentity === 'string' && shown.contentIdentity.length > 0 &&
    typeof armed.contentIdentity === 'string' && armed.contentIdentity.length > 0, 'Close observation requires nonempty native content identities');
  assert.equal(armed.contentIdentity, shown.contentIdentity, 'Close observation must bind the same shown popover content');
  const observation = armed.closeObservation;
  assert.equal(observation?.schemaVersion, 1);
  assert.equal(observation.status, 'armed');
  assert.equal(observation.identityMatches, true);
  assert.equal(observation.armedWhileShown, true);
  assert.ok(Number.isSafeInteger(observation.sequence) && observation.sequence >= 1 && observation.sequence <= 2);
  return { sequence: observation.sequence, contentIdentity: armed.contentIdentity };
}
function popoverCloseCompleted(current, armed) {
  const observation = current?.closeObservation;
  return typeof armed?.contentIdentity === 'string' && armed.contentIdentity.length > 0 &&
    typeof current?.contentIdentity === 'string' && current.contentIdentity.length > 0 &&
    Number.isSafeInteger(armed.sequence) && armed.sequence >= 1 && armed.sequence <= 2 &&
    current?.nativePopover === true && current.shown === false &&
    current.contentIdentity === armed.contentIdentity &&
    observation?.schemaVersion === 1 && observation.status === 'completed' &&
    observation.sequence === armed.sequence && observation.identityMatches === true &&
    observation.armedWhileShown === true && Number.isSafeInteger(observation.didCloseCount) &&
    observation.didCloseCount > 0 && observation.didCloseCount <= 8 && observation.didCloseOnMain === true &&
    observation.postDidCloseMainTurnObserved === true && observation.expired === false &&
    observation.released === false && observation.threadViolation === false && observation.overflowed === false;
}
function projectPopoverPresentation(value) {
  const read = (object, name) => {
    if (!object || typeof object !== 'object' || Array.isArray(object)) return undefined;
    const descriptor = Object.getOwnPropertyDescriptor(object, name);
    return descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : undefined;
  };
  const boolean = item => typeof item === 'boolean' ? item : null;
  const choice = (item, allowed) => allowed.includes(item) ? item : null;
  const rectangle = item => {
    const names = ['x', 'y', 'width', 'height'];
    const values = names.map(name => read(item, name));
    const finite = values.every(field => typeof field === 'number' && Number.isFinite(field));
    const complete = finite && Number.isFinite(values[0] + values[2]) && Number.isFinite(values[1] + values[3]);
    return { status: item == null ? 'missing' : complete ? 'observed' : 'invalid',
      ...Object.fromEntries(names.map((name, index) =>
        [name, typeof values[index] === 'number' && Number.isFinite(values[index]) ? values[index] : null])) };
  };
  const known = read(value, 'schemaVersion') === 1 && read(value, 'status') === 'observed';
  const current = known ? read(value, 'current') : null;
  const context = item => {
    const status = choice(read(item, 'status'), ['observed', 'unavailable', 'stale']);
    const sameGeneration = boolean(read(item, 'sameGeneration'));
    const sameLifetime = boolean(read(item, 'sameLifetime'));
    const sameIdentity = boolean(read(item, 'sameIdentity'));
    const sameScopeToken = boolean(read(item, 'sameScopeToken'));
    const samePresentationToken = boolean(read(item, 'samePresentationToken'));
    const sameParameters = boolean(read(item, 'sameParameters'));
    return { status, sameGeneration, sameLifetime, sameIdentity, sameScopeToken, samePresentationToken, sameParameters };
  };
  const qualified = item => item.status === 'observed' &&
    item.sameLifetime === true && item.sameIdentity === true;
  const branchSource = known ? read(value, 'lastBranch') : null;
  const branch = context(branchSource);
  const showSource = known ? read(value, 'lastShow') : null;
  const show = context(showSource);
  const showValid = qualified(show);
  const stage = showValid ? choice(read(showSource, 'stage'), ['entered', 'returned']) : null;
  const returned = stage === 'returned';
  const contained = returned ? boolean(read(showSource, 'contained')) : null;
  return {
    schemaVersion: known ? 1 : null, status: known ? 'observed' : 'unavailable',
    scope: 'current-fields-and-identity-qualified-last-executed-records',
    lastRecordsAreHistorical: true,
    showAnchorCoordinates: 'positioning-view', regionAndFrameCoordinates: 'owner-content-top-left',
    current: {
      ...Object.fromEntries(['controlledVisible', 'closing', 'silentClose', 'hasOwner', 'ownerMatchesCommand',
        'componentWindowMatchesCommand', 'ownerVisible', 'ownerMiniaturized', 'hasPositioningView',
        'hasContent', 'hasChildren', 'hasContentWindow', 'hasFabricState', 'scopeTokenPresent',
        'presentationTokenPresent', 'presentedTokenMatches', 'dismissedTokenMatches', 'rejectedTokenMatches']
        .map(name => [name, boolean(read(current, name))])),
      preferredEdge: choice(read(current, 'preferredEdge'), ['above', 'below']),
      anchor: rectangle(read(current, 'anchor')), contentSize: rectangle(read(current, 'contentSize')),
    },
    lastBranch: { ...branch, branch: qualified(branch) ? choice(read(branchSource, 'branch'),
      ['closing', 'content-prerequisites', 'token-suppressed', 'owner-unavailable', 'show-entered',
        'show-not-shown', 'content-window-unavailable', 'coordinates-pending', 'coordinates-ready', 'outside-region']) : null },
    lastShow: { ...show, stage,
      attempt: showValid && Number.isSafeInteger(read(showSource, 'attempt')) && read(showSource, 'attempt') >= 1 && read(showSource, 'attempt') <= 4 ? read(showSource, 'attempt') : null,
      edge: showValid ? choice(read(showSource, 'edge'), ['min-x', 'max-x', 'min-y', 'max-y']) : null,
      shownAfterCall: returned ? boolean(read(showSource, 'shownAfterCall')) : null,
      contentWindowPresent: returned ? boolean(read(showSource, 'contentWindowPresent')) : null,
      contained, coordinatesReady: contained === true ? boolean(read(showSource, 'coordinatesReady')) : null,
      anchor: rectangle(showValid && stage !== null ? read(showSource, 'anchor') : null),
      region: rectangle(showValid && stage !== null ? read(showSource, 'region') : null),
      actualFrame: rectangle(contained !== null ? read(showSource, 'actualFrame') : null),
    },
  };
}
function projectPopoverResponse(value, firstIdentity = null) {
  const read = (object, name) => {
    if (!object || typeof object !== 'object' || Array.isArray(object)) return undefined;
    const descriptor = Object.getOwnPropertyDescriptor(object, name);
    return descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : undefined;
  };
  const boolean = item => typeof item === 'boolean' ? item : null;
  const rectangle = item => {
    const values = ['x', 'y', 'width', 'height'].map(name => read(item, name));
    const fields = Object.fromEntries(['x', 'y', 'width', 'height'].map((name, index) =>
      [name, typeof values[index] === 'number' && Number.isFinite(values[index]) ? values[index] : null]));
    return { status: item == null ? 'missing' : values.every(field => typeof field === 'number' && Number.isFinite(field)) ? 'observed' : 'invalid', ...fields };
  };
  const frame = rectangle(read(value, 'frame')), region = rectangle(read(value, 'region'));
  const nonempty = rect => rect.status === 'observed' ? rect.width > 0 && rect.height > 0 : null;
  const frameNonempty = nonempty(frame), regionNonempty = nonempty(region);
  const extents = [frame.x + frame.width, frame.y + frame.height, region.x + region.width, region.y + region.height];
  const frameInsideRegion = frameNonempty === true && regionNonempty === true && extents.every(Number.isFinite)
    ? frame.x >= region.x && frame.y >= region.y && extents[0] <= extents[2] && extents[1] <= extents[3] : null;
  const rawIdentity = read(value, 'contentIdentity');
  const identity = typeof rawIdentity === 'string' && rawIdentity.length > 0 && rawIdentity.length <= 128 ? rawIdentity : null;
  return {
    // The bounded identity string stays private. Presence is a string-shape
    // observation, not proof that its represented native object is nonnull/live.
    identity,
    state: {
      nativePopover: boolean(read(value, 'nativePopover')),
      conjunction: { shown: boolean(read(value, 'shown')), contentVisible: boolean(read(value, 'contentVisible')) },
      identity: {
        stringPresent: typeof rawIdentity === 'string' && rawIdentity.length <= 128 ? rawIdentity.length > 0 : null,
        matchesFirstObserved: identity !== null && firstIdentity !== null ? identity === firstIdentity : null,
      },
      frame, region, geometry: { frameNonempty, regionNonempty, frameInsideRegion },
      presentation: projectPopoverPresentation(read(value, 'presentationObservation')),
    },
  };
}
function createPopoverObservation(window) {
  return { owner: window === 'main' || window === 'document-1' ? window : null,
    returnedResponses: 0, stateChanges: 0, retained: [], last: null, lastSignature: null,
    firstIdentity: null, identityBaselineResponse: null, captureFailed: false, countOverflow: false };
}
function capturePopoverResponse(observation, value) {
  try {
    const increment = name => {
      if (Number.isSafeInteger(observation[name]) && observation[name] < Number.MAX_SAFE_INTEGER) observation[name]++;
      else { observation[name] = null; observation.countOverflow = true; }
    };
    increment('returnedResponses');
    let projected;
    try { projected = projectPopoverResponse(value, observation.firstIdentity); }
    catch { observation.captureFailed = true; projected = projectPopoverResponse(null, observation.firstIdentity); }
    if (observation.firstIdentity === null && projected.identity !== null) {
      observation.firstIdentity = projected.identity;
      observation.identityBaselineResponse = observation.returnedResponses;
      projected.state.identity.matchesFirstObserved = true;
    }
    const signature = JSON.stringify(projected.state);
    const changed = observation.last !== null && signature !== observation.lastSignature;
    if (changed) increment('stateChanges');
    const record = { response: observation.returnedResponses, changed, state: projected.state };
    if (observation.last === null || changed) {
      observation.retained.push(record);
      // First response + latest six projected changes; eighth slot is last.
      if (observation.retained.length > 7) observation.retained.splice(1, observation.retained.length - 7);
    }
    observation.last = record; observation.lastSignature = signature;
  } catch { observation.captureFailed = true; }
}
function popoverObservationSummary(observation) {
  const selected = observation.retained.slice();
  if (observation.last && selected.at(-1) !== observation.last) selected.push(observation.last);
  const retainedChanges = selected.filter(record => record.changed).length;
  return {
    schemaVersion: 1, status: 'failed-popover-poll', diagnosticOnly: true,
    sourceRevision: typeof revision === 'string' && /^[a-f0-9]{40}$/.test(revision) ? revision : null,
    owner: observation.owner, scope: 'already-returned-shown-popover-responses',
    recordLimit: 8, consoleByteLimit: 8192, identityStringLimit: 128,
    selection: 'first-and-last-response-plus-latest-projected-state-changes',
    identityComparison: 'bounded-string-equality-not-native-liveness',
    identityBaselineResponse: observation.identityBaselineResponse,
    returnedResponses: observation.returnedResponses, stateChanges: observation.stateChanges,
    selectedRecords: selected.length,
    omittedResponses: Number.isSafeInteger(observation.returnedResponses) ? observation.returnedResponses - selected.length : null,
    omittedStateChanges: Number.isSafeInteger(observation.stateChanges) ? observation.stateChanges - retainedChanges : null,
    recordsOmittedForByteLimit: 0,
    captureFailed: observation.captureFailed, countOverflow: observation.countOverflow,
    records: selected.map(record => ({
      response: record.response, first: record === observation.retained[0], last: record === observation.last,
      stateChange: record.changed, ...record.state,
    })),
  };
}
function reportPopoverFailure(observation) {
  try {
    const summary = popoverObservationSummary(observation);
    const filename = 'popover-show-failure.json';
    const original = { filename, writeStatus: 'not-attempted', writeErrorCode: null };
    const report = { ...summary, original };
    const encode = () => {
      report.selectedRecords = report.records.length;
      report.omittedResponses = Number.isSafeInteger(report.returnedResponses) ? report.returnedResponses - report.selectedRecords : null;
      report.omittedStateChanges = Number.isSafeInteger(report.stateChanges) ? report.stateChanges - report.records.filter(record => record.stateChange).length : null;
      return 'NYCTRON_POPOVER_SHOW_EVIDENCE_BEGIN\n' + JSON.stringify(report) + '\nNYCTRON_POPOVER_SHOW_EVIDENCE_END\n';
    };
    while (Buffer.byteLength(encode(), 'utf8') > summary.consoleByteLimit && report.records.length > 2) {
      report.records.splice(1, 1); report.recordsOmittedForByteLimit++;
    }
    if (Buffer.byteLength(encode(), 'utf8') > summary.consoleByteLimit) {
      report.recordsOmittedForByteLimit += report.records.length;
      report.records = []; report.status = 'failed-popover-poll-details-omitted';
    }
    if (Buffer.byteLength(encode(), 'utf8') > summary.consoleByteLimit) return;
    // Preserve the first observation file. Write status is separate console
    // metadata; an unsuccessful duplicate write cannot replace its bytes.
    const { original: omittedWriteStatus, ...fileRecord } = report;
    try {
      writeFileSync(join(output, filename), JSON.stringify(fileRecord) + '\n', { flag: 'wx' });
      original.writeStatus = 'retained';
    } catch (error) {
      original.writeStatus = 'failed';
      original.writeErrorCode = ['EACCES', 'EPERM', 'EEXIST', 'ENOSPC', 'EIO', 'ENOENT'].includes(error?.code) ? error.code : 'other';
    }
    const envelope = encode();
    if (Buffer.byteLength(envelope, 'utf8') <= summary.consoleByteLimit) console.info(envelope.slice(0, -1));
  } catch {
    // Diagnostics never replace the original request rejection or timeout.
  }
}

async function shownPopover(window = 'main') {
  const observation = createPopoverObservation(window);
  let value;
  try {
    value = await waitFor(async () => {
      const current = await popover(window);
      capturePopoverResponse(observation, current);
      return current.shown && current.contentVisible ? current : undefined;
    }, 'shown native NSPopover');
  } catch (error) {
    reportPopoverFailure(observation);
    throw error;
  }
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
  await show('main', true);
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
  assert.ok(Number.isSafeInteger(contextMenu.generation) && contextMenu.generation > 0);
  assert.equal(contextMenu.items.find(item => item.id === 'context-disabled').enabled, false);
  const selectedContextMenu = await driver.request('tron.context-menu', { action: 'select', itemId: 'context-save', generation: contextMenu.generation });
  assert.equal(selectedContextMenu.actedOnGeneration, contextMenu.generation);
  // React's selection result does not establish that AppKit finished tracking.
  // Observe the native end before opening another menu, then target its newer
  // begin-tracking generation explicitly for cancellation.
  await waitFor(async () => {
    const menu = await driver.request('tron.context-menu', {});
    return !menu.shown && menu.endedGeneration === contextMenu.generation;
  }, 'selected native context menu tracking ended');
  await status('Saved in this local reference session');
  assert.ok((await inspect('saved-main')).labels.includes('Checkpoint from the context menu'));
  await control('context-main', 'press');
  const cancelContextMenu = await waitFor(async () => {
    const menu = await driver.request('tron.context-menu', {});
    return menu.shown && menu.generation > contextMenu.generation ? menu : undefined;
  }, 'new native context menu tracking generation');
  assert.equal(cancelContextMenu.nativeMenu, true);
  assert.ok(Number.isSafeInteger(cancelContextMenu.generation));
  const canceledContextMenu = await driver.request('tron.context-menu', { action: 'cancel', generation: cancelContextMenu.generation });
  assert.equal(canceledContextMenu.actedOnGeneration, cancelContextMenu.generation);
  await waitFor(async () => {
    const menu = await driver.request('tron.context-menu', {});
    return !menu.shown && menu.endedGeneration === cancelContextMenu.generation;
  }, 'canceled native context menu tracking ended');
  await status('Native context menu dismissed');
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
    boundary: 'CGEvent-posted mouse movement followed by NSApp.windows and NSAccessibility help-tag discovery, with public text collection and separately counted private draw-view storage reads bound to the selected visible panel; private layout is host/version dependent and does not establish public AX text or independently verified pixels; no physical mouse hardware or human gesture.',
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
      assert.equal(observation.boundary, 'native-help-tag-observation-with-private-draw-view-text');
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
  const escapeCloseObservation = await armPopoverCloseObservation('main', resizedPopover);
  await popover('main', 'escape'); await status('Native inspector dismissed');
  await waitFor(async () => popoverCloseCompleted(await popover(), escapeCloseObservation), 'native Escape dismissal');
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
  await control('inspect-main', 'press'); const newerFocusPopover = await shownPopover();
  const newerFocusCloseObservation = await armPopoverCloseObservation('main', newerFocusPopover);
  await show('document-1');
  await popover('main', 'close'); await status('Native inspector dismissed');
  await waitFor(async () => popoverCloseCompleted(await popover(), newerFocusCloseObservation), 'popover close after another window gained focus');
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
  if (tooltipEvidence) reportTooltipFailure();
  if (pointerEvidence?.status === 'pending') { pointerEvidence.status = 'failed'; pointerEvidence.error = error instanceof Error ? error.message : String(error); writeFileSync(join(output, 'native-pointer.json'), JSON.stringify(pointerEvidence, null, 2) + '\n'); }
  writeFileSync(join(output, 'failure.json'), JSON.stringify({ schemaVersion: 1, status: 'failed', sourceRevision: revision, checks, error: error instanceof Error ? error.message : String(error) }, null, 2) + '\n');
  reportStartupFailure();
  throw error;
} finally {
  driver?.close();
  if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
}
