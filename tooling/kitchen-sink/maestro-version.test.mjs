import test from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { verifyMaestroVersion } from './maestro-version.mjs';

function fixture(body) {
  const output = mkdtempSync(join(tmpdir(), 'tron-maestro-version-')), maestro = join(output, 'synthetic-version-cli');
  writeFileSync(maestro, `#!${process.execPath}\n${body}\n`); chmodSync(maestro, 0o755);
  return { output, maestro, diagnostics: () => JSON.parse(readFileSync(join(output, 'maestro-version.json'), 'utf8')), cleanup: () => rmSync(output, { recursive: true, force: true }) };
}
test('documented notification opt-outs yield an exact version without changing HOME', () => {
  const f = fixture(`if (process.env.MAESTRO_CLI_NO_ANALYTICS !== '1' || process.env.MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED !== 'true' || process.env.HOME !== ${JSON.stringify(process.env.HOME)}) process.exit(9); console.log('2.12.1');`);
  try { assert.equal(verifyMaestroVersion(f).status, 0); assert.equal(f.diagnostics().stdout, '2.12.1\n'); }
  finally { f.cleanup(); }
});
for (const output of ['2.12.10\n', '2.12.1\n2.12.1\n', 'promotion\n2.12.1\n']) test('ambiguous or nonexact version output is rejected: ' + JSON.stringify(output), () => {
  const f = fixture(`process.stdout.write(${JSON.stringify(output)});`);
  try { assert.throws(() => verifyMaestroVersion(f), /exact pinned/); assert.equal(f.diagnostics().stdout, output); }
  finally { f.cleanup(); }
});
test('a nonzero startup exit retains actual status and stderr even with correct version stdout', () => {
  const f = fixture(`console.log('2.12.1'); console.error('synthetic startup failure'); process.exitCode=17;`);
  try { assert.throws(() => verifyMaestroVersion(f), /status=17/); assert.equal(f.diagnostics().status, 17); assert.match(f.diagnostics().stderr, /synthetic startup failure/); }
  finally { f.cleanup(); }
});
test('a timed-out version command is killed and its diagnostic is retained', () => {
  const f = fixture('setTimeout(() => {}, 10000);');
  try { assert.throws(() => verifyMaestroVersion({ ...f, timeoutMs: 100 }), /ETIMEDOUT/); assert.equal(f.diagnostics().error.code, 'ETIMEDOUT'); assert.equal(f.diagnostics().signal, 'SIGKILL'); }
  finally { f.cleanup(); }
});
test('excessive startup output fails and cannot create an unbounded diagnostic artifact', () => {
  const f = fixture(`require('fs').writeSync(1, 'x'.repeat(1024*1024));`);
  try { assert.throws(() => verifyMaestroVersion(f), /exact pinned/); const d=f.diagnostics(); assert.equal(d.truncated, true); assert.ok(Buffer.byteLength(d.stdout) <= 32768); assert.ok(readFileSync(join(f.output,'maestro-version.json')).length < 70000); }
  finally { f.cleanup(); }
});
test('a missing executable still leaves an actionable bounded diagnostic', () => {
  const f = fixture('');
  try { assert.throws(() => verifyMaestroVersion({ ...f, maestro: join(f.output, 'missing') }), /ENOENT/); assert.equal(f.diagnostics().error.code, 'ENOENT'); }
  finally { f.cleanup(); }
});
