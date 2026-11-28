// Agent-facing index of the library: llms.txt, llms-full.txt, one text file per
// component group under llms/, and a machine-readable registry with its JSON
// schema under registry/. Everything is derived from the generated inventory
// (docs/library/components.json) and the documentation catalog built by
// tooling/library-docs.mjs generateDocs(); nothing here is hand-written per
// component. Output is deterministic: sorted, LF line endings, no timestamps.
//
//   node tooling/llms.mjs            check the committed files (same as --check)
//   node tooling/llms.mjs --write    regenerate them
//   --out <dir>                      read/write the outputs under another root
//
// generateDocs() reads React Native declarations from the docs tooling install,
// so run `npm --prefix website ci --ignore-scripts` first.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isMainModule, normalizedSourceText, sourceFingerprint } from './library-components.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPOSITORY = 'https://github.com/mikevocalz/NYC-Tron-UI';
export const RAW_BASE = 'https://raw.githubusercontent.com/mikevocalz/NYC-Tron-UI/main/';
export const INVENTORY_PATH = 'docs/library/components.json';
export const REGISTRY_PATH = 'registry/components.json';
export const SCHEMA_PATH = 'registry/schema.json';
export const GROUP_DIR = 'llms';
const PLATFORM_ORDER = ['ios', 'android', 'web', 'macos', 'windows', 'visionos', 'quest', 'pico'];
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const fail = message => { throw new Error('llms: ' + message); };
const lf = value => normalizedSourceText(String(value));
const oneLine = value => lf(value).replace(/\s+/g, ' ').trim();
const isRootImport = importPath => /^@nyc-tron\/[^/]+$/.test(importPath);
const pathOf = id => id.slice(0, id.lastIndexOf('#'));
const isNativeSource = source => typeof source === 'string' && source.startsWith('react-native@');

