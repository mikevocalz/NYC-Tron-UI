// Public declaration graph gate. Build packages first, then run:
//   node tooling/api-signatures.mjs
//   node tooling/api-signatures.mjs --write     explicit reviewed baseline update
// An isolated runtime can use --package <dir> --snapshot <file>.
// For an installed archive, --compiler-root <consumer> selects its own tooling.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageArgument = process.argv.indexOf("--package");
const compilerArgument = process.argv.indexOf("--compiler-root");
const compilerLocation = compilerArgument >= 0 ? compilerArgument : packageArgument;
const compilerRoot = compilerLocation >= 0 && process.argv[compilerLocation + 1] ? resolve(process.argv[compilerLocation + 1]) : root;
if (compilerRoot !== root && !existsSync(join(compilerRoot, "node_modules/typescript/package.json"))) {
  throw new Error("Install the isolated package's own TypeScript tooling first: " + compilerRoot);
}
const ts = createRequire(join(compilerRoot, "package.json"))("typescript");
const readJSON = file => JSON.parse(readFileSync(file, "utf8"));
const slash = value => value.split(sep).join("/");
const sorted = entries => Object.fromEntries([...entries].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });

function typeTargets(value, condition = "types") {
  if (typeof value === "string") return condition === "types" && /\.d\.[cm]?ts$/.test(value) ? [value] : [];
  if (!value || typeof value !== "object") return [];
  return [...new Set(Object.entries(value).flatMap(([key, next]) => typeTargets(next, key)))];
}

export function workspacePackageDirectories(packagesRoot = join(root, "packages")) {
  return readdirSync(packagesRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(packagesRoot, entry.name, "package.json")))
    .map(entry => join(packagesRoot, entry.name)).sort();
}

/**
 * Follow symbols, rather than file imports: a private helper unused by the
 * public API is absent, while a private type exposed through a prop/return is
 * included. External types are explicit, versioned dependency boundaries.
 */
