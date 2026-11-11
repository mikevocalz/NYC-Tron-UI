import {useRef,useLayoutEffect,useMemo,type ComponentRef} from "react";
import {Modal,Pressable,View,useWindowDimensions,type ViewProps} from "react-native";
import {placePopover,hasUsableRegion,type Rect2D} from "./popover-position.ts";
import {cycleFocusIndex} from "./focus-cycle.ts";
import {useRestoreFocus} from "./focus-restore.ts";
import {useTriggerAnchor} from "./useTriggerAnchor.ts";
import {windowRegions} from "./measure-anchor.ts";
import {isTriggerPopover,popoverTriggerState,renderPopoverTrigger,type PopoverBaseProps,type PopoverProps,type PopoverTriggerProps} from "./anchored-popover-types.ts";
import {joinClasses} from "../styles.ts";
export type {PopoverProps,PopoverAnchorProps,PopoverTriggerProps,PopoverTriggerState} from "./anchored-popover-types.ts";

type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];
type FocusNode={focus:()=>void;querySelectorAll:(selector:string)=>ArrayLike<FocusNode>;getAttribute:(name:string)=>string|null};
// Elements the browser puts in the Tab order. RN web renders Pressable as tabindex="0".
const TABBABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),'+
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Portable popover drawn with an RN `Modal`, placed by {@linkcode placePopover}.
 * Takes either an `anchor` rect (plus `usableRegions`) or a `trigger` it
 * renders, measures on open and anchors to.
 *
 * Web: Tab and Shift+Tab cycle through the popover's own focusable content,
 * Escape closes, the backdrop closes on pointer press, and focus returns to
 * the element that opened it. `@nyc-tron/expo-controls/NativePopover` is the
 * same contract with SwiftUI and Compose surfaces on iOS and Android.
 */
export function AnchoredPopover(props:PopoverProps){
  if(!isTriggerPopover(props))return <PopoverSurface {...props} anchor={props.anchor} usableRegions={props.usableRegions}/>;
  return <TriggeredPopover {...props}/>;
}

function TriggeredPopover(props:PopoverTriggerProps){
  const {open,onOpenChange,trigger,usableRegions}=props;
  const screen=useWindowDimensions();
  const {ref,anchor,measured}=useTriggerAnchor(open,props.scope,JSON.stringify(usableRegions??null));
  const regions=usableRegions??windowRegions(screen.width,screen.height);
  return <>
    <View ref={ref} collapsable={false}>{renderPopoverTrigger(trigger,popoverTriggerState(open,onOpenChange))}</View>
    {/* Stays mounted after the first open so closing can hand focus back to the trigger. */}
    {anchor?<PopoverSurface {...props} open={open&&measured} anchor={anchor} usableRegions={regions}/>:null}
  </>;
}

type SurfaceProps=PopoverBaseProps&{anchor:Rect2D;usableRegions:readonly Rect2D[]};
function PopoverSurface({scope="popover",open,onOpenChange,anchor,usableRegions,accessibilityLabel,children,
  width=320,maxHeight=420,className,testID}:SurfaceProps){
  const surface=useRef<ComponentRef<typeof View>>(null);
  const available=hasUsableRegion(usableRegions);
  useRestoreFocus(open&&available);
  const position=available?placePopover(anchor,usableRegions,width,maxHeight):undefined;
  const node=()=>surface.current as unknown as FocusNode|null;
  const stops=()=>{
    const root=node();
    if(!root||typeof root.querySelectorAll!=="function")return [];
    return Array.from(root.querySelectorAll(TABBABLE)).filter(element=>element.getAttribute("aria-disabled")!=="true");
  };
  const focusFirst=()=>{if(open&&committed.current?.token===token&&committed.current.available)(stops()[0]??node())?.focus?.();};
  const onKeyDown=(event:KeyEvent)=>{
    if(!open||(committed.current?.token!==token||!committed.current?.available))return;
    const data=event.nativeEvent as unknown as {key:string;shiftKey?:boolean};
    if(data.key!=="Tab")return;
    event.preventDefault();
    const list=stops();
    if(!list.length){node()?.focus();return;}
    const active=(globalThis as {document?:{activeElement:unknown}}).document?.activeElement;
    const next=cycleFocusIndex(list.length,list.findIndex(element=>element===active),!!data.shiftKey);
    list[next]?.focus();
  };
  const token=useMemo(()=>({}),[scope,open]);
  const committed=useRef<{token:object;available:boolean;onOpenChange:typeof onOpenChange}|null>(null);
  useLayoutEffect(()=>{committed.current={token,available,onOpenChange};});
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const close=()=>{if(open&&committed.current?.token===token&&committed.current.available)committed.current.onOpenChange(false);};
  // A fading web Modal keeps its focus trap live while it fades; close instantly.
  if(!position)return null;
  return <Modal transparent visible={open} animationType="none" onRequestClose={close}
    onShow={focusFirst} accessibilityViewIsModal>
    <View style={{flex:1}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close popover" onPress={close}
        focusable={false}
        style={{position:"absolute",left:0,right:0,top:0,bottom:0}}/>
      <View ref={surface} testID={testID} role="dialog" aria-modal aria-label={accessibilityLabel}
        // The surface itself is the fallback focus target when the content has no controls.
        {...{tabIndex:-1}} onKeyDown={onKeyDown}
        {...{className:joinClasses("rounded-control bg-surface-raised border border-border",className)}}
        style={{position:"absolute",left:position.x,top:position.y,width:position.width,
          maxHeight:position.height,overflow:"hidden"}}>
        {children}
      </View>
    </View>
  </Modal>;
}
