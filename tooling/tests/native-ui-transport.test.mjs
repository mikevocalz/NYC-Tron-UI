import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { closeSync, ftruncateSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync, writeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { classifyInitialUiTransportFailure as classify, retainInitialUiTransportFailure as retain,
  withInitialUiTransportRecovery as retry } from "../native/ui-transport.mjs";

const appId = "com.nyctron.instruments.example", deviceId = "emulator-5554";
const command = (name, value, status = "COMPLETED", metadata = {}) => ({ command: { [name]: value }, metadata: { status, ...metadata } });
const launch = () => command("launchAppCommand", { appId, stopApp: false });
const visible = (text, status = "COMPLETED", metadata = {}) => command("assertConditionCommand", { condition: { visible: { textRegex: text, optional: false } } }, status, metadata);
const iosCommands = () => [launch(), visible("Library"), command("tapOnElement", { selector: { textRegex: "Settings", optional: false }, longPress: false }, "COMPLETED",
  { timestamp: 1794294187738, duration: 4040, sequenceNumber: 4 }), visible("Workspace preferences", "FAILED",
  { timestamp: 1794294191779, sequenceNumber: 5, error: { message: 'Assertion is false: "Workspace preferences" is visible' } })];
// The relevant same-contact lines from the observed e2b65dd5 simulator failure,
// shortened to omit unrelated destinations. Timestamps and sender/path match.
const simulatorLog = [
  "2026-11-10 07:03:11.002321+0000 localhost backboardd[27213]: Service added: IOHIDService name: id:0x105b61c000000 primaryUsagePage:0xd transport:Recap locationID:recap-bus-0",
  "2026-11-10 07:03:11.009199+0000 localhost backboardd[27213]: unknown senderID: 0x105B61C000000",
  "2026-11-10 07:03:11.246695+0000 localhost backboardd[27213]: cancel -- digitizer did disappear:<BKDirectTouchState: senderID: 0x105B61C000000; contacts: contacts: [pathIndex: 2; touchIdentifier: 1; touching; locked; destinations: (sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground)]>",
  "2026-11-10 07:03:11.246831+0000 localhost backboardd[27213]: canceling paths contacts: [pathIndex: 2; touchIdentifier: 1; touching; locked; destinations: (sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground)] -- HID",
  "2026-11-10 07:03:11.340488+0000 localhost testmanagerd[36533]: Touch up at 348.0, 808.0, offset=0.10s confirmed by TouchEventsCompleted.",
].join("\n");
const ios = () => ({ platform: "ios", flow: "settings", appId, deviceId: "FCC5F673-7BEC-4A7D-8F2A-4DC35E2668EC", commands: iosCommands(), simulatorLog });
const android = () => ({ platform: "android", flow: "settings", appId, deviceId,
  commands: [command("launchAppCommand", { appId, stopApp: false }, "FAILED", { sequenceNumber: 2,
    error: { message: "Command failed (host:transport:emulator-5554): device offline" } })] });

test("Android recovery requires the exact initial launch transport failure before any app assertion", () => {
  assert.equal(classify(android()).kind, "android-initial-launch-device-offline");
  for (const change of [
    input => { input.commands.unshift(visible("Library")); },
    input => { input.commands.push(visible("Workspace preferences", "FAILED")); },
    input => { input.commands[0].metadata.error.message = "Application crashed"; },
    input => { input.commands[0].command.launchAppCommand.appId = "com.other.app"; },
    input => { input.commands[0].command.launchAppCommand.clearState = true; },
    input => { input.deviceId = "emulator-5556"; },
    input => { input.flow = "editor"; },
  ]) { const input = android(); change(input); assert.equal(classify(input), null); }
});

test("iOS recovery binds the first Settings tap to its actual Recap sender, nonempty cancelled contact, app and time", () => {
  const evidence = classify(ios());
  assert.equal(evidence.kind, "ios-initial-navigation-recap-cancelled");
  assert.equal(evidence.senderId, "0x105b61c000000");
  assert.equal(evidence.pathIndex, 2);
  for (const line of Object.values(evidence.evidence)) assert.ok(line.at >= evidence.tap.start && line.at <= evidence.tap.end);
});

test("near misses, different app/contact, missing registration, empty contacts and out-of-attempt logs are not recoverable", () => {
  const mutations = [
    text => text.split("\n").filter(line => !line.includes("digitizer did disappear")).join("\n"),
    text => text.replace("unknown senderID: 0x105B61C000000", "unknown senderID: 0x222"),
    text => text.replace("senderID: 0x105B61C000000; contacts", "senderID: 0x222; contacts"),
    text => text.replaceAll("sceneID:" + appId + "-default", "sceneID:com.other.app-default"),
    text => text.replace("contacts: contacts: [pathIndex: 2;", "contacts: contacts: []; ignored: [pathIndex: 2;"),
    text => text.replace("canceling paths contacts: [pathIndex: 2;", "canceling paths contacts: [pathIndex: 3;"),
    text => text.replace("transport:Recap", "transport:Other"),
    text => text.replaceAll("07:03:11.", "07:03:12."),
    text => text.replace("07:03:11.009199", "07:03:06.009199"),
    text => text.replace("07:03:11.246831", "07:03:11.746831"),
  ];
  for (const mutate of mutations) assert.equal(classify({ ...ios(), simulatorLog: mutate(simulatorLog) }), null);
});

test("iOS never retries arbitrary assertions, edits, later taps or malformed timing", () => {
  for (const change of [
    input => { input.commands[2].command.tapOnElement.selector.textRegex = "Editor"; },
    input => { input.commands[2].command.tapOnElement.longPress = true; },
    input => { input.commands[3] = visible("Preferences saved for this session.", "FAILED"); },
    input => { input.commands.splice(3, 0, command("inputTextCommand", { text: "Draft" })); },
    input => { input.commands[2].metadata.timestamp += 10000; },
    input => { delete input.commands[2].metadata.duration; },
    input => { input.commands[3].metadata.timestamp -= 2; },
    input => { input.flow = "pointer"; },
  ]) { const input = ios(); change(input); assert.equal(classify(input), null); }
});

test("one eligible recovery retains the failure before a fresh successful attempt", async () => {
  const order = [], failure = new Error("original transport"), eligibility = classify(android());
  const result = await retry({ attempt: number => { order.push("attempt " + number); if (!number) throw failure; return "full assertions passed"; },
    classify: error => { assert.equal(error, failure); order.push("classify"); return eligibility; },
    recover: evidence => { assert.equal(evidence, eligibility); order.push("retain and restore transport"); } });
  assert.equal(result, "full assertions passed");
  assert.deepEqual(order, ["attempt 0", "classify", "retain and restore transport", "attempt 1"]);
});

test("a second failure is final, and an ineligible failure cannot reach recovery", async () => {
  let attempts = 0, classifications = 0, recoveries = 0;
  await assert.rejects(retry({ attempt: () => { throw new Error("failure " + ++attempts); },
    classify: () => { classifications++; return classify(android()); }, recover: () => { recoveries++; } }), /failure 2/);
  assert.deepEqual([attempts, classifications, recoveries], [2, 1, 1]);
  await assert.rejects(retry({ attempt: () => { throw new Error("app assertion"); }, classify: () => null,
    recover: () => { assert.fail("must not recover an app assertion"); } }), /app assertion/);
});

test("retention preserves the failed JUnit, native logs and screenshots byte for byte, without overwriting them on rerun", t => {
  const output = mkdtempSync(join(tmpdir(), "native-ui-recovery-"));
  t.after(() => rmSync(output, { recursive: true, force: true }));
  mkdirSync(join(output, "settings", "artifacts"), { recursive: true });
  const fixtures = { "settings/report.xml": '<testcase status="ERROR"><failure>device offline</failure></testcase>',
    "settings/artifacts/commands.json": JSON.stringify(android().commands),
    "settings/artifacts/screen.png": Buffer.from([137,80,78,71,13,10,26,10]),
    "settings-maestro.log": "original driver error\n", "commands.jsonl": '{"status":1}\n' };
  for (const [name, bytes] of Object.entries(fixtures)) writeFileSync(join(output, name), bytes);
  const identity = { kind: "android-apk", sha256: "1".repeat(64) };
  const retained = retain({ output, eligibility: classify(android()), error: new Error("original"), sourceCommit: "2".repeat(40), nativeArtifact: identity });
  const record = JSON.parse(readFileSync(join(output, retained.file), "utf8"));
  assert.deepEqual(record.nativeArtifact, identity);
  for (const item of record.originals) {
    const bytes = readFileSync(join(output, item.file));
    assert.deepEqual(bytes, Buffer.from(fixtures[item.sourceFile]));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
  }
  assert.equal(record.snapshot.liveDirectory, "settings");
  mkdirSync(join(output, "settings-retry"));
  writeFileSync(join(output, "settings-retry", "report.xml"), '<testcase status="SUCCESS"/>');
  writeFileSync(join(output, "settings-retry-maestro.log"), "successful retry\n");
  for (const [name, bytes] of Object.entries(fixtures)) assert.deepEqual(readFileSync(join(output, name)), Buffer.from(bytes));
  assert.match(readFileSync(join(output, retained.retainedDirectory, "report.xml"), "utf8"), /status="ERROR"/);
  assert.throws(() => retain({ output }), /cannot be replaced/);
});

test("retained snapshots survive writes through an already-open driver log and include hidden debug evidence", t => {
  const output = mkdtempSync(join(tmpdir(), "native-ui-live-log-"));
  let descriptor;
  t.after(() => {
    if (descriptor !== undefined) closeSync(descriptor);
    rmSync(output, { recursive: true, force: true });
  });
  const relativeLog = join("debug", ".maestro", "tests", "attempt", "maestro.log");
  mkdirSync(join(output, "settings", "debug", ".maestro", "tests", "attempt"), { recursive: true });
  const original = "driver evidence before recovery\n";
  writeFileSync(join(output, "settings", relativeLog), original);
  descriptor = openSync(join(output, "settings", relativeLog), "r+");
  const retained = retain({ output, eligibility: classify(android()), error: new Error("original"),
    sourceCommit: "2".repeat(40), nativeArtifact: { kind: "android-apk", sha256: "1".repeat(64) } });
  const receiptBytes = readFileSync(join(output, retained.file));
  const receipt = JSON.parse(receiptBytes);
  assert.equal(receipt.snapshot.phase, "before recovery");
  assert.equal(receipt.snapshot.liveDirectory, "settings");
  assert.ok(Date.parse(receipt.snapshot.completedAt) >= Date.parse(receipt.snapshot.startedAt));
  const [snapshot] = receipt.originals;
  assert.equal(snapshot.sourceFile, "settings/debug/.maestro/tests/attempt/maestro.log");
  assert.equal(snapshot.snapshot, "before recovery");
  const checkSnapshot = () => {
    const bytes = readFileSync(join(output, snapshot.file));
    assert.equal(bytes.toString(), original);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), snapshot.sha256);
    assert.deepEqual(readFileSync(join(output, retained.file)), receiptBytes);
  };
  writeSync(descriptor, Buffer.from("late driver output\n"), 0, 19, Buffer.byteLength(original));
  assert.equal(readFileSync(join(output, receipt.snapshot.liveDirectory, relativeLog), "utf8"), original + "late driver output\n");
  checkSnapshot();
  const replacement = Buffer.from("driver rewrote its live output\n");
  writeSync(descriptor, replacement, 0, replacement.length, 0);
  ftruncateSync(descriptor, replacement.length);
  assert.equal(readFileSync(join(output, receipt.snapshot.liveDirectory, relativeLog), "utf8"), replacement.toString());
  checkSnapshot();
});
