// Gate T4 desktop install path: after the lane consumer installed
// @nyc-tron/ui with npm and the scoped react-native override, and the
// harness rendered one export in the native app, check that the component
// mounted and committed.
//   node tooling/install-paths/desktop-render-check.mjs <run-dir> <export subpath> <component> <record.json>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [runDir, subpath, component, recordFile] = process.argv.slice(2);
if (!runDir || !subpath || !component || !recordFile) throw new Error("Usage: desktop-render-check.mjs <run-dir> <export subpath> <component> <record.json>");
// Windows PowerShell 5 writes JSON with a byte order mark.
const json = file => JSON.parse(readFileSync(join(runDir, file), "utf8").replace(/^﻿/, ""));
const record = { schema: 1, subpath, component, result: "failed" };
try {
  const run = json("run.json");
  record.run = { status: run.status, finalStatus: run.finalStatus ?? null, error: run.error ?? null };
  const preparation = json("preparation.json");
  record.installedWith = preparation.ui?.installedWith ?? null;
  record.runtime = preparation.runtime ?? null;
  const results = json("results.json");
  record.platform = results.platform;
  record.reactNativeVersion = results.reactNativeVersion;
  const entry = results.entries.find(e => e.s === subpath);
  record.import = entry?.i ?? "not-run";
  const status = entry?.c.find(([name]) => name === component)?.[1] ?? "not-run";
  record.status = status;
  if (run.status === "completed" && record.import === "ok" && status === "ok" && /^npm install with overrides/.test(record.installedWith ?? "")) record.result = "rendered";
} catch (error) {
  record.error = error instanceof Error ? error.message : String(error);
}
writeFileSync(recordFile, JSON.stringify(record, null, 2) + "\n");
console.info(JSON.stringify(record));
if (record.result !== "rendered") process.exit(1);
