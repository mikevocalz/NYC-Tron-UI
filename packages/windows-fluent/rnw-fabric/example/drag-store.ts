import { createStore } from "zustand/vanilla";
import type { DragOffer } from "@nyc-tron/core/window-lifecycle";
import type { WindowsNativeDragResult } from "@nyc-tron/windows-fluent-fabric/window-types";

export const dragPayload = Object.freeze({ documentId: "shared-draft" });
export const nativeDrag = createStore(() => ({
  mode: "reject" as "reject" | "accept" | "delay", owner: "main", transfers: 0, attempts: 0, status: "Native drag idle",
}));
let delayedApproval: ((accepted: boolean) => void) | undefined;
export function approveNativeDrop(offer: DragOffer): boolean | Promise<boolean> {
  if (offer.payload !== dragPayload || offer.sourceId !== nativeDrag.getState().owner || offer.targetId !== "document") return false;
  if (nativeDrag.getState().mode === "delay") {
    nativeDrag.setState({ status: "Native drop awaiting app approval" });
    return new Promise(resolve => { delayedApproval = resolve; });
  }
  return nativeDrag.getState().mode === "accept";
}
export function completeNativeDrag(result: WindowsNativeDragResult) {
  const state = nativeDrag.getState(), transfer = result.outcome.transfer;
  // Receipt of Drop/offer does not mutate ownership. Only the final authorized
  // transfer, after the OS's actual Move result, can commit this app-owned value.
  const accepted = transfer?.payload === dragPayload && transfer.sourceId === state.owner;
  nativeDrag.setState({ attempts: state.attempts + 1, status: `Native drag result: ${result.effect}/${result.reason}`,
    ...(accepted ? { owner: transfer.targetId, transfers: state.transfers + 1 } : {}) });
}
export function resolveDelayedApproval() { const resolve = delayedApproval; delayedApproval = undefined; resolve?.(true); }
