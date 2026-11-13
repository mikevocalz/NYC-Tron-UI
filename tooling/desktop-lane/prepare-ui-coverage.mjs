// Turns an already prepared desktop lane consumer (the RNW 0.85 consumer from
// packages/windows-fluent/rnw-fabric/scripts/prepare-consumer.mjs, or the
// Spark consumer from tooling/macos-appkit/prepare-consumer.mjs) into the
// @nyc-tron/ui coverage harness app for gate T4.
//
//   node tooling/desktop-lane/prepare-ui-coverage.mjs <consumer-dir> <ui-archive.tgz> --lane windows|macos
//     --props <props.json> [--install extract|npm] [--only <export subpath>]
//
// It never edits repository files. In the consumer copy it:
//   1. installs the packed @nyc-tron/ui archive. The default, --install
//      extract, unpacks it into node_modules without npm, so the archive's
//      react-native >=0.88 peer is not resolved or enforced; the measurement
//      is what this lane's installed runtime does with it. --install npm runs
//      the documented desktop install instead: npm install of the archive with
//      the scoped override {"@nyc-tron/ui": {"react-native": "$react-native"}}
//      in the consumer's package.json (docs/SUPPORT.md, V1_DECISIONS D5);
//   2. writes the harness (runtime + one lazy require per public export) and
//      one throwing stub per bare specifier the package imports;
//   3. keeps the lane's Metro config as metro.config.lane.js behind the
//      observing wrapper;
//   4. replaces the app entry so the harness is the root component.
// --only limits the harness to one export subpath, for example
// ./components/Button, to render one supported component after an install.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { coverageModel, readManifest } from "./ui-coverage-model.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const [consumerArgument, archiveArgument] = process.argv.slice(2);
const laneIndex = process.argv.indexOf("--lane");
const lane = laneIndex > 0 ? process.argv[laneIndex + 1] : undefined;
const propsIndex = process.argv.indexOf("--props");
const propsFile = propsIndex > 0 ? process.argv[propsIndex + 1] : undefined;
const installIndex = process.argv.indexOf("--install");
const installMode = installIndex > 0 ? process.argv[installIndex + 1] : "extract";
const onlyIndex = process.argv.indexOf("--only");
const only = onlyIndex > 0 ? process.argv[onlyIndex + 1] : undefined;
if (!consumerArgument || !archiveArgument || !["windows", "macos"].includes(lane) || !propsFile || !["extract", "npm"].includes(installMode) || (onlyIndex > 0 && !only)) {
  throw new Error("Usage: prepare-ui-coverage.mjs <consumer-dir> <ui-archive.tgz> --lane windows|macos --props <props.json> [--install extract|npm] [--only <export subpath>]");
}
const consumer = resolve(consumerArgument), archive = resolve(archiveArgument);
const coverage = join(consumer, "tron-ui-coverage");
if (!existsSync(join(consumer, "package.json"))) throw new Error("Prepare the lane consumer first");
if (existsSync(coverage)) throw new Error("Consumer already has a coverage harness; use a fresh consumer");
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

// 1. Install the exact archive bytes.
const target = join(consumer, "node_modules", "@nyc-tron", "ui");
if (existsSync(target)) throw new Error("@nyc-tron/ui is already installed in this consumer");
// The desktop lanes ship React Native below ui's >=0.88 floor. This override
// is scoped to ui's react-native edge and to these lanes; only components on
// the lane's support list are supported (docs/SUPPORT.md).
const DESKTOP_OVERRIDE = { "@nyc-tron/ui": { "react-native": "$react-native" } };
let installedWith = "tar extraction; peers not resolved";
if (installMode === "npm") {
  const manifestFile = join(consumer, "package.json");
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  if (!manifest.dependencies?.["react-native"]) throw new Error("The lane consumer must list react-native as a direct dependency for the $react-native override");
  manifest.overrides = { ...manifest.overrides, ...DESKTOP_OVERRIDE };
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  mkdirSync(join(consumer, "vendor"), { recursive: true });
  const vendored = join(consumer, "vendor", archive.split(/[\\/]/).pop());
  if (!existsSync(vendored)) copyFileSync(archive, vendored);
  const npm = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "--no-audit", "--no-fund", "file:vendor/" + vendored.split(/[\\/]/).pop()],
    { cwd: consumer, stdio: "inherit", shell: process.platform === "win32" });
  if (npm.error || npm.status !== 0) throw npm.error ?? new Error(`npm install of the ui archive failed (${npm.status})`);
  if (sha256(readFileSync(vendored)) !== sha256(readFileSync(archive))) throw new Error("The vendored ui archive changed");
  installedWith = "npm install with overrides " + JSON.stringify(DESKTOP_OVERRIDE);
} else {
  mkdirSync(target, { recursive: true });
  const tar = spawnSync("tar", ["-xzf", archive, "--strip-components=1", "-C", target], { stdio: "inherit" });
  if (tar.status !== 0) throw new Error("Could not extract the @nyc-tron/ui archive");
}
const ui = readManifest(target);
if (ui.name !== "@nyc-tron/ui") throw new Error(`Archive is ${ui.name}, expected @nyc-tron/ui`);

