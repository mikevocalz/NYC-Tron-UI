#!/usr/bin/env node
// Static equivalence proof for the tokenization rewrite (decision 40).
//
//   CODEMOD_TOOLS_DIR=<dir with node_modules/ts-morph> node tooling/codemod/prove-equivalence.mjs [--base origin/main] [--json out.json]
//
// For every changed packages/*/src/**/*.{ts,tsx} file: substitute each token reference back with the
// literal it stands for (values read from tokens.json and the sibling <Name>.tokens.ts, never from the
// codemod's own tables), drop the token imports, print the AST with the ts-morph printer, and compare to
// the printed AST of the original from `git show <base>:<path>`. Numeric and string literals are
// canonicalised on both sides first (`.5` == `0.5`, quote style), nothing else is.
//
// It proves the source is the same code modulo token values. It does not prove pixels: token VALUES are
// separately asserted equal to the literals in tokens.map.json.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { createAnalyzer, listSourceFiles } from "./analyze.mjs";
import { EXPORT_ORDER, FAMILY_OF_CATEGORY, TOKEN_COPIES, decodeScopedKey, normalizeColor, readModel, root, sharedTable } from "./token-model.mjs";

const argv = process.argv.slice(2);
const base = argv.includes("--base") ? argv[argv.indexOf("--base") + 1] : "origin/main";
const jsonOut = argv.includes("--json") ? argv[argv.indexOf("--json") + 1] : null;

// Paths under packages/ that may differ from <base> without being codemod output. Each has a reason.
const INFRA = {
  "packages/core/src/tokens.ts": "generated token module",
  "packages/ui/src/tokens.ts": "generated internal copy of the token module (decision 42)",
  "packages/core/package.json": "adds the ./tokens subpath",
  "packages/ui/package.json": "adds the layout primitive subpath exports",
  "packages/ui/src/components/layout/Stack.tsx": "new layout primitive, not codemod output",
  "packages/ui/src/components/layout/Row.tsx": "new layout primitive, not codemod output",
  "packages/ui/src/components/layout/Spacer.tsx": "new layout primitive, not codemod output",
  "packages/ui/src/components/layout/Divider.tsx": "new layout primitive, not codemod output",
  "packages/ui/src/components/layout/Text.tsx": "new layout primitive, not codemod output",
  "packages/ui/src/components/layout/stack-style.ts": "new pure style helper for Stack and Row",
  "packages/ui/tests/layout-primitives.test.mjs": "source-text tests for the new layout primitives",
  "packages/ui/tests/stack-style.test.mjs": "behaviour test for the stack-style helper",
  "packages/ui/tests/contracts.test.mjs": "source-text assertion now accepts size.touch",
  "packages/ui/tests/color-hsv.test.mjs": "source-text assertion now accepts size.touch",
  "packages/ui/tests/shell-inspector.test.mjs": "source-text assertion now accepts size.touch",
};

const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
const failures = [];
const fail = (m) => failures.push(m);
const A = createAnalyzer();
const { tsm } = A;
const { Node, SyntaxKind, ts } = tsm;
const { tokensJson, map } = readModel();
const expected = sharedTable(tokensJson);
const project = A.project;

// ---------- parsing helpers --------------------------------------------------
const parse = (name, text) => project.createSourceFile("/proof/" + name, text, { overwrite: true });
const parseErrors = (sf) => sf.compilerNode.parseDiagnostics?.length ?? 0;
function literalOf(n) {
  if (Node.isNumericLiteral(n)) return Number(n.getLiteralValue());
  if (Node.isStringLiteral(n) || Node.isNoSubstitutionTemplateLiteral(n)) return n.getLiteralText();
  if (Node.isPrefixUnaryExpression(n) && n.getOperatorToken() === SyntaxKind.MinusToken && Node.isNumericLiteral(n.getOperand())) return -Number(n.getOperand().getLiteralValue());
  if (Node.isAsExpression(n) || Node.isParenthesizedExpression(n)) return literalOf(n.getExpression());
  throw new Error("not a literal: " + n.getText());
}
/** `export const <name> = {...} as const` -> Map(key -> value). */
function readTable(sf, exportName) {
  const decl = sf.getVariableDeclaration(exportName);
  if (!decl) return null;
  let init = decl.getInitializer();
  if (!init || !Node.isAsExpression(init) || init.getTypeNode()?.getText() !== "const") throw new Error(`${exportName} is not \`as const\``);
  init = init.getExpression();
  if (!Node.isObjectLiteralExpression(init)) throw new Error(`${exportName} is not an object literal`);
  const out = new Map();
  for (const p of init.getProperties()) {
    if (!Node.isPropertyAssignment(p)) throw new Error(`${exportName}: only plain properties allowed`);
    const nn = p.getNameNode();
    const key = Node.isNumericLiteral(nn) ? String(Number(nn.getLiteralValue())) : Node.isStringLiteral(nn) ? nn.getLiteralText() : nn.getText();
    out.set(key, literalOf(p.getInitializer()));
  }
  return out;
}

