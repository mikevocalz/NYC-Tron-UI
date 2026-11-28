import type { ComponentRef, Ref } from "react";
import type { ColorValue, PressableProps, StyleProp, View, ViewStyle } from "react-native";
import type { SwitchSize } from "./toggle-model.ts";

export type { SwitchSize } from "./toggle-model.ts";

/**
 * Props for `Switch`. Three implementations share them:
 *
 * - `Switch.tsx` (web and the default condition): @expo/ui's universal
 *   `Switch`, whose web build is a hidden `<input role="switch">` with a
 *   drawn track.
 * - `Switch.native.tsx` (iOS and Android): the same universal `Switch`, which
 *   renders SwiftUI `Toggle` / Material 3 `Switch`, plus platform modifiers
 *   for the accessible name.
 * - `Switch.kit.tsx` (QNX, Marathon and other hosts without Expo UI): an RN +
 *   Tailwind control.
 *
 * In the two Expo UI forms the label is kit text next to the control and the
 * control carries the name. Props marked "kit" are ignored there: Expo UI
 * draws the track with the platform's (or its web build's) geometry, colors
 * and motion. Other `Pressable` props only reach the kit row.
 */
export interface SwitchProps extends Omit<PressableProps,"children"|"disabled"|"onPress"|"style"> {
  /** The outer row view (kit: the pressable row). */
  ref?:Ref<ComponentRef<typeof View>>;
  /** Whether the switch is on. The app owns this value. */
  value:boolean;
  /** Called with the new value after a press, Space or Enter (Enter: kit only). */
  onValueChange:(next:boolean)=>void;
  /**
   * Visible name, drawn at the start of the row; a tap on it toggles. Give
   * this or `accessibilityLabel`; a switch with neither throws.
   */
  label?:string;
  /** Kit: `md` is a 48 x 28 track, `sm` 36 x 20; both keep a 44pt target. Validated everywhere. @default "md" */
  size?:SwitchSize;
  disabled?:boolean;
  /** Kit: thumb slide length in ms, 0 to 1000; reduced motion makes it instant. Validated everywhere. @default 150 */
  animationMs?:number;
  /** Expo UI: appearance for the SwiftUI/Compose subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /**
   * Expo UI: explicit control color, passed as the `Host` `seedColor` (iOS
   * tint, an Android Material 3 palette seeded from it, the web primary
   * scale). Omit for the platform default on native and the app's
   * `--color-primary` on web. Kit: ignored (the track uses `bg-primary`).
   */
  color?:ColorValue;
  /** Outer row style. */
  style?:StyleProp<ViewStyle>;
  /** Outer row classes. */
  className?:string;
  /** Kit only. */
  trackClassName?:string;
  /** Kit only. */
  thumbClassName?:string;
  /** Label text classes. */
  labelClassName?:string;
  /** No default visual classes on the kit parts (label, row); geometry and the 44pt target stay. */
  unstyled?:boolean;
}
