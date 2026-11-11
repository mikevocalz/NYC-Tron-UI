import * as fs from "node:fs";
import { createHash } from "node:crypto";
import { isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const IOS_COMMAND_LIMITS = Object.freeze({
  streamBytes: 8 * 1024 * 1024, commandBytes: 1024 * 1024, junitBytes: 256 * 1024,
  directoryEntries: 128, directoryDepth: 5, commandRecords: 256,
  xmlTokens: 4096, xmlDepth: 24, summaryBytes: 32768, envelopeBytes: 8192,
});
const BEGIN = "NYC_TRON_IOS_COMMAND_OUTPUT_BEGIN";
const END = "NYC_TRON_IOS_COMMAND_OUTPUT_END";
const FLOWS = ["settings", "settings-retry", "editor", "pointer"];
const STATUS = ["COMPLETED", "FAILED", "PENDING", "RUNNING", "SKIPPED"];
const TYPES = {
  defineVariablesCommand: "define-variables", applyConfigurationCommand: "configuration",
  launchAppCommand: "launch", tapOnElement: "tap", assertConditionCommand: "assert-condition",
  inputTextCommand: "input-text", eraseTextCommand: "erase-text", pressKeyCommand: "press-key",
  scrollUntilVisible: "scroll-until-visible", swipeCommand: "swipe",
  takeScreenshotCommand: "screenshot", runFlowCommand: "nested-flow",
};
const TEXT_LABELS = {
  Library: "library", Settings: "settings", Editor: "editor",
  "Workspace preferences": "workspace-preferences", "Workspace name": "workspace-name",
  "Native UI workspace": "workspace-fixture-value", "Save settings": "save-settings",
  "Preferences saved for this session.": "settings-saved", "Quiet forms": "editor-heading",
  "Cover headline": "cover-headline", "Retained cover draft": "cover-fixture-value",
  "Save cover": "save-cover", "Cover saved for this session.": "cover-saved",
  "Input drawing surface": "input-surface",
  "Committed strokes: 0. Cancelled strokes: 0. Prediction samples: 0.": "pointer-empty",
  "Committed strokes: 1. Cancelled strokes: 0. Prediction samples: 0.": "pointer-one-commit",
  "Input source: touch. Last event: up.": "pointer-touch-up",
};
const ID_LABELS = {
  "reference-workspace-name": "workspace-input", "reference-workspace-title": "workspace-title",
  "reference-headline": "headline-input", "reference-cover-headline": "cover-headline",
  "reference-cover-status": "cover-status", delete: "keyboard-delete",
};
const own = (value, key) => value && typeof value === "object" && !Array.isArray(value)
  ? Object.getOwnPropertyDescriptor(value, key)?.value : undefined;
const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
const integer = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
const choice = (value, values) => values.includes(value) ? value : null;
const mapped = (value, map) => typeof value === "string" && Object.hasOwn(map, value) ? map[value] : null;
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const bytesOf = value => Buffer.from(JSON.stringify(value) + "\n", "utf8");
function errorCategory(error) {
  switch (own(error, "code")) {
    case "ENOENT": return "missing";
    case "EACCES": case "EPERM": return "denied";
    case "ELOOP": return "symlink";
    case "ENOTDIR": return "not-directory";
    case "EEXIST": return "already-exists";
    default: return "io-error";
  }
}
const statNumber = value => typeof value === "bigint"
  ? value >= 0n && value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : null : integer(value);
function sameStat(a, b) {
  return a && b && a.isFile() && b.isFile() &&
    ["dev", "ino", "size", "mtimeNs", "ctimeNs"].every(key => a[key] !== undefined && a[key] === b[key]);
}
function emptyInput(status, limit, error = null) {
  return { status, readLimitBytes: limit, bytesAtOpen: null, bytesRead: 0,
    complete: false, matchingFileObservations: null, sha256: null, hashedBytes: null, hashScope: "none",
    errorCategory: error };
}

/** Hash the bytes actually read; a complete-file hash requires EOF, matching file
 * observations and successful close. Matching samples are not an atomic snapshot. */
export function readIOSCommandFile(path, limit, io = fs) {
  let fd, observation = emptyInput("unavailable", limit), content = null;
  try {
    if (!Number.isSafeInteger(limit) || limit < 1 || io.constants.O_NOFOLLOW === undefined)
      return { observation: emptyInput("unsupported-read-contract", limit), content };
    fd = io.openSync(path, io.constants.O_RDONLY | io.constants.O_NOFOLLOW);
    const before = io.fstatSync(fd, { bigint: true });
    if (!before.isFile()) {
      observation = emptyInput("not-regular", limit);
    } else {
    observation.bytesAtOpen = statNumber(before.size);
    const parts = []; let count = 0, eof = false;
    while (count <= limit) {
      const buffer = Buffer.alloc(Math.min(65536, limit + 1 - count));
      const size = io.readSync(fd, buffer, 0, buffer.length, null);
      if (!Number.isSafeInteger(size) || size < 0 || size > buffer.length) throw new Error("read contract");
      if (size === 0) { eof = true; break; }
      parts.push(buffer.subarray(0, size)); count += size; observation.bytesRead = count;
    }
    const after = io.fstatSync(fd, { bigint: true });
    const closing = fd; fd = undefined;
    try { io.closeSync(closing); } catch { return { observation: { ...observation, status: "close-failed", complete: false, errorCategory: "io-error" }, content: null }; }
    const current = io.lstatSync(path, { bigint: true });
    const matching = sameStat(before, after) && sameStat(after, current);
    const all = Buffer.concat(parts), over = count > limit;
    const complete = matching && eof && !over && observation.bytesAtOpen === count;
    const observed = over ? all.subarray(0, limit) : all;
    observation = { ...observation, status: !matching ? "changed" : over ? "over-limit" : complete ? "complete" : "incomplete",
      bytesRead: count, complete, matchingFileObservations: matching,
      sha256: digest(observed), hashedBytes: observed.length, hashScope: complete ? "complete-file" : matching && over ? "bounded-prefix" : "observed-read-sequence" };
    if (complete) content = all;
    }
  } catch (error) {
    observation = { ...observation, status: errorCategory(error), complete: false,
      matchingFileObservations: null, sha256: null, hashedBytes: null, hashScope: "none", errorCategory: errorCategory(error) };
  } finally {
    if (fd !== undefined) {
      const closing = fd; fd = undefined;
      try { io.closeSync(closing); }
      catch { observation = { ...observation, status: "close-failed", complete: false, sha256: null, hashedBytes: null, hashScope: "none", errorCategory: "io-error" }; content = null; }
    }
  }
  return { observation, content };
}
function checkedDirectory(path, io) {
  const stat = io.lstatSync(path);
  if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
  return true;
}
function nestedInput(consumer, parts, limit, io) {
  try {
    let path = consumer;
    for (const part of parts.slice(0, -1)) {
      path = join(path, part);
      if (!checkedDirectory(path, io)) return { observation: emptyInput("unsafe-parent", limit), content: null };
    }
    return readIOSCommandFile(join(consumer, ...parts), limit, io);
  } catch (error) { return { observation: emptyInput(errorCategory(error), limit, errorCategory(error)), content: null }; }
}
function commandFile(directory, io) {
  const result = { status: "unavailable", visitedEntries: 0, matchingNames: 0, incomplete: false };
  let selected = null;
  try {
    if (!checkedDirectory(directory, io)) return { ...result, status: "unsafe-parent", selected };
    const pending = [{ path: directory, depth: 0 }];
    while (pending.length) {
      const current = pending.pop();
      if (!checkedDirectory(current.path, io)) { result.incomplete = true; continue; }
      let dir;
      try {
        dir = io.opendirSync(current.path, { bufferSize: 16 });
        let entry;
        while ((entry = dir.readSync())) {
          result.visitedEntries++;
          if (result.visitedEntries > IOS_COMMAND_LIMITS.directoryEntries) { result.incomplete = true; break; }
          if (typeof entry.name !== "string" || !entry.name || entry.name === "." || entry.name === ".." || /[\/\\\0]/.test(entry.name)) {
            result.incomplete = true; continue;
          }
          if (entry.isSymbolicLink()) { result.incomplete = true; continue; }
          const path = join(current.path, entry.name);
          if (entry.isDirectory()) {
            if (current.depth >= IOS_COMMAND_LIMITS.directoryDepth) result.incomplete = true;
            else pending.push({ path, depth: current.depth + 1 });
          } else if (entry.isFile() && entry.name === "commands.json") {
            result.matchingNames++; selected = path;
          }
        }
      } finally {
        if (dir) { try { dir.closeSync(); } catch { result.incomplete = true; } }
      }
      if (result.visitedEntries > IOS_COMMAND_LIMITS.directoryEntries) break;
    }
    result.status = result.incomplete ? "incomplete-search" : result.matchingNames > 1 ? "ambiguous" : result.matchingNames === 1 ? "unique" : "missing";
    return { ...result, selected: result.status === "unique" ? selected : null };
  } catch (error) { return { ...result, status: errorCategory(error), selected: null }; }
}
function selector(value) {
  if (!record(value)) return { text: null, id: null, optional: null };
  return { text: mapped(own(value, "textRegex"), TEXT_LABELS), id: mapped(own(value, "idRegex"), ID_LABELS),
    optional: typeof own(value, "optional") === "boolean" ? own(value, "optional") : null };
}
function commandProjection(entry) {
  const metadata = own(entry, "metadata"), command = own(entry, "command");
  const keys = record(command) ? Object.keys(command) : [];
  const key = keys.length === 1 ? keys[0] : null;
  let target = selector(null), condition = null;
  if (key === "tapOnElement") target = selector(own(own(command, key), "selector"));
  if (key === "assertConditionCommand") {
    const value = own(own(command, key), "condition"), names = record(value) ? Object.keys(value) : [];
    if (names.length === 1 && ["visible", "notVisible"].includes(names[0])) {
      condition = names[0] === "visible" ? "visible" : "not-visible";
      target = selector(own(value, names[0]));
    }
  }
  return { sequence: integer(own(metadata, "sequenceNumber")), status: choice(own(metadata, "status"), STATUS),
    command: mapped(key, TYPES), condition, target };
}
export function projectIOSCommands(value) {
  if (!Array.isArray(value)) return { status: "invalid-root", records: null, inspected: 0, omitted: null, statusCounts: null, firstFailed: null };
  const inspected = Math.min(value.length, IOS_COMMAND_LIMITS.commandRecords);
  const counts = { completed: 0, failed: 0, pending: 0, running: 0, skipped: 0, unknown: 0 };
  let firstFailed = null;
  for (let index = 0; index < inspected; index++) {
    const item = commandProjection(value[index]);
    if (item.status) counts[item.status.toLowerCase()]++; else counts.unknown++;
    if (item.status === "FAILED" && !firstFailed) firstFailed = item;
  }
  return { status: inspected === value.length ? "observed" : "prefix-only", records: value.length,
    inspected, omitted: value.length - inspected, statusCounts: counts, firstFailed,
    selectionScope: "top-level-array-order" };
}
function attributes(text) {
  const out = Object.create(null); let rest = text;
  while (rest.trim()) {
    const match = /^\s+([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(rest);
    if (!match || Object.hasOwn(out, match[1])) return null;
    out[match[1]] = match[2] ?? match[3]; rest = rest.slice(match[0].length);
  }
  return out;
}
/** Only structural JUnit facts are projected. Text, names, messages, classes,
 * paths and system-out/system-err content are neither expanded nor returned. */
export function projectIOSJUnit(text) {
  const unknown = { status: "invalid-or-unsupported", testCases: null, failureElements: null, errorElements: null, skippedElements: null, successfulStatusCases: null, unknownStatusCases: null };
  if (typeof text !== "string" || /<!DOCTYPE|<!ENTITY/i.test(text)) return unknown;
  const tokens = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<\/?[A-Za-z_](?:"[^"]*"|'[^']*'|[^'"<>])*>/g;
  const stack = []; let offset = 0, count = 0, roots = 0;
  const result = { status: "observed-structure", testCases: 0, failureElements: 0, errorElements: 0, skippedElements: 0, successfulStatusCases: 0, unknownStatusCases: 0 };
  let match;
  while ((match = tokens.exec(text))) {
    const between = text.slice(offset, match.index); offset = tokens.lastIndex;
    if (between.includes("<") || !stack.length && between.trim()) return unknown;
    if (++count > IOS_COMMAND_LIMITS.xmlTokens) return { ...unknown, status: "token-limit" };
    const token = match[0];
    if (token.startsWith("<!--") || token.startsWith("<?")) continue;
    if (token.startsWith("<![CDATA[")) { if (!stack.length) return unknown; continue; }
    const parsed = /^<(\/?)([A-Za-z_][\w:.-]*)([\s\S]*?)(\/?)>$/.exec(token);
    if (!parsed) return unknown;
    const [, closing, name, rest, selfClosing] = parsed;
    if (closing) {
      if (selfClosing || rest.trim() || stack.pop() !== name) return unknown;
      continue;
    }
    const attrs = attributes(rest);
    if (!attrs || !["testsuites", "testsuite", "testcase", "failure", "error", "skipped", "properties", "property", "system-out", "system-err"].includes(name)) return unknown;
    if (!stack.length) { if (++roots !== 1 || !["testsuites", "testsuite"].includes(name)) return unknown; }
    if (name === "testcase") {
      if (stack.at(-1) !== "testsuite") return unknown;
      result.testCases++;
      if (attrs.status === "SUCCESS") result.successfulStatusCases++; else result.unknownStatusCases++;
    }
    if (["failure", "error", "skipped"].includes(name)) {
      if (stack.at(-1) !== "testcase") return unknown;
      result[name + "Elements"]++;
    }
    if (!selfClosing) stack.push(name);
    if (stack.length > IOS_COMMAND_LIMITS.xmlDepth) return { ...unknown, status: "depth-limit" };
  }
  if (stack.length || roots !== 1 || text.slice(offset).trim()) return unknown;
  return result;
}
function flowObservation(consumer, flow, io) {
  const base = ["runtime-ui-ios", flow];
  const junit = nestedInput(consumer, [...base, "report.xml"], IOS_COMMAND_LIMITS.junitBytes, io);
  let discovery, commands;
  try {
    if (!checkedDirectory(join(consumer, "runtime-ui-ios"), io)) throw new Error("unsafe parent");
    discovery = commandFile(join(consumer, ...base), io);
    commands = discovery.selected
      ? readIOSCommandFile(discovery.selected, IOS_COMMAND_LIMITS.commandBytes, io)
      : { observation: emptyInput(discovery.status, IOS_COMMAND_LIMITS.commandBytes), content: null };
  } catch { discovery = { status: "unavailable", visitedEntries: 0, matchingNames: 0, incomplete: true }; commands = { observation: emptyInput("unavailable", IOS_COMMAND_LIMITS.commandBytes), content: null }; }
  let projected = null;
  if (commands.content) {
    try { projected = projectIOSCommands(JSON.parse(commands.content.toString("utf8"))); }
    catch { projected = { status: "invalid-json", records: null, inspected: 0, omitted: null, statusCounts: null, firstFailed: null }; }
  }
  const { selected, ...publicDiscovery } = discovery;
  return { flow, attempt: flow === "settings-retry" ? 1 : 0,
    junit: { input: junit.observation, structure: junit.content ? projectIOSJUnit(junit.content.toString("utf8")) : null },
    commands: { discovery: publicDiscovery, input: commands.observation, projection: projected } };
}
function validArguments(phase, status, consumer) {
  return ["build", "ui"].includes(phase) && typeof status === "string" &&
    /^(?:0|[1-9]\d{0,2})$/.test(status) && Number(status) <= 255 &&
    typeof consumer === "string" && isAbsolute(consumer) && resolve(consumer) !== "/";
}
export function collectIOSCommandOutput(phase, status, consumer, io = fs) {
  const valid = validArguments(phase, status, consumer);
  const report = { schemaVersion: 1, kind: "ios-command-output-observation", phase: choice(phase, ["build", "ui"]),
    status: valid ? "observed-inputs" : "invalid-arguments",
    shellExitStatus: valid ? Number(status) : null,
    statusScope: "capture-setup-or-command-or-redirection-result",
    workflowStepStatus: "not-observed", commandExecution: "not-established", nativeSignal: null,
    inputFreshness: "not-established-by-reporter",
    fileObservationScope: "bounded-before-after-file-samples;not-an-atomic-snapshot",
    nestedOutputScope: "existing-driver-records;runner-text-is-utf8-decoded-buffered-output",
    sourceLimits: IOS_COMMAND_LIMITS, streams: [], flows: [] };
  if (!valid) return report;
  try {
    if (!checkedDirectory(consumer, io)) { report.status = "unsafe-consumer"; return report; }
    const root = io.realpathSync(consumer);
    if (phase === "build") {
      report.streams.push({ role: "build-stdout", ...readIOSCommandFile("/tmp/xcodebuild.log", IOS_COMMAND_LIMITS.streamBytes, io).observation });
      report.streams.push({ role: "build-stderr", ...nestedInput(root, ["ios-command-output", "build-stderr.log"], IOS_COMMAND_LIMITS.streamBytes, io).observation });
    } else {
      for (const stream of ["stdout", "stderr"]) report.streams.push({ role: "ui-" + stream,
        ...nestedInput(root, ["ios-command-output", "ui-" + stream + ".log"], IOS_COMMAND_LIMITS.streamBytes, io).observation });
      for (const flow of FLOWS) report.flows.push(flowObservation(root, flow, io));
    }
  } catch (error) { report.status = "input-query-failed"; report.queryErrorCategory = errorCategory(error); }
  return report;
}
function fallback(report, reason) {
  return { schemaVersion: 1, kind: "ios-command-output-observation", phase: choice(own(report, "phase"), ["build", "ui"]),
    status: reason, shellExitStatus: integer(own(report, "shellExitStatus")),
    statusScope: "capture-setup-or-command-or-redirection-result", workflowStepStatus: "not-observed",
    commandExecution: "not-established", nativeSignal: null, inputFreshness: "not-established-by-reporter",
    observationsOmitted: true, streamRowsOmitted: Array.isArray(report.streams) ? report.streams.length : null,
    flowRowsOmitted: Array.isArray(report.flows) ? report.flows.length : null };
}
export function encodeIOSCommandEnvelope(report, receipt) {
  const encode = summary => BEGIN + "\n" + JSON.stringify({ schemaVersion: 1, summary, receipt }) + "\n" + END + "\n";
  let text = encode(report);
  if (Buffer.byteLength(text, "utf8") > IOS_COMMAND_LIMITS.envelopeBytes) text = encode(fallback(report, "console-byte-limit"));
  if (Buffer.byteLength(text, "utf8") > IOS_COMMAND_LIMITS.envelopeBytes) throw new Error("bounded envelope contract");
  return text;
}
function retainSummary(report, consumer, io) {
  let fd;
  const bytes = bytesOf(report), receipt = { status: "not-retained", bytes: null, sha256: null, hashScope: "none" };
  try {
    if (!validArguments(report.phase, String(report.shellExitStatus), consumer) ||
        !checkedDirectory(consumer, io) || !checkedDirectory(join(consumer, "ios-command-output"), io))
      return { ...receipt, status: "unavailable-directory" };
    const path = join(consumer, "ios-command-output", report.phase + "-summary.json");
    if (io.constants.O_NOFOLLOW === undefined) return { ...receipt, status: "unsupported-write-contract" };
    fd = io.openSync(path, io.constants.O_WRONLY | io.constants.O_CREAT | io.constants.O_EXCL | io.constants.O_NOFOLLOW, 0o600);
    io.writeFileSync(fd, bytes); io.fsyncSync(fd);
    const closing = fd; fd = undefined; io.closeSync(closing);
    const readback = readIOSCommandFile(path, IOS_COMMAND_LIMITS.summaryBytes, io);
    if (!readback.content || !readback.content.equals(bytes)) return { ...receipt, status: "readback-unavailable-or-mismatched" };
    return { status: "retained", bytes: bytes.length, sha256: readback.observation.sha256, hashScope: "closed-readback-file" };
  } catch (error) { return { ...receipt, status: errorCategory(error) }; }
  finally { if (fd !== undefined) { try { io.closeSync(fd); } catch { /* Secondary reporting failure. */ } } }
}
export function reportIOSCommandOutput(args, { io = fs, emit = text => process.stdout.write(text) } = {}) {
  let report, receipt;
  try {
    report = Array.isArray(args) && args.length === 3
      ? collectIOSCommandOutput(args[0], args[1], args[2], io)
      : collectIOSCommandOutput(null, null, null, io);
    if (bytesOf(report).length > IOS_COMMAND_LIMITS.summaryBytes) report = fallback(report, "summary-byte-limit");
    receipt = retainSummary(report, args[2], io);
    const envelope = encodeIOSCommandEnvelope(report, receipt);
    try { emit(envelope); } catch { return { report, receipt, emitted: false }; }
    return { report, receipt, emitted: true };
  } catch {
    report = { schemaVersion: 1, kind: "ios-command-output-observation", phase: null,
      status: "reporter-unavailable", shellExitStatus: null, commandExecution: "not-established", nativeSignal: null };
    receipt = { status: "unavailable", bytes: null, sha256: null, hashScope: "none" };
    try { emit(encodeIOSCommandEnvelope(report, receipt)); } catch { /* Original shell result remains authoritative. */ }
    return { report, receipt, emitted: false };
  }
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  reportIOSCommandOutput(process.argv.slice(2));
}
