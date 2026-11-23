import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, cpSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { declarationClassifier, generateLibraryManifest, isMainModule, loadCompiler, matchesGeneratedJson, packageDirectories, sourceFingerprint } from '../library-components.mjs';
import { generateCrossReference } from '../library-cross-reference.mjs';
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const ts = loadCompiler(process.env.TRON_TEST_COMPILER_ROOT ?? root);
const json = file => JSON.parse(readFileSync(join(root, file), 'utf8'));
const manifest = () => generateLibraryManifest({ rootDir: root, ts });

test('every current component export is inventoried across workspace and desktop packages, without alias loss', () => {
  const m = manifest();
  assert.equal(m.summary.packageCount, 16);
  assert.equal(m.summary.componentCount, m.components.length);
  assert.equal(new Set(m.components.map(e => e.id)).size, m.components.length);
  assert.ok(m.components.length > 400, 'a missing React recognizer must not produce a vacuous pass');
  assert.equal(m.components.filter(e => e.proposedStability === 'stable').length, 10);
  assert.equal(m.summary.proposedStableIdentityCount, 5);
  assert.ok(m.components.every(e => e.stability === null && e.ownerConfirmation === 'pending'));
  for (const name of ['FieldGroup', 'AdaptiveColumns']) assert.ok(m.components.some(e => e.symbol === name));
  for (const [a, b] of [['NumericScrubField', 'PrecisionScrubber'], ['BeforeAfterCompare', 'CanvasCompareView']]) {
    const aa = m.components.find(e => e.symbol === a), bb = m.components.find(e => e.symbol === b);
    assert.deepEqual(aa.declarationIdentities, bb.declarationIdentities);
    assert.ok(aa.aliases.includes(bb.id));
  }
  for (const name of ['@nyc-tron/macos-appkit', '@nyc-tron/windows-fluent-fabric']) assert.ok(m.components.some(e => e.package === name));
  const desktop = json('docs/desktop-support.json');
  for (const platform of ['macos', 'windows']) for (const status of ['supported', 'struck', 'notVerified']) for (const original of desktop.lanes[platform][status]) {
    const key = typeof original === 'string' ? original : original.component;
    const id = '@nyc-tron/ui' + (key.startsWith('.#') ? key.slice(1) : key.slice(1));
    const entry = m.components.find(e => e.id === id);
    assert.ok(entry, 'measured export missing from inventory: ' + id);
    assert.equal(entry.platforms[platform].status, status === 'notVerified' ? 'not verified' : status);
    const measurement = entry.platforms[platform].measurements.find(e => e.originalStatus === status);
    assert.ok(measurement, 'measurement provenance was dropped: ' + id);
    if (typeof original === 'object') assert.deepEqual(measurement.recordedResult, original);
  }
  assert.ok(m.exclusions.some(e => e.exports.some(id => id.endsWith('#renderPopoverTrigger')) && e.reason.includes('render helper')));
  assert.deepEqual(m, json('docs/library/components.json'));
});

