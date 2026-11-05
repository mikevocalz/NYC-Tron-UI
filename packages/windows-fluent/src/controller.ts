import {
  validateWindowsNavigationState,
  type WindowsNativeNavigationTransport,
  type WindowsNavigationState,
} from "./types.ts";

export interface WindowsNavigationCallbacks {
  /** Route selection is committed by the app, not this native shell. */
  onSelectionRequested: (id: string) => void;
  onPaneOpenRequested: (open: boolean) => void;
  onSettingsRequested?: () => void;
}
export interface WindowsNavigationController {
  update(next: WindowsNavigationState): void;
  dispose(): void;
}
/**
 * One-way controlled reconciliation of app navigation to a WinUI host.
 *
 * This module has NO RNW Fabric component and no fake browser fallback.
 * The caller supplies the real native transport from its host integration.
 */
export function createWindowsNavigationController(
  transport: WindowsNativeNavigationTransport,
  initial: WindowsNavigationState,
  callbacks: WindowsNavigationCallbacks,
): WindowsNavigationController {
  let current = validateWindowsNavigationState(initial);
  let disposed = false;
  // Apply the entire initial state exactly once, before subscribing to native events.
  function applyAll(next: WindowsNavigationState) {
    transport.setDestinations(next.items, next.footerItems ?? []);
    transport.setPaneMode(next.paneMode);
    transport.setPaneTitle(next.paneTitle ?? "");
    transport.setSettingsVisible(next.settingsVisible ?? false);
    transport.setSelectedId(next.selectedId);
    transport.setPaneOpen(next.paneOpen);
  }
  applyAll(current);
  const unsubscribe = transport.subscribe(event => {
    if (disposed) return;
    if (event.type === "destinationInvoked") {
      const target = [...current.items,...(current.footerItems ?? [])].find(
        item => item.id === event.id,
      );
      // Don't dispatch stale, disabled, or already-selected native events.
      if (target && !target.disabled && target.id !== current.selectedId) {
        callbacks.onSelectionRequested(target.id);
      }
    } else if (event.type === "paneOpenChanged") {
      if (event.open !== current.paneOpen) callbacks.onPaneOpenRequested(event.open);
    } else if (event.type === "settingsInvoked") {
      if (current.settingsVisible) callbacks.onSettingsRequested?.();
    }
  });
  return {
    update(nextState) {
      if (disposed) throw new Error("Windows NavigationView controller has been disposed");
      const next = validateWindowsNavigationState(nextState);
      const itemsChanged = current.items !== next.items ||
        current.footerItems !== next.footerItems;
      if (itemsChanged) {
        transport.setDestinations(next.items, next.footerItems ?? []);
      }
      if (current.paneMode !== next.paneMode) transport.setPaneMode(next.paneMode);
      if (current.paneTitle !== next.paneTitle) transport.setPaneTitle(next.paneTitle ?? "");
      if (current.settingsVisible !== next.settingsVisible) {
        transport.setSettingsVisible(next.settingsVisible ?? false);
      }
      if (current.selectedId !== next.selectedId || itemsChanged) {
        transport.setSelectedId(next.selectedId);
      }
      if (current.paneOpen !== next.paneOpen) transport.setPaneOpen(next.paneOpen);
      current = next;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      unsubscribe();
    },
  };
}
