// Runtime for the desktop lane coverage harness (gate T4). Copied unchanged
// into a lane consumer next to a generated entry list. Plain JavaScript with
// createElement so it needs no JSX transform or TypeScript in the lane.
//
// For each public @nyc-tron/ui export it: loads the module once (one export
// per commit, behind a `loading:` status), finds the exported React
// components, mounts each one with its synthesized required props
// (synthesize-props.mjs) inside an error
// boundary, waits for the commit and its effects plus 60 ms, records the outcome and
// unmounts it. Results are published as accessible views (testID plus
// accessibilityLabel) that UI Automation and the AppKit driver can read, and
// on globalThis for the web reference.
import { Component, Suspense, createElement as h, useEffect, useReducer } from "react";
import { Platform, Text, View } from "react-native";
import { loadEntry } from "./load-entry.js";

const CHUNK = 4000;
const SETTLE_MS = 60;
const forwardRef = Symbol.for("react.forward_ref");
const memo = Symbol.for("react.memo");
const lazy = Symbol.for("react.lazy");

export function isComponentExport(name, value) {
  if (!/^[A-Z]/.test(name)) return false;
  // Exported Error subclasses (RangeTooLargeError and similar) are not components.
  if (typeof value === "function") return !(value.prototype instanceof Error);
  return !!value && typeof value === "object" && [forwardRef, memo, lazy].includes(value.$$typeof);
}

/** Synthesized props arrive as JSON; functions and dates are tagged. */
export function hydrate(value) {
  if (Array.isArray(value)) return value.map(hydrate);
  if (!value || typeof value !== "object") return value;
  if (value.$fn === 1) return () => {};
  if (typeof value.$date === "number") return new Date(value.$date);
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, hydrate(child)]));
}

function describe(error) {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 400);
  try { return String(error).slice(0, 400); } catch { return "unprintable error"; }
}

class Boundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { this.props.onError(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Fallback({ onSuspend }) {
  useEffect(() => { onSuspend(); }, []);
  return null;
}

/** Shared mutable run state; the component only re-renders to advance it. */
function createRun(entries, lane) {
  const run = { lane, entries, status: "loading", loadIndex: 0, index: 0, jobs: [], results: [], error: null, suspended: false };
  if (!entries.length) run.status = "done";
  return run;
}

/**
 * Loads the next export and queues its components. One export per commit, so
 * the published status names the export being evaluated: a module that never
 * finishes evaluating stalls on its own `loading:` label instead of before
 * the first frame.
 */
function loadNext(run) {
  const entry = run.entries[run.loadIndex];
  const record = { s: entry.subpath, i: "ok", c: [] };
  run.results.push(record);
  let module;
  try { module = loadEntry(entry.load); }
  catch (error) { record.i = describe(error); module = undefined; }
  for (const [name, value] of Object.entries(module ?? {})) {
    if (!isComponentExport(name, value)) continue;
    const result = [name, "pending"];
    record.c.push(result);
    const synthesized = entry.props?.[name];
    if (synthesized === undefined) result.push("no-props-type");
    run.jobs.push({ subpath: entry.subpath, name, Component: value, props: hydrate(synthesized ?? {}), result });
  }
  run.loadIndex += 1;
  if (run.loadIndex >= run.entries.length) run.status = run.jobs.length ? "running" : "done";
}

function publish(run) {
  const payload = JSON.stringify({
    schema: 1, lane: run.lane, platform: Platform.OS,
    reactNativeVersion: Platform.constants?.reactNativeVersion ?? null,
    entries: run.results,
  });
  const chunks = [];
  for (let offset = 0; offset < payload.length; offset += CHUNK) chunks.push(payload.slice(offset, offset + CHUNK));
  globalThis.__TRON_UI_COVERAGE__ = { status: "done", payload };
  return chunks;
}

let installed = false;
function captureGlobalErrors(run) {
  if (installed) return;
  installed = true;
  const utils = globalThis.ErrorUtils;
  if (!utils?.setGlobalHandler) return;
  const previous = utils.getGlobalHandler?.();
  utils.setGlobalHandler((error, isFatal) => {
    const job = run.jobs[run.index];
    if (run.status === "running" && job && !run.error) { run.error = error; return; }
    previous?.(error, isFatal);
  });
}

export function createCoverageApp(entries, lane) {
  let run;
  return function TronUiCoverage() {
    const [, advance] = useReducer(x => x + 1, 0);
    run ??= createRun(entries, lane);
    captureGlobalErrors(run);
    const loading = run.status === "loading" ? run.entries[run.loadIndex] : undefined;
    useEffect(() => {
      if (!loading) return undefined;
      // Load after this frame is committed and mounted, so the label above is
      // readable while the export evaluates.
      const timer = setTimeout(() => { loadNext(run); advance(); }, 0);
      return () => clearTimeout(timer);
    }, [loading]);
    const job = run.status === "running" ? run.jobs[run.index] : undefined;
    useEffect(() => {
      if (!job) return undefined;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        job.result[1] = run.error ? describe(run.error) : run.suspended ? "suspended" : "ok";
        run.error = null; run.suspended = false;
        run.index += 1;
        if (run.index >= run.jobs.length) run.status = "done";
        advance();
      };
      // Child effects run before this parent effect, so the probe has
      // committed. Wait briefly for errors thrown from timers it scheduled.
      const timer = setTimeout(finish, SETTLE_MS);
      return () => { settled = true; clearTimeout(timer); };
    }, [job]);

    const label = loading
      ? `loading:${run.loadIndex + 1}/${run.entries.length}:${loading.subpath}`
      : run.status === "running" && job
        ? `running:${run.index + 1}/${run.jobs.length}:${job.subpath}#${job.name}`
        : `done:${run.jobs.length}`;
    if (run.status === "done") {
      const chunks = publish(run);
      return h(View, { style: { flex: 1, padding: 8 } },
        h(View, { testID: "tron-ui-coverage-status", accessible: true, collapsable: false, accessibilityLabel: `${label}:${chunks.length}` },
          h(Text, null, `NYC-Tron UI coverage ${label}, ${chunks.length} result chunks`)),
        ...chunks.map((chunk, i) => h(View, {
          key: i, testID: `tron-ui-coverage-chunk-${i}`, accessible: true, collapsable: false,
          accessibilityLabel: chunk, style: { width: 4, height: 4 },
        })));
    }
    globalThis.__TRON_UI_COVERAGE__ = { status: label };
    return h(View, { style: { flex: 1, padding: 8 } },
      h(View, { testID: "tron-ui-coverage-status", accessible: true, collapsable: false, accessibilityLabel: label },
        h(Text, null, label)),
      job ? h(View, { key: run.index, style: { width: 640, height: 420, overflow: "hidden" } },
        h(Boundary, { onError: error => { if (!run.error) run.error = error; } },
          h(Suspense, { fallback: h(Fallback, { onSuspend: () => { run.suspended = true; } }) },
            h(job.Component, job.props)))) : null);
  };
}
