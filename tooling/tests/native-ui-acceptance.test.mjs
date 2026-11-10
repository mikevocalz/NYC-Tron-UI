import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { MAESTRO, nativeElementCenter, parseHierarchy, requirePassedFlow, requireSemanticLabels } from "../native/ui-evidence.mjs";

const report = '<testsuites><testsuite name="Native UI" tests="1" failures="0"><testcase name="Settings" status="SUCCESS"/></testsuite></testsuites>';
const tree = () => ({ attributes: {}, children: [
  { attributes: { "resource-id": "reference-workspace-name", text: "Native UI workspace", accessibilityText: "Workspace name", bounds: "[20,100][380,160]" }, children: [] },
  { attributes: { accessibilityText: "Input drawing surface", bounds: "[20,180][380,460]" }, children: [] },
  { attributes: { text: "Input source: touch. Last event: up." }, children: [] },
] });

test("native UI evidence rejects empty, skipped, failed and truncated driver reports", () => {
  assert.deepEqual(requirePassedFlow(report), { executed: 1, failures: 0, skipped: 0 });
  for (const value of ["", '<testsuites><testsuite tests="0" failures="0"/></testsuites>',
    report.replace('status="SUCCESS"', 'status="SKIPPED"'),
    report.replace('failures="0"', 'failures="1"'),
    report.replace('/></testsuite>', '><failure>Could not tap</failure></testcase></testsuite>'),
    report.replace('</testsuite>', '<testcase status="SUCCESS"/></testsuite>'),
    report.replace('</testsuites>', '')]) {
    assert.throws(() => requirePassedFlow(value), /executed passing flow/);
  }
});

test("semantic proof comes from a real populated hierarchy with the requested labels", () => {
  const value = parseHierarchy("Driver startup\n" + JSON.stringify(tree()));
  requireSemanticLabels(value, ["Workspace name", "Native UI workspace", "Input drawing surface"]);
  assert.throws(() => requireSemanticLabels(value, ["Cover headline"]), /lacks Cover headline/);
  assert.throws(() => parseHierarchy("No device"), /hierarchy is missing/);
  assert.throws(() => parseHierarchy('{"attributes":{},"children":[null]}'), /Invalid native accessibility tree/);
});

test("native touch coordinates must come from valid observed accessibility bounds", () => {
  assert.deepEqual(nativeElementCenter(tree(), "Input drawing surface"), { x: 200, y: 320 });
  for (const bounds of [undefined, "[0,0][0,0]", "[-1,0][100,100]", "20,180,380,460", "[380,180][20,460]"]) {
    const value = tree(); value.children[1].attributes.bounds = bounds;
    assert.throws(() => nativeElementCenter(value, "Input drawing surface"), /bounds/);
  }
  assert.throws(() => nativeElementCenter(tree(), "Missing input"), /no observed screen bounds/);
});

test("the native driver is an immutable official tool and its flows contain no injected app scripts", () => {
  assert.equal(MAESTRO.version, "2.12.1");
  assert.match(MAESTRO.archiveSha256, /^[a-f0-9]{64}$/);
  assert.match(MAESTRO.revision, /^[a-f0-9]{40}$/);
  assert.equal(MAESTRO.url, "https://github.com/mobile-dev-inc/Maestro/releases/download/cli-2.12.1/maestro.zip");
  for (const name of ["settings", "editor", "pointer", "pointer-cancel"]) {
    const flow = readFileSync(new URL("../native/ui-flows/" + name + ".yaml", import.meta.url), "utf8");
    assert.match(flow, /^appId: com\.nyctron\.instruments\.example/m);
    assert.match(flow, /- assertVisible:/);
    assert.match(flow, /- takeScreenshot:/);
    assert.doesNotMatch(flow, /runScript|evalScript|openLink|optional:\s*true/);
    // Returning to a route must inspect the existing app instance and draft.
    assert.doesNotMatch(flow, /clearState:\s*true|stopApp:\s*true/);
    if (name !== "pointer-cancel") assert.match(flow, /- launchApp:\s*\n\s+stopApp: false/);
  }
  const runner = readFileSync(new URL("../native/run-ui-acceptance.mjs", import.meta.url), "utf8");
  assert.match(runner, /"--no-reinstall-driver", "--format"/);
  assert.doesNotMatch(runner, /stages\.length\s*\?/);
});

test("both installed native jobs require the real UI runner and retain semantic and image artifacts", () => {
  const workflow = readFileSync(new URL("../../.github/workflows/native-controls-port.yml", import.meta.url), "utf8");
  for (const platform of ["ios", "android"]) {
    assert.ok(workflow.includes("node tooling/native/run-ui-acceptance.mjs " + platform));
    assert.ok(workflow.includes("nyc-tron-native-consumer/runtime-ui-" + platform));
  }
  assert.match(workflow, /node tooling\/native\/install-maestro\.mjs/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});
