/*
 * Behaviour adapted from NYC-MON packages/ui/Dialog.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): RN Modal centred dialog with Tron
 * tokens, focus trap and restore, Escape and backdrop rules, reduced motion.
 */
import {useId,useLayoutEffect,useRef,useSyncExternalStore,type ComponentRef} from "react";
import {AccessibilityInfo,Modal,Platform,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import {cycleFocusIndex} from "./focus-cycle.ts";
import {useRestoreFocus} from "./focus-restore.ts";
import {TABBABLE_SELECTOR,canDismiss,dialogAnimation,dialogFramePadding,dialogMaxWidth,
  type DialogDismissReason} from "./dialog-model.ts";
import type {DialogProps} from "./Dialog.types.ts";
import {joinClasses} from "../styles.ts";
export type {DialogProps,DialogDismissReason,DialogInsets,DialogSize} from "./Dialog.types.ts";

type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];
type FocusNode={focus:()=>void;querySelectorAll:(selector:string)=>ArrayLike<FocusNode>;getAttribute:(name:string)=>string|null};

// System reduce-motion setting, read once and kept current for every dialog.
let reduceMotionValue=false,reduceMotionStarted=false;
const reduceMotionListeners=new Set<()=>void>();
function setReduceMotion(value:boolean){
  if(value===reduceMotionValue)return;
  reduceMotionValue=value;
  for(const listener of [...reduceMotionListeners])listener();
}
function subscribeReduceMotion(listener:()=>void){
  reduceMotionListeners.add(listener);
  if(!reduceMotionStarted){
    reduceMotionStarted=true;
    try{
      AccessibilityInfo.isReduceMotionEnabled?.().then(v=>setReduceMotion(!!v),()=>{});
      AccessibilityInfo.addEventListener?.("reduceMotionChanged",v=>setReduceMotion(!!v));
    }catch{/* Hosts without the API keep motion on. */}
  }
  return ()=>{reduceMotionListeners.delete(listener);};
}
const readReduceMotion=()=>reduceMotionValue;

/**
 * Modal dialog on an RN `Modal`, which portals above the app on every
 * platform. Controlled: the app owns `open` and receives `onOpenChange(false)`.
 *
 * - Title is a heading (`accessibilityRole="header"`) and names the dialog.
 * - Web: role="dialog" (or "alertdialog") with aria-modal, labelled by the
 *   title and described by the description. Focus moves into the dialog on
 *   open, Tab and Shift+Tab stay inside it, Escape closes when `dismissible`,
 *   and focus returns to the opener on close.
 * - iOS: `accessibilityViewIsModal` keeps VoiceOver inside the panel, the
 *   escape gesture closes when `dismissible`, and VoiceOver focus starts on
 *   the title. Android: the back button closes when `dismissible`, and is
 *   ignored otherwise.
 * - Opens with a fade on native kit hosts, or instantly when reduce motion
 *   is on and always on web (see `dialogAnimation`).
 *
 * This is the web fork and the kit fallback used by `Dialog.native.tsx` on
 * hosts without Expo UI.
 */
