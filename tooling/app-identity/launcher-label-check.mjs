#!/usr/bin/env node
// Launcher label check. Reads an app's config, finds the label each launcher
// will show, measures its rendered width in that launcher's font and fails when
// it is wider than the measured label box. It reports the overflow in the
// launcher's unit and never shortens a name for you.
//
//   node launcher-label-check.mjs <config.json> [more configs] [--strict] [--json]
//   node launcher-label-check.mjs --name "My App" --platforms ios,android
//
// Accepted configs: Expo app.json ({ "expo": {...} }) or resolved config
// (`npx expo config --json`), Spark desktop.config.json, and React Native
// Windows app.json ({ "name", "displayName" }). Declare both names in
// `expo.extra.appIdentity = { fullName, launcherName }`; RNW: a top-level
// `appIdentity`; Spark: in the Expo app.json beside desktop.config.json.
//
// Exit codes: 0 every measured target fits; 1 overflow or identity error;
// 2 usage error; 3 (--strict only) a target that applies was NOT RUN.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const catalogue = JSON.parse(readFileSync(join(here, "launcher-targets.json"), "utf8")).targets;

// ---------------------------------------------------------------- measuring

const tableCache = new Map();
function tableWidth(target, text) {
  const file = join(here, target.font.table);
  if (!tableCache.has(file)) tableCache.set(file, JSON.parse(readFileSync(file, "utf8")));
  const table = tableCache.get(file);
  let units = 0;
  const missing = [];
  for (const char of text) {
    const advance = table.advances[char.codePointAt(0).toString(16)];
    if (advance === undefined) missing.push(char);
    units += advance ?? table.fallbackAdvance;
  }
  return { width: (units / table.unitsPerEm) * target.font.size, missing };
}

// AppKit's system font is the font Apple platforms draw launcher labels with,
// including optical sizing, so this is exact for Apple targets. It needs macOS
// (osascript ships with it; no Xcode). Results are batched per size/weight.
const appkitScript = `
ObjC.import('AppKit');
function run(argv) {
  const size = Number(argv[0]);
  const font = argv[1] === 'bold' ? $.NSFont.boldSystemFontOfSize(size) : $.NSFont.systemFontOfSize(size);
  const attrs = $.NSDictionary.dictionaryWithObjectForKey(font, $.NSFontAttributeName);
  return JSON.stringify(argv.slice(2).map((s) => $(s).sizeWithAttributes(attrs).width));
}`;
function appkitWidths(font, texts) {
  if (process.platform !== "darwin") return { error: "the Apple system font is measured with AppKit, which needs macOS" };
  try {
    const out = execFileSync("osascript", ["-l", "JavaScript", "-e", appkitScript, String(font.size), font.weight, ...texts], {
      encoding: "utf8",
    });
    return { widths: JSON.parse(out) };
  } catch (error) {
    return { error: `AppKit measurement failed: ${error.message.split("\n")[0]}` };
  }
}

