// AST analysis shared by tokenize.mjs (rewrite) and prove-equivalence.mjs (re-scan of what is left).
// ts-morph resolves from the repo when installed, else from NODE_PATH (CI and scratch installs).
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { basename, dirname, join, posix } from "node:path";
import { readFileSync } from "node:fs";
import {
  FAMILY_OF_CATEGORY, EXPORT_ORDER, LOCAL_TOKEN_PACKAGES, keyOfTokenName, normalizeColor, propertyCategories, readModel,
  referenceText, root, scopedKey, sharedTable,
} from "./token-model.mjs";

const require = createRequire(import.meta.url);
export function loadTsMorph() {
  try { return require("ts-morph"); } catch (error) {
    throw new Error("ts-morph is not resolvable. Install it in a scratch dir and set NODE_PATH to its node_modules (" + error.message + ")");
  }
}

/** packages/<pkg>/src/**\/*.{ts,tsx}: no tests, declarations, generated output, or generated token files. */
export function listSourceFiles(cwd = root) {
  const out = execFileSync("git", ["ls-files", "packages"], { cwd, encoding: "utf8", maxBuffer: 1 << 28 }).split("\n");
  return out.filter((f) => /^packages\/[^/]+\/src\/.+\.(ts|tsx)$/.test(f))
    .filter((f) => !/(\.d\.ts$|\.test\.|\.spec\.|\/tests?\/|\/generated\/|\/node_modules\/|\/dist\/|\.tokens\.ts$|^packages\/[^/]+\/src\/tokens\.ts$)/.test(f));
}

