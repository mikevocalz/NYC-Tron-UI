import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, cpSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { declarationClassifier, generateLibraryManifest, loadCompiler, packageDirectories } from '../library-components.mjs';
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
  assert.throws(() => generateCrossReference({ movedTo: 'Forge' }), /full ledger/);
});
