import { codegenNativeComponent, codegenNativeCommands } from "react-native";
import type { HostComponent, ViewProps } from "react-native";
import type React from "react";
import type { DirectEventHandler, Int32 } from "react-native/Libraries/Types/CodegenTypes";

export interface NativeProps extends ViewProps {
  kind: string;
  scopeToken: string;
  label: string;
  itemsJson: string;
  fieldsJson: string;
  actionsJson: string;
  title?: string;
  description?: string;
  tooltip?: string;
  open?: boolean;
  disabled?: boolean;
  theme?: string;
  isRTL?: boolean;
  onAction?: DirectEventHandler<Readonly<{ scopeToken: string; id: string }>>;
  onFieldChanged?: DirectEventHandler<Readonly<{ scopeToken: string; id: string; value: string; eventCount: Int32 }>>;
  onOpenChanged?: DirectEventHandler<Readonly<{ scopeToken: string; open: boolean; requestId: string }>>;
  onNativeError?: DirectEventHandler<Readonly<{ scopeToken: string; message: string }>>;
}
interface NativeCommands {
  acknowledgeDismissal: (viewRef: React.ElementRef<HostComponent<NativeProps>>, scopeToken: string, requestId: string) => void;
}
export const Commands = codegenNativeCommands<NativeCommands>({ supportedCommands: ["acknowledgeDismissal"] });
export default codegenNativeComponent<NativeProps>("TronOverlayAnchor");
