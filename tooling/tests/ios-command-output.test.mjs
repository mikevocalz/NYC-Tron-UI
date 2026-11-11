import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  IOS_COMMAND_LIMITS, readIOSCommandFile, projectIOSCommands, projectIOSJUnit,
  collectIOSCommandOutput, encodeIOSCommandEnvelope, reportIOSCommandOutput,
} from "../native/report-ios-command-output.mjs";

const ROOT = "/owned-consumer";
const digest = value => createHash("sha256").update(value).digest("hex");
const entry = (status, command, sequence = 1) => ({
  metadata: { status, sequenceNumber: sequence, error: { message: "PRIVATE_ERROR" } }, command,
});
const failed = entry("FAILED", { assertConditionCommand: { condition: {
  visible: { textRegex: "Workspace preferences" },
} } });
const junit = '<testsuites><testsuite name="PRIVATE_NAME"><testcase status="FAILED" classname="PRIVATE_CLASS"><failure message="PRIVATE_MESSAGE"><![CDATA[<testcase status="SUCCESS"/>]]></failure></testcase></testsuite></testsuites>';

function memoryIO(initial = {}, options = {}) {
  const files = new Map(), handles = new Map();
  let serial = 1, nextFd = 10;
  const counts = { opens: 0, closes: 0, reads: 0, readBytes: 0, writes: 0, directoryReads: 0, directoryCloses: 0 };
  const normalize = path => path.replace(/\\/g, "/");
  const parent = value => { const path = normalize(value); return path.slice(0, path.lastIndexOf("/")) || "/"; };
  function put(path, value, type = "file") {
    path = normalize(path);
    if (path !== "/" && !files.has(parent(path))) put(parent(path), null, "directory");
    files.set(path, { type, bytes: type === "file" ? Buffer.from(value ?? "") : Buffer.alloc(0), ino: serial++, version: 1 });
  }
  put("/", null, "directory"); put(ROOT, null, "directory"); put(ROOT + "/ios-command-output", null, "directory");
  for (const [path, value] of Object.entries(initial)) put(path, value);
  const fail = code => { const error = new Error("PRIVATE_IO"); error.code = code; throw error; };
  const node = path => files.get(normalize(path)) ?? fail("ENOENT");
  const stat = value => ({
    dev: 1n, ino: BigInt(value.ino), size: BigInt(value.bytes.length),
    mtimeNs: BigInt(value.version), ctimeNs: BigInt(value.version),
    isFile: () => value.type === "file", isDirectory: () => value.type === "directory",
    isSymbolicLink: () => value.type === "symlink",
  });
  const io = {
    constants: { O_RDONLY: 0, O_WRONLY: 1, O_CREAT: 64, O_EXCL: 128, O_NOFOLLOW: 256 },
    realpathSync: path => normalize(path),
    lstatSync: path => stat(node(path)),
    openSync(path, flags) {
      path = normalize(path);
      counts.opens++;
      if (options.openError) fail(options.openError);
      if (flags & 64) {
        if (files.has(path)) fail("EEXIST");
        if (node(parent(path)).type !== "directory") fail("ENOTDIR");
        put(path, "");
      }
      const value = node(path);
      if (value.type === "symlink") fail("ELOOP");
      const fd = nextFd++; handles.set(fd, { value, path, position: 0 }); return fd;
    },
    fstatSync(fd) { const value = handles.get(fd); if (!value) fail("EBADF"); return stat(value.value); },
    readSync(fd, buffer, offset, length) {
      counts.reads++;
      if (options.readError) fail(options.readError);
      const handle = handles.get(fd); if (!handle) fail("EBADF");
      const amount = Math.min(length, handle.value.bytes.length - handle.position);
      buffer.set(handle.value.bytes.subarray(handle.position, handle.position + amount), offset);
      handle.position += amount; counts.readBytes += amount;
      if (options.changeDuringRead) handle.value.version++;
      return amount;
    },
    closeSync(fd) {
      counts.closes++; if (!handles.delete(fd)) fail("EBADF");
      if (options.closeError) fail("EIO");
    },
    writeFileSync(fd, bytes) {
      counts.writes++;
      if (options.writeError) fail("EIO");
      const handle = handles.get(fd); if (!handle) fail("EBADF");
      handle.value.bytes = Buffer.from(bytes); handle.value.version++;
    },
    fsyncSync() { if (options.flushError) fail("EIO"); },
    opendirSync(path) {
      path = normalize(path);
      if (node(path).type !== "directory") fail("ENOTDIR");
      const rows = [...files].filter(([key]) => key !== path && parent(key) === path).map(([key, value]) => ({
        name: key.slice(key.lastIndexOf("/") + 1), isDirectory: () => value.type === "directory",
        isFile: () => value.type === "file", isSymbolicLink: () => value.type === "symlink",
      }));
      let index = 0;
      return { readSync() { counts.directoryReads++; return rows[index++] ?? null; },
        closeSync() { counts.directoryCloses++; if (options.directoryCloseError) fail("EIO"); } };
    },
  };
  return { io, counts, put, files, read: path => Buffer.from(node(path).bytes) };
}
function uiFixture(options) {
  return memoryIO({
    [ROOT + "/ios-command-output/ui-stdout.log"]: Buffer.from([0, 255, 10]),
    [ROOT + "/ios-command-output/ui-stderr.log"]: "PRIVATE_WRAPPER_STACK",
    [ROOT + "/runtime-ui-ios/settings/report.xml"]: junit,
    [ROOT + "/runtime-ui-ios/settings/debug/session/commands.json"]: JSON.stringify([failed]),
  }, options);
}

