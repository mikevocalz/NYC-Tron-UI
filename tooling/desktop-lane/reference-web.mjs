// Web reference run for the desktop lane coverage harness (gate T4).
// Same harness, same packed @nyc-tron/ui and @nyc-tron/core archives and the
// same provided packages (react, react-native, zustand, @nyc-tron/core) as the
// desktop lanes, on React Native Web 0.21.4 and React 19.3 in Chromium, the
// runtime of the repository's browser acceptance suite. Every other bare
// specifier is replaced by the same throwing stub the lanes use.
//
// Its only job is attribution: a component that also fails here with no props
// and the same peer set does not fail because of the desktop lane's React
// Native version. It is not React Native 0.88 and not a native result.
//
//   node tooling/desktop-lane/reference-web.mjs <archive-dir> <evidence-dir>
// Requires `npm ci` in packages/ui/tests/browser and Playwright Chromium.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { coverageModel, packageNameOf } from "./ui-coverage-model.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const browserDir = resolve(here, "../../packages/ui/tests/browser");
const requireBrowser = createRequire(join(browserDir, "package.json"));
const [archiveArgument, evidenceArgument, propsArgument] = process.argv.slice(2);
if (!archiveArgument || !evidenceArgument || !propsArgument) throw new Error("Usage: reference-web.mjs <archive-dir> <evidence-dir> <props.json>");
const archives = resolve(archiveArgument), evidence = resolve(evidenceArgument);
if (existsSync(evidence)) throw new Error("Use a fresh evidence directory");
mkdirSync(evidence, { recursive: true });
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

const work = realpathSync(mkdtempSync(join(tmpdir(), "tron-ui-coverage-web-")));
const installed = {};
for (const name of ["core", "ui"]) {
  const file = readdirSync(archives).find(f => f.startsWith(`nyc-tron-${name}-`) && f.endsWith(".tgz"));
  if (!file) throw new Error(`Missing @nyc-tron/${name} archive in ${archives}`);
  const target = join(work, "node_modules/@nyc-tron", name);
  mkdirSync(target, { recursive: true });
  if (spawnSync("tar", ["-xzf", join(archives, file), "--strip-components=1", "-C", target], { stdio: "inherit" }).status !== 0) throw new Error(`Cannot extract ${file}`);
  installed[`@nyc-tron/${name}`] = { archive: file, sha256: sha256(readFileSync(join(archives, file))) };
}
const uiDir = join(work, "node_modules/@nyc-tron/ui");
const model = coverageModel(uiDir, "web");
copyFileSync(join(here, "harness-runtime.js"), join(work, "harness-runtime.js"));
copyFileSync(join(here, "load-entry.js"), join(work, "load-entry.js"));
const props = JSON.parse(readFileSync(resolve(propsArgument), "utf8"));
if (props.archiveSha256 !== installed["@nyc-tron/ui"].sha256) throw new Error("Synthesized props were generated for a different @nyc-tron/ui archive");
writeFileSync(join(work, "props.json"), JSON.stringify(props.props));
writeFileSync(join(work, "entry.js"), [
  'import { AppRegistry } from "react-native";',
  'import { createCoverageApp } from "./harness-runtime.js";',
  'import props from "./props.json";',
  "const entries = [",
  ...model.entries.map(e => `  { subpath: ${JSON.stringify(e.subpath)}, props: props[${JSON.stringify(e.subpath)}], load: () => require(${JSON.stringify(e.specifier)}) },`),
  "];",
  'AppRegistry.registerComponent("coverage", () => createCoverageApp(entries, "web-reference"));',
  'AppRegistry.runApplication("coverage", { rootTag: document.getElementById("root") });',
].join("\n"));

