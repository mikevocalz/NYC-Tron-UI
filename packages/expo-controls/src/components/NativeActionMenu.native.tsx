import { MenuView } from "@expo/ui/community/menu";
import { View } from "react-native";
import type { NativeActionMenuProps } from "./NativeActionMenu.types";
import { findEnabledMenuAction, normalizeMenuActions } from "./menu-model";
/**
 * Real iOS SwiftUI Menu/ContextMenu and Android Compose DropdownMenu.
 * OS owns menu focus, placement, keyboard and outside-dismiss behavior.
 */
export function NativeActionMenu({
  trigger,actions,onAction,longPress=false,disabled=false,accessibilityLabel,testID
}:NativeActionMenuProps){
  const normalized=normalizeMenuActions(actions);
  if(disabled||normalized.length===0)return <View accessible accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{disabled:true}} testID={testID}>{trigger}</View>;
  return <MenuView actions={normalized}
    shouldOpenOnLongPress={longPress}
    onPressAction={event=>{
      const id=event.nativeEvent.event;
      if(findEnabledMenuAction(actions,id))onAction(id);
    }}>
    {/* Expose the trigger as one actionable element, not loose child text. */}
    <View accessible accessibilityRole="button" accessibilityLabel={accessibilityLabel}
      testID={testID}>{trigger}</View>
  </MenuView>;
}
