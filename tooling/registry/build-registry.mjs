#!/usr/bin/env node
// Builds registry.json, r/*.json, registry-excluded.json and components.json for the
// @nyc-tron shadcn registry. Deterministic: same tree in, same bytes out. No timestamps.
//
//   node tooling/registry/build-registry.mjs              generate everything, run shadcn build
//   node tooling/registry/build-registry.mjs --no-build   stop after registry.json and the stage dir
//
// Inputs: docs/api-signatures.json (subpaths and exported names), docs/agent-native/copy.json,
// tier2-copy.json, tier1.json, a11y-status.json, 03-design-handoff.md (tier 1 categories),
// packages/*/package.json (peer ranges, core exports), packages/{ui,core}/src (the source).
//
// Decision 39: the repo source keeps its `@nyc-tron/*` and relative imports. Only the content
// written to the stage dir, and from there into r/*.json, is rewritten to the consumer's
// aliases, which `shadcn add` then maps to the aliases in the consumer's components.json.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { scan, rewriteSpecifiers } from "./scan-imports.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const cfg = JSON.parse(fs.readFileSync(path.join(here, "config.json"), "utf8"));
const args = new Set(process.argv.slice(2));

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const posix = (p) => p.split(path.sep).join("/");
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sortedKeys = (o) => Object.keys(o).sort(cmp);
const writeText = (p, text) => {
  fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
  fs.writeFileSync(path.join(root, p), text);
};
const writeJson = (p, v) => writeText(p, JSON.stringify(v, null, 2) + "\n");

// ---------------------------------------------------------------------------------------
// Source tree (working tree, not git: other agents add files before they commit them)

const SRC_EXT = /\.(ts|tsx)$/;
function walk(dir, out = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => cmp(a.name, b.name))) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== "dist") walk(rel, out);
    } else if (SRC_EXT.test(e.name) && !e.name.endsWith(".d.ts")) out.push(rel);
  }
  return out;
}
const PACKAGES = {
  ui: { name: "@nyc-tron/ui", dir: "packages/ui" },
  core: { name: "@nyc-tron/core", dir: "packages/core" },
};
const sourceFiles = new Set([...walk("packages/ui/src"), ...walk("packages/core/src")]);
const pkgJson = Object.fromEntries(Object.entries(PACKAGES).map(([k, v]) => [k, readJson(`${v.dir}/package.json`)]));
const text = (file) => fs.readFileSync(path.join(root, file), "utf8");

// ---------------------------------------------------------------------------------------
// Metadata inputs

const sig = readJson("docs/api-signatures.json");
const tier1 = readJson("docs/agent-native/tier1.json");
const copy1 = readJson("docs/agent-native/copy.json");
const copy2 = readJson("docs/agent-native/tier2-copy.json");
const a11y = readJson("docs/agent-native/a11y-status.json");
const copyById = new Map();
for (const c of copy1.items) copyById.set(c.id, c);
for (const c of copy2) copyById.set(c.id, c);
const tier1BySubpath = new Map(tier1.items.map((i) => [i.subpath, i]));

