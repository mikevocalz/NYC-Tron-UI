import {
  createWindowRegistry, openWindow, closeWindow, focusWindow, minimizeWindow, restoreWindow,
  type OpenWindowSpec, type Outcome, type WindowRegistryState,
} from "./window-lifecycle.ts";

/**
 * Window title bar and window-control contract. Pure TypeScript, no React and
 * no native code. Renderers in `@nyc-tron/ui`, `@nyc-tron/macos-appkit` and
 * `@nyc-tron/windows-fluent-fabric` read {@linkcode describeTitleBar} and send
 * commands through {@linkcode createWindowChromeController}; the actual window
 * state lives in the app's `@nyc-tron/core/window-lifecycle` registry.
 *
 * Ownership:
 * - The app owns the close decision. A close request goes to the host, which
 *   asks the app (an unsaved-changes guard, for example) and reports the
 *   verdict as a {@linkcode WindowCloseResult}. The title bar never closes a
 *   window on its own and never decides whether one may close.
 * - On macOS and Windows the operating system draws the window buttons. The
 *   title bar only reserves their space ({@linkcode TitleBarInsets}).
 * - Drawn controls exist for hosts with no native chrome: the browser, an
 *   in-page window manager, or an embedded surface.
 */

/** A command a title bar can request for its window. */
export type WindowChromeCommand = "close" | "minimize" | "restore" | "zoom";

/**
 * The app's verdict on a close request, reported by
 * {@linkcode WindowChromeHost.requestClose}. `vetoed` means the app's close
 * decision kept the window open; the window and its document are unchanged.
 */
export type WindowCloseResult =
  | { readonly closed: true }
  | { readonly closed: false; readonly reason: "vetoed" };

/**
 * Zoom (macOS) or maximize (Windows, drawn layouts). Present on
 * {@linkcode WindowChromeHost.zoom} only when the host can do it.
 */
export interface WindowZoomControl {
  /** Whether the window currently fills its zoomed or maximized frame. */
  isZoomed(windowId: string): boolean;
  /** Zooms or maximizes the window, or returns it to its previous frame. */
  toggleZoom(windowId: string): Promise<void>;
}

/**
 * What a title bar needs from a window owner. The macOS, Windows and page
 * hosts in this repository implement it over the shared registry; an app can
 * implement it for any other owner.
 *
 * @see {@linkcode createPageWindowHost}
 */
export interface WindowChromeHost {
  /** The app's window registry. */
  getState(): WindowRegistryState;
  /** Called after every registry change. Returns an idempotent unsubscribe. */
  subscribe(listener: () => void): () => void;
  /**
   * Asks to close a window. Resolves after the app's close decision has run:
   * `closed: true` once the window is gone, `closed: false` when it vetoed.
   * Rejects only when the host itself failed.
   */
  requestClose(windowId: string): Promise<WindowCloseResult>;
  /** Minimizes an open window. */
  minimize(windowId: string): Promise<void>;
  /** Restores a minimized window and focuses it. */
  restore(windowId: string): Promise<void>;
  /** Present when the host supports zoom or maximize. */
  readonly zoom?: WindowZoomControl;
}

/** Where drawn controls sit: `macos` leading, `windows` trailing. */
export type DrawnControlsLayout = "macos" | "windows";

/**
 * Space a native title bar gives to system-drawn controls, in logical points
 * (dp on Android, points on Apple platforms, effective pixels on Windows, CSS
 * pixels on the web). Leading and trailing follow layout direction.
 */
export interface TitleBarInsets {
  /** Width occupied at the leading edge (macOS window buttons, iPadOS window controls). */
  readonly leading: number;
  /** Width occupied at the trailing edge (Windows caption buttons). */
  readonly trailing: number;
  /** Height of the title-bar region the system reserves. */
  readonly height: number;
}

/** No system controls. */
export const NO_TITLE_BAR_INSETS: TitleBarInsets = Object.freeze({ leading: 0, trailing: 0, height: 0 });

/**
 * How window controls are presented.
 * - `drawn`: the title bar draws its own controls in the given layout.
 * - `native`: the system draws them; the title bar reserves `insets`.
 */
export type TitleBarControls =
  | { readonly kind: "drawn"; readonly layout: DrawnControlsLayout }
  | { readonly kind: "native"; readonly insets: TitleBarInsets };

