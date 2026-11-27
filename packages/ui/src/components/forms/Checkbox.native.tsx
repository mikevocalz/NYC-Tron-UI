/*
 * Behaviour adapted from NYC-MON packages/ui/Checkbox.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): universal Checkbox with SwiftUI /
 * Compose accessibility modifiers, Compose TriStateCheckbox for
 * indeterminate on Android, kit label text.
 */
import { I18nManager, Platform, Pressable, Text, View } from "react-native";
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
import { checkedValueText, nextCheckedState, requireName, toggleableState } from "./toggle-model.ts";
import type { CheckboxProps } from "./Checkbox.types.ts";

export type { CheckboxProps, CheckedState } from "./Checkbox.types.ts";

/**
 * iOS and Android: @expo/ui's universal `Checkbox` for checked and
 * unchecked. It renders Material 3 `Checkbox` on Android and SwiftUI
 * `Toggle` on iOS. iOS has no checkbox control (SwiftUI's checkbox toggle
 * style is macOS only), so iOS shows a switch and VoiceOver says "switch".
 *
 * This fork exists because the universal component has no name, hint or
 * mixed state, and the platform modifiers and Compose views that add them
 * load native modules, so the web file cannot import them:
 *
 * - The control gets the name through `accessibilityLabel` (SwiftUI) or
 *   `semantics(contentDescription)` (Compose, which also reads the
 *   description); iOS adds description and error as the hint. Kit label and
 *   description text sit after the control, toggle on tap, and are hidden
 *   from VoiceOver and TalkBack. At least 44pt on iOS, 48dp on Android.
 * - `"indeterminate"`: Android renders Material 3 `TriStateCheckbox` in a
 *   clickable row whose description ends in "Partially checked" (Compose's
 *   tri-state semantics are not exposed by `@expo/ui`). iOS renders the kit
 *   checkbox, which announces mixed.
 *
 * The error is RN text under the row, announced politely.
 *
 * Requires @expo/ui native APIs on a verified Expo SDK 58 host.
 */
export function Checkbox(props:CheckboxProps){
  if(props.checked==="indeterminate"&&Platform.OS!=="android")return <KitCheckbox {...props}/>;
  return <NativeCheckbox {...props}/>;
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
      {...{className:joinClasses(styled&&(checked==="indeterminate"?"text-sm leading-5 text-danger":"ps-14 text-sm leading-5 text-danger"),errorClassName)}}>{error}</Text>
  ) : null;

  if(checked==="indeterminate"){
    // Android only (iOS returned the kit above): the universal Checkbox has no mixed state.
    return (
      <View ref={ref} style={[{minHeight:44,minWidth:44},style]} {...{className:joinClasses(styled&&"gap-1",className)}}>
        <Host colorScheme={colorScheme} seedColor={color} layoutDirection={direction}
          matchContents={label||description?{vertical:true}:true} style={label||description?{width:"100%"}:undefined}>
          <Row verticalAlignment="center" horizontalArrangement={{spacedBy:12}}
            modifiers={[
              ...(label||description?[fillMaxWidth()]:[]),defaultMinSize({minWidth:48,minHeight:48}),
              clickable(toggle),
              semantics({contentDescription:[name,description,checkedValueText(checked)].filter(Boolean).join(", ")}),
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

  const modifiers=android
    ? [defaultMinSize({minWidth:48,minHeight:48}),
       semantics({contentDescription:[name,description].filter(Boolean).join(", ")})]
    : [frame({minHeight:44}),labelsHidden(),swiftUIAccessibilityLabel(name),
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
