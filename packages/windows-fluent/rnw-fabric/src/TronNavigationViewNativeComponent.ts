/**
 * Genuine WinUI 3 XAML NavigationView hosted in an RNW 0.85 Fabric
 * ContentIslandComponentView. Only this file is a native codegen spec;
 * typed destination arrays are serialized by the public wrapper below.
 *
 * Based on Microsoft RNW v0.85 FabricXamlComboBoxNativeComponent.ts (MIT).
 */
import {codegenNativeComponent, codegenNativeCommands} from "react-native";
import type {HostComponent, ViewProps} from "react-native";
import type React from "react";
import type {
  DirectEventHandler,
} from "react-native/Libraries/Types/CodegenTypes";

type DestinationInvoked = Readonly<{id:string}>;
type PaneOpenChanged = Readonly<{open:boolean}>;
type SettingsInvoked = Readonly<{id:string}>;
type NativeError = Readonly<{message:string}>;

export interface NativeProps extends ViewProps {
  itemsJson: string;
  footerItemsJson?: string;
  selectedId?: string;
  paneMode?: string;
  paneOpen?: boolean;
  paneTitle?: string;
  settingsVisible?: boolean;
  isRTL?: boolean;
  onDestinationInvoked?: DirectEventHandler<DestinationInvoked>;
  onPaneOpenChanged?: DirectEventHandler<PaneOpenChanged>;
  onSettingsInvoked?: DirectEventHandler<SettingsInvoked>;
  onNativeError?: DirectEventHandler<NativeError>;
}

interface NativeCommands {
  focusSelected: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
  focusSettings: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ["focusSelected", "focusSettings"],
});

export default codegenNativeComponent<NativeProps>("TronNavigationView");
