import type { ComponentRef, ReactNode, Ref } from "react";
import type { PressableProps, StyleProp, View, ViewProps, ViewStyle } from "react-native";

/**
 * Props for `RadioGroup`. The web fork (`Radio.web.tsx`) is an RN + Tailwind
 * kit group with roving tabindex; the iOS/Android fork (`Radio.native.tsx`)
 * draws each item with `@expo/ui` (Material 3 `RadioButton` rows on Android,
 * SwiftUI button rows with the selected trait on iOS) inside an RN group view.
 */
export interface RadioGroupProps extends Omit<ViewProps,"children"|"role"> {
  ref?:Ref<ComponentRef<typeof View>>;
  /** Checked item's value. `""` (or a value no item has) leaves every item unchecked. */
  value:string;
  onValueChange:(value:string)=>void;
  /** Visible group name above the items. Give this or `accessibilityLabel`; neither throws. */
  label?:string;
  /** Layout of the items. On web arrow keys work on both axes either way (WAI-ARIA APG). @default "vertical" */
  orientation?:"vertical"|"horizontal";
  /** Disables every item. */
  disabled?:boolean;
  /** Native: appearance for every item's SwiftUI/Compose subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /** `RadioGroupItem` elements, in any wrapper views. */
  children?:ReactNode;
  className?:string;
  labelClassName?:string;
  /** Classes for the view that lays out the items. */
  itemsClassName?:string;
  /** No default visual classes, for this group and (web) its items unless an item sets its own. */
  unstyled?:boolean;
}

/** Props for `RadioGroupItem` (also exported as `Radio`). */
export interface RadioGroupItemProps extends Omit<PressableProps,"children"|"disabled"|"onPress"|"style"> {
  /** Web: the pressable row. Native: the RN view wrapping the native host. */
  ref?:Ref<ComponentRef<typeof View>>;
  /** Unique within the group. */
  value:string;
  /** Visible option text. Give this or `accessibilityLabel`; neither throws. */
  label?:string;
  /** Secondary line under the label, read as the item's hint/description. */
  description?:string;
  disabled?:boolean;
  style?:StyleProp<ViewStyle>;
  /** Web: row classes. Native: wrapper view classes. */
  className?:string;
  /** Web: classes for the outer ring. */
  indicatorClassName?:string;
  /** Web: classes for the inner dot of the checked item. */
  dotClassName?:string;
  /** Web only. */
  labelClassName?:string;
  /** Web only. */
  descriptionClassName?:string;
  /** Web: overrides the group's `unstyled`. */
  unstyled?:boolean;
}

/** Props for `Radio`. */
export type RadioProps=RadioGroupItemProps;
