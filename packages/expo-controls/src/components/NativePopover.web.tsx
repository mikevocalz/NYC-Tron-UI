import { useRef, type ComponentRef } from "react";
import { Modal, Pressable, View, type ViewProps } from "react-native";
import { placePopover } from "@nyc-tron/ui/components/overlays/popover-position";
import { cycleFocusIndex } from "@nyc-tron/ui/components/overlays/focus-cycle";
import { useRestoreFocus } from "@nyc-tron/ui/components/overlays/focus-restore";
import type { NativePopoverProps } from "./NativePopover.types.ts";
export type { NativePopoverProps } from "./NativePopover.types.ts";

type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];
type FocusNode={focus:()=>void;querySelectorAll:(selector:string)=>ArrayLike<FocusNode>;
  contains:(node:unknown)=>boolean;getAttribute:(name:string)=>string|null};
// Elements the browser puts in the Tab order. RN web renders Pressable as tabindex="0".
const TABBABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),'+
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * RN web presentation, placed by placePopover in the caller's usable regions.
 * Tab and Shift+Tab cycle through the popover's own focusable content, Escape
 * closes, the backdrop closes on pointer press, and focus returns to the
 * element that opened it.
 */
export function NativePopover({
  open,onOpenChange,anchor,usableRegions,accessibilityLabel,children,
  width=320,maxHeight=420,className,testID,
}:NativePopoverProps){
  const surface=useRef<ComponentRef<typeof View>>(null);
  useRestoreFocus(open);
  const position=placePopover(anchor,usableRegions,width,maxHeight);
  const node=()=>surface.current as unknown as FocusNode|null;
  const stops=()=>{
    const root=node();
    if(!root)return [];
    return Array.from(root.querySelectorAll(TABBABLE))
      .filter(element=>element.getAttribute("aria-disabled")!=="true");
  };
  const focusFirst=()=>{(stops()[0]??node())?.focus();};
  const onKeyDown=(event:KeyEvent)=>{
    const data=event.nativeEvent as unknown as {key:string;shiftKey?:boolean};
    if(data.key!=="Tab")return;
    event.preventDefault();
    const list=stops();
    if(!list.length){node()?.focus();return;}
    const active=(globalThis as {document?:{activeElement:unknown}}).document?.activeElement;
    const next=cycleFocusIndex(list.length,list.findIndex(element=>element===active),!!data.shiftKey);
    list[next]?.focus();
  };
  const close=()=>onOpenChange(false);
  // A fading web Modal keeps its focus trap live while it fades; close instantly.
  return <Modal transparent visible={open} animationType="none" onRequestClose={close}
    onShow={focusFirst} accessibilityViewIsModal>
    <View style={{flex:1}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close popover" onPress={close}
        focusable={false}
        style={{position:"absolute",left:0,right:0,top:0,bottom:0}}/>
      <View ref={surface} testID={testID} role="dialog" aria-modal aria-label={accessibilityLabel}
        // The surface itself is the fallback focus target when the content has no controls.
        {...{tabIndex:-1}} onKeyDown={onKeyDown}
        {...{className:["rounded-control bg-surface-raised border border-border",className].filter(Boolean).join(" ")}}
        style={{position:"absolute",left:position.x,top:position.y,width:position.width,
          maxHeight:position.height,overflow:"hidden"}}>
        {children}
      </View>
    </View>
  </Modal>;
}
