import test from "node:test";
import assert from "node:assert/strict";
import { overlays, requestInspectorEdit, inspectorAction } from "../overlay-store.ts";
import { nativeDrag, dragPayload, approveNativeDrop, completeNativeDrag } from "../drag-store.ts";

test("the inspector owner accepts rapid cumulative edits, rejects explicitly and ignores stale counts/scopes", () => {
  const typed = "NativeRapid123abc";
  for (let index = 1; index <= typed.length; index++) requestInspectorEdit({ scopeId: "draft-1", id: "note", value: typed.slice(0, index), eventCount: index });
  assert.equal(overlays.getState().value, typed);
  requestInspectorEdit({ scopeId: "draft-1", id: "note", value: "Rejected!", eventCount: 100 });
  assert.equal(overlays.getState().value, typed); assert.equal(overlays.getState().acknowledgedEventCount, 100);
  requestInspectorEdit({ scopeId: "draft-1", id: "note", value: "Stale", eventCount: 99 });
  assert.equal(overlays.getState().value, typed);
  inspectorAction("replace");
  requestInspectorEdit({ scopeId: "draft-1", id: "note", value: "Old document", eventCount: 101 });
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
