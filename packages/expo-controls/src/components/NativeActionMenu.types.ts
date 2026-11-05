import type { ReactNode } from "react";
import type { TronMenuAction } from "./menu-model.ts";
export interface NativeActionMenuProps {
  readonly trigger: ReactNode;
  readonly actions: readonly TronMenuAction[];
  readonly onAction: (id: string) => void;
  readonly longPress?: boolean;
  readonly disabled?: boolean;
  readonly accessibilityLabel: string;
  readonly testID?: string;
}
