// Consumer smoke test. Run after pack-release:
//
//   node tooling/consumer-smoke.mjs [release-dir]   (default: release-packs)
//
// Installs the tarballs of packages with no dependencies or peers into a fresh temp project with plain `npm install`, then imports
// every export subpath under node. This proves the packed exports map resolves
// the way a consumer's install does, which the in-repo checks cannot.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const releaseDir = resolve(process.argv[2] ?? "release-packs");
const shell = process.platform === "win32";

const tarballs = readdirSync(releaseDir).filter((f) => f.endsWith(".tgz")).sort();
if (tarballs.length === 0) throw new Error("consumer-smoke: no .tgz files in " + releaseDir + "; run pack-release first");

const candidates = [];
for (const file of tarballs) {
  const path = join(releaseDir, file);
  const manifest = JSON.parse(execFileSync("tar", ["-xzOf", path, "package/package.json"], { encoding: "utf8" }));
  // Optional peers still break subpath imports (icons/native needs react), so
  // any declared dependency or peer disqualifies a package from this smoke test.
  const required = [...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.peerDependencies ?? {})];
  if (required.length === 0) candidates.push({ path, manifest });
}
if (candidates.length === 0) throw new Error("consumer-smoke: no dependency-free package found to install");

const dir = mkdtempSync(join(tmpdir(), "nyc-tron-consumer-"));
let failed = false;
try {
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "consumer-smoke", private: true, type: "module" }));
  execFileSync("npm", ["install", "--no-audit", "--no-fund", "--ignore-scripts", ...candidates.map((c) => c.path)], { cwd: dir, stdio: "inherit", shell });

  const specs = [];
  for (const { manifest } of candidates) {
    for (const [key, value] of Object.entries(manifest.exports ?? {})) {
      if (value?.default) specs.push(key === "." ? manifest.name : manifest.name + key.slice(1));
    }
  }
  // Runs inside the temp project so resolution uses its node_modules only.
  writeFileSync(join(dir, "smoke.mjs"), [
    "const specs = " + JSON.stringify(specs) + ";",
    "let bad = 0;",
    "for (const spec of specs) {",
    "  try { await import(spec); }",
    "  catch (e) { bad++; console.error('  - ' + spec + ': ' + (e && e.message)); }",
    "}",
    "if (bad) { console.error(bad + ' of ' + specs.length + ' imports failed'); process.exit(1); }",
    "console.log('Imported ' + specs.length + ' export subpaths from ' + " + JSON.stringify(candidates.map((c) => c.manifest.name).join(", ")) + ");",
  ].join("\n"));
  execFileSync(process.execPath, ["smoke.mjs"], { cwd: dir, stdio: "inherit" });
} catch (error) {
  failed = true;
  console.error(String(error && error.message ? error.message : error));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
