import { Host, Picker } from "@expo/ui";
import { Text, View, type ViewProps } from "react-native";
export interface NativeDropdownOption {
  readonly value: string;
  readonly label: string;
}
export interface NativeDropdownProps extends Omit<ViewProps,"children"> {
  readonly label: string;
  readonly value: string;
  readonly options: readonly NativeDropdownOption[];
  readonly onValueChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly appearance?: "menu" | "wheel";
  readonly className?: string;
  readonly labelClassName?: string;
  readonly testID?: string;
}
export function validateDropdownOptions(
  value:string,options:readonly NativeDropdownOption[]
):void{
  const seen=new Set<string>();
  for(const option of options){
    if(!option.value || typeof option.label!=="string" || !option.label.trim() ||
       seen.has(option.value))throw new TypeError("Dropdown values and labels must be unique/nonempty");
    seen.add(option.value);
  }
  if(options.length>0&&!seen.has(value))throw new RangeError("Selected value must be a declared option");
}
/**
 * Expo SDK 58 universal native Picker: real SwiftUI Menu on iOS,
 * Jetpack Compose picker on Android, Expo web implementation on web.
 * The consumer's semantic theme owns surrounding labels/backgrounds.
 */
export function NativeDropdown({
  label,value,options,onValueChange,disabled=false,appearance="menu",
  className,labelClassName,testID,style,...rest
}:NativeDropdownProps){
  validateDropdownOptions(value,options);
  return <View {...rest} style={style}
    {...{className:["w-full min-w-0 gap-1",className].filter(Boolean).join(" ")}}>
    <Text {...{className:["text-sm text-text",labelClassName].filter(Boolean).join(" ")}}>{label}</Text>
    <Host matchContents={{vertical:true}} style={{width:"100%"}}>
      <Picker selectedValue={value} appearance={appearance}
        onValueChange={next=>{if(!disabled && next!==value)onValueChange(next);}}
        enabled={!disabled && options.length>0} testID={testID}>
        {options.map(option=><Picker.Item key={option.value} label={option.label} value={option.value}/>)}
      </Picker>
    </Host>
  </View>;
}
