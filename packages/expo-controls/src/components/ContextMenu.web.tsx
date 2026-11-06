import { ContextMenu as ShellContextMenu } from "@nyc-tron/ui/components/shell/ContextMenu";
import type { ContextMenuProps } from "./ContextMenu.types.ts";
import { enabledMenuLeaves, normalizeMenuActions } from "./menu-model.ts";
export type { ContextMenuProps } from "./ContextMenu.types.ts";

/**
 * Web: right-click and stylus barrel click (`contextmenu`), long press,
 * Shift+F10 and the Menu key, through the `@nyc-tron/ui` shell ContextMenu.
 * Sections are flattened; disabled branches are left out.
 */
export function ContextMenu({scope,accessibilityLabel,actions,onAction,children,disabled,testID}:ContextMenuProps){
  normalizeMenuActions(actions);
  const items=enabledMenuLeaves(actions).map(a=>({id:a.id,label:a.title,danger:a.destructive}));
  return <ShellContextMenu scope={scope} label={accessibilityLabel} items={items} onSelect={onAction} disabled={disabled}
    accessibilityLabel={accessibilityLabel} testID={testID}>{children}</ShellContextMenu>;
}
