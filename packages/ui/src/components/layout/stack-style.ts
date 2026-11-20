import type { ViewStyle } from "react-native";
import { space } from "../../tokens.ts";
import type { StackProps } from "./Stack.tsx";

/** Style shared by Stack and Row. The caller's `style` goes after it. */
export function stackStyle(
  direction: "column" | "row",
  { gap = 2, padding, paddingX, paddingY, align, justify, wrap }: Pick<StackProps, "gap" | "padding" | "paddingX" | "paddingY" | "align" | "justify" | "wrap">,
): ViewStyle {
  return {
    flexDirection: direction,
    gap: space[gap],
    ...(padding !== undefined && { padding: space[padding] }),
    ...(paddingX !== undefined && { paddingHorizontal: space[paddingX] }),
    ...(paddingY !== undefined && { paddingVertical: space[paddingY] }),
    ...(align !== undefined && { alignItems: align }),
    ...(justify !== undefined && { justifyContent: justify }),
    ...(wrap && { flexWrap: "wrap" as const }),
  };
}
