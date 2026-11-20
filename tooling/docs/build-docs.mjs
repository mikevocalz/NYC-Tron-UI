// Writes docs/components/<export-path>.md, one page per @nyc-tron/ui subpath, to docs/agent-native/doc-template.md.
//   node tooling/docs/build-docs.mjs            write pages
//   node tooling/docs/build-docs.mjs --check    write nothing, exit 1 if any page would change
// Tier 1 (59): assembled from docs/agent-native/03-design-handoff.md, 05-accessibility-review.md, copy.json and
//   tooling/docs/tier1-dodont.json. Prose is preserved, front matter says docs: "handwritten".
// Tier 2 (497): generated from docs/api-signatures.json, tier2-copy.json and the source files, docs: "generated",
//   every section body between generated:begin / generated:end markers.
// Template amendment (documented here because doc-template.md section 1 gives no page to non-component subpaths):
//   556 subpaths are registry items (decision 11), 386 export a component. The other 170 (models, hooks, helpers,
//   the root barrel, html) get a tier 2 page with the same eight sections. Their `name` is PascalCase(last path
//   segment) + "Module" ("UiRoot" for the root), and Props holds an Exports table instead of a props table.
// Deterministic: no clock, no randomness. Running twice produces no diff.
import fs from "node:fs";
import path from "node:path";
import {ROOT, AN, PAGES, PLACEHOLDER, SECTIONS, SECTION_KEY, read, readJson, exists, frontMatterText, tablesIn, mdTable, escCell, parsePage, unionValues, decl, registryExcluded} from "./lib.mjs";
import {buildModel, buildExample, a11yScanStatus} from "./model.mjs";

const CHECK = process.argv.includes("--check");
const model = buildModel();
const excluded = registryExcluded();

const copy1 = new Map(readJson(`${AN}/copy.json`).items.map((i) => [i.id, i]));
const copy2 = new Map(readJson(`${AN}/tier2-copy.json`).map((i) => [i.id, i]));
const a11yJson = readJson(`${AN}/a11y-status.json`);
const A11Y_MAP = {PASS: "reviewed-pass", FAIL: "reviewed-fail", UNVERIFIED: "unverified"};
const dodont = exists("tooling/docs/tier1-dodont.json") ? readJson("tooling/docs/tier1-dodont.json") : {};

