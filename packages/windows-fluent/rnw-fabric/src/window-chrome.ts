import type { WindowChromeHost, WindowCloseResult } from "@nyc-tron/core/window-chrome";
import type { WindowRegistryState } from "@nyc-tron/core/window-lifecycle";
import type { WindowsCloseRequest, WindowsTitleBar, WindowsWindowHost, WindowsWindowOwner } from "./window-types.ts";

/**
 * Bridges `@nyc-tron/core/window-chrome` title bars to a native Windows window
 * host. The bridge owns no window state: the registry stays with the app's
 * {@linkcode WindowsWindowOwner}, and the close decision stays with the app's
 * `beforeClose`.
 *
 * Close path. `requestClose(id)` sends a real `WM_CLOSE` through
 * {@linkcode WindowsWindowHost.requestClose}. The native `AppWindow.Closing`
 * handler cancels it and issues a close token, which arrives here as
 * `onCloseRequested`. The bridge runs `beforeClose(id)` once, passes the verdict
 * to {@linkcode WindowsWindowHost.resolveClose}, and only then settles the
 * caller's promise. A close from the system caption button, Alt+F4 or
 * `WindowPattern.Close` takes the same path with no caller waiting.
 *
 * Errors. A throwing or rejecting `beforeClose` keeps the window open
 * (`vetoed`) and is reported through `onError`. A failing native operation
 * rejects the waiting `requestClose` promise; on the system path, where nobody
 * waits, it is reported through `onError`.
 */
export interface WindowsChromeBridgeOptions {
  /** The app's registry owner. The bridge forwards to it and notifies title bars after each commit. */
  readonly owner: WindowsWindowOwner;
  /**
   * The app's close decision. Return false to keep the window open. Runs once
   * per native close request, however many callers are waiting for it.
   * Omitted: every close is allowed.
   */
  readonly beforeClose?: (windowId: string) => boolean | Promise<boolean>;
  /** Receives decision errors and native failures nobody awaits. Defaults to `console.error`. */
  readonly onError?: (error: unknown) => void;
}

/** A {@linkcode WindowChromeHost} over one connected native host. */
export interface WindowsChromeHost extends WindowChromeHost {
  /** The window's observed title bar, or undefined when it is not open in this connection. */
  titleBar(windowId: string): WindowsTitleBar | undefined;
}

/** Created by {@linkcode createWindowsChromeBridge}. */
export interface WindowsChromeBridge {
  /** Pass as `owner` to `createWindowsWindowHost`. */
  readonly owner: WindowsWindowOwner;
  /** Pass as `onCloseRequested` to `createWindowsWindowHost`. */
  readonly onCloseRequested: (request: WindowsCloseRequest) => void;
  /**
   * Binds the connected host. Close requests that arrived during the
   * connection run now. Call once.
   */
  attach(host: WindowsWindowHost): WindowsChromeHost;
  /** Stops notifying title bars. Pending `requestClose` promises reject. */
  dispose(): void;
}

interface CloseDecision {
  readonly promise: Promise<WindowCloseResult>;
  /** A native close token is being decided. */
  deciding: boolean;
  settled: boolean;
  settle(result: WindowCloseResult): void;
  fail(error: unknown): void;
}

/**
 * Creates the bridge before connecting, so the host reports its commits and
 * close requests through it.
 *
 * @example
 * const chrome = createWindowsChromeBridge({
 *   owner: { getState: () => store.getState().windows, commit: windows => store.setState({ windows }) },
 *   beforeClose: id => !documents.isDirty(id),
 *   onError: reportError,
 * });
 * const host = await createWindowsWindowHost({
 *   primaryWindowId: "main", componentName: "Document",
 *   owner: chrome.owner, onCloseRequested: chrome.onCloseRequested, onError: reportError,
 * });
 * const title = createWindowChromeController(chrome.attach(host), "document");
 * const result = await title.run("close"); // { command: "close", status: "vetoed" } while dirty
 */
