import { createContext, use, useMemo } from "react";
import { I18nManager, Platform, Text, View } from "react-native";
import { Host } from "@expo/ui";
import {
  Button as SwiftUIButton, HStack, Image as SwiftUIImage, Text as SwiftUIText, VStack,
} from "@expo/ui/swift-ui";
import {
  accessibilityAddTraits, accessibilityHint as swiftUIAccessibilityHint, accessibilityLabel as swiftUIAccessibilityLabel,
  buttonStyle, contentShape, disabled as swiftUIDisabled, foregroundStyle, frame, shapes,
} from "@expo/ui/swift-ui/modifiers";
import { Column, RadioButton, Row, Text as ComposeText } from "@expo/ui/jetpack-compose";
import {
  defaultMinSize, fillMaxWidth, selectable, semantics, testID as composeTestID, weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { radioSymbol, requireName } from "./toggle-model.ts";
import type { RadioGroupItemProps, RadioGroupProps } from "./Radio.types.ts";

export type { RadioGroupItemProps, RadioGroupProps, RadioProps } from "./Radio.types.ts";

interface GroupContext{
  value:string;disabled:boolean;unstyled:boolean;colorScheme?:"light"|"dark";
  select:(value:string)=>void;
}
const RadioGroupContext=createContext<GroupContext|null>(null);

/**
 * Single choice from a short list. The group is an RN view with the
 * `radiogroup` role and its label; each item is its own `@expo/ui` host, so
 * items can sit in any app layout. Android draws Material 3 `RadioButton`
 * rows with `selectable(role: radioButton)`; iOS has no radio control, so
 * items are plain SwiftUI `Button` rows with an SF Symbol ring and the
 * `isSelected` trait on the checked one (VoiceOver: "Selected"). Rows are at
 * least 48dp / 44pt tall. Keyboard roving is a web-fork behaviour.
 *
 * Requires @expo/ui native APIs on a verified Expo SDK 58 host.
 */
export function RadioGroup({
  ref,value,onValueChange,label,orientation="vertical",disabled=false,colorScheme,children,
  className,labelClassName,itemsClassName,unstyled=false,style,...rest
}:RadioGroupProps){
  const name=requireName("RadioGroup",label,rest.accessibilityLabel);
  const styled=!unstyled;
  const ctx=useMemo<GroupContext>(()=>({value,disabled,unstyled,colorScheme,
    select:next=>{if(!disabled&&next!==value)onValueChange(next);}}),[value,disabled,unstyled,colorScheme,onValueChange]);
  return (
    <View {...rest} ref={ref}
      accessibilityRole="radiogroup"
      accessibilityLabel={name}
      accessibilityState={{...rest.accessibilityState,disabled}}
      style={style}
      {...{className:joinClasses(styled&&"gap-2",className)}}>
      {label ? <Text accessibilityElementsHidden importantForAccessibility="no"
        {...{className:joinClasses(styled&&"text-sm font-semibold leading-5 text-text",labelClassName)}}>{label}</Text> : null}
      <View style={orientation==="horizontal"?{flexDirection:"row",flexWrap:"wrap"}:undefined}
        {...{className:joinClasses(orientation==="horizontal"?"flex-row flex-wrap":"flex-col",
          styled&&(orientation==="horizontal"?"gap-x-6":"gap-0"),itemsClassName)}}>
        <RadioGroupContext value={ctx}>{children}</RadioGroupContext>
      </View>
    </View>
  );
}

/** One option of a {@linkcode RadioGroup}. Throws when rendered outside one. */
export function RadioGroupItem({
  ref,value,label,description,disabled=false,style,className,testID,accessibilityLabel,accessibilityHint,
}:RadioGroupItemProps){
  const group=use(RadioGroupContext);
  if(!group)throw new Error("RadioGroupItem must be rendered inside a RadioGroup");
  const name=requireName("RadioGroupItem",label,accessibilityLabel);
  const off=disabled||group.disabled;
  const checked=group.value===value;
  const select=()=>{if(!off)group.select(value);};
  const hint=accessibilityHint??description;
  const wide=!!(label||description);
  const control=Platform.OS==="android"
    ? <Row verticalAlignment="center" horizontalArrangement={{spacedBy:12}}
        modifiers={[...(wide?[fillMaxWidth()]:[]),defaultMinSize({minWidth:48,minHeight:48}),
          ...(off?[]:[selectable(checked,select,"radioButton")]),
          ...(accessibilityLabel||!label?[semantics({contentDescription:name})]:[]),
          ...(testID?[composeTestID(testID)]:[])]}>
        {/* No onClick: the selectable row handles input and semantics. */}
        <RadioButton selected={checked} enabled={!off}/>
        {wide ? (
          <Column modifiers={[weight(1)]}>
            {label ? <ComposeText>{label}</ComposeText> : null}
            {description ? <ComposeText style={{typography:"bodySmall"}}>{description}</ComposeText> : null}
          </Column>
        ) : null}
      </Row>
    : <SwiftUIButton onPress={select} testID={testID}
        modifiers={[buttonStyle("plain"),frame({minHeight:44,maxWidth:wide?Infinity:undefined,alignment:"leading"}),
          contentShape(shapes.rectangle()),swiftUIAccessibilityLabel(name),
          ...(checked?[accessibilityAddTraits(["isSelected"])]:[]),
          ...(hint?[swiftUIAccessibilityHint(hint)]:[]),
          ...(off?[swiftUIDisabled(true)]:[])]}>
        <HStack spacing={12} alignment="firstTextBaseline">
          <SwiftUIImage systemName={radioSymbol(checked)} size={22}/>
          {wide ? (
            <VStack alignment="leading" spacing={2}>
              {label ? <SwiftUIText>{label}</SwiftUIText> : null}
              {description ? <SwiftUIText modifiers={[foregroundStyle({type:"hierarchical",style:"secondary"})]}>{description}</SwiftUIText> : null}
            </VStack>
          ) : null}
        </HStack>
      </SwiftUIButton>;
  return (
    <View ref={ref} style={[{minHeight:44,minWidth:44,justifyContent:"center"},style]} {...{className:joinClasses(className)}}>
      <Host colorScheme={group.colorScheme} layoutDirection={I18nManager.isRTL?"rightToLeft":"leftToRight"}
        matchContents={wide?{vertical:true}:true} style={wide?{width:"100%"}:undefined}>
        {control}
      </Host>
    </View>
  );
}

/** Short name for {@linkcode RadioGroupItem}. */
export const Radio=RadioGroupItem;