// ---------------- handoff + review parsing ----------------
function parseHandoff() {
  const text = read(`${AN}/03-design-handoff.md`);
  const start = text.indexOf("\n## Items\n");
  const end = text.indexOf("\n## Verification");
  const body = text.slice(start, end);
  const out = new Map();
  const parts = body.split(/^### (.+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].trim();
    const secs = {};
    const sp = parts[i + 1].split(/^#### (.+)$/m);
    const preamble = sp[0].trim();
    for (let k = 1; k < sp.length; k += 2) secs[sp[k].trim()] = sp[k + 1].replace(/^\n+|\n+$/g, "");
    out.set(name, {preamble, secs});
  }
  return out;
}
function parseReview() {
  const text = read(`${AN}/05-accessibility-review.md`);
  const s = text.indexOf("\n## Per item");
  const e = text.indexOf("\n## Safe metadata fixes");
  const body = text.slice(s, e);
  const out = new Map();
  const parts = body.split(/^### (.+)$/m);
  for (let i = 1; i < parts.length; i += 2) out.set(parts[i].trim(), parts[i + 1].replace(/^\n+|\n+$/g, ""));
  return out;
}
const handoff = parseHandoff();
const review = parseReview();

const CATEGORY_T1 = (() => {
  const t = read(`${AN}/03-design-handoff.md`);
  const m = new Map();
  for (const l of t.split("\n")) {
    const c = l.match(/^\| (\S+) \| `[^`]+` \| [^|]+ \| (\d+) \| (\w+) \| (\d+) \|$/);
    if (c) m.set(c[1], c[3]);
  }
  return m;
})();

// ---------------- section builders ----------------
const mark = (key, sources, body) => `<!-- generated:begin ${key} source=${sources.join(",")} -->\n${body}\n<!-- generated:end ${key} -->`;
const norm = (s) => s.replace(/`/g, "").replace(/\s+/g, " ").trim();

function installLines(item) {
  const syms = item.comps.length ? item.comps.map((c) => c.name) : item.syms.filter((s) => s.kind === "function" || s.kind === "const").map((s) => s.name);
  let imp;
  const specifier = item.specifier;
  if (!syms.length) {
    const t = item.syms.slice(0, 6).map((s) => s.name);
    imp = t.length ? `import type { ${t.join(", ")} } from "${specifier}";` : `import "${specifier}";`;
  } else {
    const shown = syms.slice(0, 8);
    imp = `import { ${shown.join(", ")} } from "${specifier}";`;
  }
  const lines = [
    `- Package: ${item.pkg}`,
    `- Import: \`${imp}\``,
    `- Peers: ${item.peers.length ? item.peers.join(", ") : "none"}`,
    `- Requires: ${item.registryDependencies.length ? item.registryDependencies.join(", ") : "none"}`,
  ];
  let cmd;
  if (excluded.has(item.id)) cmd = `Not in the registry: native-only, shadcn cannot copy it. Import it from the release tarball (see the install page).`;
  else cmd = "```sh\nnpx shadcn@latest add @nyc-tron/" + item.id + "\n```";
  return lines.join("\n") + "\n\n" + cmd;
}

function propsTable(item, pl) {
  const rows = pl.parsed.members.map((m) => [
    "`" + m.name + "`",
    "`" + m.type + "`",
    pl.docs[m.name]?.def ? "`" + pl.docs[m.name].def + "`" : "not recorded",
    m.optional ? "no" : "yes",
    pl.docs[m.name]?.desc ?? "",
  ]);
  return rows;
}
const PROPS_HEAD = ["Name", "Type", "Default", "Required", "Description"];
const extendsLine = (pl) => (pl.parsed.extends ? `Extends: \`${pl.parsed.extends.replace(/\s+/g, " ")}\`` : null);

function genProps(item) {
  if (item.kind === "module") {
    const rows = item.syms.map((s) => {
      let sg = s.sig.replace(/\s+/g, " ").replace(/^export (declare )?/, "");
      if (sg.length > 160) sg = sg.slice(0, 157) + "...";
      return ["`" + s.name + "`", s.kind, "`" + sg + "`"];
    });
    return "No component props. This module exports functions, types or constants.\n\n### Exports\n\n" + mdTable(["Name", "Kind", "Signature"], rows);
  }
  if (!item.props) return PLACEHOLDER;
  // primary first
  const ordered = [item.props, ...item.propsList.filter((p) => p !== item.props)];
  return ordered
    .map((pl, i) => {
      const lines = [];
      if (i > 0) lines.push(`### ${pl.comp}`, "");
      const e = extendsLine(pl);
      if (e) lines.push(e, "");
      lines.push(mdTable(PROPS_HEAD, propsTable(item, pl)));
      return lines.join("\n");
    })
    .join("\n\n");
}

function variantAliases(item) {
  const out = [];
  for (const s of item.syms) {
    if (s.kind !== "type" || !/(Variant|Size|Tone|Kind|Mode)$/.test(s.name)) continue;
    const v = unionValues(s.sig);
    if (v && v.length) out.push({alias: s.name, values: v});
  }
  return out;
}
function genVariants(item) {
  const al = variantAliases(item);
  if (!al.length) return "none";
  return al
    .map((a) => {
      const prop = item.props?.parsed.members.find((m) => m.type === a.alias || m.type.replace(/\s/g, "") === a.alias);
      return `### ${prop ? prop.name : a.alias}\n\n` + mdTable(["Value", "Effect"], a.values.map((v) => ["`" + v + "`", ""]));
    })
    .join("\n\n");
}

const STATE_PROPS = ["disabled", "loading", "selected", "checked", "expanded", "invalid", "error", "readOnly", "pressed", "active", "busy"];
function genStates(item) {
  if (!item.props) return PLACEHOLDER;
  const rows = item.props.parsed.members.filter((m) => STATE_PROPS.includes(m.name)).map((m) => ["`" + m.name + "`", "`" + m.name + "` prop, type `" + m.type + "`"]);
  return rows.length ? mdTable(["State", "How it is set"], rows) : PLACEHOLDER;
}

function genA11y(item) {
  if (!item.a11yScan.size) return PLACEHOLDER;
  const lines = [];
  for (const [k, v] of [...item.a11yScan.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const vals = [...v].sort();
    lines.push(vals.length ? `- \`${k}\`: ${vals.map((x) => '"' + x + '"').join(", ")}` : `- \`${k}\`: set from an expression`);
  }
  return lines.join("\n");
}

const exampleNames = new Set();
function exampleName(item) {
  let n = item.name;
  if (exampleNames.has(n)) n = item.id.replace(/[^A-Za-z0-9]+/g, "_");
  exampleNames.add(n);
  return n;
}
function genExample(item, forName) {
  const ex = buildExample(item);
  if (!ex) return PLACEHOLDER;
  const specifier = item.specifier;
  const n = item.name;
  const jsx = ex.attrs.length ? `<${n} ${ex.attrs.join(" ")} />` : `<${n} />`;
  return "```tsx example=" + forName + `\nimport { ${n} } from "${specifier}";\n\nexport function Example() {\n  return ${jsx};\n}\n` + "```";
}

// ---------------- tier 2 page ----------------
function tier2Page(item) {
  if (item.pkg === "@nyc-tron/ui" && !copy2.get(item.id === "root" ? "." : item.id)) throw new Error("no tier2-copy entry for " + item.id);
  const srcs = item.files;
  const sigSrc = ["docs/api-signatures.json", ...srcs];
  const a11y = a11yScanStatus(item);
  const fm = {
    name: item.name, namespace: "@nyc-tron", subpath: item.specifier, tier: 2, docs: "generated",
    platforms: item.platforms, category: item.category, tokens: item.tokens, registryDependencies: item.registryDependencies, a11yStatus: a11y,
  };
  const body = {
    Purpose: item.purposeDoc ?? PLACEHOLDER,
    Install: installLines(item),
    Props: genProps(item),
    Variants: item.kind === "component" ? genVariants(item) : "none",
    States: genStates(item),
    A11y: genA11y(item),
    Example: item.kind === "component" ? genExample(item, exampleName(item)) : PLACEHOLDER,
    "Do/Don't": PLACEHOLDER,
  };
  const msrc = {
    Purpose: srcs.length ? srcs : ["docs/api-signatures.json"],
    Install: ["docs/api-signatures.json", item.peerDir + "/package.json", ...srcs],
    Props: sigSrc, Variants: ["docs/api-signatures.json"], States: ["docs/api-signatures.json"],
    A11y: srcs.length ? srcs : ["docs/api-signatures.json"],
    Example: ["docs/api-signatures.json"], "Do/Don't": [`${AN}/doc-template.md`],
  };
  const out = [frontMatterText(fm), "", `# ${item.name}`, ""];
  for (const s of SECTIONS) out.push(`## ${s}`, "", mark(SECTION_KEY[s], msrc[s], body[s]), "");
  return out.join("\n").replace(/\n+$/, "\n");
}

// ---------------- tier 1 page ----------------
function convertVariants(text) {
  const lines = text.split("\n");
  const out = [];
  let g = null;
  const flush = () => {
    if (g) {
      out.push(`### ${g.prop}`, "", mdTable(["Value", "Effect"], g.rows), "");
      g = null;
    }
  };
  let groups = 0;
  for (const l of lines) {
    const h = l.match(/^`([\w.]+)` \(`[^`]*`\)[^\n]*:\s*$/);
    if (h) {
      flush();
      g = {prop: h[1], rows: []};
      groups++;
      continue;
    }
    const b = l.match(/^- `([^`]+)`:?\s*(.*)$/);
    if (g && b) {
      g.rows.push(["`" + b[1] + "`", b[2]]);
      continue;
    }
    if (g && l.trim() === "") {
      flush();
      continue;
    }
    flush();
    out.push(l);
  }
  flush();
  if (!groups) return text;
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function convertStates(text, propNames) {
  const lines = text.split("\n");
  const rows = [];
  const rest = [];
  for (const l of lines) {
    const b = l.match(/^- ([^:]+): ?(.*)$/);
    if (b) {
      const state = b[1].trim();
      const detail = b[2].trim();
      let how = "derived in code";
      const nm = state.replace(/`/g, "");
      if (propNames.has(nm)) how = "`" + nm + "` prop";
      else {
        const cls = detail.match(/`([a-z-]+:[^`]+)`\s*class|`([a-z-]+:[^`]+)`/);
        const pp = [...detail.matchAll(/`(\w+)`\s*prop/g)].map((x) => x[1]).filter((x) => propNames.has(x));
        if (pp.length) how = pp.map((x) => "`" + x + "` prop").join(", ");
        else if (cls) how = "class `" + (cls[1] ?? cls[2]) + "`";
      }
      rows.push(["`" + nm + "`", how, detail]);
    } else if (l.trim()) rest.push(l);
  }
  if (!rows.length) return text;
  return mdTable(["State", "How it is set", "What the code does"], rows) + (rest.length ? "\n\n" + rest.join("\n") : "");
}

function mergeProps(item, text) {
  // Replace the first Name|Type|Default|Required|Notes table with generated Name/Type/Required and hand Default/Description.
  const lines = text.split("\n");
  const tabs = tablesIn(text);
  const i = tabs.findIndex((t) => /^name$/i.test(t.header[0]) && /^type$/i.test(t.header[1]));
  let primary = item.props;
  let out = lines.slice();
  if (i >= 0 && primary) {
    const t = tabs[i];
    const hand = new Map(t.rows.map((r) => [r[0].replace(/`/g, ""), r]));
    const rows = primary.parsed.members.map((m) => {
      const h = hand.get(m.name);
      const dd = primary.docs[m.name];
      return ["`" + m.name + "`", "`" + m.type + "`", h && h[2] ? h[2] : dd?.def ? "`" + dd.def + "`" : "not recorded", m.optional ? "no" : "yes", h ? h[4] ?? "" : dd?.desc ?? ""];
    });
    const genNames0 = new Set(primary.parsed.members.map((m) => m.name));
    const extra = t.rows.filter((r) => !genNames0.has(r[0].replace(/`/g, "")));
    const e = extendsLine(primary);
    const block = [...(e ? [e, ""] : []), mdTable(PROPS_HEAD, rows)];
    if (extra.length) block.push("", "### Inherited props this component reads", "", "Documented by hand from the source. They come from the extended type, so they are not in the table above.", "", mdTable(PROPS_HEAD, extra.map((r) => [r[0], r[1], r[2] ?? "not recorded", r[3], r[4] ?? ""])));
    out = [...lines.slice(0, t.start), ...block, ...lines.slice(t.end)];
    mergeStats.merged++;
    const handNames = new Set(t.rows.map((r) => r[0].replace(/`/g, "")));
    const genNames = new Set(primary.parsed.members.map((m) => m.name));
    for (const n of handNames) if (!genNames.has(n)) mergeStats.handOnly.push(`${item.name}.${n}`);
    for (const n of genNames) if (!handNames.has(n)) mergeStats.genOnly.push(`${item.name}.${n}`);
  } else if (i >= 0) {
    const t = tabs[i];
    const rows = t.rows.map((r) => [r[0], r[1], r[2] ?? "not recorded", r[3], r[4] ?? ""]);
    out = [...lines.slice(0, t.start), mdTable(PROPS_HEAD, rows), ...lines.slice(t.end)];
    mergeStats.handOnlyTable.push(item.name);
  } else mergeStats.noTable.push(item.name);
  return out.join("\n");
}
const mergeStats = {merged: 0, handOnly: [], genOnly: [], handOnlyTable: [], noTable: []};

function a11yFromReview(name) {
  const r = review.get(name);
  if (!r) throw new Error("no accessibility review for " + name);
  const labels = {a: "Contrast", b: "Keyboard and focus", c: "Touch target", d: "Screen reader", e: "Motion", f: "Review status"};
  const out = [];
  for (const l of r.split("\n")) {
    const m = l.match(/^- \(([a-f])\) [^:]+: ?(.*)$/);
    if (m) out.push(`- ${labels[m[1]]}: ${m[2]}`);
    else if (/^\s+- UNVERIFIED/.test(l)) out.push(l);
  }
  out.push("- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.");
  return out.join("\n");
}

function fallbackDoDont(item, bodyText) {
  const req = item.props ? item.props.parsed.members.filter((m) => !m.optional).map((m) => m.name) : [];
  const names = item.props ? item.props.parsed.members.map((m) => m.name) : [];
  const d = [];
  for (const r of req.slice(0, 2)) d.push(`Pass \`${r}\`; it is a required prop.`);
  for (const n of names) if (d.length < 2 && ["disabled", "loading", "selected"].includes(n)) d.push(`Use \`${n}\` to set that state instead of restyling the control.`);
  while (d.length < 2) d.push(`Install it with \`npx shadcn@latest add @nyc-tron/${item.id}\` so its peers and dependencies resolve.`);
  const x = [`Do not hardcode colours: this component reads the theme variables listed in the front matter \`tokens\`.`, `Do not skip the accessibility review: \`a11yStatus\` is \`${item.a11yStatus}\`.`];
  return {do: d, dont: x};
}

function tier1Page(item) {
  const h = handoff.get(item.tier1.name);
  if (!h) throw new Error("no handoff entry for " + item.tier1.name);
  const c = copy1.get(item.id);
  if (!c) throw new Error("no copy.json entry for " + item.id);
  const st = a11yJson[item.tier1.name];
  if (!st) throw new Error("no a11y status for " + item.tier1.name);
  const a11y = A11Y_MAP[st.status];
  item.a11yStatus = a11y;
  const category = CATEGORY_T1.get(item.tier1.name);
  if (!category) throw new Error("no tier 1 category for " + item.tier1.name);
  const propNames = new Set(item.props ? item.props.parsed.members.map((m) => m.name) : []);
  const sec = h.secs;
  const strip = (s) => (s ?? "").replace(/\nUNVERIFIED count: \d+\s*$/m, "").replace(/^UNVERIFIED count: \d+\s*$/m, "").trim();
  const ex = (sec.Example ?? "").match(/```tsx example=(\S+)\n[\s\S]*?```/);
  if (!ex) throw new Error("no example for " + item.name);
  exampleNames.add(ex[1]);
  const pre = h.preamble.split("\n").filter((l) => l.trim() && !/^`import /.test(l) && !/^Source: /.test(l)).join("\n");
  let props = mergeProps(item, sec.Props ?? "");
  if (pre) props = pre + "\n\n" + props;
  const tokens = strip(sec.Tokens);
  if (tokens) props += "\n\n### Tokens\n\n" + tokens;
  const unv = strip(sec.UNVERIFIED);
  if (unv) props += "\n\n### Unverified\n\n" + unv;
  let install = installLines(item);
  const dep = strip(sec.Dependencies);
  if (dep) install += "\n\n### Dependencies\n\n" + dep;
  let states = convertStates(strip(sec.States), propNames);
  for (const k of ["Motion", "Platform notes"]) if (strip(sec[k])) states += `\n\n### ${k}\n\n` + strip(sec[k]);
  const dd = dodont[item.tier1.name] ?? dodont[item.id] ?? fallbackDoDont(item);
  if (!dodont[item.tier1.name] && !dodont[item.id]) fallbackUsed.push(item.name);
  const doText = "### Do\n\n" + dd.do.map((b) => `- ${b}`).join("\n") + "\n\n### Don't\n\n" + dd.dont.map((b) => `- ${b}`).join("\n");
  const fm = {
    name: item.name, namespace: "@nyc-tron", subpath: item.specifier, tier: 1, docs: "handwritten",
    platforms: item.platforms, category, tokens: item.tokens, registryDependencies: item.registryDependencies, a11yStatus: a11y,
  };
  const body = {
    Purpose: c.description,
    Install: install,
    Props: props,
    Variants: convertVariants(strip(sec.Variants)) || "none",
    States: states,
    A11y: a11yFromReview(item.tier1.name),
    Example: ex[0],
    "Do/Don't": doText,
  };
  const out = [frontMatterText(fm), "", `# ${item.name}`, ""];
  for (const s of SECTIONS) out.push(`## ${s}`, "", body[s].trim(), "");
  return out.join("\n").replace(/\n+$/, "\n");
}
const fallbackUsed = [];

// ---------------- run ----------------
const pagePath = (id) => path.join(ROOT, PAGES, id + ".md");
const wanted = new Map();
const nameOverride = new Map();
// Tier 1 names must be decided before tier 2 example names so example=<name> never collides.
for (const it of model.items.filter((i) => i.tier === 1)) {
  const h = handoff.get(it.tier1.name);
  const ex = h && (h.secs.Example ?? "").match(/```tsx example=(\S+)/);
  if (ex) exampleNames.add(ex[1]);
}
const handwrittenKept = [];
for (const it of model.items) {
  let text;
  const p = pagePath(it.id);
  if (it.tier === 1) text = tier1Page(it);
  else {
    if (fs.existsSync(p) && /^docs: "handwritten"$/m.test(fs.readFileSync(p, "utf8").split("---")[1] ?? "")) {
      handwrittenKept.push(it.id);
      text = fs.readFileSync(p, "utf8");
    } else text = tier2Page(it);
  }
  wanted.set(p, text);
}

// case-insensitive collisions
const lower = new Map();
for (const p of wanted.keys()) {
  const k = p.toLowerCase();
  if (lower.has(k)) throw new Error(`case-insensitive path collision: ${p} and ${lower.get(k)}`);
  lower.set(k, p);
}

let changed = 0;
let written = 0;
let removed = 0;
const existing = [];
const walk = (d) => {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith(".md")) existing.push(f);
  }
};
walk(path.join(ROOT, PAGES));
for (const f of existing) {
  if (!wanted.has(f)) {
    changed++;
    if (!CHECK) {
      fs.rmSync(f);
      removed++;
    }
  }
}
for (const [p, text] of [...wanted.entries()].sort()) {
  const cur = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (cur !== text) {
    changed++;
    if (!CHECK) {
      fs.mkdirSync(path.dirname(p), {recursive: true});
      fs.writeFileSync(p, text);
      written++;
    }
  }
}
const t1 = model.items.filter((i) => i.tier === 1).length;
const comps = model.items.filter((i) => i.kind === "component").length;
console.log(`pages: ${wanted.size} (tier 1: ${t1}, tier 2: ${wanted.size - t1}); component subpaths: ${comps}; module pages: ${wanted.size - comps}`);
console.log(`${CHECK ? "would change" : "written"}: ${CHECK ? changed : written}${CHECK ? "" : `, removed: ${removed}`}`);
console.log(`tier 1 props merge: ${mergeStats.merged} merged, ${mergeStats.noTable.length} without a props table [${mergeStats.noTable.join(", ")}], ${mergeStats.handOnlyTable.length} hand table kept [${mergeStats.handOnlyTable.join(", ")}]`);
console.log(`tier 1 props only in handoff (dropped, not in the .d.ts interface): ${mergeStats.handOnly.length}${mergeStats.handOnly.length ? " " + mergeStats.handOnly.slice(0, 12).join(", ") : ""}`);
console.log(`tier 1 props only in .d.ts (added, Default not recorded): ${mergeStats.genOnly.length}`);
if (fallbackUsed.length) console.log(`tier 1 Do/Don't from fallback (not hand-written): ${fallbackUsed.length}`);
if (handwrittenKept.length) console.log(`tier 2 pages promoted to handwritten, left alone: ${handwrittenKept.length}`);
const ex2 = [...wanted.values()].filter((t) => /example=/.test(t)).length;
console.log(`pages with an example block: ${ex2}`);
if (CHECK && changed) process.exit(1);
