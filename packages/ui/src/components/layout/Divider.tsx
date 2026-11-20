import { View, type ViewProps, type ViewStyle } from "react-native";
import { border, space } from "../../tokens.ts";
import { joinClasses } from "../styles.ts";
import type { StackSpace } from "./Stack.tsx";

export interface DividerProps extends Omit<ViewProps, "children"> {
  orientation?: "horizontal" | "vertical";
  /** Margin at both ends of the line: horizontal margin for `horizontal`, vertical margin for `vertical`. */
  inset?: StackSpace;
  className?: string;
}

/**
 * Decorative line, `border[1]` thick, coloured by the `border` theme role (`bg-border`).
 * It sets no `accessibilityRole` and no label, so assistive technology skips it.
 * Explicit `style` stays last.
 */
export function Divider({ orientation = "horizontal", inset, className, style, ...rest }: DividerProps) {
  const vertical = orientation === "vertical";
  const line: ViewStyle = vertical
    ? { alignSelf: "stretch", width: border[1], marginVertical: inset === undefined ? undefined : space[inset] }
    : { alignSelf: "stretch", height: border[1], marginHorizontal: inset === undefined ? undefined : space[inset] };
  return <View {...rest} {...{ className: joinClasses("bg-border", className) }} style={[line, style]} />;
}
