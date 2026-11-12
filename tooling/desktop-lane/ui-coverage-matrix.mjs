// Combines desktop lane coverage runs and the web reference into one
// per-export, per-component matrix (gate T4).
//
//   node tooling/desktop-lane/ui-coverage-matrix.mjs --reference <dir> \
//     --lane windows=<dir> --lane macos=<dir> --props <props.json> --json <out.json> [--markdown <out.md>]
//
// Each directory is a downloaded coverage artifact. Files are found anywhere
// below it: results.json, model.json, preparation.json, resolution.jsonl,
// run.json.
//
// Component status per lane:
//   pass            the export built, loaded, and the component mounted and
//                   committed with synthesized props without an error
//   missing-peer    the export imports an optional peer the lane does not
//                   provide (the throwing stub was evaluated)
//   lane-failure    failed in the lane but mounted in the web reference
//   not-attributed  failed in the lane and in the web reference with the same
//                   props and peer set, so the run says nothing about the lane
//   not-run         the lane run did not reach it
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function findFile(directory, name) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (entry === name && statSync(path).isFile()) return path;
    if (statSync(path).isDirectory()) { const found = findFile(path, name); if (found) return found; }
  }
  return null;
}

export function loadRun(directory) {
  const read = name => { const path = findFile(directory, name); return path ? readFileSync(path, "utf8") : null; };
  const json = name => { const text = read(name); return text ? JSON.parse(text) : null; };
  const resolution = new Map();
  for (const line of (read("resolution.jsonl") ?? "").split("\n").filter(Boolean)) {
    const entry = JSON.parse(line);
    // A specifier that resolved anywhere in the graph resolved for the lane.
    resolution.set(entry.specifier, (resolution.get(entry.specifier) ?? false) || entry.resolved);
  }
  return { results: json("results.json"), model: json("model.json"), preparation: json("preparation.json"), run: json("run.json"), resolution };
}

const ok = value => value === "ok";

export function classify(laneValue, referenceValue) {
  if (laneValue === undefined) return "not-run";
  if (ok(laneValue)) return "pass";
  if (String(laneValue).includes("NYCTRON_UNRESOLVED")) return "missing-peer";
  return ok(referenceValue) ? "lane-failure" : "not-attributed";
}

export function buildMatrix(reference, lanes, declared = {}) {
  const refEntries = new Map((reference.results?.entries ?? []).map(entry => [entry.s, entry]));
  const laneEntries = Object.fromEntries(Object.entries(lanes).map(([name, run]) => [name, new Map((run.results?.entries ?? []).map(entry => [entry.s, entry]))]));
  const models = Object.fromEntries(Object.entries(lanes).map(([name, run]) => [name, new Map((run.model?.entries ?? []).map(entry => [entry.subpath, entry]))]));
  const subpaths = [...new Set([...refEntries.keys(), ...Object.values(models).flatMap(model => [...model.keys()])])].sort();
  const rows = [];
  for (const subpath of subpaths) {
    const ref = refEntries.get(subpath);
    const refComponents = new Map((ref?.c ?? []).map(([name, status]) => [name, status]));
    const row = { subpath, reference: { import: ref?.i ?? null, components: Object.fromEntries(refComponents) }, lanes: {} };
    const names = new Set(refComponents.keys());
    for (const [lane, entries] of Object.entries(laneEntries)) for (const [name] of entries.get(subpath)?.c ?? []) names.add(name);
    // When no run could load the module, its component names come from the
    // published declarations (the synthesized props file).
    const loadedSomewhere = ok(ref?.i) || Object.values(laneEntries).some(entries => ok(entries.get(subpath)?.i));
    if (!loadedSomewhere) for (const name of Object.keys(declared[subpath] ?? {})) names.add(name);
    for (const [lane, entries] of Object.entries(laneEntries)) {
      const entry = entries.get(subpath);
      const model = models[lane].get(subpath);
      const unresolved = (model?.bare ?? []).filter(specifier => lanes[lane].resolution.get(specifier) !== true);
      const build = !model ? "not-run" : unresolved.length ? "unresolved" : "pass";
      const load = entry === undefined ? "not-run" : ok(entry.i) ? "pass" : String(entry.i).includes("NYCTRON_UNRESOLVED") ? "missing-peer" : ok(ref?.i) ? "lane-failure" : "not-attributed";
      const components = {};
      const laneComponents = new Map((entry?.c ?? []).map(([name, status]) => [name, status]));
      for (const name of [...names].sort()) {
        const value = entry && !ok(entry.i) ? entry.i : laneComponents.get(name);
        const status = classify(value, refComponents.get(name));
        components[name] = status === "pass" ? { status } : { status, error: value ?? null };
      }
      row.lanes[lane] = { build, unresolved, load, loadError: entry && !ok(entry.i) ? entry.i : null, components };
    }
    rows.push(row);
  }
  const summary = {};
  for (const lane of Object.keys(lanes)) {
    const s = { exports: rows.length, exportsLoaded: 0, exportsBuilt: 0, components: 0, byStatus: {} };
    for (const row of rows) {
      const cell = row.lanes[lane];
      if (cell.build === "pass") s.exportsBuilt += 1;
      if (cell.load === "pass") s.exportsLoaded += 1;
      for (const { status } of Object.values(cell.components)) { s.components += 1; s.byStatus[status] = (s.byStatus[status] ?? 0) + 1; }
    }
    summary[lane] = s;
  }
  const refSummary = { exportsLoaded: 0, components: 0, mounted: 0 };
  for (const row of rows) {
    if (ok(row.reference.import)) refSummary.exportsLoaded += 1;
    for (const status of Object.values(row.reference.components)) { refSummary.components += 1; if (ok(status)) refSummary.mounted += 1; }
  }
  return { summary, reference: refSummary, rows };
}

