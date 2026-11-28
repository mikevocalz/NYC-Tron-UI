import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng } from './app-identity/png.mjs';
import { applyStabilityReview, declarationTargets, packageDirectories, sourceFingerprint, generateLibraryManifest } from './library-components.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const hash = value => createHash('sha256').update(value).digest('hex');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const SHA = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const fail = message => { throw new Error('Library readiness: ' + message); };
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
export const LIBRARY_EVIDENCE_KINDS = Object.freeze(['exports', 'declarations', 'unit', 'accessibility', 'web', 'ios', 'android']);
export const REQUIRED_COMPONENT_STATES = Object.freeze({
  Button: ['enabled press', 'disabled', 'loading', 'variants'],
  Card: ['raised', 'sunken', 'transparent'],
  TextField: ['editable', 'helper', 'error', 'disabled', 'retained draft'],
  NavigationRail: ['selected', 'disabled item', 'collapsed labels', 'explicit physical edge'],
  NavigationShell: ['left edge', 'right edge', 'RTL', 'retained child draft'],
});
export const LIBRARY_TIER_ONE = Object.freeze(['ios', 'android', 'web']);

export function safeEvidenceFile(base, path) {
  if (!nonempty(path) || path.includes('\\') || path.startsWith('/') || path.split('/').some(p => !p || p === '.' || p === '..') || !/^[A-Za-z0-9_@+./ -]+$/.test(path)) fail('unsafe evidence path');
  const directory = realpathSync(resolve(base)), file = join(directory, path);
  if (!existsSync(file) || !statSync(file).isFile() || !realpathSync(file).startsWith(directory + sep)) fail('missing or escaping evidence file: ' + path);
  return file;
}

export function verifyEvidenceArtifact(artifact, base) {
  if (!artifact || !SHA.test(artifact.sha256 ?? '')) fail('evidence artifact needs its exact byte SHA256');
  const path = safeEvidenceFile(base, artifact.path);
  if (hash(readFileSync(path)) !== artifact.sha256) fail('evidence artifact checksum mismatch: ' + artifact.path);
  return path;
}

