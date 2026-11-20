// Shared token model for the codemod, the generator, the equivalence proof and the gate.
// Everything here derives from docs/agent-native/tokens.json and tokens.map.json.
// Nothing in this file touches the file system except readModel().
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const SPACE_UNIT = 4;

// Export name in packages/core/src/tokens.ts, per tokens.json token-name prefix.
export const EXPORT_OF_PREFIX = {
  space: "space", radius: "radius", font: "font", leading: "leading", border: "border",
  opacity: "opacity", scrim: "scrim", elevation: "elevation", size: "size",
};
// Import order inside the single import declaration the codemod adds.
export const EXPORT_ORDER = ["space", "radius", "font", "leading", "border", "opacity", "scrim", "elevation", "size"];

// Map category (tokens.map.json) -> property names (set by the map) and token family.
export function readModel() {
  const tokensJson = JSON.parse(readFileSync(join(root, "docs/agent-native/tokens.json"), "utf8"));
  const map = JSON.parse(readFileSync(join(root, "docs/agent-native/tokens.map.json"), "utf8"));
  return { tokensJson, map };
}

/** Key inside the export object for a tokens.json name such as `space.1.5`, `border.1_5`, `opacity.0_45`, `radius.full`. */
export function keyOfTokenName(name) {
  const dot = name.indexOf(".");
  const family = name.slice(0, dot);
  const rest = name.slice(dot + 1);
  if (family === "space") return { family, key: rest };
  if (family === "opacity") return { family, key: String(Math.round(Number(rest.replace("_", ".")) * 100)) };
  if (family === "border") return { family, key: rest.replace("_", ".") };
  if (family === "scrim") return { family, key: rest };
  if (family === "elevation") return { family, key: rest };
  if (family === "size") return { family, key: rest };
  return { family, key: rest }; // radius, font, leading (numeric or "full")
}

/** Source text for a token reference, e.g. `space[0.5]`, `radius.full`, `size.touch`. `local` maps family -> local identifier. */
export function referenceText(family, key, local = {}) {
  const id = local[family] ?? family;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${id}.${key}` : `${id}[${key}]`;
}

/** Table of every shared token: family -> key -> value, from tokens.json (not from tokens.ts). */
export function sharedTable(tokensJson) {
  const table = {};
  for (const t of tokensJson.tokens) {
    if (t.status !== "proposed") continue;
    const dot = t.name.indexOf(".");
    const family = t.name.slice(0, dot);
    if (!(family in EXPORT_OF_PREFIX)) continue;
    const { key } = keyOfTokenName(t.name);
    let value;
    if (t.category === "scrim") value = t.value.value;
    else if (t.category === "elevation") value = t.value.boxShadow;
    else value = t.value.value;
    if (value === undefined || (typeof value === "object")) continue;
    (table[family] ??= {})[key] = value;
  }
  return table;
}

/** Scoped (file-local) key for an off-scale literal. `space` keys are unit multiples, others are value based. */
export function scopedKey(family, literalValue) {
  const neg = literalValue < 0;
  const abs = Math.abs(literalValue);
  const n = family === "space" ? abs / SPACE_UNIT : abs;
  const digits = String(n).replace(".", "_");
  return `${family}${neg ? "N" : ""}${digits}`;
}

/** Inverse of scopedKey, written separately so the proof checks the encoding instead of trusting it. */
export function decodeScopedKey(key) {
  const m = /^(space|radius|font|leading|border|opacity)(N?)(\d+(?:_\d+)?)$/.exec(key);
  if (!m) return null;
  let n = Number(m[3].replace("_", "."));
  if (m[1] === "space") n *= SPACE_UNIT;
  return m[2] ? -n : n;
}

export const FAMILY_OF_CATEGORY = {
  spacing: "space", radius: "radius", fontSize: "font", lineHeight: "leading", borderWidth: "border", opacity: "opacity",
};

/** Property name -> category, for numeric literals. */
export function propertyCategories(map) {
  const out = {};
  // The map lists only properties that had a literal at audit time. The codemod and the gate use the
  // full property families from audit-literals.mjs so a later `marginStart: 0` is not missed.
  for (const cat of Object.keys(FAMILY_OF_CATEGORY)) for (const p of [...map.categories[cat].properties, ...PROPERTY_FAMILIES[cat]]) out[p] = cat;
  for (const p of [...map.categories.minSize44.properties, "minWidth", "minHeight"]) out[p] = "minSize44";
  return out;
}
const sides = ["Top", "Bottom", "Left", "Right", "Start", "End", "Horizontal", "Vertical"];
export const PROPERTY_FAMILIES = {
  spacing: ["padding", "margin", "gap", "rowGap", "columnGap", ...["padding", "margin"].flatMap((b) => sides.map((s) => b + s))],
  radius: ["borderRadius", ...["Top", "Bottom"].flatMap((v) => ["Left", "Right", "Start", "End"].map((h) => `border${v}${h}Radius`))],
  fontSize: ["fontSize"], lineHeight: ["lineHeight"],
  borderWidth: ["borderWidth", "borderTopWidth", "borderBottomWidth", "borderLeftWidth", "borderRightWidth"],
  opacity: ["opacity"],
};

export function normalizeColor(text) { return text.replace(/\s+/g, ""); }

// Packages that must not import @nyc-tron/core at runtime (decision 42) read their own generated copy.
// The copy sits at packages/<pkg>/src/tokens.ts and is imported relatively. Others use the core subpath.
export const LOCAL_TOKEN_PACKAGES = ["ui"];
export const TOKEN_COPIES = ["packages/core/src/tokens.ts", ...LOCAL_TOKEN_PACKAGES.map((p) => `packages/${p}/src/tokens.ts`)];
