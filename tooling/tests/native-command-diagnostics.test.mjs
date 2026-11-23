import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { commandFailureDetail } from "../native/command-diagnostics.mjs";

test("nonzero status remains visible with empty CLI streams", () => {
  assert.equal(commandFailureDetail({status: 1, stderr: "", stdout: ""}), "status=1\nsignal=none");
});
test("stdout-only transport error survives empty stderr", () => {
  assert.match(commandFailureDetail({status: 1, stderr: "", stdout: "device offline"}), /stdout: device offline/);
});
test("stderr and stdout are retained independently", () => {
  const result = commandFailureDetail({status: 2, stderr: "driver error", stdout: "flow FAILED"});
  assert.match(result, /stderr: driver error/);
  assert.match(result, /stdout: flow FAILED/);
});
test("timeout error and termination signal remain explicit", () => {
  assert.match(commandFailureDetail({status: null, signal: "SIGTERM", error: new Error("spawnSync ETIMEDOUT")}), /status=null\nsignal=SIGTERM\nerror=spawnSync ETIMEDOUT/);
});
test("stream tails are bounded and retain the useful final error", () => {
  const result = commandFailureDetail({status: 1, stdout: "x".repeat(10000) + "FINAL", stderr: "y".repeat(10000)});
  assert.ok(result.length < 8100);
  assert.ok(result.endsWith("FINAL"));
});
test("acceptance wrapper uses diagnostics and records process signal", () => {
  const source = readFileSync(new URL("../native/run-ui-acceptance.mjs", import.meta.url), "utf8");
  assert.match(source, /commandFailureDetail\(result\)/);
  assert.match(source, /signal: result.signal/);
});
