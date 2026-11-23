import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isMainModule } from '../library-components.mjs';
import { verifyMaestroVersion, diagnosticWatchdogAllowed, STARTUP_DIAGNOSTIC_DELAY_MS } from './maestro-version.mjs';

export const PREFLIGHT_DIAGNOSTIC_DELAY_MS = STARTUP_DIAGNOSTIC_DELAY_MS;
const options = { encoding: 'utf8', timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 65536 };
const bounded = value => Buffer.from(value ?? '').subarray(0, 32768).toString('utf8');
const record = result => ({ status: result.status, signal: result.signal, error: result.error?.code ?? null,
  stdout: bounded(result.stdout), stderr: bounded(result.stderr) });

export function collectStartupDiagnostics({ output, parentPid, javaHome, run = spawnSync }) {
  if (!Number.isSafeInteger(parentPid) || parentPid <= 1) throw new Error('Invalid owned diagnostic parent PID');
  const ps = run('ps', ['-axo', 'pid,ppid,pcpu,pmem,rss,comm'], options);
  writeFileSync(join(output, 'host-processes.json'), JSON.stringify(record(ps), null, 2) + '\n');
  if (ps.error || ps.status !== 0 || !javaHome) return;
  const parents = new Map((ps.stdout ?? '').split('\n').map(line => /^\s*(\d+)\s+(\d+)\s/.exec(line))
    .filter(Boolean).map(match => [Number(match[1]), Number(match[2])]));
  const owned = pid => {
    const seen = new Set();
    while (parents.has(pid) && !seen.has(pid)) {
      seen.add(pid); pid = parents.get(pid);
      if (pid === parentPid) return true;
    }
    return false;
  };
  const jcmd = join(javaHome, 'bin', 'jcmd');
  const listing = run(jcmd, ['-l'], options);
  // Never persist the raw JVM command listing, which may contain other args.
  const pids = listing.status === 0 && !listing.error ? (listing.stdout ?? '').split('\n')
    .map(line => /^(\d+) maestro\.cli\.AppKt(?:\s|$)/.exec(line)).filter(Boolean)
    .map(match => Number(match[1])).filter(owned) : [];
  writeFileSync(join(output, 'jvm-discovery.json'), JSON.stringify({ status: listing.status, error: listing.error?.code ?? null, ownedMaestroPids: pids }, null, 2) + '\n');
  for (const pid of pids.slice(0, 1)) {
    const result = run(jcmd, [String(pid), 'Thread.print'], options);
    writeFileSync(join(output, 'maestro-threads.json'), JSON.stringify({ pid, ...record(result) }, null, 2) + '\n');
  }
}

export async function preflight({ maestro, output }) {
  if (process.env.GITHUB_ACTIONS !== 'true' || !process.env.RUNNER_TEMP || !process.env.JAVA_HOME) throw new Error('Maestro preflight requires the disposable hosted CI runner and pinned Java');
  output = resolve(output);
  if (!output.startsWith(resolve(process.env.RUNNER_TEMP) + '/')) throw new Error('Preflight output must be inside task-owned runner temp');
  mkdirSync(output); // No stale diagnostic files.
  return verifyMaestroVersion({ maestro, output });
}

if (isMainModule(import.meta.url)) {
  const [mode, output, value] = process.argv.slice(2);
  if (mode === '--watchdog') {
    if (!diagnosticWatchdogAllowed({ output }) || !Number.isSafeInteger(Number(value)) || Number(value) <= 1) throw new Error('Invalid hosted diagnostic watchdog');
    setTimeout(() => collectStartupDiagnostics({ output, parentPid: Number(value), javaHome: process.env.JAVA_HOME }), PREFLIGHT_DIAGNOSTIC_DELAY_MS);
  } else if (mode === '--verify' && output && value) await preflight({ output, maestro: value });
  else throw new Error('Usage: --verify <fresh-output> <verified-maestro>');
}
