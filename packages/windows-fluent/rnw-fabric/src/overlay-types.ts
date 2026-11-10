import type { StyleProp, ViewStyle } from "react-native";
import type { CommandMenuItem } from "@nyc-tron/core/overlays";

export type { CommandMenuItem } from "@nyc-tron/core/overlays";
export interface WindowsOverlayAnchorProps {
  /** Document/selection identity. Changing it invalidates queued native events and resets edit counts. */
  readonly scopeId: string;
  /** A real native Button is the keyboard/pointer anchor and receives this accessible name. */
  readonly label: string;
  readonly disabled?: boolean;
  readonly tooltip?: string;
  /** Resolved by the application; defaults to the native system appearance. */
  readonly theme?: "system" | "light" | "dark";
  readonly style?: StyleProp<ViewStyle>;
  readonly onNativeError?: (error: Error) => void;
}
export interface WindowsMenuProps extends WindowsOverlayAnchorProps {
  readonly items: readonly CommandMenuItem[];
  readonly onActionRequested: (id: string) => void;
  readonly onOpenChanged?: (open: boolean) => void;
}
export interface WindowsInspectorField {
  readonly id: string;
  readonly label: string;
  /** App-committed value; acknowledge every edit, including a rejected edit. */
  readonly value: string;
  /** Latest handled native event in this mounted scope, initially zero. */
  readonly acknowledgedEventCount?: number;
  readonly readOnly?: boolean;
}
export interface WindowsInspectorEditRequest {
  readonly scopeId: string;
  readonly id: string;
  readonly value: string;
  /** Commit this count with the accepted value, or with the prior value to reject. */
  readonly eventCount: number;
}
export interface WindowsPopoverProps extends WindowsOverlayAnchorProps {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly fields?: readonly WindowsInspectorField[];
  readonly actions?: readonly CommandMenuItem[];
  readonly onOpenRequested: (open: boolean) => void;
  readonly onFieldChangeRequested?: (request: WindowsInspectorEditRequest) => void;
  readonly onActionRequested?: (id: string) => void;
}
export interface WindowsTooltipProps extends WindowsOverlayAnchorProps {
  readonly tooltip: string;
  readonly onPress?: () => void;
}