/** Component group: one text file per package, and per directory inside @nyc-tron/ui. */
export function groupFor(pkg, importPath) {
  const short = pkg.replace(/^@nyc-tron\//, '');
  if (pkg !== '@nyc-tron/ui') return { id: short, title: pkg, importPrefix: pkg };
  const parts = importPath.slice(pkg.length + 1).split('/');
  if (parts[0] !== 'components' || parts.length < 2) return { id: 'ui-other', title: '@nyc-tron/ui (other subpaths)', importPrefix: pkg };
  if (parts.length === 2) return { id: 'ui-components', title: '@nyc-tron/ui/components (top level)', importPrefix: pkg + '/components' };
  if (parts[1] === 'forge' && parts.length === 3) return { id: 'ui-forge', title: '@nyc-tron/ui/components/forge (top level)', importPrefix: pkg + '/components/forge' };
  if (parts[1] === 'forge') return { id: 'ui-forge-' + parts[2], title: pkg + '/components/forge/' + parts[2], importPrefix: pkg + '/components/forge/' + parts[2] };
  return { id: 'ui-' + parts[1], title: pkg + '/components/' + parts[1], importPrefix: pkg + '/components/' + parts[1] };
}

function importStatement(symbol, importPath) {
  return symbol === 'default' ? `import Component from ${JSON.stringify(importPath)};` : `import { ${symbol} } from ${JSON.stringify(importPath)};`;
}

// A package-root (barrel) export points at the subpath that exports the same
// declaration, so agents never import the barrel when a subpath exists.
function preferredFor(c, ids) {
  if (!isRootImport(c.importPath)) return null;
  const candidates = c.aliases.filter(id => ids.has(id) && !isRootImport(pathOf(id)));
  const own = candidates.filter(id => pathOf(id).startsWith(c.package + '/'));
  return (own.length ? own : candidates).sort(compare)[0] ?? null;
}

function itemFor(c, preferredId, group) {
  if (!Array.isArray(c.documentation) || !c.documentation.length) fail('docs catalog entry has no documentation variant: ' + c.id);
  const documented = c.documentation[0];
  const rows = documented.props ?? [];
  const props = rows.filter(p => !isNativeSource(p.source))
    .map(p => ({ name: p.name, type: oneLine(p.type), required: !!p.required, ...(p.variant ? { variant: true } : {}), ...(oneLine(p.description ?? '') ? { description: oneLine(p.description) } : {}) }))
    .sort((a, b) => compare(a.name, b.name));
  const nativeRows = rows.filter(p => isNativeSource(p.source));
  const inherited = documented.inherited ?? [];
  const nativeFrom = [...new Set(inherited.filter(i => isNativeSource(i.source)).map(i => i.source.slice(i.source.lastIndexOf('#') + 1)))].sort(compare);
  const nativeSources = [...new Set(nativeRows.map(p => p.source))].sort(compare);
  const otherContracts = [...new Map(inherited.filter(i => !isNativeSource(i.source)).map(i => [oneLine(i.type) + '\0' + i.reason, { type: oneLine(i.type), reason: oneLine(i.reason) }])).values()]
    .sort((a, b) => compare(a.type + '\0' + a.reason, b.type + '\0' + b.reason));
  const platforms = {};
  for (const platform of PLATFORM_ORDER) {
    if (!c.platforms?.[platform]) fail('missing platform status ' + platform + ' for ' + c.id);
    platforms[platform] = c.platforms[platform].status;
  }
  const platformEvidence = [...new Set(PLATFORM_ORDER.flatMap(p => (c.platforms[p].measurements ?? []).map(m => m.evidence)))].sort(compare);
  return {
    name: c.slug, id: c.id, title: c.symbol, symbol: c.symbol, description: oneLine(c.description),
    package: c.package, importPath: c.importPath, import: importStatement(c.symbol, c.importPath),
    preferred: preferredId === null, preferredId, aliases: [...c.aliases].sort(compare),
    category: c.category, group: group.id, docs: GROUP_DIR + '/' + group.id + '.txt',
    stability: { label: c.stability, proposed: c.proposedStability, ownerConfirmation: c.ownerConfirmation, reason: oneLine(c.stabilityReason) },
    platforms, platformEvidence,
    props, propsFrom: documented.target,
    inheritedProps: { count: nativeRows.length, from: nativeFrom, sources: nativeSources },
    otherContracts,
    signatures: (documented.signatures ?? []).map(lf),
    example: { status: c.example.status, code: lf(c.example.code), limitations: (c.example.limitations ?? []).map(l => ({ prop: l.prop, type: oneLine(l.type), note: oneLine(l.note) })) },
    accessibility: (c.accessibility?.notes ?? []).map(oneLine),
    declarationIdentities: [...c.declarationIdentities].sort(compare),
  };
}

function guideFor(g) {
  return { slug: g.slug, title: g.title, description: oneLine(g.description),
    sections: g.sections.map(s => ({ title: s.title, paragraphs: (s.paragraphs ?? []).map(oneLine), ...(s.code ? { code: lf(s.code) } : {}), links: (s.links ?? []).map(l => ({ label: l.label, href: l.href })) })) };
}

const GROUP_ORDER = group => (group.categories.includes('general components') ? 0 : 1) + ':' + (group.id.startsWith('ui') ? 0 : 1) + ':' + group.id;

/** Build the registry object from the docs catalog, the guides and the inventory. Pure. */
export function buildRegistry({ docs, guides, inventory, inventoryText }) {
  if (!inventory || !Array.isArray(inventory.components)) fail('inventory has no components');
  if (!docs || !Array.isArray(docs.components)) fail('docs catalog has no components');
  const inventoryIds = inventory.components.map(c => c.id).sort(compare);
  const docsById = new Map(docs.components.map(c => [c.id, c]));
  if (docsById.size !== docs.components.length) fail('duplicate component ids in the docs catalog');
  if (JSON.stringify(inventoryIds) !== JSON.stringify([...docsById.keys()].sort(compare))) fail('docs catalog and ' + INVENTORY_PATH + ' list different components; rebuild them from the same inventory');
  const ids = new Set(inventoryIds), groups = new Map(), items = [];
  const preferred = new Map(inventoryIds.map(id => [id, preferredFor(docsById.get(id), ids)]));
  for (const id of inventoryIds) {
    const c = docsById.get(id), preferredId = preferred.get(id);
    const anchor = preferredId ? docsById.get(preferredId) : c;
    const group = groupFor(anchor.package, anchor.importPath);
    if (!groups.has(group.id)) groups.set(group.id, { ...group, categories: new Set(), items: [] });
    const entry = groups.get(group.id);
    entry.categories.add(c.category);
    entry.items.push(id);
    items.push(itemFor(c, preferredId, group));
  }
  if (new Set(items.map(i => i.name)).size !== items.length) fail('component slugs are not unique');
  const byId = new Map(items.map(i => [i.id, i]));
  const groupList = [...groups.values()].map(g => {
    const members = g.items.map(id => byId.get(id));
    return { id: g.id, title: g.title, importPrefix: g.importPrefix, categories: [...g.categories].sort(compare), docs: GROUP_DIR + '/' + g.id + '.txt',
      count: members.length, preferredCount: members.filter(i => i.preferred).length,
      symbols: [...new Set(members.filter(i => i.preferred).map(i => i.symbol))].sort(compare) };
  }).sort((a, b) => compare(GROUP_ORDER(a), GROUP_ORDER(b)));
  return {
    $schema: './schema.json', schemaVersion: 1, name: 'nyc-tron-ui', title: 'NYC-Tron UI', homepage: REPOSITORY,
    description: 'Index of every public NYC-Tron UI component export for coding agents: import path, props summary, minimal example, accessibility notes, proposed stability and recorded platform status.',
    distribution: { kind: 'package-imports', note: 'Install the release tarballs (README, "Installing from a release") and import each component from its own subpath. This index is not a copy-in source registry and no CLI installs from it.' },
    generatedBy: 'tooling/llms.mjs', skill: 'skills/nyc-tron-ui/SKILL.md',
    inputs: [{ path: INVENTORY_PATH, sha256: sourceFingerprint(inventoryText) }],
    ownerConfirmation: inventory.ownerConfirmation, status: inventory.status,
    platformPolicy: inventory.platformPolicy, evidenceRecords: inventory.evidenceRecords,
    summary: { componentCount: items.length, preferredImportCount: items.filter(i => i.preferred).length, groupCount: groupList.length,
      proposedStable: items.filter(i => i.stability.proposed === 'stable').length, proposedPreview: items.filter(i => i.stability.proposed === 'preview').length },
    guides: guides.map(guideFor), groups: groupList, items,
  };
}

export const REGISTRY_SCHEMA = (() => {
  const str = { type: 'string' }, strs = { type: 'array', items: str };
  const status = { type: 'string', enum: ['supported', 'struck', 'not verified'] };
  const object = (properties, required = Object.keys(properties)) => ({ type: 'object', additionalProperties: false, required, properties });
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: RAW_BASE + SCHEMA_PATH,
    title: 'NYC-Tron UI agent component registry',
    description: 'Generated by tooling/llms.mjs from docs/library/components.json and the documentation catalog. One item per public component export.',
    ...object({
      $schema: str, schemaVersion: { const: 1 }, name: str, title: str, homepage: str, description: str,
      distribution: object({ kind: { const: 'package-imports' }, note: str }),
      generatedBy: str, skill: str,
      inputs: { type: 'array', minItems: 1, items: object({ path: str, sha256: { type: 'string', pattern: '^[0-9a-f]{64}$' } }) },
      ownerConfirmation: { type: 'string', enum: ['pending', 'confirmed'] }, status: str,
      platformPolicy: { type: 'object' }, evidenceRecords: { type: 'object' },
      summary: object({ componentCount: { type: 'integer' }, preferredImportCount: { type: 'integer' }, groupCount: { type: 'integer' }, proposedStable: { type: 'integer' }, proposedPreview: { type: 'integer' } }),
      guides: { type: 'array', items: { $ref: '#/$defs/guide' } },
      groups: { type: 'array', minItems: 1, items: { $ref: '#/$defs/group' } },
      items: { type: 'array', minItems: 1, items: { $ref: '#/$defs/item' } },
    }),
    $defs: {
      guide: object({ slug: str, title: str, description: str, sections: { type: 'array', items: object({ title: str, paragraphs: strs, code: str, links: { type: 'array', items: object({ label: str, href: str }) } }, ['title', 'paragraphs', 'links']) } }),
      group: object({ id: str, title: str, importPrefix: str, categories: strs, docs: str, count: { type: 'integer' }, preferredCount: { type: 'integer' }, symbols: strs }),
      item: object({
        name: { type: 'string', description: 'Unique slug, shared with the documentation site route.' },
        id: { type: 'string', description: 'Inventory id: import path, #, exported symbol.' },
        title: str, symbol: str, description: str, package: str, importPath: str,
        import: { type: 'string', description: 'Exact import statement for this export.' },
        preferred: { type: 'boolean', description: 'False for a package-root (barrel) export that has a subpath alias; use preferredId instead.' },
        preferredId: { type: ['string', 'null'] }, aliases: strs,
        category: { type: 'string', enum: ['general components', 'professional controls'] },
        group: str, docs: str,
        stability: object({ label: { type: ['string', 'null'], enum: ['stable', 'preview', null] }, proposed: { type: 'string', enum: ['stable', 'preview'] }, ownerConfirmation: { type: 'string', enum: ['pending', 'confirmed'] }, reason: str }),
        platforms: object(Object.fromEntries(PLATFORM_ORDER.map(p => [p, status]))),
        platformEvidence: strs,
        props: { type: 'array', items: object({ name: str, type: str, required: { type: 'boolean' }, variant: { const: true }, description: str }, ['name', 'type', 'required']) },
        propsFrom: str,
        inheritedProps: object({ count: { type: 'integer' }, from: strs, sources: strs }),
        otherContracts: { type: 'array', items: object({ type: str, reason: str }) },
        signatures: strs,
        example: object({ status: str, code: str, limitations: { type: 'array', items: object({ prop: str, type: str, note: str }) } }),
        accessibility: strs, declarationIdentities: strs,
      }),
    },
  };
})();

