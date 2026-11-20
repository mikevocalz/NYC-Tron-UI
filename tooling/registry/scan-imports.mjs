// Dependency-free import scanner for the dense TS/TSX sources in this repo.
// A masked copy of the text keeps every character offset but blanks comments and the
// bodies of strings and templates, so words such as "import" inside UI copy are never
// read as a declaration. Specifier literals that follow `from` or `import` stay visible.

const DECL = /(?:^|[;{}\n)])\s*(import|export)\b(?!\s*\()([^;"'`]*?)(["'])([^"'\n]*)\3/g;

export function maskKeepingOffsets(text) {
  const n = text.length;
  const out = text.split("");
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== "\n") out[k] = " "; };
  let i = 0;
  while (i < n) {
    const c = text[i];
    const d = text[i + 1];
    if (c === "/" && d === "/") {
      let j = i;
      while (j < n && text[j] !== "\n") j++;
      blank(i, j);
      i = j;
      continue;
    }
    if (c === "/" && d === "*") {
      const e = text.indexOf("*/", i + 2);
      const j = e < 0 ? n : e + 2;
      blank(i, j);
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && text[j] !== c) {
        if (text[j] === "\\") j++;
        if (text[j] === "\n") break;
        j++;
      }
      const before = text.slice(Math.max(0, i - 12), i);
      if (!/(?:\bfrom|\bimport)\s*$/.test(before)) blank(i + 1, j);
      i = j + 1;
      continue;
    }
    if (c === "`") {
      let j = i + 1;
      let depth = 0;
      while (j < n) {
        if (text[j] === "\\") { j += 2; continue; }
        if (depth === 0 && text[j] === "`") break;
        if (text[j] === "$" && text[j + 1] === "{") { depth++; j += 2; continue; }
        if (depth > 0 && text[j] === "}") { depth--; j++; continue; }
        if (depth > 0 && text[j] === "`") {
          let k = j + 1;
          while (k < n && text[k] !== "`") { if (text[k] === "\\") k++; k++; }
          j = k + 1;
          continue;
        }
        j++;
      }
      blank(i + 1, j);
      i = j + 1;
      continue;
    }
    i++;
  }
  return out.join("");
}

// Every import or export-from declaration with the literal's offsets in the original text.
export function scan(text) {
  const mask = maskKeepingOffsets(text);
  const found = [];
  DECL.lastIndex = 0;
  let m;
  while ((m = DECL.exec(mask))) {
    const kind = m[1];
    const mid = m[2];
    const spec = m[4];
    const end = m.index + m[0].length;
    DECL.lastIndex = end - 1;
    const hasFrom = /\bfrom\s*$/.test(mid);
    if (kind === "export" && !hasFrom) continue;
    if (kind === "import" && !hasFrom && mid.trim() !== "") continue;
    const start = end - 1 - spec.length;
    found.push({ kind, spec, start, end: end - 1, typeOnly: /^\s*type\b/.test(mid) });
  }
  return found;
}

// Module references the declaration scanner above does not read: dynamic import(), import("x").T types and
// require(). A component that uses one would ship an import this gate never resolves, so check-imports
// fails on them. Returns [{form, line}] from the masked text, so comments and strings never match.
const UNSCANNED = [
  ["dynamic import() or import type", /(?<![\w$.])import\s*\(/g],
  ["require()", /(?<![\w$.])require\s*\(/g],
  ["import x = require()", /(?<![\w$.])import\s+[\w$]+\s*=\s*require\b/g],
];
export function unscannedModuleForms(text) {
  const mask = maskKeepingOffsets(text);
  const out = [];
  for (const [form, re] of UNSCANNED) {
    re.lastIndex = 0;
    for (let m; (m = re.exec(mask)); ) out.push({ form, line: mask.slice(0, m.index).split("\n").length });
  }
  return out;
}

export const importSpecifiers = (text) => scan(text).map((d) => d.spec);

// fn(spec) returns a replacement or null to keep it. Everything else stays byte for byte.
export function rewriteSpecifiers(text, fn) {
  let out = "";
  let pos = 0;
  for (const d of scan(text)) {
    const next = fn(d.spec, d);
    if (next == null || next === d.spec) continue;
    out += text.slice(pos, d.start) + next;
    pos = d.end;
  }
  return out + text.slice(pos);
}
