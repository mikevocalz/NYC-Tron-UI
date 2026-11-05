import type { ReactNode } from "react";
import type { GestureResponderEvent, StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

type DataAttributes={[attribute:`data-${string}`]:string|number|boolean|undefined};

/**
 * Props every semantic primitive takes on both platforms. The DOM-shaped
 * names (`id`, `hidden`, `title`, `data-*`) are what Nitro Forge's studio
 * preview passes; on native, `id` becomes `nativeID`, `hidden` removes the
 * subtree from layout and the accessibility tree, and `data-*` / `title` /
 * `dataSet` have no equivalent and are dropped.
 */
export type SemanticBaseProps=DataAttributes&{
  children?:ReactNode;
  className?:string;
  id?:string;
  hidden?:boolean;
  title?:string;
  dataSet?:Readonly<Record<string,string|number|boolean>>;
  testID?:string;
  dir?:"ltr"|"rtl"|"auto";
  lang?:string;
  "aria-label"?:string;
  "aria-labelledby"?:string;
  "aria-describedby"?:string;
  "aria-hidden"?:boolean;
};
export type SemanticBlockProps=SemanticBaseProps&{style?:StyleProp<ViewStyle>};
export type SemanticTextProps=SemanticBaseProps&{style?:StyleProp<TextStyle>;numberOfLines?:number;selectable?:boolean};
export type HeadingLevel=1|2|3|4|5|6;
export type HeadingProps=SemanticTextProps&{/** @default 1 */ level?:HeadingLevel};
export type LinkProps=SemanticTextProps&{
  href?:string;
  /** Web only. */
  target?:"_blank"|"_self"|"_parent"|"_top";
  /** Web only. `noopener noreferrer` is added for `_blank`. */
  rel?:string;
  /**
   * Runs before navigation. On native it replaces navigation: an app-router
   * path (`/editor/prism`, `#/apps/quill`) needs it, since only absolute
   * `http(s):`, `mailto:` and `tel:` hrefs open through `Linking`.
   */
  onPress?:(event:GestureResponderEvent)=>void;
};
export type InputType="text"|"search"|"email"|"url"|"tel"|"number"|"password";
export type InputProps=Omit<TextInputProps,"id">&{
  id?:string;
  /** Maps to the platform keyboard and secure entry; never a file input (use FilePicker). @default "text" */
  type?:InputType;
  className?:string;
  "aria-label"?:string;
};
