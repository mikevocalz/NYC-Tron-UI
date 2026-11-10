import { Platform } from "react-native";
import NativeDesktop from "./NativeTronDesktop.ts";
import { connectWindowsWindowHost } from "./window-controller.ts";
import type { WindowsWindowHostOptions, WindowsWindowHost } from "./window-types.ts";

export type * from "./window-types.ts";

/** Connect to the current RNW 0.85 host; additional native surfaces reuse its one JS runtime. */
export function createWindowsWindowHost(options: WindowsWindowHostOptions): Promise<WindowsWindowHost> {
  if (Platform.OS !== "windows") throw new Error("Windows window hosting requires the RNW 0.85 Fabric native module");
  return connectWindowsWindowHost(NativeDesktop, options);
}