test('semantic classifier resolves compound and alias declarations and rejects unresolved component returns', () => {
  const declarations = {
    'fixture/a.d.ts#Root': { signatures: ['declare function Root(props: {}): import("react").JSX.Element;'], references: [] },
    'fixture/a.d.ts#Compound': { signatures: ['export declare const Compound: typeof Root & { Item: typeof Root };'], references: ['fixture/a.d.ts#Root'] },
    'fixture/a.d.ts#Alias': { signatures: ['export declare const Alias: typeof Compound;'], references: ['fixture/a.d.ts#Compound'] },
    'fixture/a.d.ts#Unresolved': { signatures: ['export declare function Unresolved(props: {}): MissingReactType;'], references: [] },
    'fixture/a.d.ts#AnyComponent': { signatures: ['export declare function AnyComponent(props: {}): any;'], references: [] },
    'fixture/a.d.ts#Count': { signatures: ['export declare function Count(): number;'], references: [] },
    'fixture/a.d.ts#BadClass': { signatures: ['export declare class BadClass { render(): any; }'], references: [] },
    'fixture/a.d.ts#ReactClass': { signatures: ['export declare class ReactClass extends React.Component { render(): import("react").JSX.Element; }'], references: [] },
    'fixture/a.d.ts#Renderer': { signatures: ['export declare class Renderer { render(): import("react").JSX.Element; }'], references: [] },
    'fixture/a.d.ts#MissingCompound': { signatures: ['export declare const MissingCompound: typeof MissingRoot;'], references: [] },
    'fixture/a.d.ts#NullOnly': { signatures: ['export declare function NullOnly(): null;'], references: [] },
    'fixture/a.d.ts#ContextProvider': { signatures: ['export declare const ContextProvider: import("react").Context<string>;'], references: [] },
    'fixture/a.d.ts#unknownHelper': { signatures: ['export declare function unknownHelper(): any;'], references: [] },
  };
  const classify = declarationClassifier({ declarations }, ts);
  for (const id of ['Root', 'Compound', 'Alias']) assert.equal(classify('fixture/a.d.ts#' + id).kind, 'component');
  assert.throws(() => classify('fixture/a.d.ts#Unresolved'), /unresolved or any/);
  assert.throws(() => classify('fixture/a.d.ts#AnyComponent'), /unresolved or any/);
  assert.throws(() => classify('fixture/a.d.ts#BadClass'), /unresolved or any/);
  assert.equal(classify('fixture/a.d.ts#ReactClass').kind, 'component');
  assert.equal(classify('fixture/a.d.ts#Renderer').kind, 'excluded');
  assert.throws(() => classify('fixture/a.d.ts#MissingCompound'), /unresolved or any/);
  assert.throws(() => classify('fixture/a.d.ts#NullOnly'), /explicit review/);
  assert.equal(classify('fixture/a.d.ts#ContextProvider').kind, 'component');
  assert.throws(() => classify('fixture/a.d.ts#unknownHelper', 'UppercaseAlias'), /explicit review/);
  assert.equal(classify('fixture/a.d.ts#Count').kind, 'excluded');
});

test('ambiguous graph imports fail rather than selecting the first declaration', () => {
  assert.throws(() => declarationClassifier({ declarations: {
    'fixture/a.d.ts#Thing': { signatures: ['export declare const Thing: typeof Shared;'], references: ['fixture/b.d.ts#Shared', 'fixture/c.d.ts#Shared'] },
    'fixture/b.d.ts#Shared': { signatures: ['export declare function Shared(): import("react").JSX.Element;'], references: [] },
    'fixture/c.d.ts#Shared': { signatures: ['export declare function Shared(): number;'], references: [] },
  } }, ts), /ambiguous referenced declaration/);
});

test('export and condition drift fail before any manifest is accepted', () => {
  const temp = mkdtempSync(join(tmpdir(), 'tron-library-test-'));
  try {
    cpSync(join(root, 'packages'), join(temp, 'packages'), { recursive: true });
    cpSync(join(root, 'docs'), join(temp, 'docs'), { recursive: true });
    const file = join(temp, 'packages/ui/package.json'), pkg = JSON.parse(readFileSync(file));
    pkg.exports['./components/NewUninventoriedComponent'] = pkg.exports['./components/Button'];
    writeFileSync(file, JSON.stringify(pkg));
    assert.throws(() => generateLibraryManifest({ rootDir: temp, ts }), /export map\/snapshot drift/);
    delete pkg.exports['./components/NewUninventoriedComponent'];
    pkg.exports['./components/Button'].default = './dist/components/Unreviewed.js';
    writeFileSync(file, JSON.stringify(pkg));
    assert.throws(() => generateLibraryManifest({ rootDir: temp, ts }), /export condition drift/);
  } finally { rmSync(temp, { recursive: true, force: true }); }
});