const provided = new Map([
  ["react", "react"], ["react-dom", "react-dom"], ["react-native", "react-native-web"], ["zustand", "zustand"],
]);
const resolution = [];
const coveragePlugin = {
  name: "tron-ui-coverage",
  setup(build) {
    build.onResolve({ filter: /^[^./]/ }, args => {
      const name = packageNameOf(args.path);
      const fromUi = args.importer.startsWith(uiDir);
      // Only the harness and the archives see the lane peer set; the provided
      // packages' own dependencies resolve normally from the browser suite.
      if (!args.importer.startsWith(work)) return undefined;
      if (name === "@nyc-tron/ui" || name === "@nyc-tron/core") { // resolved from the extracted archives
        if (fromUi) resolution.push({ specifier: args.path, platform: "web", resolved: true });
        return undefined;
      }
      if (provided.has(name)) {
        const mapped = provided.get(name) + args.path.slice(name.length);
        const path = requireBrowser.resolve(mapped);
        if (fromUi) resolution.push({ specifier: args.path, platform: "web", resolved: true });
        return { path };
      }
      if (fromUi) resolution.push({ specifier: args.path, platform: "web", resolved: false });
      return { path: args.path, namespace: "tron-unresolved" };
    });
    build.onLoad({ filter: /.*/, namespace: "tron-unresolved" }, args => ({
      contents: `throw new Error(${JSON.stringify(`NYCTRON_UNRESOLVED ${args.path} is not resolvable in the web-reference lane`)});`,
      loader: "js",
    }));
  },
};
const esbuild = requireBrowser("esbuild");
await esbuild.build({
  entryPoints: [join(work, "entry.js")], bundle: true, format: "iife", platform: "browser",
  outfile: join(work, "bundle.js"), nodePaths: [join(work, "node_modules")],
  resolveExtensions: [".web.js", ".js", ".mjs", ".json"], conditions: ["browser"],
  define: { "process.env.NODE_ENV": '"production"', __DEV__: "false", global: "globalThis" },
  logLevel: "warning", plugins: [coveragePlugin],
});
const seen = new Set();
writeFileSync(join(evidence, "resolution.jsonl"), resolution.filter(r => { const k = r.specifier + r.resolved; if (seen.has(k)) return false; seen.add(k); return true; }).map(r => JSON.stringify(r)).join("\n") + "\n");
writeFileSync(join(evidence, "model.json"), JSON.stringify(model, null, 2) + "\n");

const { chromium } = requireBrowser("playwright");
const browser = await chromium.launch();
const run = { schema: 1, lane: "web-reference", startedAt: new Date().toISOString(), status: "running" };
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.setContent('<!doctype html><html><body><div id="root" style="height:100vh"></div></body></html>');
  await page.addScriptTag({ content: readFileSync(join(work, "bundle.js"), "utf8") });
  await page.waitForFunction(() => globalThis.__TRON_UI_COVERAGE__?.status === "done", null, { timeout: 15 * 60000, polling: 500 });
  const payload = await page.evaluate(() => globalThis.__TRON_UI_COVERAGE__.payload);
  writeFileSync(join(evidence, "results.json"), JSON.stringify(JSON.parse(payload), null, 2) + "\n");
  run.status = "completed"; run.unattributedPageErrors = pageErrors.slice(0, 50);
} catch (error) {
  run.status = "harness-failed"; run.error = error.message; process.exitCode = 1;
} finally {
  await browser.close();
  run.finishedAt = new Date().toISOString();
  const versions = Object.fromEntries(["react", "react-dom", "react-native-web", "zustand", "esbuild", "playwright"].map(n => [n, requireBrowser(`${n}/package.json`).version]));
  writeFileSync(join(evidence, "preparation.json"), JSON.stringify({ schema: 1, lane: "web-reference", props: { sha256: createHash("sha256").update(readFileSync(resolve(propsArgument))).digest("hex"), rule: props.rule }, ui: installed["@nyc-tron/ui"], core: installed["@nyc-tron/core"], runtime: versions, exports: model.entries.length }, null, 2) + "\n");
  writeFileSync(join(evidence, "run.json"), JSON.stringify(run, null, 2) + "\n");
}
console.info(`Web reference run ${run.status}`);
