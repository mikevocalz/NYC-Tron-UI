import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { classifyInitialUiTransportFailure as classify, maestroSessionLimits, recapConfirmationIntervalMs, recoverableUiFlows,
  retainInitialUiTransportFailure as retain, withInitialUiTransportRecovery as retry } from "../native/ui-transport.mjs";

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

// Editor's first tab tap from release run 43046836104 (main 11c1ce8), same
// shortening as above. The tap ran 15:43:19.539 to 15:43:24.913 UTC.
const editorCommands = () => [launch(), command("tapOnElement", { selector: { textRegex: "Editor", optional: false }, longPress: false }, "COMPLETED",
  { timestamp: 1794411799539, duration: 5374, sequenceNumber: 3 }), visible("Quiet forms", "FAILED",
  { timestamp: 1794411804913, sequenceNumber: 4, error: { message: 'Assertion is false: "Quiet forms" is visible' } })];
const editorLog = [
  "2026-11-11 15:43:24.241869+0000  localhost backboardd[21229]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x1013418000008 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0",
  "2026-11-11 15:43:24.246184+0000  localhost backboardd[21229]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x1013418000008",
  "2026-11-11 15:43:24.478747+0000  localhost backboardd[21229]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10ec8f560; touchScreen; builtin; senderID: 0x1013418000008; contacts: contacts: [pathIndex: 2; touchIdentifier: 5; touching; locked; destinations: (sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground)]>",
  "2026-11-11 15:43:24.478812+0000  localhost backboardd[21229]: [com.apple.BackBoard:TouchEvents] canceling paths contacts: [pathIndex: 2; touchIdentifier: 5; touching; locked; destinations: (sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground)]",
].join("\n");
const editor = () => ({ platform: "ios", flow: "editor", appId, deviceId: "FCC5F673-7BEC-4A7D-8F2A-4DC35E2668EC", commands: editorCommands(), simulatorLog: editorLog });

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

test("iOS recovery binds the first Editor tap to the same Recap/cancel evidence", () => {
  const evidence = classify(editor());
  assert.equal(evidence.kind, "ios-initial-navigation-recap-cancelled");
  assert.equal(evidence.flow, "editor");
  assert.equal(evidence.tap.text, "Editor");
  assert.equal(evidence.senderId, "0x1013418000008");
  assert.equal(evidence.pathIndex, 2);
  for (const line of Object.values(evidence.evidence)) assert.ok(line.at >= evidence.tap.start && line.at <= evidence.tap.end);
});

test("Editor recovery rejects the same near misses and anything past its first tab tap", () => {
  const mutations = [
    text => text.split("\n").filter(line => !line.includes("digitizer did disappear")).join("\n"),
    text => text.replace("unknown senderID: 0x1013418000008", "unknown senderID: 0x222"),
    text => text.replaceAll("sceneID:" + appId + "-default", "sceneID:com.other.app-default"),
    text => text.replace("contacts: contacts: [pathIndex: 2;", "contacts: contacts: []; ignored: [pathIndex: 2;"),
    text => text.replace("canceling paths contacts: [pathIndex: 2;", "canceling paths contacts: [pathIndex: 3;"),
    text => text.replace("transport:Recap", "transport:Other"),
    text => text.replaceAll("15:43:24.", "15:43:25."),
  ];
  for (const mutate of mutations) assert.equal(classify({ ...editor(), simulatorLog: mutate(editorLog) }), null);
  for (const change of [
    input => { input.commands[1].command.tapOnElement.selector.textRegex = "Settings"; },
    input => { input.commands[2] = visible("Workspace preferences", "FAILED", input.commands[2].metadata); },
    input => { input.commands[2] = visible("Cover headline", "FAILED", input.commands[2].metadata); },
    input => { input.commands.splice(2, 0, visible("Quiet forms")); },
    input => { input.commands.unshift(visible("Library")); },
    input => { input.commands[1].command.tapOnElement.longPress = true; },
    input => { input.commands[2].metadata.timestamp -= 2; },
    input => { input.flow = "settings"; },
    input => { input.platform = "android"; },
  ]) { const input = editor(); change(input); assert.equal(classify(input), null); }
  // A Settings failure never qualifies under the Editor rules.
  assert.equal(classify({ ...ios(), flow: "editor" }), null);
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
  mkdirSync(join(output, "settings"));
  writeFileSync(join(output, "settings", "report.xml"), '<testcase status="SUCCESS"/>');
  assert.match(readFileSync(join(output, retained.retainedDirectory, "report.xml"), "utf8"), /status="ERROR"/);
  assert.throws(() => retain({ output }), /cannot be replaced/);
});

