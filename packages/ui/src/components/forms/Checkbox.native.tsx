// Behaviour adapted from NYC-MON packages/ui/Checkbox.tsx (MIT).
import { I18nManager, Platform, Text, View } from "react-native";
import { Host } from "@expo/ui";
import {
  Button as SwiftUIButton, HStack, Image as SwiftUIImage, Text as SwiftUIText, VStack,
} from "@expo/ui/swift-ui";
import {
  accessibilityAddTraits, accessibilityHint as swiftUIAccessibilityHint, accessibilityLabel as swiftUIAccessibilityLabel,
  accessibilityValue, buttonStyle, contentShape, disabled as swiftUIDisabled, foregroundStyle, frame, shapes,
} from "@expo/ui/swift-ui/modifiers";
import { Column, Row, Text as ComposeText, TriStateCheckbox } from "@expo/ui/jetpack-compose";
import {
  clickable, defaultMinSize, fillMaxWidth, semantics, testID as composeTestID, toggleable, weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { checkboxSymbol, checkedValueText, nextCheckedState, requireName, toggleableState } from "./toggle-model.ts";
import type { CheckboxProps } from "./Checkbox.types.ts";

export type { CheckboxProps, CheckedState } from "./Checkbox.types.ts";

/**
 * Native checkbox from `@expo/ui`.
 *
 * Android: Material 3 `TriStateCheckbox` in a row that is at least 48dp
 * tall; label and description sit in the row, so TalkBack reads one element.
 * Checked and unchecked rows use `toggleable(role: checkbox)`. Compose's
 * tri-state semantics are not exposed by `@expo/ui`, so an indeterminate row
 * is a clickable row whose description ends in "Partially checked" (the
 * checkbox role is not announced in that one state).
 *
 * iOS has no checkbox control (SwiftUI's checkbox toggle style is macOS
 * only), so the row is a plain SwiftUI `Button` with an SF Symbol box
 * (square, checkmark.square.fill, minus.square.fill), the `isToggle` trait
 * (iOS 17+) and the state as its accessibility value. At least 44pt tall.
 *
 * Both platforms show `error` as RN text under the row (token classes),
 * announced politely; iOS also attaches description and error as the hint.
 *
 * Requires @expo/ui native APIs on a verified Expo SDK 58 host.
 */
export function Checkbox({
  ref,checked,onCheckedChange,label,description,error,disabled=false,colorScheme,style,
  className,errorClassName,unstyled=false,testID,accessibilityLabel,accessibilityHint,
}:CheckboxProps){
  const name=requireName("Checkbox",label,accessibilityLabel);
  const styled=!unstyled;
  const toggle=()=>{if(!disabled)onCheckedChange(nextCheckedState(checked));};
  const hint=accessibilityHint??([description,error].filter(Boolean).join(". ")||undefined);
  const mixed=checked==="indeterminate";
  const control=Platform.OS==="android"
    ? <Row verticalAlignment="center" horizontalArrangement={{spacedBy:12}}
        modifiers={[
          ...(label||description?[fillMaxWidth()]:[]),defaultMinSize({minWidth:48,minHeight:48}),
          ...(mixed
            ? [clickable(toggle),semantics({contentDescription:[name,description,checkedValueText(checked)].filter(Boolean).join(", ")})]
            : [toggleable(checked===true,toggle,{role:"checkbox",enabled:!disabled}),
               ...(accessibilityLabel||!label?[semantics({contentDescription:name})]:[])]),
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
    : <SwiftUIButton onPress={toggle} testID={testID}
        modifiers={[buttonStyle("plain"),frame({minHeight:44,maxWidth:label||description?Infinity:undefined,alignment:"leading"}),
          contentShape(shapes.rectangle()),swiftUIAccessibilityLabel(name),accessibilityValue(checkedValueText(checked)),
          accessibilityAddTraits(["isToggle"]),...(hint?[swiftUIAccessibilityHint(hint)]:[]),
          ...(disabled?[swiftUIDisabled(true)]:[])]}>
        <HStack spacing={12} alignment="firstTextBaseline">
          <SwiftUIImage systemName={checkboxSymbol(checked)} size={22}/>
          {label||description ? (
            <VStack alignment="leading" spacing={2}>
              {label ? <SwiftUIText>{label}</SwiftUIText> : null}
              {description ? <SwiftUIText modifiers={[foregroundStyle({type:"hierarchical",style:"secondary"})]}>{description}</SwiftUIText> : null}
            </VStack>
          ) : null}
        </HStack>
      </SwiftUIButton>;
  return (
    <View ref={ref} style={[{minHeight:44,minWidth:44},style]} {...{className:joinClasses(styled&&"gap-1",className)}}>
      <Host colorScheme={colorScheme} layoutDirection={I18nManager.isRTL?"rightToLeft":"leftToRight"}
        matchContents={label||description?{vertical:true}:true} style={label||description?{width:"100%"}:undefined}>
        {control}
      </Host>
      {error ? (
        <Text accessibilityLiveRegion="polite"
          {...{className:joinClasses(styled&&"text-sm leading-5 text-danger",errorClassName)}}>{error}</Text>
      ) : null}
    </View>
  );
}