test("iOS reporter validates CLI facts without inferring launch, workflow status or signal", () => {
  const mock = memoryIO({ "/tmp/xcodebuild.log": "abc", [ROOT + "/ios-command-output/build-stderr.log"]: "" });
  for (const status of ["0", "65", "137", "255"]) {
    const report = collectIOSCommandOutput("build", status, ROOT, mock.io);
    assert.equal(report.shellExitStatus, Number(status));
    assert.equal(report.statusScope, "capture-setup-or-command-or-redirection-result");
    assert.equal(report.commandExecution, "not-established");
    assert.equal(report.workflowStepStatus, "not-observed");
    assert.equal(report.nativeSignal, null);
    assert.equal(report.inputFreshness, "not-established-by-reporter");
  }
  for (const args of [["ios", "1", ROOT], ["ui", "-1", ROOT], ["ui", "256", ROOT], ["ui", "01", ROOT], ["ui", "1", "relative"]]) {
    const before = mock.counts.opens;
    const report = collectIOSCommandOutput(...args, mock.io);
    assert.equal(report.status, "invalid-arguments"); assert.equal(report.shellExitStatus, null);
    assert.equal(mock.counts.opens, before);
  }
  const before = mock.counts.opens;
  reportIOSCommandOutput(["ui", "1", ROOT, "EXTRA"], { io: mock.io, emit() {} });
  assert.equal(mock.counts.opens, before);
});

