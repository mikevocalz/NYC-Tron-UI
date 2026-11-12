import { createStore } from "zustand/vanilla";
import { TurboModuleRegistry, type TurboModule } from "react-native";
import { createWindowRegistry, type WindowRegistryState } from "@nyc-tron/core/window-lifecycle";
import { createWindowChromeController, type WindowChromeCommand, type WindowChromeController } from "@nyc-tron/core/window-chrome";
import { createWindowsWindowHost, type WindowsTitleBar, type WindowsWindowHost } from "@nyc-tron/windows-fluent-fabric/windows";
import { createWindowsChromeBridge, type WindowsChromeHost } from "@nyc-tron/windows-fluent-fabric/window-chrome";

interface DesktopState {
  windows: WindowRegistryState;
  title: string;
  savedTitle: string;
  status: string;
  ready: boolean;
  /** The document window's observed title bar; undefined while it is closed. */
  titleBar?: WindowsTitleBar;
  /** Last title-bar command result per command, as `sequence:status`. */
  chrome: Record<WindowChromeCommand, string>;
  chromeSequence: number;
  /** Close decisions made by the app's guard, as `count:last verdict`. */
  closeDecisions: string;
}
// All native roots import this same module from the existing ReactNativeHost.
export const desktop = createStore<DesktopState>(() => ({
  windows: createWindowRegistry(), title: "A shared draft", savedTitle: "A shared draft", status: "Connecting native desktop", ready: false,
  chrome: { close: "0:none", minimize: "0:none", restore: "0:none", zoom: "0:none" }, chromeSequence: 0, closeDecisions: "0:none",
}));
let native: WindowsWindowHost | undefined;
let chromeHost: WindowsChromeHost | undefined;
let documentChrome: WindowChromeController | undefined;
let connecting: Promise<void> | undefined;
// The acceptance app opts into the internal generated module hook. It is not
// part of WindowsWindowHost or any public package export, and accepts no path.
interface NativeDragDiagnosticHook extends TurboModule {
  enableNativeDragDiagnostics(ownerToken: string): Promise<void>;
}
export const getNativeHost = () => native;
export const failDesktop = (error: unknown) => desktop.setState({ status: `Native desktop error: ${error instanceof Error ? error.message : String(error)}` });
const observedTitleBar = () => chromeHost?.titleBar("document");

// The bridge owns no state. Every close of the document, from the system
// caption button, WindowPattern.Close or the title-bar controller, reaches
// this one guard, and the app alone decides it.
const chrome = createWindowsChromeBridge({
  owner: {
    getState: () => desktop.getState().windows,
    commit: windows => { desktop.setState({ windows, titleBar: observedTitleBar() }); },
  },
  beforeClose: () => {
    const state = desktop.getState(), allow = state.title === state.savedTitle;
    const count = Number(state.closeDecisions.split(":")[0]) + 1;
    desktop.setState({
      closeDecisions: `${count}:${allow ? "proceed" : "cancel"}`,
      status: allow ? "Native close accepted" : "Native close vetoed: unsaved draft retained",
    });
    return allow;
  },
  onError: failDesktop,
});

export function connectDesktop() {
  return connecting ??= createWindowsWindowHost({
    primaryWindowId: "main", componentName: "NYCTronDocument",
    owner: chrome.owner, onCloseRequested: chrome.onCloseRequested, onError: failDesktop,
  }).then(async host => {
    native = host;
    chromeHost = chrome.attach(host);
    documentChrome = createWindowChromeController(chromeHost, "document");
    await TurboModuleRegistry.getEnforcing<NativeDragDiagnosticHook>("TronDesktop").enableNativeDragDiagnostics(host.snapshot().ownerToken);
    desktop.setState({ ready: true, status: "Native desktop connected" });
  });
}
export async function openDocument() {
  await connectDesktop();
  if (!native) throw new Error("Desktop did not connect");
  if (native.snapshot().windows.some(w => w.id === "document")) { await native.restore("document"); await native.focus("document"); return; }
  const display = native.snapshot().displays[0];
  await native.open({ id: "document", title: "NYC-Tron Document", displayId: display.id,
    rect: { x: display.bounds.x + 80, y: display.bounds.y + 80, width: 600, height: 520 } });
  desktop.setState({ status: "Native document window opened", titleBar: observedTitleBar() });
}
export async function restoreDocument() {
  if (!native) throw new Error("Desktop is not connected");
  await native.restore("document"); await native.focus("document");
  desktop.setState({ status: "Native document restored" });
}
/**
 * Puts the document's content under the system caption buttons. The style
 * lasts until the native window closes; a reopened window starts standard.
 */
export async function extendDocumentTitleBar() {
  if (!native) throw new Error("Desktop is not connected");
  const titleBar = await native.setTitleBar("document", "extended");
  desktop.setState({ titleBar, status: `Custom title bar: trailing ${Math.round(titleBar.trailing)}, height ${Math.round(titleBar.height)}` });
}
/** Sends one title-bar command for the document through the shared chrome controller. */
export function runDocumentChrome(command: WindowChromeCommand) {
  if (!documentChrome) { failDesktop(new Error("Desktop is not connected")); return; }
  const record = (value: string) => {
    const chromeSequence = desktop.getState().chromeSequence + 1;
    desktop.setState({ chromeSequence, chrome: { ...desktop.getState().chrome, [command]: `${chromeSequence}:${value}` } });
  };
  documentChrome.run(command).then(
    result => record(result.status === "ignored" ? `ignored-${result.reason}` : result.status),
    error => { record("error"); failDesktop(error); });
}
export function changeDraft() { desktop.setState({ title: "Edited once, shared everywhere", status: "Shared draft changed" }); }
/** Leaves the draft text alone but marks it unsaved, so the close guard cancels again. */
export function markDraftUnsaved() { desktop.setState({ savedTitle: "", status: "Shared draft has unsaved changes" }); }
export function saveDraft() { desktop.setState({ savedTitle: desktop.getState().title, status: "Shared draft saved in this session" }); }
