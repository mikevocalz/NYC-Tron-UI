#!/usr/bin/env node
// Gate for the generated registry. Loads every r/*.json and resolves every import in every
// file against what `shadcn add <item>` would leave on disk: the item's own files, the files
// of its transitive registryDependencies, the npm `dependencies` of those items, react,
// react-native and the peer allowlist. Exits 1 and names the item and specifier otherwise.
//
//   node tooling/registry/check-imports.mjs [--r r] [--json]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scan } from "./scan-imports.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const argv = process.argv.slice(2);
const rDir = path.resolve(root, argv.includes("--r") ? argv[argv.indexOf("--r") + 1] : "r");
const cfg = JSON.parse(fs.readFileSync(path.join(here, "config.json"), "utf8"));
const components = JSON.parse(fs.readFileSync(path.join(root, "components.json"), "utf8"));
const namespacePrefix = `${cfg.namespace}/`;

// Peer allowlist: packages every React Native app already has.
const PEER_ALLOWLIST = new Set(cfg.allowlist);

// Target alias (`@components/x`) to the import prefix a rewritten file uses (`@/components/x`).
const ALIAS_TARGETS = { "@components": components.aliases.components, "@ui": components.aliases.ui, "@lib": components.aliases.lib, "@hooks": components.aliases.hooks, "@utils": components.aliases.utils };
function targetToImportBase(target) {
  const m = /^(@[a-z]+)\/(.*)$/.exec(target);
  if (!m || !ALIAS_TARGETS[m[1]]) return null;
  return `${ALIAS_TARGETS[m[1]]}/${m[2]}`;
}
const moduleKeys = (importPath) => {
  const base = importPath.replace(/\.(ts|tsx)$/, "");
  const keys = new Set([base]);
  const platformless = base.replace(/\.(native|web|ios|android)$/, "");
  keys.add(platformless);
  if (/\/index$/.test(platformless)) keys.add(platformless.replace(/\/index$/, ""));
  return keys;
};
const packageOf = (spec) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);
const depName = (d) => d.replace(/(?<!^)@.*/, "");

function load(dir) {
  const items = new Map();
  const visit = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) visit(p);
      else if (e.name.endsWith(".json") && p !== path.join(dir, "registry.json")) {
        const j = JSON.parse(fs.readFileSync(p, "utf8"));
        items.set(j.name, { ...j, __file: path.relative(root, p) });
      }
    }
  };
  visit(dir);
  return items;
}

const items = load(rDir);
const index = JSON.parse(fs.readFileSync(path.join(rDir, "registry.json"), "utf8"));
const problems = [];
const fail = (item, specifier, file, reason) => problems.push({ item, specifier, file, reason });

if (index.items.length !== items.size) fail("(registry)", "", "r/registry.json", `index lists ${index.items.length} items but r/ has ${items.size} item files`);
for (const it of index.items) if (!items.has(it.name)) fail(it.name, "", "r/registry.json", "listed in the index, no r/ file");

// Transitive registryDependencies, with dangling references reported once per item.
function closureOf(name) {
  const seen = new Set();
  const stack = [name];
  while (stack.length) {
    const n = stack.pop();
    if (seen.has(n)) continue;
    seen.add(n);
    const it = items.get(n);
    if (!it) continue;
    for (const d of it.registryDependencies || []) {
      if (!d.startsWith(namespacePrefix)) { fail(name, d, items.get(name).__file, "registryDependency outside the registry namespace"); continue; }
      const dn = d.slice(namespacePrefix.length);
      if (!items.has(dn)) { fail(name, d, items.get(name).__file, "registryDependency has no item in r/"); continue; }
      stack.push(dn);
    }
  }
  return seen;
}

let fileCount = 0;
let importCount = 0;
for (const [name, item] of [...items].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
  const closure = closureOf(name);
  const installed = new Set();
  const deps = new Set();
  for (const n of closure) {
    const it = items.get(n);
    if (!it) continue;
    for (const f of it.files || []) {
      const base = targetToImportBase(f.target || "");
      if (!base) { fail(name, f.target || "(no target)", f.path, "file target is not an alias target"); continue; }
      for (const k of moduleKeys(base)) installed.add(k);
    }
    for (const d of it.dependencies || []) deps.add(depName(d));
  }
  for (const f of item.files || []) {
    fileCount++;
    const fromBase = targetToImportBase(f.target || "");
    if (!fromBase) continue;
    if (typeof f.content !== "string") { fail(name, "", f.path, "file has no inline content"); continue; }
    for (const d of scan(f.content)) {
      importCount++;
      const spec = d.spec;
      if (spec.startsWith(".")) {
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(fromBase), spec));
        if (![...moduleKeys(resolved)].some((k) => installed.has(k))) fail(name, spec, f.path, "relative import resolves to no installed file");
      } else if (spec.startsWith("@nyc-tron/")) {
        fail(name, spec, f.path, "package specifier left in generated content");
      } else if (Object.values(ALIAS_TARGETS).some((a) => a && spec.startsWith(`${a}/`))) {
        if (!installed.has(spec)) fail(name, spec, f.path, "alias import resolves to no installed file");
      } else {
        const pkg = packageOf(spec);
        if (!PEER_ALLOWLIST.has(pkg) && !deps.has(pkg)) fail(name, spec, f.path, `package ${pkg} is not in dependencies or the peer allowlist`);
      }
    }
  }
}

const summary = { items: items.size, files: fileCount, imports: importCount, unresolved: problems.length };
if (argv.includes("--json")) console.log(JSON.stringify({ ...summary, problems }, null, 2));
else {
  for (const p of problems.slice(0, 200)) console.error(`FAIL ${p.item}: ${p.specifier || "(none)"} in ${p.file}: ${p.reason}`);
  if (problems.length > 200) console.error(`... and ${problems.length - 200} more`);
  console.log(`check-imports: ${summary.items} items, ${summary.files} files, ${summary.imports} imports, ${summary.unresolved} unresolved`);
}
process.exit(problems.length ? 1 : 0);