const raw = path => RAW_BASE + path;
const code = value => '`' + value + '`';
const join2 = (lines) => lines.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '') + '\n';

function stabilityText(s) {
  if (s.label) return s.label + ' (owner-confirmed)';
  return 'proposed ' + s.proposed + '; owner confirmation ' + s.ownerConfirmation + ', no label approved';
}

function platformText(platforms) {
  const by = new Map();
  for (const p of PLATFORM_ORDER) { if (!by.has(platforms[p])) by.set(platforms[p], []); by.get(platforms[p]).push(p); }
  const label = { supported: 'supported (recorded measurement)', struck: 'struck (the lane measurement failed it)', 'not verified': 'not verified' };
  return ['supported', 'struck', 'not verified'].filter(s => by.has(s)).map(s => label[s] + ': ' + by.get(s).join(', ')).join('; ');
}

function itemSection(item, alsoExported) {
  const lines = ['## ' + item.symbol + ' (' + item.importPath + ')', '', '```tsx', item.import, '```', '',
    '- Id: ' + code(item.id),
    '- Package: ' + code(item.package) + '; category: ' + item.category,
    '- Stability: ' + stabilityText(item.stability),
    '- Platforms: ' + platformText(item.platforms) + (item.platformEvidence.length ? ' (desktop measurements: ' + item.platformEvidence.join(', ') + ')' : '')];
  if (alsoExported.length) lines.push('- Also exported as: ' + alsoExported.map(a => code(a.id) + (a.barrel ? ' (package root barrel; use the subpath import above)' : '')).join(', '));
  lines.push('', 'Props:');
  if (!item.props.length && !item.inheritedProps.count && !item.otherContracts.length) lines.push('- None declared; see the declaration signature.');
  for (const p of item.props) lines.push('- ' + code(p.name + (p.required ? '' : '?') + ': ' + p.type) + (p.required ? ' (required)' : '') + (p.variant ? ' (one variant of a union)' : '') + (p.description ? ': ' + p.description : ''));
  if (item.inheritedProps.count) lines.push('- Inherits ' + item.inheritedProps.count + ' React Native props' + (item.inheritedProps.from.length ? ' from ' + item.inheritedProps.from.join(', ') : '') + ' (' + item.inheritedProps.sources.map(s => s.replace(/ declarations$/, '')).join(', ') + ' declarations).');
  for (const o of item.otherContracts) lines.push('- Also accepts ' + code(o.type) + ' (' + o.reason + ').');
  lines.push('', 'Example (' + item.example.status + '):', '', '```tsx', item.example.code.replace(/\n$/, ''), '```');
  if (item.example.limitations.length) {
    lines.push('', 'Replace these example values with app data:');
    for (const l of item.example.limitations) lines.push('- ' + code(l.prop) + ' (' + code(l.type) + '): ' + l.note);
  }
  lines.push('', 'Accessibility:');
  for (const note of item.accessibility) lines.push('- ' + note);
  return lines;
}