export function collectApiSignatures(packageDirectories = workspacePackageDirectories()) {
  const owners = packageDirectories.map(directory => ({ directory: resolve(directory), manifest: readJSON(join(directory, "package.json")) }))
    .sort((a, b) => b.directory.length - a.directory.length);
  const entries = [];
  for (const owner of owners) {
    for (const [subpath, value] of Object.entries(owner.manifest.exports ?? {})) {
      const targets = typeTargets(value);
      // Metadata exports, such as ./package.json, have no TypeScript API.
      if (!targets.length && subpath !== "./package.json") throw new Error(owner.manifest.name + subpath + " has no declaration target");
      for (const target of targets) {
        const file = resolve(owner.directory, target);
        if (!file.startsWith(owner.directory + sep) || !existsSync(file)) {
          throw new Error("Build first: missing or invalid public declaration " + file);
        }
        entries.push({ owner, subpath, target, file, conditions: value });
      }
    }
  }
  const program = ts.createProgram([...new Set(entries.map(entry => entry.file))], {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
    strict: true, skipLibCheck: true, noEmit: true, allowImportingTsExtensions: true,
    types: [],
  });
  const syntax = program.getSyntacticDiagnostics();
  if (syntax.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(syntax, {
    getCurrentDirectory: () => root, getCanonicalFileName: file => file, getNewLine: () => "\n",
  }));
  const checker = program.getTypeChecker();
  const declarations = new Map(), externalTypes = new Map(), pending = [], visitedNodes = new Set();
  const ownerFor = file => owners.find(owner => file.startsWith(owner.directory + sep) &&
    !relative(owner.directory, file).split(sep).includes("node_modules"));
  const dependencyCache = new Map();
  const normalized = node => printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile()).trim();
  const topLevel = node => {
    while (node.parent && !ts.isSourceFile(node.parent)) node = node.parent;
    return node;
  };
  const declarationName = node => {
    if (node.name) return node.name.getText(node.getSourceFile());
    if (ts.isVariableStatement(node)) return node.declarationList.declarations.map(item => item.name.getText()).join(",");
    if (ts.isExportAssignment(node)) return "default";
    return ts.SyntaxKind[node.kind];
  };
  const dependencyFor = file => {
    if (dependencyCache.has(file)) return dependencyCache.get(file);
    let directory = dirname(file);
    while (true) {
      const manifestFile = join(directory, "package.json");
      if (existsSync(manifestFile)) {
        const manifest = readJSON(manifestFile);
        const dependency = { name: manifest.name, version: manifest.version, file: slash(relative(directory, file)) };
        if (!dependency.name || !dependency.version) throw new Error("Unidentified public type dependency " + file);
        dependencyCache.set(file, dependency);
        return dependency;
      }
      const parent = dirname(directory);
      if (parent === directory) throw new Error("No package identity for public type dependency " + file);
      directory = parent;
    }
  };
  const qualifiedName = (symbol, declaration) => {
    // TypeScript names a source-file module with its absolute install path.
    // The dependency/package-relative file already supplies stable identity.
    if (ts.isSourceFile(declaration)) return "$module";
    const scopes = [];
    for (let parent = declaration.parent; parent && !ts.isSourceFile(parent); parent = parent.parent) {
      if (ts.isModuleDeclaration(parent)) scopes.unshift(parent.name.getText());
    }
    return [...scopes, symbol.getName()].join(".");
  };
  function targetsFor(original) {
    let symbol = original;
    const aliases = new Set();
    while (symbol?.flags & ts.SymbolFlags.Alias) {
      if (aliases.has(symbol)) throw new Error("Cyclic public export alias " + symbol.getName());
      aliases.add(symbol);
      symbol = checker.getAliasedSymbol(symbol);
      if (!symbol?.declarations?.length) throw new Error("Unresolved public type alias " + original.getName());
    }
    const targets = new Set();
    for (const declaration of symbol?.declarations ?? []) {
      const file = resolve(declaration.getSourceFile().fileName);
      const owner = ownerFor(file);
      if (owner) {
        if (!declaration.getSourceFile().isDeclarationFile) throw new Error("Public API reaches source instead of declarations: " + file);
        if (ts.isSourceFile(declaration)) {
          for (const item of checker.getExportsOfModule(symbol)) for (const id of targetsFor(item)) targets.add(id);
          continue;
        }
        const node = topLevel(declaration);
        const id = owner.manifest.name + "/" + slash(relative(owner.directory, file)) + "#" + declarationName(node);
        targets.add(id);
        if (!declarations.has(id)) declarations.set(id, { signatures: [], references: new Set() });
        if (!visitedNodes.has(node)) {
          visitedNodes.add(node);
          // Overload declaration order is significant and remains intact.
          declarations.get(id).signatures.push(normalized(node));
          pending.push({ id, node });
        }
      } else {
        const dependency = dependencyFor(file);
        const name = qualifiedName(symbol, declaration);
        const id = dependency.name + "@" + dependency.version + "/" + dependency.file + "#" + name;
        targets.add(id);
        if (!externalTypes.has(id)) externalTypes.set(id, {
          package: dependency.name, version: dependency.version, file: dependency.file, symbol: name, signatures: [],
        });
        // Module/namespace boundaries are identified without expanding the
        // entire React/TypeScript standard library into this package's API.
        if (!ts.isSourceFile(declaration) && !ts.isModuleDeclaration(declaration)) {
          const signature = normalized(declaration);
          const values = externalTypes.get(id).signatures;
          if (!values.includes(signature)) values.push(signature);
        }
      }
    }
    return [...targets].sort();
  }
  const packages = new Map();
  for (const entry of entries) {
    const source = program.getSourceFile(entry.file);
    const module = source && checker.getSymbolAtLocation(source);
    if (!module) throw new Error("Public declaration is not a module: " + entry.file);
    const symbols = checker.getExportsOfModule(module).map(symbol => {
      const targets = targetsFor(symbol);
      if (!targets.length) throw new Error("Unresolved public export " + entry.owner.manifest.name + entry.subpath + "#" + symbol.getName());
      return [symbol.getName(), targets];
    });
    const name = entry.owner.manifest.name;
    if (!packages.has(name)) packages.set(name, new Map());
    const subpaths = packages.get(name);
    if (!subpaths.has(entry.subpath)) subpaths.set(entry.subpath, []);
    subpaths.get(entry.subpath).push({ target: entry.target, conditions: entry.conditions, symbols: sorted(symbols) });
  }
  for (let cursor = 0; cursor < pending.length; cursor++) {
    const { id, node } = pending[cursor];
    const references = declarations.get(id).references;
    const visit = child => {
      if (ts.isTypeReferenceNode(child) && !checker.getSymbolAtLocation(child.typeName)) {
        throw new Error("Unresolved public type reference " + child.typeName.getText() + " in " + id);
      }
      if (ts.isImportTypeNode(child)) {
        const literal = ts.isLiteralTypeNode(child.argument) ? child.argument.literal : undefined;
        const module = literal && checker.getSymbolAtLocation(literal);
        const target = child.qualifier ? checker.getSymbolAtLocation(child.qualifier) : module;
        if (!module?.declarations?.length || !target || !targetsFor(target).length) {
          throw new Error("Unresolved public import type " + child.getText() + " in " + id);
        }
      }
      if (ts.isIdentifier(child) || ts.isStringLiteral(child) && child.parent && ts.isLiteralTypeNode(child.parent)) {
        const symbol = checker.getSymbolAtLocation(child);
        if (symbol) for (const target of targetsFor(symbol)) if (target !== id) references.add(target);
      }
      ts.forEachChild(child, visit);
    };
    visit(node);
  }
  return {
    format: 1, typescript: ts.version,
    packages: sorted([...packages].map(([name, subpaths]) => [name, sorted(subpaths)])),
    declarations: sorted([...declarations].map(([id, value]) => [id, { signatures: value.signatures, references: [...value.references].sort() }])),
    externalTypes: sorted(externalTypes),
  };
}

