// Fold and camera geometry for the current window on iOS and Android.
//
// Both platforms register an Expo Modules 2 module named NYCTronReservedRegions.
// Android: SDK 58 exposes @ExpoModule objects on globalThis.expoV2.modules, not
// through the legacy ModuleDefinition bridge, and only a v2 @Event can emit the
// bare region array. Apple: the Swift @ExpoModule stays reachable through
// requireOptionalNativeModule. No module linked -> no regions, never a throw.
//
// iOS has no reserved-region change notification, so it re-queries when the
// window size changes (every fold and unfold resizes the window). Android also
// subscribes to "changed" from WindowInfoTracker; the window size stays a
// dependency because an Activity replacement can outlive the JS listener.
// Ported from NYC-MON packages/ui/reserved-regions.native.ts.
import { requireOptionalNativeModule } from "expo";
import { useEffect, useRef } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import type { ReservedRegion } from "@nyc-tron/core/folds";
import { NATIVE_MODULE_NAME, NO_REGIONS, regionsEqual, toRegions } from "./payload.ts";
import { useReservedRegionsOverride } from "./ReservedRegionsOverride.tsx";

interface NativeSubscription { remove(): void }
interface ReservedRegionsNative {
  query(): Promise<unknown>;
  addListener?(eventName: "changed", listener: (payload: unknown) => void): NativeSubscription;
}
interface ExpoModulesV2Global {
  expoV2?: { modules?: Record<string, ReservedRegionsNative | undefined> };
}

const legacyNative = requireOptionalNativeModule<ReservedRegionsNative>(NATIVE_MODULE_NAME);

function nativeModule(): ReservedRegionsNative | null {
  const v2 = (globalThis as typeof globalThis & ExpoModulesV2Global).expoV2?.modules?.[NATIVE_MODULE_NAME];
  return v2 ?? legacyNative ?? null;
}

/** True when this binary links the native module. */
export function isReservedRegionsAvailable(): boolean {
  return nativeModule() !== null;
}

type RegionsState = { regions: readonly ReservedRegion[] };

/**
 * The window's reserved regions: fold divisions (and, on iOS 27.1+, camera
 * occlusions) in window-relative layout units. Empty on hardware without a
 * fold, on iOS SDKs before 27.1, and when the module is not linked. A
 * ReservedRegionsOverride above wins over the native report.
 */
export function useReservedRegions(): readonly ReservedRegion[] {
  const override = useReservedRegionsOverride();
  const { width, height } = useWindowDimensions();
  const storeRef = useRef<StoreApi<RegionsState> | null>(null);
  storeRef.current ??= createStore<RegionsState>(() => ({ regions: NO_REGIONS }));
  const store = storeRef.current;
  const regions = useStore(store, state => state.regions);

  useEffect(() => {
    const native = override === null ? nativeModule() : null;
    if (!native) return;
    let live = true;
    const accept = (payload: unknown) => {
      if (!live) return;
      const next = toRegions(payload);
      if (!regionsEqual(store.getState().regions, next)) store.setState({ regions: next });
    };
    // Snapshot first. On Android this also moves the WindowInfoTracker Flow to
    // a replacement Activity. A failed read is "no fold known", not a crash.
    native.query().then(accept, () => accept(NO_REGIONS));
    const subscription = Platform.OS === "android" ? native.addListener?.("changed", accept) : undefined;
    return () => {
      live = false;
      subscription?.remove();
    };
  }, [width, height, store, override]);

  return override ?? regions;
}