const GENERATED = 'Generated by tooling/llms.mjs from docs/library/components.json and the documentation catalog. Do not edit by hand.';

function groupText(registry, group) {
  const members = registry.items.filter(i => i.group === group.id);
  const preferred = members.filter(i => i.preferred);
  const lines = ['# ' + group.title, '',
    '> ' + group.count + ' public component export' + (group.count === 1 ? '' : 's') + ' (' + preferred.length + ' import path' + (preferred.length === 1 ? '' : 's') + ' to use) from ' + code(group.importPrefix) + '. Category: ' + group.categories.join(', ') + '. ' + GENERATED, '',
    'Import each component from the path shown in its section. Stability labels are proposals until the owner confirms them; platform statuses repeat the inventory and are not device test results.', ''];
  for (const item of preferred) {
    const barrels = members.filter(i => i.preferredId === item.id).map(i => i.id);
    const alsoExported = [...new Set([...item.aliases, ...barrels])].sort(compare).map(id => ({ id, barrel: isRootImport(pathOf(id)) }));
    lines.push(...itemSection(item, alsoExported), '');
  }
  return join2(lines);
}

function guideHref(href) {
  const internal = /^\/guides\/([^/]+)\/$/.exec(href);
  if (internal) return 'the "' + internal[1] + '" guide in ' + GROUP_DIR + '/guides.txt';
  if (href === '/components/') return 'the component index in llms.txt';
  return href;
}

