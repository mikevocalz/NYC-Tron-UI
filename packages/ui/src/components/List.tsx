import { Children, isValidElement, type ReactNode } from "react";
import { Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "./styles.ts";

export interface ListProps extends Omit<ViewProps,"children"|"role"> {
  children?:ReactNode;
  /** Names the list for assistive tech when the surrounding heading does not. */
  "aria-label"?:string;
  className?:string;
  unstyled?:boolean;
}
export interface ListItemProps extends Omit<ViewProps,"children"|"role"> {
  /** Primary text. A string is rendered in the row's title style. */
  children?:ReactNode;
  supportingText?:string;
  leading?:ReactNode;
  trailing?:ReactNode;
  /** Makes the row a button. Without it the row is static content. */
  onPress?:()=>void;
  /** Marks the current row: a primary tint and the selected state. */
  selected?:boolean;
  disabled?:boolean;
  /** Spoken in addition to the title and supporting text. */
  accessibilityHint?:string;
  className?:string;
  titleClassName?:string;
  supportingClassName?:string;
  unstyled?:boolean;
}

/**
 * Grouped rows on one raised surface, split by hairlines. This is a short,
 * fully rendered list (an outline, a settings group); long uniform data
 * belongs in a virtualized list or DataTable.
 */
export function List({children,className,unstyled=false,"aria-label":ariaLabel,...rest}:ListProps){
  const styled=!unstyled;
  const rows=Children.toArray(children).filter(isValidElement);
  return <View {...rest} role="list" aria-label={ariaLabel}
    {...{className:joinClasses("w-full min-w-0",
      styled&&"overflow-hidden rounded-control border border-border bg-surface-raised",className)}}>
    {rows.map((row,i)=><View key={row.key??i} role="listitem"
      {...{className:joinClasses(styled&&i<rows.length-1&&"border-b border-border")}}>{row}</View>)}
  </View>;
}

/**
 * One row: leading slot, title over supporting text, trailing slot. With
 * `onPress` the row is a 44pt button whose spoken name is the title and
 * supporting text, so the secondary line is never lost to a screen reader.
 * Leading and trailing use logical order and swap sides in RTL.
 */
export function ListItem({
  children,supportingText,leading,trailing,onPress,selected,disabled=false,accessibilityHint,
  className,titleClassName,supportingClassName,unstyled=false,...rest
}:ListItemProps){
  const styled=!unstyled;
  const title=typeof children==="string"||typeof children==="number"
    ?<Text {...{className:joinClasses(styled&&"text-base text-text",titleClassName)}}>{children}</Text>
    :children;
  const body=<>
    {leading?<View {...{className:"shrink-0 items-center justify-center"}}>{leading}</View>:null}
    <View {...{className:"min-w-0 flex-1 gap-0.5"}}>
      {title}
      {supportingText?<Text {...{className:joinClasses(styled&&"text-sm text-text-muted",supportingClassName)}}>{supportingText}</Text>:null}
    </View>
    {trailing?<View {...{className:"shrink-0 flex-row items-center gap-1"}}>{trailing}</View>:null}
  </>;
  const layout=joinClasses("min-h-11 w-full flex-row items-center gap-3",
    styled&&"px-3 py-2.5",styled&&selected&&"bg-primary/10 forced-colors:border-2 forced-colors:border-[Highlight]",className);
  if(!onPress)return <View {...rest} {...{className:layout}}
    {...(selected===undefined?{}:{accessibilityState:{selected}})}>{body}</View>;
  const label=typeof children==="string"||typeof children==="number"
    ?[String(children),supportingText].filter(Boolean).join(", "):undefined;
  return <Pressable {...rest} accessibilityRole="button" accessibilityLabel={label}
    accessibilityHint={accessibilityHint} disabled={disabled} onPress={onPress}
    accessibilityState={{disabled,...(selected===undefined?{}:{selected})}}
    {...(Platform.OS==="web"&&selected!==undefined?{"aria-current":selected?"true":undefined}:{})}
    {...{className:joinClasses(layout,
      styled&&"focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus active:opacity-80 motion-reduce:transition-none",
      styled&&!selected&&"hover:bg-surface-sunken",disabled&&"opacity-50")}}>{body}</Pressable>;
}
