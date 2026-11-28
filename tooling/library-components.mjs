// Inventory the reviewed declaration graph, never a downstream application's rows.
// Existing api-surface/api-signatures gates verify that graph against live builds.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
// Git can check text out as CRLF on Windows. These fingerprints describe
// reviewed source text, not archive bytes or Git blob identities.
export const normalizedSourceText = value => value.toString('utf8').replace(/\r\n/g, '\n');
export const sourceFingerprint = value => createHash('sha256').update(normalizedSourceText(value), 'utf8').digest('hex');
export const matchesGeneratedJson = (bytes, actual) => normalizedSourceText(bytes) === JSON.stringify(actual, null, 2) + '\n';
export function isMainModule(moduleUrl, entry = process.argv[1]) {
  if (!entry) return false;
  try { return realpathSync(resolve(entry)) === realpathSync(fileURLToPath(moduleUrl)); }
  catch (error) {
    // Imports from stdin/eval can have a non-file argv[1], such as "-".
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
    throw error;
  }
}
// Tron ships general app UI only. Editor controls (the former "professional
// controls", components/forge/*) moved to @nitro-forge/editor-controls; see
// docs/V1_DECISIONS.md D10. A forge subpath reaching this inventory is a bug.
export const COMPONENT_CATEGORY = 'general components';
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const fail = message => { throw new Error('Library inventory: ' + message); };
const REACT_TYPES = `
  export namespace JSX { interface Element { readonly __tronReactElement: unique symbol } }
  export interface ReactElement<P = unknown, T = unknown> extends JSX.Element {}
  export type ReactNode = ReactElement | string | number | boolean | null | undefined;
  export type JSXElementConstructor<P> = (props: P) => ReactNode;
  export type Ref<T> = unknown;
  export interface FunctionComponent<P = {}> { (props: P): ReactNode }
  export type FC<P = {}> = FunctionComponent<P>;
  export type ComponentType<P = {}> = FunctionComponent<P>;
  export interface ForwardRefExoticComponent<P> { (props: P): ReactNode }
  export interface MemoExoticComponent<T> { (props: unknown): ReactNode }
  export interface Context<T> { (props: { value: T; children?: ReactNode }): ReactNode; Provider: FunctionComponent<{ value: T; children?: ReactNode }>; }
  export class Component<P = {}> { readonly __tronReactClass: true; props: P; render(): ReactNode }
  export class PureComponent<P = {}> extends Component<P> {}
`;

export function loadCompiler(compilerRoot = root) {
  const require = createRequire(join(resolve(compilerRoot), 'package.json'));
  const ts = require('@typescript/typescript6');
  if (require('@typescript/typescript6/package.json').version !== '6.0.2') fail('use the repository-pinned TypeScript API package 6.0.2');
  return ts;
}

