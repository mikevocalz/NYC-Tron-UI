// Docs CI check. Implements the 12 checks of docs/agent-native/doc-template.md section 5, plus:
//   - every registry.json item has a page, and no page lacks an item (skipped with a notice if registry.json is absent)
//   - no broken relative links in pages
//   - every token named in a page exists in docs/agent-native/tokens.json (or matches a tokenPattern)
//   - front matter parses
//   - tier 1 Do/Don't bullets each name a term (in backticks) that appears elsewhere on the page
// Usage: node tooling/docs/check-docs.mjs [--tsc <path to tsc.js> --node-modules <dir with react, @types/react, react-native>] [--json]
// Exit code 1 on any failure. Check 9 runs tsc only when --tsc is given; otherwise it parses the blocks and says tsc was not run.
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {ROOT, AN, PAGES, PLACEHOLDER, SECTIONS, SECTION_KEY, FM_KEYS, PLATFORM_ORDER, CATEGORIES, A11Y_VALUES, read, readJson, exists, parsePage, tablesIn, codeBlocks, sigData, uiEntries} from "./lib.mjs";
import {buildModel, tokenValid, a11yScanStatus} from "./model.mjs";
import {registryRef, REPO} from "./lib.mjs";

const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const model = buildModel();
const t1 = readJson(`${AN}/tier1.json`);
const a11yJson = readJson(`${AN}/a11y-status.json`);
const A11Y_MAP = {PASS: "reviewed-pass", FAIL: "reviewed-fail", UNVERIFIED: "unverified"};

const failures = [];
const fail = (check, id, msg) => failures.push({check, id, msg});
const counts = {};
const bump = (k, n = 1) => (counts[k] = (counts[k] ?? 0) + n);

const pageFile = (id) => path.join(PAGES, id + ".md");
const pages = new Map();
for (const it of model.items) {
  const f = pageFile(it.id);
  if (!exists(f)) {
    fail(1, it.id, `missing page ${f}`);
    continue;
  }
  pages.set(it.id, {it, file: f, text: read(f), ...parsePage(read(f))});
}

// extra files in docs/components with no item
const onDisk = [];
const walk = (d) => {
  for (const e of fs.readdirSync(path.join(ROOT, d), {withFileTypes: true})) {
    const p = path.posix.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) onDisk.push(p);
  }
};
if (exists(PAGES)) walk(PAGES);
const expected = new Set(model.items.map((i) => pageFile(i.id).split(path.sep).join("/")));
for (const f of onDisk) if (!expected.has(f)) fail("X1", f, "page without an item");

// check 1 counts
const compCount = model.items.filter((i) => i.kind === "component").length;
if (compCount !== t1.counts.componentSubpaths) fail(1, "-", `component subpaths ${compCount} != tier1.counts.componentSubpaths ${t1.counts.componentSubpaths}`);
if (model.items.filter((i) => i.pkg === "@nyc-tron/ui").length !== t1.counts.uiSubpaths) fail(1, "-", `items ${model.items.length} != tier1.counts.uiSubpaths ${t1.counts.uiSubpaths}`);
if (model.items.filter((i) => i.tier === 1).length !== t1.counts.tier1) fail(1, "-", "tier 1 count differs from tier1.json");

