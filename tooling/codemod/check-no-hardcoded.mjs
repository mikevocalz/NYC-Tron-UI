#!/usr/bin/env node
// CI gate (regex only): fails when a numeric style literal, a hex colour or an rgba()/hsla() literal sits in
// packages/*/src/**/*.{ts,tsx} outside tooling/codemod/allowlist.json. Needs Node and git only.
//
//   node tooling/codemod/check-no-hardcoded.mjs [--list] [--print-allowlist]
//
// Scope, matching the codemod: padding*, margin*, gap, rowGap, columnGap, borderRadius and corner
// variants, fontSize, lineHeight, borderWidth variants, opacity (other than 0 and 1), minWidth and
// minHeight equal to 44, hex colours, rgba()/hsla() with a numeric first argument. It reads value
// positions only: a bare number, a negated number, or a branch of ?: && || ??. Numbers inside
// arithmetic or call arguments (`size / 2`, `Math.min(n * 16, 128)`) are not literals of the property.
// Native code (Kotlin, Swift, C++) is out of scope (decision 38). Width, height, flex and zIndex are
// not tokenised (02-design-system.md section 4.5) and are not checked.
//
// The allowlist maps a file to {reason, max}. A file may hold at most `max` hits. More fails, fewer
// prints a notice so the entry can be lowered. An entry for a file with no hits is also reported.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = new Set(process.argv.slice(2));
const map = JSON.parse(readFileSync(join(root, "docs/agent-native/tokens.map.json"), "utf8")).categories;
const allow = JSON.parse(readFileSync(join(root, "tooling/codemod/allowlist.json"), "utf8"));

const PROPS = {
  spacing: "padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingStart|paddingEnd|margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|marginStart|marginEnd|gap|rowGap|columnGap",
  radius: "borderRadius|border(?:Top|Bottom)(?:Left|Right|Start|End)Radius",
  fontSize: "fontSize",
  lineHeight: "lineHeight",
  borderWidth: "borderWidth|borderTopWidth|borderBottomWidth|borderLeftWidth|borderRightWidth",
  opacity: "opacity",
  minSize: "minWidth|minHeight",
};
// A zero is exempt where the map has no zero token (radius 0, font 0, line height 0); opacity 0 and 1 are exempt.
const zeroHasToken = (cat) => map[cat]?.onScale?.["0"] !== undefined;

export function listFiles() {
  return execFileSync("git", ["ls-files", "packages"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 }).split("\n")
    .filter((f) => /^packages\/[^/]+\/src\/.+\.(ts|tsx)$/.test(f))
    .filter((f) => !/(\.d\.ts$|\.test\.|\.spec\.|\/tests?\/|\/generated\/|\/node_modules\/|\/dist\/|\.tokens\.ts$|^packages\/(?:core|ui)\/src\/tokens\.ts$)/.test(f));
}

/** Blanks comments, keeps strings (hex and rgba hits live in strings), keeps offsets and newlines. */
export function blankComments(src) {
  let out = "", i = 0, q = null;
  const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (q) {
      out += c;
      if (c === "\\") { out += src[i + 1] ?? ""; i += 2; continue; }
      if (c === q) q = null;
      i++; continue;
    }
    if (c === "/" && d === "/") { while (i < n && src[i] !== "\n") { out += " "; i++; } continue; }
    if (c === "/" && d === "*") { while (i < n && !(src[i] === "*" && src[i + 1] === "/")) { out += src[i] === "\n" ? "\n" : " "; i++; } out += "  "; i += 2; continue; }
    if (c === '"' || c === "'" || c === "`") q = c;
    out += c; i++;
  }
  return out;
}

/** Numeric literals in value position of the expression that follows `prop:` (bare, negated, or a ?: && || ?? branch). */
function valueLiterals(expr) {
  const out = [];
  // classify each open bracket so a number inside a call, array or object is not a value of the property
  const stack = [];
  const kindAt = new Array(expr.length);
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === "(") { let j = i - 1; while (j >= 0 && expr[j] === " ") j--; stack.push(j >= 0 && /[\w$\])>]/.test(expr[j]) ? "call" : "group"); }
    else if (c === "[") stack.push("index");
    else if (c === "{") stack.push("object");
    else if (c === ")" || c === "]" || c === "}") stack.pop();
    kindAt[i] = stack.every((k) => k === "group");
  }
  const re = /(-?)(\d+\.?\d*|\.\d+)(?![\w.])/g;
  for (let m; (m = re.exec(expr)); ) {
    const start = m.index;
    if (!kindAt[start]) continue;
    if (start > 0 && /[\w$.]/.test(expr[start - 1])) continue;
    let b = start - 1; while (b >= 0 && expr[b] === " ") b--;
    const prev = b >= 0 ? expr[b] : "", prev2 = b >= 1 ? expr[b - 1] : "";
    const operator = prev === ":" || prev === "?" || prev === "(" || (prev === "&" && prev2 === "&") || (prev === "|" && prev2 === "|") || b < 0;
    if (!operator) continue;
    let a = start + m[0].length; while (a < expr.length && expr[a] === " ") a++;
    const next = expr[a] ?? "";
    if (!(next === "" || next === ":" || next === ")" || next === "," || next === "}" || next === ";" || next === "|" && expr[a + 1] === "|" || next === "?" && expr[a + 1] === "?")) continue;
    out.push(Number(m[1] + m[2]));
  }
  return out;
}
function exprAfter(text, from) {
  // up to the first , } ; or newline at depth 0
  let depth = 0, i = from;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") { if (depth === 0) break; depth--; }
    else if ((c === "," || c === ";" || c === "\n") && depth === 0) break;
  }
  return text.slice(from, i);
}

