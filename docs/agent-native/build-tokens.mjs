// Derives docs/agent-native/tokens.json, tokens.map.json and the doc tables
// from the literal histogram. Usage:
//   node docs/agent-native/audit-literals.mjs > /tmp/lit.json
//   node docs/agent-native/build-tokens.mjs /tmp/lit.json docs/agent-native /tmp/frag.json
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const [, , litPath, outDir, fragPath] = process.argv;
const lit = JSON.parse(readFileSync(litPath, "utf8"));
const H = lit.histogram;

// Step rule, applied to every category: a value is a scale step when it occurs
// at least MIN_N times in at least MIN_FILES files. Exceptions are listed.
const MIN_N = 3, MIN_FILES = 2;
const EXCEPTIONS = { radius: { "9999": "full" } };
const val = (x) => (x.startsWith("0.") || x.startsWith(".") ? x : x);
const isStep = (cat, x) => (EXCEPTIONS[cat]?.[x.value] !== undefined) || (x.n >= MIN_N && x.files >= MIN_FILES);

const cats = {
  spacing: { prefix: "space", unit: "px", neg: true },
  radius: { prefix: "radius", unit: "px" },
  fontSize: { prefix: "font", unit: "px" },
  lineHeight: { prefix: "leading", unit: "px" },
  borderWidth: { prefix: "border", unit: "px" },
  opacity: { prefix: "opacity", unit: "ratio" },
};
// Spacing keys are unit multiples (decision 14): key = px / SPACE_UNIT, so 8px is space.2 and 6px is space.1.5.
const SPACE_UNIT = 4;
const spaceKey = (v) => String(parseFloat(v) / SPACE_UNIT);
const tokenName = (cat, v) => {
  const c = cats[cat];
  if (cat === "spacing") return `space.${spaceKey(v)}`;
  const ex = EXCEPTIONS[cat]?.[v];
  return `${c.prefix}.${ex ?? v.replace(".", "_")}`;
};
const offPattern = (cat, c, v) => cat === "spacing" ? `<Component>.space.${v.startsWith("-") ? "n" : ""}${spaceKey(v.replace(/^-/, "")).replace(".", "_")}` : `<Component>.${c.prefix}.${v.replace("-", "n").replace(".", "_")}`;
const pad = (s, n) => String(s).padEnd(n);
const comp = (f) => basename(f).replace(/\.(native|web|qt|shared)?\.?(tsx|ts|mjs|js|kt)$/, "");
const isUi = (f) => f.startsWith("packages/ui/");

const tokens = [];
const map = { generated: "build-tokens.mjs", rule: `step iff n>=${MIN_N} and files>=${MIN_FILES}; exceptions ${JSON.stringify(EXCEPTIONS)}`, categories: {} };
const frag = {};
const summary = {};

