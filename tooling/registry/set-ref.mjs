#!/usr/bin/env node
// Change the git ref that every registry and docs URL points at, then regenerate everything that embeds it.
//
//   node tooling/registry/set-ref.mjs <ref> [--no-build]
//
// <ref> is a branch or a tag (`main`, `v1.0.0`). It is stored once, as `ref` in tooling/registry/config.json.
// The script also rewrites the ref inside the two hand-written SKILL.md copies, then runs
// build-registry.mjs (registry.json, r/, components.json, registry-excluded.json) and the three docs
// builders (llms.txt, llms-full.txt, docs/site). --no-build only rewrites the config and the SKILL.md copies.
// build-registry.mjs runs `npx shadcn@<version> build`, so it needs network.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const [ref, ...flags] = process.argv.slice(2);
if (!ref || ref.startsWith("-") || !/^[A-Za-z0-9._\/-]+$/.test(ref)) {
  console.error("usage: node tooling/registry/set-ref.mjs <ref> [--no-build]\n  <ref> is a branch or tag name such as main or v1.0.0");
  process.exit(2);
}

const cfgPath = join(root, "tooling/registry/config.json");
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
const old = cfg.ref;
if (typeof old !== "string" || !old) { console.error("config.json has no `ref`"); process.exit(1); }

// config.json: replace only the value so the file keeps its layout.
const cfgText = readFileSync(cfgPath, "utf8");
writeFileSync(cfgPath, cfgText.replace(/("ref"\s*:\s*)"[^"]*"/, `$1${JSON.stringify(ref)}`));

// Hand-written SKILL.md copies: the ref sits right after the repo name in raw.githubusercontent URLs.
const urlPrefix = `https://raw.githubusercontent.com/${cfg.repo}/`;
for (const f of ["SKILL.md", "skills/nyc-tron-ui/SKILL.md"]) {
  const p = join(root, f);
  const text = readFileSync(p, "utf8");
  const next = text.split(urlPrefix + old + "/").join(urlPrefix + ref + "/");
  if (next !== text) writeFileSync(p, next);
}
console.log(`ref: ${old} -> ${ref}`);

if (flags.includes("--no-build")) process.exit(0);
for (const script of ["tooling/registry/build-registry.mjs", "tooling/docs/build-docs.mjs", "tooling/docs/build-llms.mjs", "tooling/docs/build-site.mjs"]) {
  console.log(`\n$ node ${script}`);
  const r = spawnSync(process.execPath, [join(root, script)], { cwd: root, stdio: "inherit" });
  if (r.status !== 0) { console.error(`${script} failed (exit ${r.status})`); process.exit(r.status ?? 1); }
}
