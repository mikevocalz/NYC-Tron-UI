import { View } from "react-native";
import type { StackProps } from "./Stack.tsx";
import { stackStyle } from "./stack-style.ts";

export type RowProps = StackProps;

/**
 * Horizontal flex container with the same props as Stack. `flexDirection: "row"`
 * follows the reading direction, so start and end flip in right-to-left layouts.
 * A View and nothing else. Explicit `style` stays last.
 */
export function Row({
  children, gap, padding, paddingX, paddingY, align, justify, wrap, className, style, ...rest
}: RowProps) {
  return (
    <View {...rest} {...{ className }}
      style={[stackStyle("row", { gap, padding, paddingX, paddingY, align, justify, wrap }), style]}>
      {children}
    </View>
  );
}