// Rehydrate declaration files with graph-derived imports. This host is used only
// to classify call/construct return types, not to validate props or native peers.
// React is an explicit recognizer with an opaque marker; unresolved/any returns
// fail closed. It is not a substitute for real React declarations or typecheck.
export function declarationClassifier(snapshot, ts) {
  const grouped = new Map(), idFiles = new Map();
  for (const [id, record] of Object.entries(snapshot.declarations)) {
    const split = id.lastIndexOf('#'), file = id.slice(0, split);
    if (!grouped.has(file)) grouped.set(file, []);
    grouped.get(file).push({ id, record, name: id.slice(split + 1) });
    idFiles.set(id, file);
  }
  const virtual = new Map([['/__tron__/react.d.ts', REACT_TYPES]]);
  for (const [file, records] of grouped) {
    const own = new Set(records.map(r => r.name)), imports = new Map();
    for (const { record } of records) for (const reference of record.references) {
      if (!idFiles.has(reference) || idFiles.get(reference) === file) continue;
      const name = reference.slice(reference.lastIndexOf('#') + 1);
      if (!/^[A-Za-z_$][\w$]*$/.test(name) || own.has(name)) continue;
      // Different declarations sharing a name require the live signature gate;
      // do not silently guess one when classification could depend on it.
      if (imports.has(name) && imports.get(name) !== idFiles.get(reference)) fail('ambiguous referenced declaration name ' + name + ' in ' + file);
      imports.set(name, idFiles.get(reference));
    }
    const prelude = 'import * as React from "react";\nimport type { ReactNode, ReactElement, Ref, ForwardRefExoticComponent } from "react";\n';
    virtual.set('/__tron__/' + file, prelude + [...imports].map(([name, target]) => `import { ${name} } from ${JSON.stringify(target)};`).join('\n') + '\n' + records.flatMap(r => r.record.signatures).join('\n'));
  }
  const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, strict: true, skipLibCheck: true,
    noEmit: true, types: [] };
  const host = ts.createCompilerHost(options), originalRead = host.readFile.bind(host), originalExists = host.fileExists.bind(host);
  host.readFile = file => virtual.get(file) ?? originalRead(file);
  host.fileExists = file => virtual.has(file) || originalExists(file);
  host.getSourceFile = (file, languageVersion) => {
    const text = host.readFile(file);
    return text === undefined ? undefined : ts.createSourceFile(file, text, languageVersion, true);
  };
  host.resolveModuleNames = names => names.map(name => name === 'react'
    ? { resolvedFileName: '/__tron__/react.d.ts', extension: ts.Extension.Dts }
    : grouped.has(name) ? { resolvedFileName: '/__tron__/' + name, extension: ts.Extension.Dts } : undefined);
  const program = ts.createProgram([...virtual.keys()], options, host), checker = program.getTypeChecker();
  const classify = (id, exportedName) => {
    const file = idFiles.get(id), source = file && program.getSourceFile('/__tron__/' + file);
    if (!source) fail('missing declaration identity ' + id);
    const name = id.slice(id.lastIndexOf('#') + 1);
    const candidateName = exportedName ?? name;
    const local = checker.getSymbolsInScope(source, ts.SymbolFlags.Value | ts.SymbolFlags.Type).find(s => s.name === name && s.declarations?.some(d => d.getSourceFile() === source));
    if (!local) fail('cannot resolve declaration ' + id);
    const symbol = checker.getExportSymbolOfSymbol(local);
    if (!(symbol.flags & ts.SymbolFlags.Value)) return { kind: 'excluded', reason: 'type-only declaration' };
    const declaration = symbol.valueDeclaration ?? symbol.declarations[0], type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    if (/^[A-Z]/.test(candidateName) && type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) fail('unresolved or any-valued component candidate needs explicit review: ' + id);
    const calls = type.getCallSignatures(), constructs = type.getConstructSignatures();
    if (!calls.length && !constructs.length) return { kind: 'excluded', reason: 'non-callable exported value' };
    const renderable = value => {
      if (value.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never)) return false;
      if (value.aliasSymbol?.name === 'ReactNode' && value.aliasSymbol.declarations?.some(d => d.getSourceFile().fileName === '/__tron__/react.d.ts')) return true;
      if (value.isUnion()) return value.types.some(t => checker.getPropertyOfType(t, '__tronReactElement')) && value.types.every(t => t.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined) || checker.getPropertyOfType(t, '__tronReactElement'));
      return !!checker.getPropertyOfType(value, '__tronReactElement');
    };
    if (calls.some(s => renderable(checker.getReturnTypeOfSignature(s)))) return { kind: 'component', reason: 'semantic callable returns an explicit React element/node type' };
    let unresolvedRender = false;
    if (constructs.some(s => {
      const instance = checker.getReturnTypeOfSignature(s), render = checker.getPropertyOfType(instance, 'render');
      if (!render) return false;
      return checker.getTypeOfSymbolAtLocation(render, render.valueDeclaration ?? declaration).getCallSignatures().some(s => {
        const returned = checker.getReturnTypeOfSignature(s);
        if (returned.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) unresolvedRender = true;
        return !!checker.getPropertyOfType(instance, '__tronReactClass') && renderable(returned);
      });
    })) return { kind: 'component', reason: 'semantic React class with a renderable render method' };
    const unknown = unresolvedRender || calls.some(s => checker.getReturnTypeOfSignature(s).flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Null | ts.TypeFlags.Undefined));
    if (/^[A-Z]/.test(candidateName) && unknown) fail('unresolved or any-valued component candidate needs explicit review: ' + id);
    return { kind: 'excluded', reason: 'callable model/helper with a non-React return type' };
  };
  return classify;
}

