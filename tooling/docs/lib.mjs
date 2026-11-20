// Shared helpers for the docs tooling: repo paths, data loaders, front matter and markdown parsing.
// Node built-ins only. Every function is deterministic: no clock, no randomness, no network.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

export const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "../..");
export const AN = "docs/agent-native";
export const PAGES = "docs/components";
export const PLACEHOLDER = "_Not documented._";
export const SECTIONS = ["Purpose", "Install", "Props", "Variants", "States", "A11y", "Example", "Do/Don't"];
export const SECTION_KEY = {Purpose: "purpose", Install: "install", Props: "props", Variants: "variants", States: "states", A11y: "a11y", Example: "example", "Do/Don't": "dont"};
export const FM_KEYS = ["name", "namespace", "subpath", "tier", "docs", "platforms", "category", "tokens", "registryDependencies", "a11yStatus"];
export const PLATFORM_ORDER = ["ios", "android", "web", "windows", "macos", "qnx"];
export const CATEGORIES = ["primitive", "input", "display", "feedback", "navigation", "overlay", "layout", "data", "shell", "forge"];
// Decision 34: verified is reserved for a rendered check, so no page may carry it. Tier 2 pages are never reviewed: unverified.
export const A11Y_VALUES = ["reviewed-pass", "reviewed-fail", "unverified"];

export const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
export const readJson = (p) => JSON.parse(read(p));
export const exists = (p) => fs.existsSync(path.join(ROOT, p));

// Git ref used in raw.githubusercontent URLs. One variable: `ref` in tooling/registry/config.json.
// It is `main`, a moving ref, until the owner cuts a release tag (decision 45). `set-ref.mjs <ref>` changes it.
export function registryRef() {
  const c = readJson("tooling/registry/config.json");
  if (typeof c.ref !== "string" || !c.ref) throw new Error("tooling/registry/config.json has no `ref`");
  return c.ref;
}
// A ref that looks like a version tag is pinned. Anything else (main, master, a branch) moves.
export const isMovingRef = (ref) => !/^v?\d+\.\d+/.test(ref);
export const refNote = (ref) => isMovingRef(ref)
  ? `Registry URLs use ref \`${ref}\`, a moving ref, until the owner cuts a release tag. They resolve only after this branch is merged to ${ref}. Before that, test against a local server.`
  : `Registry URLs are pinned to tag ${ref}.`;
export const REPO = "mikevocalz/NYC-Tron-UI";
export const rawUrl = (tag, p) => `https://raw.githubusercontent.com/${REPO}/${tag}/${p}`;

// Items the registry cannot install (native-only). Read from the registry config when it exists.
// registry-excluded.json lists native-package subpaths and any excluded ui subpath ({kind, package, subpath, reason, install}).
export function registryExcludedEntries() {
  if (!exists("registry-excluded.json")) return [];
  try {
    return readJson("registry-excluded.json").entries ?? [];
  } catch {
    return [];
  }
}
export function registryExcluded() {
  const out = new Set();
  for (const e of registryExcludedEntries()) {
    if (e.package === "@nyc-tron/ui" && e.subpath) out.add(e.subpath.replace(/^@nyc-tron\/ui\/components\//, ""));
  }
  return out;
}

export const q = (s) => JSON.stringify(s);
export const arr = (a) => "[" + a.map(q).join(", ") + "]";

export function frontMatterText(fm) {
  return [
    "---",
    `name: ${q(fm.name)}`,
    `namespace: ${q(fm.namespace)}`,
    `subpath: ${q(fm.subpath)}`,
    `tier: ${fm.tier}`,
    `docs: ${q(fm.docs)}`,
    `platforms: ${arr(fm.platforms)}`,
    `category: ${q(fm.category)}`,
    `tokens: ${arr(fm.tokens)}`,
    `registryDependencies: ${arr(fm.registryDependencies)}`,
    `a11yStatus: ${q(fm.a11yStatus)}`,
    "---",
  ].join("\n");
}

// Parse a page. Returns {fm, fmKeys, name, sections:[{title, body, line}], errors:[]}.
export function parsePage(text) {
  const errors = [];
  const lines = text.split("\n");
  const fm = {};
  const fmKeys = [];
  let i = 0;
  if (lines[0] !== "---") errors.push("front matter does not start at line 1");
  else {
    i = 1;
    for (; i < lines.length && lines[i] !== "---"; i++) {
      const m = lines[i].match(/^(name|namespace|subpath|tier|docs|platforms|category|tokens|registryDependencies|a11yStatus): (.+)$/);
      if (!m) {
        errors.push(`front matter line ${i + 1} is not a template key: ${lines[i]}`);
        continue;
      }
      fmKeys.push(m[1]);
      try {
        fm[m[1]] = JSON.parse(m[2]);
      } catch {
        errors.push(`front matter ${m[1]} is not valid JSON-style: ${m[2]}`);
      }
    }
    if (i >= lines.length) errors.push("front matter is not closed");
    i++;
  }
  let h1 = null;
  const sections = [];
  let cur = null;
  let fence = false;
  const pre = [];
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (/^```/.test(l)) fence = !fence;
    if (!fence && /^# /.test(l) && h1 === null && !cur) {
      h1 = l.slice(2);
      continue;
    }
    const m = !fence && l.match(/^## (.+)$/);
    if (m) {
      cur = {title: m[1], lines: [], line: i + 1};
      sections.push(cur);
      continue;
    }
    if (cur) cur.lines.push(l);
    else pre.push(l);
  }
  for (const s of sections) s.body = s.lines.join("\n").replace(/^\n+|\n+$/g, "");
  return {fm, fmKeys, name: h1, sections, pre: pre.join("\n").trim(), errors};
}

// ---------------- markdown subset parsing (tables, code) ----------------
export function splitRow(line) {
  const s = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let cur = "";
  let tick = false;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === "\\" && s[k + 1] === "|") {
      cur += "|";
      k++;
    } else if (c === "`") {
      tick = !tick;
      cur += c;
    } else if (c === "|" && !tick) {
      cells.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  cells.push(cur.trim());
  return cells;
}
export const escCell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");

// All pipe tables in a block of markdown: {header, rows, start, end}
export function tablesIn(md) {
  const lines = md.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*\|/.test(lines[i]) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitRow(lines[i]);
      let j = i + 2;
      const rows = [];
      while (j < lines.length && /^\s*\|/.test(lines[j])) rows.push(splitRow(lines[j++]));
      out.push({header, rows, start: i, end: j});
      i = j - 1;
    }
  }
  return out;
}
export function mdTable(header, rows) {
  return [`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(escCell).join(" | ")} |`)].join("\n");
}

