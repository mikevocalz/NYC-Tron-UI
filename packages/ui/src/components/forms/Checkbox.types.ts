import type { ComponentRef, Ref } from "react";
import type { ColorValue, PressableProps, StyleProp, View, ViewStyle } from "react-native";
import type { CheckedState } from "./toggle-model.ts";

export type { CheckedState } from "./toggle-model.ts";

/**
 * Props for `Checkbox`. Three implementations share them:
 *
 * - `Checkbox.tsx` (web and the default condition): @expo/ui's universal
 *   `Checkbox`, whose web build is a visually hidden `<input type="checkbox">`
 *   with a drawn box.
 * - `Checkbox.native.tsx` (iOS and Android): the same universal `Checkbox`
 *   (SwiftUI `Toggle` on iOS, which iOS draws as a switch because it has no
 *   checkbox control; Material 3 `Checkbox` on Android) plus platform
 *   modifiers for the name and hint.
 * - `Checkbox.kit.tsx` (QNX, Marathon and other hosts without Expo UI): RN
 *   views with Tailwind tokens.
 *
 * The universal Checkbox is boolean only. `"indeterminate"` renders Material
 * 3 `TriStateCheckbox` on Android and the kit checkbox on web and iOS.
 * In the Expo UI forms label, description and error are kit text around the
 * control. Props marked "kit" only style the kit box; other `Pressable` props
 * only reach the kit row.
 */
export interface CheckboxProps extends Omit<PressableProps,"children"|"disabled"|"onPress"|"style"> {
  /** The outer view that holds the row and the error line (kit: the pressable row). */
  ref?:Ref<ComponentRef<typeof View>>;
  /** `"indeterminate"` draws a dash and is announced as mixed (a parent of partly checked items). */
  checked:CheckedState;
  /** Called with the next value; indeterminate and unchecked both go to `true`. */
  onCheckedChange:(next:boolean)=>void;
  /** Visible name next to the box. Give this or `accessibilityLabel`; neither throws. */
  label?:string;
  /** Secondary line under the label, read as the control's hint/description. */
  description?:string;
  /**
   * Error message. When set it is shown under the row as a polite live
   * region and attached to the control (web `aria-describedby` and
   * `aria-invalid`, iOS hint), so the error is never shown by color alone.
   * The kit also turns the box border `danger`.
   */
  error?:string;
  disabled?:boolean;
  /** Expo UI: appearance for the SwiftUI/Compose subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /**
   * Expo UI: explicit control color, passed as the `Host` `seedColor`. Omit
   * for the platform default on native and the app's `--color-primary` on
   * web. Kit: ignored (the box uses `bg-primary`).
   */
  color?:ColorValue;
  /** Outer view style (wraps the row and the error line). */
  style?:StyleProp<ViewStyle>;
  /** Outer view classes. */
  className?:string;
  /** Row classes (control plus label column). */
  rowClassName?:string;
  /** Kit only. */
  boxClassName?:string;
  /** Kit: border color classes for the check and dash. */
  markClassName?:string;
  /** Label text classes. */
  labelClassName?:string;
  /** Description text classes. */
  descriptionClassName?:string;
  /** Error line classes (every implementation renders the error as RN text). */
  errorClassName?:string;
  /** No default visual classes on the kit parts (row, texts, kit box). */
  unstyled?:boolean;
}
