import { beginDrag, dragOver, dropDrag, resolveDrop, cancelDrag, type Outcome, type DragOffer, type WindowRegistryState } from "@nyc-tron/core/window-lifecycle";
import type { WindowsDesktopSnapshot, WindowsNativeDragResult } from "./window-types.ts";
import { validWindowId } from "./window-protocol.ts";

export interface WindowsNativeDragTransport {
  startNativeDrag?(owner: string, sourceId: string, token: string, requestId: string): Promise<string>;
  resolveNativeDrop?(owner: string, token: string, requestId: string, accepted: boolean): Promise<boolean>;
  cancelNativeDrag?(owner: string, requestOrToken: string): Promise<void>;
  onNativeDrag?(listener: (json: string) => void): { remove(): void };
}
interface Scope {
  snapshot(): WindowsDesktopSnapshot;
  getState(): WindowRegistryState;
  commit(state: WindowRegistryState): void;
  isLive(): boolean;
  report(error: unknown): void;
}
interface Pending {
  token: string; sourceId: string; sourceGeneration: string;
  requestId?: string; targetId?: string; targetGeneration?: string;
  approval?: Promise<boolean>;
}
type Message = { kind: "hover" | "offer"; ownerToken: string; token: string; sourceId: string; sourceGeneration: string; targetId: string; targetGeneration: string; requestId: string };
type Result = Omit<Message, "kind" | "requestId"> & { effect: WindowsNativeDragResult["effect"]; reason: string };

