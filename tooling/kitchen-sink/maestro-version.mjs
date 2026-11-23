import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
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
export function diagnosticWatchdogAllowed({ output, platform = process.platform, env = process.env }) {
  return platform === 'darwin' && env.GITHUB_ACTIONS === 'true' && Boolean(env.JAVA_HOME) && Boolean(env.RUNNER_TEMP) &&
    resolve(output).startsWith(resolve(env.RUNNER_TEMP) + sep);
}
export function stopDiagnosticWatchdog(child) {
  // The child is a detached POSIX group created exclusively by this probe.
  // Kill the group, including an in-flight synchronous ps/jcmd child, rather
  // than losing that child's timeout timer when its watchdog parent exits.
  if (!child?.pid) return;
  try { process.kill(-child.pid, 'SIGKILL'); }
  catch (error) { if (error.code !== 'ESRCH') throw error; }
}
function startDiagnosticWatchdog(output) {
  if (!diagnosticWatchdogAllowed({ output })) return;
  const child = spawn(process.execPath, [fileURLToPath(new URL('./maestro-preflight.mjs', import.meta.url)), '--watchdog', output, String(process.pid)],
    { detached: true, stdio: 'ignore', env: process.env });
  child.on('error', () => {}); // The strict probe still records its own failure.
  return child;
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
      throw new Error(`Native proof requires the exact pinned verified Maestro version; observed status=${result.status}, signal=${result.signal ?? 'none'}, error=${result.error?.code ?? 'none'}. See maestro-version.json.`);
    }
    return diagnostics;
  } finally { stopDiagnosticWatchdog(watchdog); }
}
