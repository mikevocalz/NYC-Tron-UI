import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { CANONICAL_BASELINE_SHA256, parseCanonicalBaseline } from "./verify-component-program.mjs";
import { componentProfileAssignments, qtFamilies, qtProfiles, qtReferences } from "./qt-component-profiles.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const coreDependencies = new Set(["react", "react/jsx-runtime", "react/jsx-dev-runtime", "react-native", "zustand", "zustand/vanilla"]);
const scriptPattern = /\.(?:[cm]?[jt]sx?)$/;
const json = value => JSON.stringify(value, null, 2) + "\n";
const sorted = values => [...new Set(values)].sort();
const portablePath = value => value.split("\\").join("/");
const fail = message => { throw new Error("Qt component coverage: " + message); };

function runtimeTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).filter(([key]) => key !== "types").flatMap(([, child]) => runtimeTargets(child));
}

/** Package condition object order matters, just as it does in Metro/Node. */
export function selectRuntimeExport(value, target, moduleKind = "import") {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(item => selectRuntimeExport(item, target, moduleKind)).find(Boolean) ?? null;
  if (!value || typeof value !== "object") return null;
  const asserted = new Set([target, "react-native", moduleKind, "default"]);
  for (const [condition, child] of Object.entries(value)) {
    if (!asserted.has(condition)) continue;
    const selected = selectRuntimeExport(child, target, moduleKind);
    if (selected) return selected;
  }
  return null;
}

function packageManifests(rootDir) {
  const directories = readdirSync(join(rootDir, "packages"), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => join(rootDir, "packages", entry.name));
  directories.push(join(rootDir, "packages/windows-fluent/rnw-fabric"));
  return directories.filter(path => existsSync(join(path, "package.json"))).map(directory => ({
    directory, manifest: JSON.parse(readFileSync(join(directory, "package.json"), "utf8")),
  }));
}

function isFile(path) { return existsSync(path) && statSync(path).isFile(); }

function sourceFile(path, target, platformVariants = false) {
  path = path.replace(/([/\\])dist([/\\])/, "$1src$2");
  const extension = extname(path);
  if (extension && !scriptPattern.test(path)) return isFile(path) ? path : null;
  const stem = scriptPattern.test(path) ? path.slice(0, -extension.length) : path;
  const extensions = extension === ".tsx" ? [".tsx", ".ts", ".jsx", ".js"] : [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];
  const candidates = [];
  // An explicit relative filename wins in Metro. Only extensionless requests
  // try target/native suffixes; .js -> .ts below maps emitted code to source.
  if (platformVariants && !extension && target !== "source" && !/\.(native|web|ios|android|qnx|marathon)$/.test(stem)) {
    for (const platform of [target, "native"]) for (const suffix of extensions) candidates.push(stem + "." + platform + suffix);
  }
  candidates.push(path, ...extensions.map(suffix => stem + suffix));
  for (const suffix of extensions) candidates.push(join(path, "index" + suffix));
  return candidates.find(isFile) ?? null;
}

