// Static model of the packed @nyc-tron/ui distribution for the desktop lane
// coverage harness (gate T4). It lists every public export subpath, picks the
// runtime file a bundler selects for a lane, and follows the emitted relative
// imports to find which bare package specifiers each export needs.
//
// This is a resolution model only. Whether a bare specifier resolves in a lane
// is recorded by that lane's own Metro run (see metro-config-wrapper.cjs), and
// whether a component renders is recorded by the native harness.
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";

/** Conditions each lane asserts, in Metro/esbuild terms. */
export const laneConditions = Object.freeze({
  windows: ["react-native", "import", "require", "default"],
  macos: ["react-native", "import", "require", "default"],
  web: ["browser", "import", "require", "default"],
});

/** Packages the lanes and the web reference provide to the harness. */
export const providedPackages = Object.freeze(["react", "react-native", "zustand", "@nyc-tron/core"]);

export function packageNameOf(specifier) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

/** Package condition object order matters, as it does in Metro and Node. */
export function selectExport(value, conditions) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    for (const item of value) { const hit = selectExport(item, conditions); if (hit) return hit; }
    return null;
  }
  if (!value || typeof value !== "object") return null;
  for (const [condition, child] of Object.entries(value)) {
    if (condition === "types" || !conditions.includes(condition)) continue;
    const hit = selectExport(child, conditions);
    if (hit) return hit;
  }
  return null;
}

export function readManifest(packageDir) {
  return JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8"));
}

/** Every public export subpath with the runtime file selected for a lane. */
export function exportEntries(packageDir, lane) {
  const conditions = laneConditions[lane];
  if (!conditions) throw new Error(`Unknown lane: ${lane}`);
  const manifest = readManifest(packageDir);
  return Object.entries(manifest.exports ?? {})
    .filter(([subpath]) => subpath !== "./package.json")
    .map(([subpath, value]) => {
      const target = selectExport(value, conditions);
      if (!target) throw new Error(`${manifest.name} ${subpath} has no runtime target for ${lane}`);
      const file = resolve(packageDir, target);
      if (!existsSync(file)) throw new Error(`${manifest.name} ${subpath} -> ${target} is missing`);
      return { subpath, specifier: subpath === "." ? manifest.name : manifest.name + subpath.slice(1), file };
    });
}

// The repository root has TypeScript after a workspace install. Lane runners
// that only install a consumer pass that consumer through TRON_TYPESCRIPT_FROM.
let loadedTypeScript;
function typescript() {
  if (loadedTypeScript) return loadedTypeScript;
  const bases = [import.meta.url];
  if (process.env.TRON_TYPESCRIPT_FROM) bases.push(join(resolve(process.env.TRON_TYPESCRIPT_FROM), "package.json"));
  // TypeScript 7 has no JavaScript API; the workspace keeps the 6.x compiler
  // API as @typescript/typescript6. Lane consumers carry a 5.x "typescript".
  for (const base of bases) {
    for (const name of ["@typescript/typescript6", "typescript"]) {
      try {
        const candidate = createRequire(base)(name);
        if (typeof candidate.preProcessFile === "function") return (loadedTypeScript = candidate);
      } catch {}
    }
  }
  throw new Error("TypeScript is not installed; set TRON_TYPESCRIPT_FROM to a directory that has it");
}

/** Import specifiers of one emitted JS file, from the TypeScript scanner (strings and comments are skipped). */
export function importSpecifiers(source) {
  const info = typescript().preProcessFile(source, true, true);
  return [...new Set(info.importedFiles.map(file => file.fileName))];
}

function isFile(path) { return existsSync(path) && statSync(path).isFile(); }

/** Metro picks an explicit relative filename first; extensionless requests try platform suffixes. */
export function resolveRelative(fromFile, specifier, lane) {
  const base = resolve(dirname(fromFile), specifier);
  if (isFile(base)) return base;
  const platforms = lane === "web" ? ["web"] : [lane, "native"];
  for (const platform of platforms) for (const ext of [".js", ".mjs"]) {
    const stem = base.replace(/\.(?:m?js)$/, "");
    if (isFile(`${stem}.${platform}${ext}`)) return `${stem}.${platform}${ext}`;
  }
  for (const ext of [".js", ".mjs", "/index.js"]) if (isFile(base + ext)) return base + ext;
  return null;
}

/** Transitive relative closure from one file and the bare specifiers it reaches. */
export function closure(entryFile, lane, packageDir) {
  const files = new Set(), bare = new Set(), missing = [];
  const queue = [entryFile];
  while (queue.length) {
    const file = queue.pop();
    if (files.has(file)) continue;
    files.add(file);
    for (const specifier of importSpecifiers(readFileSync(file, "utf8"))) {
      if (specifier.startsWith(".")) {
        const target = resolveRelative(file, specifier, lane);
        if (target) queue.push(target);
        else missing.push({ from: relative(packageDir, file), specifier });
      } else bare.add(specifier);
    }
  }
  return { files: [...files].map(f => relative(packageDir, f).split("\\").join("/")).sort(), bare: [...bare].sort(), missing };
}

/** Per-export static model for a lane. */
export function coverageModel(packageDir, lane) {
  const manifest = readManifest(packageDir);
  const entries = exportEntries(packageDir, lane).map(entry => {
    const reach = closure(entry.file, lane, packageDir);
    return {
      subpath: entry.subpath,
      specifier: entry.specifier,
      file: relative(packageDir, entry.file).split("\\").join("/"),
      bare: reach.bare,
      external: [...new Set(reach.bare.map(packageNameOf))].filter(name => !providedPackages.includes(name)).sort(),
      missingRelative: reach.missing,
    };
  });
  const bare = [...new Set(entries.flatMap(entry => entry.bare))].sort();
  return { packageName: manifest.name, version: manifest.version, lane, entries, bare };
}