/** Accessible names and visible labels for drawn controls. */
export interface WindowControlLabels {
  readonly close: string;
  readonly minimize: string;
  readonly restore: string;
  readonly zoom: string;
  /** Used for the zoom control while the window is zoomed. */
  readonly unzoom: string;
}

/** Default labels per layout. Pass `labels` to {@linkcode describeTitleBar} to localize. */
export const DEFAULT_WINDOW_CONTROL_LABELS = Object.freeze({
  macos: Object.freeze({ close: "Close window", minimize: "Minimize window", restore: "Restore window", zoom: "Zoom window", unzoom: "Zoom window" }),
  windows: Object.freeze({ close: "Close", minimize: "Minimize", restore: "Restore", zoom: "Maximize", unzoom: "Restore down" }),
} as const satisfies Record<DrawnControlsLayout, WindowControlLabels>);

/** One drawn control, as {@linkcode describeTitleBar} lays it out. */
export interface WindowControlDescriptor {
  readonly command: WindowChromeCommand;
  /** Accessible name; drawn layouts also use it as the tooltip. */
  readonly label: string;
  /** False while another command for this window is in flight. */
  readonly enabled: boolean;
  /** For `zoom`: whether the window is currently zoomed. */
  readonly pressed?: boolean;
}

/** What a title bar renders for one window. */
export interface TitleBarModel {
  readonly windowId: string;
  /** `closed` when the window is no longer in the registry. */
  readonly status: "open" | "minimized" | "closed";
  /** Whether this is the registry's focused window. Inactive title bars dim. */
  readonly focused: boolean;
  /** Drawn controls before the title, in reading order. Empty in native mode. */
  readonly leading: readonly WindowControlDescriptor[];
  /** Drawn controls after the title, in reading order. Empty in native mode. */
  readonly trailing: readonly WindowControlDescriptor[];
  /** Space to reserve for system controls. Zero in drawn mode. */
  readonly insets: TitleBarInsets;
}

/** Options for {@linkcode describeTitleBar}. */
export interface DescribeTitleBarOptions {
  readonly controls: TitleBarControls;
  /** Whether a zoom control is shown. Omit when the host has no zoom. */
  readonly zoomed?: boolean;
  /** Command currently in flight; every drawn control is disabled meanwhile. */
  readonly pending?: WindowChromeCommand;
  readonly labels?: Partial<WindowControlLabels>;
}

const validInset = (value: number) => Number.isFinite(value) && value >= 0 && value <= 10_000;

/**
 * Lays out the title bar for one window from registry state. Pure; call it on
 * every registry change.
 *
 * Drawn `macos` puts close, minimize and zoom before the title. Drawn
 * `windows` puts minimize, maximize and close after it. A minimized window
 * shows a single restore control instead. Native mode draws nothing and
 * carries the insets through.
 *
 * @throws {RangeError} When native insets are negative or not finite.
 */
export function describeTitleBar(state: WindowRegistryState, windowId: string, options: DescribeTitleBarOptions): TitleBarModel {
  const record = state.windows.find(window => window.id === windowId);
  const status = record ? record.status : "closed";
  const focused = state.focusedId === windowId;
  const { controls } = options;
  if (controls.kind === "native") {
    const { leading, trailing, height } = controls.insets;
    if (![leading, trailing, height].every(validInset)) throw new RangeError("Title bar insets must be finite, nonnegative logical points");
    return { windowId, status, focused, leading: [], trailing: [], insets: { leading, trailing, height } };
  }
  const labels = { ...DEFAULT_WINDOW_CONTROL_LABELS[controls.layout], ...options.labels };
  const enabled = options.pending === undefined && status !== "closed";
  const control = (command: WindowChromeCommand): WindowControlDescriptor => {
    if (command !== "zoom") return { command, label: labels[command], enabled };
    const pressed = options.zoomed === true;
    return { command, label: pressed ? labels.unzoom : labels.zoom, enabled, pressed };
  };
  let commands: WindowChromeCommand[];
  if (status === "minimized") commands = ["restore"];
  else if (status === "closed") commands = [];
  else if (controls.layout === "macos") commands = ["close", "minimize", ...(options.zoomed === undefined ? [] : ["zoom" as const])];
  else commands = ["minimize", ...(options.zoomed === undefined ? [] : ["zoom" as const]), "close"];
  const list = commands.map(control);
  return {
    windowId, status, focused,
    leading: controls.layout === "macos" ? list : [],
    trailing: controls.layout === "windows" ? list : [],
    insets: NO_TITLE_BAR_INSETS,
  };
}