// ---- existing tokens -------------------------------------------------------
const refLight = { primary: "#1f5fd1", onPrimary: "#ffffff", surfaceRaised: "#ffffff", surfaceSunken: "#f1f3f6", border: "#c9ced6", text: "#15181d", textMuted: "#5a626e", danger: "#b42318", onDanger: "#ffffff", accent: "#1f7a6d", info: "#1d5fa8", success: "#1e7a3c", focus: "#1f5fd1" };
const refDark = { primary: "#7aa7ff", onPrimary: "#0b1730", surfaceRaised: "#1b1f26", surfaceSunken: "#12151a", border: "#39404b", text: "#e8ebf0", textMuted: "#a3abb7", danger: "#ff8a80", onDanger: "#2b0703", accent: "#5fd0bf", info: "#8ab8ff", success: "#6fd08c", focus: "#7aa7ff" };
const cssName = { primary: "primary", onPrimary: "on-primary", surfaceRaised: "surface-raised", surfaceSunken: "surface-sunken", border: "border", text: "text", textMuted: "text-muted", danger: "danger", onDanger: "on-danger", accent: "accent", info: "info", success: "success", focus: "focus" };
const optional = new Set(["danger", "onDanger", "accent", "info", "success"]);
for (const [k, css] of Object.entries(cssName)) {
  tokens.push({ name: `color.${k}`, cssVariable: `--color-${css}`, category: "color", status: "existing", required: !optional.has(k), value: { reference_light: refLight[k], reference_dark: refDark[k] }, source: "packages/core/src/theme.ts:TRON_THEME_TOKENS.colors; docs/THEME_TOKENS.md (reference values)" });
}
tokens.push({ name: "radius.control", cssVariable: "--radius-control", category: "radius", status: "existing", value: { reference: 8, infrax: 4, unit: "px" }, source: "packages/core/src/theme.ts:shape.controlRadius" });
tokens.push({ name: "radius.card", cssVariable: "--radius-card", category: "radius", status: "existing", value: { reference: 12, infrax: 6, unit: "px" }, source: "packages/core/src/theme.ts:shape.cardRadius" });
tokens.push({ name: "shape.borderWidth", cssVariable: null, category: "border", status: "existing", value: { infrax: 1, unit: "px" }, source: "packages/core/src/theme.ts:shape.borderWidth (native-only)" });
tokens.push({ name: "density", cssVariable: null, category: "density", status: "existing", value: { allowed: ["comfortable", "compact", "touch"], infrax: "comfortable" }, source: "packages/core/src/theme.ts:density (native-only)" });
tokens.push({ name: "motion.fastMs", cssVariable: null, category: "motion", status: "existing", value: { infrax: 120, unit: "ms" }, source: "packages/core/src/theme.ts:motion.fastMs; read by no component" });
tokens.push({ name: "motion.standardMs", cssVariable: null, category: "motion", status: "existing", value: { infrax: 240, unit: "ms" }, source: "packages/core/src/theme.ts:motion.standardMs; read by no component" });
for (const [k, v] of Object.entries({ xs: 12, sm: 16, toolbar: 20, default: 24, touch: 28, feature: 32, hero: 48 })) tokens.push({ name: `icon.size.${k}`, cssVariable: null, category: "icon-size", status: "existing", value: { value: v, unit: "px" }, source: "packages/icons/src/tokens.js:iconSizes" });
tokens.push({ name: "icon.stroke.width", cssVariable: null, category: "icon-stroke", status: "existing", value: { value: 2.35, viewBox: 24 }, source: "packages/icons/src/tokens.js:iconStroke" });
for (const [k, v] of Object.entries({ hoverMs: 120, pressMs: 110, selectMs: 225, deselectMs: 175, successMs: 320, errorMs: 240, loadingMs: 850 })) tokens.push({ name: `icon.motion.${k}`, cssVariable: null, category: "duration", status: "existing", value: { value: v, unit: "ms" }, source: "packages/icons/src/tokens.js:iconMotion" });
tokens.push({ name: "icon.motion.pressScale", cssVariable: null, category: "scale", status: "existing", value: { value: 0.9 }, source: "packages/icons/src/tokens.js:iconMotion" });
tokens.push({ name: "icon.motion.selectedScale", cssVariable: null, category: "scale", status: "existing", value: { value: 1.075 }, source: "packages/icons/src/tokens.js:iconMotion" });

// ---- proposed scales -------------------------------------------------------
const steps = {}; // cat -> sorted step values
const off = {}; // cat -> [{value,n,files,byFile}]
for (const [cat, c] of Object.entries(cats)) {
  const all = H[cat];
  const total = all.reduce((s, x) => s + x.n, 0);
  const negSteps = new Set();
  const posStepVals = new Set(all.filter((x) => !x.value.startsWith("-") && isStep(cat, x)).map((x) => x.value));
  const stepList = [], offList = [], negMapped = [];
  for (const x of all) {
    const neg = x.value.startsWith("-");
    if (neg && c.neg && posStepVals.has(x.value.slice(1))) { negMapped.push(x); continue; }
    if (!neg && isStep(cat, x)) stepList.push(x); else offList.push(x);
  }
  stepList.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  steps[cat] = stepList; off[cat] = offList;
  const covered = stepList.reduce((s, x) => s + x.n, 0) + negMapped.reduce((s, x) => s + x.n, 0);
  summary[cat] = { total, distinct: all.length, steps: stepList.length, covered, off: total - covered, offDistinct: offList.length };
  const uiN = (x) => Object.entries(x.byFile).filter(([f]) => isUi(f)).reduce((s, [, n]) => s + n, 0);
  for (const x of stepList) tokens.push({ name: tokenName(cat, x.value), cssVariable: null, category: cat, status: "proposed", value: { value: parseFloat(x.value), unit: c.unit }, source: `histogram: ${x.n} literals in ${x.files} files`, occurrences: x.n, files: x.files });
  map.categories[cat] = {
    properties: [...new Set(all.flatMap((x) => Object.keys(x.props)))].sort(),
    total, onScale: Object.fromEntries([...stepList.map((x) => [x.value, { token: tokenName(cat, x.value), occurrences: x.n, files: x.files }]), ...negMapped.map((x) => [x.value, { token: "-" + tokenName(cat, x.value.slice(1)), occurrences: x.n, files: x.files }])]),
    offScale: Object.fromEntries(offList.map((x) => [x.value, { occurrences: x.n, files: x.files, tokenPattern: offPattern(cat, c, x.value), byFile: Object.fromEntries(Object.entries(x.byFile).sort()) }])),
  };
  // markdown histogram
  const rows = [...all].sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  frag["hist_" + cat] = "| literal | all pkgs | ui only | files | on scale | token |\n|---:|---:|---:|---:|:---:|---|\n" + rows.map((x) => {
    const neg = x.value.startsWith("-");
    const on = (!neg && isStep(cat, x)) || (neg && c.neg && posStepVals.has(x.value.slice(1)));
    return `| ${x.value} | ${x.n} | ${uiN(x)} | ${x.files} | ${on ? "yes" : "no"} | ${on ? "`" + (neg ? "-" : "") + tokenName(cat, neg ? x.value.slice(1) : x.value) + "`" : ""} |`;
  }).join("\n");
  frag["steps_" + cat] = stepList.map((x) => x.value).join(", ") + (negMapped.length ? " (and negatives " + negMapped.map((x) => x.value).join(", ") + ")" : "");
  frag["off_" + cat] = "| literal | count | files | component-scoped token pattern |\n|---:|---:|---:|---|\n" + [...offList].sort((a, b) => b.n - a.n).map((x) => `| ${x.value} | ${x.n} | ${x.files} | \`${offPattern(cat, c, x.value)}\` |`).join("\n");
}