export function candidateSource(rootDir = root) {
  try {
    const sourceCommit = execFileSync('git', ['-C', rootDir, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const sourceDirty = execFileSync('git', ['-C', rootDir, 'status', '--porcelain', '--untracked-files=normal'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().length !== 0;
    return { sourceCommit, sourceDirty };
  } catch { return { sourceCommit: null, sourceDirty: true }; }
}

/** Load real receipt files; nested paths stay inside the explicitly supplied evidence directory. */
export function loadLibraryEvidence(file) {
  if (!existsSync(file)) return { schemaVersion: 1, receipts: [], evidenceRoot: dirname(resolve(file)) };
  const evidenceRoot = dirname(realpathSync(file)), index = json(file);
  if (index.schemaVersion !== 1 || !Array.isArray(index.receipts)) fail('invalid library evidence index');
  const receipts = index.receipts.map(entry => {
    if (entry && typeof entry.path === 'string' && entry.sha256) {
      const path = verifyEvidenceArtifact(entry, evidenceRoot);
      return { receipt: json(path), base: dirname(path) };
    }
    return { receipt: entry, base: evidenceRoot };
  });
  return { ...index, receipts, evidenceRoot };
}

export function validateLibraryManifest(manifest, { rootDir = root } = {}) {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.components) || !manifest.components.length || !Array.isArray(manifest.inputs)) fail('missing exported-component manifest');
  if (manifest.summary?.componentCount !== manifest.components.length) fail('component count differs from the public export inventory');
  const owners = new Map(packageDirectories(rootDir).map(directory => { const m = json(join(directory, 'package.json')); return [m.name, m]; }));
  const generated = generateLibraryManifest({ rootDir });
  if (JSON.stringify(generated) !== JSON.stringify(manifest)) fail('component inventory differs from the complete public export inventory; regenerate it');
  const ids = new Set();
  for (const input of manifest.inputs) if (!SHA.test(input.sha256 ?? '') || sourceFingerprint(readFileSync(safeEvidenceFile(rootDir, input.path))) !== input.sha256) fail('export/declaration input drift: ' + input.path);
  const snapshots = new Map();
  for (const component of manifest.components) {
    const pkg = owners.get(component.package);
    const importPath = component.package + (component.subpath === '.' ? '' : component.subpath?.slice(1));
    if (!pkg || !Object.hasOwn(pkg.exports ?? {}, component.subpath) || component.importPath !== importPath || component.id !== importPath + '#' + component.symbol || ids.has(component.id)) fail('missing, duplicated or changed public component export: ' + component.id);
    ids.add(component.id);
    if (component.category !== 'general components' || !['stable', 'preview'].includes(component.proposedStability) || !Array.isArray(component.variants) || !component.variants.length) fail('invalid component metadata: ' + component.id);
    for (const variant of component.variants) {
      if (!snapshots.has(variant.snapshot)) snapshots.set(variant.snapshot, json(safeEvidenceFile(rootDir, variant.snapshot)));
      const snapshot = snapshots.get(variant.snapshot);
      const exported = snapshot.packages?.[component.package]?.[component.subpath];
      if (!declarationTargets(pkg.exports[component.subpath]).includes(variant.target) || !snapshot.declarations?.[variant.declarationIdentity] ||
          !exported?.some(v => v.target === variant.target && v.symbols?.[component.symbol]?.includes(variant.declarationIdentity))) fail('component declarations differ from public exports: ' + component.id);
    }
  }
  const reviewPath = join(rootDir, 'docs/library/stability-review.json');
  const review = existsSync(reviewPath) ? json(reviewPath) : { schemaVersion: 1, status: 'pending', approval: null };
  const pending = { ...manifest, ownerConfirmation: 'pending', components: manifest.components.map(c => ({ ...c, ownerConfirmation: 'pending', stability: null })) };
  delete pending.stabilityReview;
  const decided = applyStabilityReview(pending, review);
  if (decided.ownerConfirmation !== manifest.ownerConfirmation || decided.components.some((c, i) => c.stability !== manifest.components[i].stability || c.ownerConfirmation !== manifest.components[i].ownerConfirmation)) fail('manifest stability differs from the recorded owner decision; regenerate the inventory');
  return { componentCount: ids.size, ownerConfirmation: manifest.ownerConfirmation, manifestSha256: sourceFingerprint(JSON.stringify(manifest, null, 2) + '\n') };
}

function receiptKind(receipt) { return LIBRARY_TIER_ONE.includes(receipt?.platform) ? receipt.platform : receipt?.kind; }

/** A passed flag alone is insufficient: require matching candidate bytes and bound executable artifacts. */
export function validateLibraryReceipt(receipt, { base, version, sourceCommit, manifestSha256, archiveHashes, rootDir = root }) {
  const kind = receiptKind(receipt);
  if (receipt?.schemaVersion !== 1 || !LIBRARY_EVIDENCE_KINDS.includes(kind) || receipt.status !== 'passed') fail('receipt is not a passed library evidence kind');
  const execution = {
    exports: ['node-react-ssr','tooling/kitchen-sink/unit-fixture.tsx'],
    unit: ['node-react-ssr','tooling/kitchen-sink/unit-fixture.tsx'],
    declarations: ['typescript','examples/kitchen-sink/App.tsx'],
    accessibility: ['playwright','tooling/kitchen-sink/web-proof.mjs'],
    web: ['playwright','tooling/kitchen-sink/web-proof.mjs'],
    ios: ['maestro','tooling/kitchen-sink/native-flow.mjs'],
    android: ['maestro','tooling/kitchen-sink/native-flow.mjs'],
  }[kind];
  if (receipt.runner?.name !== execution[0] || receipt.runner?.testSource !== execution[1]) fail('runner or executable source does not match the claimed evidence kind');
  if (LIBRARY_TIER_ONE.includes(kind)) {
    const web = kind === 'web';
    const expectedSource = 'tooling/kitchen-sink/' + (web ? 'web-proof.mjs' : 'native-flow.mjs');
    if (receipt.kind !== 'nyc-tron-library-render-evidence' || receipt.platform !== kind || receipt.runner?.name !== (web ? 'playwright' : 'maestro') || receipt.runner?.testSource !== expectedSource || (!web && !receipt.runner?.command?.split(/\s+/).some((token, i, tokens) => token === '--platform' && tokens[i + 1] === kind))) fail('render/mount runner or executable source does not match its claimed platform');
  }
  const candidate = receipt.candidate;
  if (!candidate || candidate.version !== version || !COMMIT.test(candidate.sourceCommit ?? '') || candidate.sourceCommit !== sourceCommit || candidate.sourceDirty !== false) fail('receipt is dirty, stale or belongs to a different candidate');
  if (receipt.manifestSha256 !== manifestSha256) fail('receipt belongs to a different library manifest');
  if (!Array.isArray(candidate.archives) || !candidate.archives.length || new Set(candidate.archives.map(a => a.package)).size !== candidate.archives.length) fail('receipt does not identify installed candidate archives');
  for (const archive of candidate.archives) if (!/^@nyc-tron\/[a-z0-9-]+$/.test(archive.package ?? '') || !SHA.test(archive.sha256 ?? '') || archive.version !== version || archive.filename !== archive.package.slice(1).replace('/', '-') + '-' + version + '.tgz' || !archiveHashes || archiveHashes.get(archive.filename) !== archive.sha256) fail('receipt archive differs from the actual candidate inventory');
  if (LIBRARY_TIER_ONE.includes(kind) && (!Array.isArray(candidate.installCommand) || candidate.installCommand[0] !== 'npm' || candidate.installCommand[1] !== 'install' || candidate.installCommand.some(token => !nonempty(token)))) fail('render/mount receipt needs the actual tarball install command');
  if (!nonempty(receipt.runner?.command) || !SHA.test(receipt.runner?.testSha256 ?? '') || receipt.runner.exitCode !== 0 || !nonempty(receipt.runner.testSource)) fail('receipt needs a successful executable test and its source identity');
  const testSource = safeEvidenceFile(rootDir, receipt.runner.testSource);
  if (hash(readFileSync(testSource)) !== receipt.runner.testSha256) fail('receipt test source changed after execution');
  verifyEvidenceArtifact(receipt.runner.log, base);
  if (!Array.isArray(receipt.artifacts) || !receipt.artifacts.length) fail('receipt needs machine-readable assertion results');
  const resultPaths = receipt.artifacts.map(a => verifyEvidenceArtifact(a, base));
  const result = receipt.assertions;
  if (!result || !Number.isSafeInteger(result.passed) || result.passed < 1 || result.failed !== 0 || result.skipped !== 0) fail('receipt contains failed, skipped or empty assertions');
  const summaries = resultPaths.filter(path => path.endsWith('.json')).map(path => json(path));
  const summary = summaries.find(value => value.status === 'passed' && isDeepStrictEqual(value.assertions, result) && isDeepStrictEqual(value.components, receipt.components));
  if (!summary) fail('receipt assertion counts/component coverage differ from its actual structured results');
  if (!Array.isArray(summary?.evidenceKinds) || !summary.evidenceKinds.includes(kind)) fail('executed result does not establish the claimed evidence kind');
  if (kind === 'accessibility' && (summary.platform !== 'web' || !Array.isArray(summary.cases) || !summary.cases.length || summary.cases.some(c => c.axeViolations !== 0))) fail('accessibility proof lacks actual zero-violation axe results');
  if (LIBRARY_TIER_ONE.includes(kind) && summary?.platform !== kind) fail('executed result platform differs from the claimed mount/render platform');
  if (kind === 'accessibility' && (receipt.violations !== 0 || !Array.isArray(receipt.standards) || !receipt.standards.includes('WCAG 2.1 AA'))) fail('static accessibility audit did not pass');
  if (!Array.isArray(receipt.components) || !receipt.components.length) fail('receipt has no component coverage');
  for (const component of receipt.components) {
    if (!nonempty(component.symbol) || component.status !== 'passed' || !Array.isArray(component.imports) || !component.imports.length) fail('receipt has incomplete component coverage');
    for (const entry of component.imports) if (entry.symbol !== component.symbol || !nonempty(entry.path) || entry.rendered !== true || !Array.isArray(entry.assertedStates) || !entry.assertedStates.length || entry.assertedStates.some(s => !nonempty(s))) fail('receipt has an unexecuted import/state contract');
  }
  for (const component of receipt.components) for (const entry of component.imports) {
    const required = REQUIRED_COMPONENT_STATES[component.symbol] ?? [];
    if (required.some(state => !entry.assertedStates.includes(state))) fail('receipt misses required component states: ' + component.symbol);
  }
  if (LIBRARY_TIER_ONE.includes(kind) && !receipt.runner.screenshots?.length) fail('render/mount receipt needs actual screenshots');
  for (const screenshot of receipt.runner.screenshots ?? []) {
    const path = verifyEvidenceArtifact(screenshot, base);
    const bytes = readFileSync(path);
    try {
      if (bytes.length < 45 || !bytes.subarray(-12).equals(Buffer.from('0000000049454e44ae426082', 'hex')) || bytes.readUInt32BE(16) < 1 || bytes.readUInt32BE(20) < 1) throw new Error('incomplete PNG');
      const image = decodePng(bytes);
      if (image.width < 1 || image.height < 1 || image.data.length !== image.width * image.height * 4) throw new Error('empty PNG');
    } catch { fail('screenshot artifact is not a complete decodable positive-dimension PNG'); }
  }
  return { kind, receipt };
}

export function validateDocumentationVerification(documentation, {rootDir = root, manifestSha256, componentIds}) {
  if (documentation?.schemaVersion !== 1 || documentation.manifestSha256 !== manifestSha256) fail('missing or stale documentation index');
  const receipt = json(safeEvidenceFile(rootDir, documentation.verification?.path));
  if (receipt.schemaVersion !== 1 || receipt.kind !== 'documentation' || receipt.status !== 'passed' || receipt.exitCode !== 0 || !nonempty(receipt.command) || receipt.manifestSha256 !== manifestSha256) fail('documentation verification is not a successful run for this manifest');
  if (!Array.isArray(receipt.components) || !isDeepStrictEqual([...receipt.components].sort(), [...componentIds].sort())) fail('documentation verification does not cover every current public export');
  if (receipt.checks?.labels?.status !== 'passed' || receipt.checks.labels.count !== componentIds.length || receipt.checks?.routes?.status !== 'passed' || receipt.checks.routes.count !== componentIds.length || receipt.checks?.examples?.status !== 'passed' || receipt.checks.examples.count !== componentIds.length || receipt.checks.examples.errors !== 0 || receipt.checks?.accessibility?.status !== 'passed' || receipt.checks.accessibility.violations !== 0) fail('documentation route, example or accessibility checks did not pass');
  if (!Array.isArray(receipt.artifacts) || !receipt.artifacts.some(a => a.path === 'docs/library/documentation.json')) fail('documentation receipt does not bind its actual index bytes');
  const paths = receipt.artifacts.map(a => verifyEvidenceArtifact(a, rootDir));
  const results = paths.filter(path => path.endsWith('.json')).map(path => json(path));
  if (!results.some(r => r.stats?.expected >= 5 && r.stats.unexpected === 0 && r.stats.skipped === 0 && r.stats.flaky === 0)) fail('documentation lacks successful unskipped browser results');
  if (!results.some(r => r.checked === componentIds.length && Array.isArray(r.errors) && r.errors.length === 0)) fail('documentation examples have no successful complete typecheck result');
  const routeResults = results.find(r => r.status === 'passed' && Array.isArray(r.routes));
  if (!routeResults || routeResults.routes.length !== componentIds.length || !isDeepStrictEqual(routeResults.routes.map(r => r.id).sort(), [...componentIds].sort())) fail('documentation lacks complete executed route/label results');
  return { ...receipt, routeResults: routeResults.routes };
}

function checkDocumentation(component, documentation, { rootDir, manifestSha256, verificationIssue, verification }) {
  if (verificationIssue) return verificationIssue;
  const record = documentation?.components?.find(c => c.id === component.id);
  if (documentation?.schemaVersion !== 1 || documentation.manifestSha256 !== manifestSha256 || !record || record.importPath !== component.importPath || record.symbol !== component.symbol) return 'missing or stale component documentation';
  try {
    for (const key of ['page', 'pageSource', 'data', 'example']) verifyEvidenceArtifact({path: record[key], sha256: record[key + 'Sha256']}, rootDir);
    const data = json(safeEvidenceFile(rootDir, record.data));
    if (data.id !== component.id || data.importPath !== component.importPath || data.symbol !== component.symbol) return 'built page data belongs to another component';
    const expectedLabel = component.stability ?? 'Proposed ' + component.proposedStability;
    const rendered = verification.routeResults.find(r => r.id === component.id);
    if (!rendered || rendered.status !== 'passed' || rendered.route !== record.route || rendered.importPath !== component.importPath || rendered.symbol !== component.symbol || rendered.label !== expectedLabel || rendered.ownerConfirmation !== component.ownerConfirmation) return 'executed component route or visible stability label differs from the manifest';
    if (record.route !== '/components/' + data.slug + '/' || record.page !== 'website/dist/components/' + data.slug + '/index.html') return 'built component route differs from its page data';
    if (data.stability !== component.stability || data.proposedStability !== component.proposedStability || data.ownerConfirmation !== component.ownerConfirmation) return 'built component label metadata differs from the manifest';
    if (!record.route?.startsWith('/components/') || !Array.isArray(record.accessibilityNotes) || !record.accessibilityNotes.length) return 'component page lacks its route or accessibility notes';
    if (record.stability !== component.stability) return 'component docs stability label differs from manifest';
    if (component.stability === 'stable' && record.unresolvedExampleProps?.length) return 'stable component example has unresolved required props';
  } catch (error) { return error.message; }
  return null;
}

/** Read only. Proposed targets are reported for planning, never counted as approved stable exports. */
export function validateLibraryReadiness({ manifest, evidence = { schemaVersion: 1, receipts: [] }, documentation, version, artifacts }, {
  rootDir = root, evidenceRoot = rootDir, source = candidateSource(rootDir),
} = {}) {
  const inventory = validateLibraryManifest(manifest, { rootDir });
  const blockers = [], receiptErrors = [];
  const confirmed = manifest.ownerConfirmation === 'confirmed';
  if (!confirmed) blockers.push('owner stable/preview confirmation is pending');
  if (!COMMIT.test(source.sourceCommit ?? '') || source.sourceDirty) blockers.push('release evidence requires a clean source commit');
  const archiveHashes = artifacts ? new Map(artifacts.hashes ?? []) : undefined;
  const validated = [];
  if (evidence.schemaVersion !== 1 || !Array.isArray(evidence.receipts)) fail('invalid library evidence index');
  for (const item of evidence.receipts) {
    const receipt = item?.receipt ?? item, base = item?.base ?? evidence.evidenceRoot ?? evidenceRoot;
    try { validated.push(validateLibraryReceipt(receipt, { base, version, sourceCommit: source.sourceCommit, manifestSha256: inventory.manifestSha256, archiveHashes, rootDir })); }
    catch (error) { receiptErrors.push(error.message); }
  }
  let verificationIssue, verification;
  try { verification = validateDocumentationVerification(documentation, {rootDir, manifestSha256: inventory.manifestSha256, componentIds: manifest.components.map(c => c.id)}); }
  catch (error) { verificationIssue = error.message; }
  const stable = manifest.components.filter(c => c.stability === 'stable');
  const preview = manifest.components.filter(c => c.stability === 'preview');
  const targets = confirmed ? stable : manifest.components.filter(c => c.proposedStability === 'stable');
  const components = targets.map(component => {
    const missing = LIBRARY_EVIDENCE_KINDS.filter(kind => !validated.some(v => v.kind === kind && v.receipt.components.some(c => c.symbol === component.symbol && c.imports.some(i => i.path === component.importPath && i.symbol === component.symbol && v.receipt.candidate.archives.some(a => a.package === component.package)))));
    const docsIssue = checkDocumentation(component, documentation, { rootDir, manifestSha256: inventory.manifestSha256, verificationIssue, verification });
    return { id: component.id, stability: component.stability, proposedStability: component.proposedStability, status: confirmed && !missing.length && !docsIssue ? 'passed' : 'not verified', missing, checks: LIBRARY_EVIDENCE_KINDS.map(kind => ({ kind, status: missing.includes(kind) ? 'NOT RUN' : 'verified evidence' })), ...(docsIssue ? { documentation: docsIssue } : {}) };
  });
  if (confirmed) {
    for (const component of components) if (component.status !== 'passed') blockers.push(component.id + ' lacks ' + [...component.missing, ...(component.documentation ? ['docs: ' + component.documentation] : [])].join(', '));
    for (const component of preview) {
      const issue = checkDocumentation(component, documentation, { rootDir, manifestSha256: inventory.manifestSha256, verificationIssue, verification });
      if (issue) blockers.push(component.id + ' preview documentation: ' + issue);
    }
  }
  if (receiptErrors.length) blockers.push(...receiptErrors.map(e => 'invalid evidence: ' + e));
  return { status: blockers.length ? 'blocked' : 'passed', ...inventory, stableCount: stable.length, previewCount: preview.length,
    unconfirmedCount: manifest.components.filter(c => c.stability === null).length, planningTargetCount: targets.length, planningOnly: !confirmed, tier1: [...LIBRARY_TIER_ONE],
    tier2: 'Published historical Spark macOS/RNW Windows lists; unmeasured exports are not verified.',
    tier3: 'visionOS, Quest, PICO and physical hardware are not verified for 1.0.0.',
    components, blockers, receiptCount: validated.length };
}
