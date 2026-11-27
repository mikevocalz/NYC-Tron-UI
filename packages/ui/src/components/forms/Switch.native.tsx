// Behaviour adapted from NYC-MON packages/ui/Switch.native.tsx (MIT).
import { I18nManager, Platform, View } from "react-native";
import { Host } from "@expo/ui";
import { Toggle as SwiftUIToggle } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as swiftUIAccessibilityLabel, disabled as swiftUIDisabled, frame, labelsHidden,
} from "@expo/ui/swift-ui/modifiers";
import { Row, Switch as ComposeSwitch, Text as ComposeText } from "@expo/ui/jetpack-compose";
import {
  defaultMinSize, fillMaxWidth, semantics, testID as composeTestID, toggleable, weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { requireName, switchGeometry, validateDuration } from "./toggle-model.ts";
import type { SwitchProps } from "./Switch.types.ts";

export type { SwitchProps, SwitchSize } from "./Switch.types.ts";

/**
 * The OS switch: SwiftUI `Toggle` on iOS, Material 3 `Switch` on Android,
 * both from `@expo/ui`. The label goes into the native control, so
 * VoiceOver and TalkBack read one element with its name, role and on/off
 * value, and the whole row (label included) toggles. On Android the row
 * carries `toggleable(role: switch)` and is at least 48dp tall; on iOS the
 * toggle row is at least 44pt. Track size, colors and the slide animation
 * (including reduced motion) are the platform's; `size`, `animationMs` and
 * the web class slots are validated but not drawn here.
 *
 * Requires @expo/ui native APIs on a verified Expo SDK 58 host.
 */
export function Switch({
  ref,value,onValueChange,label,size="md",disabled=false,animationMs=150,colorScheme,style,className,testID,
  accessibilityLabel,
}:SwitchProps){
  const name=requireName("Switch",label,accessibilityLabel);
  // Same validation as the web fork, so a bad prop fails on every platform.
  switchGeometry(size);validateDuration(animationMs);
  const toggle=()=>{if(!disabled)onValueChange(!value);};
  const control=Platform.OS==="android"
    ? (label
      ? <Row verticalAlignment="center" horizontalArrangement={{spacedBy:12}}
          modifiers={[fillMaxWidth(),defaultMinSize({minHeight:48}),
            toggleable(value,toggle,{role:"switch",enabled:!disabled}),
            ...(accessibilityLabel?[semantics({contentDescription:name})]:[]),
            ...(testID?[composeTestID(testID)]:[])]}>
          <ComposeText modifiers={[weight(1)]}>{label}</ComposeText>
          {/* No onCheckedChange: the toggleable row handles input and semantics. */}
          <ComposeSwitch value={value} enabled={!disabled}/>
        </Row>
      : <ComposeSwitch value={value} enabled={!disabled} onCheckedChange={()=>toggle()}
          modifiers={[defaultMinSize({minWidth:48,minHeight:48}),semantics({contentDescription:name}),
            ...(testID?[composeTestID(testID)]:[])]}/>)
    : <SwiftUIToggle isOn={value} label={label??name} onIsOnChange={next=>{if(!disabled&&next!==value)onValueChange(next);}}
        testID={testID}
        modifiers={[frame({minHeight:44}),
          ...(label?[]:[labelsHidden()]),
          ...(accessibilityLabel?[swiftUIAccessibilityLabel(name)]:[]),
          ...(disabled?[swiftUIDisabled(true)]:[])]}/>;
  return (
    <View ref={ref} style={[{minHeight:44,minWidth:44,justifyContent:"center"},style]}
      {...{className:joinClasses(className)}}>
      <Host colorScheme={colorScheme} layoutDirection={I18nManager.isRTL?"rightToLeft":"leftToRight"}
        matchContents={label?{vertical:true}:true} style={label?{width:"100%"}:undefined}>
        {control}
      </Host>
    </View>
  );
}
