// Builds the in-memory model of every @nyc-tron/ui item from the repo: source files, exports,
// props, tokens, platforms, a11y scan, registry dependencies. Used by build-docs.mjs and check-docs.mjs
// so the generator and the checker derive facts the same way.
import fs from "node:fs";
import path from "node:path";
import {ROOT, read, readJson, exists, uiEntries, sigData, decl, declKind, isComponentName, parseProps, unionValues, literalUnion, splitTop, PLATFORM_ORDER} from "./lib.mjs";

const SRC = "packages/ui/src/components/";
const EXTS = [".tsx", ".native.tsx", ".shared.tsx", ".web.tsx", ".ts", ".native.ts", ".web.ts", ".shared.ts", ".types.ts", ".types.tsx"];
const TSX_EXTS = [".tsx", ".native.tsx", ".shared.tsx", ".web.tsx"];

const stripExt = (p) => p.replace(/\.(tsx?|jsx?)$/, "").replace(/\.(native|web|shared|types)$/, "");
export const pascal = (s) =>
  s
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

const tokensJson = () => readJson("docs/agent-native/tokens.json").tokens;
const tokensMap = () => readJson("docs/agent-native/tokens.map.json").categories;
let _cache = {};
const memo = (k, f) => (k in _cache ? _cache[k] : (_cache[k] = f()));

export function tokenSet() {
  return memo("tokenSet", () => new Set(tokensJson().map((t) => t.name)));
}
export function tokenPatterns() {
  return memo("tokenPatterns", () => {
    const out = [];
    const walk = (o) => {
      if (!o || typeof o !== "object") return;
      if (typeof o.tokenPattern === "string") out.push(o.tokenPattern);
      for (const v of Object.values(o)) walk(v);
    };
    walk(tokensMap());
    return [...new Set(out)].map((p) => new RegExp("^" + p.replace("<Component>", "[A-Za-z0-9]+").replace(/\./g, "\\.") + "$"));
  });
}
// A leading "-" is a negated spacing step (a negative margin): `-space.3` is the token space.3 with its sign flipped.
export const tokenValid = (t0) => {
  const t = t0.replace(/^-(?=space\.)/, "");
  return tokenSet().has(t) || tokenPatterns().some((re) => re.test(t));
};

export function peerList(pkgDir = "packages/ui") {
  return memo("peers" + pkgDir, () => Object.keys(readJson(pkgDir + "/package.json").peerDependencies ?? {}).sort());
}

// ---- source discovery ----
function sourceFiles(sp, entry, cfg) {
  const rel = sp === "." ? "" : sp.slice(cfg.relPrefix.length);
  const found = new Set();
  if (rel) for (const e of EXTS) if (exists(cfg.compRoot + rel + e)) found.add(cfg.compRoot + rel + e);
  const targets = new Set([entry.target, ...Object.values(entry.conditions ?? {})]);
  for (const t of targets) {
    if (typeof t !== "string" || !t.startsWith("./dist/")) continue;
    const b = cfg.srcRoot + t.slice("./dist/".length).replace(/\.d\.ts$|\.js$/, "");
    for (const e of [".tsx", ".ts"]) if (exists(b + e)) found.add(b + e);
  }
  return [...found].sort();
}

