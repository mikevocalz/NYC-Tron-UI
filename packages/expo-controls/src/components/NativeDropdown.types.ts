import type { ViewProps } from "react-native";
import type { NativeAppearanceProps } from "./native-appearance.ts";
import {
  flattenOptionGroups, validateOptionGroups, type OptionGroup,
} from "@nyc-tron/ui/components/forms/option-groups";

/** One choice in a {@linkcode NativeDropdown}. */
export interface NativeDropdownOption {
  readonly value: string;
  readonly label: string;
}
/**
 * Options under a section header: a SwiftUI `Section` on iOS, a heading row
 * between dividers in the Material menu on Android, a labelled group in the
 * shared web/QNX/Marathon selector.
 * @see {@linkcode NativeDropdownGroupsChoice.groups}
 */
export type NativeDropdownGroup=OptionGroup<NativeDropdownOption>;
/** A flat list of choices. */
export interface NativeDropdownOptionsChoice {
  readonly options: readonly NativeDropdownOption[];
  readonly groups?: undefined;
}
/** Choices under section headers, in display order. */
export interface NativeDropdownGroupsChoice {
  readonly groups: readonly NativeDropdownGroup[];
  readonly options?: undefined;
}
/** Props shared by both choice shapes of {@linkcode NativeDropdown}. */
export interface NativeDropdownBaseProps extends Omit<ViewProps,"children">,NativeAppearanceProps {
  /** Visible caption; also the name screen readers announce for the picker. */
  readonly label: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly disabled?: boolean;
  /** iOS only. Section headers show in `menu`; the `wheel` rotor lists every option without them. */
  readonly appearance?: "menu" | "wheel";
  readonly className?: string;
  readonly labelClassName?: string;
  readonly testID?: string;
}
/** {@linkcode NativeDropdown} props: flat `options` or headed `groups`, never both. */
export type NativeDropdownProps=NativeDropdownBaseProps&(NativeDropdownOptionsChoice|NativeDropdownGroupsChoice);

/** Every option, in display order, whichever choice shape the dropdown was given. Validates group headings. */
export function dropdownOptions(
  choice:NativeDropdownOptionsChoice|NativeDropdownGroupsChoice
):readonly NativeDropdownOption[]{
  if(choice.groups!==undefined){
    if(choice.options!==undefined)throw new TypeError("NativeDropdown takes `options` or `groups`, not both");
    validateOptionGroups(choice.groups);
    return flattenOptionGroups(choice.groups);
  }
  return choice.options;
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
