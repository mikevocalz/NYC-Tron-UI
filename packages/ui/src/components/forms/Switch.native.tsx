/*
 * Behaviour adapted from NYC-MON packages/ui/Switch.native.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal Switch with SwiftUI /
 * Compose accessibility modifiers and a kit label; size and animation
 * validated as in the kit.
 */
import { I18nManager, Platform, Pressable, Text, View } from "react-native";
import { Host, Switch as UniversalSwitch } from "@expo/ui";
import { accessibilityLabel as swiftUIAccessibilityLabel, frame, labelsHidden } from "@expo/ui/swift-ui/modifiers";
import { defaultMinSize, semantics } from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { requireName, switchGeometry, validateDuration } from "./toggle-model.ts";
import type { SwitchProps } from "./Switch.types.ts";

export type { SwitchProps, SwitchSize } from "./Switch.types.ts";

/**
 * iOS and Android: @expo/ui's universal `Switch`, which renders SwiftUI
 * `Toggle` on iOS and Material 3 `Switch` on Android.
 *
 * This fork exists only because the universal component has no
 * accessible-name prop and the modifiers that add one load native modules,
 * so they cannot be imported by the web file. The control gets the name
 * through `accessibilityLabel` (SwiftUI) or `semantics(contentDescription)`
 * (Compose), with `labelsHidden()` so SwiftUI draws no second label. It is at
 * least 44pt tall on iOS and 48dp square on Android.
 *
 * The visible label is kit text at the start of the row: a tap on it
 * toggles, and it is hidden from VoiceOver and TalkBack because the control
 * already carries the name, role and on/off value. Track size, colors and
 * the slide animation (including reduced motion) are the platform's; `color`
 * becomes the Host `seedColor`.
 *
 * Requires @expo/ui native APIs on a verified Expo SDK 58 host.
 */
export function Switch({
  ref,value,onValueChange,label,size="md",disabled=false,animationMs=150,colorScheme,color,style,className,
  labelClassName,unstyled=false,testID,accessibilityLabel,
}:SwitchProps){
  const name=requireName("Switch",label,accessibilityLabel);
  // Same validation as the kit, so a bad prop fails on every platform.
  switchGeometry(size);validateDuration(animationMs);
  const styled=!unstyled;
  const toggle=()=>{if(!disabled)onValueChange(!value);};
  const modifiers=Platform.OS==="android"
    ? [defaultMinSize({minWidth:48,minHeight:48}),semantics({contentDescription:name})]
    : [frame({minHeight:44}),labelsHidden(),swiftUIAccessibilityLabel(name)];
  return (
    <View ref={ref} style={[{minHeight:44,minWidth:44,flexDirection:"row",alignItems:"center"},style]}
      {...{className:joinClasses("flex-row items-center",styled&&"gap-3",className)}}>
      {label ? (
        <Pressable accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden
          disabled={disabled} onPress={toggle} style={{flexShrink:1,minHeight:44,justifyContent:"center"}}
          {...{className:"min-w-0 flex-1"}}>
          <Text {...{className:joinClasses(styled&&"text-base leading-6 text-text",disabled&&"opacity-50",labelClassName)}}>
            {label}
          </Text>
        </Pressable>
      ) : null}
      <Host matchContents colorScheme={colorScheme} seedColor={color}
        layoutDirection={I18nManager.isRTL?"rightToLeft":"leftToRight"}>
        <UniversalSwitch value={value} disabled={disabled} testID={testID} modifiers={modifiers}
          onValueChange={next=>{if(!disabled&&next!==value)onValueChange(next);}}/>
      </Host>
    </View>
  );
}