// ---------- layer 3: token module and map integrity --------------------------
function checkCopy(rel) {
  const sf = parse("tokens-" + rel.replace(/\//g, "_"), readFileSync(join(root, rel), "utf8"));
  if (parseErrors(sf)) fail(rel + " has parse errors");
  const exported = sf.getVariableStatements().filter((s) => s.isExported()).flatMap((s) => s.getDeclarations().map((d) => d.getName()));
  const want = ["SPACE_UNIT", ...EXPORT_ORDER];
  if (exported.join() !== want.join()) fail(`${rel} exports [${exported}] expected [${want}]`);
  const text = sf.getFullText();
  if (/\b(function|=>|import|require|Math\.|new )\b/.test(text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ""))) fail(rel + " contains logic");
  const table = {};
  for (const fam of EXPORT_ORDER) {
    const t = readTable(sf, fam);
    table[fam] = t;
    const exp = expected[fam] ?? {};
    for (const [k, v] of Object.entries(exp)) if (t.get(k) !== v) fail(`${rel} ${fam}[${k}] = ${t.get(k)} but tokens.json says ${v}`);
    for (const k of t.keys()) if (!(k in exp)) fail(`${rel} ${fam}[${k}] is not in tokens.json`);
  }
  return table;
}
function checkTokenModule() {
  const tables = TOKEN_COPIES.map(checkCopy); // every generated copy must equal tokens.json
  const table = tables[0];
  // tokens.map.json: every on-scale literal equals the value of the token it names
  let checked = 0;
  for (const cat of Object.keys(FAMILY_OF_CATEGORY)) {
    for (const [lit, e] of Object.entries(map.categories[cat].onScale)) {
      const neg = e.token.startsWith("-");
      const name = neg ? e.token.slice(1) : e.token;
      const fam = name.slice(0, name.indexOf("."));
      const rest = name.slice(name.indexOf(".") + 1);
      const key = fam === "opacity" ? String(Math.round(Number(rest.replace("_", ".")) * 100)) : fam === "border" ? rest.replace("_", ".") : rest;
      const tv = table[fam].get(key);
      const lv = Number(lit);
      if (tv === undefined || (neg ? -tv : tv) !== lv) fail(`map ${cat} ${lit} -> ${e.token} but module value is ${tv}`);
      checked++;
    }
  }
  const m44 = table.size.get("touch");
  if (m44 !== Number(Object.keys(map.categories.minSize44.onScale)[0])) fail("size.touch differs from map");
  for (const [lit, e] of Object.entries(map.categories.colorFn.onScale)) {
    const k = e.token.split(".")[1];
    if (normalizeColor(table.scrim.get(k)) !== normalizeColor(lit.split(" @ ")[0])) fail(`scrim ${k} differs from map literal ${lit}`);
    checked++;
  }
  for (const [lit, e] of Object.entries(map.categories.boxShadow.onScale)) {
    const k = e.token.split(".")[1];
    if (normalizeColor(table.elevation.get(k)) !== normalizeColor(lit)) fail(`elevation ${k} differs from map literal ${lit}`);
    checked++;
  }
  return { table, checked };
}
const module_ = checkTokenModule();

// ---------- changed set -------------------------------------------------------
const nameStatus = git("diff", "--name-status", base, "--", "packages").split("\n").filter(Boolean).map((l) => l.split("\t"));
const untracked = git("ls-files", "--others", "--exclude-standard", "packages").split("\n").filter(Boolean).map((f) => ["A", f]);
const changes = [...nameStatus, ...untracked];
const rewritten = [], siblings = [], outside = [];
const isSrc = (f) => /^packages\/[^/]+\/src\/.+\.(ts|tsx)$/.test(f);
for (const [st, f] of changes) {
  if (INFRA[f]) continue;
  if (st === "M" && isSrc(f) && listSourceFiles().includes(f)) rewritten.push(f);
  else if (st === "A" && /^packages\/[^/]+\/src\/.+\.tokens\.ts$/.test(f)) siblings.push(f);
  else outside.push(`${st} ${f}`);
}
for (const o of outside) fail("changed outside the codemod's allowed set: " + o);
const infraSeen = Object.keys(INFRA).filter((f) => changes.some(([, c]) => c === f));

// ---------- layer 1: per-file fold and compare ------------------------------
const canon = (text, name) => {
  const sf = parse(name, text); // name carries the file's own extension (.ts or .tsx)
  const edits = [];
  sf.forEachDescendant((n) => {
    if (Node.isNumericLiteral(n)) {
      const t = n.getText();
      if (!/^[0-9.eE+_-]+$/.test(t)) return;
      const c = String(Number(t.replace(/_/g, "")));
      if (c !== t) edits.push({ s: n.getStart(), e: n.getEnd(), t: c });
    } else if (Node.isStringLiteral(n) && !Node.isJsxAttribute(n.getParent())) {
      const t = JSON.stringify(n.getLiteralText());
      if (t !== n.getText()) edits.push({ s: n.getStart(), e: n.getEnd(), t });
    }
  });
  let out = text;
  for (const e of edits.sort((a, b) => b.s - a.s)) out = out.slice(0, e.s) + e.t + out.slice(e.e);
  return out;
};
const printCanon = (text, name) => { const sf = parse("canon-" + name, canon(text, name)); if (parseErrors(sf)) throw new Error("parse errors in " + name); return sf.print(); };

const tally = { byFamily: {}, refs: 0, byFileKey: new Map() }; // sibling key usage
const usedSiblingKeys = new Map();
const diffs = [];
let filesCompared = 0;
for (const f of rewritten) {
  const cur = readFileSync(join(root, f), "utf8");
  const orig = git("show", `${base}:${f}`);
  const ext = f.endsWith(".tsx") ? ".tsx" : ".ts";
  const sf = parse("cur" + ext, cur);
  if (parseErrors(sf)) { fail(`${f}: rewritten file has parse errors`); continue; }
  // token imports
  const shared = new Map(), sibling = new Map(); // local -> family | local -> Map
  const removals = [];
  for (const d of sf.getImportDeclarations()) {
    const spec = d.getModuleSpecifierValue();
    const pkg = f.split("/")[1];
    const ownCopy = spec.startsWith(".") && posix.normalize(posix.join(dirname(f), spec.replace(/\.ts$/, "") + ".ts")) === `packages/${pkg}/src/tokens.ts`;
    if (ownCopy && !TOKEN_COPIES.includes(`packages/${pkg}/src/tokens.ts`)) fail(`${f}: imports ${spec} but the package has no generated copy`);
    if (spec === "@nyc-tron/core/tokens" || ownCopy) {
      if (spec === "@nyc-tron/core/tokens" && pkg === "ui") fail(`${f}: ui must not import @nyc-tron/core (decision 42)`);
      for (const n of d.getNamedImports()) {
        const fam = n.getName();
        if (!EXPORT_ORDER.includes(fam)) fail(`${f}: imports unknown token export ${fam}`);
        shared.set(n.getAliasNode()?.getText() ?? fam, fam);
      }
      removals.push(d);
    } else if (/^\.\/[^/]+\.tokens(\.ts)?$/.test(spec)) {
      const p = posix.join(dirname(f), spec.endsWith(".ts") ? spec : spec + ".ts");
      const sibSf = existsSync(join(root, p)) ? parse("sib-" + p.replace(/\//g, "_"), readFileSync(join(root, p), "utf8")) : null;
      if (!sibSf) { fail(`${f}: imports missing ${p}`); continue; }
      const t = readTable(sibSf, "tokens");
      for (const n of d.getNamedImports()) { if (n.getName() !== "tokens") fail(`${f}: unexpected import ${n.getName()} from ${spec}`); sibling.set(n.getAliasNode()?.getText() ?? "tokens", { path: p, table: t }); }
      removals.push(d);
    }
  }
  if (!removals.length) { fail(`${f}: changed but has no token import`); continue; }
  const edits = [];
  const importIds = new Set();
  for (const d of removals) for (const n of d.getNamedImports()) importIds.add(n.getNameNode()), n.getAliasNode() && importIds.add(n.getAliasNode());
  const handled = new Set();
  const lookup = (idNode, keyText, node) => {
    const local = idNode.getText();
    if (shared.has(local)) {
      const fam = shared.get(local);
      const v = module_.table[fam].get(keyText);
      if (v === undefined) { fail(`${f}:${node.getStartLineNumber()} ${local}[${keyText}] is not a token`); return null; }
      const expFam = expected[fam]?.[keyText];
      if (expFam !== v) fail(`${f}: ${fam}[${keyText}] module/json mismatch`);
      tally.byFamily[fam] = (tally.byFamily[fam] ?? 0) + 1;
      return v;
    }
    if (sibling.has(local)) {
      const s = sibling.get(local);
      const v = s.table.get(keyText);
      if (v === undefined) { fail(`${f}:${node.getStartLineNumber()} ${local}.${keyText} missing in ${s.path}`); return null; }
      const dec = decodeScopedKey(keyText);
      if (dec !== null && dec !== v) fail(`${s.path}: key ${keyText} decodes to ${dec} but holds ${v}`);
      const fam = /^[a-z]+/.exec(keyText)[0];
      tally.byFamily[fam + "(scoped)"] = (tally.byFamily[fam + "(scoped)"] ?? 0) + 1;
      (usedSiblingKeys.get(s.path) ?? usedSiblingKeys.set(s.path, new Set()).get(s.path)).add(keyText);
      return v;
    }
    return undefined;
  };
  sf.forEachDescendant((n) => {
    if (Node.isElementAccessExpression(n) && Node.isIdentifier(n.getExpression())) {
      const arg = n.getArgumentExpression();
      const v = lookup(n.getExpression(), Node.isNumericLiteral(arg) ? String(Number(arg.getLiteralValue())) : arg?.getText(), n);
      if (v === undefined) return;
      if (v !== null) edits.push({ s: n.getStart(), e: n.getEnd(), t: typeof v === "number" ? String(v) : JSON.stringify(v) });
      handled.add(n.getExpression());
    } else if (Node.isPropertyAccessExpression(n) && Node.isIdentifier(n.getExpression())) {
      const v = lookup(n.getExpression(), n.getName(), n);
      if (v === undefined) return;
      if (v !== null) edits.push({ s: n.getStart(), e: n.getEnd(), t: typeof v === "number" ? String(v) : JSON.stringify(v) });
      handled.add(n.getExpression());
    }
  });
  // no shadowing or stray use: every other occurrence of an imported local name must be the import itself
  const locals = new Set([...shared.keys(), ...sibling.keys()]);
  for (const id of sf.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (!locals.has(id.getText()) || handled.has(id) || importIds.has(id)) continue;
    const p = id.getParent();
    const isName = (Node.isPropertyAssignment(p) && p.getNameNode() === id) || (Node.isPropertyAccessExpression(p) && p.getNameNode() === id) || (Node.isJsxAttribute(p) && p.getNameNode() === id) || ((Node.isPropertySignature(p) || Node.isPropertyDeclaration(p)) && p.getNameNode() === id) || (Node.isBindingElement(p) && p.getPropertyNameNode() === id);
    if (!isName) fail(`${f}:${id.getStartLineNumber()} identifier ${id.getText()} is used outside a token reference (shadowing or misuse)`);
  }
  for (const d of removals) edits.push({ s: d.getStart(), e: d.getEnd(), t: "" });
  let folded = cur;
  for (const e of edits.sort((a, b) => b.s - a.s)) folded = folded.slice(0, e.s) + e.t + folded.slice(e.e);
  let a, b;
  try { a = printCanon(orig, "orig" + ext); b = printCanon(folded, "folded" + ext); } catch (e) { fail(`${f}: ${e.message}`); continue; }
  filesCompared++;
  if (a !== b) {
    const la = a.split("\n"), lb = b.split("\n");
    let i = 0; while (i < la.length && la[i] === lb[i]) i++;
    diffs.push({ file: f, line: i + 1, original: la[i], folded: lb[i] });
    fail(`${f}: folded AST differs at printed line ${i + 1}`);
  }
  tally.refs += edits.length - removals.length;
}

// sibling files: header, key usage, ownership
const expectedSiblings = new Set(rewritten.map((f) => A.tokensSiblingPath(f)).filter((p) => siblings.includes(p)));
for (const s of siblings) {
  const sf = parse("sib.ts", readFileSync(join(root, s), "utf8"));
  if (parseErrors(sf)) fail(`${s}: parse errors`);
  const t = readTable(sf, "tokens");
  const used = usedSiblingKeys.get(s) ?? new Set();
  for (const [k, v] of t) {
    if (!used.has(k)) fail(`${s}: key ${k} is never referenced`);
    const dec = decodeScopedKey(k);
    if (dec === null) { // colour key: must match the map's scoped colour literal
      const lit = Object.keys(map.categories.colorFn.offScale).find((x) => x === v);
      if (!lit) fail(`${s}: ${k} = ${v} is not a mapped colour literal`);
    } else if (dec !== v) fail(`${s}: ${k} holds ${v}, encoding says ${dec}`);
  }
  if (!expectedSiblings.has(s)) fail(`${s}: no rewritten file owns this sibling`);
}

// ---------- layer 2: reconcile counts with tokens.map.json -------------------
const recon = {};
for (const cat of Object.keys(FAMILY_OF_CATEGORY)) recon[cat] = { mapTotal: map.categories[cat].total, replaced: 0 };
recon.colorFn = { mapTotal: map.categories.colorFn.total, replaced: (tally.byFamily.scrim ?? 0) + (tally.byFamily.elevation ?? 0) + (tally.byFamily["color(scoped)"] ?? 0) };
recon.minSize44 = { mapTotal: map.categories.minSize44.total, replaced: tally.byFamily.size ?? 0 };
for (const [cat, fam] of Object.entries(FAMILY_OF_CATEGORY)) recon[cat].replaced = (tally.byFamily[fam] ?? 0) + (tally.byFamily[fam + "(scoped)"] ?? 0);

// ---------- idempotence and what is left ------------------------------------
const left = {};
let stillRewritable = 0;
for (const f of listSourceFiles()) {
  const a = A.analyze(f, readFileSync(join(root, f), "utf8"));
  stillRewritable += a.pending.length;
  for (const l of a.left) left[`${l.category}:${l.reason}`] = (left[`${l.category}:${l.reason}`] ?? 0) + 1;
  A.forget(f);
}
if (stillRewritable) fail(`${stillRewritable} literals are still rewritable (codemod not idempotent)`);

const result = {
  base, headTree: git("rev-parse", "--short", "HEAD").trim(),
  filesScanned: listSourceFiles().length, filesChanged: rewritten.length, siblingFiles: siblings.length,
  filesCompared, filesWithAnyDiff: diffs.length, outsideAllowedSet: outside, infraChangedAsExpected: infraSeen,
  tokenReferencesFolded: tally.refs, replacedByFamily: tally.byFamily, reconcileWithMap: recon,
  mapChecksPassed: module_.checked, literalsLeftByReason: left, stillRewritable, diffs, failures,
};
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(result, null, 1) + "\n");
console.log(JSON.stringify(result, null, 1));
if (failures.length) { console.error(`\nFAILED: ${failures.length} problem(s)`); process.exit(1); }
console.log("\nOK: every changed file folds back to its original AST; token values match tokens.json and tokens.map.json");
