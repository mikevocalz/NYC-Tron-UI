// Deterministic tier 2 title and description generator. Inputs: docs/api-signatures.json and
// docs/agent-native/tier1.json only. No source reads, no network, no randomness.
// Usage: node docs/agent-native/tier2-describe.mjs [--examples]   (default: write tier2-copy.json)
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const MAX = 140;

// Subpath group (directory below ./components/) to the phrase used in the description.
export const GROUPS = {
  "": "UI",
  data: "data table",
  files: "file transfer",
  forge: "creative app",
  "forge/audio": "audio mixing and editing",
  "forge/cad": "CAD and 3D",
  "forge/canvas-tools": "canvas tool",
  "forge/canvas": "canvas",
  "forge/color": "color",
  "forge/design": "UI design tool",
  "forge/devices": "device pairing",
  "forge/document": "word processor",
  "forge/graph": "node graph",
  "forge/graphics": "image editing",
  "forge/ink": "digital ink and brush",
  "forge/inputs": "precision input",
  "forge/layers": "image layer",
  "forge/midi": "MIDI",
  "forge/motion": "motion graphics",
  "forge/office": "office",
  "forge/pdf": "PDF",
  "forge/photo": "photo editing",
  "forge/platform": "platform",
  "forge/selection": "selection",
  "forge/slides": "presentation slide",
  "forge/spreadsheet": "spreadsheet",
  "forge/timeline": "video timeline",
  "forge/vector": "vector drawing",
  forms: "form",
  gestures: "gesture",
  navigation: "navigation",
  overlays: "overlay",
  shell: "app shell",
};
// Props that every forge component takes. They do not discriminate, so they are skipped.
const GENERIC_PROPS = new Set(["scope", "revision", "className", "unstyled", "style", "testID", "children", "disabled", "label", "key", "ref", "editScope", "disabledReason", "accessibilityLabel", "isRTL", "targetSize", "width", "height", "maxHeight", "onLayout"]);
const VARIANT_SUFFIX = /(Variant|Size|Tone|Kind|Mode|Axis|Edge|Layout)$/;

export function splitName(n) {
  return n
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim();
}
const isComponentName = (n) => /^[A-Z][A-Za-z0-9]*$/.test(n) && /[a-z]/.test(n);

