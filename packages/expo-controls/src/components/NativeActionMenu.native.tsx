import {useLayoutEffect,useRef} from "react";
import { MenuView } from "@expo/ui/community/menu";
import { View } from "react-native";
import type { NativeActionMenuProps } from "./NativeActionMenu.types.ts";
import { findEnabledMenuAction, normalizeMenuActions } from "./menu-model.ts";
/**
 * Real iOS SwiftUI Menu/ContextMenu and Android Compose DropdownMenu.
 * OS owns menu focus, placement, keyboard and outside-dismiss behavior.
 */
export function NativeActionMenu({
  scope="native-actions",trigger,actions,onAction,longPress=false,disabled=false,accessibilityLabel,testID
}:NativeActionMenuProps){
  const normalized=normalizeMenuActions(actions);
  const committed=useRef<{scope:string;disabled:boolean;actions:typeof actions;onAction:typeof onAction}|null>(null);
  useLayoutEffect(()=>{committed.current={scope,disabled,actions,onAction};});
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  if(disabled||normalized.length===0)return <View accessible accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{disabled:true}} style={{minWidth:44,minHeight:44,justifyContent:"center"}} testID={testID}>{trigger}</View>;
  return <MenuView key={scope} actions={normalized}
    shouldOpenOnLongPress={longPress}
    onPressAction={event=>{
      const id=event.nativeEvent.event;
      const p=committed.current;
      if(p?.scope===scope&&!p.disabled&&findEnabledMenuAction(p.actions,id))p.onAction(id);
    }}>
    {/* Expose the trigger as one actionable element, not loose child text. */}
    <View accessible accessibilityRole="button" accessibilityLabel={accessibilityLabel}
      style={{minWidth:44,minHeight:44,justifyContent:"center"}} testID={testID}>{trigger}</View>
  </MenuView>;
}
