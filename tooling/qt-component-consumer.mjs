// Build the actual packed Qt control entries with a selected RN-QNX checkout.
// This is a bundle/resolution gate, not a React Native or device render test.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [packsArgument, rnArgument, outputArgument,mode] = process.argv.slice(2);
if (!packsArgument || !rnArgument || !outputArgument || mode!==undefined&&mode!=="--render-probe") throw new Error("Usage: node tooling/qt-component-consumer.mjs <packed-tarballs-dir> <rn-qnx-checkout> <new-output-dir> [--render-probe]");
const renderProbe=mode==="--render-probe",tooling=dirname(fileURLToPath(import.meta.url));
const packs = resolve(packsArgument), rnRoot = realpathSync(resolve(rnArgument)), output = resolve(outputArgument);
const project = join(output, "consumer");
assert.ok(!existsSync(project), "Use a new output directory; existing consumer files are preserved");
mkdirSync(join(project, "node_modules/@nyc-tron"), { recursive: true });
const requireRn = createRequire(join(rnRoot, "package.json"));
const { runBuild } = requireRn("metro");
const artifacts = [];
const digest = bytes => createHash("sha256").update(bytes).digest("hex");

for (const name of ["core", "ui", "expo-controls"]) {
  const matches = readdirSync(packs).filter(filename => filename.startsWith(`nyc-tron-${name}-`) && filename.endsWith(".tgz"));
  assert.equal(matches.length, 1, `Expected one packed @nyc-tron/${name} artifact`);
  const archive = join(packs, matches[0]);
  const directory = join(project, "node_modules/@nyc-tron", name);
  mkdirSync(directory);
  execFileSync("tar", ["-xzf", archive, "--strip-components=1", "-C", directory]);
  const manifest = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
  assert.equal(manifest.name, `@nyc-tron/${name}`);
  artifacts.push({ name: manifest.name, version: manifest.version, archive: matches[0], sha256: digest(readFileSync(archive)) });
}

// Reuse the selected RN checkout's pinned peer/toolchain graph. The controls
// themselves above are extracted tarballs, never workspace source symlinks.
for (const name of ["react", "react-native", "zustand"]) {
  symlinkSync(dirname(requireRn.resolve(name + "/package.json")), join(project, "node_modules", name), "dir");
}
writeFileSync(join(project, "package.json"), JSON.stringify({ name: "tron-packed-qt-consumer", private: true }));
writeFileSync(join(project, "babel.config.js"), `module.exports = { presets: [${JSON.stringify(requireRn.resolve("babel-preset-expo"))}] };\n`);
const entry = join(project, "index.js");
writeFileSync(entry, renderProbe?readFileSync(join(tooling,"qt-controls-probe.jsx"),"utf8"):`
import React from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { NativeDropdown as RootDropdown } from '@nyc-tron/expo-controls';
import { NativeDropdown } from '@nyc-tron/expo-controls/NativeDropdown';
import { Select } from '@nyc-tron/expo-controls/Select';
import { NativeActionMenu } from '@nyc-tron/expo-controls/NativeActionMenu';
import { NativePopover } from '@nyc-tron/expo-controls/NativePopover';
import { NativeSliderField } from '@nyc-tron/expo-controls/NativeSliderField';
import { NativeSplitButton } from '@nyc-tron/expo-controls/NativeSplitButton';
import { ContextMenu } from '@nyc-tron/expo-controls/ContextMenu';
import { FindReplacePopover } from '@nyc-tron/expo-controls/FindReplacePopover';
import { Tooltip } from '@nyc-tron/expo-controls/Tooltip';
import { normalizeMenuActions } from '@nyc-tron/expo-controls/menu-model';
globalThis.__TRON_QT_PACKED_EXPORTS__ = { RootDropdown, NativeDropdown, Select, NativeActionMenu,
  NativePopover, NativeSliderField, NativeSplitButton, ContextMenu, FindReplacePopover,
  Tooltip, normalizeMenuActions };
AppRegistry.registerComponent('RNQnxPlayground', () => () =>
  React.createElement(View, null, React.createElement(Text, null, 'TRON_QT_PACKED_CONTROLS_READY')));
`);
if(renderProbe){
  writeFileSync(join(project,"probe-theme.js"),readFileSync(join(tooling,"qt-probe-theme.js")));
  writeFileSync(join(project,"probe-jsx-runtime.js"),`const actual = require(${JSON.stringify(requireRn.resolve("react/jsx-runtime"))});
const rn = require('react-native');
const { createProbeJsxRuntime } = require('./probe-theme.js');
module.exports = createProbeJsxRuntime(actual, rn);\n`);
}

