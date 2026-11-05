import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Platform } from "react-native";
import { Host } from "@expo/ui";
import { RNHostView, Text as ComposeText, TooltipBox } from "@expo/ui/jetpack-compose";
import { testID as composeTestID } from "@expo/ui/jetpack-compose/modifiers";
import { validateTooltipLabel, type TooltipProps } from "./Tooltip.types.ts";
export type { TooltipProps } from "./Tooltip.types.ts";

/**
 * Android draws a Material 3 plain tooltip through @expo/ui's Compose
 * `TooltipBox`. iOS has no touch tooltip, so on iOS this only sets the
 * anchor's accessibilityHint for VoiceOver and renders the child unchanged.
 */
export function Tooltip({label,children,disabled=false,testID}:TooltipProps){
  const text=validateTooltipLabel(label);
  const anchor=withAccessibilityHint(children,text);
  if(Platform.OS!=="android")return <>{anchor}</>;
  return <Host matchContents>
    <TooltipBox enableUserInput={!disabled}
      modifiers={testID?[composeTestID(testID)]:undefined}>
      <TooltipBox.PlainTooltip><ComposeText>{text}</ComposeText></TooltipBox.PlainTooltip>
      <RNHostView matchContents>{anchor as ReactElement}</RNHostView>
    </TooltipBox>
  </Host>;
}

type HintProps={accessibilityHint?:string};
/** Appends the tooltip text to the anchor's own hint instead of replacing it. */
function withAccessibilityHint(child:ReactNode,hint:string):ReactNode{
  if(!isValidElement<HintProps>(child))return child;
  const own=child.props.accessibilityHint;
  return cloneElement(child,{accessibilityHint:own&&own!==hint?own+". "+hint:hint});
}