test('lookup accounts for baseline and added rows independently and never fabricates external imports', () => {
  const ledger = { components: [
    { id: 'A-01', name: 'Button fixture', libraryScope: true, implementationReview: 'implemented', sourceCandidates: ['packages/ui/src/components/Button.tsx'], evidence: [] },
    { id: 'E-01', name: 'External fixture', libraryScope: false, implementationReview: 'implemented-external', sourceCandidates: [], externalImplementation: { owners: [{ repository: 'example/engine', revision: 'a'.repeat(40), sourcePaths: ['src/session.ts'], publicExports: ['@example/engine/session'] }] }, evidence: [] },
  ], additions: [{ id: 'W-01', name: 'Window fixture', libraryScope: true, implementationReview: 'implemented', sourceCandidates: ['packages/ui/src/components/window/WindowTitleBar.tsx'], evidence: [] }] };
  const lookup = generateCrossReference(ledger, { rootDir: root });
  assert.equal(Object.keys(lookup.rows).length, ledger.components.length + ledger.additions.length);
  assert.deepEqual(Object.keys(lookup.rows), [...ledger.components, ...ledger.additions].map(r => r.id));
  for (const row of ledger.components.filter(r => r.externalImplementation)) {
    assert.deepEqual(lookup.rows[row.id].importPaths, []);
    assert.ok(lookup.rows[row.id].ownership.startsWith('external'));
  }
  const recorded = json('docs/library/forge-imports.json');
  assert.equal(Object.keys(recorded.rows).length, recorded.baselineRows + recorded.addedRows);
  const exports = new Set(packageDirectories(root).flatMap(directory => {
    const pkg = JSON.parse(readFileSync(join(directory, 'package.json')));
    return Object.keys(pkg.exports ?? {}).map(subpath => pkg.name + (subpath === '.' ? '' : subpath.slice(1)));
  }));
  // Models are valid lookup targets too. This checks local export resolution
  // without making Tron's CI depend on the downstream ledger after handoff.
  for (const row of Object.values(recorded.rows)) for (const path of row.importPaths) assert.ok(exports.has(path), 'missing public lookup import ' + path);
  assert.ok(exports.has(lookup.rows['A-01'].importPaths[0]));
  const lf = JSON.stringify(ledger, null, 2) + '\n';
  assert.deepEqual(generateCrossReference(JSON.parse(lf.replace(/\n/g, '\r\n')), { rootDir: root }), lookup);
  assert.ok(matchesGeneratedJson((JSON.stringify(lookup, null, 2) + '\n').replace(/\n/g, '\r\n'), lookup));
  assert.throws(() => generateCrossReference({ movedTo: 'Forge' }), /full ledger/);
});

test('CRLF checkout text preserves complete inventory fingerprints and generated checks without hiding value drift', () => {
  const temp = mkdtempSync(join(tmpdir(), 'tron-library-crlf-'));
  try {
    cpSync(join(root, 'packages'), join(temp, 'packages'), { recursive: true });
    cpSync(join(root, 'docs'), join(temp, 'docs'), { recursive: true });
    const expected = manifest();
    const files = expected.inputs.map(input => input.path)
      .concat(packageDirectories(root).map(directory => directory.slice(root.length + 1).replaceAll('\\', '/') + '/package.json'))
      .concat(['docs/library/components.json', 'docs/library/forge-imports.json']);
    for (const name of files) {
      const file = join(temp, name), lf = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
      writeFileSync(file, lf.replace(/\n/g, '\r\n'));
    }
    const actual = generateLibraryManifest({ rootDir: temp, ts });
    assert.deepEqual(actual, expected, 'every fingerprint and entry must survive a Windows CRLF checkout');
    assert.ok(matchesGeneratedJson(readFileSync(join(temp, 'docs/library/components.json')), actual));
    assert.ok(matchesGeneratedJson(readFileSync(join(temp, 'docs/library/forge-imports.json')), json('docs/library/forge-imports.json')));
    assert.equal(sourceFingerprint('value\n'), sourceFingerprint('value\r\n'));
    assert.notEqual(sourceFingerprint('value\n'), sourceFingerprint('changed\r\n'));
    const signatures = join(temp, 'docs/api-signatures.json'), parsed = JSON.parse(readFileSync(signatures));
    parsed.declarations['@nyc-tron/ui/dist/components/Button.d.ts#Button'].signatures[0] += ' ';
    writeFileSync(signatures, (JSON.stringify(parsed, null, 2) + '\n').replace(/\n/g, '\r\n'));
    const drift = generateLibraryManifest({ rootDir: temp, ts });
    assert.notDeepEqual(drift.inputs, expected.inputs, 'normalizing line endings must not hide changed source values');
    assert.equal(matchesGeneratedJson(readFileSync(join(temp, 'docs/library/components.json')), drift), false);
    const pkgFile = join(temp, 'packages/ui/package.json'), pkg = JSON.parse(readFileSync(pkgFile));
    pkg.exports['./components/NewUninventoriedComponent'] = pkg.exports['./components/Button'];
    writeFileSync(pkgFile, JSON.stringify(pkg));
    assert.throws(() => generateLibraryManifest({ rootDir: temp, ts }), /export map\/snapshot drift/);
  } finally { rmSync(temp, { recursive: true, force: true }); }
});

