import { Host, Picker } from "@expo/ui";
import { Text, View } from "react-native";
import { Select } from "@nyc-tron/ui/components/Select";
import {
  dropdownOptions, joinDropdownClasses, validateDropdownOptions, type NativeDropdownProps,
} from "./NativeDropdown.types.ts";
export type {
  NativeDropdownProps, NativeDropdownOption, NativeDropdownGroup,
  NativeDropdownBaseProps, NativeDropdownOptionsChoice, NativeDropdownGroupsChoice,
} from "./NativeDropdown.types.ts";
export { validateDropdownOptions, dropdownOptions } from "./NativeDropdown.types.ts";

/**
 * Web (and default) presentation.
 *
 * Flat `options`: Expo's universal Picker, which renders a native <select>.
 * The universal Picker takes no label prop, so the visible caption names a
 * role="group" wrapper. Screen readers announce the group name ("Lesson")
 * when focus enters the select, then the select's own value. A role="button"
 * wrapper is avoided on purpose: it would swallow the select's keyboard and
 * option semantics.
 *
 * `groups`: the universal Picker cannot render <optgroup>, so headed groups
 * use the kit's token-styled Select, an APG select-only combobox whose list
 * is a grouped listbox (each group named by its heading). It takes the same
 * label, value and change contract.
 *
 * iOS and Android use NativeDropdown.native.tsx, which labels the platform
 * picker itself.
 */
export function NativeDropdown(props:NativeDropdownProps){
  const {
    label,value,onValueChange,disabled=false,appearance="menu",
    className,labelClassName,testID,style,options:_options,groups,...rest
  }=props;
  const options=dropdownOptions(props);
  validateDropdownOptions(value,options);
  if(groups!==undefined)return <Select {...rest} style={style} className={className} label={label} value={value}
    groups={groups} disabled={disabled} testID={testID} onValueChange={onValueChange}/>;
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