function guidesText(registry) {
  const lines = ['# NYC-Tron UI guides', '', '> The documentation site guides as plain text: ' + registry.guides.map(g => g.title).join(', ') + '. ' + GENERATED, ''];
  for (const g of registry.guides) {
    lines.push('## ' + g.title + ' (' + g.slug + ')', '', g.description, '');
    for (const s of g.sections) {
      lines.push('### ' + s.title, '');
      for (const p of s.paragraphs) lines.push(p, '');
      if (s.code) lines.push('```', s.code.replace(/\n$/, ''), '```', '');
      for (const l of s.links) lines.push('- ' + l.label + ': ' + guideHref(l.href));
      lines.push('');
    }
  }
  return join2(lines);
}

const SUMMARY = registry => 'Independent, themeable UI library for React Native 0.88 and Expo SDK 58 (iOS, Android and web, plus isolated Windows and macOS adapters). ' +
  registry.summary.componentCount + ' public component exports in ' + registry.groups.length + ' groups, each imported from its own package subpath. The consuming app owns theme tokens and state. Packages ship as GitHub Release tarballs, not npm. ' + (registry.ownerConfirmation === 'confirmed' ? 'Stability labels follow the owner-confirmed manifest' : 'Stability labels are proposals awaiting owner confirmation') + '; platform statuses are recorded measurements, not device sign-off.';

const RULES = [
  'Rules for agents writing app code with this library:',
  '',
  '- Import every component from its subpath, for example `import { Button } from "@nyc-tron/ui/components/Button";`. Never import from a package root barrel such as `@nyc-tron/ui` when a subpath exists.',
  '- Style with the app\'s semantic tokens (`bg-primary`, `text-text`, `border-border`, `rounded-control`); never hardcode colors. The app defines the variables listed in docs/THEME_TOKENS.md for light and dark.',
  '- Keep app state in Zustand stores and pass it in through props; resources stay in refs.',
  '- Use the library components and React Native primitives; do not write raw HTML UI.',
  '- Keep every accessible name, focus order, text scaling and reduced-motion behavior; follow each component\'s accessibility notes.',
  '- Report a platform as supported only where the entry says so. "not verified" means no recorded measurement.',
];

