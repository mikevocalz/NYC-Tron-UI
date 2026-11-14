import assert from "node:assert/strict";
import test from "node:test";
import { workspaceObservation, requireWorkspaceModeContinuity, requireWorkspaceDocumentReturn,
  requireWorkspacePresetSave } from "../native/workspace-evidence.mjs";

const layout = { right: { panels: ["layers"], active: "layers", size: 180 }, floating: [] };
const session = (mode = "edit", edits = 0, canvasInstance = null) => ({ mode, edits, canvasInstance,
  presets: [{ id: "color", name: "Color", builtIn: true }], presetModes: { color: "color" }, presetLayouts: { color: layout } });
const state = () => ({ documentId: "document-a", documents: {
  "document-a": session("edit", 1, "observed-canvas-a"), "document-b": session(),
}, events: ["document-a:canvas-edit"] });
const hierarchy = value => ({ attributes: {}, children: [{ attributes: {
  "resource-id": "workspace-continuity-state", text: "clipped visible JSON…",
  accessibilityText: "Workspace consumer state " + JSON.stringify(value),
}, children: [] }] });
const clone = value => structuredClone(value);

test("workspace observations require a unique complete native label, not clipped or ambiguous text", () => {
  const value = state();
  assert.deepEqual(workspaceObservation(hierarchy(value)), value);
  const android = hierarchy(value);
  android.children[0].attributes["resource-id"] = "com.nyctron.instruments.example:id/workspace-continuity-state";
  assert.deepEqual(workspaceObservation(android), value);
  const missing = hierarchy(value); missing.children = [];
  assert.throws(() => workspaceObservation(missing), /one observed workspace state/);
  const duplicate = hierarchy(value); duplicate.children.push(duplicate.children[0]);
  assert.throws(() => workspaceObservation(duplicate), /one observed workspace state/);
  const clipped = hierarchy(value); clipped.children[0].attributes.accessibilityText = 'Workspace consumer state {"documentId":';
  assert.throws(() => workspaceObservation(clipped), /incomplete JSON/);
  const noLabel = hierarchy(value); delete noLabel.children[0].attributes.accessibilityText;
  assert.throws(() => workspaceObservation(noLabel), /complete workspace accessibility label/);
  const conflict = hierarchy(value); conflict.children[0].attributes["content-desc"] = "Workspace consumer state " + JSON.stringify({});
  assert.throws(() => workspaceObservation(conflict), /one complete workspace accessibility label/);
  for (const mutate of [s => { delete s.documents["document-b"]; }, s => { s.documentId = "unknown"; },
    s => { s.documents["document-a"].canvasInstance = null; }, s => { s.events = [null]; }]) {
    const invalid = state(); mutate(invalid);
    assert.throws(() => workspaceObservation(hierarchy(invalid)), /Workspace pilot/);
  }
});

test("mode proof rejects lost edits, remounts and an action that never changed the actual mode", () => {
  const before = state(), after = clone(before); after.documents["document-a"].mode = "color";
  assert.doesNotThrow(() => requireWorkspaceModeContinuity(before, after));
  for (const mutate of [s => { s.documents["document-a"].mode = "edit"; },
    s => { s.documents["document-a"].edits = 0; }, s => { s.documents["document-a"].canvasInstance = "remounted"; },
    s => { s.documentId = "document-b"; }]) {
    const invalid = clone(after); mutate(invalid);
    assert.throws(() => requireWorkspaceModeContinuity(before, invalid));
  }
});

test("round-trip proof requires the visited document and retained draft rather than only the final title", () => {
  const after = state(); after.documents["document-a"].mode = "color";
  after.documents["document-b"].canvasInstance = "observed-canvas-b";
  assert.doesNotThrow(() => requireWorkspaceDocumentReturn(after));
  for (const mutate of [s => { s.documents["document-a"].edits = 0; },
    s => { s.documents["document-b"].edits = 1; }, s => { s.documents["document-b"].canvasInstance = null; },
    s => { s.documents["document-b"].canvasInstance = s.documents["document-a"].canvasInstance; },
    s => { s.documentId = "document-b"; }]) {
    const invalid = clone(after); mutate(invalid);
    assert.throws(() => requireWorkspaceDocumentReturn(invalid));
  }
});

test("preset proof requires a new stored mode/layout and one host event, not a matching label alone", () => {
  const before = state(); before.documents["document-a"].mode = "color";
  const after = clone(before), saved = after.documents["document-a"];
  saved.activeId = "custom-1";
  saved.presets.push({ id: "custom-1", name: "Custom layout copy", builtIn: false });
  saved.presetModes["custom-1"] = "color"; saved.presetLayouts["custom-1"] = clone(layout);
  after.events.push("document-a:save:custom-1:Custom layout copy");
  assert.doesNotThrow(() => requireWorkspacePresetSave(before, after));
  for (const mutate of [s => { s.documents["document-a"].presetLayouts["custom-1"].right.size = 99; },
    s => { s.documents["document-a"].presetModes["custom-1"] = "edit"; },
    s => { s.documents["document-a"].canvasInstance = "remounted"; },
    s => { s.events.push("document-a:save:custom-1:Custom layout copy"); },
    s => { s.documents["document-a"].presets.at(-1).builtIn = true; },
    s => { s.documents["document-a"].activeId = "color"; }]) {
    const invalid = clone(after); mutate(invalid);
    assert.throws(() => requireWorkspacePresetSave(before, invalid));
  }
  // Two callbacks can allocate different IDs, so counting only the selected
  // preset's exact event would miss this duplicate host mutation.
  const duplicate = clone(after), twiceSaved = duplicate.documents["document-a"];
  twiceSaved.activeId = "custom-2";
  twiceSaved.presets.push({ id: "custom-2", name: "Custom layout copy", builtIn: false });
  twiceSaved.presetModes["custom-2"] = "color";
  twiceSaved.presetLayouts["custom-2"] = clone(layout);
  duplicate.events.push("document-a:save:custom-2:Custom layout copy");
  assert.throws(() => requireWorkspacePresetSave(before, duplicate), /exactly one new preset/);
  // Even a missing/unpublished first preset cannot hide its second save event.
  twiceSaved.presets = twiceSaved.presets.filter(preset => preset.id !== "custom-1");
  assert.throws(() => requireWorkspacePresetSave(before, duplicate), /exactly one new save event/);
});
