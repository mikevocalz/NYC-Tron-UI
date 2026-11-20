// Counts hardcoded style literals per category and prints exact histograms.
// Usage: node docs/agent-native/audit-literals.mjs [--json]
// File set matches audit_hc.sh: tracked ts/tsx/js/mjs/qml/swift/kt/java/m/mm/cpp/h
// under packages/*, excluding tests, .d.ts, dist, node_modules, generated, licenses, third-party.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execSync("git ls-files packages", { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\n")
  .filter((f) => /\.(tsx?|jsx?|mjs|qml|swift|kt|java|m|mm|cpp|h)$/.test(f))
  .filter((f) => !/(\/tests?\/|\.test\.|\.d\.ts$|\/dist\/|\/node_modules\/|\/generated\/|\/licenses\/|\/third-party\/)/.test(f));

const N = "(-?[0-9]*\\.?[0-9]+)";
const cats = {
  spacing: new RegExp(`\\b(padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingStart|paddingEnd|margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|marginStart|marginEnd|gap|rowGap|columnGap)\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`, "g"),
  radius: new RegExp(`\\b(borderRadius|border(?:Top|Bottom)(?:Left|Right|Start|End)Radius)\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`, "g"),
  fontSize: new RegExp(`\\b(fontSize)\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`, "g"),
  lineHeight: new RegExp(`\\b(lineHeight)\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`, "g"),
  letterSpacing: new RegExp(`\\b(letterSpacing)\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`, "g"),
  duration: new RegExp(`\\b(duration|durationMs|delay|delayMs|timeout)\\s*[:=]\\s*([0-9]+)`, "g"),
  hex: /(#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3,4}\b)/g,
  colorFn: /\b(rgba?|hsla?)\(\s*[0-9][^)]*\)/g,
  borderWidth: new RegExp(`\\b(borderWidth|borderTopWidth|borderBottomWidth|borderLeftWidth|borderRightWidth)\\s*:\\s*${N}`, "g"),
  minSize: new RegExp(`\\b(minWidth|minHeight)\\s*:\\s*${N}`, "g"),
  opacity: /\bopacity\s*:\s*([^,}\n]{1,60})/g,
  androidColor: /(Color\(0x[0-9A-Fa-f]{8}\)|"#[0-9A-Fa-f]{6,8}")/g,
  twArbitrary: /\b((?:p|px|py|m|mx|my|gap|w|h|text|rounded)-\[[0-9.]+(?:px|rem)?\])/g,
};
function record(cat, f, pkg, prop, value) {
  TOTAL[cat] = (TOTAL[cat] ?? 0) + 1;
  hist[cat] ??= {};
  hist[cat][value] ??= { n: 0, files: new Set(), props: {}, byFile: {} };
  const h = hist[cat][value];
  h.n++;
  h.files.add(f);
  h.props[prop] = (h.props[prop] ?? 0) + 1;
  h.byFile[f] = (h.byFile[f] ?? 0) + 1;
  perFile[f] ??= {};
  perFile[f][cat] = (perFile[f][cat] ?? 0) + 1;
  perPkg[pkg] ??= {};
  perPkg[pkg][cat] = (perPkg[pkg][cat] ?? 0) + 1;
}
const TOTAL = {};
const hist = {};
const perFile = {};
const perPkg = {};
for (const f of files) {
  const text = readFileSync(f, "utf8");
  const pkg = f.split("/")[1];
  for (const [cat, re] of Object.entries(cats)) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      if (cat === "androidColor" && !f.endsWith(".kt")) continue;
      if (cat === "opacity") {
        // one entry per numeric literal other than 0 and 1 in the expression
        for (const n of m[1].matchAll(/(?<![\w.])(0?\.[0-9]+)(?![\w.])/g)) record(cat, f, pkg, "opacity", n[1].replace(/^\./, "0."));
        continue;
      }
      const value = cat === "hex" || cat === "twArbitrary" ? m[1].toLowerCase()
        : cat === "androidColor" ? "#" + m[1].replace(/^Color\(0xFF/i, "").replace(/^"#/, "").replace(/[)"]/g, "").toLowerCase()
        : cat === "colorFn" ? m[0].replace(/\s+/g, "")
        : m[2];
      const prop = cat === "hex" || cat === "twArbitrary" || cat === "colorFn" ? cat : m[1];
      record(cat, f, pkg, prop, value);
    }
  }
}
// "total" for ranking counts only the categories decision 10 and the task name.
const SCOPE = ["spacing", "radius", "fontSize", "lineHeight", "letterSpacing", "hex", "colorFn", "duration"];
const out = { fileCount: files.length, total: TOTAL, perPackage: perPkg, histogram: {}, topFiles: [] };
for (const [cat, h] of Object.entries(hist)) {
  out.histogram[cat] = Object.entries(h)
    .map(([value, v]) => ({ value, n: v.n, files: v.files.size, props: v.props, byFile: v.byFile }))
    .sort((a, b) => b.n - a.n || (parseFloat(a.value) - parseFloat(b.value)));
}
out.topFiles = Object.entries(perFile)
  .map(([f, c]) => ({ file: f, total: SCOPE.reduce((a, k) => a + (c[k] ?? 0), 0), ...c }))
  .sort((a, b) => b.total - a.total).slice(0, 25);
console.log(JSON.stringify(out, null, process.argv.includes("--json") ? 0 : 0));
