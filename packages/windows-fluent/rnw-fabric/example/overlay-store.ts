import { createStore } from "zustand/vanilla";
import type { WindowsInspectorEditRequest } from "@nyc-tron/windows-fluent-fabric/overlays";

export const overlays = createStore(() => ({
  scopeId: "draft-1", open: false, disabled: false, value: "Initial native note", acknowledgedEventCount: 0,
  status: "Native overlays ready", menuStatus: "Native menu idle", contextStatus: "Native context idle",
}));
let vetoDismissalForScope: string | undefined;
export function vetoNextInspectorDismissal() {
  vetoDismissalForScope = overlays.getState().scopeId;
  overlays.setState({ status: "Native inspector dismissal veto armed" });
}
export function requestInspectorOpen(open: boolean) {
  if (!open && vetoDismissalForScope === overlays.getState().scopeId) {
    // Deliberately do not notify the store: a controlled veto needs no render.
    vetoDismissalForScope = undefined; return;
  }
  overlays.setState({ open });
}
export function requestInspectorEdit(request: WindowsInspectorEditRequest) {
  const state = overlays.getState();
  if (request.scopeId !== state.scopeId || request.id !== "note" || request.eventCount <= state.acknowledgedEventCount || state.disabled) return;
  const rejected = request.value.includes("!");
  overlays.setState({ value: rejected ? state.value : request.value, acknowledgedEventCount: request.eventCount,
    status: rejected ? "Native edit rejected; committed note retained" : "Native edit accepted" });
}
export function inspectorAction(id: string) {
  if (id === "close") overlays.setState({ open: false });
  else if (id === "disable") overlays.setState({ open: false, disabled: true, status: "Native inspector disabled" });
  else if (id === "replace") {
    const next = Number(overlays.getState().scopeId.split("-")[1]) + 1;
    overlays.setState({ scopeId: `draft-${next}`, open: false, value: "Replacement native note", acknowledgedEventCount: 0, status: "Native inspector scope replaced" });
  }
}
