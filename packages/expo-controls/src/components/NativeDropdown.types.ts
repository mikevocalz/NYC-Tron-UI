import type { ViewProps } from "react-native";

export interface NativeDropdownOption {
  readonly value: string;
  readonly label: string;
}
export interface NativeDropdownProps extends Omit<ViewProps,"children"> {
  /** Visible caption; also the name screen readers announce for the picker. */
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
export function selectedOptionLabel(
  value:string,options:readonly NativeDropdownOption[]
):string{
  return options.find(option=>option.value===value)?.label ?? "";
}
export function joinDropdownClasses(...values:Array<string|undefined>):string{
  return values.filter(Boolean).join(" ");
}