function parseMembers(sig) {
  const out = [];
  for (const line of sig.split("\n")) {
    const m = line.match(/^ {4}(?:readonly )?([A-Za-z_]\w*)(\??):/);
    if (m) out.push({name: m[1], optional: !!m[2]});
  }
  return out;
}
function unionValues(sig) {
  const m = sig.match(/=\s*((?:"[^"]+"\s*\|?\s*)+);?\s*$/s);
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
}
const art = (w) => (/^[aeiou]/.test(w) ? "an" : "a");
const fit = (parts, tail) => {
  // Drop trailing optional parts until the sentence fits MAX. parts[0] is mandatory.
  for (let k = parts.length; k >= 1; k--) {
    const s = parts.slice(0, k).join(" ") + tail;
    if (s.length <= MAX) return s;
  }
  return parts[0].slice(0, MAX - 1) + ".";
};

export function load() {
  const sig = JSON.parse(fs.readFileSync(path.join(here, "../api-signatures.json"), "utf8"));
  const t1 = JSON.parse(fs.readFileSync(path.join(here, "tier1.json"), "utf8"));
  return {ui: sig.packages["@nyc-tron/ui"], decl: sig.declarations, t1: new Set(t1.items.map((i) => i.subpath))};
}

export function describeSubpath(sp, ui, decl) {
  const rel = sp === "." ? "." : sp.replace("./components/", "").replace(/^\.\//, "");
  const segs = rel.split("/");
  const base = segs[segs.length - 1];
  const grpKey = sp.startsWith("./components/") ? segs.slice(0, -1).join("/") : segs.slice(0, -1).join("/") || "";
  const group = GROUPS[grpKey] ?? splitName(grpKey || "ui");
  const entry = ui[sp][0];
  if (sp === ".") {
    const names = Object.keys(entry.symbols).filter(isComponentName).slice(0, 8);
    return {id: ".", title: "NYC-Tron UI root", description: fit([`Root barrel of @nyc-tron/ui, re-exports ${names.join(", ")}.`], ""), kind: "barrel", group: ""};
  }
  const syms = Object.entries(entry.symbols).map(([name, refs]) => {
    const d = decl[refs[0].replace("@nyc-tron/ui/", "@nyc-tron/ui/")];
    const s = d ? d.signatures[0] : "";
    const kind = /^export declare function /.test(s) ? "function" : /^export declare const /.test(s) ? "const" : /^export interface /.test(s) ? "interface" : /^export (declare )?type /.test(s) ? "type" : /^export (declare )?(abstract )?class /.test(s) ? "class" : "other";
    return {name, kind, sig: s, ref: refs[0]};
  });
  const comps = syms.filter((s) => (s.kind === "function" || s.kind === "const") && isComponentName(s.name) && !/^use[A-Z]/.test(s.name));
  const primary = comps.find((c) => c.name === base) ?? comps[0] ?? null;
  const title = splitName(primary ? primary.name : base);
  if (primary) {
    const propsSym = syms.find((s) => s.name === primary.name + "Props") ?? syms.find((s) => /Props$/.test(s.name) && (s.kind === "interface" || s.kind === "type"));
    const members = propsSym ? parseMembers(propsSym.sig) : [];
    const picked = members.filter((m) => !GENERIC_PROPS.has(m.name) && !/^aria-|^accessibility/.test(m.name)).map((m) => m.name);
    const handlers = picked.filter((p) => /^on[A-Z]/.test(p));
    const data = picked.filter((p) => !/^on[A-Z]/.test(p));
    const variants = syms.filter((s) => s.kind === "type" && VARIANT_SUFFIX.test(s.name)).map((s) => ({n: s.name, v: unionValues(s.sig)})).filter((x) => x.v.length >= 2 && x.v.length <= 5);
    const propList = [...data.slice(0, 3), ...handlers.slice(0, 1)];
    const parts = [`${title}, ${art(group)} ${group} component.`];
    if (propList.length) parts.push(`Props: ${propList.join(", ")}.`);
    if (variants.length) parts.push(`${variants[0].n} ${variants[0].v.join(" | ")}.`);
    if (comps.length > 1) parts.push(`Also exports ${comps.filter((c) => c !== primary).slice(0, 2).map((c) => c.name).join(", ")}.`);
    return {id: rel, title, description: fit(parts, ""), kind: "component", group: grpKey};
  }
  // No component: model, hook or helper module.
  const fns = syms.filter((s) => s.kind === "function" || s.kind === "const").map((s) => s.name).filter((n) => !/^[A-Z0-9_]+$/.test(n));
  const types = syms.filter((s) => s.kind === "interface" || s.kind === "type").map((s) => s.name);
  const hook = fns.find((n) => /^use[A-Z]/.test(n));
  const noun = hook ? "hook" : /model$/.test(base) ? "state model" : "helper module";
  const parts = [`${splitName(base)}, ${art(group)} ${group} ${noun}.`];
  if (fns.length) parts.push(`Exports ${fns.slice(0, 3).join(", ")}.`);
  else if (types.length) parts.push(`Types ${types.slice(0, 3).join(", ")}.`);
  return {id: rel, title: splitName(base), description: fit(parts, ""), kind: noun, group: grpKey};
}

export function generate() {
  const {ui, decl, t1} = load();
  const out = [];
  for (const sp of Object.keys(ui)) {
    if (t1.has(sp)) continue;
    out.push(describeSubpath(sp, ui, decl));
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = generate();
  if (process.argv.includes("--examples")) {
    const comps = all.filter((a) => a.kind === "component");
    const other = all.filter((a) => a.kind !== "component");
    const groups = [...new Set(comps.map((c) => c.group))].sort();
    const pick = [];
    for (let i = 0; i < groups.length && pick.length < 12; i += Math.ceil(groups.length / 12)) pick.push(comps.find((c) => c.group === groups[i]));
    pick.push(...other.filter((_, i) => i % Math.floor(other.length / 3) === 0).slice(0, 3));
    for (const p of pick) console.log(`${p.id}\n  ${p.title}\n  ${p.description} (${p.description.length})`);
  } else {
    fs.writeFileSync(path.join(here, "tier2-copy.json"), JSON.stringify(all.map(({id, title, description}) => ({id, title, description})), null, 1) + "\n");
    console.log(all.length, "tier 2 items;", all.filter((a) => a.kind === "component").length, "components");
    const long = all.filter((a) => a.description.length > MAX);
    console.log("over", MAX, "chars:", long.length);
  }
}
