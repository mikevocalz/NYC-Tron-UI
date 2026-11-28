// A downstream lookup only. This data never determines library inventory or
// release readiness. Regenerate explicitly from an identified program ledger.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule, matchesGeneratedJson, packageDirectories } from './library-components.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const sourcePath = value => {
  if (!value.startsWith('https://')) return value;
  const match = /^https:\/\/github\.com\/mikevocalz\/NYC-Tron-UI\/blob\/[a-f0-9]{40}\/(packages\/[A-Za-z0-9_@+./-]+)$/.exec(value);
  if (!match || match[1].split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid pinned Tron source URL');
  return match[1];
};
const runtimeTargets = value => typeof value === 'string' ? /\.js$/.test(value) ? [value] : [] : value && typeof value === 'object' ? Object.values(value).flatMap(runtimeTargets) : [];

export function generateCrossReference(ledger, { rootDir = root } = {}) {
  if (!Array.isArray(ledger.components) || !Array.isArray(ledger.additions)) throw new Error('Cross-reference requires a full ledger, not a moved-ledger pointer');
  const exports = new Map();
  for (const directory of packageDirectories(rootDir)) {
    const manifest = json(join(directory, 'package.json'));
    for (const [subpath, target] of Object.entries(manifest.exports ?? {})) for (const path of runtimeTargets(target)) {
      const source = relative(rootDir, resolve(directory, path)).replaceAll('\\', '/');
      if (!exports.has(source)) exports.set(source, new Set());
      exports.get(source).add(manifest.name + (subpath === '.' ? '' : subpath.slice(1)));
    }
  }
  const rows = {}, ids = new Set();
  for (const [kind, list] of [['baseline', ledger.components], ['addition', ledger.additions]]) for (const row of list) {
    if (ids.has(row.id)) throw new Error('Duplicate lookup row ' + row.id);
    ids.add(row.id);
    const imports = [...new Set(row.sourceCandidates.flatMap(source => [...(exports.get(sourcePath(source).replace('/src/', '/dist/').replace(/\.tsx?$/, '.js')) ?? [])]))].sort();
    if (row.libraryScope && ['implemented', 'partial'].includes(row.implementationReview) && !imports.length) throw new Error('No public import for local lookup row ' + row.id);
    rows[row.id] = { name: row.name, kind, importPaths: imports,
      ownership: row.externalImplementation ? 'external; no Tron import invented' : 'Tron source lookup',
      ...(row.externalImplementation ? { externalOwners: row.externalImplementation.owners } : {}),
      evidence: row.evidence ?? [] };
  }
  return { schemaVersion: 1, purpose: 'Forge row-to-import lookup only; not library scope, inventory or a release gate',
    programHome: 'https://github.com/mikevocalz/nitro-forge/blob/5902e64d6ad01090f5e9a40f8402ec0cbcb39a71/docs/completion/library-progress.json',
    sourceLedgerDigestEncoding: 'SHA-256 of JSON.stringify(parsed ledger); not raw ledger bytes or a Git blob id',
    sourceLedgerSha256: createHash('sha256').update(JSON.stringify(ledger)).digest('hex'),
    baselineRows: ledger.components.length, addedRows: ledger.additions.length, rows };
}

if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2);
  let ledger = join(root, 'docs/completion/reports/2026-11-22-forge-program/docs/completion/library-progress.json'), write = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--write' && !write) write = true;
    else if (args[i] === '--ledger' && args[i + 1] && !args[i + 1].startsWith('--')) ledger = resolve(args[++i]);
    else throw new Error('Usage: [--write] [--ledger <full-ledger.json>]');
  }
  const file = join(root, 'docs/library/forge-imports.json'), actual = generateCrossReference(json(ledger));
  const bytes = JSON.stringify(actual, null, 2) + '\n';
  if (write) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, bytes); }
  else if (!existsSync(file) || !matchesGeneratedJson(readFileSync(file), actual)) throw new Error('Cross-reference differs; review its identified source ledger before --write');
  console.log(`Forge import lookup: ${actual.baselineRows} baseline rows and ${actual.addedRows} added rows; no acceptance or library scope changes.`);
}