/** Exports usable on a lane: loaded, and every component in it passed. */
export function supportedExports(matrix, lane) {
  return matrix.rows.filter(row => {
    const cell = row.lanes[lane];
    return cell.build === "pass" && cell.load === "pass" && Object.values(cell.components).every(c => c.status === "pass");
  }).map(row => row.subpath);
}

function markdown(matrix, provenance) {
  const lanes = Object.keys(matrix.summary);
  const lines = [];
  lines.push("| Lane | Exports built | Exports loaded | Components | Pass | Missing peer | Lane failure | Not attributed | Not run |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const lane of lanes) {
    const s = matrix.summary[lane], b = s.byStatus;
    lines.push(`| ${lane} | ${s.exportsBuilt}/${s.exports} | ${s.exportsLoaded}/${s.exports} | ${s.components} | ${b.pass ?? 0} | ${b["missing-peer"] ?? 0} | ${b["lane-failure"] ?? 0} | ${b["not-attributed"] ?? 0} | ${b["not-run"] ?? 0} |`);
  }
  lines.push("", `Web reference: ${matrix.reference.exportsLoaded}/${matrix.rows.length} exports loaded, ${matrix.reference.mounted}/${matrix.reference.components} components mounted.`, "");
  lines.push("## Per export", "", `| Export | ${lanes.map(l => `${l}`).join(" | ")} | Web reference |`, `|---|${lanes.map(() => "---|").join("")}---|`);
  const cell = (row, lane) => {
    const c = row.lanes[lane];
    if (c.load !== "pass") return `load ${c.load}${c.unresolved.length ? ` (${c.unresolved.join(", ")})` : ""}`;
    const comps = Object.entries(c.components);
    if (!comps.length) return "loaded (no components)";
    return comps.map(([name, { status }]) => `${name}: ${status}`).join("<br>");
  };
  for (const row of matrix.rows) {
    const ref = row.reference;
    const refCell = !ok(ref.import) ? "load failed" : Object.keys(ref.components).length ? Object.entries(ref.components).map(([n, s]) => `${n}: ${ok(s) ? "mounted" : "failed"}`).join("<br>") : "loaded (no components)";
    lines.push(`| \`${row.subpath}\` | ${lanes.map(lane => cell(row, lane)).join(" | ")} | ${refCell} |`);
  }
  lines.push("", "## Lane failures with errors", "");
  for (const lane of lanes) for (const row of matrix.rows) for (const [name, c] of Object.entries(row.lanes[lane].components)) {
    if (c.status === "lane-failure") lines.push(`- ${lane} \`${row.subpath}\` ${name}: ${String(c.error).replaceAll("|", "\\|")}`);
  }
  lines.push("", "## Provenance", "", "```json", JSON.stringify(provenance, null, 2), "```", "");
  return lines.join("\n");
}

if (import.meta.url === new URL(process.argv[1], "file://").href || process.argv[1]?.endsWith("ui-coverage-matrix.mjs")) {
  const args = process.argv.slice(2);
  const value = flag => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const lanes = {};
  args.forEach((arg, i) => { if (arg === "--lane") { const [name, dir] = args[i + 1].split("="); lanes[name] = loadRun(resolve(dir)); } });
  const referenceDir = value("--reference"), out = value("--json");
  if (!referenceDir || !out || !Object.keys(lanes).length) throw new Error("Usage: ui-coverage-matrix.mjs --reference <dir> --lane <name>=<dir> ... --json <out.json> [--props <props.json>] [--markdown <out.md>]");
  const reference = loadRun(resolve(referenceDir));
  const declared = value("--props") ? JSON.parse(readFileSync(resolve(value("--props")), "utf8")).props : {};
  const matrix = buildMatrix(reference, lanes, declared);
  const provenance = { reference: { preparation: reference.preparation, run: reference.run }, ...Object.fromEntries(Object.entries(lanes).map(([n, r]) => [n, { preparation: r.preparation, run: r.run }])) };
  const supported = Object.fromEntries(Object.keys(lanes).map(lane => [lane, supportedExports(matrix, lane)]));
  writeFileSync(resolve(out), JSON.stringify({ schema: 1, provenance, summary: matrix.summary, reference: matrix.reference, supported, rows: matrix.rows }, null, 2) + "\n");
  if (value("--markdown")) writeFileSync(resolve(value("--markdown")), markdown(matrix, provenance));
  console.info(JSON.stringify(matrix.summary, null, 2));
}
