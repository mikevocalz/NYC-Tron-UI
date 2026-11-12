import { createHash } from "node:crypto";
import { constants, copyFileSync, existsSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

// Recovery is restricted to the first tab navigation of the Settings and
// Editor flows, before any edit or save, and to the Pointer flow's single
// stroke before its commit assertion. Maestro's completed tap or swipe is
// insufficient evidence of delivered input:
// https://github.com/mobile-dev-inc/Maestro/issues/3686
// https://github.com/mobile-dev-inc/Maestro/issues/3685
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const commandIs = (entry, name, status) => entry?.metadata?.status === status &&
  entry.command && Object.keys(entry.command).length === 1 && name in entry.command;
const isLaunch = (entry, appId, status) => commandIs(entry, "launchAppCommand", status) &&
  entry.command.launchAppCommand.appId === appId && entry.command.launchAppCommand.stopApp === false &&
  !entry.command.launchAppCommand.clearState && !entry.command.launchAppCommand.clearKeychain;
const isText = (selector, text) => selector?.textRegex === text && selector.optional !== true &&
  Object.keys(selector).every(key => key === "textRegex" || key === "optional");
const isVisible = (entry, text, status) => commandIs(entry, "assertConditionCommand", status) &&
  Object.keys(entry.command.assertConditionCommand.condition ?? {}).length === 1 &&
  isText(entry.command.assertConditionCommand.condition.visible, text);

function timedLines(log, start, end) {
  if (typeof log !== "string") return [];
  return log.split(/\r?\n/).flatMap((text, index) => {
    const prefix = text.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+[+-]\d{4})\s/);
    if (!prefix) return [];
    const at = Date.parse(prefix[1].replace(" ", "T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2"));
    return at >= start && at <= end ? [{ line: index + 1, at, text }] : [];
  });
}

// Each recoverable iOS navigation flow: the exact commands that may precede
// its first tab tap, that tap's text, the assertion that only the destination
// can satisfy, and the one route panel mounted before the tap. Nothing after
// that assertion (edits, saves, scrolls) is covered.
const iosInitialNavigation = {
  settings: { before: ["launch", "Library"], tap: "Settings", destination: "Workspace preferences", preTapPanel: "reference-panel-library" },
  editor: { before: ["launch"], tap: "Editor", destination: "Quiet forms", preTapPanel: "reference-panel-settings" },
};
// The pointer flow's single stroke, covered only up to the commit assertion.
const iosPointerStroke = {
  surface: "Input drawing surface", settle: "Pointer input", idle: "Committed strokes: 0. Cancelled strokes: 0. Prediction samples: 0.",
  committed: "Committed strokes: 1. Cancelled strokes: 0. Prediction samples: 0.",
  cancelled: ["Committed strokes: 0. Cancelled strokes: 1. Prediction samples: 0.", "Input source: touch. Last event: cancel."],
};
const retainedFlows = [...Object.keys(iosInitialNavigation), "pointer"];
export const recoverableUiFlows = Object.freeze(retainedFlows);

// XCTest synthesizes each tap and then waits this long for backboardd's
// TouchEventsCompleted ("Waiting up to 5.0s for TouchEventsCompleted"). A Recap
// digitizer that disappears inside that interval, before confirmation, took the
// touch with it. Observed lost taps disappeared 1405, 1581 and 2690 ms after
// the service was added; delivered taps tear down in 222 to 641 ms.
export const recapConfirmationIntervalMs = 5000;

// Maestro 2.12.1 starts a fresh XCTest runner for every CLI session, including
// `maestro hierarchy`, and waits MAESTRO_DRIVER_STARTUP_TIMEOUT for it after
// launching xcodebuild. The harness pins that budget and gives the hierarchy
// process room for JVM start, runner install and the dump itself, so Maestro's
// own "iOS driver not ready" diagnostic fires before the harness kills it.
export const maestroSessionLimits = Object.freeze({ driverStartupMs: 180000, hierarchyTimeoutMs: 300000 });

const isSwipe = (entry, status) => commandIs(entry, "swipeCommand", status) &&
  entry.command.swipeCommand.direction === "RIGHT" && isText(entry.command.swipeCommand.elementSelector, iosPointerStroke.surface) &&
  entry.command.swipeCommand.duration === 700 && entry.command.swipeCommand.relativePoint === "25%, 50%";
const failedVisible = (entry, text) => isVisible(entry, text, "FAILED") &&
  entry.metadata.error?.message === 'Assertion is false: "' + text + '" is visible';

