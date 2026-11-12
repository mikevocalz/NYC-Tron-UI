// Generates one deterministic props object per exported @nyc-tron/ui component
// from its published declaration files (gate T4 coverage harness).
//
//   node tooling/desktop-lane/synthesize-props.mjs <ui-package-dir> <ui-archive.tgz> <out.json>
//
// Only required props are filled: strings "Sample", numbers 1, booleans false,
// the first member of a literal union, functions as no-ops, arrays with one
// synthesized item, nested objects recursively to depth 4. The values are not
// meaningful fixtures. They let a component get past "required prop missing"
// so the run can show whether the lane's runtime can mount it. Every lane and
// the web reference receive the same file, so a difference between lanes is
// not a difference in props.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "@typescript/typescript6";
import { readManifest, selectExport } from "./ui-coverage-model.mjs";

const [packageArgument, archiveArgument, outArgument] = process.argv.slice(2);
if (!packageArgument || !archiveArgument || !outArgument) throw new Error("Usage: synthesize-props.mjs <ui-package-dir> <ui-archive.tgz> <out.json>");
const packageDir = resolve(packageArgument);
const manifest = readManifest(packageDir);
const typeFiles = new Map();
for (const [subpath, value] of Object.entries(manifest.exports)) {
  const types = value && typeof value === "object" ? value.types : null;
  if (types) typeFiles.set(subpath, join(packageDir, types));
}
const program = ts.createProgram([...typeFiles.values()], {
  strict: true, noEmit: true, skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ES2022,
});
const checker = program.getTypeChecker();
const FN = { $fn: 1 };

function named(type) {
  const symbol = type.aliasSymbol ?? type.getSymbol();
  return symbol?.getName() ?? "";
}

function synth(type, depth, stack) {
  if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return "Sample";
  const name = named(type);
  if (name === "ReactNode") return "Sample";
  if (["ReactElement", "Element", "ReactPortal"].includes(name)) return null;
  if (name === "Date") return { $date: 0 };
  if (type.isUnion()) {
    const members = type.types.filter(t => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void)));
    if (!members.length) return null;
    if (members.every(t => t.flags & ts.TypeFlags.BooleanLiteral)) return false;
    return synth(members[0], depth, stack);
  }
  if (type.flags & ts.TypeFlags.StringLiteral) return type.value;
  if (type.flags & ts.TypeFlags.NumberLiteral) return type.value;
  if (type.flags & ts.TypeFlags.BooleanLiteral) return type.intrinsicName === "true";
  if (type.flags & ts.TypeFlags.StringLike) return "Sample";
  if (type.flags & ts.TypeFlags.NumberLike) return 1;
  if (type.flags & ts.TypeFlags.BooleanLike) return false;
  if (type.flags & ts.TypeFlags.BigIntLike) return null;
  if (type.flags & ts.TypeFlags.ESSymbolLike) return null;
  if (!(type.flags & ts.TypeFlags.Object) && !type.isIntersection()) return null;
  if (type.getCallSignatures().length && !type.getProperties().length) return FN;
  if (depth > 4 || stack.includes(type)) return null;
  const next = [...stack, type];
  if (checker.isArrayType(type)) {
    const [item] = checker.getTypeArguments(type);
    return item ? [synth(item, depth + 1, next)] : [];
  }
  if (checker.isTupleType(type)) return checker.getTypeArguments(type).map(item => synth(item, depth + 1, next));
  if (type.getCallSignatures().length) return FN;
  const value = {};
  for (const property of checker.getPropertiesOfType(type)) {
    if (property.flags & ts.SymbolFlags.Optional) continue;
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    const propertyType = declaration ? checker.getTypeOfSymbolAtLocation(property, declaration) : checker.getDeclaredTypeOfSymbol(property);
    value[property.getName()] = synth(propertyType, depth + 1, next);
  }
  return value;
}

const components = {};
let count = 0, untyped = 0;
for (const [subpath, file] of typeFiles) {
  const source = program.getSourceFile(file);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;
  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const name = symbol.getName();
    if (!/^[A-Z]/.test(name)) continue;
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    if (!(target.flags & (ts.SymbolFlags.Value))) continue;
    const declaration = target.valueDeclaration ?? target.declarations?.[0];
    if (!declaration) continue;
    const type = checker.getTypeOfSymbolAtLocation(target, declaration);
    const signature = type.getCallSignatures()[0] ?? type.getConstructSignatures()[0];
    if (!signature) continue;
    const parameter = signature.getParameters()[0];
    let props = {};
    if (parameter) {
      const parameterType = checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration ?? declaration);
      const value = synth(parameterType, 0, []);
      if (value && typeof value === "object" && !Array.isArray(value) && !("$fn" in value)) props = value;
      else untyped += 1;
    }
    (components[subpath] ??= {})[name] = props;
    count += 1;
  }
}
const archive = readFileSync(resolve(archiveArgument));
const output = {
  schema: 1, packageName: manifest.name, version: manifest.version,
  archiveSha256: createHash("sha256").update(archive).digest("hex"),
  typescript: ts.version, rule: "required props only; string 'Sample', number 1, boolean false, first literal, no-op functions, one-item arrays, depth 4",
  components: count, propsNotAnObject: untyped, props: components,
};
writeFileSync(resolve(outArgument), JSON.stringify(output) + "\n");
console.info(`Synthesized props for ${count} component exports (${untyped} without an object props type)`);