const TOKEN_MODULE_SPECIFIER = "@nyc-tron/core/tokens";
const STYLE_TYPE = /\b(ViewStyle|TextStyle|ImageStyle|StyleProp|NamedStyles)\b|\[["']style["']\]/;
const STYLE_NAME = /(^|[a-z0-9_])(Style|Styles)$|^(style|styles)$/;
const STYLE_CALLS = new Set(["StyleSheet.create", "StyleSheet.flatten", "StyleSheet.compose"]);

/** Packages whose manifest lets source import @nyc-tron/core. */
export function packagesWithCore(cwd = root) {
  const out = new Set();
  const dirs = execFileSync("git", ["ls-files", "packages/*/package.json"], { cwd, encoding: "utf8" }).split("\n").filter(Boolean);
  for (const f of dirs) {
    const j = JSON.parse(readFileSync(join(cwd, f), "utf8"));
    const has = ["dependencies", "peerDependencies", "devDependencies"].some((k) => j[k]?.["@nyc-tron/core"]) || j.name === "@nyc-tron/core";
    if (has) out.add(f.split("/")[1]);
  }
  return out;
}

export function createAnalyzer({ cwd = root } = {}) {
  const tsm = loadTsMorph();
  const { Project, Node, SyntaxKind } = tsm;
  const { map, tokensJson } = readModel();
  const propCat = propertyCategories(map);
  const shared = sharedTable(tokensJson);
  const withCore = packagesWithCore(cwd);
  const project = new Project({ useInMemoryFileSystem: true, skipFileDependencyResolution: true, compilerOptions: { jsx: tsm.ts.JsxEmit.Preserve, target: tsm.ts.ScriptTarget.ESNext, allowJs: false } });

  // value-string -> {family,key} for on-scale numeric steps, per category (map keys are value strings)
  const onScale = {};
  for (const cat of Object.keys(FAMILY_OF_CATEGORY)) {
    onScale[cat] = {};
    for (const [lit, e] of Object.entries(map.categories[cat].onScale)) {
      const neg = e.token.startsWith("-");
      const { family, key } = keyOfTokenName(neg ? e.token.slice(1) : e.token);
      onScale[cat][lit] = { family, key, neg };
    }
  }
  const offScaleMap = Object.fromEntries(Object.keys(FAMILY_OF_CATEGORY).map((cat) => [cat, map.categories[cat].offScale]));
  const scrimByValue = {}; // normalised rgba -> key
  for (const k of Object.keys(shared.scrim ?? {})) scrimByValue[normalizeColor(shared.scrim[k])] = k;
  const elevationByValue = {};
  for (const k of Object.keys(shared.elevation ?? {})) elevationByValue[normalizeColor(shared.elevation[k])] = k;
  // scoped colour tokens from the map: normalised literal -> key (file given by the map)
  const scopedColor = {};
  for (const [lit, e] of Object.entries(map.categories.colorFn.offScale)) {
    const tail = e.token.split(".").slice(2).join(".");
    scopedColor[normalizeColor(lit)] = { file: e.file, key: "color" + tail[0].toUpperCase() + tail.slice(1) };
  }

  const ident = (n) => n.getText();
  function nameOf(pa) {
    const nn = pa.getNameNode();
    if (Node.isIdentifier(nn)) return nn.getText();
    if (Node.isStringLiteral(nn)) return nn.getLiteralText();
    return null;
  }

  // ---- style context -------------------------------------------------------
  const calleeText = (call) => call.getExpression().getText();
  function enclosingFunction(node) {
    let n = node.getParent();
    while (n && !(Node.isFunctionDeclaration(n) || Node.isArrowFunction(n) || Node.isFunctionExpression(n) || Node.isMethodDeclaration(n))) n = n.getParent();
    return n;
  }
  function functionIsStyle(fn) {
    if (!fn) return null;
    const rt = fn.getReturnTypeNode?.();
    if (rt && STYLE_TYPE.test(rt.getText())) return "function returns a style type";
    const nm = Node.isFunctionDeclaration(fn) || Node.isMethodDeclaration(fn) ? fn.getName?.() : Node.isVariableDeclaration(fn.getParent()) ? fn.getParent().getName() : null;
    if (nm && /style/i.test(nm)) return "function named *style*";
    // arrow passed as a style attribute value, style={(state)=>({...})}
    const p = fn.getParent();
    if (p && Node.isJsxExpression(p) && Node.isJsxAttribute(p.getParent()) && /^(style|[a-z]+Style)$/.test(p.getParent().getNameNode().getText())) return "style attribute callback";
    if (p && Node.isPropertyAssignment(p) && STYLE_NAME.test(nameOf(p) ?? "")) return "style property callback";
    return null;
  }
  // `const box = {...}` counts as a style when some use of `box` sits in a style attribute, a style property
  // or a StyleSheet helper, directly or through an array, conditional, spread or logical operator.
  function variableUsedAsStyle(decl) {
    const name = decl.getName();
    const scope = Node.isParameterDeclaration(decl)
      ? (decl.getParent().getBody?.() ?? decl.getSourceFile())
      : (decl.getFirstAncestor((a) => Node.isBlock(a) || Node.isSourceFile(a) || Node.isModuleBlock(a)) ?? decl.getSourceFile());
    for (const id of scope.getDescendantsOfKind(SyntaxKind.Identifier)) {
      if (id.getText() !== name || id === decl.getNameNode()) continue;
      let n = id;
      for (let guard = 0; guard < 12; guard++) {
        const p = n.getParent();
        if (!p) break;
        if (Node.isParenthesizedExpression(p) || Node.isArrayLiteralExpression(p) || Node.isSpreadElement(p) || Node.isNonNullExpression(p) || Node.isAsExpression(p)) { n = p; continue; }
        if (Node.isArrowFunction(p) && p.getBody() === n) { n = p; continue; }
        if (Node.isVariableDeclaration(p)) { if (STYLE_TYPE.test(p.getTypeNode()?.getText() ?? "")) return true; break; }
        if (Node.isConditionalExpression(p) && p.getCondition() !== n) { n = p; continue; }
        if (Node.isBinaryExpression(p) && (["||", "??"].includes(p.getOperatorToken().getText()) || (p.getOperatorToken().getText() === "&&" && p.getRight() === n))) { n = p; continue; }
        if (Node.isSpreadAssignment(p)) { const o = p.getParent(); const pp = o.getParent(); if (Node.isJsxExpression(pp) || Node.isPropertyAssignment(pp)) { n = o; continue; } break; }
        if (Node.isObjectLiteralExpression(p)) { n = p; continue; }
        if (Node.isJsxExpression(p)) { const a = p.getParent(); if (Node.isJsxAttribute(a) && /^(style|[A-Za-z]+Style)$/.test(a.getNameNode().getText())) return true; break; }
        if (Node.isPropertyAssignment(p)) { if (STYLE_NAME.test(nameOf(p) ?? "")) return true; break; }
        if (Node.isCallExpression(p)) { if (STYLE_CALLS.has(calleeText(p))) return true; break; }
        break;
      }
    }
    return false;
  }
  /** Returns a short reason string when the object literal sits in a style position, else null. */
  function styleContext(obj) {
    let n = obj;
    for (let guard = 0; guard < 40; guard++) {
      const p = n.getParent();
      if (!p) return null;
      if (Node.isParenthesizedExpression(p) || Node.isNonNullExpression(p)) { n = p; continue; }
      if (Node.isAsExpression(p) || Node.isSatisfiesExpression(p)) { if (STYLE_TYPE.test(p.getTypeNode()?.getText() ?? "")) return "style type assertion"; n = p; continue; }
      if (Node.isArrayLiteralExpression(p) || Node.isSpreadElement(p)) { n = p; continue; }
      if (Node.isConditionalExpression(p)) { if (p.getCondition() === n) return null; n = p; continue; }
      if (Node.isBinaryExpression(p)) {
        const op = p.getOperatorToken().getText();
        if (op === "&&" ? p.getRight() === n : ["||", "??"].includes(op)) { n = p; continue; }
        if (op === "," && p.getRight() === n) { n = p; continue; }
        return null;
      }
      if (Node.isSpreadAssignment(p)) { n = p.getParent(); continue; }
      if (Node.isPropertyAssignment(p)) {
        const nm = nameOf(p);
        if (nm && STYLE_NAME.test(nm)) return "style property";
        const outer = p.getParent(); // ObjectLiteralExpression holding this property
        if (Node.isObjectLiteralExpression(outer)) {
          // `StyleSheet.create({ key: {...} })`
          const op = outer.getParent();
          if (op && Node.isCallExpression(op) && STYLE_CALLS.has(calleeText(op))) return "StyleSheet argument";
          n = outer; continue;
        }
        return null;
      }
      if (Node.isJsxExpression(p)) {
        const a = p.getParent();
        if (Node.isJsxAttribute(a)) return /^(style|[A-Za-z]+Style)$/.test(a.getNameNode().getText()) ? "JSX style attribute" : null;
        return null;
      }
      if (Node.isCallExpression(p)) {
        if (STYLE_CALLS.has(calleeText(p))) return "StyleSheet helper argument";
        const idx = p.getArguments().indexOf(n);
        const callee = p.getExpression();
        if (idx >= 0 && Node.isIdentifier(callee)) {
          // a same-file helper whose parameter is a style type or is passed on to a style attribute
          const sfile = p.getSourceFile();
          const fn = sfile.getFunction(callee.getText()) ?? sfile.getVariableDeclaration(callee.getText())?.getInitializer() ?? sfile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).find((d) => d.getName() === callee.getText())?.getInitializer();
          const param = fn && (Node.isArrowFunction(fn) || Node.isFunctionExpression(fn) || Node.isFunctionDeclaration(fn)) ? fn.getParameters()[idx] : null;
          if (param && Node.isIdentifier(param.getNameNode()) && (STYLE_TYPE.test(param.getTypeNode()?.getText() ?? "") || variableUsedAsStyle(param))) return "argument of a same-file style helper";
        }
        if (/(^|\.)(\w*[sS]tyle\w*)$/.test(calleeText(p))) return "style helper argument";
        return null;
      }
      if (Node.isVariableDeclaration(p)) {
        const t = p.getTypeNode()?.getText() ?? "";
        if (STYLE_TYPE.test(t)) return "style-typed variable";
        if (STYLE_NAME.test(p.getName())) return "variable named *style*";
        if (Node.isIdentifier(p.getNameNode()) && variableUsedAsStyle(p)) return "variable passed to a style attribute";
        return null;
      }
      if (Node.isReturnStatement(p)) { return functionIsStyle(enclosingFunction(p)); }
      if (Node.isArrowFunction(p) && p.getBody() === n) { return functionIsStyle(p); }
      if (Node.isAwaitExpression(p)) return null;
      return null;
    }
    return null;
  }

  // ---- value leaves ----------------------------------------------------------
  /** Value-yielding leaves of an expression: numbers, negated numbers, strings; plus counts of numbers hidden in other expressions. */
  function leaves(expr, out = { leaves: [], hidden: [] }) {
    if (Node.isNumericLiteral(expr)) out.leaves.push({ node: expr, value: Number(expr.getLiteralValue()), unit: expr });
    else if (Node.isPrefixUnaryExpression(expr) && expr.getOperatorToken() === SyntaxKind.MinusToken && Node.isNumericLiteral(expr.getOperand())) {
      out.leaves.push({ node: expr, value: -Number(expr.getOperand().getLiteralValue()), unit: expr });
    } else if (Node.isStringLiteral(expr)) out.leaves.push({ node: expr, string: expr.getLiteralText() });
    else if (Node.isParenthesizedExpression(expr) || Node.isAsExpression(expr) || Node.isSatisfiesExpression(expr) || Node.isNonNullExpression(expr)) leaves(expr.getExpression(), out);
    else if (Node.isConditionalExpression(expr)) { leaves(expr.getWhenTrue(), out); leaves(expr.getWhenFalse(), out); hiddenNumbers(expr.getCondition(), out, false); }
    else if (Node.isBinaryExpression(expr) && ["||", "??", "&&"].includes(expr.getOperatorToken().getText())) {
      const op = expr.getOperatorToken().getText();
      if (op === "&&") hiddenNumbers(expr.getLeft(), out, false); else leaves(expr.getLeft(), out);
      leaves(expr.getRight(), out);
    } else hiddenNumbers(expr, out, true);
    return out;
  }
  function hiddenNumbers(expr, out, count) {
    if (!count) return;
    for (const d of [expr, ...expr.getDescendants()]) if (Node.isNumericLiteral(d) && !Node.isElementAccessExpression(d.getParent()) && !d.getFirstAncestor((a) => Node.isTemplateExpression(a))) out.hidden.push(d);
  }

  // ---- collisions with local names ---------------------------------------------
  function nameCollisions(sf, names) {
    const hit = new Set();
    for (const id of sf.getDescendantsOfKind(SyntaxKind.Identifier)) {
      const t = id.getText();
      if (!names.has(t) || hit.has(t)) continue;
      const p = id.getParent();
      if (Node.isPropertyAssignment(p) && p.getNameNode() === id) continue;
      if (Node.isPropertyAccessExpression(p) && p.getNameNode() === id) continue;
      if ((Node.isPropertySignature(p) || Node.isPropertyDeclaration(p) || Node.isMethodDeclaration(p) || Node.isMethodSignature(p) || Node.isGetAccessorDeclaration(p) || Node.isSetAccessorDeclaration(p) || Node.isEnumMember(p)) && p.getNameNode() === id) continue;
      if (Node.isJsxAttribute(p) && p.getNameNode() === id) continue;
      if (Node.isQualifiedName(p) && p.getRight() === id) continue;
      if (Node.isBindingElement(p) && p.getPropertyNameNode() === id) continue;
      if ((Node.isImportSpecifier(p) || Node.isExportSpecifier(p)) && p.getPropertyNameNode() === id) continue;
      hit.add(t);
    }
    return hit;
  }

  const tokensSiblingPath = (file) => {
    const dir = dirname(file);
    const base = basename(file).replace(/\.(native|web|qt|shared|ios|android|windows|macos)(?=\.(tsx|ts)$)/, "").replace(/\.(tsx|ts)$/, "");
    return posix.join(dir, base + ".tokens.ts");
  };

  /**
   * Analyse one file. Returns {edits, imports, scoped, replaced[], left[]}.
   * `replaced` entries: {category, literal, token, line}; `left` entries: {category, literal, reason, line}.
   */
  function analyze(file, text) {
    const pkg = file.split("/")[1];
    const sf = project.createSourceFile("/" + file, text, { overwrite: true });
    const canTokenize = withCore.has(pkg);
    const shortcuts = { replaced: [], left: [], edits: [], families: new Set(), scoped: new Map() };
    const line = (n) => sf.getLineAndColumnAtPos(n.getStart()).line;
    const record = (cat, literal, token, n) => shortcuts.replaced.push({ category: cat, literal, token, line: line(n), prop: (n.getFirstAncestor((a) => Node.isPropertyAssignment(a)) ?? n).getStart() });
    const propPos = (n) => (n.getFirstAncestor((a) => Node.isPropertyAssignment(a)) ?? n).getStart();
    const leave = (cat, literal, reason, n) => shortcuts.left.push({ category: cat, literal, reason, line: line(n), prop: propPos(n) });
    // `local` is resolved after we know which names collide; edits hold placeholders {family,key}.
    const pending = [];
    for (const pa of sf.getDescendantsOfKind(SyntaxKind.PropertyAssignment)) {
      const prop = nameOf(pa);
      if (!prop) continue;
      const init = pa.getInitializer();
      if (!init) continue;
      const isColorProp = /^(backgroundColor|boxShadow|color|borderColor|shadowColor)$/.test(prop);
      const cat = propCat[prop];
      if (!cat && !isColorProp) continue;
      if (init.getFirstAncestor((a) => Node.isTemplateExpression(a) || Node.isTaggedTemplateExpression(a))) continue;
      const obj = pa.getParent();
      const { leaves: ls, hidden } = leaves(init);
      const strings = ls.filter((l) => l.string !== undefined);
      const nums = ls.filter((l) => l.string === undefined);
      if (!nums.length && !strings.length && !hidden.length) continue;
      if (cat && !nums.length && !hidden.length) continue;
      const ctx = Node.isObjectLiteralExpression(obj) ? styleContext(obj) : null;
      // colours / shadows: rgba strings only
      if (isColorProp) {
        for (const s of strings) {
          const norm = normalizeColor(s.string);
          if (!/^(rgba?|hsla?)\(\s*\d/.test(s.string) && !/rgba?\(/.test(s.string)) continue;
          if (!ctx) { leave("colorFn", s.string, "non-style-context", s.node); continue; }
          if (!canTokenize) { leave("colorFn", s.string, "package-without-core-dependency", s.node); continue; }
          let family = null, key = null;
          if (prop === "boxShadow" && elevationByValue[norm] !== undefined && s.string === shared.elevation[elevationByValue[norm]]) { family = "elevation"; key = elevationByValue[norm]; }
          else if (prop !== "boxShadow" && scrimByValue[norm] !== undefined && s.string === shared.scrim[scrimByValue[norm]]) { family = "scrim"; key = scrimByValue[norm]; }
          else if (scopedColor[norm] && scopedColor[norm].file === file && s.string === Object.keys(map.categories.colorFn.offScale).find((k) => normalizeColor(k) === norm)) {
            pending.push({ node: s.node, scopedKey: scopedColor[norm].key, value: s.string, category: "colorFn" });
            record("colorFn", s.string, `scoped:${scopedColor[norm].key}`, s.node);
            continue;
          } else { leave("colorFn", s.string, "rgba-text-differs-from-token-value", s.node); continue; }
          pending.push({ node: s.node, family, key, category: "colorFn" });
          record("colorFn", s.string, `${family}[${key}]`, s.node);
        }
        if (!cat) continue;
      }
      if (!cat) continue;
      for (const h of hidden) leave(cat === "minSize44" ? "minSize44" : cat, h.getText(), "inside-non-literal-expression", h);
      if (!ctx) { for (const l of nums) { if (cat === "opacity" && (l.value === 0 || l.value === 1)) leave(cat, String(l.value), "exempt-opacity-0-1", l.node); else if (cat === "minSize44" && l.value !== 44) continue; else leave(cat, String(l.value), "non-style-context", l.node); } continue; }
      for (const l of nums) {
        const v = l.value, key = String(v);
        if (cat === "minSize44") { if (v !== 44) continue; }
        if (cat === "opacity" && (v === 0 || v === 1)) { leave(cat, key, "exempt-opacity-0-1", l.node); continue; }
        if (v === 0 && !onScale[cat]["0"]) { leave(cat, key, "exempt-zero-no-token", l.node); continue; }
        if (!canTokenize) { leave(cat, key, "package-without-core-dependency", l.node); continue; }
        if (cat === "minSize44") { pending.push({ node: l.unit, family: "size", key: "touch", category: cat }); record(cat, key, "size.touch", l.node); continue; }
        const on = onScale[cat][key];
        if (on) {
          pending.push({ node: l.unit, family: on.family, key: on.key, neg: on.neg, category: cat });
          record(cat, key, (on.neg ? "-" : "") + `${on.family}[${on.key}]`, l.node);
          continue;
        }
        const family = FAMILY_OF_CATEGORY[cat];
        const sk = scopedKey(family, v);
        const mapped = offScaleMap[cat][key]?.byFile?.[file] !== undefined;
        pending.push({ node: l.unit, scopedKey: sk, value: v, category: cat, extra: !mapped });
        record(cat, key, `scoped:${sk}${mapped ? "" : " (not in map)"}`, l.node);
      }
    }
    shortcuts.pending = pending;
    shortcuts.sf = sf;
    return shortcuts;
  }

  /** Module specifier for the shared tokens: a relative path to the package's own copy, or the core subpath. */
  function tokenSpecifier(file) {
    const pkg = file.split("/")[1];
    if (!LOCAL_TOKEN_PACKAGES.includes(pkg)) return TOKEN_MODULE_SPECIFIER;
    let rel = posix.relative(dirname(file), `packages/${pkg}/src/tokens.ts`);
    if (!rel.startsWith(".")) rel = "./" + rel;
    return relativeExtension(file) ? rel : rel.replace(/\.ts$/, "");
  }
  /** Turns `pending` into text edits. Returns {text, scoped:Map<key,value>, imports}. */
  function applyRewrite(file, text, a) {
    const { sf, pending } = a;
    if (!pending.length) return null;
    const sharedFamilies = [...new Set(pending.filter((p) => p.family).map((p) => p.family))];
    const needScoped = pending.some((p) => p.scopedKey);
    const want = new Set([...sharedFamilies, ...(needScoped ? ["tokens"] : [])]);
    const collided = nameCollisions(sf, want);
    const local = {};
    for (const f of want) {
      if (!collided.has(f)) { local[f] = f; continue; }
      const alias = f === "tokens" ? basename(tokensSiblingPath(file), ".tokens.ts").replace(/[^A-Za-z0-9_$]/g, "") + "Tokens" : f + "Token";
      if (nameCollisions(sf, new Set([alias])).size) throw new Error(`${file}: alias ${alias} collides too`);
      local[f] = alias;
    }
    const edits = [];
    const scoped = new Map();
    for (const p of pending) {
      let t;
      if (p.family) t = (p.neg ? "-" : "") + referenceText(p.family, p.key, local);
      else { t = `${local.tokens}.${p.scopedKey}`; scoped.set(p.scopedKey, p.value); }
      edits.push({ start: p.node.getStart(), end: p.node.getEnd(), text: t });
    }
    // import lines
    const eol = text.includes("\r\n") ? "\r\n" : "\n";
    const importDecls = sf.getImportDeclarations();
    const spaced = importDecls.some((d) => /^import\s*(type\s+)?\{ /.test(d.getText()));
    const q = importDecls.length ? importDecls[0].getModuleSpecifier().getText()[0] : '"';
    const semi = importDecls.length ? (importDecls[importDecls.length - 1].getText().endsWith(";") ? ";" : "") : ";";
    const spec = (f) => (local[f] === f ? f : `${f} as ${local[f]}`);
    const braces = (list) => (spaced ? `{ ${list.join(", ")} }` : `{${list.join(",")}}`);
    const lines = [];
    const fams = EXPORT_ORDER.filter((f) => sharedFamilies.includes(f));
    if (fams.length) lines.push(`import ${braces(fams.map(spec))} from ${q}${tokenSpecifier(file)}${q}${semi}`);
    if (needScoped) {
      const sib = "./" + basename(tokensSiblingPath(file));
      const ext = relativeExtension(file);
      lines.push(`import ${braces([spec("tokens")])} from ${q}${ext ? sib : sib.replace(/\.ts$/, "")}${q}${semi}`);
    }
    let insertAt;
    if (importDecls.length) insertAt = importDecls[importDecls.length - 1].getEnd();
    else {
      // after leading directives/comments: insert at the first statement
      const first = sf.getStatements()[0];
      insertAt = first ? first.getStart() : 0;
      edits.push({ start: insertAt, end: insertAt, text: lines.join(eol) + eol + (first ? eol : "") });
      return finish(text, edits, scoped, local);
    }
    edits.push({ start: insertAt, end: insertAt, text: eol + lines.join(eol) });
    return finish(text, edits, scoped, local);
  }
  function finish(text, edits, scoped, local) {
    const sorted = [...edits].sort((x, y) => y.start - x.start || y.end - x.end);
    let out = text;
    for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    return { text: out, scoped, local };
  }
  // Does the package write relative specifiers with the `.ts` extension? (ui and panes do.)
  const extCache = new Map();
  function relativeExtension(file) {
    const pkg = file.split("/")[1];
    if (extCache.has(pkg)) return extCache.get(pkg);
    const files = execFileSync("git", ["grep", "-hE", "from [\"'](\\.\\.?/)[^\"']*[\"']", "--", `packages/${pkg}/src`], { cwd, encoding: "utf8", maxBuffer: 1 << 26 }).split("\n");
    const withExt = files.filter((l) => /from ["']\.\.?\/[^"']*\.tsx?["']/.test(l)).length;
    const without = files.filter((l) => /from ["']\.\.?\/[^"']*["']/.test(l) && !/\.(tsx?|js|json)["']/.test(l)).length;
    const r = withExt >= without;
    extCache.set(pkg, r);
    return r;
  }

  return { tsm, project, analyze, applyRewrite, tokenSpecifier, tokensSiblingPath, relativeExtension, withCore, shared, map, tokensJson, onScale, forget: (f) => { const s = project.getSourceFile("/" + f); if (s) project.removeSourceFile(s); } };
}