export function codeBlocks(md) {
  const out = [];
  const re = /^```(\S*)([^\n]*)\n([\s\S]*?)^```/gm;
  let m;
  while ((m = re.exec(md))) out.push({lang: m[1], info: m[2].trim(), code: m[3], raw: m[0]});
  return out;
}

// ---------------- api-signatures helpers ----------------
let _sig;
export function sigData() {
  if (!_sig) _sig = readJson("docs/api-signatures.json");
  return _sig;
}
export const UI = "@nyc-tron/ui";
export function uiEntries() {
  return sigData().packages[UI];
}
export function decl(ref) {
  return sigData().declarations[ref];
}
export const isComponentName = (n) => /^[A-Z][A-Za-z0-9]*$/.test(n) && /[a-z]/.test(n);

export function declKind(sig) {
  if (!sig) return "other";
  if (/^export declare function /.test(sig)) return "function";
  if (/^export declare const /.test(sig)) return "const";
  if (/^export (declare )?(const )?enum /.test(sig)) return "enum";
  if (/^export interface /.test(sig)) return "interface";
  if (/^export (declare )?type /.test(sig)) return "type";
  if (/^export (declare )?(abstract )?class /.test(sig)) return "class";
  return "other";
}

// Split on top-level commas, ignoring <>, (), {}, [] and strings.
export function splitTop(s, sep = ",") {
  const out = [];
  let depth = 0;
  let cur = "";
  let str = null;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (str) {
      cur += c;
      if (c === str && s[k - 1] !== "\\") str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      str = c;
      cur += c;
      continue;
    }
    if ("<({[".includes(c)) depth++;
    else if (">)}]".includes(c) && !(c === ">" && s[k - 1] === "=")) depth--;
    if (c === sep && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// Parse an interface/type-alias signature into {extends, members:[{name, optional, type}]}.
export function parseProps(sig) {
  if (!sig) return null;
  const lines = sig.split("\n");
  let ext = null;
  const head = lines[0];
  let m = head.match(/^export interface \w+(?:<[^>]*>)?(?: extends (.+?))? \{$/);
  if (m) ext = m[1] ?? null;
  else {
    m = sig.match(/^export type \w+(?:<[^>]*>)? = ([\s\S]*?)\{\n/);
    if (!m) return null;
    const pre = m[1].trim().replace(/&\s*$/, "").trim();
    ext = pre || null;
    if (!/\{\n/.test(sig)) return null;
  }
  const members = [];
  let curm = null;
  for (let k = 1; k < lines.length; k++) {
    const l = lines[k];
    const mm = l.match(/^ {4}(?:readonly )?("[^"]+"|[A-Za-z_$][\w$]*)(\?)?(:|\()(.*)$/);
    if (mm) {
      if (curm) members.push(curm);
      const key = mm[1].replace(/^"|"$/g, "");
      const isMethod = mm[3] === "(";
      curm = {name: key, optional: !!mm[2], text: (isMethod ? "(" : "") + mm[4], method: isMethod};
    } else if (curm && /^ {5,}/.test(l)) curm.text += "\n" + l;
    else if (curm && /^ {4}[})\]]/.test(l)) curm.text += "\n" + l;
    else if (/^\}/.test(l)) break;
  }
  if (curm) members.push(curm);
  for (const mem of members) {
    let t = mem.text.replace(/\s+/g, " ").trim();
    t = t.replace(/;\s*$/, "").trim();
    mem.type = t;
    delete mem.text;
  }
  return {extends: ext, members};
}

// String literal union values from a type alias signature, or null.
export function unionValues(sig) {
  if (!sig) return null;
  const m = sig.match(/^export type \w+ = ((?:\s*"[^"]*"\s*\|?)+);?\s*$/);
  return m ? [...m[1].matchAll(/"([^"]*)"/g)].map((x) => x[1]) : null;
}
export function literalUnion(t) {
  const m = t.match(/^(?:"[^"]*"\s*\|\s*)*"[^"]*"$/);
  return m ? [...t.matchAll(/"([^"]*)"/g)].map((x) => x[1]) : null;
}