// ---- colour-like literals --------------------------------------------------
const colorFn = H.colorFn;
// Each entry: literal, token, the single file it lives in. rgba() inside the two
// boxShadow strings in CanvasCompareView is covered by elevation.1 / elevation.2.
const scrimTokens = [
  ["rgba(0,0,0,0.5)", "scrim.50", "packages/ui/src/components/forge/devices/DevicePairingDialog.tsx"],
  ["rgba(0,0,0,0.25)", "scrim.25", "packages/ui/src/components/navigation/CollapsibleDrawer.tsx"],
  ["rgba(0,0,0,0.18)", "scrim.18", "packages/panes/src/components/AdaptivePaneHost.tsx"],
  ["rgba(0,0,0,0.12)", "scrim.12", "packages/panes/src/components/AdaptivePaneHost.tsx"],
];
map.categories.colorFn = { total: colorFn.reduce((s, x) => s + x.n, 0), onScale: {}, offScale: {}, insideBoxShadow: ["rgba(0,0,0,0.25) and rgba(0,0,0,0.18) in CanvasCompareView.tsx, replaced as part of elevation.1 and elevation.2"], excludedDataFormatters: ["packages/ui/src/components/forge/slides/slide-model.ts:52", "packages/ui/src/components/forge/vector/vector-types.ts:150 and :148 (template strings that format document colours, not theme values)"] };
for (const [lit_, t, f] of scrimTokens) {
  map.categories.colorFn.onScale[lit_ + " @ " + basename(f)] = { token: t, occurrences: 1, files: 1, file: f };
  tokens.push({ name: t, cssVariable: null, category: "scrim", status: "proposed", value: { value: lit_ }, source: f, occurrences: 1, files: 1 });
}
const brush = colorFn.find((x) => x.value === "rgba(80,180,255,0.5)");
map.categories.colorFn.offScale[brush.value] = { token: "PhotoBrushSurface.color.brushPreview", occurrences: 1, files: 1, file: Object.keys(brush.byFile)[0] };
tokens.push({ name: "PhotoBrushSurface.color.brushPreview", cssVariable: null, category: "color-literal", status: "proposed-scoped", value: { value: brush.value }, source: Object.keys(brush.byFile)[0], occurrences: 1, files: 1 });
const shadows = [["elevation.1", "0 1px 3px rgba(0,0,0,0.25)", "packages/ui/src/components/forge/layers/CanvasCompareView.tsx:188"], ["elevation.2", "0 4px 12px rgba(0,0,0,0.18)", "packages/ui/src/components/forge/layers/CanvasCompareView.tsx:217"]];
tokens.push({ name: "elevation.0", cssVariable: null, category: "elevation", status: "proposed", value: { boxShadow: "none" }, source: "no literal; absence of shadow", occurrences: 0, files: 0 });
for (const [n, v, s] of shadows) tokens.push({ name: n, cssVariable: null, category: "elevation", status: "proposed", value: { boxShadow: v }, source: s, occurrences: 1, files: 1 });
map.categories.boxShadow = { total: 2, onScale: { "0 1px 3px rgba(0,0,0,0.25)": { token: "elevation.1", occurrences: 1, files: 1 }, "0 4px 12px rgba(0,0,0,0.18)": { token: "elevation.2", occurrences: 1, files: 1 } }, offScale: {} };