test("Editor retention uses its own directory and receipt and cannot replace Settings evidence", t => {
  const output = mkdtempSync(join(tmpdir(), "native-ui-recovery-"));
  t.after(() => rmSync(output, { recursive: true, force: true }));
  mkdirSync(join(output, "editor", "artifacts"), { recursive: true });
  writeFileSync(join(output, "editor", "report.xml"), '<testcase status="ERROR"/>');
  writeFileSync(join(output, "transport-recovery.json"), "{}\n");
  const retained = retain({ output, flow: "editor", eligibility: classify(editor()), error: new Error("original"),
    sourceCommit: "2".repeat(40), nativeArtifact: { kind: "ios-app", sha256: "1".repeat(64) } });
  assert.equal(retained.file, "editor-transport-recovery.json");
  assert.equal(retained.retainedDirectory, "editor-initial-transport-failure");
  assert.equal(JSON.parse(readFileSync(join(output, retained.file), "utf8")).flow, "editor");
  assert.equal(readFileSync(join(output, "transport-recovery.json"), "utf8"), "{}\n");
  assert.throws(() => retain({ output, flow: "pointer-cancel" }), /No initial UI transport recovery/);
});

// ---- Recap variants seen on macos-26-arm64 20261102.0473.1 (iPhone 17 Pro, iOS 26.5) ----
// Log lines are copied verbatim from each attempt's device-simulator.log, keeping
// only the Recap, backboardd touch and testmanagerd confirmation lines inside the
// action's own window. Hierarchies keep the real nodes Maestro saved for the
// failed assertion (resource ids and labels), with layout-only nodes dropped.

