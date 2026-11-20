// Control run for check-docs.mjs: proves the import and install checks fail on planted bad pages and pass on the real ones.
//   node tooling/docs/check-docs-control.mjs [--tsc <tsc.js> --node-modules <dir>]
// It copies docs/components into .docs-control/components inside the repo, runs check-docs against the copy
// (NYC_DOCS_PAGES), plants one defect per case, and requires the case's message plus a non-zero exit. Exit 1 on any miss.
// The copy is removed at the end. docs/components is never written.
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {ROOT} from "./lib.mjs";

const passthrough = process.argv.slice(2);
const REL = ".docs-control/components";
const DIR = path.join(ROOT, REL);
const run = () => {
  const r = spawnSync("node", [path.join(ROOT, "tooling/docs/check-docs.mjs"), "--json", ...passthrough], {cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, env: {...process.env, NYC_DOCS_PAGES: REL}});
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* not json */ }
  return {status: r.status, failures: j?.failures ?? [], raw: r.stdout + r.stderr};
};
const reset = () => {
  fs.rmSync(path.join(ROOT, ".docs-control"), {recursive: true, force: true});
  fs.cpSync(path.join(ROOT, "docs/components"), DIR, {recursive: true});
};
const edit = (id, fn) => {
  const f = path.join(DIR, id + ".md");
  fs.writeFileSync(f, fn(fs.readFileSync(f, "utf8")));
};

const cases = [
  ["no Tarball install label", (t) => edit("Card", (x) => x.replace("### Tarball install", "### Other install")), /X5.*|Tarball install/, "X5", /no `### Tarball install`/],
  ["no Registry install label", (t) => edit("Card", (x) => x.replace("### Registry install", "### Other install")), null, "X5", /no `### Registry install`/],
  ["registry Import line shows the tarball form", (t) => edit("Button", (x) => x.replace('from "@/components/nyc-tron/ui/components/Button";`', 'from "@nyc-tron/ui/components/Button";`')), null, "X5", /Registry install Import uses/],
  ["example imports the tarball form", (t) => edit("Button", (x) => x.replace(/(example=Button\n[\s\S]*?from )"@\/components\/nyc-tron\/ui\/components\/Button"/, '$1"@nyc-tron/ui/components/Button"')), null, 9, /tarball form/],
  ["example imports a registry specifier that does not exist", (t) => edit("Button", (x) => x.replace(/(example=Button\n[\s\S]*?from )"@\/components\/nyc-tron\/ui\/components\/Button"/, '$1"@/components/nyc-tron/ui/components/Nope"')), null, 9, /neither the registry form nor the tarball form/],
  ["example imports a made-up package specifier", (t) => edit("Button", (x) => x.replace(/(example=Button\n[\s\S]*?from )"@\/components\/nyc-tron\/ui\/components\/Button"/, '$1"@nyc-tron/ui/components/Nope"')), null, 9, /neither the registry form nor the tarball form/],
];
if (passthrough.includes("--tsc")) {
  cases.push(["example has a type error (tsc)", (t) => edit("Button", (x) => x.replace(/(example=Button\n[\s\S]*?<Button\n\s+)title="Save changes"/, "$1title={5}")), null, 9, /error TS/]);
}

let bad = 0;
reset();
const base = run();
const baseOk = base.status === 0 && base.failures.length === 0;
console.log(`${baseOk ? "ok  " : "FAIL"} unmodified copy passes (exit ${base.status}, ${base.failures.length} failures)`);
if (!baseOk) { bad++; console.log(base.raw.slice(0, 1500)); }
for (const [name, plant, , check, msg] of cases) {
  reset();
  plant();
  const r = run();
  const hit = r.status === 1 && r.failures.some((f) => String(f.check) === String(check) && msg.test(f.msg));
  console.log(`${hit ? "ok  " : "FAIL"} ${name}: exit ${r.status}, ${r.failures.length} failure(s)${hit ? "" : "; expected check " + check + " " + msg}`);
  if (!hit) { bad++; console.log(r.failures.slice(0, 3).map((f) => `     [${f.check}] ${f.id}: ${f.msg}`).join("\n") || r.raw.slice(0, 800)); }
}
fs.rmSync(path.join(ROOT, ".docs-control"), {recursive: true, force: true});
console.log(bad ? `control run: ${bad} case(s) did not behave` : `control run: all ${cases.length + 1} cases behaved`);
process.exit(bad ? 1 : 0);