// android defaults
const and = H.androidColor;
map.categories.androidHex = { total: and.reduce((s, x) => s + x.n, 0), note: "Kotlin literals, `\"#rrggbb\"` and `Color(0xFFrrggbb)` forms normalised", onScale: {}, offScale: {} };
const andName = { "#8b5cf6": "TronNativeDefaults.accent", "#f5f5f7": "TronNativeDefaults.knobText", "#13131a": "TronNativeDefaults.padSurface", "#8a8a99": "TronNativeDefaults.chartAxis" };
for (const x of and) { map.categories.androidHex.offScale[x.value] = { token: andName[x.value], occurrences: x.n, files: x.files, byFile: x.byFile }; }
for (const [v, n] of Object.entries(andName)) { const x = and.find((y) => y.value === v); tokens.push({ name: n, cssVariable: null, category: "native-default", status: "proposed-scoped", value: { value: v }, source: Object.keys(x.byFile).join(", "), occurrences: x.n, files: x.files }); }

// touch target, duration
const minSize = H.minSize.find((x) => x.value === "44");
tokens.push({ name: "size.touch", cssVariable: null, category: "size", status: "proposed", value: { value: 44, unit: "px" }, source: `minWidth/minHeight: 44, ${minSize.n} literals in ${minSize.files} files`, occurrences: minSize.n, files: minSize.files });
map.categories.minSize44 = { total: minSize.n, onScale: { "44": { token: "size.touch", occurrences: minSize.n, files: minSize.files } }, properties: Object.keys(minSize.props) };
for (const [k, v] of Object.entries({ fast: "motion.fastMs", standard: "motion.standardMs" })) tokens.push({ name: `duration.${k}`, cssVariable: null, category: "duration", status: "proposed", value: { alias: v }, source: "packages/core/src/theme.ts:motion", occurrences: 0, files: 0 });
map.categories.duration = { total: lit.total.duration, note: "ui has 0 literals. The only 2 hits are `duration=0` in Kotlin (AndroidMediaDecoder.kt), not a style duration. Frame-throttle `setTimeout(...,16)` in forge/frame-throttle.ts is a 60 Hz frame budget, not a motion duration.", onScale: {}, offScale: {} };

// ---- off-scale rollups -------------------------------------------------------
let offTotal = 0, offTokens = 0; const pairs = {};
for (const cat of Object.keys(cats)) for (const x of off[cat]) { offTotal += x.n; for (const f of Object.keys(x.byFile)) { offTokens++; (pairs[comp(f)] ??= new Set()).add(cat + ":" + x.value); } }
frag.sensitivity = Object.keys(cats).map((cat) => {
  const all = H[cat]; const total = all.reduce((s, x) => s + x.n, 0);
  const posSet = (minN, minF) => new Set(all.filter((x) => !x.value.startsWith("-") && x.n >= minN && x.files >= minF).map((x) => x.value));
  const row = { cat, total };
  for (const [minN, minF] of [[2, 1], [3, 2], [4, 3], [5, 3], [8, 4]]) {
    const ps = posSet(minN, minF);
    const on = all.filter((x) => ps.has(x.value.replace(/^-/, "")) && (!x.value.startsWith("-") || cats[cat].neg)).reduce((s, x) => s + x.n, 0);
    row[`n>=${minN},f>=${minF}`] = `${ps.size} steps, ${total - on} off`;
  }
  return row;
});
frag.rollup = { summary, offTotal, offScopedTokens: offTokens };
frag.topComponents = Object.entries(pairs).map(([c, s]) => [c, s.size]).sort((a, b) => b[1] - a[1]).slice(0, 12);
frag.summaryTable = "| category | literals | distinct | scale steps | on scale | off scale (count) | off-scale distinct values |\n|---|---:|---:|---:|---:|---:|---:|\n" + Object.entries(summary).map(([k, s]) => `| ${k} | ${s.total} | ${s.distinct} | ${s.steps} | ${s.covered} | ${s.off} | ${s.offDistinct} |`).join("\n");
frag.perPackage = lit.perPackage;
frag.topFiles = lit.topFiles.slice(0, 12);

const names = new Set();
for (const t of tokens) { if (names.has(t.name)) throw new Error("duplicate token " + t.name); names.add(t.name); }
writeFileSync(`${outDir}/tokens.json`, JSON.stringify({ generated: "build-tokens.mjs from audit-literals.mjs", note: "status: existing = defined in repo today; proposed = new closed-scale step; proposed-scoped = component-scoped, value preserved", tokens }, null, 1) + "\n");
writeFileSync(`${outDir}/tokens.map.json`, JSON.stringify(map, null, 1) + "\n");
writeFileSync(fragPath, JSON.stringify(frag, null, 1));
console.log(JSON.stringify(summary), offTotal, offTokens, tokens.length);
