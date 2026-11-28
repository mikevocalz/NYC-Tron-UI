import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
/** Maestro's console output names only the failed flow. The JUnit failure
 * message, the per-command record and the debug log say which command failed
 * and why. Maestro writes the debug files into a timestamped folder under
 * --debug-output, so search the whole folder rather than one fixed path. */
export function printFlowFailure({ label, junit, debug }, write = text => process.stderr.write(text)) {
  const section = (name, text) => write(`--- ${label} ${name} ---\n${text}\n`);
  try { section('report.xml', readFileSync(junit, 'utf8').split('\n').slice(-40).join('\n')); } catch {}
  let found = [];
  try { found = files(debug); } catch {}
  for (const path of found.filter(file => /commands-.*\.json$/.test(file))) {
    let commands;
    try { commands = JSON.parse(readFileSync(path, 'utf8')); } catch (error) { section(`${relative(debug, path)} (unreadable)`, String(error)); continue; }
    const lines = (Array.isArray(commands) ? commands : []).map((entry, index) => {
      const command = Object.entries(entry?.command ?? {}).find(([, value]) => value)?.[0] ?? 'unknown';
      const meta = entry?.metadata ?? {};
      const error = meta.error?.message ?? meta.error?.localizedMessage;
      return `${index + 1}. ${command} ${meta.status ?? 'NO STATUS'}${meta.duration === undefined ? '' : ` ${meta.duration}ms`}${error ? ` error: ${String(error).slice(0, 2000)}` : ''}`;
    });
    section(`${relative(debug, path)} (last 25 commands)`, lines.slice(-25).join('\n'));
  }
  const logs = found.filter(file => file.endsWith('maestro.log'));
  if (!logs.length) section('debug output', found.length ? 'no maestro.log; files: ' + found.map(file => relative(debug, file)).slice(0, 30).join(', ') : 'no debug files');
  for (const path of logs) section(`debug ${relative(debug, path)} (last 80 lines)`, readFileSync(path, 'utf8').split('\n').slice(-80).join('\n'));
}
