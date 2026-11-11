import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";
import { TronNavigationView } from "./TronNavigationView.windows.tsx";
import { navigationBindingOwner, type WindowsNavigationBinding } from "./navigation-binding.ts";

export { createWindowsNavigationBinding } from "./navigation-binding.ts";
export type { WindowsNavigationBinding } from "./navigation-binding.ts";

export interface WindowsNavigationHostProps {
  readonly binding: WindowsNavigationBinding;
  readonly style?: StyleProp<ViewStyle>;
  readonly onNativeError?: (error: Error) => void;
}

/** A real WinUI Fabric island, controlled through WindowsNativeNavigationTransport. */
export function WindowsNavigationHost({ binding, style, onNativeError }: WindowsNavigationHostProps) {
  if (Platform.OS !== "windows") throw new Error("WindowsNavigationHost requires the RNW Fabric native host");
  const owner = navigationBindingOwner(binding);
  const token = useRef<object>({});
  const state = useSyncExternalStore(owner.subscribe, owner.getSnapshot);
  useLayoutEffect(() => state.disposed ? undefined : owner.attach(token.current), [owner, state.disposed]);
  if (state.disposed) return null;
  return <TronNavigationView {...state} style={style} onNativeError={onNativeError}
    onSelectionRequested={id => owner.emit(token.current, { type: "destinationInvoked", id })}
    onPaneOpenRequested={open => owner.emit(token.current, { type: "paneOpenChanged", open })}
    onSettingsRequested={() => owner.emit(token.current, { type: "settingsInvoked" })} />;
}