/**
 * Result of {@linkcode WindowChromeController.run}.
 * - `done`: the host carried out the command.
 * - `vetoed`: a close request the app's close decision refused.
 * - `ignored`: nothing was sent, because another command for this window was
 *   in flight (`busy`), the command does not apply to the window's current
 *   state or host (`unavailable`), or the window is gone (`closed`).
 */
export type WindowCommandResult =
  | { readonly command: WindowChromeCommand; readonly status: "done" }
  | { readonly command: "close"; readonly status: "vetoed" }
  | { readonly command: WindowChromeCommand; readonly status: "ignored"; readonly reason: "busy" | "unavailable" | "closed" };

/** Title-bar state for one window, as {@linkcode WindowChromeController.getSnapshot} returns it. */
export interface WindowChromeSnapshot {
  readonly status: TitleBarModel["status"];
  readonly focused: boolean;
  /** Undefined when the host has no zoom. */
  readonly zoomed?: boolean;
  readonly pending?: WindowChromeCommand;
}

/**
 * Sends title-bar commands for one window to its host, one at a time.
 * Created by {@linkcode createWindowChromeController}.
 */
export interface WindowChromeController {
  readonly windowId: string;
  /** Cached snapshot; a new object only after a change. Suitable for `useSyncExternalStore`. */
  getSnapshot(): WindowChromeSnapshot;
  /** Called after any snapshot change. Returns an idempotent unsubscribe. */
  subscribe(listener: () => void): () => void;
  /**
   * Runs one command. A second command while one is in flight is `ignored`
   * with reason `busy`, so a double click cannot send two close requests.
   * Rejects with the host's error when the host fails.
   */
  run(command: WindowChromeCommand): Promise<WindowCommandResult>;
  /** Stops listening to the host. Commands already sent still settle. */
  dispose(): void;
}

/**
 * Binds one window's title bar to a {@linkcode WindowChromeHost}. Dispose it
 * when the title bar unmounts.
 *
 * @example
 * const chrome = createWindowChromeController(host, "document-1");
 * const result = await chrome.run("close");
 * if (result.status === "vetoed") showSaveReminder();
 * chrome.dispose();
 */
export function createWindowChromeController(host: WindowChromeHost, windowId: string): WindowChromeController {
  if (typeof windowId !== "string" || !windowId.trim()) throw new TypeError("A title bar needs a nonempty window ID");
  const listeners = new Set<() => void>();
  let pending: WindowChromeCommand | undefined;
  let disposed = false;
  const read = (): WindowChromeSnapshot => {
    const state = host.getState();
    const record = state.windows.find(window => window.id === windowId);
    return {
      status: record ? record.status : "closed",
      focused: state.focusedId === windowId,
      ...(host.zoom && record ? { zoomed: host.zoom.isZoomed(windowId) } : {}),
      ...(pending ? { pending } : {}),
    };
  };
  let snapshot = read();
  const refresh = () => {
    if (disposed) return;
    const next = read();
    if (next.status === snapshot.status && next.focused === snapshot.focused && next.zoomed === snapshot.zoomed && next.pending === snapshot.pending) return;
    snapshot = next;
    for (const listener of [...listeners]) listener();
  };
  const unsubscribe = host.subscribe(refresh);
  const send = async (command: WindowChromeCommand): Promise<WindowCommandResult> => {
    switch (command) {
      case "close": {
        const verdict = await host.requestClose(windowId);
        return verdict.closed ? { command, status: "done" } : { command, status: "vetoed" };
      }
      case "minimize": await host.minimize(windowId); return { command, status: "done" };
      case "restore": await host.restore(windowId); return { command, status: "done" };
      case "zoom":
        if (!host.zoom) return { command, status: "ignored", reason: "unavailable" };
        await host.zoom.toggleZoom(windowId); return { command, status: "done" };
    }
  };
  return {
    windowId,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    async run(command) {
      if (!["close", "minimize", "restore", "zoom"].includes(command)) throw new TypeError(`Unknown window command: ${String(command)}`);
      if (pending) return { command, status: "ignored", reason: "busy" };
      const current = read();
      if (current.status === "closed") return { command, status: "ignored", reason: "closed" };
      const applies = command === "restore" ? current.status === "minimized" : current.status === "open";
      if (!applies) return { command, status: "ignored", reason: "unavailable" };
      pending = command; refresh();
      try { return await send(command); }
      finally { pending = undefined; refresh(); }
    },
    dispose() {
      if (disposed) return;
      disposed = true; listeners.clear(); unsubscribe();
    },
  };
}

