import type { TitleBarInsets, WindowChromeHost, WindowCloseResult, WindowZoomControl } from '@nyc-tron/core/window-chrome';
import type { WindowInfo } from '@legendapp/spark/windows';
import type { WindowController } from './window-controller.ts';

/**
 * macOS window chrome over Spark 0.0.2 and the shared window registry.
 *
 * AppKit draws the close, minimize and zoom buttons in every style below. This
 * module never hides, draws or redraws them; it only chooses a title-bar
 * style, forwards title-bar commands to the window controller, and reports
 * the space the system buttons occupy so app content can avoid them.
 *
 * @example
 * // Open a document whose content runs under a transparent title bar.
 * import { createMacOSWindowHost, createMacOSWindowChrome } from '@nyc-tron/macos-appkit/windows';
 * import { macOSTitleBarOptions } from '@nyc-tron/macos-appkit/window-chrome';
 * import { createWindowChromeController } from '@nyc-tron/core/window-chrome';
 *
 * const windows = createMacOSWindowHost({ beforeClose: id => !documents.isDirty(id) });
 * const chrome = createMacOSWindowChrome(windows);
 * await windows.open({ id: 'doc', component: 'Doc', ...macOSTitleBarOptions('contentUnderTitleBar') });
 * const insets = await chrome.readInsets('doc'); // pad content by insets.height, indent by insets.leading
 * const titleBar = createWindowChromeController(chrome, 'doc');
 * const result = await titleBar.run('close'); // { command: 'close', status: 'vetoed' } while dirty
 * titleBar.dispose();
 * chrome.dispose();
 */

/**
 * How a macOS window presents its title bar. The system window buttons stay
 * visible and enabled in every style.
 * - `standard`: opaque title bar with the window title.
 * - `hiddenTitle`: opaque title bar, title text hidden.
 * - `contentUnderTitleBar`: transparent title bar with the title hidden; the
 *   content view fills the whole frame, so the app must reserve
 *   {@linkcode MacOSWindowChromeHost.readInsets} at its top and leading edge.
 */
export type MacOSTitleBarStyle = 'standard' | 'hiddenTitle' | 'contentUnderTitleBar';

/**
 * The Spark 0.0.2 open/update options for one {@linkcode MacOSTitleBarStyle}.
 * Spread it into `openWindow` or `setWindowOptions`. When the call also
 * passes other `macos` options, merge `macos` by hand, because a spread
 * replaces it.
 */
export interface MacOSTitleBarSparkOptions {
  readonly titleBarStyle: 'default' | 'overlay';
  readonly macos: {
    readonly titleBar: {
      readonly titleVisibility: 'visible' | 'hidden';
      readonly transparent: boolean;
      readonly contentLayout: 'contentLayoutGuide' | 'fullSize';
    };
  };
}

const TITLE_BAR_STYLES: Readonly<Record<MacOSTitleBarStyle, MacOSTitleBarSparkOptions>> = Object.freeze({
  standard: { titleBarStyle: 'default', macos: { titleBar: { titleVisibility: 'visible', transparent: false, contentLayout: 'contentLayoutGuide' } } },
  // Spark applies `titleBarStyle` first (which shows the title for "default")
  // and the `macos.titleBar` group second, so the title stays hidden.
  hiddenTitle: { titleBarStyle: 'default', macos: { titleBar: { titleVisibility: 'hidden', transparent: false, contentLayout: 'contentLayoutGuide' } } },
  // "fullSize" sizes the React root to the whole content view. Without it
  // Spark keeps the root inside contentLayoutRect, below the title bar.
  contentUnderTitleBar: { titleBarStyle: 'overlay', macos: { titleBar: { titleVisibility: 'hidden', transparent: true, contentLayout: 'fullSize' } } },
});

/**
 * Maps a title-bar style to Spark options. Pure. It never yields Spark's
 * `hidden` or `borderless` styles and never sets `trafficLights`, so the
 * system buttons are always present.
 *
 * @throws {TypeError} For a value outside {@linkcode MacOSTitleBarStyle}.
 * @example
 * await spark.setWindowOptions('doc', macOSTitleBarOptions('hiddenTitle'));
 */
export function macOSTitleBarOptions(style: MacOSTitleBarStyle): MacOSTitleBarSparkOptions {
  if (!Object.prototype.hasOwnProperty.call(TITLE_BAR_STYLES, style)) throw new TypeError(`Unknown macOS title bar style: ${String(style)}`);
  const { titleBarStyle, macos: { titleBar } } = TITLE_BAR_STYLES[style];
  return { titleBarStyle, macos: { titleBar: { ...titleBar } } };
}

/**
 * Validates native title-bar insets: an object, or its JSON text, with
 * finite `leading`, `trailing` and `height` between 0 and 10,000 points.
 * Extra fields are dropped.
 *
 * @throws {TypeError} For malformed JSON or a missing field.
 * @throws {RangeError} For a negative, infinite or oversized value.
 */
export function validateTitleBarInsets(value: unknown): TitleBarInsets {
  let parsed = value;
  if (typeof value === 'string') {
    try { parsed = JSON.parse(value); } catch { throw new TypeError('Title bar insets are not valid JSON'); }
  }
  if (!parsed || typeof parsed !== 'object') throw new TypeError('Title bar insets must be an object');
  const record = parsed as Record<string, unknown>;
  const read = (key: 'leading' | 'trailing' | 'height') => {
    const field = record[key];
    if (typeof field !== 'number') throw new TypeError(`Title bar inset ${key} must be a number`);
    if (!Number.isFinite(field) || field < 0 || field > 10_000) throw new RangeError(`Title bar inset ${key} must be finite and between 0 and 10000 points`);
    return field;
  };
  return Object.freeze({ leading: read('leading'), trailing: read('trailing'), height: read('height') });
}