// Variant A: run 43157470910 attempt 1 (PR #68, a54dbce). Settings tap 05:09:53.121, 9382 ms.
// Recap service added 05:09:56.364; backboardd refuses its event as from an
// "unsupported service"; the digitizer disappears with no contact 1581 ms after
// it was added; XCTest times out waiting for TouchEventsCompleted.
const droppedSettingsLog = [
  "2026-11-12 05:09:55.697434+0000  localhost testmanagerd[31881]: [com.apple.dt.xctest:Default] current: Touch down at 348.0, 808.0, offset=0.00s",
  "2026-11-12 05:09:55.697862+0000  localhost testmanagerd[31881]: [com.apple.dt.xctest:Default] current: Touch up at 348.0, 808.0, offset=0.10s",
  "2026-11-12 05:09:56.364748+0000  localhost backboardd[23574]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x10135c2000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-12 05:09:56.998959+0000  localhost backboardd[23574]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x10135C2000000",
  "2026-11-12 05:09:57.001423+0000  localhost backboardd[23574]: [com.apple.BackBoard:TouchEvents] ignoring digitizer event for display <main> from unsupported service: (<BKIOHIDService: 0x108e3ec80; serviceStatus: <unknown>; IOHIDService: IOHIDService name: id:0x10135c2000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:1 mask:0x800 sensorcontrols:7; senderID: 0x10135C2000000; displayUUID: 0x0; eventSource: externalAccessory; primaryUsagePage: 0x0; primaryUsage: 0x0; authenticated: NO; builtIn: NO>):+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  "2026-11-12 05:09:57.945980+0000  localhost backboardd[23574]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x108d77560; touchScreen; builtin; senderID: 0x10135C2000000; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
  "2026-11-12 05:10:02.077929+0000  localhost testmanagerd[31881]: [com.apple.dt.xctest:Default] Timed out after waiting 5.0s for TouchEventsCompleted, event will be implicitly confirmed with no error other than this log message.",
].join("\n");
// Variant A again: run 43172075412 attempt 1 (PR #68, 304c725), tap 07:50:18.719 for 11915 ms; cancel 2690 ms after creation.
const droppedSettingsLog2 = [
  "2026-11-12 07:50:21.868987+0000  localhost testmanagerd[35283]: [com.apple.dt.xctest:Default] current: Touch down at 348.0, 808.0, offset=0.00s",
  "2026-11-12 07:50:21.869517+0000  localhost testmanagerd[35283]: [com.apple.dt.xctest:Default] current: Touch up at 348.0, 808.0, offset=0.10s",
  "2026-11-12 07:50:22.791559+0000  localhost backboardd[25738]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x105f88c000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-12 07:50:23.040915+0000  localhost backboardd[25738]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x105F88C000000",
  "2026-11-12 07:50:23.042561+0000  localhost backboardd[25738]: [com.apple.BackBoard:TouchEvents] ignoring digitizer event for display <main> from unsupported service: (<BKIOHIDService: 0x10d64f180; serviceStatus: <unknown>; IOHIDService: IOHIDService name: id:0x105f88c000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:1 mask:0x800 sensorcontrols:7; senderID: 0x105F88C000000; displayUUID: 0x0; eventSource: externalAccessory; primaryUsagePage: 0x0; primaryUsage: 0x0; authenticated: NO; builtIn: NO>):+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  "2026-11-12 07:50:25.481025+0000  localhost backboardd[25738]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10d68f560; touchScreen; builtin; senderID: 0x105F88C000000; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
  "2026-11-12 07:50:28.118208+0000  localhost testmanagerd[35283]: [com.apple.dt.xctest:Default] Timed out after waiting 5.0s for TouchEventsCompleted, event will be implicitly confirmed with no error other than this log message.",
].join("\n");
// Variant A again: run 43156283059 attempt 2 (PR #70, fb80a12), tap 06:50:05.069 for 12313 ms; cancel 1405 ms after creation.
const droppedSettingsLog3 = [
  "2026-11-12 06:50:09.537037+0000  localhost testmanagerd[28983]: [com.apple.dt.xctest:Default] current: Touch down at 348.0, 808.0, offset=0.00s",
  "2026-11-12 06:50:09.537466+0000  localhost testmanagerd[28983]: [com.apple.dt.xctest:Default] current: Touch up at 348.0, 808.0, offset=0.10s",
  "2026-11-12 06:50:11.418145+0000  localhost backboardd[22218]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x103b512000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-12 06:50:12.039365+0000  localhost backboardd[22218]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x103B512000000",
  "2026-11-12 06:50:12.556629+0000  localhost backboardd[22218]: [com.apple.BackBoard:TouchEvents] ignoring digitizer event for display <main> from unsupported service: (<BKIOHIDService: 0x10b28ec80; serviceStatus: <unknown>; IOHIDService: IOHIDService name: id:0x103b512000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:1 mask:0x800 sensorcontrols:7; senderID: 0x103B512000000; displayUUID: 0x0; eventSource: externalAccessory; primaryUsagePage: 0x0; primaryUsage: 0x0; authenticated: NO; builtIn: NO>):+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  "2026-11-12 06:50:12.823804+0000  localhost backboardd[22218]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10b0ebc60; touchScreen; builtin; senderID: 0x103B512000000; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
  "2026-11-12 06:50:16.976939+0000  localhost testmanagerd[28983]: [com.apple.dt.xctest:Default] Timed out after waiting 5.0s for TouchEventsCompleted, event will be implicitly confirmed with no error other than this log message.",
].join("\n");
// Negative: run 43172075412 attempt 2, the same Settings tap delivered (08:35:14.715, 3825 ms).
// It also ends in an empty-contact disappear line, 641 ms after creation, but
// backboardd never refused the event and XCTest got its confirmation.
const deliveredSettingsLog = [
  "2026-11-12 08:35:16.759645+0000  localhost testmanagerd[39919]: [com.apple.dt.xctest:Default] current: Touch down at 348.0, 808.0, offset=0.00s",
  "2026-11-12 08:35:16.759955+0000  localhost testmanagerd[39919]: [com.apple.dt.xctest:Default] current: Touch up at 348.0, 808.0, offset=0.10s",
  "2026-11-12 08:35:17.075207+0000  localhost backboardd[28152]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x105764a000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-12 08:35:17.470821+0000  localhost backboardd[28152]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x105764A000000",
  "2026-11-12 08:35:17.482966+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] *** unknown digitizer <BKIOHIDService: 0x10cea9600; serviceStatus: <unknown>; IOHIDService: IOHIDService name: id:0x105764a000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:1 mask:0x800 sensorcontrols:7; senderID: 0x105764A000000; displayUUID: 0x0; eventSource: builtin; primaryUsagePage: 0xD; primaryUsage: 0x4; authenticated: YES; builtIn: YES> -- initializing now",
  "2026-11-12 08:35:17.716787+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10cece060; touchScreen; builtin; senderID: 0x105764A000000; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
  "2026-11-12 08:35:17.717795+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10cecc540; touchScreen; builtin; senderID: 0x105764A000000; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
].join("\n");
// Existing rule: run 43082569875 attempt 2 (rc.1, 61f3034), tap 19:56:01.770 for 4611 ms; cancel carried touching pathIndex 2.
const rc1SettingsLog = [
  "2026-11-11 19:56:04.237395+0000  localhost testmanagerd[32375]: [com.apple.dt.xctest:Default] current: Touch down at 348.0, 808.0, offset=0.00s",
  "2026-11-11 19:56:04.237537+0000  localhost testmanagerd[32375]: [com.apple.dt.xctest:Default] current: Touch up at 348.0, 808.0, offset=0.10s",
  "2026-11-11 19:56:05.706109+0000  localhost backboardd[22036]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x103b5d8000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-11 19:56:05.717060+0000  localhost backboardd[22036]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x103B5D8000000",
  "2026-11-11 19:56:05.724098+0000  localhost backboardd[22036]: [com.apple.BackBoard:TouchEvents] *** unknown digitizer <BKIOHIDService: 0x10b22ae80; serviceStatus: <unknown>; IOHIDService: IOHIDService name: id:0x103b5d8000000 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:1 mask:0x800 sensorcontrols:7; senderID: 0x103B5D8000000; displayUUID: 0x0; eventSource: builtin; primaryUsagePage: 0xD; primaryUsage: 0x4; authenticated: YES; builtIn: YES> -- initializing now",
  "2026-11-11 19:56:05.937810+0000  localhost backboardd[22036]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10b013100; touchScreen; builtin; senderID: 0x103B5D8000000; contacts: contacts: [pathIndex: 2; touchIdentifier: 1; touching; locked; destinations: ((touchStream|filterDetachedTouches); contextID: 0x6A460ABA; clientPort: 0x520B, (hitTest); contextID: 0xA0B941D5; clientPort: 0x29517; inheritedSceneHostSettings: <identifier: sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground>)]; destinations: [<BKTouchDestination: 0x10b0b2340; (hitTest); contextID: 0xA0B941D5; clientPort: 0x29517; inheritedSceneHostSettings: <identifier: sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground>; externalReferences: 1>, <BKTouchDestination: 0x10b0b2850; (hitTest); contextID: 0x44306FC6; clientPort: 0x520B; externalReferences: 1>, <BKTouchDestination: 0x10b0b18c0; (hitTest); contextID: 0xD3688F5F; clientPort: 0x520B; externalReferences: 1>]; latentSystemGestureDestinations: ()>",
  "2026-11-11 19:56:05.938338+0000  localhost backboardd[22036]: [com.apple.BackBoard:TouchEvents] canceling paths contacts: [pathIndex: 2; touchIdentifier: 1; touching; locked; destinations: ((touchStream|filterDetachedTouches); contextID: 0x6A460ABA; clientPort: 0x520B, (hitTest); contextID: 0xA0B941D5; clientPort: 0x29517; inheritedSceneHostSettings: <identifier: sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground>)] -- HID (ts:(null))",
  "2026-11-11 19:56:05.939672+0000  localhost backboardd[22036]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10b012680; touchScreen; builtin; senderID: 0x103B5D8000000; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
].join("\n");
// Variant B: run 43172075412 attempt 2, pointer swipe 08:42:47.972 for 2649 ms.
// The Recap digitizer disappears mid-stroke with touching pathIndex 2 in the app's scene.
const pointerCancelLog = [
  "2026-11-12 08:42:49.078504+0000  localhost backboardd[28152]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x1057656000015 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-12 08:42:49.098010+0000  localhost backboardd[28152]: (BackBoardHIDEventFoundation) [com.apple.BackBoard:HID] unknown senderID: 0x1057656000015",
  "2026-11-12 08:42:49.105701+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] *** unknown digitizer <BKIOHIDService: 0x10ceab380; serviceStatus: <unknown>; IOHIDService: IOHIDService name: id:0x1057656000015 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:1 mask:0x800 sensorcontrols:7; senderID: 0x1057656000015; displayUUID: 0x0; eventSource: builtin; primaryUsagePage: 0xD; primaryUsage: 0x4; authenticated: YES; builtIn: YES> -- initializing now",
  "2026-11-12 08:42:50.014351+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10ceceae0; touchScreen; builtin; senderID: 0x1057656000015; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
  "2026-11-12 08:42:50.018095+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10cecdf80; touchScreen; builtin; senderID: 0x1057656000015; contacts: contacts: [pathIndex: 2; touchIdentifier: 14; touching; locked; destinations: ((hitTest); contextID: 0xC0710E38; clientPort: 0x1FBA7; inheritedSceneHostSettings: <identifier: sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground>, (touchStream|filterDetachedTouches); contextID: 0x18979E5D; clientPort: 0x510F)]; destinations: [<BKTouchDestination: 0x10cc7b150; (hitTest); contextID: 0xF3ABE204; clientPort: 0x510F; externalReferences: 1>, <BKTouchDestination: 0x10cc798c0; (hitTest); contextID: 0x5D459C22; clientPort: 0x510F; externalReferences: 1>, <BKTouchDestination: 0x10cc79530; (hitTest); contextID: 0xC0710E38; clientPort: 0x1FBA7; inheritedSceneHostSettings: <identifier: sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground>; externalReferences: 1>]; latentSystemGestureDestinations: ()>",
  "2026-11-12 08:42:50.018200+0000  localhost backboardd[28152]: [com.apple.BackBoard:TouchEvents] canceling paths contacts: [pathIndex: 2; touchIdentifier: 14; touching; locked; destinations: ((hitTest); contextID: 0xC0710E38; clientPort: 0x1FBA7; inheritedSceneHostSettings: <identifier: sceneID:com.nyctron.instruments.example-default; touchBehavior: foreground>, (touchStream|filterDetachedTouches); contextID: 0x18979E5D; clientPort: 0x510F)] -- HID (ts:(null))",
].join("\n");
// Negative: rc.1 run 43082569875 attempt 2, pointer swipe 20:06:53.324 for 5224 ms that the app committed.
// No touching contact was cancelled.
const committedPointerLog = [
  "2026-11-11 20:06:54.546850+0000  localhost backboardd[22036]: (IOKit) [com.apple.iohid:default] Service added: IOHIDService name: id:0x103b5da000016 primaryUsagePage:0xd primaryUsage:0x4 transport:Recap locationID:recap-bus-0 reportInterval:0 batchInterval:0 events:0 mask:0x0 sensorcontrols:7",
  "2026-11-11 20:06:55.474721+0000  localhost backboardd[22036]: [com.apple.BackBoard:TouchEvents] cancel -- digitizer did disappear:<BKDirectTouchState: 0x10b26abc0; touchScreen; builtin; senderID: 0x103B5DA000016; contacts: contacts: []; destinations: []; latentSystemGestureDestinations: ()>",
].join("\n");