function fullText(registry, groupFiles) {
  const lines = ['# NYC-Tron UI: full component reference', '', '> ' + SUMMARY(registry) + ' ' + GENERATED, '', ...RULES, '',
    'Platform policy from the inventory:', ''];
  for (const [tier, policy] of Object.entries(registry.platformPolicy)) lines.push('- ' + tier + ' (' + policy.platforms.join(', ') + '): ' + oneLine(policy.note));
  for (const [name, record] of Object.entries(registry.evidenceRecords ?? {})) {
    const details = [record.archive?.archive && 'archive ' + record.archive.archive, record.provenance?.measured && 'measured ' + record.provenance.measured].filter(Boolean);
    lines.push('- Evidence record ' + name + ': ' + record.path + (details.length ? ' (' + details.join(', ') + ')' : '') + '. A "supported" or "struck" desktop status cites this record.');
  }
  lines.push('', 'Each component section lists its import, inventory id, stability proposal, platform statuses, props, a minimal example and accessibility notes. Sections are grouped by import path; package-root barrel exports are listed under the subpath that exports the same declaration.', '');
  return join2([...lines, guidesText(registry), ...registry.groups.map(g => groupFiles[GROUP_DIR + '/' + g.id + '.txt'])]);
}

function indexText(registry, fullSize) {
  const group = g => {
    const shown = g.symbols.slice(0, 10).join(', ') + (g.symbols.length > 10 ? ', and ' + (g.symbols.length - 10) + ' more' : '');
    return '- [' + g.title + '](' + raw(g.docs) + '): ' + g.count + ' export' + (g.count === 1 ? '' : 's') + ': ' + shown;
  };
  const general = registry.groups.filter(g => g.categories.includes('general components'));
  const professional = registry.groups.filter(g => !g.categories.includes('general components'));
  const lines = ['# NYC-Tron UI', '', '> ' + SUMMARY(registry), '', ...RULES, '',
    'All files below are generated by tooling/llms.mjs from docs/library/components.json and the documentation catalog; links point at the main branch, and the same paths exist in a checkout.', '',
    '## Start here', '',
    '- [Agent skill](' + raw('skills/nyc-tron-ui/SKILL.md') + '): when to use the library, imports, theming, accessibility and what not to do',
    '- [Component registry](' + raw(REGISTRY_PATH) + '): machine-readable index; one item per export with import, props, example, accessibility notes, stability and platforms',
    '- [Registry schema](' + raw(SCHEMA_PATH) + '): JSON Schema for the registry',
    '- [Guides](' + raw(GROUP_DIR + '/guides.txt') + '): ' + registry.guides.map(g => g.title.toLowerCase()).join(', '),
    '- [Full reference](' + raw('llms-full.txt') + '): every component and guide in one file (about ' + Math.round(fullSize / 1024) + ' KB); prefer one group file below',
    '', '## General components', '', ...general.map(group),
    ...(professional.length ? ['', '## Other components', '', ...professional.map(group)] : []),
    '', '## Optional', '',
    '- [Theme tokens](' + raw('docs/THEME_TOKENS.md') + '): semantic variables the app must define, with reference light and dark values',
    '- [Support policy](' + raw('docs/SUPPORT.md') + '): runtime lanes, peers and the desktop support lists',
    '- [Library inventory](' + raw('docs/library/README.md') + '): how the component inventory and stability proposals are generated',
    '- [Native feel and adaptive content](' + raw('docs/EXACT_NATIVE_FEEL.md') + '): presentation and responsive composition rules',
    '- [README](' + raw('README.md') + '): install from a release, packages and peers'];
  return join2(lines);
}