function executed(commands) {
  return commands.filter(entry => !commandIs(entry, "defineVariablesCommand", "COMPLETED") &&
    !commandIs(entry, "applyConfigurationCommand", "COMPLETED"));
}

/** The completed action's time window, or null when its timing cannot bind log lines to it. */
function actionWindow(action, assertion) {
  const start = action.metadata.timestamp, duration = action.metadata.duration;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(duration) || duration <= 0 || duration > 60000 ||
      !Number.isSafeInteger(assertion.metadata.timestamp) || assertion.metadata.timestamp < start + duration) return null;
  return { start, end: start + duration };
}

/** Every Recap sender in the window whose cancel carried a touching contact into the app's scene. */
function touchingRecapCancels(lines, appId) {
  const scene = new RegExp("sceneID:" + escape(appId) + "-default(?:[;>\\s])");
  const candidates = [];
  for (const unknown of lines) {
    const sender = unknown.text.match(/backboardd.*unknown senderID:\s*0x([\da-f]+)/i)?.[1]?.toLowerCase();
    if (!sender) continue;
    const senderId = new RegExp("senderID:\\s*0x" + sender + "(?:[;\\s])", "i");
    const serviceId = new RegExp("id:0x" + sender + "\\s", "i");
    const recap = lines.find(line => line.at <= unknown.at && line.text.includes("Service added: IOHIDService") &&
      line.text.includes("transport:Recap") && serviceId.test(line.text));
    const cancelled = lines.find(line => line.at >= unknown.at && /backboardd.*cancel -- digitizer did disappear:/.test(line.text) &&
      senderId.test(line.text) && /contacts: contacts: \[pathIndex: \d+;[^\]]*touching;/.test(line.text) && scene.test(line.text));
    if (!recap || !cancelled) continue;
    const pathIndex = cancelled.text.match(/contacts: contacts: \[pathIndex: (\d+);/)[1];
    const paths = lines.find(line => line.at >= cancelled.at && line.at - cancelled.at <= 250 &&
      line.text.includes("canceling paths contacts: [pathIndex: " + pathIndex + ";") && scene.test(line.text));
    if (paths) candidates.push({ senderId: "0x" + sender, pathIndex: Number(pathIndex), evidence: { recap, unknown, cancelled, paths } });
  }
  return candidates;
}

/**
 * The one Recap digitizer in the window that backboardd refused, then removed
 * with no contact, before XCTest confirmed the touch. Null on any ambiguity.
 */
function droppedRecapTap(lines) {
  const added = lines.filter(line => /backboardd.*Service added: IOHIDService.*transport:Recap/.test(line.text));
  if (added.length !== 1) return null;
  const [recap] = added, sender = recap.text.match(/\bid:0x([\da-f]+)\s/i)?.[1]?.toLowerCase();
  if (!sender) return null;
  const senderId = new RegExp("senderID:\\s*0x" + sender + "(?:[;\\s]|$)", "i");
  const serviceId = new RegExp("\\bid:0x" + sender + "\\s", "i");
  const unknown = lines.find(line => line.at >= recap.at && /backboardd.*unknown senderID:/.test(line.text) && senderId.test(line.text));
  if (!unknown) return null;
  const ignored = lines.find(line => line.at >= unknown.at &&
    /backboardd.*ignoring digitizer event for display <main> from unsupported service:/.test(line.text) &&
    serviceId.test(line.text) && senderId.test(line.text));
  const cancels = lines.filter(line => line.at >= recap.at && /backboardd.*cancel -- digitizer did disappear:/.test(line.text) && senderId.test(line.text));
  // A cancelled contact means the touch reached a destination: that is the other rule, never this one.
  if (!ignored || cancels.length !== 1 || !/contacts: contacts: \[\]; destinations: \[\];/.test(cancels[0].text)) return null;
  const [cancelled] = cancels;
  if (cancelled.at < ignored.at || cancelled.at - recap.at > recapConfirmationIntervalMs) return null;
  const unconfirmed = lines.find(line => line.at >= cancelled.at &&
    /testmanagerd.*Timed out after waiting 5\.0s for TouchEventsCompleted/.test(line.text));
  if (!unconfirmed) return null;
  return { senderId: "0x" + sender, createdToCancelledMs: cancelled.at - recap.at, evidence: { recap, unknown, ignored, cancelled, unconfirmed } };
}

/** Resource ids and accessible labels from Maestro's own hierarchy of the failed assertion. */
function screen(failureHierarchy, assertion) {
  const declared = (assertion.metadata.artifacts ?? []).filter(artifact => artifact?.type === "SCREEN_HIERARCHY");
  if (declared.length !== 1 || failureHierarchy?.path !== declared[0].path || typeof failureHierarchy.tree !== "object") return null;
  const ids = [], labels = new Set();
  (function walk(node) {
    const attributes = node?.attributes ?? {};
    if (typeof attributes["resource-id"] === "string") ids.push(attributes["resource-id"]);
    for (const key of ["text", "accessibilityText"]) if (typeof attributes[key] === "string") labels.add(attributes[key]);
    for (const child of node?.children ?? []) walk(child);
  })(failureHierarchy.tree);
  return { path: declared[0].path, ids, labels };
}

/** Return an evidence-bound initial transport failure, or null; never infer it from a failed assertion alone. */
export function classifyInitialUiTransportFailure({ platform, flow, commands, simulatorLog, failureHierarchy, appId, deviceId }) {
  if (!retainedFlows.includes(flow) || !Array.isArray(commands) || !commands.length ||
      !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)+$/.test(appId ?? "")) return null;
  const execution = executed(commands);
  if (platform === "android") {
    if (flow !== "settings" || execution.length !== 1 || !isLaunch(execution[0], appId, "FAILED") ||
        !/^emulator-\d+$/.test(deviceId ?? "")) return null;
    const expected = "Command failed (host:transport:" + deviceId + "): device offline";
    if (execution[0].metadata.error?.message !== expected) return null;
    return { kind: "android-initial-launch-device-offline", appId, deviceId,
      failedSequence: execution[0].metadata.sequenceNumber, error: expected };
  }
  if (platform !== "ios") return null;
  if (flow === "pointer") return classifyPointerStroke({ execution, simulatorLog, failureHierarchy, appId, deviceId });
  const spec = iosInitialNavigation[flow];
  if (execution.length !== spec.before.length + 2) return null;
  const before = execution.slice(0, spec.before.length), [tap, assertion] = execution.slice(spec.before.length);
  if (!spec.before.every((step, index) => step === "launch" ? isLaunch(before[index], appId, "COMPLETED") :
        isVisible(before[index], step, "COMPLETED")) ||
      !commandIs(tap, "tapOnElement", "COMPLETED") || !isText(tap.command.tapOnElement.selector, spec.tap) ||
      tap.command.tapOnElement.longPress || tap.command.tapOnElement.repeat || !failedVisible(assertion, spec.destination)) return null;
  const window = actionWindow(tap, assertion);
  if (!window) return null;
  const lines = timedLines(simulatorLog, window.start, window.end);
  const common = { appId, deviceId, flow, tap: { text: spec.tap, ...window, sequence: tap.metadata.sequenceNumber },
    failedSequence: assertion.metadata.sequenceNumber };
  const candidates = touchingRecapCancels(lines, appId);
  // Multiple possible contacts cannot prove which delivered command failed.
  if (candidates.length > 1) return null;
  if (candidates.length === 1) return { kind: "ios-initial-navigation-recap-cancelled", ...common, ...candidates[0],
    upstreamIssue: "https://github.com/mobile-dev-inc/Maestro/issues/3686" };
  // No contact reached the app. Recover only when backboardd refused the one
  // Recap digitizer and the app's own tree proves it never left the pre-tap route.
  const dropped = droppedRecapTap(lines), shown = screen(failureHierarchy, assertion);
  if (!dropped || !shown) return null;
  const panels = shown.ids.filter(id => id.startsWith("reference-panel-"));
  if (panels.length !== 1 || panels[0] !== spec.preTapPanel || shown.labels.has(spec.destination) || !shown.labels.has(spec.tap)) return null;
  return { kind: "ios-initial-navigation-recap-dropped", ...common, ...dropped,
    screen: { hierarchy: shown.path, routePanel: panels[0], destinationVisible: false },
    upstreamIssue: "https://github.com/mobile-dev-inc/Maestro/issues/3686" };
}

