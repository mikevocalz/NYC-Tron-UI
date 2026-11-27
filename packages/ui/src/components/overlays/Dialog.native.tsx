/*
 * Behaviour adapted from NYC-MON packages/ui/Dialog.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): iOS on @expo/ui's universal
 * BottomSheet, Android on Compose BasicAlertDialog, one token-styled RN
 * panel.
 */
import {useLayoutEffect,useRef} from "react";
import {Platform,ScrollView,Text,View,useWindowDimensions} from "react-native";
import {BottomSheet,Host,RNHostView} from "@expo/ui";
import {interactiveDismissDisabled} from "@expo/ui/swift-ui/modifiers";
import {BasicAlertDialog,RNHostView as ComposeHostView} from "@expo/ui/jetpack-compose";
import {canDismiss,composeDialogProperties,dialogMaxWidth,type DialogDismissReason} from "./dialog-model.ts";
import type {DialogProps} from "./Dialog.types.ts";
import {Dialog as KitDialog} from "./Dialog.web.tsx";
import {joinClasses} from "../styles.ts";
export type {DialogProps,DialogDismissReason,DialogInsets,DialogSize} from "./Dialog.types.ts";

const GUTTER=24;

/**
 * iOS: @expo/ui's universal `BottomSheet` (a SwiftUI sheet sized to its
 * content), the way NYC-MON presents its sheets. Swipe-down and a tap on the
 * dimmed area close it when `dismissible`; otherwise the
 * `interactiveDismissDisabled` modifier holds it open and the drag indicator
 * is hidden. The universal sheet's own 16pt inset is turned off
 * (`contentPadding={0}`) so the panel's token padding applies.
 *
 * Android: a Material 3 `BasicAlertDialog` from @expo/ui, kept instead of
 * the universal sheet because it is a centred dialog like the web one, and
 * Compose `DialogProperties` let back and a tap outside follow
 * `dismissible` / `closeOnBackdrop` while the universal Android sheet cannot
 * stop a swipe-down. Compose reports both as one request, so `onDismiss`
 * receives "back" for either.
 *
 * Both host the same RN panel (title heading, description, scrolling body,
 * footer) through `RNHostView`, styled with the app's tokens. The OS owns the
 * scrim, motion, focus and screen-reader containment. While `busy`, no
 * system dismissal is allowed.
 *
 * Other React Native hosts (Windows, macOS, QNX) use the kit dialog from
 * `Dialog.web.tsx`. Not yet validated on a device in this repository.
 */
export function Dialog(props:DialogProps){
  if(Platform.OS!=="ios"&&Platform.OS!=="android")return <KitDialog {...props}/>;
  return <SystemDialog {...props}/>;
}

function SystemDialog({
  ref,open,onOpenChange,title,description,children,footer,dismissible=true,closeOnBackdrop,busy=false,size="md",
  onDismiss,testID,contentClassName,titleClassName,descriptionClassName,bodyClassName,footerClassName,unstyled=false,colorScheme,
}:DialogProps){
  const maxWidth=dialogMaxWidth(size);
  const screen=useWindowDimensions();
  const styled=!unstyled;
  const rules={dismissible,closeOnBackdrop,busy};
  const latest=useRef({open,onOpenChange,onDismiss,rules});
  useLayoutEffect(()=>{latest.current={open,onOpenChange,onDismiss,rules};});
  const request=(reason:DialogDismissReason)=>{
    const now=latest.current;
    if(!now.open||!canDismiss(reason,now.rules))return;
    now.onDismiss?.(reason);
    now.onOpenChange(false);
  };
  const ios=Platform.OS==="ios";
  // RNHostView sizes the native slot from its child, so the panel needs a definite width.
  const width=ios?Math.min(screen.width,maxWidth+2*GUTTER):Math.max(1,Math.min(maxWidth,screen.width-2*GUTTER));
  const panel=(
    <View ref={ref} testID={testID} accessibilityState={{busy}}
      style={{width,maxHeight:Math.max(1,screen.height-2*GUTTER)}}
      {...{className:joinClasses(styled&&"bg-surface-raised",styled&&!ios&&"rounded-card border border-border",contentClassName)}}>
      <View {...{className:joinClasses(styled&&"gap-2 px-6 pt-6",styled&&!children&&!footer&&"pb-6")}}>
        <Text accessibilityRole="header"
          {...{className:joinClasses(styled&&"text-lg font-semibold leading-6 text-text",titleClassName)}}>{title}</Text>
        {description?(
          <Text {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text>
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
  );
  if(ios){
    const holdOpen=!canDismiss("escape",rules);
    return (
      <Host matchContents colorScheme={colorScheme}>
        <BottomSheet isPresented={open} onDismiss={()=>request("escape")} contentPadding={0}
          showDragIndicator={!holdOpen} modifiers={[interactiveDismissDisabled(holdOpen)]}>
          <RNHostView matchContents>{panel}</RNHostView>
        </BottomSheet>
      </Host>
    );
  }
  return (
    <Host matchContents colorScheme={colorScheme}>
      {open?(
        <BasicAlertDialog onDismissRequest={()=>request("back")}
          properties={{...composeDialogProperties(rules),usePlatformDefaultWidth:false}}>
          <ComposeHostView matchContents>{panel}</ComposeHostView>
        </BasicAlertDialog>
      ):null}
    </Host>
  );
}
