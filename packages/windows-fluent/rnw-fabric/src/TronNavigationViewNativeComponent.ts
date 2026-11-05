/**
 * Genuine WinUI 3 XAML NavigationView hosted in an RNW 0.85 Fabric
 * ContentIslandComponentView. Only this file is a native codegen spec;
 * typed destination arrays are serialized by the public wrapper below.
 *
 * Based on Microsoft RNW v0.85 FabricXamlComboBoxNativeComponent.ts (MIT).
 */
import {codegenNativeComponent} from "react-native";
import type {ViewProps} from "react-native";
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

export default codegenNativeComponent<NativeProps>("TronNavigationView");