/** The pointer flow's one stroke, cancelled by the OS through a Recap digitizer and never committed by the app. */
function classifyPointerStroke({ execution, simulatorLog, failureHierarchy, appId, deviceId }) {
  if (execution.length !== 6) return null;
  const [launch, surface, settle, idle, swipe, assertion] = execution;
  if (!isLaunch(launch, appId, "COMPLETED") || !isVisible(surface, iosPointerStroke.surface, "COMPLETED") ||
      !commandIs(settle, "tapOnElement", "COMPLETED") || !isText(settle.command.tapOnElement.selector, iosPointerStroke.settle) ||
      settle.command.tapOnElement.longPress || settle.command.tapOnElement.repeat ||
      !isVisible(idle, iosPointerStroke.idle, "COMPLETED") || !isSwipe(swipe, "COMPLETED") ||
      !failedVisible(assertion, iosPointerStroke.committed)) return null;
  const window = actionWindow(swipe, assertion);
  if (!window) return null;
  const candidates = touchingRecapCancels(timedLines(simulatorLog, window.start, window.end), appId);
  const shown = screen(failureHierarchy, assertion);
  if (candidates.length !== 1 || !shown) return null;
  // The app must report exactly the cancelled stroke: no commit, one cancel, last event cancel.
  if (!iosPointerStroke.cancelled.every(label => shown.labels.has(label)) ||
      [...shown.labels].some(label => /^Committed strokes: [1-9]/.test(label))) return null;
  return { kind: "ios-pointer-stroke-recap-cancelled", appId, deviceId, flow: "pointer",
    stroke: { ...window, sequence: swipe.metadata.sequenceNumber }, failedSequence: assertion.metadata.sequenceNumber,
    ...candidates[0], screen: { hierarchy: shown.path, labels: iosPointerStroke.cancelled },
    upstreamIssue: "https://github.com/mobile-dev-inc/Maestro/issues/3686" };
}

