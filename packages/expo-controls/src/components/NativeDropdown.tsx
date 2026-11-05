import { Host, Picker } from "@expo/ui";
import { Text, View } from "react-native";
import {
  joinDropdownClasses, validateDropdownOptions, type NativeDropdownProps,
} from "./NativeDropdown.types.ts";
export type { NativeDropdownProps, NativeDropdownOption } from "./NativeDropdown.types.ts";
export { validateDropdownOptions } from "./NativeDropdown.types.ts";

/**
 * Web (and default) presentation: Expo's universal Picker, which renders a
 * native <select>.
 *
 * Accessibility decision: the universal Picker takes no label prop, so the
 * visible caption names a role="group" wrapper. Screen readers announce the
 * group name ("Lesson") when focus enters the select, then the select's own
 * value. A role="button" wrapper is avoided on purpose: it would swallow the
 * select's keyboard and option semantics. iOS and Android use
 * NativeDropdown.native.tsx, which labels the platform picker itself.
 */
export function NativeDropdown({
  label,value,options,onValueChange,disabled=false,appearance="menu",
  className,labelClassName,testID,style,...rest
}:NativeDropdownProps){
  validateDropdownOptions(value,options);
  return <View {...rest} style={style} role="group" aria-label={label}
    {...{className:joinDropdownClasses("w-full min-w-0 gap-1",className)}}>
    <Text aria-hidden {...{className:joinDropdownClasses("text-sm text-text",labelClassName)}}>{label}</Text>
    <Host matchContents={{vertical:true}} style={{width:"100%"}}>
      <Picker selectedValue={value} appearance={appearance}
        onValueChange={next=>{if(!disabled && next!==value)onValueChange(next);}}
        enabled={!disabled && options.length>0} testID={testID}>
        {options.map(option=><Picker.Item key={option.value} label={option.label} value={option.value}/>)}
      </Picker>
    </Host>
  </View>;
}
