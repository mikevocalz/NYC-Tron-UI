import { useRef, useMemo, useLayoutEffect, type ReactNode } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { Host } from "@expo/ui";
import { Popover, RNHostView as SwiftUIHostView, Spacer } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { Box, DropdownMenu, RNHostView as ComposeHostView } from "@expo/ui/jetpack-compose";
import { size } from "@expo/ui/jetpack-compose/modifiers";
import { placePopover, placementSide, hasUsableRegion, type Rect2D } from "@nyc-tron/ui/components/overlays/popover-position";
import { windowRegions } from "@nyc-tron/ui/components/overlays/measure-anchor";
import { useTriggerAnchor } from "@nyc-tron/ui/components/overlays/useTriggerAnchor";
import {
  isTriggerPopover, popoverTriggerState, renderPopoverTrigger,
} from "@nyc-tron/ui/components/overlays/anchored-popover-types";
import {
  swiftUIPopoverEdges, type NativePopoverProps, type NativePopoverTriggerProps,
} from "./NativePopover.types.ts";
import type { NativeAppearanceProps } from "./native-appearance.ts";
export type {
  NativePopoverProps, NativePopoverAnchorProps, NativePopoverTriggerProps, NativePopoverTriggerState,
} from "./NativePopover.types.ts";

/**
 * iOS: SwiftUI `.popover` through @expo/ui `Popover` (compact size classes
 * keep the popover presentation instead of turning into a sheet).
 * Android: Material 3 `DropdownMenu` from @expo/ui, used as an anchored
 * surface whose content is the hosted React Native children.
 *
 * Both are attached to an invisible native anchor laid over the anchor rect
 * (rect form) or over the rendered trigger (trigger form). The OS places,
 * clips and dismisses the surface; placePopover only chooses which side of
 * the anchor the usable region favours. Touches pass through the anchor to
 * the app's own trigger underneath.
 *
 * Both platform trees are imported here; Expo resolves a native view config
 * on first render, so the unused platform's views register nothing.
 */
export function NativePopover(props:NativePopoverProps){
  if(isTriggerPopover(props))return <TriggeredNativePopover {...props}/>;
  const {anchor,usableRegions,width=320,maxHeight=420}=props;
  if(!hasUsableRegion(usableRegions))return null;
  const position=placePopover(anchor,usableRegions,width,maxHeight);
  return <NativeSurface {...props} frame={anchor} side={placementSide(anchor,position)}
    contentWidth={position.width} contentHeight={position.height}/>;
}

type TriggerLayout={width:number;height:number};
/**
 * Trigger form. The native anchor is laid over the trigger in its own
 * coordinates, so placement never depends on where the popover is mounted.
 * The window-space measurement only picks the preferred side and the content
 * size; until it lands the popover prefers below.
 */
function TriggeredNativePopover(props:NativePopoverTriggerProps){
  const {open,onOpenChange,trigger,usableRegions,width=320,maxHeight=420}=props;
  const screen=useWindowDimensions();
  const {ref,anchor,measured}=useTriggerAnchor(open,props.scope,JSON.stringify(usableRegions??null));
  const local=useRef<StoreApi<TriggerLayout>|null>(null);
  if(!local.current)local.current=createStore<TriggerLayout>(()=>({width:1,height:1}));
  const store=local.current;
  const layout=useStore(store,s=>s);
  const regions=usableRegions??windowRegions(screen.width,screen.height);
  const windowAnchor:Rect2D=measured&&anchor?anchor:{x:0,y:0,width:layout.width,height:layout.height};
  const position=hasUsableRegion(regions)?placePopover(windowAnchor,regions,width,maxHeight):undefined;
  return <View ref={ref} collapsable={false}
    onLayout={event=>{
      const {width:w,height:h}=event.nativeEvent.layout;
      store.setState({width:Math.max(1,w),height:Math.max(1,h)});
    }}>
    {renderPopoverTrigger(trigger,popoverTriggerState(open,onOpenChange))}
    {position?<NativeSurface {...props} open={open&&measured} frame={{x:0,y:0,width:layout.width,height:layout.height}}
      side={measured?placementSide(windowAnchor,position):"below"}
      contentWidth={position.width} contentHeight={position.height}/>:null}
  </View>;
}

type SurfaceProps=NativeAppearanceProps&{
  readonly scope?:string;
  readonly open:boolean;
  readonly onOpenChange:(open:boolean)=>void;
  readonly accessibilityLabel:string;
  readonly children:ReactNode;
  readonly testID?:string;
  /** Where the invisible native anchor sits, in the parent view's coordinates. */
  readonly frame:Rect2D;
  readonly side:"below"|"above"|"overlap";
  readonly contentWidth:number;
  readonly contentHeight:number;
};
function NativeSurface({
  scope="native-popover",open,onOpenChange,accessibilityLabel,children,testID,frame:anchor,side,contentWidth,contentHeight,colorScheme,
}:SurfaceProps){
  const token=useMemo(()=>({}),[scope,open]);
  const committed=useRef<{token:object;onOpenChange:typeof onOpenChange}|null>(null);
  useLayoutEffect(()=>{committed.current={token,onOpenChange};});
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const change=(next:boolean)=>{if(next!==open&&committed.current?.token===token)committed.current.onOpenChange(next);};
  const anchorWidth=Math.max(1,anchor.width),anchorHeight=Math.max(1,anchor.height);
  const content=<View accessibilityLabel={accessibilityLabel} accessibilityViewIsModal
    role="dialog" testID={testID}
    style={{width:contentWidth,maxHeight:contentHeight}}>{children}</View>;
  return <View pointerEvents="none" style={{position:"absolute",left:anchor.x,top:anchor.y,
      width:anchorWidth,height:anchorHeight}}>
    <Host key={`${scope}:${open}`} colorScheme={colorScheme} style={{width:anchorWidth,height:anchorHeight}}>
      {Platform.OS==="android"
        ? <DropdownMenu expanded={open} onDismissRequest={()=>change(false)}>
            <DropdownMenu.Trigger><Box modifiers={[size(anchorWidth,anchorHeight)]}/></DropdownMenu.Trigger>
            <DropdownMenu.Items>
              <ComposeHostView matchContents>{content}</ComposeHostView>
            </DropdownMenu.Items>
          </DropdownMenu>
        : <Popover isPresented={open}
            onIsPresentedChange={change}
            {...swiftUIPopoverEdges(side)}>
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
