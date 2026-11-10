// Real release consumers live outside this checkout and install the produced
// .tgz files. No workspace alias, mocked RN host or source import is allowed.
//
// node tooling/consumer-release.mjs prepare <packs> <out> <basic|expo-web|expo-native>
// node tooling/consumer-release.mjs install <out>
// node tooling/consumer-release.mjs build-web <out>
// node tooling/consumer-release.mjs test-web <out>
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BASIC_ABSENT_PEERS, consumerDependencies, exactPin, releaseChecksums, verifyArchiveHash } from "./consumer-model.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtures = join(root, "tooling/consumer-fixtures");
const readJSON = file => JSON.parse(readFileSync(file, "utf8"));
const writeJSON = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
const run = (command, args, cwd, env = {}) => execFileSync(command, args, {
  cwd, stdio: "inherit", env: { ...process.env, ...env }, shell: process.platform === "win32",
});

function archivesFrom(directory) {
  const hashes = releaseChecksums(readFileSync(join(directory, "SHA256SUMS"), "utf8"));
  const archives = new Map();
  let version;
  for (const file of readdirSync(directory).filter(name => name.endsWith(".tgz")).sort()) {
    const path = join(directory, file);
    verifyArchiveHash(file, readFileSync(path), hashes.get(file));
    const manifest = JSON.parse(execFileSync("tar", ["-xzOf", path, "package/package.json"], { encoding: "utf8" }));
    if (!manifest.name?.startsWith("@nyc-tron/")) throw new Error("Unexpected release package " + manifest.name);
    if (archives.has(manifest.name)) throw new Error("Duplicate release package " + manifest.name);
    if (version && manifest.version !== version) throw new Error("Release packages have mixed versions");
    version = manifest.version;
    archives.set(manifest.name, { path, version, sha256: hashes.get(file) });
  }
  for (const file of hashes.keys()) {
    if (!existsSync(join(directory, file))) throw new Error("Checksum refers to a missing tarball: " + file);
  }
  if (!archives.size) throw new Error("No release tarballs found");
  return archives;
}

function prepare(packs, output, kind) {
  if (!["basic", "expo-web", "expo-native"].includes(kind)) throw new Error("Unknown consumer kind " + kind);
  if (existsSync(output)) throw new Error("Consumer output must be a new directory: " + output);
  // Otherwise a missing dependency can accidentally resolve from this repo.
  if (output === root || output.startsWith(root + sep)) throw new Error("Consumer output must be outside the repository");
  const archives = archivesFrom(packs);
  const native = readJSON(join(root, "examples/native-instruments/package.json"));
  const browser = readJSON(join(root, "packages/ui/tests/browser/package.json"));
  const project = join(output, "app");
  mkdirSync(project, { recursive: true });
  const dependency = name => exactPin(name, native.dependencies[name] ?? browser.dependencies[name]);
  const devVersion = name => {
    const lookup = createRequire(join(root, "package.json"));
    return exactPin(name, readJSON(lookup.resolve(name + "/package.json")).version);
  };
  const common = Object.fromEntries(["react", "react-native", "zustand"].map(name => [name, dependency(name)]));
  let dependencies = kind === "expo-native" ? { ...native.dependencies } : {
    ...common, "react-dom": dependency("react-dom"), "react-native-web": dependency("react-native-web"),
  };
  const required = ["@nyc-tron/ui"];
  if (kind !== "basic") required.push("@nyc-tron/core", "@nyc-tron/panes", "@nyc-tron/expo-controls");
  if (kind === "expo-web") {
    dependencies.expo = dependency("expo");
    dependencies["@expo/ui"] = dependency("@expo/ui");
  }
  dependencies = consumerDependencies(dependencies, archives, required);
  // Exact direct runtime pins are inherited from the existing host. Never
  // widen a range or adopt latest to make a consumer install pass.
  for (const [name, version] of Object.entries(dependencies)) {
    if (!name.startsWith("@nyc-tron/")) exactPin(name, version);
  }
  const manifest = {
    name: "nyc-tron-" + kind + "-release-consumer", private: true, version: "0.0.0",
    dependencies,
    devDependencies: { typescript: devVersion("typescript"), "@types/react": devVersion("@types/react") },
  };
  if (kind === "expo-native") {
    copyNativeHost(project);
    manifest.main = "reference-app.js";
    manifest.scripts = { typecheck: "tsc --noEmit" };
  } else {
    manifest.type = "module";
    manifest.devDependencies.esbuild = exactPin("esbuild", browser.dependencies.esbuild);
    manifest.devDependencies.playwright = exactPin("playwright", browser.dependencies.playwright);
    manifest.scripts = { typecheck: "tsc --noEmit", test: "playwright test" };
    cpSync(join(fixtures, "BasicApp.tsx"), join(project, "BasicApp.tsx"));
    if (kind === "expo-web") cpSync(join(fixtures, "ExpoApp.tsx"), join(project, "ExpoApp.tsx"));
    cpSync(join(fixtures, "consumer.spec.mjs"), join(project, "consumer.spec.mjs"));
    const appName = kind === "basic" ? "BasicApp" : "ExpoApp";
    writeFileSync(join(project, "entry.tsx"), [
      'import { AppRegistry } from "react-native";',
      `import { ${appName} } from "./${appName}";`,
      `AppRegistry.registerComponent("Consumer", () => ${appName});`,
      'const rootTag = document.getElementById("root");',
      'if (!rootTag) throw new Error("Missing consumer root");',
      '// RNW accepts an Element; shared RN declarations describe the native RootTag.',
      'AppRegistry.runApplication("Consumer", { rootTag: rootTag as unknown as Parameters<typeof AppRegistry.runApplication>[1]["rootTag"], initialProps: {} });',
    ].join("\n") + "\n");
    writeJSON(join(project, "tsconfig.json"), {
      compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx",
        strict: true, noEmit: true, skipLibCheck: true, esModuleInterop: true, lib: ["ES2022", "DOM"] },
      include: ["*.tsx"],
    });
  }
  writeJSON(join(project, "package.json"), manifest);
  writeJSON(join(output, "consumer.json"), {
    kind, sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    packages: Object.fromEntries([...archives].filter(([name]) => name in dependencies)),
    absentPeers: kind === "basic" ? BASIC_ABSENT_PEERS : [],
  });
  console.log("Prepared " + kind + " consumer at " + project);
}