/**
 * Native operations the chrome host needs besides the window controller.
 * Injected for tests; {@linkcode createMacOSWindowChrome} in
 * `@nyc-tron/macos-appkit/windows` supplies Spark and the native module.
 */
export interface MacOSWindowChromeTransport {
  /** Spark `getWindow`; only `maximized` is read. */
  info(windowId: string): Promise<Pick<WindowInfo, 'maximized'>>;
  /** Spark `maximizeWindow`: AppKit zoom when the window is not zoomed. */
  maximize(windowId: string): Promise<void>;
  /** Spark `unmaximizeWindow`: AppKit zoom back when the window is zoomed. */
  unmaximize(windowId: string): Promise<void>;
  /** Native button frames as JSON text or an object; validated by the host. */
  readInsets(windowId: string): Promise<unknown>;
}

/** Options for {@linkcode createMacOSWindowChromeHost}. */
export interface MacOSWindowChromeHostOptions {
  /** Receives zoom refresh failures, which have no caller to reject. Defaults to `console.error`. */
  readonly onError?: (error: unknown) => void;
}

/**
 * A {@linkcode WindowChromeHost} for real AppKit windows. Created by
 * {@linkcode createMacOSWindowChromeHost}.
 */
export interface MacOSWindowChromeHost extends WindowChromeHost {
  /** Zoom through AppKit. `isZoomed` reads a cache of `WindowInfo.maximized`. */
  readonly zoom: WindowZoomControl;
  /**
   * Reads the space AppKit's window buttons occupy in one window, measured
   * from the real button frames. `leading` is the distance from the leading
   * edge (the right edge in right-to-left layouts) to the far side of the
   * button group, `trailing` is 0, and `height` is the title-bar height.
   * Rejects when the window does not exist or native data is invalid.
   */
  readInsets(windowId: string): Promise<TitleBarInsets>;
  /** Stops observing the window controller. Idempotent; the controller itself stays live. */
  dispose(): void;
}

/**
 * Adapts a {@linkcode WindowController} to the shared chrome contract.
 *
 * - `requestClose` goes through `controller.close`, so the app's
 *   `beforeClose` decision runs first; a veto resolves
 *   `{ closed: false, reason: 'vetoed' }` and leaves the window open.
 * - `minimize` miniaturizes; `restore` deminiaturizes and focuses (Spark
 *   `showWindow` with focus).
 * - `zoom.toggleZoom` reads `WindowInfo.maximized` and calls maximize or
 *   unmaximize. The zoom cache refreshes after every registry change, which
 *   the controller publishes when Spark reports `boundsChanged`, so a click
 *   on the system zoom button is observed too.
 *
 * Rejections from the controller or Spark reach the caller unchanged.
 */
export function createMacOSWindowChromeHost(
  controller: WindowController,
  transport: MacOSWindowChromeTransport,
  options: MacOSWindowChromeHostOptions = {},
): MacOSWindowChromeHost {
  const listeners = new Set<() => void>();
  const zoomed = new Map<string, boolean>();
  // One zoom read per window at a time; a change during a read schedules one more.
  const reading = new Map<string, { again: boolean }>();
  let disposed = false;
  const report = (error: unknown) => {
    try { (options.onError ?? console.error)(error); } catch (cause) { console.error(cause); }
  };
  const notify = () => { for (const listener of [...listeners]) { try { listener(); } catch (error) { report(error); } } };
  const owned = (windowId: string) => controller.getSnapshot().windows.some(window => window.id === windowId);
  const remember = (windowId: string, value: boolean) => {
    if (disposed || !owned(windowId) || zoomed.get(windowId) === value) return;
    zoomed.set(windowId, value); notify();
  };
  const readZoom = (windowId: string) => {
    const active = reading.get(windowId);
    if (active) { active.again = true; return; }
    const entry = { again: false };
    reading.set(windowId, entry);
    void (async () => {
      do {
        entry.again = false;
        try { remember(windowId, (await transport.info(windowId)).maximized === true); }
        catch (error) { if (!disposed && owned(windowId)) report(error); }
      } while (entry.again && !disposed && owned(windowId));
      reading.delete(windowId);
    })();
  };
  const sync = () => {
    if (disposed) return;
    const ids = new Set(controller.getSnapshot().windows.map(window => window.id));
    for (const id of [...zoomed.keys()]) if (!ids.has(id)) zoomed.delete(id);
    notify();
    for (const id of ids) readZoom(id);
  };
  const unsubscribe = controller.subscribe(sync);
  for (const window of controller.getSnapshot().windows) readZoom(window.id);
  return {
    getState: () => controller.getSnapshot(),
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    async requestClose(windowId): Promise<WindowCloseResult> {
      const result = await controller.close(windowId);
      return result.closed ? { closed: true } : { closed: false, reason: 'vetoed' };
    },
    minimize: windowId => controller.minimize(windowId),
    restore: windowId => controller.focus(windowId),
    zoom: {
      isZoomed: windowId => zoomed.get(windowId) === true,
      async toggleZoom(windowId) {
        if (!owned(windowId)) throw new Error('Window is not owned by this host');
        const before = await transport.info(windowId);
        if (before.maximized) await transport.unmaximize(windowId); else await transport.maximize(windowId);
        remember(windowId, (await transport.info(windowId)).maximized === true);
      },
    },
    async readInsets(windowId) {
      if (typeof windowId !== 'string' || !windowId.trim()) throw new TypeError('readInsets needs a nonempty window ID');
      return validateTitleBarInsets(await transport.readInsets(windowId));
    },
    dispose() {
      if (disposed) return;
      disposed = true; listeners.clear(); zoomed.clear(); unsubscribe();
    },
  };
}
