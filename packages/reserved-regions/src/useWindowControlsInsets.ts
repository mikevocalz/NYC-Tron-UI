// Web and other hosts: the page has no system window controls over its
// content, so the inset is zero. Drawn controls come from WindowTitleBar.
import type { TitleBarInsets } from "@nyc-tron/core/window-chrome";
import { NO_WINDOW_CONTROLS } from "./payload.ts";

/** Always {@linkcode NO_WINDOW_CONTROLS} outside iPadOS. */
export function useWindowControlsInsets(): TitleBarInsets {
  return NO_WINDOW_CONTROLS;
}
