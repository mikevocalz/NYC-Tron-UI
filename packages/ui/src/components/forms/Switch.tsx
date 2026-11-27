/*
 * Behaviour adapted from NYC-MON packages/ui/Switch.native.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal Switch on web with a kit
 * label and aria-label written onto the hidden input.
 */
import { useRef, type ComponentRef } from "react";
import { Platform, Pressable, Text, View, type ViewStyle } from "react-native";
import { Host, Switch as UniversalSwitch } from "@expo/ui";
import { joinClasses } from "../styles.ts";
import { expoUiWebHostStyle } from "../expo-ui-web-model.ts";
import { useWebAriaPatch } from "../useWebAriaPatch.ts";
import { requireName, switchGeometry, validateDuration } from "./toggle-model.ts";
import type { SwitchProps } from "./Switch.types.ts";

export type { SwitchProps, SwitchSize } from "./Switch.types.ts";

/**
 * On/off control that takes effect immediately, built on @expo/ui's
 * universal `Switch`. This file serves web and the default export
 * condition; iOS and Android load `Switch.native.tsx`, hosts without Expo UI
 * load `Switch.kit.tsx`.
 *
 * On web the universal control is a visually hidden `<input type="checkbox"
 * role="switch">`: the browser gives it the switch role, checked state,
 * focus and Space to toggle (Enter does not toggle, unlike the kit). The
 * universal component takes no accessible-name prop, so the name (the
 * `accessibilityLabel`, else the label) is written onto that input as
 * `aria-label`. The visible label is kit text at the start of the row; a
 * click on it toggles, and it is not a second tab stop. Track colors come
 * from the Host style that maps @expo/ui's `--expo-ui-*` variables onto the
 * app's tokens (see docs/THEME_TOKENS.md).
 */
export function Switch({
  ref,value,onValueChange,label,size="md",disabled=false,animationMs=150,colorScheme,color,style,
  className,labelClassName,unstyled=false,testID,accessibilityLabel,
}:SwitchProps){
  const name=requireName("Switch",label,accessibilityLabel);
  // Same validation as the kit, so a bad prop fails on every platform.
  switchGeometry(size);validateDuration(animationMs);
  const styled=!unstyled;
  const control=useRef<ComponentRef<typeof View>>(null);
  useWebAriaPatch(control,'input[role="switch"]',{"aria-label":name});
  const toggle=()=>{if(!disabled)onValueChange(!value);};
  return (
    <View ref={ref} style={[{minHeight:44,minWidth:44,flexDirection:"row",alignItems:"center"},style]}
      {...{className:joinClasses("flex-row items-center",styled&&"gap-3",className)}}>
      {label ? (
        <Pressable focusable={false} disabled={disabled} onPress={toggle}
          style={{flexShrink:1,minHeight:44,justifyContent:"center"}} {...{className:"min-w-0 flex-1"}}>
          <Text {...{className:joinClasses(styled&&"text-base leading-6 text-text",disabled&&"opacity-50",labelClassName)}}>
            {label}
          </Text>
        </Pressable>
      ) : null}
      <View ref={control} style={{minHeight:44,minWidth:44,justifyContent:"center",alignItems:"center",flexShrink:0}}>
        <Host matchContents colorScheme={colorScheme} seedColor={color}
          style={Platform.OS==="web"?expoUiWebHostStyle(color!==undefined) as ViewStyle:undefined}>
          <UniversalSwitch value={value} disabled={disabled} testID={testID}
            onValueChange={next=>{if(!disabled&&next!==value)onValueChange(next);}}/>
        </Host>
      </View>
    </View>
  );
}