function copyNativeHost(project) {
  const source = join(root, "examples/native-instruments");
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (["assets", "plugins"].includes(entry.name)) cpSync(join(source, entry.name), join(project, entry.name), { recursive: true });
    } else if (/\.(?:tsx?|jsx?|cjs|json|css)$/.test(entry.name) && !["package.json", "package-lock.json"].includes(entry.name)) {
      let content = readFileSync(join(source, entry.name), "utf8");
      content = content.replaceAll("../native-feel", "./reference")
        .replaceAll("../../packages/ui/dist/components", "./node_modules/@nyc-tron/ui/dist/components")
        .replaceAll("../../packages/expo-controls/dist/components", "./node_modules/@nyc-tron/expo-controls/dist/components")
        .replaceAll("../../packages/panes/dist/components", "./node_modules/@nyc-tron/panes/dist/components");
      writeFileSync(join(project, entry.name), content);
    }
  }
  if (!existsSync(join(project, "reference-app.js"))) throw new Error("Native reference-app.js entry is required for the packaged consumer");
  const reference = join(root, "examples/native-feel");
  mkdirSync(join(project, "reference"));
  // Copy authored screens, not this workspace's node_modules symlinks or its
  // package/tsconfig files. The consumer has one installed dependency graph.
  for (const entry of readdirSync(reference, { withFileTypes: true })) {
    if (entry.isFile() && /\.(?:tsx?|jsx?|css)$/.test(entry.name)) {
      cpSync(join(reference, entry.name), join(project, "reference", entry.name));
    } else if (entry.isDirectory() && entry.name === "assets") {
      cpSync(join(reference, entry.name), join(project, "reference", entry.name), { recursive: true });
    }
  }
  // A clean npm app resolves its installed runtime itself. No watchFolder or
  // resolver may reach the source checkout or its node_modules.
  writeFileSync(join(project, "metro.config.js"), [
    "const {getDefaultConfig} = require('expo/metro-config');",
    "const {withUniwindConfig} = require('uniwind/metro');",
    "module.exports = withUniwindConfig(getDefaultConfig(__dirname), {cssEntryFile: './reference.css', dtsFile: './uniwind-types.d.ts'});",
  ].join("\n") + "\n");
}

