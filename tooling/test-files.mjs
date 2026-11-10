// Single source of truth for which test files run. Every *.test.mjs / *.test.js
// under packages/*/tests (any depth) plus the nested rnw-fabric package and the
// tooling tests. Playwright suites (browser/) and fixtures need their own
// runners and are skipped. Paths are repo-relative with forward slashes so the
// same list works on Linux, macOS and Windows.
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const skipDirs = new Set(["browser", "fixtures", "node_modules"]);

function walk(dir, out) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(full, out);
    } else if (/\.test\.(mjs|js)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

export function discoverTests() {
  const found = [];
  const packagesRoot = join(root, "packages");
  for (const pkg of readdirSync(packagesRoot, { withFileTypes: true })) {
    if (pkg.isDirectory()) walk(join(packagesRoot, pkg.name, "tests"), found);
  }
  walk(join(packagesRoot, "windows-fluent", "rnw-fabric", "tests"), found);
  walk(join(root, "tooling", "tests"), found);
  return found.map((f) => f.slice(root.length + 1).split("\\").join("/")).sort();
}