// Tier 1 category by hand, from the index table of the design handoff.
const tier1Category = new Map();
for (const line of fs.readFileSync(path.join(root, cfg.tier1Categories), "utf8").split("\n")) {
  const m = /^\| ([A-Za-z0-9-]+) \| `@nyc-tron\/ui[^`]*` \| [^|]* \| [^|]* \| ([a-z]+) \| \d+ \|$/.exec(line);
  if (m) tier1Category.set(m[1], m[2]);
}

const A11Y_MAP = { PASS: "reviewed-pass", FAIL: "reviewed-fail", UNVERIFIED: "unverified" };
const DIR_CATEGORY = [
  ["forge/", "forge"],
  ["shell/", "shell"],
  ["layout/", "layout"],
  ["overlays/", "overlay"],
  ["feedback/", "feedback"],
  ["data/", "data"],
  ["navigation/", "navigation"],
];
const tier2Category = (id) => (DIR_CATEGORY.find(([p]) => id.startsWith(p)) || [null, "primitive"])[1];

// ---------------------------------------------------------------------------------------
// Subpath -> source files

const stem = (f) => f.replace(SRC_EXT, "");
const rel = (file, pkg) => file.slice(`${PACKAGES[pkg].dir}/src/`.length);

function srcForTarget(pkg, target) {
  const base = `${PACKAGES[pkg].dir}/src/` + target.replace(/^\.\/dist\//, "").replace(/\.(d\.ts|js)$/, "");
  return [`${base}.ts`, `${base}.tsx`].find((f) => sourceFiles.has(f)) || null;
}

function exportedSubpaths(pkg) {
  const entries = new Map(); // key -> {files:Set, conditions}
  const sigPkg = sig.packages[PACKAGES[pkg].name] || {};
  const exportsField = pkgJson[pkg].exports || {};
  const keys = new Set([...Object.keys(sigPkg), ...Object.keys(exportsField)]);
  for (const key of [...keys].sort(cmp)) {
    const conditions = (sigPkg[key] && sigPkg[key][0] && sigPkg[key][0].conditions) || exportsField[key] || {};
    const files = new Set();
    for (const [c, t] of Object.entries(conditions)) {
      if (c === "types" || typeof t !== "string") continue;
      const f = srcForTarget(pkg, t);
      if (f) files.add(f);
    }
    const symbols = sigPkg[key] && sigPkg[key][0] ? Object.keys(sigPkg[key][0].symbols || {}) : [];
    entries.set(key, { files: [...files].sort(cmp), conditions, symbols, inSignatures: Boolean(sigPkg[key]) });
  }
  return entries;
}
const uiExports = exportedSubpaths("ui");
const coreExports = exportedSubpaths("core");

const itemNameForUi = (key) => (key === "." ? "root" : key.replace(/^\.\/components\//, ""));
const copyIdForUi = (key) => (key === "." ? "." : key.replace(/^\.\/components\//, ""));
const itemNameForCore = (key) => (key === "./tokens" ? "tokens" : `core/${key.replace(/^\.\//, "")}`);

// owners: repo file -> {pkg, key, name}
const ownerOfFile = new Map();
const itemByKey = { ui: new Map(), core: new Map() };
for (const [key, e] of uiExports) {
  if (key !== "." && !key.startsWith("./components/")) throw new Error(`unexpected ui subpath ${key}`);
  const name = itemNameForUi(key);
  itemByKey.ui.set(key, { name, pkg: "ui", key, ...e });
  for (const f of e.files) {
    if (ownerOfFile.has(f)) throw new Error(`${f} is exported twice: ${ownerOfFile.get(f).key} and ${key}`);
    ownerOfFile.set(f, { pkg: "ui", key, name });
  }
}
// A core module that is not in package.json `exports` yet (packages/core/src/tokens.ts before its
// `./tokens` subpath lands) still installs by file. Repo source that imports it fails its own
// build until the export exists; that is a different gate from this one.
const exportNames = (file) => [...new Set([...text(file).matchAll(/^export\s+(?:declare\s+)?(?:const|let|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]))].sort(cmp);
for (const f of [...sourceFiles].sort(cmp)) {
  if (!f.startsWith("packages/core/src/") || /\/index\.tsx?$/.test(f)) continue;
  const key = `./${stem(rel(f, "core"))}`;
  if (coreExports.has(key)) continue;
  if ([...coreExports.values()].some((e) => e.files.includes(f))) continue;
  coreExports.set(key, { files: [f], conditions: {}, symbols: exportNames(f), inSignatures: false });
}
for (const [key, e] of coreExports) {
  if (key === ".") continue; // the core barrel re-exports everything; it is not installable on its own here
  const name = itemNameForCore(key);
  itemByKey.core.set(key, { name, pkg: "core", key, ...e });
  for (const f of e.files) ownerOfFile.set(f, { pkg: "core", key, name });
}

// ---------------------------------------------------------------------------------------
// Import resolution

function resolveRelative(from, spec) {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
  const tries = SRC_EXT.test(base)
    ? [base]
    : /\.js$/.test(base)
      ? [base.replace(/\.js$/, ".ts"), base.replace(/\.js$/, ".tsx")]
      : [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];
  return tries.find((f) => sourceFiles.has(f)) || null;
}

const peerRange = (pkg, name) => {
  const j = pkgJson[pkg];
  return (j.peerDependencies && j.peerDependencies[name]) || (j.dependencies && j.dependencies[name]) || null;
};
const packageOf = (spec) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);

// Where an installed file lands, and how other installed files import it.
const targetOf = (file, pkg) => `${cfg.targets[pkg]}/${rel(file, pkg)}`;
const importPathOf = (file, pkg) => `${cfg.imports[pkg]}/${stem(rel(file, pkg))}`;

// One walk over the files an item needs. Files that are not exported subpaths are bundled
// into the item and walked too; imports of other exported subpaths become registryDependencies.
function analyse(item) {
  const files = new Set(item.files);
  const queue = [...item.files];
  const registryDeps = new Set();
  const deps = new Map(); // npm name -> range|null
  const peers = new Set();
  const unresolved = [];
  const mapping = new Map(); // `${file}\0${spec}` -> replacement
  const note = (file, spec, reason) => unresolved.push({ file, specifier: spec, reason });

  while (queue.length) {
    const file = queue.shift();
    for (const d of scan(text(file))) {
      const spec = d.spec;
      const key = `${file}\0${spec}`;
      if (spec.startsWith(".")) {
        const target = resolveRelative(file, spec);
        if (!target) { note(file, spec, "relative import does not resolve to a source file"); continue; }
        const owner = ownerOfFile.get(target);
        const targetPkg = owner ? owner.pkg : target.startsWith("packages/core/") ? "core" : "ui";
        mapping.set(key, importPathOf(target, targetPkg));
        if (owner && owner.name !== item.name) registryDeps.add(owner.name);
        else if (!files.has(target)) { files.add(target); queue.push(target); }
        continue;
      }
      if (spec === "@nyc-tron/ui" || spec.startsWith("@nyc-tron/ui/") || spec === "@nyc-tron/core" || spec.startsWith("@nyc-tron/core/")) {
        const pkg = spec.startsWith("@nyc-tron/ui") ? "ui" : "core";
        const sub = spec.slice(PACKAGES[pkg].name.length);
        const subKey = sub === "" ? "." : `.${sub}`;
        const target = itemByKey[pkg].get(subKey);
        if (!target) { note(file, spec, `${PACKAGES[pkg].name}${sub} is not an exported subpath installable by this registry`); continue; }
        if (target.name !== item.name) registryDeps.add(target.name);
        mapping.set(key, pkg === "ui" ? `${cfg.imports.ui}/${subKey === "." ? "index" : subKey.slice(2)}` : `${cfg.imports.core}/${subKey.slice(2)}`);
        continue;
      }
      if (spec.startsWith("@nyc-tron/")) { note(file, spec, "another @nyc-tron package; not part of this registry"); continue; }
      const name = packageOf(spec);
      if (cfg.allowlist.includes(name)) { peers.add(name); continue; }
      const owningPkg = file.startsWith("packages/core/") ? "core" : "ui";
      const range = peerRange(owningPkg, name);
      if (range === null) { note(file, spec, `package ${name} is not declared in ${PACKAGES[owningPkg].dir}/package.json`); continue; }
      deps.set(name, range);
    }
  }
  return { files: [...files].sort(cmp), registryDeps, deps, peers, unresolved, mapping };
}

// ---------------------------------------------------------------------------------------
// Platforms (doc-template.md): Platform.OS branches, .native/.web siblings, export conditions.

const PLATFORM_ORDER = ["ios", "android", "web", "windows", "macos", "qnx"];
function platformsOf(item, files) {
  const found = new Set();
  const own = item.files;
  if (item.conditions && item.conditions.browser) found.add("web");
  if (item.conditions && item.conditions.qnx) found.add("qnx");
  const distinct = new Set(Object.entries(item.conditions || {}).filter(([c]) => c !== "types").map(([, t]) => t));
  if (item.conditions && item.conditions["react-native"] && distinct.size > 1 && item.conditions["react-native"] !== item.conditions.default) {
    found.add("ios");
    found.add("android");
  }
  for (const f of files) {
    if (/\.native\.tsx?$/.test(f)) { found.add("ios"); found.add("android"); }
    if (/\.web\.tsx?$/.test(f)) found.add("web");
  }
  for (const f of own) {
    const src = text(f);
    for (const m of src.matchAll(/Platform\.OS\s*[!=]==?\s*["'](ios|android|web|windows|macos)["']/g)) found.add(m[1]);
    for (const m of src.matchAll(/Platform\.select\(\s*\{([^}]*)\}/g)) {
      for (const k of m[1].matchAll(/\b(ios|android|web|windows|macos)\s*:/g)) found.add(k[1]);
    }
  }
  return PLATFORM_ORDER.filter((p) => found.has(p));
}

// ---------------------------------------------------------------------------------------
// Items

const splitName = (n) => n.replace(/[-_/]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
const warnings = [];
const fileType = (f) => (f.endsWith(".tsx") ? "registry:ui" : "registry:lib");

function buildItem(item) {
  const a = analyse(item);
  const out = { item, analysis: a };
  return out;
}

const analysed = new Map(); // name -> {item, analysis}
for (const item of itemByKey.ui.values()) analysed.set(item.name, buildItem(item));
for (const item of itemByKey.core.values()) analysed.set(item.name, buildItem(item));

// Exclusions: native packages, unresolved imports, then everything that depends on an excluded item.
const excluded = new Map(); // name -> {reason, kind, detail}
for (const [name, { analysis }] of analysed) {
  if (analysis.unresolved.length) {
    excluded.set(name, {
      kind: "unresolved-import",
      reason: `${analysis.unresolved.length} import(s) cannot be installed by a registry add`,
      unresolved: analysis.unresolved.map((u) => ({ file: u.file, specifier: u.specifier, reason: u.reason })),
    });
  }
}
for (let changed = true; changed; ) {
  changed = false;
  for (const [name, { analysis }] of analysed) {
    if (excluded.has(name)) continue;
    const bad = [...analysis.registryDeps].filter((d) => excluded.has(d)).sort(cmp);
    if (bad.length) {
      excluded.set(name, { kind: "depends-on-excluded", reason: `registryDependencies include excluded item(s): ${bad.join(", ")}`, dependsOn: bad });
      changed = true;
    }
  }
}

// Support items (core modules) are emitted only when an included item needs them.
const included = new Set();
const need = [];
for (const [name, { item }] of analysed) if (item.pkg === "ui" && !excluded.has(name)) need.push(name);
while (need.length) {
  const n = need.pop();
  if (included.has(n)) continue;
  included.add(n);
  for (const d of analysed.get(n).analysis.registryDeps) need.push(d);
}

function describeCore(item) {
  if (cfg.supportDescriptions[item.name]) return cfg.supportDescriptions[item.name];
  const head = "Pure TypeScript module from @nyc-tron/core, no React.";
  let out = head;
  const names = item.symbols.filter((s) => /^[A-Za-z_]/.test(s));
  for (const n of names) {
    const next = `${out === head ? `${head} Exports ` : `${out}, `}${n}`;
    if (next.length > 139) break;
    out = next;
  }
  return out === head ? head : `${out}.`;
}

const registryItems = [];
const stageFiles = new Map(); // repo path -> rewritten text
const itemRecords = [];
for (const name of [...included].sort(cmp)) {
  const { item, analysis } = analysed.get(name);
  const isUi = item.pkg === "ui";
  const c = isUi ? copyById.get(copyIdForUi(item.key)) : null;
  if (isUi && !c) warnings.push(`no copy for ${name}; using a generated fallback`);
  const title = isUi ? (c ? c.title : splitName(name)) : name === "tokens" ? "Design tokens" : `Core ${item.key.replace(/^\.\//, "")}`;
  const description = isUi ? (c ? c.description : `${splitName(name)}. Exports ${item.symbols.slice(0, 4).join(", ")}.`) : describeCore(item);
  if (description.length > 140) warnings.push(`description of ${name} is ${description.length} characters`);

  const files = analysis.files.map((f) => {
    const pkg = f.startsWith("packages/core/") ? "core" : "ui";
    const rewritten = rewriteSpecifiers(text(f), (spec) => analysis.mapping.get(`${f}\0${spec}`) ?? null);
    if (stageFiles.has(f) && stageFiles.get(f) !== rewritten) throw new Error(`${f} rewrites differently in two items`);
    stageFiles.set(f, rewritten);
    return { path: `${cfg.stageDir}/${f}`, type: fileType(f), target: targetOf(f, pkg), repoPath: f };
  });

  const deps = [...analysis.deps].sort((x, y) => cmp(x[0], y[0])).map(([n, r]) => (r ? `${n}@${r}` : n));
  const optional = [...analysis.deps.keys()].filter((n) => {
    const m = pkgJson.ui.peerDependenciesMeta && pkgJson.ui.peerDependenciesMeta[n];
    return Boolean(m && m.optional);
  }).sort(cmp);
  const peers = {};
  for (const n of [...analysis.peers].sort(cmp)) peers[n] = peerRange("ui", n);

  const meta = {};
  if (isUi) {
    const t1 = tier1BySubpath.get(item.key);
    const isTier1 = Boolean(t1);
    meta.tier = isTier1 ? 1 : 2;
    meta.docs = isTier1 ? "handwritten" : "generated";
    meta.platforms = platformsOf(item, analysis.files);
    meta.a11yStatus = isTier1 ? A11Y_MAP[(a11y[t1.name] || {}).status] || "unverified" : "unverified";
    meta.package = PACKAGES.ui.name;
    meta.subpath = item.key === "." ? PACKAGES.ui.name : `${PACKAGES.ui.name}/${item.key.slice(2)}`;
    meta.exports = [...item.symbols];
  } else {
    meta.support = true;
    meta.platforms = platformsOf(item, analysis.files);
    meta.package = PACKAGES.core.name;
    meta.subpath = `${PACKAGES.core.name}/${item.key.slice(2)}`;
    meta.exports = [...item.symbols];
  }
  if (Object.keys(peers).length) meta.peers = peers;
  if (optional.length) meta.optionalPeers = optional;
  if (deps.some((d) => cfg.nativeNpmPackages.includes(d.replace(/(?<!^)@.*/, "")))) meta.requiresNativeRebuild = true;

  const categories = isUi
    ? [tier1BySubpath.has(item.key) ? tier1Category.get(tier1BySubpath.get(item.key).name) || tier2Category(copyIdForUi(item.key)) : tier2Category(copyIdForUi(item.key))]
    : ["core"];

  const reg = {
    name,
    type: item.files.some((f) => f.endsWith(".tsx")) ? "registry:ui" : "registry:lib",
    title,
    description,
    categories,
  };
  if (deps.length) reg.dependencies = deps;
  if (analysis.registryDeps.size) reg.registryDependencies = [...analysis.registryDeps].sort(cmp).map((d) => `${cfg.namespace}/${d}`);
  reg.files = files.map(({ path: p, type, target }) => ({ path: p, type, target }));
  reg.meta = meta;
  registryItems.push(reg);
  itemRecords.push({ name, repoFiles: files.map((f) => f.repoPath) });
}

registryItems.sort((a, b) => cmp(a.name, b.name));

// ---------------------------------------------------------------------------------------
// Excluded: native packages (no install path through a file copy) and unresolved ui items.

const NATIVE_EXT = [
  [/\.swift$/, "Swift"], [/\.(mm|m)$/, "Objective-C"], [/\.kt$/, "Kotlin"], [/\.java$/, "Java"],
  [/\.(cpp|cc|h|hpp)$/, "C++"], [/\.cs$/, "C#"], [/\.xaml$/, "XAML"], [/\.podspec$/, "CocoaPods"],
  [/(^|\/)build\.gradle$/, "Gradle"], [/(^|\/)CMakeLists\.txt$/, "CMake"], [/(^|\/)Package\.swift$/, "Swift"],
];
function nativeKinds(dir) {
  const counts = new Map();
  const visit = (d) => {
    for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === "dist" || e.name === "build" || e.name === ".gradle") continue;
      const p = `${d}/${e.name}`;
      if (e.isDirectory() && d !== dir && fs.existsSync(path.join(root, p, "package.json"))) continue; // a nested package is listed on its own
      if (e.isDirectory()) visit(p);
      else for (const [re, kind] of NATIVE_EXT) if (re.test(e.name)) { counts.set(kind, (counts.get(kind) || 0) + 1); break; }
    }
  };
  visit(dir);
  return counts;
}
function packageDirs() {
  const dirs = [];
  for (const e of fs.readdirSync(path.join(root, "packages"), { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const d = `packages/${e.name}`;
    if (fs.existsSync(path.join(root, d, "package.json"))) dirs.push(d);
    for (const s of fs.readdirSync(path.join(root, d), { withFileTypes: true })) {
      if (s.isDirectory() && s.name !== "node_modules" && fs.existsSync(path.join(root, d, s.name, "package.json"))) dirs.push(`${d}/${s.name}`);
    }
  }
  return dirs.sort(cmp);
}

const excludedEntries = [];
for (const dir of packageDirs()) {
  const pj = readJson(`${dir}/package.json`);
  const kinds = nativeKinds(dir);
  if (!kinds.size) continue;
  const sigPkg = sig.packages[pj.name] || null;
  const subpaths = sigPkg ? Object.keys(sigPkg) : Object.keys(pj.exports || {});
  const kindList = [...kinds.entries()].sort((a, b) => cmp(a[0], b[0])).map(([k, n]) => `${k} ${n}`);
  for (const sp of subpaths.sort(cmp)) {
    const symbols = sigPkg && sigPkg[sp] && sigPkg[sp][0] ? Object.keys(sigPkg[sp][0].symbols || {}) : [];
    const shown = symbols.slice(0, 8).join(", ");
    excludedEntries.push({
      kind: "native",
      package: pj.name,
      subpath: sp === "." ? pj.name : `${pj.name}/${sp.slice(2)}`,
      nativeFiles: kindList,
      reason: "The package ships native code. A registry add copies files; it cannot run pod install, gradle, CMake, nitrogen or a WinUI build.",
      install: `Install ${pj.name} from the release tarball (README, Installing from a release), then rebuild the native app.`,
      exports: symbols,
      description: `JS-side entry of ${pj.name}${shown ? `, exports ${shown}${symbols.length > 8 ? ` and ${symbols.length - 8} more` : ""}` : ""}. Backed by native code (${kindList.join(", ")}).`,
    });
  }
}
for (const [name, e] of [...excluded].sort((a, b) => cmp(a[0], b[0]))) {
  const { item } = analysed.get(name);
  excludedEntries.push({
    kind: e.kind,
    package: PACKAGES[item.pkg].name,
    subpath: item.key === "." ? PACKAGES[item.pkg].name : `${PACKAGES[item.pkg].name}/${item.key.slice(2)}`,
    item: name,
    reason: e.reason,
    ...(e.unresolved ? { unresolved: e.unresolved } : {}),
    ...(e.dependsOn ? { dependsOn: e.dependsOn } : {}),
    exports: item.symbols,
    description: `${(copyById.get(copyIdForUi(item.key)) || {}).description || item.symbols.slice(0, 6).join(", ")}`,
  });
}

// ---------------------------------------------------------------------------------------
// Output

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: cfg.registryName,
  homepage: cfg.homepage,
  items: registryItems,
};

const uiItemCount = registryItems.filter((i) => !(i.meta && i.meta.support)).length;
const supportCount = registryItems.length - uiItemCount;
const excludedUi = [...excluded.keys()].filter((n) => analysed.get(n).item.pkg === "ui").length;
const excludedDoc = {
  schema: 1,
  about: "Items that a `shadcn add` cannot install, with the reason and the JS-side description for llms.txt. Generated by tooling/registry/build-registry.mjs.",
  counts: {
    uiSubpaths: itemByKey.ui.size,
    installableUiItems: uiItemCount,
    supportItems: supportCount,
    excludedUiSubpaths: excludedUi,
    excludedNativeSubpaths: excludedEntries.filter((e) => e.kind === "native").length,
  },
  entries: excludedEntries,
};

const rawBase = `${cfg.rawBase}/${cfg.repo}/${cfg.ref}/r/{name}.json`;
const components = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: cfg.components.style,
  rsc: false,
  tsx: true,
  tailwind: { css: cfg.components.tailwind.css, baseColor: cfg.components.tailwind.baseColor },
  aliases: cfg.components.aliases,
  registries: { [cfg.namespace]: rawBase },
};

// Stage dir: rewritten sources that `shadcn build` inlines. Recreated on every run.
fs.rmSync(path.join(root, cfg.stageDir), { recursive: true, force: true });
for (const [f, t] of [...stageFiles].sort((a, b) => cmp(a[0], b[0]))) writeText(`${cfg.stageDir}/${f}`, t);
writeJson("registry.json", registry);
writeJson("registry-excluded.json", excludedDoc);
writeJson("components.json", components);

console.log(`items: ${registryItems.length} (${uiItemCount} @nyc-tron/ui subpaths + ${supportCount} support)`);
console.log(`ui subpaths: ${itemByKey.ui.size}; excluded ui: ${excludedUi}; excluded native subpaths: ${excludedDoc.counts.excludedNativeSubpaths}`);
console.log(`stage files: ${stageFiles.size}`);
for (const w of warnings) console.warn(`warning: ${w}`);

if (!args.has("--no-build")) {
  fs.rmSync(path.join(root, "r"), { recursive: true, force: true });
  const r = spawnSync("npx", ["--yes", `shadcn@${cfg.shadcnVersion}`, "build", "registry.json", "-o", "r"], {
    cwd: root,
    stdio: ["ignore", "inherit", "inherit"],
    encoding: "utf8",
  });
  if (r.status !== 0) {
    console.error(`shadcn build failed with exit code ${r.status}`);
    process.exit(r.status || 1);
  }
  // The stage path is an implementation detail. Point `path` back at the repo source file.
  const prefix = `${cfg.stageDir}/`;
  const visit = (dir) => {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true }).sort((a, b) => cmp(a.name, b.name))) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) { visit(p); continue; }
      if (!e.name.endsWith(".json")) continue;
      const j = readJson(p);
      let touched = false;
      for (const f of j.files || []) {
        if (typeof f.path === "string" && f.path.startsWith(prefix)) { f.path = f.path.slice(prefix.length); touched = true; }
      }
      if (touched) writeJson(p, j);
    }
  };
  visit("r");
  console.log("shadcn build ok");
}
