import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { MAESTRO, nativeElementCenter, parseHierarchy, requirePassedFlow, requireReferenceHostBounds, requireSemanticLabels } from "../native/ui-evidence.mjs";

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

const referenceTree = (header = "[0,62][402,134]", tabs = "[0,775][402,840]") => ({ attributes: {}, children: [
  { attributes: { "resource-id": "reference-safe-content", bounds: "[0,62][402,840]" }, children: [
    { attributes: { "resource-id": "reference-header", bounds: header }, children: [] },
    { attributes: { "resource-id": "reference-bottom-tabs", bounds: tabs }, children: [] },
  ] },
] });

test("native reference geometry rejects the observed safe-area origin regression", () => {
  const proof = requireReferenceHostBounds(referenceTree());
  assert.deepEqual(proof.host, { left: 0, top: 62, right: 402, bottom: 840 });
  assert.equal(proof.header.top, 62);
  assert.equal(proof.tabs.bottom, 840);
  // Actual coordinates from fe397c02, run 42760178196: the measured content
  // begins at y=62, while a second origin subtraction moved the header to y=0.
  // The measured parent gains its testID in the fix; these are regression inputs.
  assert.throws(() => requireReferenceHostBounds(referenceTree("[0,0][402,72]", "[0,713][402,778]")), /reference-header escapes/);
  assert.throws(() => requireReferenceHostBounds(referenceTree(undefined, "[0,800][402,865]")), /reference-bottom-tabs escapes/);
  assert.throws(() => requireReferenceHostBounds(referenceTree("[0,62][403,134]")), /reference-header escapes/);
});

test("native geometry requires unique real screen rectangles on both platforms", () => {
  const android = referenceTree();
  for (const node of [android.children[0], ...android.children[0].children]) node.attributes["resource-id"] = "com.nyctron.instruments.example:id/" + node.attributes["resource-id"];
  assert.deepEqual(requireReferenceHostBounds(android), requireReferenceHostBounds(referenceTree()));
  const missing = referenceTree(); missing.children[0].children.pop();
  assert.throws(() => requireReferenceHostBounds(missing), /one observed reference-bottom-tabs/);
  const duplicate = referenceTree(); duplicate.children.push(duplicate.children[0]);
  assert.throws(() => requireReferenceHostBounds(duplicate), /one observed reference-safe-content/);
  for (const bounds of [undefined, "[0,0][0,0]", "[-1,0][402,840]", "[0,0][9007199254740992,840]"]) {
    const invalid = referenceTree(); invalid.children[0].attributes.bounds = bounds;
    assert.throws(() => requireReferenceHostBounds(invalid), /bounds/);
  }
});

test("the native driver is an immutable official tool and its flows contain no injected app scripts", () => {
  assert.equal(MAESTRO.version, "2.12.1");
  assert.match(MAESTRO.archiveSha256, /^[a-f0-9]{64}$/);
  assert.match(MAESTRO.revision, /^[a-f0-9]{40}$/);
  assert.equal(MAESTRO.url, "https://github.com/mobile-dev-inc/Maestro/releases/download/cli-2.12.1/maestro.zip");
  for (const name of ["settings", "editor", "pointer", "pointer-cancel", "workspace-baseline", "workspace-color", "workspace-return", "workspace-preset"]) {
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