// Moves every line by the same offset so a real excerpt can be replayed inside another real window.
const shift = (text, ms) => text.replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.(\d{6})\+0000/gm, (_, day, time, micros) => {
  const at = new Date(Date.parse(day + "T" + time + "Z") + Number(micros.slice(0, 3)) + ms).toISOString();
  return at.slice(0, 10) + " " + at.slice(11, 19) + "." + at.slice(20, 23) + micros.slice(3) + "+0000";
});
const settingsCommands = ({ tap, assertion }) => [launch(), visible("Library"),
  command("tapOnElement", { selector: { textRegex: "Settings", optional: false }, retryIfNoChange: false, waitUntilVisible: false, longPress: false, optional: false },
    "COMPLETED", { sequenceNumber: 4, ...tap }),
  visible("Workspace preferences", "FAILED", { sequenceNumber: 5, ...assertion,
    error: { message: 'Assertion is false: "Workspace preferences" is visible' },
    artifacts: [{ type: "SCREEN_HIERARCHY", path: "screen-hierarchy/step-006-assertCondition-Workspace_preferences.json" },
      { type: "SCREENSHOT", path: "screenshots/step-006-assertCondition-Workspace_preferences.png" }] })];
const node = attributes => ({ attributes, children: [] });
const tree = nodes => ({ attributes: {}, children: [{ attributes: { accessibilityText: "NYC-Tron Instruments Demo" }, children: nodes.map(node) }] });
// The failed assertion's hierarchy in all three Variant A attempts: still on Library, no Settings panel.
const libraryScreen = () => ({ path: "screen-hierarchy/step-006-assertCondition-Workspace_preferences.json", tree: tree([
  { "resource-id": "reference-route-host" }, { "resource-id": "reference-panel-library" }, { "resource-id": "reference-library" },
  { accessibilityText: "Library" }, { accessibilityText: "Find a study, keep it close, and pick up where you left off." },
  { accessibilityText: "Library" }, { accessibilityText: "Editor" }, { accessibilityText: "Media" }, { accessibilityText: "Settings" }]) });
