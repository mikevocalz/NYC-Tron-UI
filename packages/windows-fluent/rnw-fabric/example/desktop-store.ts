import { createStore } from "zustand/vanilla";
import { createWindowRegistry, type WindowRegistryState } from "@nyc-tron/core/window-lifecycle";
import { createWindowsWindowHost, type WindowsWindowHost } from "@nyc-tron/windows-fluent-fabric/windows";

interface DesktopState {
  windows: WindowRegistryState;
  title: string;
  savedTitle: string;
  status: string;
  ready: boolean;
}
// All native roots import this same module from the existing ReactNativeHost.
export const desktop = createStore<DesktopState>(() => ({
  windows: createWindowRegistry(), title: "A shared draft", savedTitle: "A shared draft", status: "Connecting native desktop", ready: false,
}));
let native: WindowsWindowHost | undefined;
let connecting: Promise<void> | undefined;
export const failDesktop = (error: unknown) => desktop.setState({ status: `Native desktop error: ${error instanceof Error ? error.message : String(error)}` });
export function connectDesktop() {
  return connecting ??= createWindowsWindowHost({
    primaryWindowId: "main", componentName: "NYCTronDocument",
    owner: { getState: () => desktop.getState().windows, commit: windows => { desktop.setState({ windows }); } },
    onCloseRequested: request => {
      const state = desktop.getState(), allow = state.title === state.savedTitle;
      if (!native) { failDesktop(new Error("Close requested before desktop connection completed")); return; }
      void native.resolveClose(request, allow).then(() => {
        desktop.setState({ status: allow ? "Native close accepted" : "Native close vetoed: unsaved draft retained" });
      }).catch(failDesktop);
    },
    onError: failDesktop,
  }).then(host => { native = host; desktop.setState({ ready: true, status: "Native desktop connected" }); });
}
export async function openDocument() {
  await connectDesktop();
  if (!native) throw new Error("Desktop did not connect");
  if (native.snapshot().windows.some(w => w.id === "document")) { await native.restore("document"); await native.focus("document"); return; }
  const display = native.snapshot().displays[0];
  await native.open({ id: "document", title: "NYC-Tron Document", displayId: display.id,
    rect: { x: display.bounds.x + 80, y: display.bounds.y + 80, width: 600, height: 520 } });
  desktop.setState({ status: "Native document window opened" });
}
export async function restoreDocument() {
  if (!native) throw new Error("Desktop is not connected");
  await native.restore("document"); await native.focus("document");
  desktop.setState({ status: "Native document restored" });
}
export function changeDraft() { desktop.setState({ title: "Edited once, shared everywhere", status: "Shared draft changed" }); }
export function saveDraft() { desktop.setState({ savedTitle: desktop.getState().title, status: "Shared draft saved in this session" }); }