export function scan(file, rawText) {
  const text = blankComments(rawText);
  const hits = [];
  const lineOf = (idx) => text.slice(0, idx).split("\n").length;
  for (const [cat, props] of Object.entries(PROPS)) {
    const re = new RegExp(`(?<![\\w$.])(?:${props})\\s*:\\s*`, "g");
    for (let m; (m = re.exec(text)); ) {
      // `cond ? gap : 0` has an identifier named like a property before the colon: not a style key
      let b = m.index - 1; while (b >= 0 && /\s/.test(text[b])) b--;
      if (b >= 0 && !/[{,(;\[]/.test(text[b]) && !(text[b] === ">" )) continue;
      const expr = exprAfter(text, m.index + m[0].length);
      for (const v of valueLiterals(expr)) {
        if (cat === "opacity" && (v === 0 || v === 1)) continue;
        if (cat === "minSize" && v !== 44) continue;
        if (v === 0 && ["radius", "fontSize", "lineHeight"].includes(cat) && !zeroHasToken(cat)) continue;
        hits.push({ kind: cat, line: lineOf(m.index), text: `${m[0].trim()}${expr.trim().slice(0, 60)}` });
        break; // one hit per property occurrence keeps counts stable when a ternary has two branches
      }
    }
  }
  const hex = /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
  for (let m; (m = hex.exec(text)); ) {
    // only inside a string literal on its line: crude check that an odd number of quotes precede
    const ls = text.lastIndexOf("\n", m.index) + 1;
    const before = text.slice(ls, m.index);
    const quotes = (before.match(/["'`]/g) ?? []).length;
    if (quotes % 2 === 1) hits.push({ kind: "hex", line: lineOf(m.index), text: m[0] });
  }
  const fn = /\b(?:rgba?|hsla?)\(\s*[0-9]/g;
  for (let m; (m = fn.exec(text)); ) hits.push({ kind: "colorFn", line: lineOf(m.index), text: text.slice(m.index, m.index + 30) });
  return hits;
}

const mode = "regex";
const results = {};
for (const f of listFiles()) {
  const hits = scan(f, readFileSync(join(root, f), "utf8"));
  if (hits.length) results[f] = hits;
}

if (args.has("--print-allowlist")) {
  const out = Object.fromEntries(Object.entries(results).sort().map(([f, h]) => [f, { reason: "TODO", max: h.length, kinds: [...new Set(h.map((x) => x.kind))] }]));
  console.log(JSON.stringify({ version: 1, files: out }, null, 1));
  process.exit(0);
}

const problems = [], notices = [];
const counts = {};
let allowlisted = 0, total = 0;
for (const [f, hits] of Object.entries(results)) {
  total += hits.length;
  const entry = allow.files?.[f];
  if (!entry) {
    problems.push(`${f}: ${hits.length} hardcoded value(s) and the file is not in tooling/codemod/allowlist.json\n` + hits.slice(0, 5).map((h) => `    ${f}:${h.line} [${h.kind}] ${h.text}`).join("\n"));
    for (const h of hits) counts[h.kind] = (counts[h.kind] ?? 0) + 1;
    continue;
  }
  allowlisted += hits.length;
  if (!entry.reason || entry.reason === "TODO") problems.push(`${f}: allowlist entry has no reason`);
  if (hits.length > entry.max) problems.push(`${f}: ${hits.length} hits exceeds allowlist max ${entry.max}\n` + hits.map((h) => `    ${f}:${h.line} [${h.kind}] ${h.text}`).join("\n"));
  else if (hits.length < entry.max) notices.push(`${f}: ${hits.length} hits, allowlist max ${entry.max}, lower it`);
}
for (const f of Object.keys(allow.files ?? {})) if (!results[f]) notices.push(`${f}: allowlisted but has no hits, remove the entry`);

if (args.has("--list")) for (const [f, h] of Object.entries(results)) for (const x of h) console.log(`${f}:${x.line} [${x.kind}] ${x.text}`);
const files = listFiles().length;
console.log(`check-no-hardcoded (${mode} mode): scanned ${files} files, ${total} hit(s): ${total - allowlisted} not allowlisted, ${allowlisted} allowlisted in ${Object.keys(allow.files ?? {}).length} file entries`);
for (const [k, v] of Object.entries(counts)) console.log(`  not allowlisted ${k}: ${v}`);
for (const n of notices) console.log("  notice: " + n);
if (problems.length) { console.error("\n" + problems.join("\n")); console.error(`\nFAILED: ${problems.length} problem(s). Use a token from @nyc-tron/core/tokens or add a reasoned entry to tooling/codemod/allowlist.json.`); process.exit(1); }
console.log("OK");