// What a landed tap shows instead (from that run's passing settings-hierarchy.json).
const settingsScreen = () => ({ path: libraryScreen().path, tree: tree([
  { "resource-id": "reference-route-host" }, { "resource-id": "reference-panel-settings" }, { "resource-id": "reference-settings" },
  { accessibilityText: "Library" }, { accessibilityText: "Editor" }, { accessibilityText: "Media" }, { accessibilityText: "Settings" }]) });
const dropped = (log = droppedSettingsLog, timing = { tap: { timestamp: 1794460193121, duration: 9382 }, assertion: { timestamp: 1794460202510, duration: 17641 } }) =>
  ({ platform: "ios", flow: "settings", appId, deviceId: "FCC5F673-7BEC-4A7D-8F2A-4DC35E2668EC",
    commands: settingsCommands(timing), simulatorLog: log, failureHierarchy: libraryScreen() });

test("Variant A: a refused, contactless Recap tap recovers only with the pre-tap Library route in the app's tree", () => {
  const evidence = classify(dropped());
  assert.equal(evidence.kind, "ios-initial-navigation-recap-dropped");
  assert.equal(evidence.senderId, "0x10135c2000000");
  assert.equal(evidence.createdToCancelledMs, 1581);
  assert.deepEqual(evidence.screen, { hierarchy: "screen-hierarchy/step-006-assertCondition-Workspace_preferences.json",
    routePanel: "reference-panel-library", destinationVisible: false });
  for (const line of Object.values(evidence.evidence)) assert.ok(line.at >= evidence.tap.start && line.at <= evidence.tap.end);
  const second = classify(dropped(droppedSettingsLog2, { tap: { timestamp: 1794469818719, duration: 11915 }, assertion: { timestamp: 1794469830634 } }));
  assert.equal(second.kind, "ios-initial-navigation-recap-dropped");
  assert.equal(second.createdToCancelledMs, 2690);
  const third = classify(dropped(droppedSettingsLog3, { tap: { timestamp: 1794466205069, duration: 12313 }, assertion: { timestamp: 1794466217385 } }));
  assert.equal(third.kind, "ios-initial-navigation-recap-dropped");
  assert.equal(third.createdToCancelledMs, 1405);
  assert.ok(Math.max(1581, 2690, 1405) < recapConfirmationIntervalMs);
});

