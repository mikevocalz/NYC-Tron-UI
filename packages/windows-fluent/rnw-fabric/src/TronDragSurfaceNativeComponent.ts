import { codegenNativeComponent } from "react-native";
import type { ViewProps } from "react-native";
import type { DirectEventHandler } from "react-native/Libraries/Types/CodegenTypes";
export interface NativeProps extends ViewProps {
  scopeToken: string;
  dragRole: string;
  ownerToken: string;
  windowId: string;
  generation: string;
  label: string;
  disabled?: boolean;
  onDragStarting?: DirectEventHandler<Readonly<{ scopeToken: string; requestId: string }>>;
  onNativeError?: DirectEventHandler<Readonly<{ message: string }>>;
}
export default codegenNativeComponent<NativeProps>("TronDragSurface");
