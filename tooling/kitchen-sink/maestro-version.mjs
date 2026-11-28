import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { maestroSessionLimits } from '../native/ui-transport.mjs';
import { MAESTRO } from '../native/ui-evidence.mjs';

const DIAGNOSTIC_BYTES = 32768;
const bounded = value => Buffer.from(value ?? '', 'utf8').subarray(0, DIAGNOSTIC_BYTES).toString('utf8');
// Both switches are documented by the pinned CLI's own startup output. Keep
// HOME and any existing JVM options intact; these suppress telemetry/promotions.
export const maestroEnvironment = () => ({ ...process.env, MAESTRO_CLI_NO_ANALYTICS: '1', MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: 'true', MAESTRO_DRIVER_STARTUP_TIMEOUT: String(maestroSessionLimits.driverStartupMs) });

export const STARTUP_DIAGNOSTIC_DELAY_MS = 40000;
// The early preflight runs on an idle runner, before the build, and keeps the
// 60 s cap. The post-boot probe in native-proof runs right after the simulator
// boots and the app installs, when the macos-26-arm64 runner is saturated: on
// 2026-11-28 (PR 94, kitchen-sink runs 46123014118 and 46163073524) the install
// alone took 97 to 312 s and the same pinned 2.12.1 binary that answered the
// preflight in about 3 s missed the 60 s cap, once after printing its version.
// The version must still match exactly; only the time allowed changes.
export const POSTBOOT_PROBE_TIMEOUT_MS = 180000;
export function diagnosticWatchdogAllowed({ output, platform = process.platform, env = process.env }) {
  return platform === 'darwin' && env.GITHUB_ACTIONS === 'true' && Boolean(env.JAVA_HOME) && Boolean(env.RUNNER_TEMP) &&
    resolve(output).startsWith(resolve(env.RUNNER_TEMP) + sep);
}
export function stopDiagnosticWatchdog(child, kill = (pid, signal) => process.kill(pid, signal)) {
  // The child is a detached POSIX group created exclusively by this probe.
  // Kill the group, including an in-flight synchronous ps/jcmd child, rather
  // than losing that child's timeout timer when its watchdog parent exits.
  if (!child?.pid) return;
  try { kill(-child.pid, 'SIGKILL'); }
  catch (error) {
    // ESRCH: the group is gone. EPERM: macOS refuses killpg when no member
    // can be signalled, which happens once the watchdog has exited during the
    // blocking probe and only its unreaped zombie is left. The group is ours,
    // so a live member would have been signalled; nothing is left running.
    if (error.code !== 'ESRCH' && error.code !== 'EPERM') throw error;
  }
}
function startDiagnosticWatchdog(output) {
  if (!diagnosticWatchdogAllowed({ output })) return;
  const child = spawn(process.execPath, [fileURLToPath(new URL('./maestro-preflight.mjs', import.meta.url)), '--watchdog', output, String(process.pid)],
    { detached: true, stdio: 'ignore', env: process.env });
  child.on('error', () => {}); // The strict probe still records its own failure.
  return child;
}

// Artifacts are not always reachable, so a failed probe prints what it saw,
// and the startup watchdog's JVM thread dump if it took one, to the job log.
export function printProbeFailure(output, diagnostics, write = text => process.stderr.write(text)) {
  write('--- maestro --version probe ---\n' + JSON.stringify({ elapsedMs: diagnostics.elapsedMs, timeoutMs: diagnostics.timeoutMs, status: diagnostics.status,
    signal: diagnostics.signal, error: diagnostics.error, stdout: diagnostics.stdout, stderr: diagnostics.stderr }, null, 2) + '\n');
  for (const [file, lines] of [['jvm-discovery.json', 20], ['maestro-threads.json', 200]]) {
    let text;
    try { text = readFileSync(join(output, file), 'utf8'); } catch { continue; }
    if (file === 'maestro-threads.json') { try { const dump = JSON.parse(text); text = `pid ${dump.pid} status ${dump.status} error ${dump.error}\n${dump.stdout}${dump.stderr}`; } catch {} }
    write(`--- ${file} ---\n` + text.split('\n').slice(0, lines).join('\n') + '\n');
  }
}

/** The caller exclusively owns output. Diagnostics survive every failed probe. */
export function verifyMaestroVersion({ maestro, output, timeoutMs = 60000 }) {
  const started = Date.now();
  const watchdog = startDiagnosticWatchdog(output);
  try {
    const result = spawnSync(maestro, ['--version'], { encoding: 'utf8', timeout: timeoutMs, killSignal: 'SIGKILL', maxBuffer: 65536, env: maestroEnvironment() });
    const diagnostics = { command: ['maestro', '--version'], expectedVersion: MAESTRO.version, elapsedMs: Date.now() - started,
      startupWatchdog: { enabled: Boolean(watchdog?.pid), delayMs: STARTUP_DIAGNOSTIC_DELAY_MS },
      timeoutMs, status: result.status, signal: result.signal, error: result.error ? { code: result.error.code, message: bounded(result.error.message) } : null,
      settings: { MAESTRO_CLI_NO_ANALYTICS: '1', MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: 'true', MAESTRO_DRIVER_STARTUP_TIMEOUT: String(maestroSessionLimits.driverStartupMs) },
      stdout: bounded(result.stdout), stderr: bounded(result.stderr),
      truncated: Buffer.byteLength(result.stdout ?? '') > DIAGNOSTIC_BYTES || Buffer.byteLength(result.stderr ?? '') > DIAGNOSTIC_BYTES };
    writeFileSync(join(output, 'maestro-version.json'), JSON.stringify(diagnostics, null, 2) + '\n');
    if (result.error || result.status !== 0 || (result.stdout ?? '').trim() !== MAESTRO.version) {
      printProbeFailure(output, diagnostics);
      throw new Error(`Native proof requires the exact pinned verified Maestro version; observed status=${result.status}, signal=${result.signal ?? 'none'}, error=${result.error?.code ?? 'none'}. See maestro-version.json.`);
    }
    return diagnostics;
  } finally { stopDiagnosticWatchdog(watchdog); }
}