test("Variant A needs every piece of evidence; each one missing or contradicted refuses recovery", () => {
  const log = mutate => ({ ...dropped(), simulatorLog: mutate(droppedSettingsLog) });
  for (const input of [
    log(text => text.split("\n").filter(line => !line.includes("Service added")).join("\n")),
    log(text => text.split("\n").filter(line => !line.includes("unknown senderID")).join("\n")),
    log(text => text.split("\n").filter(line => !line.includes("unsupported service")).join("\n")),
    log(text => text.split("\n").filter(line => !line.includes("digitizer did disappear")).join("\n")),
    log(text => text.split("\n").filter(line => !line.includes("TouchEventsCompleted")).join("\n")),
    log(text => text.replace("transport:Recap", "transport:USB")),
    log(text => text.replace("unknown senderID: 0x10135C2000000", "unknown senderID: 0x222")),
    log(text => text.replace("senderID: 0x10135C2000000; contacts", "senderID: 0x222; contacts")),
    // Cancelled after XCTest's 5.0 s confirmation interval: not this race.
    log(text => text.replace("05:09:57.945980", "05:10:01.500000")),
    // A second Recap digitizer in the same tap is ambiguous.
    log(text => text + "\n" + text.split("\n").find(line => line.includes("Service added")).replace("0x10135c2000000", "0x10135c2000001")),
    // Outside the tap window.
    log(text => text.replaceAll("2026-11-12 05:09:5", "2026-11-12 05:08:5")),
    { ...dropped(), failureHierarchy: undefined },
    { ...dropped(), failureHierarchy: settingsScreen() },
    { ...dropped(), failureHierarchy: { ...libraryScreen(), path: "screen-hierarchy/step-005-assertCondition-Library.json" } },
    { ...dropped(), failureHierarchy: { ...libraryScreen(), tree: tree([{ "resource-id": "reference-panel-library" }, { "resource-id": "reference-panel-settings" }, { accessibilityText: "Settings" }]) } },
    { ...dropped(), failureHierarchy: { ...libraryScreen(), tree: tree([{ "resource-id": "reference-panel-library" }, { accessibilityText: "Settings" }, { accessibilityText: "Workspace preferences" }]) } },
    { ...dropped(), flow: "editor" },
    { ...dropped(), platform: "android" },
  ]) assert.equal(classify(input), null);
});

test("Variant A is Settings only: the same evidence on the Editor tab is refused", () => {
  // Editor's first tab tap, shaped as in the 43046836104 excerpt above, carrying Variant A's dropped-tap
  // log lines moved into its window and a tree that still shows the pre-tap route (Settings).
  const log = shift(droppedSettingsLog, 1794411799539 - 1794460193121);
  const tapped = editorCommands();
  // Same tap length as the Settings tap whose lines these are, so every line sits inside the window.
  tapped[1].metadata.duration = 9382;
  tapped[2].metadata.timestamp = tapped[1].metadata.timestamp + 9382;
  tapped[2].metadata.artifacts = [{ type: "SCREEN_HIERARCHY", path: libraryScreen().path }];
  const input = { ...editor(), commands: tapped, simulatorLog: log,
    failureHierarchy: { path: libraryScreen().path, tree: tree([{ "resource-id": "reference-panel-settings" }, { accessibilityText: "Editor" }]) } };
  assert.equal(classify(input), null);
  // The same lines on Settings still classify, so the refusal is the flow and nothing else.
  assert.equal(classify(dropped()).kind, "ios-initial-navigation-recap-dropped");
  // Editor keeps its touching-contact rule.
  assert.equal(classify(editor()).kind, "ios-initial-navigation-recap-cancelled");
});

test("negative: a delivered tap's empty-contact teardown is not a lost touch, whatever the assertion says", () => {
  const delivered = dropped(deliveredSettingsLog, { tap: { timestamp: 1794472514715, duration: 3825 }, assertion: { timestamp: 1794472518543 } });
  assert.equal(classify(delivered), null);
  assert.equal(classify({ ...delivered, failureHierarchy: settingsScreen() }), null);
});

