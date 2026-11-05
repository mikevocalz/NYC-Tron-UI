import { NativeActionMenu } from "./NativeActionMenu.native.tsx";
import type { ContextMenuProps } from "./ContextMenu.types.ts";
export type { ContextMenuProps } from "./ContextMenu.types.ts";

/**
 * iOS and Android: the OS context menu (SwiftUI context menu, Compose
 * dropdown) on long press, through `NativeActionMenu`. A stylus long press
 * and a hardware-keyboard or pointer secondary click reach the same OS menu
 * where the platform routes them to the long-press interaction.
 */
export function ContextMenu({accessibilityLabel,actions,onAction,children,disabled,testID}:ContextMenuProps){
  return <NativeActionMenu longPress trigger={children} actions={actions} onAction={onAction}
    disabled={disabled} accessibilityLabel={accessibilityLabel} testID={testID}/>;
}