/** Native WinUI owns gesture transport; this owner applies the shared token/approval model. */
export function createNativeDragController(transport: WindowsNativeDragTransport, scope: Scope) {
  let pending: Pending | undefined;
  const targets = new Map<string, { generation: string; approve: (offer: DragOffer) => boolean | Promise<boolean> }>();
  const apply = (outcome: Outcome) => { if (outcome.ok) scope.commit(outcome.state); return outcome; };
  const stale = (): Outcome => ({ state: scope.getState(), ok: false, reason: "stale-token" });
  const requireNative = () => {
    if (!scope.isLive()) throw new Error("Windows window host has been disposed");
    if (!transport.startNativeDrag || !transport.resolveNativeDrop || !transport.cancelNativeDrag || !transport.onNativeDrag) throw new Error("The registered WinUI native drag transport is unavailable");
  };
  const liveWindow = (id: string, generation: string) => scope.snapshot().windows.some(w => w.id === id && w.generation === generation && w.status === "open");
  const cancelNative = async (token: string) => {
    if (transport.cancelNativeDrag) await transport.cancelNativeDrag(scope.snapshot().ownerToken, token);
  };
  const subscription = transport.onNativeDrag?.(json => {
    try {
      if (!pending || !scope.isLive()) return;
      if (json.length > 16384) throw new TypeError("Native drag event exceeds its budget");
      const event = JSON.parse(json) as Message, active = pending;
      if (event.ownerToken !== scope.snapshot().ownerToken || event.token !== active.token || event.sourceId !== active.sourceId || event.sourceGeneration !== active.sourceGeneration) return;
      if (!liveWindow(active.sourceId, active.sourceGeneration)) return;
      if (event.kind === "hover") {
        apply(dragOver(scope.getState(), active.token, liveWindow(event.targetId, event.targetGeneration) ? event.targetId : null)); return;
      }
      if (event.kind !== "offer" || !validWindowId(event.requestId) || !validWindowId(event.targetId) || !validWindowId(event.targetGeneration)) throw new TypeError("Malformed native drag offer");
      if (active.requestId) return;
      active.requestId = event.requestId; active.targetId = event.targetId; active.targetGeneration = event.targetGeneration;
      const policy = targets.get(event.targetId);
      const proposal = policy?.generation === event.targetGeneration && liveWindow(event.targetId, event.targetGeneration)
        ? apply(dropDrag(scope.getState(), active.token, event.targetId)) : stale();
      active.approval = (async () => {
        let requested = false;
        if (proposal.ok && proposal.offer && policy) {
          try { requested = await policy.approve(proposal.offer) === true; } catch (error) { scope.report(error); }
        }
        if (pending !== active) return false; // Native timeout, cancellation or disposal already ended this lease.
        const drag = scope.getState().drag;
        const allowed = requested && scope.isLive() && targets.get(event.targetId) === policy &&
          liveWindow(active.sourceId, active.sourceGeneration) && liveWindow(event.targetId, event.targetGeneration) &&
          drag?.token === active.token && drag.phase === "dropping" && drag.targetId === event.targetId;
        return await transport.resolveNativeDrop!(scope.snapshot().ownerToken, active.token, event.requestId, allowed) === true;
      })().catch(error => { if (pending === active) scope.report(error); return false; });
    } catch (error) { scope.report(error); }
  });
  return {
    async start(requestId: string, sourceId: string, payload: unknown): Promise<WindowsNativeDragResult> {
      requireNative();
      if (!validWindowId(requestId) || !validWindowId(sourceId)) throw new TypeError("Native drag start requires its real native request and window IDs");
      const source = scope.snapshot().windows.find(w => w.id === sourceId && w.status === "open");
      if (!source) { await cancelNative(requestId); return { effect: "none", reason: "unavailable", outcome: stale() }; }
      const started = apply(beginDrag(scope.getState(), { sourceId, payload }));
      if (!started.ok || !started.token) {
        await cancelNative(requestId); return { effect: "none", reason: "not-started", outcome: started };
      }
      const active: Pending = { token: started.token, sourceId, sourceGeneration: source.generation }; pending = active;
      try {
        const json = await transport.startNativeDrag!(scope.snapshot().ownerToken, sourceId, active.token, requestId);
        if (json.length > 16384) throw new TypeError("Native drag result exceeds its budget");
        const result = JSON.parse(json) as Result;
        if (result.ownerToken !== scope.snapshot().ownerToken || result.token !== active.token || result.sourceId !== sourceId || result.sourceGeneration !== active.sourceGeneration ||
          !["none", "move", "copy", "link", "unknown"].includes(result.effect) || typeof result.reason !== "string" || result.reason.length > 256) throw new TypeError("Malformed native drag completion");
        let outcome: Outcome;
        const accepted = result.effect === "move" && result.reason === "accepted" && active.approval && await active.approval;
        if (!scope.isLive() || pending !== active) outcome = stale();
        else if (accepted && active.targetId === result.targetId && active.targetGeneration === result.targetGeneration &&
          liveWindow(sourceId, active.sourceGeneration) && liveWindow(result.targetId, result.targetGeneration)) outcome = apply(resolveDrop(scope.getState(), active.token, true));
        else {
          const drag = scope.getState().drag;
          outcome = drag?.token === active.token ? apply(drag.phase === "dropping" ? resolveDrop(scope.getState(), active.token, false) : cancelDrag(scope.getState(), active.token)) : stale();
        }
        return { effect: result.effect, reason: result.reason, outcome };
      } catch (error) {
        apply(cancelDrag(scope.getState(), active.token)); await cancelNative(active.token).catch(scope.report); throw error;
      } finally { if (pending === active) pending = undefined; }
    },
    bindTarget(windowId: string, approve: (offer: DragOffer) => boolean | Promise<boolean>): () => void {
      requireNative(); const window = scope.snapshot().windows.find(w => w.id === windowId);
      if (!window || typeof approve !== "function") throw new TypeError("A native drop target requires an existing window and an approval callback");
      if (targets.has(windowId)) throw new Error("A window can have one mounted native drop target");
      const entry = { generation: window.generation, approve }; targets.set(windowId, entry);
      return () => {
        if (targets.get(windowId) !== entry) return;
        targets.delete(windowId); const drag = scope.getState().drag;
        if (drag?.targetId === windowId) {
          if (drag.phase === "dropping") { apply(cancelDrag(scope.getState(), drag.token)); void cancelNative(drag.token).catch(scope.report); }
          else apply(dragOver(scope.getState(), drag.token, null));
        }
      };
    },
    cancel: cancelNative,
    async cancelCurrent() { if (pending) await cancelNative(pending.token); },
    detach() { subscription?.remove(); targets.clear(); pending = undefined; },
  };
}