test('CLI entry guards safely ignore stdin and non-entry imports', () => {
  assert.equal(isMainModule(import.meta.url, join(root, 'nonexistent-entry-fixture')), false);
  assert.equal(isMainModule(import.meta.url, fileURLToPath(import.meta.url)), true);
  assert.equal(isMainModule(new URL('../library-components.mjs', import.meta.url), fileURLToPath(import.meta.url)), false);
  const imported = spawnSync(process.execPath, ['--input-type=module', '-'], {
    input: ['library-components.mjs', 'library-cross-reference.mjs'].map(name => `await import(${JSON.stringify(new URL('../' + name, import.meta.url).href)});`).join('\n'),
    encoding: 'utf8', timeout: 10000,
  });
  assert.equal(imported.status, 0, imported.stderr);
  assert.equal(imported.stdout, '', 'importing a tool from stdin must not execute its CLI');
});

test('both CLIs run and reject drift when invoked through a symlink or Windows junction', t => {
  const temp = mkdtempSync(join(tmpdir(), 'tron-library-cli-alias-'));
  try {
    const fixture = join(temp, 'fixture'), alias = join(temp, 'alias');
    mkdirSync(join(fixture, 'tooling'), { recursive: true });
    cpSync(join(root, 'packages'), join(fixture, 'packages'), { recursive: true });
    cpSync(join(root, 'docs'), join(fixture, 'docs'), { recursive: true });
    for (const name of ['library-components.mjs', 'library-cross-reference.mjs']) cpSync(join(root, 'tooling', name), join(fixture, 'tooling', name));
    try { symlinkSync(fixture, alias, process.platform === 'win32' ? 'junction' : 'dir'); }
    catch (error) {
      if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('filesystem does not permit test directory aliases: ' + error.code); return; }
      throw error;
    }
    const invoke = name => spawnSync(process.execPath, [join(alias, 'tooling', name), ...(name === 'library-components.mjs' ? ['--compiler-root', process.env.TRON_TEST_COMPILER_ROOT ?? root] : [])], { encoding: 'utf8', timeout: 30000 });
    for (const name of ['library-components.mjs', 'library-cross-reference.mjs']) {
      const valid = invoke(name);
      assert.equal(valid.status, 0, valid.stderr);
      assert.match(valid.stdout, name === 'library-components.mjs' ? /Library inventory:/ : /Forge import lookup:/, 'an alias must execute the CLI instead of silently succeeding');
    }
    const components = join(fixture, 'docs/library/components.json'), manifest = JSON.parse(readFileSync(components));
    manifest.components.pop();
    writeFileSync(components, JSON.stringify(manifest, null, 2) + '\n');
    const inventoryDrift = invoke('library-components.mjs');
    assert.notEqual(inventoryDrift.status, 0);
    assert.match(inventoryDrift.stderr, /generated components.json differs/);
    const lookupPath = join(fixture, 'docs/library/forge-imports.json'), lookup = JSON.parse(readFileSync(lookupPath));
    delete lookup.rows[Object.keys(lookup.rows)[0]];
    writeFileSync(lookupPath, JSON.stringify(lookup, null, 2) + '\n');
    const lookupDrift = invoke('library-cross-reference.mjs');
    assert.notEqual(lookupDrift.status, 0);
    assert.match(lookupDrift.stderr, /Cross-reference differs/);
  } finally { rmSync(temp, { recursive: true, force: true }); }
});
