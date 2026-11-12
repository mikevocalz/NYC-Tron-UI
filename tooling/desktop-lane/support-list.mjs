// Turns a coverage matrix (ui-coverage-matrix.mjs --json) into the published
// desktop support list (gate T4, V1_DECISIONS D5).
//
//   node tooling/desktop-lane/support-list.mjs <matrix.json> <out.json> --evidence <label>=<value> ...
//
// Per lane and per component:
//   supported    every bare import of its export resolved in the lane and the
//                component mounted (status pass)
//   struck       the lane measurement failed it: lane-failure, or an optional
//                peer the lane does not provide (missing-peer). D5 strikes it
//                from that lane until the lane ships React Native >=0.88 or a
//                lane-specific floor is tested in the lane.
//   unmeasured   it failed in the lane and in the web reference with the same
//                synthesized props (not-attributed), or did not run. The run
//                proves nothing about the lane, so it is not on the list.
// Exports with no components (hooks, models, helpers) are listed separately
// by whether their module loaded in the lane.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export function supportList(matrix) {
  const lanes = Object.keys(matrix.summary);
  const out = {};
  for (const lane of lanes) {
    const list = { supported: [], struck: [], unmeasured: [], modulesLoaded: [], modulesStruck: [], modulesUnmeasured: [] };
    for (const row of matrix.rows) {
      const cell = row.lanes[lane];
      const components = Object.entries(cell.components);
      if (!components.length) {
        if (cell.load === "pass" && cell.build === "pass") list.modulesLoaded.push(row.subpath);
        else if (cell.load === "pass" || ["missing-peer", "lane-failure"].includes(cell.load)) list.modulesStruck.push({ export: row.subpath, reason: cell.load === "pass" ? "missing-peer" : cell.load, error: cell.loadError, unresolved: cell.unresolved });
        else list.modulesUnmeasured.push({ export: row.subpath, reason: cell.load, error: cell.loadError });
        continue;
      }
      for (const [name, { status, error }] of components) {
        const id = `${row.subpath}#${name}`;
        // A bare import the lane cannot resolve fails the real app's bundle
        // even when the harness stub let the component mount.
        if (status === "pass" && cell.build === "pass") list.supported.push(id);
        else if (status === "pass") list.struck.push({ component: id, reason: "missing-peer", error: "mounted only with a stub for " + cell.unresolved.join(", "), unresolved: cell.unresolved });
        else if (status === "lane-failure" || status === "missing-peer") list.struck.push({ component: id, reason: status, error: error ?? null, unresolved: cell.unresolved });
        else list.unmeasured.push({ component: id, reason: status, error: error ?? null });
      }
    }
    out[lane] = list;
  }
  return out;
}

if (process.argv[1]?.endsWith("support-list.mjs")) {
  const [matrixFile, outFile, ...rest] = process.argv.slice(2);
  if (!matrixFile || !outFile) throw new Error("Usage: support-list.mjs <matrix.json> <out.json> [--evidence label=value ...]");
  const matrix = JSON.parse(readFileSync(resolve(matrixFile), "utf8"));
  const evidence = {};
  rest.forEach((arg, i) => { if (arg === "--evidence") { const [k, ...v] = rest[i + 1].split("="); evidence[k] = v.join("="); } });
  const lists = supportList(matrix);
  const runtime = Object.fromEntries(Object.keys(lists).map(lane => [lane, matrix.provenance[lane]?.preparation?.runtime ?? null]));
  const ui = matrix.provenance[Object.keys(lists)[0]]?.preparation?.ui ?? null;
  writeFileSync(resolve(outFile), JSON.stringify({ schema: 1, decision: "docs/V1_DECISIONS.md D5", evidence, ui, runtime, lanes: lists }, null, 2) + "\n");
  for (const [lane, l] of Object.entries(lists)) console.info(`${lane}: supported ${l.supported.length}, struck ${l.struck.length}, unmeasured ${l.unmeasured.length}; modules loaded ${l.modulesLoaded.length}, struck ${l.modulesStruck.length}, unmeasured ${l.modulesUnmeasured.length}`);
}
