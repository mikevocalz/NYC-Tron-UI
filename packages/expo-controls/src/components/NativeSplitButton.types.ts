import type { TronMenuAction } from "./menu-model.ts";

/**
 * A primary action plus a separate flyout of related actions, on every
 * platform. The flyout takes the same {@linkcode TronMenuAction} tree as
 * `NativeActionMenu`; nested groups are flattened into one list.
 */
export interface NativeSplitButtonProps {
  readonly label:string;
  readonly onPress:()=>void;
  readonly actions:readonly TronMenuAction[];
  readonly onAction:(id:string)=>void;
  /** Accessible name of the flyout button. @default "More <label> options" */
  readonly menuLabel?:string;
  readonly disabled?:boolean;
  readonly testID?:string;
}