const babelRuntime = dirname(createRequire(requireRn.resolve("react-native/package.json")).resolve("@babel/runtime/package.json"));
const results = [];
for (const platform of ["qnx", "marathon"]) {
  const factoryPath = join(rnRoot, `packages/metro-config-${platform}/src/index.js`);
  const factory = requireRn(factoryPath)[platform === "qnx" ? "getQnxMetroConfig" : "getMarathonMetroConfig"];
  const withPublicEntry = requireRn(join(rnRoot, "packages/metro-config-qnx/public-entry.js"));
  const expectedPublicApi = realpathSync(join(rnRoot, "packages/react-native-qnx/Libraries/ReactNative/PublicAPI.js"));
  const warnings = [], resolved = new Set();
  const config = withPublicEntry(factory(project, {
    maxWorkers: 1,
    watchFolders: [project, rnRoot],
    resolver: {
      nodeModulesPaths: [join(project, "node_modules"), join(rnRoot, "node_modules")],
      extraNodeModules: { "@babel/runtime": babelRuntime },
    },
    reporter: { update(event) { if (event.type === "resolver_warning") warnings.push(event.message); } },
  }), platform);
  const fallback = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (context, moduleName, requestedPlatform) => {
    if(renderProbe&&moduleName==="react/jsx-runtime")return {type:"sourceFile",filePath:join(project,"probe-jsx-runtime.js")};
    const result = fallback(context, moduleName, requestedPlatform);
    if (result?.type === "sourceFile") {
      const path = realpathSync(result.filePath);
      resolved.add(path);
      if (moduleName === "react-native") assert.equal(path, expectedPublicApi, "Actual patched RN public entry must be used");
      assert.ok(!path.includes("/@expo/ui/") && !path.includes("/expo/"), `Unexpected mobile provider: ${moduleName}`);
    }
    return result;
  };
  const bundle = await runBuild(config, { entry, platform, dev: false, minify: false });
  assert.deepEqual(warnings, [], "Packed public exports must resolve without fallback warnings");
  assert.ok(bundle.code.includes(renderProbe?"RNQnxQtControlsProbe":"TRON_QT_PACKED_CONTROLS_READY"));
  const controlSources = [...resolved].filter(path => path.includes("/node_modules/@nyc-tron/expo-controls/dist/")).sort();
  for (const filename of ["NativeDropdown.shared.js", "NativeSliderField.web.js", "NativeActionMenu.web.js", "Tooltip.qt.js"]) {
    assert.ok(controlSources.some(path => path.endsWith("/" + filename)), `Missing expected selected entry ${filename}`);
  }
  assert.ok(controlSources.every(path => !path.endsWith(".native.js")), "Qt controls must not resolve a mobile native entry");
  writeFileSync(join(output, `${platform}.bundle.js`), bundle.code);
  const result = {
    platform, status: "bundled", bytes: Buffer.byteLength(bundle.code), sha256: digest(bundle.code),
    publicApiSha256: digest(readFileSync(expectedPublicApi)),
    selectedControlFiles: controlSources.map(path => relative(project, path)),
    resolverWarnings: warnings, nativeExecution: "not-run", deviceAcceptance: "unverified",
  };
  results.push(result);
  console.log(`${platform}: ${result.bytes} bytes; packed shared control entries resolved; no Expo mobile provider`);
}
const receipt = {
  schemaVersion: 1,
  scope: "Actual extracted NYC-Tron tarballs, real Metro target/public-entry resolver, provisioned RN checkout peers. Bundle-only; no Hermes/Qt rendering, gesture, accessibility or device acceptance.",
  node: process.version, reactNative: requireRn("react-native/package.json").version,
  metro: requireRn("metro/package.json").version, artifacts, results,
  ...(renderProbe?{fixture:{appName:"RNQnxQtControlsProbe",
    sourceSha256:digest(readFileSync(join(tooling,"qt-controls-probe.jsx"))),
    themeSha256:digest(readFileSync(join(tooling,"qt-probe-theme.js"))),
    styling:"Finite app-owned token-to-native-style mapping; real RN primitives and public controls, no event mocks.",
    input:"Prepared for the RN-QNX Qt/Fabric native event driver; bundling alone does not execute it."}}:{}),
};
writeFileSync(join(output, "receipt.json"), JSON.stringify(receipt, null, 2) + "\n");
