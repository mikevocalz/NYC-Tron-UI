import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

// Recovery is restricted to the first Settings navigation, before any edit or
// save. Maestro's completed tap is insufficient evidence of delivered input:
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

/** Return an evidence-bound initial transport failure, or null; never infer it from a failed assertion alone. */
export function classifyInitialUiTransportFailure({ platform, flow, commands, simulatorLog, appId, deviceId }) {
  if (flow !== "settings" || !Array.isArray(commands) || !commands.length ||
      !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)+$/.test(appId ?? "")) return null;
  const execution = [];
  for (const entry of commands) {
    if (commandIs(entry, "defineVariablesCommand", "COMPLETED") || commandIs(entry, "applyConfigurationCommand", "COMPLETED")) continue;
    execution.push(entry);
  }
  if (platform === "android") {
    if (execution.length !== 1 || !isLaunch(execution[0], appId, "FAILED") ||
        !/^emulator-\d+$/.test(deviceId ?? "")) return null;
    const expected = "Command failed (host:transport:" + deviceId + "): device offline";
    if (execution[0].metadata.error?.message !== expected) return null;
    return { kind: "android-initial-launch-device-offline", appId, deviceId,
      failedSequence: execution[0].metadata.sequenceNumber, error: expected };
  }
  if (platform !== "ios" || execution.length !== 4) return null;
  const [launch, library, tap, assertion] = execution;
  if (!isLaunch(launch, appId, "COMPLETED") || !isVisible(library, "Library", "COMPLETED") ||
      !commandIs(tap, "tapOnElement", "COMPLETED") || !isText(tap.command.tapOnElement.selector, "Settings") ||
      tap.command.tapOnElement.longPress || tap.command.tapOnElement.repeat ||
      !isVisible(assertion, "Workspace preferences", "FAILED") ||
      assertion.metadata.error?.message !== 'Assertion is false: "Workspace preferences" is visible') return null;
  const start = tap.metadata.timestamp, duration = tap.metadata.duration;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(duration) || duration <= 0 || duration > 60000 ||
      !Number.isSafeInteger(assertion.metadata.timestamp) || assertion.metadata.timestamp < start + duration) return null;
  const end = start + duration, lines = timedLines(simulatorLog, start, end);
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
    if (paths) candidates.push({ senderId: "0x" + sender, pathIndex: Number(pathIndex),
      evidence: { recap, unknown, cancelled, paths } });
  }
  // Multiple possible contacts cannot prove which delivered command failed.
  if (candidates.length !== 1) return null;
  return { kind: "ios-initial-navigation-recap-cancelled", appId, deviceId,
    tap: { text: "Settings", start, end, sequence: tap.metadata.sequenceNumber },
    failedSequence: assertion.metadata.sequenceNumber, ...candidates[0],
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

/** Snapshot every original driver artifact before recovery; preserve live files separately. */
export function retainInitialUiTransportFailure({ output, eligibility, error, sourceCommit, nativeArtifact }) {
  const initial = join(output, "settings"), retained = join(output, "settings-initial-transport-failure");
  const live = join(output, "settings-initial-transport-live");
  const receipt = join(output, "transport-recovery.json"), originalLog = join(output, "settings-maestro.log");
  if (!existsSync(initial) || existsSync(retained) || existsSync(live) || existsSync(receipt)) throw new Error("Initial UI transport evidence cannot be replaced");
  if (["maestro-command.log", "commands-before-recovery.jsonl", "runner-failure.txt"].some(name => existsSync(join(initial, name))))
    throw new Error("Initial UI transport evidence conflicts with retained runner metadata");
  const digest = file => createHash("sha256").update(readFileSync(file)).digest("hex");
  const path = file => relative(output, file).split(sep).join("/");
  const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
  const files = walk(initial);
  if (!files.length) throw new Error("Initial UI failure has no original artifacts");
  const snapshot = { phase: "before recovery", startedAt: new Date().toISOString(), liveDirectory: path(live) };
  // Renaming alone leaves existing driver file descriptors attached to the
  // retained files. Keep those live inodes, then write independent snapshots.
  renameSync(initial, live);
  const originals = [];
  const retainFile = (source, destination, sourceFile) => {
    const bytes = readFileSync(source);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, bytes, { flag: "wx", mode: 0o444 });
    originals.push({ sourceFile, file: path(destination), sha256: digest(destination), snapshot: "before recovery" });
  };
  for (const file of files) {
    const name = relative(initial, file);
    retainFile(join(live, name), join(retained, name), path(file));
  }
  if (existsSync(originalLog)) {
    renameSync(originalLog, join(live, "maestro-command.log"));
    retainFile(join(live, "maestro-command.log"), join(retained, "maestro-command.log"), path(originalLog));
  }
  const commands = join(output, "commands.jsonl");
  if (existsSync(commands)) retainFile(commands, join(retained, "commands-before-recovery.jsonl"), path(commands));
  snapshot.completedAt = new Date().toISOString();
  const failure = join(retained, "runner-failure.txt");
  writeFileSync(failure, String(error?.stack ?? error) + "\n", { flag: "wx" });
  const record = { schema: 1, status: "eligible", sourceCommit, nativeArtifact, eligibility, snapshot, originals,
    runnerFailure: { file: path(failure), sha256: digest(failure) } };
  writeFileSync(receipt, JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
  return { file: path(receipt), sha256: digest(receipt), kind: eligibility.kind, retainedDirectory: path(retained) };
}
