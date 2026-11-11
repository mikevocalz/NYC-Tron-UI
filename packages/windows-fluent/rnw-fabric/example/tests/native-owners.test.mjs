import test from "node:test";
import assert from "node:assert/strict";
import { overlays, requestInspectorEdit, inspectorAction, beginInspectorMount } from "../overlay-store.ts";
import { createAcceptanceStore } from "../acceptance-store.ts";
import { nativeDrag, dragPayload, approveNativeDrop, completeNativeDrag } from "../drag-store.ts";

test("the inspector owner accepts rapid cumulative edits, rejects explicitly and ignores stale counts/scopes", () => {
  const typed = "NativeRapid123abc";
  const mountKey = overlays.getState().editMountKey;
  for (let index = 1; index <= typed.length; index++) requestInspectorEdit({ scopeId: "draft-1", id: "note", value: typed.slice(0, index), eventCount: index }, mountKey);
  assert.equal(overlays.getState().value, typed);
  requestInspectorEdit({ scopeId: "draft-1", id: "note", value: "Rejected!", eventCount: 100 }, mountKey);
  assert.equal(overlays.getState().value, typed); assert.equal(overlays.getState().acknowledgedEventCount, 100);
  requestInspectorEdit({ scopeId: "draft-1", id: "note", value: "Stale", eventCount: 99 }, mountKey);
  assert.equal(overlays.getState().value, typed);
  inspectorAction("replace");
  requestInspectorEdit({ scopeId: "draft-1", id: "note", value: "Old document", eventCount: 101 }, mountKey);
  assert.equal(overlays.getState().value, "Replacement native note"); assert.equal(overlays.getState().acknowledgedEventCount, 0);
});
test("the document owner applies only the controller's final authorized payload", () => {
  const offer = { sourceId: "main", targetId: "document", payload: dragPayload };
  nativeDrag.setState({ mode: "accept" }); assert.equal(approveNativeDrop(offer), true);
  assert.equal(nativeDrag.getState().owner, "main");
  completeNativeDrag({ effect: "move", reason: "accepted", outcome: { ok: false } });
  assert.equal(nativeDrag.getState().owner, "main"); assert.equal(nativeDrag.getState().transfers, 0);
  completeNativeDrag({ effect: "move", reason: "accepted", outcome: { ok: true, transfer: offer } });
  assert.equal(nativeDrag.getState().owner, "document"); assert.equal(nativeDrag.getState().transfers, 1);
  completeNativeDrag({ effect: "move", reason: "accepted", outcome: { ok: true, transfer: offer } });
  assert.equal(nativeDrag.getState().transfers, 1);
});
test("coalesced leave and return remounts the inspector with its draft retained and an independent edit-count domain", () => {
  const previous = overlays.getState();
  try {
    overlays.setState({ scopeId: "remount-draft", value: "Original draft", acknowledgedEventCount: 0, disabled: false });
    const acceptance = createAcceptanceStore(beginInspectorMount);
    acceptance.getState().showStage("overlays");
    const firstMount = acceptance.getState().overlayMountKey;
    requestInspectorEdit({ scopeId: "remount-draft", id: "note", value: "Edited native draft", eventCount: 1 }, firstMount);
    assert.equal(overlays.getState().acknowledgedEventCount, 1);
    acceptance.getState().showStage("overlays");
    assert.equal(acceptance.getState().overlayMountKey, firstMount);
    assert.equal(overlays.getState().acknowledgedEventCount, 1, "selecting an already mounted stage retains its current edit domain");
    // Both transitions occur before a hypothetical React commit. Its final
    // snapshot still requests overlays, but the changed key forces a remount.
    acceptance.getState().showStage("lifecycle");
    assert.equal(acceptance.getState().stage, "lifecycle");
    assert.equal(overlays.getState().value, "Edited native draft");
    acceptance.getState().showStage("overlays");
    const remount = acceptance.getState().overlayMountKey;
    assert.equal(remount, firstMount + 1);
    assert.equal(overlays.getState().scopeId, "remount-draft");
    assert.equal(overlays.getState().value, "Edited native draft");
    assert.equal(overlays.getState().acknowledgedEventCount, 0);
    requestInspectorEdit({ scopeId: "remount-draft", id: "note", value: "Late old-mount draft", eventCount: 2 }, firstMount);
    assert.equal(overlays.getState().value, "Edited native draft");
    assert.equal(overlays.getState().acknowledgedEventCount, 0);
    requestInspectorEdit({ scopeId: "remount-draft", id: "note", value: "Edited after remount", eventCount: 1 }, remount);
    assert.equal(overlays.getState().value, "Edited after remount");
    assert.equal(overlays.getState().acknowledgedEventCount, 1);
  } finally {
    overlays.setState(previous, true);
  }
});
