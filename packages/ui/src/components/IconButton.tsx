import type { ReactNode } from "react";
import { Platform, Pressable, View, type PressableProps } from "react-native";
import { joinClasses } from "./styles.ts";

export type IconButtonVariant="primary"|"secondary"|"outline"|"ghost"|"danger";
export interface IconButtonProps extends Omit<PressableProps,"children"|"disabled"|"style"> {
  /** The glyph, supplied by the app's icon system. It keeps its own color. */
  icon:ReactNode;
  /** Required: an icon-only control has no visible name. */
  "aria-label":string;
  accessibilityHint?:string;
  variant?:IconButtonVariant;
  /** Both sizes meet the 44pt minimum; `sm` suits dense pane chrome. */
  size?:"sm"|"md";
  disabled?:boolean;
  /** Toggle state. Omit for ordinary actions; pass false for an untoggled toggle. */
  selected?:boolean;
  /** Explicit corner radius in points, for chrome that pins a radius. */
  cornerRadius?:number;
  className?:string;
  style?:PressableProps["style"];
  unstyled?:boolean;
}
const variants:Record<IconButtonVariant,string>={
  primary:"bg-primary border-border",
  secondary:"bg-surface-raised border-border",
  outline:"bg-transparent border-border",
  ghost:"bg-transparent border-transparent hover:bg-surface-sunken",
  danger:"bg-danger border-danger",
};

/**
 * Icon-only press control. The icon is a child node, so this works with any
 * glyph source. `selected` exposes toggle state (`aria-pressed` on web,
 * selected on native) and draws the primary tint on non-primary variants.
 */
export function IconButton({
  icon,"aria-label":ariaLabel,accessibilityHint,variant="ghost",size="md",disabled=false,
  selected,cornerRadius,className,style,unstyled=false,onPress,...rest
}:IconButtonProps){
  const styled=!unstyled;
  const radius=cornerRadius===undefined?undefined:{borderRadius:cornerRadius};
  const merged:PressableProps["style"]=radius
    ?(typeof style==="function"?state=>[radius,style(state)]:[radius,style])
    :style;
  return <Pressable {...rest} style={merged}
    accessibilityRole="button" accessibilityLabel={ariaLabel} accessibilityHint={accessibilityHint}
    accessibilityState={{...rest.accessibilityState,disabled,...(selected===undefined?{}:{selected})}}
    {...(Platform.OS==="web"&&selected!==undefined?{"aria-pressed":selected}:{})}
    disabled={disabled} onPress={onPress}
    {...{className:joinClasses("shrink-0 items-center justify-center",
      size==="sm"?"h-11 w-11":"h-12 w-12",
      styled&&"rounded-control border focus-visible:ring-2 focus-visible:ring-focus active:opacity-80 motion-reduce:transition-none",
      styled&&(selected&&variant!=="primary"&&variant!=="danger"?"bg-primary/10 border-border forced-colors:border-[Highlight]":variants[variant]),
      disabled&&"opacity-50",className)}}>
    <View aria-hidden {...{className:"items-center justify-center"}}>{icon}</View>
  </Pressable>;
}
