// Builds dist/ from the tool sources in tooling/app-identity/, which stay the
// single copy the repository's own tests and CI run. Sources are .mjs; dist
// uses .js (the package is "type": "module") so the release rules about
// relative import extensions apply to it like every other package.
//
//   node scripts/build.mjs [out-dir]   (default: dist)
import { chmodSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const toolDir = resolve(packageDir, "../../tooling/app-identity");
const out = resolve(process.argv[2] ?? join(packageDir, "dist"));

// render-example-icons.mjs draws this repository's example icons and is not shipped.
const modules = ["png", "font-metrics", "derive-icons", "launcher-label-check", "build-font-table"];

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "bin"), { recursive: true });
for (const name of modules) {
  const text = readFileSync(join(toolDir, `${name}.mjs`), "utf8").replace(/(from\s+["']\.\/[\w-]+)\.mjs(["'])/g, "$1.js$2");
  if (/\.mjs["']/.test(text)) throw new Error(`${name}.mjs has a relative .mjs import the build did not rewrite`);
  writeFileSync(join(out, `${name}.js`), text);
}
cpSync(join(toolDir, "launcher-targets.json"), join(out, "launcher-targets.json"));
cpSync(join(toolDir, "fonts"), join(out, "fonts"), { recursive: true });
cpSync(join(packageDir, "src", "index.js"), join(out, "index.js"));
cpSync(join(packageDir, "src", "index.d.ts"), join(out, "index.d.ts"));
for (const bin of ["nyc-tron-launcher-check.js", "nyc-tron-derive-icons.js"]) {
  cpSync(join(packageDir, "src", "bin", bin), join(out, "bin", bin));
  chmodSync(join(out, "bin", bin), 0o755);
}
console.log(`built @nyc-tron/app-identity into ${out}`);
