import type { ReactNode } from "react";
import type { TronMenuAction } from "./menu-model.ts";

/** Secondary actions for a target, opened by the platform's context-menu inputs. */
export interface ContextMenuProps {
  /** Name of the target, e.g. "Harbor photo layer". */
  readonly accessibilityLabel:string;
  readonly actions:readonly TronMenuAction[];
  readonly onAction:(id:string)=>void;
  readonly children:ReactNode;
  readonly scope?:string;
  readonly disabled?:boolean;
  readonly testID?:string;
}
