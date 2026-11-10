import { Select } from "@nyc-tron/ui/components/Select";
import { dropdownOptions, validateDropdownOptions, type NativeDropdownProps } from "./NativeDropdown.types.ts";
export type { NativeDropdownProps, NativeDropdownOption, NativeDropdownGroup } from "./NativeDropdown.types.ts";

/**
 * QNX and Marathon use the shared React Native selector. The list opens in
 * flow, with the same controlled value and grouped choices. The app owns
 * its token theme; `appearance` is an iOS picker option and `colorScheme`
 * configures Expo Hosts, neither of which this presentation creates.
 */
export function NativeDropdown({appearance:_appearance,colorScheme:_colorScheme,...props}:NativeDropdownProps){
  validateDropdownOptions(props.value,dropdownOptions(props));
  return <Select {...props}/>;
}