export function createSourceAuditor(rootDir, target, availableReactNativeExports = []) {
  const manifests = packageManifests(rootDir);
  const packages = new Map(manifests.map(pkg => [pkg.manifest.name, pkg]));
  const available = new Set(availableReactNativeExports);
  const parsed = new Map();

  function exportedFile(specifier, moduleKind = "import") {
    const packageName = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
    const pkg = packages.get(packageName);
    if (!pkg) return null;
    const subpath = specifier === packageName ? "." : "." + specifier.slice(packageName.length);
    const value = pkg.manifest.exports?.[subpath] ?? (subpath === "." ? pkg.manifest.main : null);
    const entry = selectRuntimeExport(value, target, moduleKind);
    return entry ? sourceFile(resolve(pkg.directory, entry), target) : null;
  }

  function imports(file) {
    if (parsed.has(file)) return parsed.get(file);
    const result = { specifiers: [], reactNativeExports: [], computedImports: [], nativeProviderCalls: [] };
    if (!scriptPattern.test(file)) { parsed.set(file, result); return result; }
    const tree = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, extname(file) === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const add = (specifier, moduleKind = "import") => result.specifiers.push({ specifier, moduleKind });
    for (const node of tree.statements) {
      if (ts.isImportDeclaration(node)) {
        const clause = node.importClause;
        if (clause?.isTypeOnly) continue;
        const bindings = clause?.namedBindings;
        if (clause && !clause.name && bindings && ts.isNamedImports(bindings) && bindings.elements.every(item => item.isTypeOnly)) continue;
        if (!ts.isStringLiteral(node.moduleSpecifier)) continue;
        const specifier = node.moduleSpecifier.text;
        add(specifier);
        if (specifier === "react-native") {
          if (clause?.name || bindings && ts.isNamespaceImport(bindings)) result.reactNativeExports.push("*");
          if (bindings && ts.isNamedImports(bindings)) result.reactNativeExports.push(...bindings.elements.filter(item => !item.isTypeOnly).map(item => (item.propertyName ?? item.name).text));
        }
      } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && !node.isTypeOnly) {
        if (node.exportClause && ts.isNamedExports(node.exportClause) && node.exportClause.elements.every(item => item.isTypeOnly)) continue;
        if (ts.isStringLiteral(node.moduleSpecifier)) add(node.moduleSpecifier.text);
      }
    }
    function visit(node) {
      if (ts.isImportTypeNode(node)) return;
      if (ts.isCallExpression(node)) {
        const expression = node.expression.getText(tree);
        if (expression === "require" || node.expression.kind === ts.SyntaxKind.ImportKeyword) {
          const argument = node.arguments[0];
          if (argument && ts.isStringLiteralLike(argument)) {
            add(argument.text, expression === "require" ? "require" : "import");
            if (argument.text === "react-native") result.reactNativeExports.push("*");
          } else result.computedImports.push(`${portablePath(relative(rootDir, file))}:${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
        }
        if (/(?:^|\.)(?:requireNativeView|requireNativeModule|requireOptionalNativeModule|requireNativeComponent|codegenNativeComponent)$/.test(expression) || /TurboModuleRegistry\.(?:get|getEnforcing)$/.test(expression)) {
          result.nativeProviderCalls.push(`${portablePath(relative(rootDir, file))}: ${expression}(${node.arguments[0]?.getText(tree) ?? ""})`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    parsed.set(file, result);
    return result;
  }

  function audit(entries) {
    const visited = new Set(), dependencies = new Set(), api = new Set(), unresolved = new Set(), computed = new Set(), providers = new Set();
    function walk(file) {
      if (visited.has(file)) return;
      visited.add(file);
      const info = imports(file);
      for (const name of info.reactNativeExports) api.add(name);
      for (const value of info.computedImports) computed.add(value);
      for (const value of info.nativeProviderCalls) providers.add(value);
      for (const { specifier, moduleKind } of info.specifiers) {
        const local = specifier.startsWith(".") ? sourceFile(resolve(dirname(file), specifier), target, true) : exportedFile(specifier, moduleKind);
        if (local) walk(local);
        else if (specifier.startsWith(".") || specifier.startsWith("@nyc-tron/")) unresolved.add(`${portablePath(relative(rootDir, file))}: ${specifier}`);
        else dependencies.add(specifier);
      }
    }
    for (const entry of entries) {
      const file = sourceFile(resolve(rootDir, entry), target);
      if (file) walk(file); else unresolved.add(entry);
    }
    return {
      runtimeDependencies: sorted(dependencies),
      additionalDependencies: sorted([...dependencies].filter(name => !coreDependencies.has(name))),
      reactNativeExports: sorted(api),
      missingReactNativeExports: sorted([...api].filter(name => name !== "*" && !available.has(name))),
      namespaceReactNativeImport: api.has("*"),
      nativeProviderCalls: sorted(providers),
      computedImports: sorted(computed),
      unresolvedImports: sorted(unresolved),
      sourceFiles: sorted([...visited].map(file => portablePath(relative(rootDir, file)))),
    };
  }
  return { audit, exportedFile, manifests };
}

export function validateQtRows(components, canonical) {
  if (!Array.isArray(components) || components.length !== canonical.length) fail(`Expected all ${canonical.length} canonical rows`);
  const names = new Map(canonical.map(row => [row.id, row.name])), seen = new Set();
  for (const row of components) {
    if (seen.has(row.id) || names.get(row.id) !== row.name) fail(`Unknown, renamed or duplicate canonical row ${row.id}`);
    seen.add(row.id);
    if (!qtProfiles[row.qtProfile]) fail(`Unknown Qt profile for ${row.id}`);
    for (const target of ["qnx", "marathon"]) {
      const result = row.targets?.[target];
      if (!result || result.runtimeAcceptance !== "unverified") fail(`${row.id} ${target} must not turn static analysis into runtime acceptance`);
      if (result.unresolvedImports?.length) fail(`${row.id} ${target} unresolved imports: ${result.unresolvedImports.join(", ")}`);
    }
    if (row.implementationReview === "implemented" && !row.publicExports?.length) fail(`${row.id} has no resolved public export`);
  }
}

export function buildQtCoverage({ rootDir = repositoryRoot, apiProfile } = {}) {
  const ledger = JSON.parse(readFileSync(join(rootDir, "docs/completion/library-progress.json"), "utf8"));
  const canonical = parseCanonicalBaseline(readFileSync(join(rootDir, "docs/completion/baseline-roster.tsv")));
  if (ledger.baselineSha256 !== CANONICAL_BASELINE_SHA256) fail("Canonical ledger identity changed");
  apiProfile ??= JSON.parse(readFileSync(join(rootDir, "docs/qt/react-native-api.json"), "utf8"));
  if (!Array.isArray(apiProfile.exports) || !apiProfile.exports.length || new Set(apiProfile.exports).size !== apiProfile.exports.length) fail("Invalid React Native API profile");
  const assignments = componentProfileAssignments();
  for (const id of assignments.keys()) if (!canonical.some(row => row.id === id)) fail(`Unknown profile override ${id}`);
  for (const [key, value] of Object.entries(qtProfiles)) {
    if (!value.boundary || !value.references.length || value.references.some(ref => !qtReferences[ref])) fail(`Unreferenced Qt profile ${key}`);
  }
  const auditors = Object.fromEntries(["source", "qnx", "marathon"].map(target => [target, createSourceAuditor(rootDir, target, apiProfile.exports)]));
  const entries = auditors.source.manifests.flatMap(({ manifest, directory }) => Object.entries(manifest.exports ?? {}).filter(([key]) => key === "." || key.startsWith("./")).map(([key, value]) => ({
    specifier: manifest.name + (key === "." ? "" : key.slice(1)), directory, value,
    sources: runtimeTargets(value).map(path => sourceFile(resolve(directory, path), "source")).filter(Boolean).map(path => portablePath(relative(rootDir, path))),
  })));
  const components = ledger.components.map(row => {
    const qtProfile = assignments.get(row.id) ?? qtFamilies[row.id[0]]?.profile;
    if (!qtProfile) fail(`Missing Qt counterpart for ${row.id}`);
    const publicEntries = entries.filter(entry => entry.sources.some(source => row.sourceCandidates.includes(source)));
    const targets = Object.fromEntries(["qnx", "marathon"].map(target => {
      if (row.implementationReview === "implemented-external") return [target, { sourceClassification: "pinned-external-provider", runtimeAcceptance: "unverified" }];
      const selected = publicEntries.map(entry => {
        const file = auditors[target].exportedFile(entry.specifier);
        if (!file) fail(`${row.id} cannot resolve ${entry.specifier} for ${target}`);
        return { specifier: entry.specifier, source: portablePath(relative(rootDir, file)) };
      });
      const analysis = auditors[target].audit(selected.map(entry => entry.source));
      const sourceClassification = analysis.unresolvedImports.length ? "unresolved-import" : analysis.missingReactNativeExports.length ? "requires-react-native-api" : analysis.additionalDependencies.length || analysis.nativeProviderCalls.length ? "requires-additional-provider" : analysis.namespaceReactNativeImport || analysis.computedImports.length ? "requires-manual-import-review" : "shared-source-candidate";
      return [target, { sourceClassification, runtimeAcceptance: "unverified", selectedExports: selected, ...analysis }];
    }));
    return {
      id: row.id, name: row.name, requirement: row.requirement, qtProfile,
      implementationReview: row.implementationReview, sourceCandidates: row.sourceCandidates,
      publicExports: sorted(publicEntries.map(entry => entry.specifier)),
      ...(row.externalImplementation ? { externalImplementation: row.externalImplementation } : {}),
      sourceAudit: auditors.source.audit(row.sourceCandidates), targets,
    };
  });
  validateQtRows(components, canonical);
  const local = components.filter(row => row.implementationReview === "implemented");
  const summaries = Object.fromEntries(["qnx", "marathon"].map(target => [target, {
    classifications: Object.fromEntries(sorted(components.map(row => row.targets[target].sourceClassification)).map(key => [key, components.filter(row => row.targets[target].sourceClassification === key).length])),
    missingReactNativeExports: Object.fromEntries(sorted(local.flatMap(row => row.targets[target].missingReactNativeExports)).map(name => [name, local.filter(row => row.targets[target].missingReactNativeExports.includes(name)).length])),
    additionalDependencies: Object.fromEntries(sorted(local.flatMap(row => row.targets[target].additionalDependencies)).map(name => [name, local.filter(row => row.targets[target].additionalDependencies.includes(name)).length])),
    runtimeAccepted: 0,
  }]));
  return {
    schemaVersion: 1, baselineSha256: CANONICAL_BASELINE_SHA256,
    scope: "341 canonical capabilities. Qt counterparts are conceptual; source reachability is not render, interaction, engine, native-provider or device acceptance.",
    reactNativeApiProfile: apiProfile,
    summary: {
      canonical: components.length, local: local.length, external: components.length - local.length,
      conservativeSourceCandidates: {
        coreDependenciesOnly: local.filter(row => !row.sourceAudit.additionalDependencies.length).length,
        additionalDependencies: local.filter(row => row.sourceAudit.additionalDependencies.length).length,
        unresolvedImports: local.reduce((sum, row) => sum + row.sourceAudit.unresolvedImports.length, 0),
      }, targets: summaries,
    },
    references: qtReferences, profiles: qtProfiles, families: qtFamilies, components,
  };
}

export function renderQtCoverage(report) {
  const lines = [
    "# Qt correspondence and source coverage", "",
    "Generated by `node tooling/qt-component-coverage.mjs --write`. Do not edit the generated rows.", "",
    report.scope, "",
    `The frozen roster contains **${report.summary.canonical} capabilities: ${report.summary.local} local implementations and ${report.summary.external} pinned external providers**.`, "",
    `Conservative traversal of every listed source candidate finds ${report.summary.conservativeSourceCandidates.coreDependenciesOnly} local rows with only React/React Native/Zustand dependencies and ${report.summary.conservativeSourceCandidates.additionalDependencies} with additional package dependencies. Those counts include all listed platform variants.`, "",
    "## Selected public exports", "",
    "The target analysis starts from ESM public imports with `qnx` or `marathon` and `react-native`, then follows each edge's import/require condition. Explicit relative filenames are preserved; extensionless relative imports prefer the target and then `.native` variants. It excludes type-only imports and includes literal dynamic imports/requires. Custom app conditions require a separate consumer check. This does not execute code, load an external dependency's native binary, or prove a Metro bundle. An optional peer is still required when the selected entry imports it.", "",
    "| Source classification | QNX | Marathon |", "| --- | ---: | ---: |",
  ];
  const classifications = sorted(Object.values(report.summary.targets).flatMap(target => Object.keys(target.classifications)));
  for (const key of classifications) lines.push(`| ${key} | ${report.summary.targets.qnx.classifications[key] ?? 0} | ${report.summary.targets.marathon.classifications[key] ?? 0} |`);
  lines.push("", "Every row retains `runtimeAcceptance: unverified` for both targets. `shared-source-candidate` only means this static import check found no extra package/native-provider call or missing named RN export. It does not cover RN API methods/semantics, native input, styling, engine callbacks, accessibility or physical devices.", "",
    "## React Native API boundary", "",
    `Profile: ${report.reactNativeApiProfile.description}`, "",
    "| Missing named RN export | QNX rows | Marathon rows |", "| --- | ---: | ---: |",
  );
  for (const name of sorted(Object.values(report.summary.targets).flatMap(target => Object.keys(target.missingReactNativeExports)))) lines.push(`| \`${name}\` | ${report.summary.targets.qnx.missingReactNativeExports[name] ?? 0} | ${report.summary.targets.marathon.missingReactNativeExports[name] ?? 0} |`);
  lines.push("", "Counts overlap when a component needs several APIs. The checked-in API profile is a reviewable cross-repository snapshot. Recheck it against the selected RN-QNX package with `--check-rn-api /absolute/path/to/PublicAPI.js` whenever that package changes.", "",
    "## Component map", "", "The counterpart column names comparable Qt controls or building blocks. It does not replace the public RN component, automatically port a native peer, or supply a Forge engine. See the profile boundaries below and [integration requirements](README.md).", "");
  for (const [family, metadata] of Object.entries(qtFamilies)) {
    lines.push(`### ${family}. ${metadata.name}`, "", "| ID | Existing capability | Qt counterpart profile | QNX / Marathon source status |", "| --- | --- | --- | --- |");
    for (const row of report.components.filter(row => row.id.startsWith(family + "-"))) {
      const exports = row.publicExports.length ? row.publicExports.map(value => `\`${value}\``).join("<br>") : row.externalImplementation.owners.map(owner => `[${owner.repository}@${owner.revision.slice(0, 8)}](https://github.com/${owner.repository}/tree/${owner.revision})`).join("<br>");
      const firstSource = row.sourceCandidates.find(source => scriptPattern.test(source));
      const name = firstSource ? `[${row.name}](../../${firstSource})` : row.name;
      const qnx = row.targets.qnx, marathon = row.targets.marathon;
      const status = qnx.sourceClassification === marathon.sourceClassification ? qnx.sourceClassification : `QNX: ${qnx.sourceClassification}; Marathon: ${marathon.sourceClassification}`;
      const missing = sorted([...(qnx.missingReactNativeExports ?? []), ...(marathon.missingReactNativeExports ?? [])]);
      const extra = sorted([...(qnx.additionalDependencies ?? []), ...(marathon.additionalDependencies ?? [])]);
      const requirements = [missing.length ? `RN: ${missing.join(", ")}` : "", extra.length ? `Peers: ${extra.join(", ")}` : "", qnx.nativeProviderCalls?.length || marathon.nativeProviderCalls?.length ? "native-provider call" : ""].filter(Boolean).join("; ");
      lines.push(`| ${row.id} | ${name}<br>${exports} | [${row.qtProfile}](#profile-${row.qtProfile}) | ${status}${requirements ? "<br>" + requirements : ""} |`);
    }
    lines.push("");
  }
  lines.push("## Counterpart boundaries", "");
  for (const [key, profile] of Object.entries(qtProfiles)) {
    lines.push(`### Profile ${key}`, "", `**${profile.kind}** — ${profile.counterparts.length ? profile.counterparts.map(name => `\`${name}\``).join(", ") : "No general Qt equivalent asserted."}`, "", profile.boundary, "", `References: ${profile.references.map(ref => `[Qt ${ref}](${qtReferences[ref]})`).join(", ")}.`, "");
  }
  return lines.join("\n");
}

export function checkReactNativeApi(path, profile) {
  const source = readFileSync(path, "utf8");
  const getters = sorted([...source.matchAll(/\bget\s+(\w+)\s*\(\s*\)\s*\{/g)].map(match => match[1]));
  if (json(getters) !== json(sorted(profile.exports))) fail("React Native named exports drifted; review docs/qt/react-native-api.json and regenerate the report");
  if (profile.sourceSha256 && createHash("sha256").update(source).digest("hex") !== profile.sourceSha256) fail("React Native public entry changed; review semantics and update its source hash");
  return getters.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const report = buildQtCoverage();
  const rnIndex = args.indexOf("--check-rn-api");
  if (rnIndex >= 0) {
    if (!args[rnIndex + 1]) fail("--check-rn-api requires an actual PublicAPI.js path");
    console.log(`React Native public entry: ${checkReactNativeApi(args[rnIndex + 1], report.reactNativeApiProfile)} exact named exports checked.`);
  }
  for (const [name, contents] of [["component-coverage.json", json(report)], ["component-coverage.md", renderQtCoverage(report)]]) {
    const path = join(repositoryRoot, "docs/qt", name);
    if (args.includes("--write")) writeFileSync(path, contents);
    else if (!existsSync(path) || readFileSync(path, "utf8") !== contents) fail(`${name} is stale; review the change and run with --write`);
  }
  console.log(json(report.summary));
}