function leadingDoc(text, name) {
  const clean = (c) => {
    const s = c
      .split("\n")
      .map((l) => l.replace(/^\s*\/?\*+\/?\s?/, "").replace(/\*\/\s*$/, "").trim())
      .filter((l) => l && !l.startsWith("@"))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (!s) return null;
    const m = s.match(/^(.+?[.!?])(?:\s|$)/);
    let out = (m ? m[1] : s).trim();
    if (out.length > 300) out = out.slice(0, 297).replace(/\s+\S*$/, "") + "...";
    return out;
  };
  if (name) {
    const re = new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*?)\\*/\\s*(?:export\\s+(?:default\\s+)?)(?:declare\\s+)?(?:async\\s+)?(?:function|const|class|interface|type)\\s+${name}\\b`);
    const m = text.match(re);
    if (m) {
      const c = clean(m[1]);
      if (c) return c;
    }
  }
  const head = text.match(/^(?:\s*(?:\/\/[^\n]*|'use [a-z]+';?|"use [a-z]+";?)\s*\n)*\s*\/\*\*((?:(?!\*\/)[\s\S])*?)\*\//);
  return head ? clean(head[1]) : null;
}

function memberDocs(text, typeName) {
  const out = {};
  const m = text.match(new RegExp(`(?:interface|type)\\s+${typeName}\\b[^{=]*(?:=[^{]*)?\\{`));
  if (!m) return out;
  let i = m.index + m[0].length;
  let depth = 1;
  const start = i;
  for (; i < text.length && depth; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") depth--;
  }
  const body = text.slice(start, i);
  const re = /\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*(?:readonly\s+)?("[^"]+"|[A-Za-z_$][\w$]*)\??\s*[:(]/g;
  let mm;
  while ((mm = re.exec(body))) {
    let d = mm[1]
      .split("\n")
      .map((l) => l.replace(/^\s*\*+\s?/, "").trim())
      .filter((l) => l)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    let def = null;
    const dm = d.match(/(?:^|\s)@default\s+(.+?)(?=\s@\w+|$)/);
    if (dm) def = dm[1].trim();
    d = d.replace(/(?:^|\s)@\w+[\s\S]*$/, "").trim();
    if (d || def) out[mm[2].replace(/^"|"$/g, "")] = {desc: d, def};
  }
  return out;
}

// ---- token scan: same rules as docs/agent-native/token-use.mjs ----
export function scanTokens(text, compName) {
  const map = tokensMap();
  const N = "(-?[0-9]*\\.?[0-9]+)";
  const props = {
    spacing: "padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingStart|paddingEnd|margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|marginStart|marginEnd|gap|rowGap|columnGap",
    radius: "borderRadius|border(?:Top|Bottom)(?:Left|Right|Start|End)Radius",
    fontSize: "fontSize",
    lineHeight: "lineHeight",
    borderWidth: "borderWidth|borderTopWidth|borderBottomWidth|borderLeftWidth|borderRightWidth",
  };
  const out = new Set();
  for (const [cat, p] of Object.entries(props)) {
    const re = new RegExp(`\\b(${p})\\s*:\\s*${N}(?![0-9.]*\\s*[*+/%\\w])`, "g");
    for (const m of text.matchAll(re)) {
      const v = m[2];
      const c = map[cat];
      if (c.onScale?.[v]) out.add(c.onScale[v].token);
      else if (c.offScale?.[v]?.tokenPattern) out.add(c.offScale[v].tokenPattern.replace("<Component>", compName));
    }
  }
  for (const m of text.matchAll(/\bopacity\s*:\s*([^,}\n]{1,60})/g))
    for (const n of m[1].matchAll(/(?<![\w.])(0?\.[0-9]+)(?![\w.])/g)) {
      const v = n[1].replace(/^\./, "0.");
      const h = map.opacity.onScale?.[v];
      if (h) out.add(h.token);
      else if (map.opacity.offScale?.[v]?.tokenPattern) out.add(map.opacity.offScale[v].tokenPattern.replace("<Component>", compName));
    }
  const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const colorRe = /\b(?:bg|text|border|ring|fill|stroke|divide|outline|placeholder|caret|accent|shadow)-(on-primary|on-danger|surface-raised|surface-sunken|text-muted|primary|border|text|focus|danger|accent|info|success)(?:\/\d+)?\b/g;
  for (const m of text.matchAll(colorRe)) out.add("color." + camel(m[1]));
  for (const m of text.matchAll(/rounded-(control|card)\b/g)) out.add("radius." + m[1]);
  return [...out].sort();
}

function scanPlatforms(text, files) {
  const s = new Set();
  for (const m of text.matchAll(/Platform\.OS\s*[!=]==?\s*["'](ios|android|web|windows|macos|qnx)["']/g)) s.add(m[1]);
  for (const m of text.matchAll(/Platform\.select\(\s*\{([\s\S]{0,400}?)\}\s*\)/g))
    for (const k of m[1].matchAll(/\b(ios|android|web|windows|macos|qnx)\s*:/g)) s.add(k[1]);
  for (const f of files) {
    if (/\.native\.tsx?$/.test(f)) {
      s.add("ios");
      s.add("android");
    }
    if (/\.web\.tsx?$/.test(f)) s.add("web");
  }
  return s;
}

function scanA11y(text) {
  const re = /\b(accessibilityRole|accessibilityLabel|accessibilityState|accessibilityHint|accessibilityValue|accessibilityLiveRegion|role|aria-[a-z]+)\s*(?:=\s*\{?\s*|:\s*)("[^"]*"|'[^']*')?/g;
  const props = new Map();
  for (const m of text.matchAll(re)) {
    // skip identifiers used as object keys in unrelated type declarations: require a value or JSX-like use
    const name = m[1];
    if (!props.has(name)) props.set(name, new Set());
    if (m[2]) props.get(name).add(m[2].slice(1, -1));
  }
  return props;
}

function importsOf(text) {
  const out = [];
  for (const m of text.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) out.push(m[1]);
  return [...new Set(out)];
}

// ---- type helpers for tier 2 example generation ----
function resolveAlias(name, refs) {
  for (const r of refs) {
    if (r.endsWith("#" + name)) {
      const d = decl(r);
      if (d) return unionValues(d.signatures[0]);
    }
  }
  return null;
}
const SAFE_EXTERNAL = new Set(["ViewProps", "PressableProps", "TextProps", "TextInputProps", "ScrollViewProps", "AccessibilityProps", "StyleProp", "ViewStyle", "TextStyle"]);

export function exampleValue(type, refs) {
  const t = type.trim();
  if (t === "string") return '""';
  if (t === "number") return "{0}";
  if (t === "boolean") return "{false}";
  if (/^(?:React\.)?ReactNode$/.test(t)) return "{null}";
  if (/^\(.*\)\s*=>\s*[\s\S]+$/.test(t) && !/\|/.test(t.replace(/\([^)]*\)/g, ""))) return "{() => {}}";
  const u = literalUnion(t);
  if (u) return JSON.stringify(u[0]);
  if (/^[A-Z][A-Za-z0-9]*$/.test(t)) {
    const v = resolveAlias(t, refs);
    if (v && v.length) return JSON.stringify(v[0]);
  }
  return null;
}

// Does extending `base` add required members we cannot see? Returns required members or null if unknown.
function inheritedRequired(extText, refs, seen = new Set()) {
  if (!extText) return [];
  const req = [];
  for (const part of splitTop(extText)) {
    let b = part.trim();
    let omit = [];
    const om = b.match(/^(Omit|Pick)<\s*([A-Za-z0-9_.]+)\s*,\s*([\s\S]+)>$/);
    if (om) {
      if (om[1] === "Pick") return null;
      b = om[2];
      omit = [...om[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    }
    b = b.replace(/^React\./, "");
    if (SAFE_EXTERNAL.has(b)) continue;
    if (seen.has(b)) continue;
    seen.add(b);
    const ref = refs.find((r) => r.endsWith("#" + b) && r.startsWith("@nyc-tron/"));
    if (!ref) return null;
    const d = decl(ref);
    const p = d && parseProps(d.signatures[0]);
    if (!p) return null;
    const sub = inheritedRequired(p.extends, d.references ?? [], seen);
    if (sub === null) return null;
    for (const m of [...p.members.filter((x) => !x.optional), ...sub.map((n) => ({name: n}))]) if (!omit.includes(m.name)) req.push(m.name);
  }
  return req;
}

// ---- main model ----
export function buildModel() {
  return memo("model", () => {
    const ui = uiEntries();
    const t1 = readJson("docs/agent-native/tier1.json");
    const t1ById = new Map(t1.items.map((i) => [i.subpath === "." ? "root" : i.subpath.replace("./components/", ""), i]));
    const items = [];
    const byBase = new Map(); // src base path (no ext) -> id, for registry dependency resolution
    const sigs = [];
    const UI_CFG = {pkg: "@nyc-tron/ui", relPrefix: "./components/", compRoot: SRC, srcRoot: "packages/ui/src/", idPrefix: "", peerDir: "packages/ui"};
    const CORE_CFG = {pkg: "@nyc-tron/core", relPrefix: "./", compRoot: "packages/core/src/", srcRoot: "packages/core/src/", idPrefix: "core/", peerDir: "packages/core"};
    const work = Object.keys(ui).sort().map((sp) => ({cfg: UI_CFG, sp, entry: ui[sp][0], id: sp === "." ? "root" : sp.replace("./components/", "")}));
    // Support modules the registry ships next to the ui items (registry.json items from @nyc-tron/core).
    if (exists("registry.json")) {
      const core = sigData().packages["@nyc-tron/core"] ?? {};
      for (const r of readJson("registry.json").items) {
        if (r.meta?.package !== "@nyc-tron/core") continue;
        const sp = "./" + r.meta.subpath.slice("@nyc-tron/core/".length);
        if (core[sp]) work.push({cfg: CORE_CFG, sp, entry: core[sp][0], id: r.name});
      }
    }
    for (const {cfg, sp, entry, id} of work) {
      const files = sourceFiles(sp, entry, cfg);
      const texts = files.map((f) => read(f));
      const text = texts.join("\n");
      const rel = id === "root" ? "" : cfg === CORE_CFG ? id.slice(5) : id;
      const tsxText = TSX_EXTS.map((e) => cfg.compRoot + rel + e).filter(exists).map(read).join("\n");
      const isComp = cfg === UI_CFG && !!rel && /export\s+(?:default\s+)?(?:function|const)\s+[A-Z]\w*/.test(tsxText);
      const symbols = Object.keys(entry.symbols);
      const syms = symbols.map((name) => {
        const ref = entry.symbols[name][0];
        const d = decl(ref);
        const sig = d ? d.signatures[0] : "";
        return {name, ref, sig, kind: declKind(sig), refs: d?.references ?? []};
      });
      let comps = syms.filter((s) => (s.kind === "function" || s.kind === "const") && isComponentName(s.name) && !/^use[A-Z]/.test(s.name));
      const pos = (n) => {
        const m = text.match(new RegExp(`export\\s+(?:default\\s+)?(?:function|const)\\s+${n}\\b`));
        return m ? m.index : Infinity;
      };
      comps = comps.sort((a, b) => pos(a.name) - pos(b.name) || a.name.localeCompare(b.name));
      const base = id === "root" ? "" : id.split("/").pop();
      const primarySym = comps.find((c) => c.name === base) ?? comps[0] ?? null;
      if (primarySym) comps = [primarySym, ...comps.filter((c) => c !== primarySym)];
      const tier1 = cfg === UI_CFG ? t1ById.get(id) : undefined;
      const kind = isComp ? "component" : "module";
      let name;
      if (primarySym && isComp) name = primarySym.name;
      else if (id === "root") name = "UiRoot";
      else name = pascal(base).replace(/Module$/, "") + "Module";
      if (isComp && !primarySym) name = pascal(base);
      const doc = leadingDoc(text, primarySym?.name);
      const item = {
        id, sp, pkg: cfg.pkg, specifier: sp === "." ? cfg.pkg : cfg.pkg + "/" + sp.slice(cfg.relPrefix.length), peerDir: cfg.peerDir, files, text, kind, name, base, entry, syms, comps, tier: tier1 ? 1 : 2,
        symbolNames: symbols, purposeDoc: doc, tier1,
      };
      // props
      item.props = null;
      if (isComp && primarySym) {
        item.propsList = [];
        for (const c of comps) {
          const refs = c.refs.filter((r) => r.startsWith("@nyc-tron/ui/") && /Props$/.test(r.split("#")[1]) && r.split("#")[0] === c.ref.split("#")[0]);
          const sym = syms.find((s) => s.name === c.name + "Props");
          const ref = refs[0] ?? sym?.ref;
          const d = ref && decl(ref);
          const p = d && parseProps(d.signatures[0]);
          if (p && p.members.length >= 0 && (/^export (interface|type) /.test(d.signatures[0]))) {
            const tn = ref.split("#")[1];
            const docs = {};
            for (const t of texts) Object.assign(docs, memberDocs(t, tn));
            item.propsList.push({comp: c.name, typeName: tn, ref, parsed: p, docs, refs: d.references ?? []});
          }
        }
        item.props = item.propsList.find((p) => p.comp === primarySym.name) ?? null;
      }
      // tokens, platforms, a11y, deps
      item.tokens = scanTokens(text, name);
      const plats = scanPlatforms(text, files);
      for (const k of ["browser", "qnx", "windows", "macos"]) if (entry.conditions?.[k]) plats.add(k === "browser" ? "web" : k);
      item.platforms = PLATFORM_ORDER.filter((p) => plats.has(p));
      item.a11yScan = scanA11y(text);
      item.imports = texts.flatMap((t) => importsOf(t));
      item.sigRefs = syms.flatMap((s) => s.refs);
      items.push(item);
      for (const f of files) byBase.set(stripExt(f), id);
      sigs.push(item);
    }
    const compIds = new Set(items.filter((i) => i.kind === "component").map((i) => i.id));
    for (const it of items) {
      const peers = peerList(it.peerDir);
      const deps = new Set();
      const used = new Set(it.pkg === "@nyc-tron/ui" ? ["react", "react-native"] : []);
      for (const f of it.files) {
        const t = read(f);
        for (const spec of importsOf(t)) {
          let target = null;
          if (spec.startsWith(".")) target = stripExt(path.posix.normalize(path.posix.join(path.posix.dirname(f), spec)));
          else if (spec.startsWith("@nyc-tron/ui/components/")) target = stripExt(SRC + spec.slice("@nyc-tron/ui/components/".length));
          else {
            const root = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
            if (peers.includes(root)) used.add(root);
          }
          if (target) {
            const dep = byBase.get(target);
            if (dep && dep !== it.id && compIds.has(dep)) deps.add(dep);
          }
        }
      }
      it.registryDependencies = [...deps].sort().map((d) => "@nyc-tron/" + d);
      it.peers = [...used].sort();
      // category by directory
      const dir = it.id === "root" ? "" : it.id.split("/")[0];
      const hasDir = it.id.includes("/") && it.pkg === "@nyc-tron/ui";
      const dmap = {forge: "forge", shell: "shell", layout: "layout", overlays: "overlay", feedback: "feedback", data: "data", navigation: "navigation"};
      it.category = hasDir && dmap[dir] ? dmap[dir] : "primitive";
    }
    return {items, byId: new Map(items.map((i) => [i.id, i])), t1};
  });
}

export function a11yScanStatus(item) {
  return item.a11yScan.size ? "declared" : "unverified";
}

// Required member check for example generation. Returns the JSX or null.
export function buildExample(item) {
  if (item.kind !== "component" || !item.props) return null;
  const p = item.props;
  const req = p.parsed.members.filter((m) => !m.optional);
  const inh = inheritedRequired(p.parsed.extends, p.refs);
  if (inh === null) return null;
  if (inh.length) return null;
  const attrs = [];
  for (const m of req) {
    if (m.method) return null;
    const v = exampleValue(m.type, p.refs);
    if (v === null) return null;
    attrs.push(`${/^[A-Za-z_$][\w$]*$/.test(m.name) ? m.name : null}=${v}`);
    if (attrs[attrs.length - 1].startsWith("null=")) return null;
  }
  // a component generic in its declaration cannot be written without type arguments we do not know
  if (/<[A-Z]\w*(?: extends [^>]+)?>\(/.test(item.comps[0].sig)) return null;
  return {attrs};
}
