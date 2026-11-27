import type { ComponentRef, Ref } from "react";
import type { PressableProps, StyleProp, View, ViewStyle } from "react-native";
import type { CheckedState } from "./toggle-model.ts";

export type { CheckedState } from "./toggle-model.ts";

/**
 * Props for `Checkbox`. The web fork (`Checkbox.web.tsx`) draws the box with
 * RN views and Tailwind tokens; the iOS/Android fork (`Checkbox.native.tsx`)
 * uses `@expo/ui`: a SwiftUI button row with an SF Symbol box on iOS (iOS
 * has no checkbox control) and Material 3 `TriStateCheckbox` on Android.
 * Props marked "web" are ignored by the native fork.
 */
export interface CheckboxProps extends Omit<PressableProps,"children"|"disabled"|"onPress"|"style"> {
  /** Web: the pressable row. Native: the RN view wrapping the native host and error line. */
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
   * Error message. When set it is shown under the row and attached to the
   * control, so the error is never shown by color alone. Web also turns the
   * box border `danger`.
   */
  error?:string;
  disabled?:boolean;
  /** Native: appearance for the SwiftUI/Compose subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /** Outer view style (wraps the row and the error line). */
  style?:StyleProp<ViewStyle>;
  /** Outer view classes. */
  className?:string;
  /** Web: pressable row classes. */
  rowClassName?:string;
  /** Web only. */
  boxClassName?:string;
  /** Web: border color classes for the check and dash. */
  markClassName?:string;
  /** Web only. */
  labelClassName?:string;
  /** Web only. */
  descriptionClassName?:string;
  /** Error line classes (both forks render the error as RN text). */
  errorClassName?:string;
  /** No default visual classes (web row and box; native error line). */
  unstyled?:boolean;
}