const PROPS_HEAD = ["Name", "Type", "Default", "Required", "Description"];
const norm = (s) => s.replace(/`/g, "").replace(/\\\|/g, "|").replace(/\s+/g, " ").trim();
const sigKeys = new Set(Object.keys(uiEntries()));
const MARK_B = /^<!-- generated:begin (\w+) source=(\S+) -->$/;
const MARK_E = /^<!-- generated:end (\w+) -->$/;
let unverifiedMentions = 0;
let unverifiedPages = 0;
const exampleBlocks = [];
const exampleNames = new Set();

for (const [id, p] of pages) {
  const it = p.it;
  const here = (c, m) => fail(c, id, m);
  // front matter parse + check 2
  for (const e of p.errors) here(2, e);
  if (p.fmKeys.join(",") !== FM_KEYS.join(",")) here(2, `front matter keys are [${p.fmKeys}], expected the ten keys in template order`);
  const fm = p.fm;
  if (typeof fm.name !== "string" || !/^[A-Z][A-Za-z0-9]*$/.test(fm.name)) here(2, `name ${fm.name} is not PascalCase`);
  if (p.name !== fm.name) here(2, `# heading "${p.name}" != name "${fm.name}"`);
  if (fm.namespace !== "@nyc-tron") here(2, `namespace ${fm.namespace}`);
  const wantSub = it.pkg === "@nyc-tron/core" ? "@nyc-tron/core/" + id.slice(5) : id === "root" ? "@nyc-tron/ui" : "@nyc-tron/ui/components/" + id;
  if (fm.subpath !== wantSub) here(2, `subpath ${fm.subpath} != ${wantSub}`);
  if (fm.tier !== it.tier) here(2, `tier ${fm.tier} != tier1.json (${it.tier})`);
  if (fm.docs !== "handwritten" && fm.docs !== "generated") here(2, `docs ${fm.docs}`);
  for (const k of ["platforms", "tokens", "registryDependencies"]) if (!Array.isArray(fm[k])) here(2, `${k} is not an array`);
  if (typeof fm.category !== "string") here(2, "category missing");
  // check 3
  const titles = p.sections.map((s) => s.title);
  if (titles.join("|") !== SECTIONS.join("|")) here(3, `headings are [${titles.join(", ")}]`);
  // check 4
  if (fm.tier === 1) {
    if (fm.docs !== "handwritten") here(4, "tier 1 must be handwritten");
    if (/<!-- generated:/.test(p.text)) here(4, "tier 1 has generated markers");
    if (p.text.includes(PLACEHOLDER)) here(4, "tier 1 has the placeholder line");
  }
  // check 5 and the handwritten-has-no-markers rule
  if (fm.docs === "generated") {
    if (fm.tier !== 2) here(5, "generated page must be tier 2");
    for (const s of p.sections) {
      const key = SECTION_KEY[s.title];
      const ls = s.body.split("\n");
      const b = ls[0]?.match(MARK_B);
      const e = ls[ls.length - 1]?.match(MARK_E);
      if (!b || b[1] !== key) here(5, `section ${s.title}: missing begin marker for ${key}`);
      else if (!b[2].split(",").every((x) => x.length)) here(5, `section ${s.title}: empty source`);
      else {
        for (const src of b[2].split(",")) if (!exists(src)) here(5, `section ${s.title}: source ${src} does not exist`);
        if (["props", "variants", "states", "install"].includes(key) && !b[2].split(",").includes("docs/api-signatures.json")) here(5, `section ${s.title}: source must include docs/api-signatures.json`);
      }
      if (!e || e[1] !== key) here(5, `section ${s.title}: missing end marker for ${key}`);
      if (b && e && ls.length < 3) here(5, `section ${s.title}: empty body`);
    }
    if (p.pre) here(5, "text outside the markers before the first section");
  } else if (/<!-- generated:/.test(p.text)) here(4, "handwritten page has generated markers");
  const sec = Object.fromEntries(p.sections.map((s) => [s.title, s.body.replace(/^<!-- generated:begin .*-->\n?/, "").replace(/\n?<!-- generated:end .*-->$/, "")]));
  // check 6
  if (!(sigData().packages[it.pkg] ?? {})[it.sp]) here(6, "subpath is not a key of api-signatures.json");
  for (const t of fm.tokens ?? []) if (!tokenValid(t)) here(6, `token ${t} is not in tokens.json and matches no tokenPattern`);
  if (JSON.stringify([...(fm.tokens ?? [])].sort()) !== JSON.stringify(fm.tokens ?? [])) here(6, "tokens not sorted");
  if ((fm.tokens ?? []).length !== new Set(fm.tokens).size) here(6, "tokens not unique");
  const rd = fm.registryDependencies ?? [];
  if (JSON.stringify([...rd].sort()) !== JSON.stringify(rd) || rd.length !== new Set(rd).size) here(6, "registryDependencies not sorted and unique");
  for (const d of rd) {
    const did = d.replace(/^@nyc-tron\//, "");
    if (!d.startsWith("@nyc-tron/") || !pages.has(did)) here(6, `registryDependency ${d} has no page`);
    if (did === id) here(6, "registryDependencies references itself");
  }
  // facts agree with a fresh scan
  if (JSON.stringify(fm.tokens) !== JSON.stringify(it.tokens)) here(6, `tokens differ from the source scan: page ${JSON.stringify(fm.tokens)} scan ${JSON.stringify(it.tokens)}`);
  if (JSON.stringify(fm.registryDependencies) !== JSON.stringify(it.registryDependencies)) here(6, "registryDependencies differ from the source scan");
  // check 7
  if (!Array.isArray(fm.platforms) || fm.platforms.some((x) => !PLATFORM_ORDER.includes(x)) || JSON.stringify([...fm.platforms].sort((a, b) => PLATFORM_ORDER.indexOf(a) - PLATFORM_ORDER.indexOf(b))) !== JSON.stringify(fm.platforms)) here(7, `platforms ${JSON.stringify(fm.platforms)}`);
  else if (JSON.stringify(fm.platforms) !== JSON.stringify(it.platforms)) here(7, `platforms differ from the source scan ${JSON.stringify(it.platforms)}`);
  if (!CATEGORIES.includes(fm.category)) here(7, `category ${fm.category}`);
  if (fm.tier === 2 && fm.category !== it.category) here(7, `tier 2 category ${fm.category} != directory rule ${it.category}`);
  // check 8: props parity for the primary component
  if (it.kind === "component" && it.props) {
    const tabs = tablesIn(sec.Props ?? "");
    const t = tabs[0];
    const want = it.props.parsed.members.map((m) => [m.name, m.type.replace(/\s+/g, " "), m.optional ? "no" : "yes"]);
    if (!t || t.header.join("|") !== PROPS_HEAD.join("|")) here(8, "first Props table does not have the five template columns");
    else {
      const got = t.rows.map((r) => [norm(r[0]), norm(r[1]), norm(r[3])]);
      const w = want.map((r) => r.map(norm));
      if (JSON.stringify(got) !== JSON.stringify(w)) {
        const gs = new Set(got.map((r) => r.join("\u0001")));
        const miss = w.filter((r) => !gs.has(r.join("\u0001"))).map((r) => r[0]);
        here(8, `Props Name/Type/Required differ from the .d.ts: ${miss.slice(0, 6).join(", ") || "order or extras"}`);
      }
    }
    bump("propsParityChecked");
  }
  // check 9: examples
  const blocks = codeBlocks(sec.Example ?? "");
  if (sec.Example?.trim() !== PLACEHOLDER) {
    if (blocks.length !== 1) here(9, `Example must hold exactly one fenced block, found ${blocks.length}`);
    for (const b of blocks) {
      const m = b.info.match(/^example=(\S+)$/);
      if (b.lang !== "tsx" || !m) here(9, "Example fence must be ```tsx example=<name>");
      else {
        if (exampleNames.has(m[1])) here(9, `duplicate example name ${m[1]}`);
        exampleNames.add(m[1]);
        exampleBlocks.push({name: m[1], code: b.code, id});
        if (!/from\s+["']@nyc-tron\//.test(b.code)) here(9, "example does not import from an @nyc-tron specifier");
        if (!b.code.includes(fm.subpath) && !b.code.includes("@nyc-tron/")) here(9, "example imports not from the real specifier");
      }
    }
  } else if (fm.tier === 1) here(9, "tier 1 Example is the placeholder");
  // Install: the Import line names the page's own subpath
  const impLine = (sec.Install ?? "").match(/^- Import: `(.+)`$/m);
  if (!impLine || !impLine[1].includes(`from "${fm.subpath}"`) && !impLine[1].includes(`import "${fm.subpath}"`)) here(2, `Install Import line does not use subpath ${fm.subpath}`);
  // check 10
  const tierLabel = fm.a11yStatus;
  if (!A11Y_VALUES.includes(tierLabel)) here(10, `a11yStatus ${tierLabel} is not one of ${A11Y_VALUES.join(", ")}`);
  if (/^Evidence:/m.test(sec["A11y"] ?? "")) here(10, "Evidence: line on a page that is not verified (verified is reserved for a rendered check)");
  if (fm.tier === 1) {
    const st = a11yJson[it.tier1.name];
    if (!st || A11Y_MAP[st.status] !== tierLabel) here(10, `tier 1 a11yStatus ${tierLabel} != a11y-status.json ${st?.status}`);
  } else if (tierLabel !== a11yScanStatus(it)) here(10, `tier 2 a11yStatus must be unverified, found ${tierLabel}`);
  // check 11
  if (fm.tier === 1) {
    const dd = sec["Do/Don't"] ?? "";
    const parts = dd.split(/^### /m).slice(1);
    const doL = parts.find((x) => /^Do\n/.test(x));
    const dontL = parts.find((x) => /^Don't\n/.test(x));
    const bullets = (x) => (x ? x.split("\n").filter((l) => /^- /.test(l)).map((l) => l.slice(2)) : []);
    const bd = bullets(doL);
    const bn = bullets(dontL);
    if (bd.length < 2) here(11, `Do has ${bd.length} bullets`);
    if (bn.length < 2) here(11, `Don't has ${bn.length} bullets`);
    const rest = p.text.replace(dd, "");
    for (const b of [...bd, ...bn]) {
      const terms = [...b.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      const ids = [...b.matchAll(/\b(?:F|S|GU)\d{1,2}\b/g)].map((m) => m[0]);
      const ok = terms.some((t) => rest.includes(t.replace(/\(\)$/, ""))) || ids.some((i) => rest.includes(i));
      if ((!terms.length && !ids.length) || !ok) here("11b", `bullet names no term that appears elsewhere on the page: ${b.slice(0, 80)}`);
      if (b.length > 260) here("11b", `bullet longer than 260 characters: ${b.slice(0, 60)}`);
      if (/—/.test(b)) here("11b", "em dash in a bullet");
    }
    bump("dodontBullets", bd.length + bn.length);
  }
  // check 12: report
  const un = (p.text.match(/UNVERIFIED/g) ?? []).length;
  if (un) {
    unverifiedMentions += un;
    unverifiedPages++;
  }
  // extras: relative links
  for (const m of p.text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(p.file.split(path.sep).join("/")), href.split("#")[0]));
    if (!exists(target)) here("X2", `broken relative link ${href}`);
  }
  // extras: tokens named in the text
  for (const m of p.text.matchAll(/`((?:color|radius|space|font|leading|border|opacity|scrim|icon|motion|elevation|duration|size|shape)\.[A-Za-z0-9_.]*[A-Za-z0-9_])`/g)) {
    const t = m[1];
    if (/\.(ts|tsx|json|mjs|js|md)$/.test(t)) continue;
    if (!tokenValid(t)) here("X3", `token ${t} named in the page is not in tokens.json`);
  }
}

// SKILL.md and AGENTS.md: every repo path or script they name must exist
{
  const checkPaths = (file, text) => {
    for (const m of text.matchAll(/`([A-Za-z0-9_.\/@-]+\.(?:md|json|mjs|txt|yml|ts|tsx))`/g)) {
      const t = m[1];
      if (/[<*{]/.test(t) || t.startsWith("@") || /^https?:/.test(t)) continue;
      if (!/^(docs|tooling|packages|\.github|skills)\//.test(t) && !/^[A-Za-z0-9_.-]+\.(md|json|txt)$/.test(t)) continue;
      if (/^(Button|App)\./.test(t)) continue;
      if (!exists(t) && !/^(r|docs\/components)\//.test(t)) fail("X5", file, `names ${t}, which does not exist`);
    }
    for (const m of text.matchAll(/node (tooling\/[A-Za-z0-9_./-]+\.mjs)/g)) if (!exists(m[1])) fail("X5", file, `runs ${m[1]}, which does not exist`);
  };
  if (exists("SKILL.md")) {
    const sk = read("SKILL.md");
    if (sk.split("\n").length >= 500) fail("X5", "SKILL.md", "500 lines or more");
    if (!/^---\nname: [a-z0-9-]+\ndescription: .+\n---\n/.test(sk)) fail("X5", "SKILL.md", "frontmatter needs name and description");
    if (exists("skills/nyc-tron-ui/SKILL.md") && read("skills/nyc-tron-ui/SKILL.md") !== sk) fail("X5", "skills/nyc-tron-ui/SKILL.md", "differs from SKILL.md");
    checkPaths("SKILL.md", sk);
    const prim = ["Stack", "Row", "Spacer", "Divider", "Text"].filter((n) => exists(`packages/ui/src/components/layout/${n}.tsx`) || exists(`packages/ui/src/components/${n}.tsx`));
    if (prim.length && /<!-- primitives:planned -->/.test(sk)) fail("X5", "SKILL.md", `says primitives are planned, but ${prim.join(", ")} exist`);
    const nt1 = model.items.filter((i) => i.tier === 1).length;
    if (!sk.includes(`${model.items.length} documentation pages exist: ${nt1} hand-reviewed`)) fail("X5", "SKILL.md", "page counts are stale");
  } else fail("X5", "SKILL.md", "missing");
  if (exists("AGENTS.md")) {
    const ag = read("AGENTS.md");
    const i = ag.indexOf("## Agent-native");
    if (i < 0) fail("X5", "AGENTS.md", "no Agent-native section");
    else checkPaths("AGENTS.md", ag.slice(i));
  }
  for (const f of ["llms.txt", "llms-full.txt"]) if (!exists(f)) fail("X5", f, "missing");
}

// registry.json
let registryNote = "";
if (exists("registry.json")) {
  try {
    const reg = readJson("registry.json");
    const list = reg.items ?? reg.registryItems ?? [];
    const names = new Set(list.map((i) => i.name));
    let n = 0;
    for (const name of names) {
      n++;
      if (!pages.has(name)) fail("X4", name, "registry.json item has no page");
    }
    const pageIds = new Set(pages.keys());
    for (const id of pageIds) if (!names.has(id)) fail("X4", id, "page has no registry.json item");
    registryNote = `registry.json: ${n} items compared with ${pages.size} pages`;
  } catch (e) {
    fail("X4", "registry.json", "cannot parse: " + e.message);
  }
} else registryNote = "NOTICE: registry.json does not exist yet, so the registry-to-page comparison was skipped";

// tsc
let tscNote = `check 9: ${exampleBlocks.length} example blocks parsed; tsc was not run (no --tsc given)`;
if (arg("--tsc")) {
  const out = fs.mkdtempSync(path.join(process.env.TMPDIR ?? "/tmp", "docs-ex-"));
  fs.mkdirSync(out + "/examples");
  for (const b of exampleBlocks) fs.writeFileSync(`${out}/examples/${b.name}.tsx`, b.code);
  fs.symlinkSync(arg("--node-modules"), out + "/node_modules");
  const R = (p) => path.join(ROOT, p);
  fs.writeFileSync(
    out + "/tsconfig.json",
    JSON.stringify({
      extends: R("tsconfig.base.json"),
      compilerOptions: {
        ignoreDeprecations: "6.0", baseUrl: ".", jsxImportSource: "react", types: [], noEmit: true,
        paths: {
          "@nyc-tron/ui": [R("packages/ui/src/index.ts")], "@nyc-tron/ui/components/*": [R("packages/ui/src/components/*")],
          "@nyc-tron/core": [R("packages/core/src/index.ts")], "@nyc-tron/core/*": [R("packages/core/src/*")],
          "@nyc-tron/icons": [R("packages/icons/src/index.ts")], "@nyc-tron/icons/*": [R("packages/icons/src/*")],
          "react-native": ["./node_modules/react-native/types_generated/index.d.ts"], react: ["./node_modules/@types/react"], "react/*": ["./node_modules/@types/react/*"], "*": ["./node_modules/*", "./node_modules/@types/*"],
        },
      },
      include: ["examples/**/*.tsx"],
    }),
  );
  const r = spawnSync("node", [arg("--tsc"), "-p", out + "/tsconfig.json"], {encoding: "utf8", maxBuffer: 1 << 28});
  const errs = (r.stdout + r.stderr).split("\n").filter((l) => l.startsWith("examples/"));
  tscNote = `check 9: ${exampleBlocks.length} example blocks, tsc --noEmit: ${errs.length} errors in examples`;
  for (const e of errs) fail(9, e.split("(")[0], e);
  fs.rmSync(out, {recursive: true, force: true});
}

// Counts typed into prose and the registry ref in the hand-written files must agree with the generated sources
// (registry.json, tier1.json, packages/ui/package.json, tooling/registry/config.json). Check id "counts".
{
  const regItems = readJson("registry.json").items;
  const nSupport = regItems.filter((i) => i.meta?.support).length;
  const nUi = regItems.length - nSupport;
  const nTier1 = readJson(`${AN}/tier1.json`).items.length;
  const nExports = Object.keys(readJson("packages/ui/package.json").exports).length;
  // [file, regex with one capture group, expected value, label]
  const rules = [
    [`${AN}/components-contract.md`, /with the (\d+) ui items/g, nUi, "registry ui items"],
    [`${AN}/04-ux-copy.md`, /the (\d+) tier 1 titles/g, nTier1, "tier 1 pages"],
    [`${AN}/04-ux-copy.md`, /Rules applied to all (\d+):/g, nTier1, "tier 1 pages"],
    ["README.md", /\((\d+) export keys at this commit\)/g, nExports, "@nyc-tron/ui export keys"],
  ];
  for (const [file, re, want, label] of rules) {
    const found = [...read(file).matchAll(re)];
    if (!found.length) fail("counts", file, `pattern ${re} not found, so the ${label} count is no longer checked`);
    for (const m of found) if (Number(m[1]) !== want) fail("counts", file, `says ${m[1]} but ${label} is ${want}`);
  }
  // Every registry URL in SKILL.md and in the live copy must use the configured ref.
  const ref = registryRef();
  for (const file of ["SKILL.md", "skills/nyc-tron-ui/SKILL.md"]) {
    const urls = [...read(file).matchAll(/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\/([^/]+)\//g)];
    if (!urls.length) fail("counts", file, "no raw.githubusercontent.com URL found");
    for (const m of urls) if (m[1] !== REPO || m[2] !== ref) fail("counts", file, `URL uses ${m[1]}@${m[2]}, config.json ref is ${REPO}@${ref}`);
  }
  const comp = readJson("components.json").registries?.["@nyc-tron"] ?? "";
  if (!comp.includes(`/${REPO}/${ref}/r/`)) fail("counts", "components.json", `registry URL ${comp} does not use ref ${ref}`);
  bump("counts", rules.length);
}

const t1n = [...pages.values()].filter((p) => p.it.tier === 1).length;
const summary = {
  pages: pages.size, tier1: t1n, tier2: pages.size - t1n, componentSubpaths: compCount, modulePages: pages.size - compCount,
  failures: failures.length, unverifiedMentions, pagesMentioningUnverified: unverifiedPages, exampleBlocks: exampleBlocks.length, ...counts,
};
if (argv.includes("--json")) console.log(JSON.stringify({summary, failures}, null, 1));
else {
  console.log(`docs check: ${pages.size} pages (tier 1: ${t1n}, tier 2: ${pages.size - t1n}); ${compCount} component subpaths, ${pages.size - compCount} module pages`);
  console.log(`check 12 (reported, not gated): ${unverifiedMentions} UNVERIFIED mentions on ${unverifiedPages} pages`);
  console.log(tscNote);
  console.log(registryNote);
  const byCheck = {};
  for (const f of failures) byCheck[f.check] = (byCheck[f.check] ?? 0) + 1;
  console.log(`failures: ${failures.length}${failures.length ? " by check " + JSON.stringify(byCheck) : ""}`);
  for (const f of failures.slice(0, 40)) console.log(`  [${f.check}] ${f.id}: ${f.msg}`);
  if (failures.length > 40) console.log(`  ... ${failures.length - 40} more`);
}
process.exit(failures.length ? 1 : 0);
