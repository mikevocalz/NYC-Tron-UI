import { Platform, View } from "react-native";
import { Host } from "@expo/ui";
import { Popover, RNHostView as SwiftUIHostView, Spacer } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { Box, DropdownMenu, RNHostView as ComposeHostView } from "@expo/ui/jetpack-compose";
import { size } from "@expo/ui/jetpack-compose/modifiers";
import { placePopover, placementSide } from "@nyc-tron/ui/components/overlays/popover-position";
import { swiftUIPopoverEdges, type NativePopoverProps } from "./NativePopover.types.ts";
export type { NativePopoverProps } from "./NativePopover.types.ts";

/**
 * iOS: SwiftUI `.popover` through @expo/ui `Popover` (compact size classes
 * keep the popover presentation instead of turning into a sheet).
 * Android: Material 3 `DropdownMenu` from @expo/ui, used as an anchored
 * surface whose content is the hosted React Native children.
 *
 * Both are attached to an invisible native anchor laid over `anchor`. The OS
 * places, clips and dismisses the surface; placePopover only chooses which
 * side of the anchor the usable region favours. Touches pass through the
 * anchor to the app's own trigger underneath.
 *
 * Both platform trees are imported here; Expo resolves a native view config
 * on first render, so the unused platform's views register nothing.
 */
export function NativePopover({
  open,onOpenChange,anchor,usableRegions,accessibilityLabel,children,
  width=320,maxHeight=420,testID,
}:NativePopoverProps){
  const position=placePopover(anchor,usableRegions,width,maxHeight);
  const anchorWidth=Math.max(1,anchor.width),anchorHeight=Math.max(1,anchor.height);
  const content=<View accessibilityLabel={accessibilityLabel} accessibilityViewIsModal
    role="dialog" testID={testID}
    style={{width:position.width,maxHeight:position.height}}>{children}</View>;
  return <View pointerEvents="none" style={{position:"absolute",left:anchor.x,top:anchor.y,
      width:anchorWidth,height:anchorHeight}}>
    <Host style={{width:anchorWidth,height:anchorHeight}}>
      {Platform.OS==="android"
        ? <DropdownMenu expanded={open} onDismissRequest={()=>onOpenChange(false)}>
            <DropdownMenu.Trigger><Box modifiers={[size(anchorWidth,anchorHeight)]}/></DropdownMenu.Trigger>
            <DropdownMenu.Items>
              <ComposeHostView matchContents>{content}</ComposeHostView>
            </DropdownMenu.Items>
          </DropdownMenu>
        : <Popover isPresented={open}
            onIsPresentedChange={next=>{if(next!==open)onOpenChange(next);}}
            {...swiftUIPopoverEdges(placementSide(anchor,position))}>
            <Popover.Trigger>
              <Spacer modifiers={[frame({width:anchorWidth,height:anchorHeight})]}/>
            </Popover.Trigger>
            <Popover.Content>
              <SwiftUIHostView matchContents>{content}</SwiftUIHostView>
            </Popover.Content>
          </Popover>}
    </Host>
  </View>;
}
