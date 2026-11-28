/*
 * Behaviour adapted from NYC-MON packages/ui/Checkbox.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal Checkbox with SwiftUI
 * accessibility modifiers on iOS, Compose TriStateCheckbox for every state on
 * Android, kit label text, focus kept across the iOS mixed-state swap.
 */
import { useImperativeHandle, useLayoutEffect, useRef, type ComponentRef } from "react";
import { AccessibilityInfo, I18nManager, Platform, Pressable, Text, View, findNodeHandle } from "react-native";
import { Host, Checkbox as UniversalCheckbox } from "@expo/ui";
import {
  accessibilityHint as swiftUIAccessibilityHint, accessibilityLabel as swiftUIAccessibilityLabel, frame, labelsHidden,
} from "@expo/ui/swift-ui/modifiers";
import { Column, Row, Text as ComposeText, TriStateCheckbox } from "@expo/ui/jetpack-compose";
import {
  clickable, defaultMinSize, fillMaxWidth, semantics, testID as composeTestID, weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { Checkbox as KitCheckbox } from "./Checkbox.kit.tsx";
import { checkboxDescription, keepsFocusAfterSwap, nextCheckedState, requireName, toggleableState } from "./toggle-model.ts";
import type { CheckboxProps } from "./Checkbox.types.ts";

export type { CheckboxProps, CheckedState } from "./Checkbox.types.ts";

/**
 * iOS: @expo/ui's universal `Checkbox` for checked and unchecked, which
 * renders SwiftUI `Toggle`. iOS has no checkbox control (SwiftUI's checkbox
 * toggle style is macOS only), so iOS shows a switch and VoiceOver says
 * "switch". `"indeterminate"` renders the kit checkbox, which announces
 * mixed.
 *
 * Android: Material 3 `TriStateCheckbox` for every state, in a clickable row
 * whose description ends in the state ("Checked", "Not checked", "Partially
 * checked"; Compose's tri-state semantics are not exposed by `@expo/ui`).
 * One control for all three states, so TalkBack focus never moves when the
 * state changes. Label and description are Compose text in the row, so the
 * kit text classes do not apply on Android.
 *
 * This fork exists because the universal component has no name, hint or
 * mixed state, and the platform modifiers and Compose views that add them
 * load native modules, so the web file cannot import them:
 *
 * - iOS: the control gets the name through `accessibilityLabel` and the
 *   description and error as the hint. Kit label and description text sit
 *   after the control, toggle on tap, and are hidden from VoiceOver. At
 *   least 44pt.
 * - Android: the row's `semantics(contentDescription)` holds the name,
 *   description, error and state. At least 48dp.
 * - iOS swaps between the SwiftUI toggle and the kit checkbox when the state
 *   enters or leaves `"indeterminate"`. When this control's own press caused
 *   the swap, VoiceOver focus is moved to the new control after it mounts.
 *
 * The error is RN text under the row, announced politely.
 *
 * Requires @expo/ui native APIs on a verified Expo SDK 58 host.
 */
export function Checkbox(props:CheckboxProps){
  const kit=props.checked==="indeterminate"&&Platform.OS!=="android";
  const node=useRef<ComponentRef<typeof View>|null>(null);
  useImperativeHandle(props.ref,()=>node.current as ComponentRef<typeof View>,[kit]);
  // A press here records its time; a swap within a second of it keeps focus.
  const pressedAt=useRef(0);
  const shownKit=useRef(kit);
  useLayoutEffect(()=>{
    if(shownKit.current===kit)return;
    shownKit.current=kit;
    if(!keepsFocusAfterSwap(pressedAt.current,Date.now()))return;
    pressedAt.current=0;
    const tag=findNodeHandle(node.current);
    if(tag!=null)AccessibilityInfo.setAccessibilityFocus(tag);
  },[kit]);
  const report=(next:boolean)=>{pressedAt.current=Date.now();props.onCheckedChange(next);};
  const own={...props,ref:node,onCheckedChange:report};
  return kit?<KitCheckbox {...own}/>:<NativeCheckbox {...own}/>;
}

function NativeCheckbox({
  ref,checked,onCheckedChange,label,description,error,disabled=false,colorScheme,color,style,
  className,rowClassName,labelClassName,descriptionClassName,errorClassName,unstyled=false,testID,
  accessibilityLabel,accessibilityHint,
}:CheckboxProps){
  const name=requireName("Checkbox",label,accessibilityLabel);
  const styled=!unstyled;
  const toggle=()=>{if(!disabled)onCheckedChange(nextCheckedState(checked));};
  const hint=accessibilityHint??([description,error].filter(Boolean).join(". ")||undefined);
  const android=Platform.OS==="android";
  const direction=I18nManager.isRTL?"rightToLeft":"leftToRight";
  const errorLine=error ? (
    <Text accessibilityLiveRegion="polite"
      {...{className:joinClasses(styled&&(android?"text-sm leading-5 text-danger":"ps-14 text-sm leading-5 text-danger"),errorClassName)}}>{error}</Text>
  ) : null;

  if(android){
    // Every state on one TriStateCheckbox: the universal Checkbox has no mixed state.
    return (
      <View ref={ref} style={[{minHeight:44,minWidth:44},style]} {...{className:joinClasses(styled&&"gap-1",className)}}>
        <Host colorScheme={colorScheme} seedColor={color} layoutDirection={direction}
          matchContents={label||description?{vertical:true}:true} style={label||description?{width:"100%"}:undefined}>
          <Row verticalAlignment="center" horizontalArrangement={{spacedBy:12}}
            modifiers={[
              ...(label||description?[fillMaxWidth()]:[]),defaultMinSize({minWidth:48,minHeight:48}),
              clickable(toggle),
              semantics({contentDescription:checkboxDescription({name,description,error,checked})}),
              ...(testID?[composeTestID(testID)]:[]),
            ]}>
            {/* No onClick: the row handles input and semantics. */}
            <TriStateCheckbox state={toggleableState(checked)} enabled={!disabled}/>
            {label||description ? (
              <Column modifiers={[weight(1)]}>
                {label ? <ComposeText>{label}</ComposeText> : null}
                {description ? <ComposeText style={{typography:"bodySmall"}}>{description}</ComposeText> : null}
              </Column>
            ) : null}
          </Row>
        </Host>
        {errorLine}
      </View>
    );
  }

  // iOS (Android returned the tri-state row above).
  const modifiers=[frame({minHeight:44}),labelsHidden(),swiftUIAccessibilityLabel(name),
    ...(hint?[swiftUIAccessibilityHint(hint)]:[])];
  return (
    <View ref={ref} style={style} {...{className:joinClasses(styled&&"gap-1",className)}}>
      <View style={{flexDirection:"row",alignItems:"flex-start"}}
        {...{className:joinClasses("flex-row items-start",styled&&"gap-3",rowClassName)}}>
        <View style={{minHeight:44,minWidth:44,justifyContent:"center",alignItems:"center",flexShrink:0}}>
          <Host matchContents colorScheme={colorScheme} seedColor={color} layoutDirection={direction}>
            <UniversalCheckbox value={checked===true} disabled={disabled} testID={testID} modifiers={modifiers}
              onValueChange={next=>{if(!disabled&&next!==(checked===true))onCheckedChange(next);}}/>
          </Host>
        </View>
        {label||description ? (
          <Pressable accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden
            disabled={disabled} onPress={toggle} style={{flexShrink:1,minHeight:44,justifyContent:"center"}}
            {...{className:joinClasses("min-w-0 flex-1",styled&&"gap-0.5 py-2.5",disabled&&"opacity-50")}}>
            {label ? <Text {...{className:joinClasses(styled&&"text-base leading-6 text-text",labelClassName)}}>{label}</Text> : null}
            {description ? <Text
              {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text> : null}
          </Pressable>
        ) : null}
      </View>
      {errorLine}
    </View>
  );
}