export function Dialog({
  ref,open,onOpenChange,title,description,children,footer,dismissible=true,closeOnBackdrop,busy=false,
  size="md",initialFocusRef,onDismiss,safeAreaInsets,reduceMotion,backdropLabel="Close dialog",role="dialog",testID,
  className,overlayClassName,contentClassName,titleClassName,descriptionClassName,bodyClassName,footerClassName,
  unstyled=false,colorScheme:_colorScheme,
}:DialogProps){
  const maxWidth=dialogMaxWidth(size);
  const frame=dialogFramePadding(safeAreaInsets);
  const systemReduce=useSyncExternalStore(subscribeReduceMotion,readReduceMotion,readReduceMotion);
  const animationType=dialogAnimation(Platform.OS,reduceMotion??systemReduce);
  const styled=!unstyled;
  const id=useId();
  const titleId=`${id}-title`,descriptionId=`${id}-description`;
  const panel=useRef<ComponentRef<typeof View>|null>(null);
  const heading=useRef<ComponentRef<typeof Text>|null>(null);
  useRestoreFocus(open);

  const latest=useRef({open,dismissible,closeOnBackdrop,busy,onOpenChange,onDismiss});
  useLayoutEffect(()=>{latest.current={open,dismissible,closeOnBackdrop,busy,onOpenChange,onDismiss};});
  // react-native-web's Modal also answers Escape, on keyup at the document.
  // When the panel already handled that key on keydown, skip the second request.
  const escapeHandled=useRef(false);
  const request=(reason:DialogDismissReason)=>{
    const now=latest.current;
    if(!now.open)return;
    if(!canDismiss(reason,{dismissible:now.dismissible,closeOnBackdrop:now.closeOnBackdrop,busy:now.busy}))return;
    now.onDismiss?.(reason);
    now.onOpenChange(false);
  };
  const onRequestClose=()=>{
    if(Platform.OS!=="web"){request("back");return;}
    if(escapeHandled.current){escapeHandled.current=false;return;}
    request("escape");
  };
  const backdropCloses=canDismiss("backdrop",{dismissible,closeOnBackdrop,busy});

  const node=()=>panel.current as unknown as FocusNode|null;
  const stops=()=>{
    const root=node();
    if(!root||typeof root.querySelectorAll!=="function")return [];
    return Array.from(root.querySelectorAll(TABBABLE_SELECTOR)).filter(element=>element.getAttribute("aria-disabled")!=="true");
  };
  const focusInitial=()=>{
    if(!latest.current.open)return;
    if(Platform.OS!=="web"){
      // Native: move screen-reader focus to the title so the dialog is announced.
      const target=heading.current;
      if(target)try{AccessibilityInfo.sendAccessibilityEvent(target,"focus");}catch{/* not supported on this host */}
      return;
    }
    const preferred=initialFocusRef?.current;
    if(preferred&&typeof preferred.focus==="function"){preferred.focus();return;}
    (stops()[0]??node())?.focus?.();
  };
  const onKeyDown=(event:KeyEvent)=>{
    if(!latest.current.open)return;
    const data=(event.nativeEvent??event) as unknown as {key:string;shiftKey?:boolean};
    if(data.key==="Escape"){
      event.preventDefault?.();event.stopPropagation?.();
      if(Platform.OS==="web")escapeHandled.current=true;
      request("escape");return;
    }
    // Native hosts own their Tab chain; only the DOM fallback is trapped here.
    if(data.key!=="Tab"||Platform.OS!=="web")return;
    event.preventDefault?.();
    const list=stops();
    if(!list.length){node()?.focus?.();return;}
    const active=(globalThis as {document?:{activeElement:unknown}}).document?.activeElement;
    const next=cycleFocusIndex(list.length,list.findIndex(element=>element===active),!!data.shiftKey);
    list[next]?.focus();
  };
  const setPanel=(value:ComponentRef<typeof View>|null)=>{
    panel.current=value;
    if(typeof ref==="function")ref(value);
    else if(ref)(ref as {current:ComponentRef<typeof View>|null}).current=value;
  };

  return (
    <Modal transparent visible={open} animationType={animationType} onShow={focusInitial}
      // Web: Escape. Android: the back button. Ignored unless dismissible.
      onRequestClose={onRequestClose}>
      <View style={{flex:1}}>
        {/* The frame comes first in the tree so a focus trap that picks the
            first focusable element lands in the panel, not on the backdrop.
            zIndex keeps it drawn above the backdrop that follows. */}
        <View testID={testID} style={[{flex:1,alignItems:"center",justifyContent:"center",zIndex:1,pointerEvents:"box-none"},frame]}
          {...{className:joinClasses(className)}}>
          <View ref={setPanel} role={role} aria-modal aria-labelledby={titleId}
            {...{"aria-describedby":description?descriptionId:undefined,"aria-busy":busy||undefined,tabIndex:-1}}
            accessibilityViewIsModal accessibilityState={{busy}}
            onAccessibilityEscape={()=>request("escape")}
            focusable onKeyDown={onKeyDown}
            style={{width:"100%",maxWidth,maxHeight:"100%",overflow:"hidden"}}
            {...{className:joinClasses(styled&&"rounded-card border border-border bg-surface-raised",contentClassName)}}>
            <View {...{className:joinClasses(styled&&"gap-2 px-6 pt-6",styled&&!children&&!footer&&"pb-6")}}>
              <Text ref={heading} nativeID={titleId} accessibilityRole="header" role="heading" aria-level={2}
                {...{className:joinClasses(styled&&"text-lg font-semibold leading-6 text-text",titleClassName)}}>{title}</Text>
              {description?(
                <Text nativeID={descriptionId}
                  {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text>
              ):null}
            </View>
            {children?(
              <ScrollView style={{flexGrow:0,flexShrink:1}} keyboardShouldPersistTaps="handled"
                {...{contentContainerClassName:joinClasses(styled&&"px-6 pt-4",styled&&!footer&&"pb-6",bodyClassName)}}>
                {children}
              </ScrollView>
            ):null}
            {footer?(
              <View {...{className:joinClasses("flex-row flex-wrap items-center justify-end",styled&&"gap-3 px-6 pb-6 pt-6",footerClassName)}}>
                {footer}
              </View>
            ):null}
          </View>
        </View>
        <Pressable onPress={backdropCloses?()=>request("backdrop"):undefined}
          disabled={!backdropCloses} focusable={false}
          accessibilityRole={backdropCloses?"button":undefined}
          accessibilityLabel={backdropCloses?backdropLabel:undefined}
          accessible={backdropCloses}
          importantForAccessibility={backdropCloses?"auto":"no-hide-descendants"}
          aria-hidden={!backdropCloses||undefined}
          style={{position:"absolute",top:0,right:0,bottom:0,left:0,opacity:0.8}}
          {...{className:joinClasses(styled&&"bg-surface-sunken",overlayClassName)}}/>
      </View>
    </Modal>
  );
}