/** Options for {@linkcode createPageWindowHost}. */
export interface PageWindowHostOptions {
  /**
   * The app's close decision. Return false to keep the window open. A
   * rejected or throwing decision also keeps it open and is reported through
   * `onError`. Omitted: every close is allowed.
   */
  readonly beforeClose?: (windowId: string) => boolean | Promise<boolean>;
  /** Receives errors from `beforeClose`. Defaults to `console.error`. */
  readonly onError?: (error: unknown) => void;
}

/**
 * A {@linkcode WindowChromeHost} for windows the app draws itself: in-page
 * windows on the web, or any surface without native chrome. Created by
 * {@linkcode createPageWindowHost}.
 */
export interface PageWindowHost extends WindowChromeHost {
  readonly zoom: WindowZoomControl;
  /** Adds a window on top and focuses it. Returns the registry outcome. */
  open(spec: OpenWindowSpec): Outcome;
  /** Raises and focuses an open window. Returns the registry outcome. */
  focus(windowId: string): Outcome;
}

/**
 * Creates a host that owns a window registry in memory and applies every
 * command to it directly. Close requests run `beforeClose` first; concurrent
 * close requests for one window share one decision.
 *
 * @example
 * const host = createPageWindowHost({ beforeClose: id => !documents.isDirty(id) });
 * host.open({ id: "doc", displayId: "page", rect: { x: 0, y: 0, width: 640, height: 480 } });
 * await host.requestClose("doc"); // { closed: false, reason: "vetoed" } while dirty
 */
export function createPageWindowHost(options: PageWindowHostOptions = {}): PageWindowHost {
  let state = createWindowRegistry();
  const zoomed = new Set<string>();
  const listeners = new Set<() => void>();
  const closing = new Map<string, Promise<WindowCloseResult>>();
  const report = (error: unknown) => {
    try { (options.onError ?? console.error)(error); } catch (cause) { console.error(cause); }
  };
  const publish = (outcome: Outcome) => {
    if (outcome.ok && outcome.state !== state) {
      state = outcome.state;
      for (const id of [...zoomed]) if (!state.windows.some(window => window.id === id)) zoomed.delete(id);
      for (const listener of [...listeners]) listener();
    }
    return outcome;
  };
  const known = (windowId: string) => {
    if (!state.windows.some(window => window.id === windowId)) throw new Error(`Window is not owned by this host: ${windowId}`);
  };
  const decide = async (windowId: string): Promise<WindowCloseResult> => {
    let allow = false;
    try { allow = (await (options.beforeClose?.(windowId) ?? true)) === true; }
    catch (error) { report(error); }
    if (!allow) return { closed: false, reason: "vetoed" };
    // The window may have closed while the decision was pending.
    if (state.windows.some(window => window.id === windowId)) publish(closeWindow(state, windowId));
    return { closed: true };
  };
  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    open: spec => publish(openWindow(state, spec)),
    focus: windowId => publish(focusWindow(state, windowId)),
    requestClose(windowId) {
      try { known(windowId); } catch (error) { return Promise.reject(error); }
      const active = closing.get(windowId);
      if (active) return active;
      const decision = decide(windowId).finally(() => { closing.delete(windowId); });
      closing.set(windowId, decision);
      return decision;
    },
    async minimize(windowId) {
      known(windowId);
      const outcome = publish(minimizeWindow(state, windowId));
      if (!outcome.ok) throw new Error(`Cannot minimize ${windowId}: ${outcome.reason}`);
    },
    async restore(windowId) {
      known(windowId);
      const outcome = publish(restoreWindow(state, windowId));
      if (!outcome.ok) throw new Error(`Cannot restore ${windowId}: ${outcome.reason}`);
    },
    zoom: {
      isZoomed: windowId => zoomed.has(windowId),
      async toggleZoom(windowId) {
        known(windowId);
        if (zoomed.has(windowId)) zoomed.delete(windowId); else zoomed.add(windowId);
        for (const listener of [...listeners]) listener();
      },
    },
  };
}