export function packageDirectories(rootDir) {
  const base = join(rootDir, 'packages');
  return readdirSync(base, { withFileTypes: true }).filter(e => e.isDirectory() && existsSync(join(base, e.name, 'package.json'))).map(e => join(base, e.name))
    .concat([join(base, 'windows-fluent/rnw-fabric'), join(base, 'macos-appkit/spark')]).sort(compare);
}

function platforms(exposures, desktop) {
  const result = {};
  for (const platform of ['ios', 'android', 'web', 'macos', 'windows', 'visionos', 'quest', 'pico']) {
    const tier = ['ios', 'android', 'web'].includes(platform) ? 1 : ['macos', 'windows'].includes(platform) ? 2 : 3;
    const measurements = [];
    if (tier === 2) for (const e of exposures.filter(e => e.package === '@nyc-tron/ui')) {
      const key = e.subpath + '#' + e.symbol;
      for (const originalStatus of ['supported', 'struck', 'notVerified']) {
        const values = desktop.lanes[platform][originalStatus];
        const measured = values?.find(value => (typeof value === 'string' ? value : value.component) === key);
        if (measured) measurements.push({ exposure: e.importPath + '#' + e.symbol, originalStatus,
          status: originalStatus === 'supported' ? 'supported' : originalStatus === 'struck' ? 'struck' : 'not verified',
          ...(typeof measured === 'object' ? { recordedResult: measured } : {}),
          evidence: 'docs/desktop-support.json', provenance: 'desktopD5' });
      }
    }
    const statuses = [...new Set(measurements.map(m => m.status))];
    result[platform] = { status: statuses.length === 1 ? statuses[0] : 'not verified', ...(measurements.length ? { measurements } : {}) };
  }
  return result;
}

