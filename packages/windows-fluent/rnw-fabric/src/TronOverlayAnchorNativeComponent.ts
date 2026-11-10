import { codegenNativeComponent } from "react-native";
import type { ViewProps } from "react-native";
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
  onOpenChanged?: DirectEventHandler<Readonly<{ scopeToken: string; open: boolean }>>;
  onNativeError?: DirectEventHandler<Readonly<{ scopeToken: string; message: string }>>;
}
export default codegenNativeComponent<NativeProps>("TronOverlayAnchor");
