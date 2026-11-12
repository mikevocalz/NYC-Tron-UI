import type { Rect } from "@nyc-tron/core/folds";
import type { DisplayInfo, LayoutSnapshot, WindowRecord, WindowRegistryState, Outcome, DragOffer } from "@nyc-tron/core/window-lifecycle";
import type { TitleBarInsets } from "@nyc-tron/core/window-chrome";

export interface WindowsObservedDisplay extends DisplayInfo {
  readonly pixelBounds: Rect;
  readonly pixelWorkArea: Rect;
}
/**
 * How a native window presents its title bar.
 * - `standard`: the system draws the whole title bar; app content starts below it.
 * - `extended`: app content fills the window, including the title-bar strip.
 *   The system still draws the minimize, maximize and close caption buttons
 *   over transparent backgrounds, and the strip between them stays draggable.
 */
export type WindowsTitleBarStyle = "standard" | "extended";

/**
 * Observed title-bar geometry for one window, in the same logical units as
 * the window's `rect` (global physical pixels * 96 / `referenceDpi`).
 * `leading` and `trailing` follow the window's layout direction; in a
 * left-to-right window the caption buttons occupy `trailing`. A `standard`
 * window reports zero insets because the system frame sits outside its content.
 */
export interface WindowsTitleBar extends TitleBarInsets {
  readonly style: WindowsTitleBarStyle;
}

export interface WindowsObservedWindow extends WindowRecord {
  /** Native lifetime identity; reusing an app window ID creates a different generation. */
  readonly generation: string;
  readonly primary: boolean;
  readonly pixelRect: Rect;
  /** Current content DPI, separate from the connection's desktop coordinate scale. */
  readonly dpi: number;
  /** Title-bar style and the space its system caption buttons occupy. */
  readonly titleBar: WindowsTitleBar;
}
export interface WindowsCloseRequest {
  readonly id: string;
  readonly generation: string;
  readonly token: string;
}
export interface WindowsDesktopSnapshot {
  readonly schema: 1;
  readonly ownerToken: string;
  readonly sequence: number;
  /** One fixed desktop scale: logical = global physical pixels * 96 / referenceDpi. */
  readonly referenceDpi: number;
  readonly windows: readonly WindowsObservedWindow[];
  readonly displays: readonly WindowsObservedDisplay[];
  readonly focusedId: string | null;
  readonly pendingCloses: readonly WindowsCloseRequest[];
}
export interface WindowsWindowOwner {
  /** One app-owned registry for this connection. The document/session owner lives above its windows. */
  getState(): WindowRegistryState;
  commit(state: WindowRegistryState): void;
}
export interface WindowsWindowHostOptions {
  readonly primaryWindowId: string;
  /** An existing AppRegistry component. Additional surfaces reuse this same JS instance. */
  readonly componentName: string;
  readonly owner: WindowsWindowOwner;
  readonly onCloseRequested: (request: WindowsCloseRequest) => void;
  readonly onError?: (error: Error) => void;
}
export interface WindowsOpenWindow {
  readonly id: string;
  readonly title: string;
  readonly displayId: string;
  readonly rect: Rect;
}
export interface WindowsDesktopLayout {
  readonly schema: 1;
  readonly referenceDpi: number;
  /** The existing core version-one snapshot, without native tokens or document data. */
  readonly layout: LayoutSnapshot;
}
export interface WindowsNativeDragResult {
  /** Actual WinUI DropCompleted effect; unknown means the native lifetime ended before completion was observed. */
  readonly effect: "none" | "move" | "copy" | "link" | "unknown";
  readonly reason: string;
  /** Apply document state only from outcome.transfer, after both app approval and native completion. */
  readonly outcome: Outcome;
}
export interface WindowsWindowHost {
  snapshot(): WindowsDesktopSnapshot;
  refresh(): Promise<WindowsDesktopSnapshot>;
  open(spec: WindowsOpenWindow): Promise<WindowsObservedWindow>;
  move(id: string, target: { readonly displayId: string; readonly rect: Rect }): Promise<void>;
  focus(id: string): Promise<void>;
  minimize(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  /**
   * Switches one window between the system title bar and app content
   * extended under the caption buttons. The style lasts for that window's
   * native lifetime; a reopened window starts `standard`. Resolves with the
   * observed insets. Later size and DPI changes arrive as ordinary snapshots.
   *
   * Rejects, leaving the window unchanged, when the ID is not a window of this
   * connection or when this Windows version cannot customize the title bar
   * (`AppWindowTitleBar.IsCustomizationSupported()` is false).
   *
   * @example
   * await host.open({ id: "doc", title: "Draft", displayId, rect });
   * const { trailing, height } = await host.setTitleBar("doc", "extended");
   * // Leave `height` free at the top and `trailing` free at the end of that strip.
   */
  setTitleBar(id: string, style: WindowsTitleBarStyle): Promise<WindowsTitleBar>;
  /** Delivers a real OS close request; the app must resolve the resulting native token. */
  requestClose(id: string): Promise<void>;
  resolveClose(request: WindowsCloseRequest, accepted: boolean): Promise<void>;
  captureLayout(): WindowsDesktopLayout;
  /** Moves existing surfaces only. It never creates a document or silently recreates a missing surface. */
  restoreLayout(snapshot: WindowsDesktopLayout): Promise<void>;
  /** App input starts a transfer; payload remains with the app. This does not begin an OLE drag session. */
  beginDrag(sourceId: string, payload: unknown): Outcome;
  /** Update the app's current transfer target using observed window IDs. */
  dragOver(token: string, targetId: string | null): Outcome;
  /** Only a live, app-approved drop returns a transfer authorizing a document move. */
  drop(token: string, targetId: string, approve: (offer: DragOffer) => boolean | Promise<boolean>): Promise<Outcome>;
  /** Invalidate a transfer when the app's input stream ends or cancels. */
  cancelDrag(token: string): Outcome;
  /** Used by WindowsDragSource after a real native DragStarting request; never synthesizes an OS gesture. */
  startNativeDrag(requestId: string, sourceId: string, payload: unknown): Promise<WindowsNativeDragResult>;
  /** One mounted native drop surface per window. The callback decides; it must not apply the document move. */
  bindNativeDropTarget(windowId: string, approve: (offer: DragOffer) => boolean | Promise<boolean>): () => void;
  /** Closes owned secondary surfaces, detaches the primary observer, and leaves the JS/document owner alive. */
  dispose(): Promise<void>;
}