export function diffApiSignatures(expected, actual) {
  const changes = [];
  if (expected.format !== actual.format || expected.typescript !== actual.typescript) changes.push("snapshot format or TypeScript version changed");
  for (const section of ["packages", "declarations", "externalTypes"]) {
    const before = expected[section] ?? {}, after = actual[section] ?? {};
    for (const key of Object.keys(before)) {
      if (!(key in after)) changes.push(section + ": removed " + key);
      else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) changes.push(section + ": changed " + key);
    }
    for (const key of Object.keys(after)) if (!(key in before)) changes.push(section + ": added " + key);
  }
  return changes;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), directories = [];
  let output = join(root, "docs/api-signatures.json"), write = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--write") write = true;
    else if (args[i] === "--package" && args[i + 1]) directories.push(resolve(args[++i]));
    else if (args[i] === "--compiler-root" && args[i + 1]) i++;
    else if (args[i] === "--snapshot" && args[i + 1]) output = resolve(args[++i]);
    else throw new Error("Unknown/incomplete api-signatures argument: " + args[i]);
  }
  const actual = collectApiSignatures(directories.length ? directories : undefined);
  if (write) {
    writeFileSync(output, JSON.stringify(actual, null, 2) + "\n");
    console.log("Wrote public declaration snapshot: " + output);
  } else {
    if (!existsSync(output)) throw new Error("Missing API signature snapshot " + output + "; an explicit --write and review are required");
    const changes = diffApiSignatures(readJSON(output), actual);
    if (changes.length) {
      console.error(changes.slice(0, 80).map(change => "  - " + change).join("\n"));
      if (changes.length > 80) console.error("  ... " + (changes.length - 80) + " more changes");
      console.error("Public declarations changed. Review compatibility, then explicitly run api-signatures.mjs --write with the same package/snapshot arguments.");
      process.exitCode = 1;
    } else {
      const subpaths = Object.values(actual.packages).reduce((count, value) => count + Object.keys(value).length, 0);
      console.log(`API signatures match: ${Object.keys(actual.packages).length} packages, ${subpaths} subpaths, ${Object.keys(actual.declarations).length} reachable declarations.`);
    }
  }
}
