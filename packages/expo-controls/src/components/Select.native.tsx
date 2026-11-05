import { Text, View } from "react-native";
import { Select as TokenSelect, type SelectProps } from "@nyc-tron/ui/components/Select";
import { NativeDropdown } from "./NativeDropdown.native.tsx";
export type { SelectProps, SelectOption } from "@nyc-tron/ui/components/Select";

/**
 * iOS and Android: the `@nyc-tron/ui` Select contract rendered as the
 * platform picker (SwiftUI Picker / Material exposed dropdown) through
 * NativeDropdown.
 *
 * Two cases keep the token-styled combobox instead, because the platform
 * pickers cannot express them honestly:
 *  - `value` matches no option (a placeholder state). SwiftUI's Picker needs
 *    a selection that exists, and NativeDropdown rejects an undeclared value.
 *  - a disabled option other than the current one. Neither platform picker
 *    exposes a per-item disabled state through @expo/ui 58, and silently
 *    dropping the row would hide a choice the host meant to show as
 *    unavailable.
 */
export function Select(props:SelectProps){
  const {label,value,options,onValueChange,disabled,hint,errorText,testID,className}=props;
  const declared=options.some(o=>o.value===value);
  const lockedRow=options.some(o=>o.disabled&&o.value!==value);
  if(!declared||lockedRow)return <TokenSelect {...props}/>;
  const message=errorText??hint;
  return <View {...{className:["w-full min-w-0 gap-1",className].filter(Boolean).join(" ")}}>
    <NativeDropdown label={label} value={value} disabled={disabled} testID={testID}
      options={options.map(o=>({value:o.value,label:o.label??o.value}))}
      onValueChange={onValueChange}/>
    {message?<Text
      {...(errorText?{accessibilityRole:"alert" as const,accessibilityLiveRegion:"polite" as const}:{})}
      {...{className:errorText?"text-sm text-danger":"text-sm text-text-muted"}}>{message}</Text>:null}
  </View>;
}
