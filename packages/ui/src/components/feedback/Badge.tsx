import { Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";

export type BadgeTone="neutral"|"info"|"success"|"danger"|"accent";
export type BadgeSize="xs"|"sm";

/** Props for {@linkcode Badge}. Drop-in for Nitro Forge's `StudioBadgeProps`. */
export interface BadgeProps extends Omit<ViewProps,"children"> {
  /** The full text a screen reader announces; keep it a word or two. */
  label:string;
  /** @default "neutral" */
  tone?:BadgeTone;
  /** @default "sm" */
  size?:BadgeSize;
  className?:string;
  labelClassName?:string;
  unstyled?:boolean;
}

const DOT:Record<Exclude<BadgeTone,"neutral">,string>={
  info:"border-info",success:"border-success",danger:"border-danger",accent:"border-accent",
};
const sizes:Record<BadgeSize,{root:string;label:string}>={
  // 12pt is the floor for chip text; the sizes differ in padding.
  xs:{root:"gap-1 px-1.5 py-0.5",label:"text-xs leading-4"},
  sm:{root:"gap-1.5 px-2 py-1",label:"text-xs leading-4 font-medium"},
};

/**
 * Static status chip: a count, "Open in this session", "Draft". Not a button;
 * wrap it in one if it must act. Toned chips add a dot in the tone color (a border, so forced colors keeps it) and
 * keep body text, so the label stays at full contrast in both appearances.
 */
export function Badge({
  label,tone="neutral",size="sm",className,labelClassName,unstyled=false,...rest
}:BadgeProps) {
  const styled=!unstyled;
  const s=sizes[size];
  return (
    <View {...rest} accessible accessibilityLabel={rest.accessibilityLabel??label}
      {...{className:joinClasses("flex-row items-center self-start",
        styled&&"rounded-control border border-border",
        styled&&(tone==="neutral"?"bg-surface-sunken":"bg-surface-raised"),
        styled&&s.root,className)}}>
      {tone!=="neutral" ? <View aria-hidden style={{borderWidth:3}} {...{className:joinClasses("h-1.5 w-1.5 rounded-full",DOT[tone])}}/> : null}
      <Text numberOfLines={1} {...{className:joinClasses(styled&&s.label,
        styled&&(tone==="neutral"?"text-text-muted":"text-text"),labelClassName)}}>{label}</Text>
    </View>
  );
}
