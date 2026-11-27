// Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT).
import type { ComponentRef, Ref } from "react";
import type { TextInput, TextInputProps } from "react-native";
import { defaultCountThreshold, resolveRows, type CounterState, type RowBounds } from "./field-model.ts";

export type { CounterState } from "./field-model.ts";

/**
 * Props for {@linkcode Textarea}. Both forks share this surface. The web fork
 * (React Native Web / kit TextInput) honors every prop. The native fork
 * (`@expo/ui`: SwiftUI `TextField` with a vertical axis on iOS, Material 3
 * `OutlinedTextField` on Android) honors the props marked "both"; other
 * TextInput props are ignored there.
 */
export interface TextareaProps extends Omit<TextInputProps,"multiline"|"numberOfLines"> {
  /** Both. Fixed visible rows. Cannot be combined with `minRows`/`maxRows`. @default 4 */
  rows?:number;
  /** Both. Auto-grow: start at this many rows. @default 1 when only maxRows is set */
  minRows?:number;
  /** Both. Auto-grow: stop growing and scroll at this many rows. @default 100 when only minRows is set */
  maxRows?:number;
  /** Both. Hard character limit; the platform truncates as the person types. */
  maxLength?:number;
  /** Both. Shows a character counter under the field. With `maxLength` it counts what is left. */
  showCount?:boolean;
  /**
   * Both. Remaining characters at which the counter starts announcing
   * politely. @default 10% of maxLength, between 5 and 20
   */
  countThreshold?:number;
  /** Both. Counter wording, for other languages. Return words, not only digits. */
  countLabel?:(state:CounterState)=>string;
  /** Both. Marks the value as wrong. Inside a Field this follows the Field's error. */
  invalid?:boolean;
  /** Both. Same as `editable={false}`. Inside a Field this follows the Field. */
  disabled?:boolean;
  /** Web. Line height the row math assumes, before font scaling. Match the app's text class. @default 24 */
  lineHeight?:number;
  /** Web. Block-axis padding plus border, for the row math. @default 18 (styled), 0 (unstyled) */
  inset?:number;
  /** Native. SwiftUI / Compose color scheme for the native host. Defaults to the system's. */
  colorScheme?:"light"|"dark";
  /** Both. Root container class (on native, the RN wrapper around the native field and counter). */
  className?:string;
  /** Web. Class for the TextInput. */
  inputClassName?:string;
  /** Both. Class for the counter text (the counter is kit Text on both forks). */
  counterClassName?:string;
  /** Both. No default visual classes on the kit parts; native fields keep the OS look. */
  unstyled?:boolean;
  /**
   * Web: the TextInput. Native: a handle with `focus`, `blur`, `clear` and
   * `isFocused` only.
   */
  ref?:Ref<ComponentRef<typeof TextInput>>;
}

/** Validated numeric configuration both forks build from. */
export interface TextareaConfig {
  bounds:RowBounds;
  maxLength?:number;
  /** Remaining count at which the counter becomes a polite live region. */
  threshold:number;
}

/** Validates the numeric props. Throws RangeError like Button does for its limits. */
export function resolveTextareaConfig(
  {rows,minRows,maxRows,maxLength,countThreshold}:Pick<TextareaProps,"rows"|"minRows"|"maxRows"|"maxLength"|"countThreshold">,
):TextareaConfig {
  const bounds=resolveRows({rows,minRows,maxRows});
  if(maxLength!==undefined&&(!Number.isInteger(maxLength)||maxLength<1||maxLength>1_000_000)){
    throw new RangeError(`Invalid textarea maxLength: ${maxLength}`);
  }
  const threshold=countThreshold??(maxLength?defaultCountThreshold(maxLength):0);
  if(!Number.isInteger(threshold)||threshold<0)throw new RangeError(`Invalid textarea countThreshold: ${countThreshold}`);
  return {bounds,maxLength,threshold};
}