// 2. Harness entry list and stubs.
process.env.TRON_TYPESCRIPT_FROM ??= consumer;
const model = coverageModel(target, lane);
if (only) {
  model.entries = model.entries.filter(entry => entry.subpath === only);
  if (model.entries.length !== 1) throw new Error(`--only ${only} is not a public export of @nyc-tron/ui`);
}
mkdirSync(join(coverage, "stubs"), { recursive: true });
const stubs = {};
model.bare.forEach((specifier, index) => {
  const file = `stubs/${index}.js`;
  stubs[specifier] = file;
  writeFileSync(join(coverage, file), `// Generated: ${specifier} did not resolve in the ${lane} lane.\n` +
    `throw new Error(${JSON.stringify(`NYCTRON_UNRESOLVED ${specifier} is not resolvable in the ${lane} lane`)});\n`);
});
writeFileSync(join(coverage, "stubs.json"), JSON.stringify(stubs, null, 2) + "\n");
copyFileSync(join(here, "harness-runtime.js"), join(coverage, "harness-runtime.js"));
copyFileSync(join(here, "load-entry.js"), join(coverage, "load-entry.js"));
const props = JSON.parse(readFileSync(resolve(propsFile), "utf8"));
if (props.archiveSha256 !== sha256(readFileSync(archive))) throw new Error("Synthesized props were generated for a different @nyc-tron/ui archive");
writeFileSync(join(coverage, "props.json"), JSON.stringify(props.props) + "\n");
const lines = model.entries.map(entry => `  { subpath: ${JSON.stringify(entry.subpath)}, props: props[${JSON.stringify(entry.subpath)}], load: () => require(${JSON.stringify(entry.specifier)}) },`);
writeFileSync(join(coverage, "harness.js"), [
  "// Generated by tooling/desktop-lane/prepare-ui-coverage.mjs. One lazy require per public export.",
  'import { createCoverageApp } from "./harness-runtime.js";',
  'const props = require("./props.json");',
  "const entries = [",
  ...lines,
  "];",
  `export const TronUiCoverage = createCoverageApp(entries, ${JSON.stringify(lane)});`,
  "",
].join("\n"));
writeFileSync(join(coverage, "model.json"), JSON.stringify(model, null, 2) + "\n");

// 3. Observe resolution without changing it.
const metroConfig = join(consumer, "metro.config.js");
if (!existsSync(metroConfig)) throw new Error("Lane consumer has no metro.config.js");
renameSync(metroConfig, join(consumer, "metro.config.lane.js"));
copyFileSync(join(here, "metro-config-wrapper.cjs"), metroConfig);
rmSync(join(coverage, "resolution.jsonl"), { force: true });

// 4. Root component.
let entryFile;
if (lane === "windows") {
  entryFile = "index.js";
  writeFileSync(join(consumer, entryFile), [
    'import { AppRegistry } from "react-native";',
    'import { TronUiCoverage } from "./tron-ui-coverage/harness.js";',
    'AppRegistry.registerComponent("NYCTronWindowsExample", () => TronUiCoverage);',
    "",
  ].join("\n"));
} else {
  entryFile = "index.ts";
  writeFileSync(join(consumer, entryFile), [
    "require('@legendapp/spark/runtime-entry');",
    "if (!(globalThis as { __THREADED_RUNTIME_ENV__?: boolean }).__THREADED_RUNTIME_ENV__) {",
    "  const { registerRootComponent } = require('expo');",
    "  const { TronUiCoverage } = require('./tron-ui-coverage/harness.js');",
    "  registerRootComponent(TronUiCoverage);",
    "}",
    "// Spark selects native modules from the Metro graph, and the acceptance",
    "// driver links against the AppKit adapter's native code. Keep the reference",
    "// app in the graph without running it.",
    "if ((globalThis as { __TRON_UI_COVERAGE_NEVER__?: boolean }).__TRON_UI_COVERAGE_NEVER__) require('./App');",
    "",
  ].join("\n"));
}

const runtime = name => {
  const path = join(consumer, "node_modules", name, "package.json");
  return existsSync(path) ? readManifest(dirname(path)).version : null;
};
const preparation = {
  schema: 1, lane, entryFile,
  props: { file: "props.json", sha256: sha256(readFileSync(resolve(propsFile))), rule: props.rule },
  ui: { version: ui.version, archive: archive.split(/[\\/]/).pop(), sha256: sha256(readFileSync(archive)), installedWith },
  runtime: Object.fromEntries(["react", "react-native", "react-native-windows", "react-native-macos", "@legendapp/spark", "expo", "zustand", "@nyc-tron/core"].map(name => [name, runtime(name)])),
  exports: model.entries.length,
  ...(only ? { only } : {}),
  bareSpecifiers: model.bare,
};
writeFileSync(join(coverage, "preparation.json"), JSON.stringify(preparation, null, 2) + "\n");
console.info(`Prepared @nyc-tron/ui ${ui.version} coverage harness (${model.entries.length} exports) for the ${lane} lane in ${consumer}`);
