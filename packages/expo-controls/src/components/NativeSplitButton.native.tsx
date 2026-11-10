import { useRef } from "react";
import { Platform } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { Host } from "@expo/ui";
import { Button as SwiftUIButton, HStack, Menu as SwiftUIMenu } from "@expo/ui/swift-ui";
import { accessibilityLabel as swiftUILabel, buttonStyle, disabled as swiftUIDisabled, labelStyle } from "@expo/ui/swift-ui/modifiers";
import {
  DropdownMenu, DropdownMenuItem, SplitButtonLayout, SplitButtonLeadingButton, SplitButtonTrailingButton,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { semantics, testID as composeTestID } from "@expo/ui/jetpack-compose/modifiers";
import type { NativeSplitButtonProps } from "./NativeSplitButton.types.ts";
import { enabledMenuLeaves, findEnabledMenuAction, normalizeMenuActions } from "./menu-model.ts";
export type { NativeSplitButtonProps } from "./NativeSplitButton.types.ts";

/**
 * Android: Material 3 `SplitButtonLayout`, whose trailing button opens a
 * `DropdownMenu`. iOS: a bordered SwiftUI `Button` beside an icon-only
 * `Menu`. SwiftUI's `Menu(primaryAction:)` was not used because it puts both
 * actions on one target (tap and long press), and this control's contract is
 * two separate hit targets.
 */
export function NativeSplitButton({label,onPress,actions,onAction,menuLabel,disabled=false,testID,colorScheme}:NativeSplitButtonProps){
  normalizeMenuActions(actions);
  const leaves=enabledMenuLeaves(actions);
  const local=useRef<StoreApi<{expanded:boolean}>|null>(null);
  if(!local.current)local.current=createStore<{expanded:boolean}>(()=>({expanded:false}));
  const store=local.current;
  const expanded=useStore(store,s=>s.expanded);
  const more=menuLabel??`More ${label} options`;
  const run=(id:string)=>{
    store.setState({expanded:false});
    if(!disabled&&findEnabledMenuAction(actions,id))onAction(id);
  };
  if(Platform.OS==="android"){
    return <Host colorScheme={colorScheme} matchContents testID={testID}>
      <SplitButtonLayout>
        <SplitButtonLayout.LeadingButton>
          <SplitButtonLeadingButton enabled={!disabled} onClick={onPress}><ComposeText>{label}</ComposeText></SplitButtonLeadingButton>
        </SplitButtonLayout.LeadingButton>
        <SplitButtonLayout.TrailingButton>
          <DropdownMenu expanded={expanded} onDismissRequest={()=>store.setState({expanded:false})}>
            <DropdownMenu.Trigger>
              <SplitButtonTrailingButton checked={expanded} enabled={!disabled&&leaves.length>0}
                onCheckedChange={next=>store.setState({expanded:next})}
                modifiers={[semantics({contentDescription:more}),...(testID?[composeTestID(testID+"-menu")]:[])]}>
                <ComposeText>More</ComposeText>
              </SplitButtonTrailingButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Items>
              {leaves.map(a=><DropdownMenuItem key={a.id} onClick={()=>run(a.id)}>
                <DropdownMenuItem.Text><ComposeText>{a.title}</ComposeText></DropdownMenuItem.Text>
              </DropdownMenuItem>)}
            </DropdownMenu.Items>
          </DropdownMenu>
        </SplitButtonLayout.TrailingButton>
      </SplitButtonLayout>
    </Host>;
  }
  return <Host colorScheme={colorScheme} matchContents testID={testID}>
    <HStack spacing={2}>
      <SwiftUIButton label={label} onPress={onPress} modifiers={[buttonStyle("bordered"),swiftUIDisabled(disabled)]}/>
      <SwiftUIMenu label={more} systemImage="chevron.down"
        modifiers={[labelStyle("iconOnly"),buttonStyle("bordered"),swiftUILabel(more),swiftUIDisabled(disabled||leaves.length===0)]}>
        {leaves.map(a=><SwiftUIButton key={a.id} label={a.title} role={a.destructive?"destructive":"default"} onPress={()=>run(a.id)}/>)}
      </SwiftUIMenu>
    </HStack>
  </Host>;
}