test("closed raw byte reads preserve exact-limit EOF and a known independent SHA", () => {
  const mock = memoryIO({ "/tmp/xcodebuild.log": "abc", [ROOT + "/binary"]: Buffer.from([0, 255, 10]) });
  const result = readIOSCommandFile("/tmp/xcodebuild.log", 3, mock.io);
  assert.equal(result.observation.status, "complete");
  assert.equal(result.observation.bytesRead, 3);
  assert.equal(result.observation.hashedBytes, 3);
  assert.equal(result.observation.sha256, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(result.observation.hashScope, "complete-file");
  assert.deepEqual(result.content, Buffer.from("abc"));
  const binary = readIOSCommandFile(ROOT + "/binary", 3, mock.io);
  assert.deepEqual(binary.content, Buffer.from([0, 255, 10]));
  assert.equal(binary.observation.sha256, digest(Buffer.from([0, 255, 10])));
  assert.notEqual(binary.observation.sha256, digest(binary.content.toString("utf8")));
  assert.equal(mock.counts.closes, 2);
});

test("over-limit, changed, denied, symlink and close-failed inputs never claim a complete hash", () => {
  const mock = memoryIO({ "/tmp/xcodebuild.log": "abcd" });
  const over = readIOSCommandFile("/tmp/xcodebuild.log", 3, mock.io);
  assert.equal(over.observation.status, "over-limit"); assert.equal(over.observation.bytesRead, 4);
  assert.equal(over.observation.hashedBytes, 3);
  assert.equal(over.observation.hashScope, "bounded-prefix"); assert.equal(over.content, null);
  assert.equal(over.observation.sha256, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  for (const [options, status] of [[{ changeDuringRead: true }, "changed"], [{ openError: "EACCES" }, "denied"], [{ readError: "EIO" }, "io-error"], [{ closeError: true }, "close-failed"]]) {
    const fixture = memoryIO({ "/tmp/xcodebuild.log": "abc" }, options);
    const result = readIOSCommandFile("/tmp/xcodebuild.log", 3, fixture.io);
    assert.equal(result.observation.status, status); assert.equal(result.observation.complete, false);
    assert.equal(result.content, null); assert.notEqual(result.observation.hashScope, "complete-file");
    assert.equal(result.observation.hashedBytes, options.changeDuringRead ? 3 : null);
    if (!options.openError) assert.equal(fixture.counts.closes, 1);
  }
  mock.put(ROOT + "/link", null, "symlink");
  assert.equal(readIOSCommandFile(ROOT + "/link", 3, mock.io).observation.status, "symlink");
  assert.equal(readIOSCommandFile(ROOT + "/missing", 3, mock.io).observation.status, "missing");
});

test("command projection keeps fixed assertion facts, unknowns, limits and private text separation", () => {
  const value = projectIOSCommands([entry("COMPLETED", { launchAppCommand: { appId: "PRIVATE_APP" } }, 0), failed]);
  assert.equal(value.statusCounts.completed, 1); assert.equal(value.statusCounts.failed, 1);
  assert.equal(value.firstFailed.command, "assert-condition");
  assert.equal(value.firstFailed.condition, "visible");
  assert.deepEqual(value.firstFailed.target, { text: "workspace-preferences", id: null, optional: null });
  assert.ok(!JSON.stringify(value).includes("PRIVATE"));
  const unknown = projectIOSCommands([entry("FAILED", { assertConditionCommand: { condition: { visible: { textRegex: "PRIVATE_INPUT", idRegex: "PRIVATE_ID" } } } }, Number.MAX_SAFE_INTEGER + 1)]);
  assert.equal(unknown.firstFailed.sequence, null); assert.equal(unknown.firstFailed.target.text, null);
  assert.equal(unknown.firstFailed.target.id, null);
  const getter = {}; Object.defineProperty(getter, "metadata", { enumerable: true, get() { throw new Error("getter invoked"); } });
  assert.equal(projectIOSCommands([getter]).statusCounts.unknown, 1);
  const bounded = projectIOSCommands([...Array(IOS_COMMAND_LIMITS.commandRecords).fill(entry("COMPLETED", {})), failed]);
  assert.equal(bounded.status, "prefix-only"); assert.equal(bounded.omitted, 1); assert.equal(bounded.firstFailed, null);
  assert.equal(projectIOSCommands({}).records, null);
});

test("JUnit projection counts structure while ignoring names/messages/CDATA and refusing malformed input", () => {
  const result = projectIOSJUnit(junit);
  assert.equal(result.status, "observed-structure"); assert.equal(result.testCases, 1);
  assert.equal(result.failureElements, 1); assert.equal(result.successfulStatusCases, 0);
  assert.ok(!JSON.stringify(result).includes("PRIVATE"));
  const passed = projectIOSJUnit('<testsuites><testsuite><testcase status="SUCCESS"/></testsuite></testsuites>');
  assert.equal(passed.successfulStatusCases, 1);
  for (const invalid of [junit.slice(0, -8), '<!DOCTYPE x [<!ENTITY secret SYSTEM "file:///PRIVATE">]>' + junit,
    '<testsuite><testcase status="SUCCESS" status="FAILED"/></testsuite>', '<testsuite><testcase></testsuite>']) {
    assert.equal(projectIOSJUnit(invalid).testCases, null);
  }
  assert.equal(projectIOSJUnit("<testsuite>" + "<properties>".repeat(25) + "</properties>".repeat(25) + "</testsuite>").status, "depth-limit");
});

test("fixed flow discovery refuses duplicate, symlink, depth-limited and entry-limited command inputs", () => {
  const base = uiFixture();
  let report = collectIOSCommandOutput("ui", "1", ROOT, base.io);
  assert.deepEqual(report.flows.map(flow => flow.flow), ["settings", "settings-retry", "editor", "pointer"]);
  assert.equal(report.flows[0].commands.discovery.status, "unique");
  assert.equal(report.flows[0].commands.projection.firstFailed.target.text, "workspace-preferences");
  assert.equal(report.flows[1].commands.projection, null);
  base.put(ROOT + "/runtime-ui-ios/settings/second/commands.json", "[]");
  report = collectIOSCommandOutput("ui", "1", ROOT, base.io);
  assert.equal(report.flows[0].commands.discovery.status, "ambiguous");
  assert.equal(report.flows[0].commands.projection, null);
  for (const reason of ["symlink", "depth", "entries"]) {
    const fixture = uiFixture();
    if (reason === "symlink") fixture.put(ROOT + "/runtime-ui-ios/settings/link", null, "symlink");
    if (reason === "depth") fixture.put(ROOT + "/runtime-ui-ios/settings/a/b/c/d/e/f/commands.json", "[]");
    if (reason === "entries") for (let i = 0; i < 130; i++) fixture.put(ROOT + "/runtime-ui-ios/settings/file" + i, "");
    const observation = collectIOSCommandOutput("ui", "1", ROOT, fixture.io).flows[0];
    assert.equal(observation.commands.discovery.status, "incomplete-search");
    assert.equal(observation.commands.projection, null);
    assert.ok(observation.commands.discovery.visitedEntries <= IOS_COMMAND_LIMITS.directoryEntries + 1);
  }
});

test("exclusive summaries hash actual readback and reporter errors cannot alter the supplied result", () => {
  const mock = uiFixture(), original = mock.read(ROOT + "/ios-command-output/ui-stdout.log");
  const outputs = [], beforeExitCode = process.exitCode;
  const first = reportIOSCommandOutput(["ui", "65", ROOT], { io: mock.io, emit: value => outputs.push(value) });
  assert.equal(first.receipt.status, "retained");
  const bytes = mock.read(ROOT + "/ios-command-output/ui-summary.json");
  assert.equal(first.receipt.sha256, digest(bytes)); assert.equal(first.receipt.bytes, bytes.length);
  assert.deepEqual(mock.read(ROOT + "/ios-command-output/ui-stdout.log"), original);
  const second = reportIOSCommandOutput(["ui", "65", ROOT], { io: mock.io, emit: value => outputs.push(value) });
  assert.equal(second.receipt.status, "already-exists"); assert.equal(second.receipt.sha256, null);
  assert.deepEqual(mock.read(ROOT + "/ios-command-output/ui-summary.json"), bytes);
  for (const options of [{ writeError: true }, { flushError: true }, { closeError: true }]) {
    const fixture = uiFixture(options);
    const result = reportIOSCommandOutput(["ui", "65", ROOT], { io: fixture.io, emit() { throw new Error("PRIVATE_STDOUT"); } });
    assert.equal(result.report.shellExitStatus, 65); assert.equal(result.emitted, false);
    assert.notEqual(result.receipt.status, "retained");
  }
  assert.equal(process.exitCode, beforeExitCode);
  for (const output of outputs) assert.ok(!output.includes("PRIVATE"));
});

test("complete console envelopes obey the byte budget and oversized summaries stay valid with omissions", () => {
  const mock = uiFixture(), outputs = [];
  reportIOSCommandOutput(["ui", "1", ROOT], { io: mock.io, emit: value => outputs.push(value) });
  const output = outputs[0];
  assert.ok(output.startsWith("NYC_TRON_IOS_COMMAND_OUTPUT_BEGIN\n"));
  assert.ok(output.endsWith("\nNYC_TRON_IOS_COMMAND_OUTPUT_END\n"));
  assert.ok(Buffer.byteLength(output) <= 8192);
  const parsed = JSON.parse(output.split("\n")[1]); assert.equal(parsed.summary.phase, "ui");
  const report = collectIOSCommandOutput("ui", "1", ROOT, mock.io);
  report.flows = Array(20).fill(report.flows[0]);
  const bounded = encodeIOSCommandEnvelope(report, { status: "not-retained", bytes: null, sha256: null, hashScope: "none" });
  assert.ok(Buffer.byteLength(bounded) <= 8192);
  const small = JSON.parse(bounded.split("\n")[1]);
  assert.equal(small.summary.status, "console-byte-limit");
  assert.equal(small.summary.observationsOmitted, true); assert.equal(small.summary.flowRowsOmitted, 20);
});
