/**
 * App-owned navigation state is separate from the WinUI control.
 * No React Native or Expo imports: the host is a WinUI 3 Windows App SDK app.
 */
export type WindowsPaneMode = "auto" | "expanded" | "compact" | "minimal";
export interface WindowsDestination {
  readonly id: string;
  readonly label: string;
  /** Optional Segoe Fluent Icons glyph supplied by the host theme. */
  readonly glyph?: string;
  readonly disabled?: boolean;
}
export interface WindowsNavigationState {
  readonly items: readonly WindowsDestination[];
  readonly footerItems?: readonly WindowsDestination[];
  readonly selectedId: string | null;
  readonly paneMode: WindowsPaneMode;
  readonly paneOpen: boolean;
  readonly paneTitle?: string;
  readonly settingsVisible?: boolean;
}
export type WindowsNativeNavigationEvent =
  | { readonly type: "destinationInvoked"; readonly id: string }
  | { readonly type: "paneOpenChanged"; readonly open: boolean }
  | { readonly type: "settingsInvoked" };
/**
 * A genuine host-owned transport. The actual JS->C# RNW bridge has not
 * been implemented and must be injected by the consuming native host.
 * It MUST NOT be silently substituted by a React Native View.
 */
export interface WindowsNativeNavigationTransport {
  setDestinations(items: readonly WindowsDestination[], footerItems: readonly WindowsDestination[]): void;
  setSelectedId(selectedId: string | null): void;
  setPaneMode(mode: WindowsPaneMode): void;
  setPaneOpen(open: boolean): void;
  setPaneTitle(title: string): void;
  setSettingsVisible(enabled: boolean): void;
  subscribe(onEvent: (event: WindowsNativeNavigationEvent) => void): () => void;
}
const allowedModes = new Set<WindowsPaneMode>(["auto","expanded","compact","minimal"]);
export function validateWindowsNavigationState(state: WindowsNavigationState): WindowsNavigationState {
  if (!allowedModes.has(state.paneMode) || typeof state.paneOpen !== "boolean") {
    throw new TypeError("Invalid native WinUI pane state");
  }
  const ids = new Set<string>();
  for (const destination of [...state.items,...(state.footerItems ?? [])]) {
    if (!destination.id || typeof destination.label !== "string" || !destination.label.trim() ||
        ids.has(destination.id)) {
      throw new TypeError("WinUI destination IDs and labels must be unique and nonempty");
    }
    ids.add(destination.id);
  }
  if (state.selectedId !== null && !ids.has(state.selectedId)) {
    throw new RangeError("WinUI selected destination must exist in current items");
  }
  return state;
}
