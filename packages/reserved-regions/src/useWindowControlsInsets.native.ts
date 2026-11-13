// iPadOS window controls: where the system's close, minimize and tile
// buttons sit when the app runs in a resizable window (iPadOS 26+). The native
// module answers the space they take from the top corner; a toolbar adds it as
// padding so none of its controls sit underneath. Android has no such controls
// and answers zeros, as does iOS before 26, full screen, and a binary without
// the module.
//
// UIKit posts no change notification for this, so the hook re-reads it when the
// window size changes. Entering and leaving windowed mode both resize the window.
import { requireOptionalNativeModule } from "expo";
import { useEffect, useRef } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import type { TitleBarInsets } from "@nyc-tron/core/window-chrome";
import { NATIVE_MODULE_NAME, NO_WINDOW_CONTROLS, toWindowControlsInsets, windowControlsEqual } from "./payload.ts";

interface WindowControlsNative { windowControlsInsets?(): Promise<unknown> }

const native = Platform.OS === "ios" ? requireOptionalNativeModule<WindowControlsNative>(NATIVE_MODULE_NAME) : null;

/**
 * Space the iPadOS window controls take at the top of this window, in logical
 * points. Pass it to `WindowTitleBar` as `controls={{ kind: "native", insets }}`
 * or pad a toolbar by `leading`/`trailing` and `height`.
 *
 * @example
 * const insets = useWindowControlsInsets();
 * <View style={{ paddingStart: insets.leading, minHeight: Math.max(44, insets.height) }}>{tools}</View>
 */
export function useWindowControlsInsets(): TitleBarInsets {
  const { width, height } = useWindowDimensions();
  const storeRef = useRef<StoreApi<{ insets: TitleBarInsets }> | null>(null);
  storeRef.current ??= createStore<{ insets: TitleBarInsets }>(() => ({ insets: NO_WINDOW_CONTROLS }));
  const store = storeRef.current;
  const insets = useStore(store, state => state.insets);
  useEffect(() => {
    const read = native?.windowControlsInsets;
    if (!read) return;
    let live = true;
    const accept = (payload: unknown) => {
      if (!live) return;
      const next = toWindowControlsInsets(payload);
      if (!windowControlsEqual(store.getState().insets, next)) store.setState({ insets: next });
    };
    // A failed read means "no controls known", never a crash.
    read.call(native).then(accept, () => accept(NO_WINDOW_CONTROLS));
    return () => { live = false; };
  }, [width, height, store]);
  return insets;
}
