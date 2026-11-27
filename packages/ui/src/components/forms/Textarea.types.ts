/*
 * Behaviour adapted from NYC-MON packages/ui/Textarea.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): one prop surface for the three
 * implementations; row and length validation.
 */
import type { ComponentRef, Ref } from "react";
import type { TextInput, TextInputProps } from "react-native";
import { defaultCountThreshold, resolveRows, type CounterState, type RowBounds } from "./field-model.ts";

export type { CounterState } from "./field-model.ts";

/**
 * Props for {@linkcode Textarea}. Three implementations share this surface:
 *
 * - `Textarea.tsx` (web and the default condition): @expo/ui's universal
 *   `TextInput` with `multiline`. Honors the props marked "both" plus the
 *   universal props it forwards (placeholder, autoFocus, autoCapitalize,
 *   autoCorrect, keyboardType, selectTextOnFocus, placeholderTextColor,
 *   selectionColor, cursorColor, testID).
 * - `Textarea.native.tsx`: iOS on the universal `TextInput` (SwiftUI
 *   `TextField`, vertical axis), Android on Material 3 `OutlinedTextField`.
 *   Honors the props marked "both" plus placeholder, autoFocus and testID.
 * - `Textarea.kit.tsx` (QNX, Marathon and other hosts without Expo UI): a
 *   React Native `TextInput` that honors every prop.
 *
 * Other TextInput props reach the kit only.
 */
export interface TextareaProps extends Omit<TextInputProps,"multiline"|"numberOfLines"|"onFocus"|"onBlur"> {
  /**
   * Both. The field gained focus. Kit: called with the React Native focus
   * event. Expo UI forks: the OS fields report focus without an event, so
   * it is called with no argument.
   */
  onFocus?:(event?:Parameters<NonNullable<TextInputProps["onFocus"]>>[0])=>void;
  /** Both. The field lost focus. Kit: called with the blur event. Expo UI forks: called with no argument. */
  onBlur?:(event?:Parameters<NonNullable<TextInputProps["onBlur"]>>[0])=>void;
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
  /** Web and kit. Line height the row math assumes, before font scaling. Match the app's text class. @default 24 */
  lineHeight?:number;
  /**
   * Web and kit. Block-axis padding plus border, for the row math.
   * @default 24 on the universal web field; 18 on the styled kit, 0 unstyled
   */
  inset?:number;
  /** Expo UI. Color scheme for the `Host` subtree. Defaults to the system's. */
  colorScheme?:"light"|"dark";
  /** Both. Root container class (the RN wrapper around the field and counter). */
  className?:string;
  /** Kit only. Class for the TextInput; the Expo UI fields take no class. */
  inputClassName?:string;
  /** Both. Class for the counter text (the counter is kit Text on both forks). */
  counterClassName?:string;
  /** Both. No default visual classes on the kit parts; Expo UI fields keep their own look (iOS drops the rounded border). */
  unstyled?:boolean;
  /**
   * Kit: the TextInput. Expo UI: a handle with `focus`, `blur`, `clear` and
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
