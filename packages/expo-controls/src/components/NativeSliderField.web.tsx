import { SliderField } from "@nyc-tron/ui/components/shell/SliderField";
import type { NativeSliderFieldProps } from "./NativeSliderField.types.ts";
export type { NativeSliderFieldProps } from "./NativeSliderField.types.ts";

/**
 * Web: the token-styled {@linkcode SliderField} from `@nyc-tron/ui`. The
 * browser has no OS slider that reports the end of a drag, which the
 * commit-once contract needs.
 */
export function NativeSliderField({testID,...props}:NativeSliderFieldProps){
  return <SliderField {...props} testID={testID}/>;
}