/** Every output file, keyed by repository-relative path. Pure. */
export function filesFromRegistry(registry) {
  const files = {};
  for (const g of registry.groups) files[GROUP_DIR + '/' + g.id + '.txt'] = groupText(registry, g);
  files[GROUP_DIR + '/guides.txt'] = guidesText(registry);
  files['llms-full.txt'] = fullText(registry, files);
  files['llms.txt'] = indexText(registry, Buffer.byteLength(files['llms-full.txt']));
  files[REGISTRY_PATH] = JSON.stringify(registry, null, 2) + '\n';
  files[SCHEMA_PATH] = JSON.stringify(REGISTRY_SCHEMA, null, 2) + '\n';
  return Object.fromEntries(Object.entries(files).sort(([a], [b]) => compare(a, b)));
}

export function generateFiles(sources) { return filesFromRegistry(buildRegistry(sources)); }

/** Load the inventory, docs catalog and guides from a checkout. Needs the docs tooling install. */
export async function loadSources(rootDir = root) {
  let docsModule, guidesModule;
  try {
    docsModule = await import(pathToFileURL(join(rootDir, 'tooling/library-docs.mjs')).href);
    guidesModule = await import(pathToFileURL(join(rootDir, 'website/guides.mjs')).href);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' || error.code === 'ERR_MODULE_NOT_FOUND') fail('the docs catalog needs the documentation tooling install; run `npm --prefix website ci --ignore-scripts` (' + error.message.split('\n')[0] + ')');
    throw error;
  }
  const inventoryText = readFileSync(join(rootDir, INVENTORY_PATH));
  const docs = docsModule.generateDocs();
  return { docs, guides: guidesModule.resolveGuides(docs.ownerConfirmation), inventory: JSON.parse(inventoryText), inventoryText };
}

export async function generateFromRepository(rootDir = root) { return generateFiles(await loadSources(rootDir)); }

/** Compare expected files with a directory. Returns a list of problems; empty means current. */
export function checkOutputs(outDir, files) {
  const problems = [];
  for (const [path, content] of Object.entries(files)) {
    const file = join(outDir, path);
    if (!existsSync(file)) problems.push('missing ' + path);
    else if (lf(readFileSync(file, 'utf8')) !== content) problems.push('stale ' + path);
  }
  for (const path of unexpectedFiles(outDir, files)) problems.push('unexpected ' + path);
  return problems;
}

function unexpectedFiles(outDir, files) {
  const dir = join(outDir, GROUP_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).map(name => GROUP_DIR + '/' + name).filter(path => !Object.hasOwn(files, path)).sort(compare);
}

export function writeOutputs(outDir, files) {
  for (const path of unexpectedFiles(outDir, files)) rmSync(join(outDir, path), { recursive: true, force: true });
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(outDir, path)), { recursive: true });
    writeFileSync(join(outDir, path), content);
  }
}

export async function main(argv, { generate = () => generateFromRepository(root), rootDir = root, log = console.log, error = console.error } = {}) {
  let mode = 'check', outDir = rootDir;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--check') mode = 'check';
    else if (argv[i] === '--write') mode = 'write';
    else if (argv[i] === '--out' && argv[i + 1] && !argv[i + 1].startsWith('--')) outDir = resolve(argv[++i]);
    else { error('usage: node tooling/llms.mjs [--check | --write] [--out <dir>]'); return 2; }
  }
  const files = await generate();
  const registry = JSON.parse(files[REGISTRY_PATH]);
  if (mode === 'write') writeOutputs(outDir, files);
  else {
    const problems = checkOutputs(outDir, files);
    if (problems.length) {
      error('llms: generated agent files differ from the committed copies; run node tooling/llms.mjs --write and review the diff.\n' + problems.map(p => '  ' + p).join('\n'));
      return 1;
    }
  }
  log(`LLM files: ${registry.summary.componentCount} component exports (${registry.summary.preferredImportCount} preferred imports) in ${registry.summary.groupCount} groups; ${Object.keys(files).length} files ${mode === 'write' ? 'written' : 'current'}; owner confirmation ${registry.ownerConfirmation}.`);
  return 0;
}

if (isMainModule(import.meta.url)) process.exitCode = await main(process.argv.slice(2));
