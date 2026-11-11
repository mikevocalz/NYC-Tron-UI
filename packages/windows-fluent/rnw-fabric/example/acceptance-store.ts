import { createStore } from "zustand/vanilla";

type AcceptanceStage = "lifecycle" | "overlays" | "drag" | "navigation";
type AcceptanceState = { stage: AcceptanceStage; overlayMountKey: number; showStage: (stage: AcceptanceStage) => void };

export function createAcceptanceStore(beginInspectorMount: (mountKey: number) => void) {
  return createStore<AcceptanceState>((set, get) => ({
    stage: "lifecycle",
    overlayMountKey: 0,
    showStage(stage) {
      const current = get();
      if (stage === current.stage) return;
      // A new key guarantees new native fields even if React coalesces a
      // leave/return before committing the intermediate stage.
      const overlayMountKey = current.overlayMountKey + (stage === "overlays" ? 1 : 0);
      if (stage === "overlays") beginInspectorMount(overlayMountKey);
      set({ stage, overlayMountKey });
    },
  }));
}