export function createWindowsChromeBridge(options: WindowsChromeBridgeOptions): WindowsChromeBridge {
  const listeners = new Set<() => void>();
  const decisions = new Map<string, CloseDecision>();
  const early: WindowsCloseRequest[] = [];
  let host: WindowsWindowHost | undefined;
  let disposed = false;
  const report = (error: unknown) => {
    try { (options.onError ?? console.error)(error); } catch (cause) { console.error(cause); }
  };
  const notify = () => {
    if (disposed) return;
    for (const listener of [...listeners]) {
      try { listener(); } catch (error) { report(error); }
    }
  };
  const owner: WindowsWindowOwner = {
    getState: () => options.owner.getState(),
    commit(state: WindowRegistryState) { options.owner.commit(state); notify(); },
  };
  const open = (windowId: string) => options.owner.getState().windows.some(window => window.id === windowId);

  /** One shared decision per window; callers and the system path all observe it. */
  function decisionFor(windowId: string): CloseDecision {
    const existing = decisions.get(windowId);
    if (existing) return existing;
    let resolve!: (result: WindowCloseResult) => void, reject!: (error: unknown) => void;
    const promise = new Promise<WindowCloseResult>((onResolve, onReject) => { resolve = onResolve; reject = onReject; });
    // Waiting callers still see a rejection; a system close nobody awaits must not leak one.
    promise.catch(() => undefined);
    const finish = () => { decision.settled = true; if (decisions.get(windowId) === decision) decisions.delete(windowId); };
    const decision: CloseDecision = {
      promise, deciding: false, settled: false,
      settle(result) { if (decision.settled) return; finish(); resolve(result); },
      fail(error) { if (decision.settled) return; finish(); reject(error); },
    };
    decisions.set(windowId, decision);
    return decision;
  }

  async function decide(target: WindowsWindowHost, request: WindowsCloseRequest, decision: CloseDecision, awaited: boolean) {
    let allow = false;
    try { allow = (await (options.beforeClose?.(request.id) ?? true)) === true; }
    catch (error) { report(error); }
    try {
      await target.resolveClose(request, allow);
      decision.settle(allow ? { closed: true } : { closed: false, reason: "vetoed" });
    } catch (error) {
      if (!awaited) report(error);
      decision.fail(error);
    }
  }

  function onCloseRequested(request: WindowsCloseRequest) {
    if (disposed) return;
    if (!host) { early.push(request); return; }
    const awaited = decisions.has(request.id);
    const decision = decisionFor(request.id);
    // The native host issues one token per window until it is resolved.
    if (decision.deciding) { report(new Error(`Overlapping native close requests for ${request.id}`)); return; }
    decision.deciding = true;
    void decide(host, request, decision, awaited);
  }

  return {
    owner,
    onCloseRequested,
    attach(connected) {
      if (disposed) throw new Error("Windows chrome bridge has been disposed");
      if (host) throw new Error("Windows chrome bridge is already attached to a host");
      host = connected;
      for (const request of early.splice(0)) onCloseRequested(request);
      const chrome: WindowsChromeHost = {
        getState: owner.getState,
        subscribe(listener) {
          listeners.add(listener);
          return () => { listeners.delete(listener); };
        },
        requestClose(windowId) {
          if (disposed) return Promise.reject(new Error("Windows chrome bridge has been disposed"));
          if (!open(windowId)) return Promise.reject(new Error(`Window is not owned by this host: ${windowId}`));
          const pending = decisions.get(windowId);
          if (pending) return pending.promise;
          const decision = decisionFor(windowId);
          connected.requestClose(windowId).then(() => {
            // The native Closing handler issues its token before WM_CLOSE returns,
            // so the snapshot this command observed has already started a decision.
            if (decision.deciding || decision.settled) return;
            if (!open(windowId)) decision.settle({ closed: true });
            else decision.fail(new Error(`Native close of ${windowId} produced no close request`));
          }, error => { if (!decision.deciding) decision.fail(error); else report(error); });
          return decision.promise;
        },
        minimize: windowId => connected.minimize(windowId),
        async restore(windowId) {
          await connected.restore(windowId);
          await connected.focus(windowId);
        },
        titleBar(windowId) {
          return connected.snapshot().windows.find(window => window.id === windowId)?.titleBar;
        },
      };
      return chrome;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.clear(); early.length = 0;
      for (const decision of [...decisions.values()]) decision.fail(new Error("Windows chrome bridge has been disposed"));
    },
  };
}
