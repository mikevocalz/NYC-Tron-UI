import type { ReactNode } from "react";
import type { ForgeIconOptions } from "./index.js";
export interface TronIconProps extends ForgeIconOptions {
  name: string;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  hovered?: boolean;
  /**
   * Label for a meaningful standalone icon; exposes it as one image. Omit for
   * decorative icons, which are hidden from assistive technology. Ignored by
   * `TronIconButton`, whose `label` names the button.
   */
  accessibilityLabel?: string;
  testID?: string;
  renderRive?: (inputs: {
    name: string;
    selected: boolean;
    disabled: boolean;
    loading: boolean;
    pressed: boolean;
    hovered: boolean;
    status: "idle" | "success" | "error" | "recording";
    color: string;
    size: number;
    reducedMotion: boolean;
    artboard: "ForgeIcon";
    stateMachine: "ForgeIconStates";
  }) => ReactNode;
}
export interface TronIconButtonProps extends TronIconProps {
  label: string;
  onPress: () => void;
}
export declare function TronIcon(props: TronIconProps): ReactNode;
export declare function TronIconButton(props: TronIconButtonProps): ReactNode;
export { TronIcon as ForgeIcon, TronIconButton as ForgeIconButton };
