import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MAESTRO } from '../native/ui-evidence.mjs';

const DIAGNOSTIC_BYTES = 32768;
const bounded = value => Buffer.from(value ?? '', 'utf8').subarray(0, DIAGNOSTIC_BYTES).toString('utf8');
// Both switches are documented by the pinned CLI's own startup output. Keep
// HOME and any existing JVM options intact; these suppress telemetry/promotions.
export const maestroEnvironment = () => ({ ...process.env, MAESTRO_CLI_NO_ANALYTICS: '1', MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: 'true' });

/** The caller exclusively owns output. Diagnostics survive every failed probe. */
export function verifyMaestroVersion({ maestro, output, timeoutMs = 60000 }) {
  const started = Date.now();
  const result = spawnSync(maestro, ['--version'], { encoding: 'utf8', timeout: timeoutMs, killSignal: 'SIGKILL', maxBuffer: 65536, env: maestroEnvironment() });
  const diagnostics = { command: ['maestro', '--version'], expectedVersion: MAESTRO.version, elapsedMs: Date.now() - started,
    timeoutMs, status: result.status, signal: result.signal, error: result.error ? { code: result.error.code, message: bounded(result.error.message) } : null,
    settings: { MAESTRO_CLI_NO_ANALYTICS: '1', MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: 'true' },
    stdout: bounded(result.stdout), stderr: bounded(result.stderr),
    truncated: Buffer.byteLength(result.stdout ?? '') > DIAGNOSTIC_BYTES || Buffer.byteLength(result.stderr ?? '') > DIAGNOSTIC_BYTES };
  writeFileSync(join(output, 'maestro-version.json'), JSON.stringify(diagnostics, null, 2) + '\n');
  if (result.error || result.status !== 0 || (result.stdout ?? '').trim() !== MAESTRO.version) {
    throw new Error(`Native proof requires the exact pinned verified Maestro version; observed status=${result.status}, signal=${result.signal ?? 'none'}, error=${result.error?.code ?? 'none'}. See maestro-version.json.`);
  }
  return diagnostics;
}