test("negative: an app-side failure with no Recap cancel is never recoverable", () => {
  // The app reached Settings and rendered the wrong heading: the tree proves the tap landed.
  assert.equal(classify({ ...dropped(), failureHierarchy: settingsScreen() }), null);
  const noRecap = droppedSettingsLog.split("\n").filter(line => !/backboardd/.test(line)).join("\n");
  assert.equal(classify({ ...dropped(), simulatorLog: noRecap }), null);
  // rc.1's committed stroke, replayed so its Recap digitizer sits where Variant B's did (08:42:49.078).
  const committed = shift(committedPointerLog, Date.parse("2026-11-12T08:42:49.078Z") - Date.parse("2026-11-11T20:06:54.546Z"));
  assert.match(committed, /2026-11-12 08:42:49\.078850\+0000/);
  assert.equal(classify({ ...pointer(), simulatorLog: committed }), null);
  assert.equal(classify({ ...pointer(), simulatorLog: committed, failureHierarchy: pointerScreen("Committed strokes: 2. Cancelled strokes: 0. Prediction samples: 0.", "Input source: touch. Last event: up.") }), null);
  assert.equal(classify({ ...pointer(), simulatorLog: "" }), null);
});

test("negative: a touching-contact cancel stays on the existing rule and never satisfies Variant A", () => {
  const rc1 = dropped(rc1SettingsLog, { tap: { timestamp: 1794426961770, duration: 4611 }, assertion: { timestamp: 1794426966382 } });
  const evidence = classify(rc1);
  assert.equal(evidence.kind, "ios-initial-navigation-recap-cancelled");
  assert.equal(evidence.pathIndex, 2);
  // The existing rule does not depend on the tree, and a tree cannot turn a touching cancel into Variant A.
  assert.equal(classify({ ...rc1, failureHierarchy: undefined }).kind, "ios-initial-navigation-recap-cancelled");
  // A touching cancel whose canceling-paths line is missing is unproven on both rules.
  assert.equal(classify({ ...rc1, simulatorLog: rc1SettingsLog.split("\n").filter(line => !line.includes("canceling paths")).join("\n") }), null);
  // The pointer stroke's touching cancel, moved into the Settings tap window, is not a dropped tap either.
  const moved = shift(pointerCancelLog, Date.parse("2026-11-12T05:09:56.364Z") - Date.parse("2026-11-12T08:42:49.078Z"));
  assert.match(moved, /2026-11-12 05:09:56\.364504\+0000/);
  assert.equal(classify({ ...dropped(), simulatorLog: moved }).kind, "ios-initial-navigation-recap-cancelled");
  // Mixed with Variant A's own lines, the touching contact still decides the rule: Variant A never claims it.
  const mixed = classify({ ...dropped(), simulatorLog: droppedSettingsLog + "\n" + moved });
  assert.equal(mixed.kind, "ios-initial-navigation-recap-cancelled");
  assert.equal(mixed.senderId, "0x1057656000015");
});

// Real commands from that attempt, plus the heading tap the flow now makes before the
// idle assertion (sequence 4 here, so later sequence numbers move up by one).
const pointerCommands = () => [launch(), command("assertConditionCommand", { condition: { visible: { textRegex: "Input drawing surface", optional: false } }, timeout: "90000", optional: false },
  "COMPLETED", { sequenceNumber: 3, timestamp: 1794472960375, duration: 7214 }),
  command("tapOnElement", { selector: { textRegex: "Pointer input", optional: false }, retryIfNoChange: false, waitUntilVisible: false, longPress: false, optional: false },
    "COMPLETED", { sequenceNumber: 4, timestamp: 1794472967589, duration: 1 }),
  visible("Committed strokes: 0. Cancelled strokes: 0. Prediction samples: 0.", "COMPLETED", { sequenceNumber: 5, timestamp: 1794472967591, duration: 381 }),
  command("swipeCommand", { direction: "RIGHT", elementSelector: { textRegex: "Input drawing surface", optional: false }, duration: 700, relativePoint: "25%, 50%", optional: false },
    "COMPLETED", { sequenceNumber: 6, timestamp: 1794472967972, duration: 2649 }),
  visible("Committed strokes: 1. Cancelled strokes: 0. Prediction samples: 0.", "FAILED", { sequenceNumber: 7, timestamp: 1794472970624, duration: 18204,
    error: { message: 'Assertion is false: "Committed strokes: 1. Cancelled strokes: 0. Prediction samples: 0." is visible' },
    artifacts: [{ type: "SCREEN_HIERARCHY", path: "screen-hierarchy/step-008-assertCondition-Committed_strokes_1._Can.json" }] })];
const pointerScreen = (summary = "Committed strokes: 0. Cancelled strokes: 1. Prediction samples: 0.", last = "Input source: touch. Last event: cancel.") =>
  ({ path: "screen-hierarchy/step-008-assertCondition-Committed_strokes_1._Can.json", tree: tree([{ "resource-id": "pointer-demo" },
    { "resource-id": "pointer-summary", accessibilityText: summary }, { accessibilityText: summary },
    { "resource-id": "pointer-last-event", accessibilityText: last }, { accessibilityText: last }, { "resource-id": "pointer-surface" }]) });
function pointer() {
  return { platform: "ios", flow: "pointer", appId, deviceId: "FCC5F673-7BEC-4A7D-8F2A-4DC35E2668EC",
    commands: pointerCommands(), simulatorLog: pointerCancelLog, failureHierarchy: pointerScreen() };
}