// ------------------------------------------------------------ reading config

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path}: ${error.message}`);
  }
}

/** Normalise one config file into { source, kind, labels: {platform: label}, identity, platforms }. */
export function describeConfig(path) {
  const raw = readJson(path);
  const source = path;
  if (raw.projectId !== undefined && (raw.macos || raw.window || raw.platforms)) {
    // Spark desktop.config.json: Spark writes `name` to CFBundleName (the Dock
    // and menu bar label) unless macos.infoPlist.CFBundleName overrides it. The
    // file's schema allows no extra keys, so identity is read from the Expo
    // app.json beside it.
    const platforms = (raw.platforms ?? ["macos"]).filter((p) => p === "macos" || p === "windows");
    const labelFor = (p) => (p === "macos" ? raw.macos?.infoPlist?.CFBundleName ?? raw.name : raw.name);
    const sibling = join(dirname(path), "app.json");
    const identity = existsSync(sibling) ? readJson(sibling).expo?.extra?.appIdentity : undefined;
    return {
      source,
      kind: "spark",
      platforms,
      identity,
      labels: Object.fromEntries(platforms.map((p) => [p, labelFor(p)])),
    };
  }
  if (raw.expo || raw.slug || (raw.name && (raw.ios || raw.android || raw.platforms))) {
    const expo = raw.expo ?? raw;
    const platforms = expo.platforms ?? ["ios", "android"];
    const labels = {};
    if (platforms.includes("ios")) labels.ios = expo.ios?.infoPlist?.CFBundleDisplayName ?? expo.name;
    if (platforms.includes("android")) labels.android = expo.name;
    if (platforms.includes("web")) labels.web = expo.web?.shortName ?? expo.web?.name ?? expo.name;
    for (const extra of expo.extra?.appIdentity?.platforms ?? []) labels[extra] ??= expo.name;
    return { source, kind: "expo", platforms: Object.keys(labels), identity: expo.extra?.appIdentity, labels };
  }
  if (typeof raw.name === "string" && typeof raw.displayName === "string") {
    // React Native Windows app.json: displayName is the Start and taskbar label.
    return { source, kind: "rnw", platforms: ["windows"], identity: raw.appIdentity, labels: { windows: raw.displayName } };
  }
  throw new Error(`${path}: not an Expo, Spark or React Native Windows app config`);
}

function identityProblems(config) {
  const problems = [];
  const id = config.identity;
  if (!id) {
    problems.push("no appIdentity { fullName, launcherName } declared");
    return problems;
  }
  if (!id.fullName?.trim()) problems.push("appIdentity.fullName is empty");
  if (!id.launcherName?.trim()) problems.push("appIdentity.launcherName is empty");
  for (const [platform, label] of Object.entries(config.labels)) {
    if (label !== id.launcherName) {
      problems.push(`${platform} launcher label is "${label}" but appIdentity.launcherName is "${id.launcherName}"`);
    }
  }
  return problems;
}

// ------------------------------------------------------------------ checking

export function checkLabels(entries) {
  // entries: [{ source, platform, label }]
  const rows = [];
  const appkitJobs = new Map();
  for (const entry of entries) {
    const targets = catalogue.filter((t) => t.platforms.includes(entry.platform));
    if (!targets.length) {
      rows.push({ ...entry, target: `${entry.platform}`, status: "NOT RUN", reason: `no launcher target is defined for ${entry.platform}` });
      continue;
    }
    for (const target of targets) {
      const row = { ...entry, target: target.id, surface: target.surface };
      rows.push(row);
      if (target.status !== "measured") {
        Object.assign(row, { status: "NOT RUN", reason: target.reason });
        continue;
      }
      Object.assign(row, { box: target.boxWidth, unit: target.font.unit, lines: target.lines, font: `${target.font.family} ${target.font.weight} ${target.font.size} ${target.font.unit}` });
      if (target.font.backend === "font-table") {
        const { width, missing } = tableWidth(target, entry.label);
        if (missing.length) {
          // An estimate is not a measurement: never pass a label we could not measure.
          Object.assign(row, { status: "NOT RUN", reason: `${target.font.family} table has no metrics for ${JSON.stringify(missing.join(""))}` });
        } else row.width = width;
      } else if (target.font.backend === "appkit-system") {
        const key = `${target.font.size}/${target.font.weight}`;
        if (!appkitJobs.has(key)) appkitJobs.set(key, { font: target.font, rows: [] });
        appkitJobs.get(key).rows.push(row);
      }
    }
  }
  for (const { font, rows: jobRows } of appkitJobs.values()) {
    const result = appkitWidths(font, jobRows.map((r) => r.label));
    jobRows.forEach((row, i) => {
      if (result.error) Object.assign(row, { status: "NOT RUN", reason: result.error });
      else row.width = result.widths[i];
    });
  }
  for (const row of rows) {
    if (row.status) continue;
    row.width = Math.round(row.width * 10) / 10;
    const over = Math.round((row.width - row.box) * 10) / 10;
    row.status = over > 0 ? "OVERFLOW" : "PASS";
    if (over > 0) row.overflow = over;
    else row.spare = Math.round(-over * 10) / 10;
  }
  return rows;
}

function format(rows, problems) {
  const lines = [];
  for (const p of problems) lines.push(`IDENTITY  ${p}`);
  for (const r of rows) {
    const head = `${r.status.padEnd(8)}  ${r.target.padEnd(22)}  "${r.label}"`;
    if (r.status === "NOT RUN") lines.push(`${head}  (${r.reason})`);
    else {
      const detail =
        r.status === "OVERFLOW"
          ? `${r.width} ${r.unit} in a ${r.box} ${r.unit} box: over by ${r.overflow} ${r.unit}`
          : `${r.width} of ${r.box} ${r.unit} (${r.spare} ${r.unit} spare)`;
      lines.push(`${head}  ${detail}, ${r.font}, ${r.lines} line${r.note ? `; ${r.note}` : ""}`);
    }
    lines.push(`          ${" ".repeat(22)}  from ${r.source}`);
  }
  return lines.join("\n");
}

export function run(argv) {
  const args = [...argv];
  const take = (name) => {
    const i = args.indexOf(name);
    if (i < 0) return undefined;
    const [, value] = args.splice(i, 2);
    return value;
  };
  const strict = args.includes("--strict");
  const json = args.includes("--json");
  const name = take("--name");
  const platforms = take("--platforms");
  const files = args.filter((a) => !a.startsWith("--"));
  const entries = [];
  const problems = [];
  if (name !== undefined) {
    for (const platform of (platforms ?? "ios,android").split(",")) entries.push({ source: "--name", platform, label: name });
  }
  for (const file of files) {
    const path = resolve(file);
    if (!existsSync(path)) return { code: 2, output: `launcher-label-check: ${file} does not exist` };
    let config;
    try {
      config = describeConfig(path);
    } catch (error) {
      return { code: 2, output: `launcher-label-check: ${error.message}` };
    }
    problems.push(...identityProblems(config).map((p) => `${file}: ${p}`));
    for (const [platform, label] of Object.entries(config.labels)) {
      if (platform === "web") continue;
      if (typeof label !== "string" || !label.trim()) {
        problems.push(`${file}: no ${platform} launcher label in the config`);
        continue;
      } // browsers own the install label; not a launcher box we measured
      entries.push({ source: file, platform, label });
    }
  }
  if (!entries.length && !problems.length) {
    return { code: 2, output: "usage: launcher-label-check.mjs <app config...> [--strict] [--json] | --name <label> [--platforms ios,android]" };
  }
  const rows = checkLabels(entries);
  const overflow = rows.some((r) => r.status === "OVERFLOW");
  const notRun = rows.some((r) => r.status === "NOT RUN");
  const code = overflow || problems.length ? 1 : strict && notRun ? 3 : 0;
  const output = json ? JSON.stringify({ code, problems, rows }, null, 2) : format(rows, problems);
  return { code, output };
}

if (process.argv[1] && basename(process.argv[1]) === basename(fileURLToPath(import.meta.url))) {
  const { code, output } = run(process.argv.slice(2));
  (code === 0 ? console.log : console.error)(output);
  process.exit(code);
}
