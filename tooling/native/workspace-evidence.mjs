import assert from "node:assert/strict";
import { hierarchyNodes } from "./ui-evidence.mjs";

const ID = "workspace-continuity-state";
const PREFIX = "Workspace consumer state ";
const MODES = new Set(["edit", "color", "audio", "review", "presentation", "custom"]);
const object = value => value && typeof value === "object" && !Array.isArray(value);
const fail = message => { throw new Error("Workspace pilot: " + message); };

/**
 * Read the existing fixture's complete accessibility label from an actual
 * driver hierarchy, not injected app JavaScript or its clipped visible text.
 * Missing, duplicate, malformed or incomplete observations fail closed.
 */
export function workspaceObservation(tree) {
  const nodes = hierarchyNodes(tree).filter(node => {
    const id = node.attributes["resource-id"];
    return id === ID || typeof id === "string" && id.endsWith(":id/" + ID);
  });
  if (nodes.length !== 1) fail("needs one observed workspace state node");
  const labels = [...new Set(Object.values(nodes[0].attributes)
    .filter(value => typeof value === "string" && value.startsWith(PREFIX)))];
  if (labels.length !== 1) fail("needs one complete workspace accessibility label");
  let state;
  try { state = JSON.parse(labels[0].slice(PREFIX.length)); }
  catch { fail("workspace accessibility label contains incomplete JSON"); }
  if (!object(state) || !["document-a", "document-b"].includes(state.documentId) ||
      !object(state.documents) || !Array.isArray(state.events) || state.events.some(event => typeof event !== "string")) {
    fail("workspace observation has invalid document ownership");
  }
  for (const id of ["document-a", "document-b"]) {
    const session = state.documents[id];
    if (!object(session) || !MODES.has(session.mode) || !Number.isSafeInteger(session.edits) || session.edits < 0 ||
        !Array.isArray(session.presets) || !object(session.presetModes) || !object(session.presetLayouts)) {
      fail("workspace observation lacks the complete " + id + " session");
    }
  }
  const session = state.documents[state.documentId];
  if (typeof session.canvasInstance !== "string" || !session.canvasInstance.trim()) fail("mounted canvas identity is missing");
  return state;
}

/** Both observations are captured after real Maestro actions; no mutation here. */
export function requireWorkspaceModeContinuity(before, after) {
  assert.equal(before.documentId, "document-a", "workspace baseline must own document-a");
  assert.equal(after.documentId, "document-a", "mode change must retain document ownership");
  const left = before.documents["document-a"], right = after.documents["document-a"];
  assert.equal(left.mode, "edit", "workspace baseline must be Edit");
  assert.equal(right.mode, "color", "observed Color action must change the mode");
  assert.equal(left.edits, 1, "baseline canvas edit must be observed");
  assert.equal(right.edits, 1, "mode change must retain the actual canvas edit");
  assert.equal(right.canvasInstance, left.canvasInstance, "mode change must retain canvas identity");
}

export function requireWorkspaceDocumentReturn(after) {
  assert.equal(after.documentId, "document-a", "document round trip must return to document-a");
  assert.equal(after.documents["document-a"].mode, "color", "return must preserve the saved mode");
  assert.equal(after.documents["document-a"].edits, 1, "return must preserve document-a's edit");
  assert.equal(after.documents["document-b"].edits, 0, "visiting document-b must not copy document-a's edit");
  assert.ok(typeof after.documents["document-b"].canvasInstance === "string" && after.documents["document-b"].canvasInstance,
    "round trip must observe that document-b mounted");
}

export function requireWorkspacePresetSave(before, after) {
  assert.equal(after.documentId, "document-a", "preset save must retain document ownership");
  const left = before.documents["document-a"], right = after.documents["document-a"];
  assert.equal(right.mode, "color", "saved preset must retain Color mode");
  assert.equal(right.edits, 1, "preset save must preserve the actual document edit");
  assert.equal(right.canvasInstance, left.canvasInstance, "preset save must not remount the canvas");
  const matches = right.presets.filter(preset => preset.id === right.activeId);
  assert.equal(matches.length, 1, "save must select exactly one actual preset");
  const preset = matches[0];
  assert.equal(preset.name, "Custom layout copy", "the observed default save name must be retained");
  assert.equal(preset.builtIn, false, "save must create a user preset");
  assert.equal(left.presets.some(previous => previous.id === preset.id), false, "save must create a new preset identity");
  assert.equal(right.presetModes[preset.id], "color", "preset must store the actual mode");
  assert.ok(left.presetLayouts.color, "fixture's existing Color layout must be observed before save");
  assert.deepEqual(right.presetLayouts[preset.id], left.presetLayouts.color, "preset must store the actual fixture Color layout");
  const event = "document-a:save:" + preset.id + ":Custom layout copy";
  assert.equal(after.events.filter(value => value === event).length, 1, "save must emit one observed host event");
}