export function generateLibraryManifest({ rootDir = root, ts = loadCompiler(), snapshots } = {}) {
  const files = snapshots ?? ['docs/api-signatures.json', 'docs/api-signatures-windows.json', 'docs/api-signatures-macos.json'];
  const records = files.map(file => ({ file, snapshot: json(join(rootDir, file)) }));
  const owners = new Map(packageDirectories(rootDir).map(directory => { const manifest = json(join(directory, 'package.json')); return [manifest.name, { directory, manifest }]; }));
  const surface = json(join(rootDir, 'docs/api-surface.json')), desktop = json(join(rootDir, 'docs/desktop-support.json'));
  const components = new Map(), exclusions = [], packages = [], coveredPackages = new Set();
  for (const { file, snapshot } of records) {
    const classify = declarationClassifier(snapshot, ts);
    for (const [name, paths] of Object.entries(snapshot.packages)) {
      const owner = owners.get(name);
      if (!owner || coveredPackages.has(name)) fail('missing/duplicate package snapshot ' + name);
      coveredPackages.add(name);
      const expected = Object.keys(owner.manifest.exports).filter(p => p !== './package.json').sort(compare);
      if (JSON.stringify(expected) !== JSON.stringify(Object.keys(paths).sort(compare))) fail('export map/snapshot drift for ' + name);
      if (surface[name] && JSON.stringify(Object.keys(owner.manifest.exports).sort(compare)) !== JSON.stringify([...surface[name]].sort(compare))) fail('API surface/export map drift for ' + name);
      const forgePaths = Object.keys(paths).filter(p => p === './components/forge' || p.startsWith('./components/forge/'));
      if (forgePaths.length) fail('editor-control subpaths belong to @nitro-forge/editor-controls (D10): ' + name + forgePaths[0].slice(1));
      packages.push({ package: name, exportCount: expected.length, componentExposureCount: 0, snapshot: file });
      for (const [subpath, variants] of Object.entries(paths)) {
        const declaredTargets = declarationTargets(owner.manifest.exports[subpath]);
        if (JSON.stringify([...declaredTargets].sort(compare)) !== JSON.stringify([...new Set(variants.map(v => v.target))].sort(compare))) fail('declaration target drift for ' + name + subpath);
        for (const variant of variants) {
        if (JSON.stringify(variant.conditions) !== JSON.stringify(owner.manifest.exports[subpath])) fail('export condition drift for ' + name + subpath);
        for (const [symbol, ids] of Object.entries(variant.symbols)) for (const id of ids) {
          if (!snapshot.declarations[id]) {
            const external = snapshot.externalTypes[id];
            const parsed = external && ts.createSourceFile('external.d.ts', external.signatures.join('\n'), ts.ScriptTarget.Latest, true);
            if (!parsed?.statements.length || !parsed.statements.every(s => ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s))) fail('external value re-export requires component classification: ' + id);
            exclusions.push({ package: name, subpath, symbol, declaration: id, reason: 'external type-only declaration; not a React component value' });
            continue;
          }
          const classification = classify(id, symbol), exposure = { package: name, importPath: name + (subpath === '.' ? '' : subpath.slice(1)), subpath, symbol, target: variant.target, snapshot: file };
          if (classification.kind === 'excluded') { exclusions.push({ ...exposure, declaration: id, reason: classification.reason }); continue; }
          if (!/^[A-Z]/.test(symbol) && symbol !== 'default') { exclusions.push({ ...exposure, declaration: id, reason: 'lowercase render helper; not an exported React component name' }); continue; }
          if (!components.has(id)) components.set(id, { id, exposures: [], classification: classification.reason });
          const entry = components.get(id);
          if (!entry.exposures.some(e => JSON.stringify(e) === JSON.stringify(exposure))) entry.exposures.push(exposure);
        }
        }
      }
    }
  }
  for (const name of owners.keys()) if (!coveredPackages.has(name)) fail('package is missing from signature inventory: ' + name);
  const stableNames = new Set(['Button', 'Card', 'NavigationRail', 'NavigationShell', 'TextField']);
  const entries = [...components.values()].map(entry => {
    entry.exposures.sort((a, b) => compare(a.importPath + '#' + a.symbol, b.importPath + '#' + b.symbol));
    const canonical = entry.exposures.find(e => e.subpath !== '.') ?? entry.exposures[0];
    const stable = entry.exposures.some(e => e.package === '@nyc-tron/ui' && e.subpath === '.' && stableNames.has(e.symbol));
    return { id: entry.id, package: canonical.package, importPath: canonical.importPath, symbol: canonical.symbol,
      category: COMPONENT_CATEGORY,
      stability: null, proposedStability: stable ? 'stable' : 'preview', ownerConfirmation: 'pending',
      stabilityReason: stable ? 'Existing root UI contract proposed as the initial stable target; all individual T3 evidence and owner confirmation are still required.' : 'Shipped public component proposed as preview until its individual library evidence packet and owner-confirmed semver promise are complete.',
      classification: entry.classification, exposures: entry.exposures, platforms: platforms(entry.exposures, desktop),
      evidence: [{ path: canonical.snapshot, declaration: entry.id, kind: 'public declaration snapshot; not runtime acceptance' }] };
  }).sort((a, b) => compare(a.id, b.id));
  if (!entries.length || !entries.some(e => e.proposedStability === 'stable')) fail('empty component or stable-target inventory; classification must not pass vacuously');
  const publicEntries = new Map();
  for (const entry of entries) for (const exposure of entry.exposures) {
    const id = exposure.importPath + '#' + exposure.symbol;
    if (!publicEntries.has(id)) publicEntries.set(id, {
      id, package: exposure.package, importPath: exposure.importPath, subpath: exposure.subpath, symbol: exposure.symbol,
      category: COMPONENT_CATEGORY,
      stability: null, proposedStability: entry.proposedStability, ownerConfirmation: 'pending', stabilityReason: entry.stabilityReason,
      declarationIdentities: [], variants: [], aliases: [], platforms: platforms([exposure], desktop), evidence: [],
    });
    const component = publicEntries.get(id);
    if (component.proposedStability !== entry.proposedStability) fail('inconsistent stability proposal across declaration variants: ' + id);
    component.declarationIdentities.push(entry.id);
    component.variants.push({ target: exposure.target, snapshot: exposure.snapshot, declarationIdentity: entry.id });
    component.aliases.push(...entry.exposures.map(e => e.importPath + '#' + e.symbol).filter(key => key !== id));
    component.evidence.push(...entry.evidence);
  }
  const publicComponents = [...publicEntries.values()].sort((a, b) => compare(a.id, b.id));
  for (const component of publicComponents) {
    component.declarationIdentities = [...new Set(component.declarationIdentities)].sort(compare);
    component.aliases = [...new Set(component.aliases)].sort(compare);
    component.evidence = component.evidence.filter((e, i, all) => all.findIndex(v => JSON.stringify(v) === JSON.stringify(e)) === i);
  }
  for (const p of packages) p.componentExposureCount = publicComponents.filter(e => e.package === p.package).length;
  const excludedDeclarations = new Map();
  for (const entry of exclusions) {
    const key = entry.declaration + ':' + entry.reason;
    if (!excludedDeclarations.has(key)) excludedDeclarations.set(key, { declarationIdentity: entry.declaration, reason: entry.reason, exports: [] });
    excludedDeclarations.get(key).exports.push((entry.importPath ?? entry.package + (entry.subpath === '.' ? '' : entry.subpath.slice(1))) + '#' + entry.symbol);
  }
  const excluded = [...excludedDeclarations.values()].map(e => ({ ...e, exports: [...new Set(e.exports)].sort(compare) })).sort((a, b) => compare(a.declarationIdentity + a.reason, b.declarationIdentity + b.reason));
  const expectedSymbols = new Set(records.flatMap(({ snapshot }) => Object.entries(snapshot.packages).flatMap(([name, paths]) => Object.entries(paths).flatMap(([path, variants]) => variants.flatMap(v => Object.keys(v.symbols).map(symbol => name + (path === '.' ? '' : path.slice(1)) + '#' + symbol))))));
  const classifiedSymbols = new Set(publicComponents.map(e => e.id).concat(excluded.flatMap(e => e.exports)));
  if (expectedSymbols.size !== classifiedSymbols.size || [...expectedSymbols].some(id => !classifiedSymbols.has(id))) fail('public symbol classification coverage differs from exports');
  const result = { schemaVersion: 1, ownerConfirmation: 'pending', status: 'proposed inventory; not a release approval',
    identity: 'one entry per public package/import-path/exported-symbol component exposure; declaration identities link aliases; conditional declarations are variants of that same entry',
    platformPolicy: {
      tier1: { platforms: ['ios', 'android', 'web'], note: 'No complete T3 evidence packet is recorded by this inventory; historical receipts are not promoted to candidate acceptance.' },
      tier2: { platforms: ['macos', 'windows'], note: 'D5 measurements retain their original archive, graph and date; absent or conflicting measurements are not verified.' },
      tier3: { platforms: ['visionos', 'quest', 'pico'], note: 'Not verified for 1.0.0. Physical hardware scenarios, including pen/palm, fold postures, screen-reader speech and multi-display, remain not verified.' },
    },
    evidenceRecords: { desktopD5: { path: 'docs/desktop-support.json', provenance: desktop.evidence, archive: desktop.ui } },
    sourceFingerprintEncoding: 'SHA-256 of UTF-8 source text with CRLF normalized to LF; not archive bytes or Git blob ids',
    inputs: [...files, 'docs/api-surface.json', 'docs/desktop-support.json'].map(path => ({ path, sha256: sourceFingerprint(readFileSync(join(rootDir, path))) })),
    summary: { packageCount: packages.length, publicSymbolExportCount: expectedSymbols.size, componentCount: publicComponents.length, declarationIdentityCount: entries.length, proposedStable: publicComponents.filter(e => e.proposedStability === 'stable').length, proposedPreview: publicComponents.filter(e => e.proposedStability === 'preview').length, proposedStableIdentityCount: entries.filter(e => e.proposedStability === 'stable').length },
    packages: packages.sort((a, b) => compare(a.package, b.package)), components: publicComponents, exclusions: excluded };
  const reviewPath = join(rootDir, 'docs/library/stability-review.json');
  return applyStabilityReview(result, existsSync(reviewPath) ? json(reviewPath) : { schemaVersion: 1, status: 'pending', approval: null });
}

