import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { space } from "../../tokens.ts";
import { stackStyle } from "./stack-style.ts";

/** Spacing step key from the token scale. `2` is 8 px, `1.5` is 6 px (unit multiples of 4 px). */
export type StackSpace = keyof typeof space;
/** Cross-axis alignment, the React Native `alignItems` values. */
export type StackAlign = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
/** Main-axis distribution, the React Native `justifyContent` values. */
export type StackJustify = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";

export interface StackProps extends Omit<ViewProps, "children"> {
  children?: ReactNode;
  /** Space between children. Default `2` (8 px). */
  gap?: StackSpace;
  padding?: StackSpace;
  paddingX?: StackSpace;
  paddingY?: StackSpace;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  className?: string;
}

/**
 * Vertical flex container with token-keyed spacing. A View and nothing else:
 * no role, no label, no colour. Explicit `style` stays last.
 */
export function Stack({
  children, gap, padding, paddingX, paddingY, align, justify, wrap, className, style, ...rest
}: StackProps) {
  return (
    <View {...rest} {...{ className }}
      style={[stackStyle("column", { gap, padding, paddingX, paddingY, align, justify, wrap }), style]}>
      {children}
    </View>
  );
}