function checkInstall(output) {
  const project = join(output, "app");
  const plan = readJSON(join(output, "consumer.json"));
  const localRequire = createRequire(join(project, "package.json"));
  const packageRoot = realpathSync(join(project, "node_modules")) + sep;
  const installed = {};
  for (const [name, expected] of Object.entries(plan.packages)) {
    const directory = realpathSync(join(project, "node_modules", name));
    if (!directory.startsWith(packageRoot)) throw new Error(name + " resolved outside the clean consumer");
    const actual = readJSON(join(directory, "package.json"));
    if (actual.version !== expected.version) throw new Error(name + " installed the wrong release version");
    if (JSON.stringify(actual).includes("workspace:")) throw new Error(name + " retained a workspace dependency");
    installed[name] = { version: actual.version, sha256: expected.sha256, directory };
  }
  for (const name of plan.absentPeers) {
    let found;
    try { found = localRequire.resolve(name); } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND" && error.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") throw error;
    }
    if (found || existsSync(join(project, "node_modules", name))) throw new Error("Basic consumer unexpectedly installed " + name);
  }
  writeJSON(join(output, "installed-packages.json"), { ...plan, packages: installed });
  console.log("Verified " + Object.keys(installed).length + " installed release tarballs in " + plan.kind);
}

async function buildWeb(output) {
  const project = join(output, "app"), plan = readJSON(join(output, "consumer.json"));
  if (plan.kind === "expo-native") throw new Error("Use Expo export for the native consumer");
  checkInstall(output);
  run("npm", ["run", "typecheck"], project);
  const localRequire = createRequire(join(project, "package.json"));
  const { build } = await import(pathToFileURL(localRequire.resolve("esbuild")).href);
  mkdirSync(join(project, "artifacts"), { recursive: true });
  const result = await build({
    absWorkingDir: project, entryPoints: ["entry.tsx"], bundle: true, outfile: "bundle.js",
    format: "iife", jsx: "automatic", platform: "browser", metafile: true,
    resolveExtensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: { "react-native": dirname(localRequire.resolve("react-native-web/package.json")) },
    define: { global: "globalThis", "process.env.NODE_ENV": '"development"', __DEV__: "true" },
  });
  // Resolve everything from the new install, even when this tool itself runs
  // from the repository. An accidental source dependency fails the gate.
  const inputs = Object.keys(result.metafile.inputs).map(file => resolve(project, file));
  for (const file of inputs) {
    if (file === root || file.startsWith(root + sep)) throw new Error("Consumer bundle reached repository source: " + file);
    if (!file.startsWith(project + sep)) throw new Error("Consumer bundle reached an external dependency: " + file);
  }
  if (!inputs.some(file => file.includes(join("node_modules", "@nyc-tron", "ui", "dist") + sep))) {
    throw new Error("Consumer bundle did not use the installed UI distribution");
  }
  writeJSON(join(project, "artifacts/bundle-inputs.json"), result.metafile);
  // Only this test bootstrap is HTML; the displayed UI comes from the installed
  // React Native components and the real React Native Web renderer.
  writeFileSync(join(project, "server.mjs"), `import {createServer} from "node:http";
import {readFileSync} from "node:fs";
const html='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Installed NYC-Tron</title></head><body style="margin:0"><div id="root"></div><script src="/bundle.js"></script></body></html>';
createServer((req,res)=>{if(req.url==='/bundle.js'){res.setHeader('Content-Type','text/javascript');res.end(readFileSync('bundle.js'));}else if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end(html);}else{res.writeHead(404);res.end();}}).listen(Number(process.env.CONSUMER_PORT??4187),'127.0.0.1');\n`);
  writeFileSync(join(project, "playwright.config.mjs"), `import {defineConfig} from "playwright/test";
const port=Number(process.env.CONSUMER_PORT??4187);
export default defineConfig({testDir:'.',testMatch:'consumer.spec.mjs',workers:1,retries:0,reporter:[['list'],['json',{outputFile:'artifacts/results.json'}]],use:{baseURL:'http://127.0.0.1:'+port,trace:'retain-on-failure'},webServer:{command:'node server.mjs',url:'http://127.0.0.1:'+port,reuseExistingServer:false},projects:[{name:'chromium',use:{browserName:'chromium',launchOptions:process.env.CONSUMER_BROWSER_EXECUTABLE?{executablePath:process.env.CONSUMER_BROWSER_EXECUTABLE}:{}}}]});\n`);
  console.log("Built installed " + plan.kind + " consumer without workspace imports");
}

const [command, first, second, third] = process.argv.slice(2);
if (command === "prepare" && first && second && third) prepare(resolve(first), resolve(second), third);
else if (command === "install" && first) {
  const output = resolve(first);
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], join(output, "app"));
  checkInstall(output);
} else if (command === "check-install" && first) checkInstall(resolve(first));
else if (command === "build-web" && first) await buildWeb(resolve(first));
else if (command === "test-web" && first) {
  const output = resolve(first), plan = readJSON(join(output, "consumer.json"));
  run("npm", ["test"], join(output, "app"), { CONSUMER_KIND: plan.kind });
} else throw new Error("Expected prepare <packs> <new-output> <kind>, install/check-install/build-web/test-web <output>");