test("Variant B: a stroke the OS cancelled through Recap mid-swipe, and the app counted as cancelled, recovers once", () => {
  const evidence = classify(pointer());
  assert.equal(evidence.kind, "ios-pointer-stroke-recap-cancelled");
  assert.equal(evidence.senderId, "0x1057656000015");
  assert.equal(evidence.pathIndex, 2);
  assert.deepEqual(evidence.stroke, { start: 1794472967972, end: 1794472970621, sequence: 6 });
  for (const line of Object.values(evidence.evidence)) assert.ok(line.at >= evidence.stroke.start && line.at <= evidence.stroke.end);
});

test("Variant B refuses app-side stroke failures, unproven cancels and any other command shape", () => {
  for (const change of [
    input => { input.failureHierarchy = pointerScreen("Committed strokes: 0. Cancelled strokes: 0. Prediction samples: 0.", "Input source: touch. Last event: up."); },
    input => { input.failureHierarchy = pointerScreen("Committed strokes: 2. Cancelled strokes: 0. Prediction samples: 0.", "Input source: touch. Last event: up."); },
    input => { input.failureHierarchy = pointerScreen("Committed strokes: 1. Cancelled strokes: 1. Prediction samples: 0."); },
    input => { input.failureHierarchy = pointerScreen(undefined, "Input source: mouse. Last event: cancel."); },
    input => { input.failureHierarchy = undefined; },
    input => { input.simulatorLog = pointerCancelLog.split("\n").filter(line => !line.includes("touching;") || line.includes("canceling")).join("\n"); },
    input => { input.simulatorLog = pointerCancelLog.split("\n").filter(line => !line.includes("canceling paths")).join("\n"); },
    input => { input.simulatorLog = pointerCancelLog.replaceAll("sceneID:" + appId + "-default", "sceneID:com.other.app-default"); },
    input => { input.simulatorLog = pointerCancelLog.replace("transport:Recap", "transport:USB"); },
    input => { input.simulatorLog = pointerCancelLog.replaceAll("08:42:50.", "08:42:51."); },
    input => { input.commands[4].metadata.timestamp += 5000; },
    input => { input.commands[4].command.swipeCommand.direction = "LEFT"; },
    input => { input.commands[4].command.swipeCommand.duration = 2000; },
    input => { input.commands[5] = visible("Input source: touch. Last event: up.", "FAILED", input.commands[5].metadata); },
    input => { input.commands.splice(5, 0, visible("Pointer input")); },
    input => { input.commands[3].metadata.status = "FAILED"; },
    // Without the heading tap, or with it aimed at the drawing surface, the shape no longer matches the flow.
    input => { input.commands.splice(2, 1); },
    input => { input.commands[2].command.tapOnElement.selector.textRegex = "Input drawing surface"; },
    input => { input.commands[2].command.tapOnElement.longPress = true; },
    input => { input.flow = "settings"; },
    input => { input.platform = "android"; },
  ]) { const input = pointer(); change(input); assert.equal(classify(input), null); }
  // The rc.1 Settings touching cancel is a different command path and cannot satisfy the stroke rule.
  assert.equal(classify({ ...pointer(), simulatorLog: rc1SettingsLog }), null);
});

test("Pointer retention keeps its own directory and receipt beside Settings and Editor", t => {
  const output = mkdtempSync(join(tmpdir(), "native-ui-recovery-"));
  t.after(() => rmSync(output, { recursive: true, force: true }));
  mkdirSync(join(output, "pointer", "artifacts"), { recursive: true });
  writeFileSync(join(output, "pointer", "report.xml"), '<testcase status="ERROR"/>');
  writeFileSync(join(output, "pointer-maestro.log"), "[Failed] Native pointer touch lifecycle\n");
  const retained = retain({ output, flow: "pointer", eligibility: classify(pointer()), error: new Error("original"),
    sourceCommit: "2".repeat(40), nativeArtifact: { kind: "ios-app", sha256: "1".repeat(64) } });
  assert.equal(retained.file, "pointer-transport-recovery.json");
  assert.equal(retained.kind, "ios-pointer-stroke-recap-cancelled");
  assert.equal(retained.retainedDirectory, "pointer-initial-transport-failure");
  assert.match(readFileSync(join(output, "pointer-initial-transport-failure", "maestro-command.log"), "utf8"), /Failed/);
});

test("the hierarchy capture outlives Maestro's own pinned driver startup budget", () => {
  assert.equal(maestroSessionLimits.driverStartupMs, 180000);
  // JVM start, runner install and the dump itself took up to 55 s before the driver budget began.
  assert.ok(maestroSessionLimits.hierarchyTimeoutMs >= maestroSessionLimits.driverStartupMs + 60000);
  assert.deepEqual(recoverableUiFlows, ["settings", "editor", "pointer"]);
});
