/*
 * Behaviour adapted from NYC-MON packages/ui/Checkbox.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal Checkbox on web with kit
 * label, description and error, and ARIA written onto the hidden input.
 */
import { useId, useRef, type ComponentRef } from "react";
import { Platform, Pressable, Text, View, type ViewStyle } from "react-native";
import { Host, Checkbox as UniversalCheckbox } from "@expo/ui";
import { joinClasses } from "../styles.ts";
import { ariaValue, expoUiWebHostStyle } from "../expo-ui-web-model.ts";
import { useWebAriaPatch } from "../useWebAriaPatch.ts";
import { Checkbox as KitCheckbox } from "./Checkbox.kit.tsx";
import { nextCheckedState, requireName } from "./toggle-model.ts";
import type { CheckboxProps } from "./Checkbox.types.ts";

export type { CheckboxProps, CheckedState } from "./Checkbox.types.ts";

/**
 * Checkbox built on @expo/ui's universal `Checkbox`. This file serves web
 * and the default export condition; iOS and Android load
 * `Checkbox.native.tsx`, hosts without Expo UI load `Checkbox.kit.tsx`.
 *
 * On web the universal control is a visually hidden `<input
 * type="checkbox">`: the browser gives it the checkbox role, checked state,
 * focus and Space to toggle, and leaves Enter to the form. The universal
 * component takes no name, description or invalid prop, so they are written
 * onto that input: `aria-label` (the `accessibilityLabel`, else the label),
 * `aria-describedby` (the description and error lines) and `aria-invalid`.
 * Label and description are kit text after the box; a click on them
 * toggles, and they add no tab stop.
 *
 * `"indeterminate"` renders the kit checkbox, because the universal one is
 * boolean only.
 */
export function Checkbox(props:CheckboxProps){
  if(props.checked==="indeterminate")return <KitCheckbox {...props}/>;
  return <UniversalRow {...props}/>;
}

function UniversalRow({
  ref,checked,onCheckedChange,label,description,error,disabled=false,colorScheme,color,style,className,
  rowClassName,labelClassName,descriptionClassName,errorClassName,unstyled=false,testID,accessibilityLabel,
}:CheckboxProps){
  const name=requireName("Checkbox",label,accessibilityLabel);
  const styled=!unstyled;
  const id=useId();
  const descId=description?id+"-desc":undefined,errId=error?id+"-err":undefined;
  const control=useRef<ComponentRef<typeof View>>(null);
  useWebAriaPatch(control,'input[type="checkbox"]',{
    "aria-label":name,
    "aria-describedby":ariaValue([descId,errId].filter(Boolean).join(" ")),
    "aria-invalid":ariaValue(!!error),
  });
  const toggle=()=>{if(!disabled)onCheckedChange(nextCheckedState(checked));};
  return (
    <View ref={ref} style={style} {...{className:joinClasses(styled&&"gap-1",className)}}>
      <View style={{flexDirection:"row",alignItems:"flex-start"}}
        {...{className:joinClasses("flex-row items-start",styled&&"gap-3",rowClassName)}}>
        <View ref={control} style={{minHeight:44,minWidth:44,justifyContent:"center",alignItems:"center",flexShrink:0}}>
          <Host matchContents colorScheme={colorScheme} seedColor={color}
            style={Platform.OS==="web"?expoUiWebHostStyle(color!==undefined) as ViewStyle:undefined}>
            <UniversalCheckbox value={checked===true} disabled={disabled} testID={testID}
              onValueChange={next=>{if(!disabled&&next!==(checked===true))onCheckedChange(next);}}/>
          </Host>
        </View>
        {label||description ? (
          <Pressable focusable={false} disabled={disabled} onPress={toggle}
            style={{flexShrink:1,minHeight:44,justifyContent:"center"}}
            {...{className:joinClasses("min-w-0 flex-1",styled&&"gap-0.5 py-2.5",disabled&&"opacity-50")}}>
            {label ? <Text {...{className:joinClasses(styled&&"text-base leading-6 text-text",labelClassName)}}>{label}</Text> : null}
            {description ? <Text nativeID={descId}
              {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text> : null}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text nativeID={errId} accessibilityLiveRegion="polite"
          {...{className:joinClasses(styled&&"ps-14 text-sm leading-5 text-danger",errorClassName)}}>{error}</Text>
      ) : null}
    </View>
  );
}
