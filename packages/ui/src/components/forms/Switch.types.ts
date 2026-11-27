import type { ComponentRef, Ref } from "react";
import type { PressableProps, StyleProp, View, ViewStyle } from "react-native";
import type { SwitchSize } from "./toggle-model.ts";

export type { SwitchSize } from "./toggle-model.ts";

/**
 * Props for `Switch`. The web fork (`Switch.web.tsx`) is an RN + Tailwind
 * kit control; the iOS/Android fork (`Switch.native.tsx`) is SwiftUI
 * `Toggle` / Material 3 `Switch` from `@expo/ui`. Props marked "web" are
 * ignored by the native fork, which takes the platform's own geometry,
 * colors and motion.
 */
export interface SwitchProps extends Omit<PressableProps,"children"|"disabled"|"onPress"|"style"> {
  /** Web: the pressable row. Native: the RN view wrapping the native host. */
  ref?:Ref<ComponentRef<typeof View>>;
  /** Whether the switch is on. The app owns this value. */
  value:boolean;
  /** Called with the new value after a press, Space or Enter. */
  onValueChange:(next:boolean)=>void;
  /**
   * Visible name, drawn at the start of the row (passed into the native
   * control on iOS/Android). Give this or `accessibilityLabel`; a switch with
   * neither throws.
   */
  label?:string;
  /** Web: `md` is a 48 x 28 track, `sm` 36 x 20; both keep a 44pt target. @default "md" */
  size?:SwitchSize;
  disabled?:boolean;
  /** Web: thumb slide length in ms, 0 to 1000; reduced motion makes it instant. @default 150 */
  animationMs?:number;
  /** Native: appearance for the SwiftUI/Compose subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /** Web: row style. Native: wrapper view style. */
  style?:StyleProp<ViewStyle>;
  /** Web: row classes. Native: wrapper view classes. */
  className?:string;
  /** Web only. */
  trackClassName?:string;
  /** Web only. */
  thumbClassName?:string;
  /** Web only. */
  labelClassName?:string;
  /** Web: no default visual classes; geometry and the 44pt target stay. Native: ignored. */
  unstyled?:boolean;
}