/** Bind the owner's complete label decision to this exact public component proposal. */
export function stabilityProposalDigest(manifest) {
  const proposal = manifest.components.map(c => ({ id: c.id, package: c.package, importPath: c.importPath,
    symbol: c.symbol, category: c.category, proposedStability: c.proposedStability,
    declarationIdentities: [...c.declarationIdentities].sort(),
    variants: c.variants.map(v => ({ target: v.target, declarationIdentity: v.declarationIdentity })).sort((a, b) => compare(JSON.stringify(a), JSON.stringify(b)))
  })).sort((a, b) => compare(a.id, b.id));
  return sourceFingerprint(JSON.stringify(proposal));
}

export function applyStabilityReview(manifest, review) {
  if (!review || review.schemaVersion !== 1 || !['pending', 'confirmed'].includes(review.status)) fail('invalid stability-review record');
  if (review.status === 'pending') {
    if (review.approval !== null) fail('pending stability review must not claim an approval');
    return manifest;
  }
  const approval = review.approval;
  if (!approval || approval.reviewer !== 'mikevocalz' || typeof approval.decision !== 'string' || !approval.decision.trim()) fail('confirmed stability review needs the owner and an explicit decision reference');
  if (approval.proposalSha256 !== stabilityProposalDigest(manifest)) fail('stability review is for a different export/proposal list');
  const labels = approval.labels;
  if (!labels || typeof labels !== 'object' || Array.isArray(labels) || Object.keys(labels).length !== manifest.components.length ||
      manifest.components.some(c => !Object.hasOwn(labels, c.id) || !['stable', 'preview'].includes(labels[c.id])) ||
      Object.keys(labels).some(id => !manifest.components.some(c => c.id === id))) fail('stability review must label every component export exactly once');
  if (!Object.values(labels).includes('stable')) fail('confirmed inventory must retain an explicit stable target; an all-preview label map cannot bypass the stable gate');
  // Aliases of one public declaration cannot carry contradictory semver promises.
  const identities = new Map();
  for (const c of manifest.components) for (const identity of c.declarationIdentities) {
    if (identities.has(identity) && identities.get(identity) !== labels[c.id]) fail('stability labels disagree across aliases of ' + identity);
    identities.set(identity, labels[c.id]);
  }
  return { ...manifest, ownerConfirmation: 'confirmed', status: 'owner-confirmed component inventory; runtime release evidence is separate',
    stabilityReview: { reviewer: approval.reviewer, decision: approval.decision, proposalSha256: approval.proposalSha256 },
    components: manifest.components.map(c => ({ ...c, stability: labels[c.id], ownerConfirmation: 'confirmed' })) };
}

export function declarationTargets(value) {
  if (!value || typeof value !== 'object') return [];
  return [...new Set(Object.entries(value).flatMap(([key, target]) => key === 'types' && typeof target === 'string' ? [target] : declarationTargets(target)))];
}

if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2);
  let compilerRoot = root, write = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--write' && !write) write = true;
    else if (args[i] === '--compiler-root' && args[i + 1] && !args[i + 1].startsWith('--')) compilerRoot = args[++i];
    else fail('usage: [--write] [--compiler-root <tooling-root>]');
  }
  const actual = generateLibraryManifest({ ts: loadCompiler(compilerRoot) }), file = join(root, 'docs/library/components.json');
  const bytes = JSON.stringify(actual, null, 2) + '\n';
  if (write) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, bytes); }
  else if (!existsSync(file) || !matchesGeneratedJson(readFileSync(file), actual)) fail('generated components.json differs; review exports and run --write');
  console.log(`Library inventory: ${actual.summary.packageCount} packages; ${actual.summary.componentCount} public component exports; ${actual.summary.declarationIdentityCount} declaration identities; ${actual.summary.proposedStable} proposed stable / ${actual.summary.proposedPreview} proposed preview; owner confirmation ${actual.ownerConfirmation}.`);
}