/** Exactly one recovery. A second failure propagates without reclassification. */
export async function withInitialUiTransportRecovery({ attempt, classify, recover }) {
  try { return await attempt(0); }
  catch (error) {
    const eligibility = await classify(error);
    if (!eligibility) throw error;
    await recover(eligibility, error);
    return await attempt(1);
  }
}

/** Move, never overwrite, every original driver artifact before a fresh attempt. */
export function retainInitialUiTransportFailure({ output, flow = "settings", eligibility, error, sourceCommit, nativeArtifact }) {
  if (!retainedFlows.includes(flow)) throw new Error("No initial UI transport recovery exists for flow " + flow);
  // Settings keeps its original receipt name; other flows get their own so none can replace another.
  const initial = join(output, flow), retained = join(output, flow + "-initial-transport-failure");
  const receipt = join(output, flow === "settings" ? "transport-recovery.json" : flow + "-transport-recovery.json");
  const originalLog = join(output, flow + "-maestro.log");
  if (!existsSync(initial) || existsSync(retained) || existsSync(receipt)) throw new Error("Initial UI transport evidence cannot be replaced");
  if (["maestro-command.log", "commands-before-recovery.jsonl", "runner-failure.txt"].some(name => existsSync(join(initial, name))))
    throw new Error("Initial UI transport evidence conflicts with retained runner metadata");
  const digest = file => createHash("sha256").update(readFileSync(file)).digest("hex");
  const path = file => relative(output, file).split(sep).join("/");
  const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
  const originals = walk(initial).map(file => ({ sourceFile: path(file), file: path(join(retained, relative(initial, file))), sha256: digest(file) }));
  if (!originals.length) throw new Error("Initial UI failure has no original artifacts");
  if (existsSync(originalLog)) originals.push({ sourceFile: path(originalLog), file: path(join(retained, "maestro-command.log")), sha256: digest(originalLog) });
  renameSync(initial, retained);
  if (existsSync(originalLog)) renameSync(originalLog, join(retained, "maestro-command.log"));
  const commands = join(output, "commands.jsonl");
  if (existsSync(commands)) {
    const snapshot = join(retained, "commands-before-recovery.jsonl");
    copyFileSync(commands, snapshot, constants.COPYFILE_EXCL);
    originals.push({ sourceFile: path(commands), file: path(snapshot), sha256: digest(snapshot), snapshot: "before recovery" });
  }
  const failure = join(retained, "runner-failure.txt");
  writeFileSync(failure, String(error?.stack ?? error) + "\n", { flag: "wx" });
  const record = { schema: 1, status: "eligible", flow, sourceCommit, nativeArtifact, eligibility, originals,
    runnerFailure: { file: path(failure), sha256: digest(failure) } };
  writeFileSync(receipt, JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
  return { file: path(receipt), sha256: digest(receipt), kind: eligibility.kind, retainedDirectory: path(retained) };
}
