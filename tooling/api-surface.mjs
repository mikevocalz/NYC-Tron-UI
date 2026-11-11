// Public API surface gate. Records each workspace package's sorted "exports"
// subpath keys in docs/api-surface.json.
//
//   node tooling/api-surface.mjs            check against the snapshot
//   node tooling/api-surface.mjs --update   rewrite the snapshot
//
// Removing or adding a subpath fails the check until the snapshot is updated
// in the same change, so a breaking export change is always a reviewed diff.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const snapshotPath = join(root, "docs", "api-surface.json");

export function collectSurface(packagesRoot = join(root, "packages")) {
  const surface = {};
  for (const e of readdirSync(packagesRoot, { withFileTypes: true })) {
    const file = join(packagesRoot, e.name, "package.json");
    if (!e.isDirectory() || !existsSync(file)) continue;
    const manifest = JSON.parse(readFileSync(file, "utf8"));
    surface[manifest.name] = Object.keys(manifest.exports ?? {}).sort();
  }
  return Object.fromEntries(Object.entries(surface).sort(([a], [b]) => (a < b ? -1 : 1)));
}

export function diffSurface(expected, actual) {
  const problems = [];
  for (const name of Object.keys(expected)) {
    if (!(name in actual)) {
      problems.push(name + ": package removed");
      continue;
    }
    const have = new Set(actual[name]);
    const want = new Set(expected[name]);
    for (const key of expected[name]) if (!have.has(key)) problems.push(name + ": removed export " + key);
    for (const key of actual[name]) if (!want.has(key)) problems.push(name + ": added export " + key);
  }
  for (const name of Object.keys(actual)) if (!(name in expected)) problems.push(name + ": package added");
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const actual = collectSurface();
  if (process.argv.includes("--update")) {
    writeFileSync(snapshotPath, JSON.stringify(actual, null, 2) + "\n");
    console.log("Wrote " + snapshotPath);
  } else {
    if (!existsSync(snapshotPath)) {
      console.error("api-surface: docs/api-surface.json is missing; run with --update");
      process.exit(1);
    }
    const problems = diffSurface(JSON.parse(readFileSync(snapshotPath, "utf8")), actual);
    if (problems.length) {
      console.error(problems.map((p) => "  - " + p).join("\n"));
      console.error("api-surface: public exports changed. If intended, run: node tooling/api-surface.mjs --update");
      process.exit(1);
    }
    const count = Object.values(actual).reduce((n, keys) => n + keys.length, 0);
    console.log("API surface matches snapshot: " + Object.keys(actual).length + " packages, " + count + " export subpaths.");
  }
}
