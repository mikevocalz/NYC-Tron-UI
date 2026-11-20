// Computes the tier 1 set for @nyc-tron/ui and writes docs/agent-native/tier1.json.
// Usage (repo root, Node + git only, nothing installed):  node docs/agent-native/tier1.mjs
// Rule, applied in order, an item is tier 1 if ANY of R1..R4 holds, else tier 2:
//   R1 root barrel     the component is exported from packages/ui/src/index.ts
//   R2 core families   its source sits directly in components/ or in content, data, feedback, layout,
//                      navigation, overlays, theme or window (layout and type primitives, display, overlays)
//   R3 shell core      its source sits in components/shell (shell and navigation core, AGENTS.md rule 4)
//   R4 most imported   >= 10 distinct other source files in packages/*/src import it (relative or by subpath)
// Item = one @nyc-tron/ui subpath whose source exports a PascalCase function or const.
// Import count = distinct importing files under git ls-files 'packages/*/src', ts/tsx/js/jsx, excluding itself.
import {execSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const R4_MIN = 10;
const CORE_DIRS = new Set(["", "content", "data", "feedback", "layout", "navigation", "overlays", "theme", "window"]);
const sh = (c) => execSync(c, {encoding: "utf8", maxBuffer: 1 << 29}).trim();
const files = sh("git ls-files packages").split("\n").filter((f) => /^packages\/[^/]+\/src\/.*\.(tsx?|jsx?)$/.test(f) && !/\.d\.ts$/.test(f));
const stripExt = (p) => p.replace(/\.(tsx?|jsx?)$/, "").replace(/\.(native|web|shared|types)$/, "");
const counts = {};
const re = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const seen = new Set();
  for (const m of src.matchAll(re)) {
    const s = m[1];
    let t = null;
    if (s.startsWith(".")) t = path.posix.normalize(path.posix.join(path.posix.dirname(f), s));
    else if (s.startsWith("@nyc-tron/ui/components/")) t = "packages/ui/src/components/" + s.slice(24);
    if (!t) continue;
    t = stripExt(t);
    if (t === stripExt(f) || seen.has(t)) continue;
    seen.add(t);
    (counts[t] ??= {all: 0, other: 0}).all++;
    if (!f.startsWith("packages/ui/")) counts[t].other++;
  }
}
const barrel = fs.readFileSync("packages/ui/src/index.ts", "utf8");
const barrelSources = new Set([...barrel.matchAll(/from\s+"\.\/components\/([^"]+?)\.tsx"/g)].map((m) => m[1]));
const sig = JSON.parse(fs.readFileSync("docs/api-signatures.json", "utf8"));
const ui = sig.packages["@nyc-tron/ui"];
const items = [];
let candidates = 0;
for (const sp of Object.keys(ui)) {
  if (!sp.startsWith("./components/")) continue;
  const rel = sp.slice("./components/".length);
  const base = "packages/ui/src/components/" + rel;
  const srcs = [".tsx", ".native.tsx", ".shared.tsx", ".web.tsx"].map((e) => base + e).filter((f) => fs.existsSync(f));
  if (!srcs.length) continue;
  const txt = srcs.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  if (!/export\s+(?:default\s+)?(?:function|const)\s+[A-Z]\w*/.test(txt)) continue;
  candidates++;
  const dir = rel.includes("/") ? rel.split("/")[0] : "";
  const c = counts[base] ?? {all: 0, other: 0};
  const why = [];
  if (barrelSources.has(rel)) why.push("R1 root barrel export");
  if (CORE_DIRS.has(dir)) why.push(`R2 core family (${dir || "components/"})`);
  if (dir === "shell") why.push("R3 shell core");
  if (c.all >= R4_MIN) why.push(`R4 imported by ${c.all} files`);
  if (!why.length) continue;
  const symbols = Object.keys(ui[sp][0].symbols);
  items.push({
    name: rel.split("/").pop(),
    package: "@nyc-tron/ui",
    subpath: sp,
    importSpecifier: "@nyc-tron/ui/" + sp.slice(2),
    source: srcs,
    symbols,
    tier: 1,
    why,
    importCount: c.all,
    importCountOtherPackages: c.other,
  });
}
items.sort((a, b) => a.subpath.localeCompare(b.subpath));
const uiSubpaths = Object.keys(ui).length;
const out = {
  schema: 1,
  scope: "@nyc-tron/ui subpaths (decision 11). Other packages are not tiered here.",
  rule: {
    summary: "Tier 1 = R1 root barrel OR R2 core families OR R3 shell core OR R4 imported by >= 10 distinct files. Item = a ui subpath whose source exports a PascalCase function or const. Everything else is tier 2.",
    R1: "exported from packages/ui/src/index.ts",
    R2: "source directly in components/ or in content, data, feedback, layout, navigation, overlays, theme, window",
    R3: "source in components/shell",
    R4: `distinct other files in packages/*/src importing the module >= ${R4_MIN}`,
    importCountDefinition: "distinct files from git ls-files packages (src/*.ts,tsx,js,jsx) with a relative import or an @nyc-tron/ui/components/<subpath> import that resolves to the module, self excluded, platform suffixes (.native .web .shared .types) merged",
    command: "node docs/agent-native/tier1.mjs",
    layoutPrimitivesNote: "Stack, Row, Spacer, Divider, Text are proposed in 02-design-system section 5 and have no source in this repo yet, so they cannot be tier 1 items. Add them with the same R2 rule once they exist (layout/ is an R2 directory).",
  },
  counts: {uiSubpaths, componentSubpaths: candidates, tier1: items.length, tier2: uiSubpaths - items.length},
  items,
};
fs.writeFileSync("docs/agent-native/tier1.json", JSON.stringify(out, null, 1) + "\n");
console.log(JSON.stringify(out.counts));
