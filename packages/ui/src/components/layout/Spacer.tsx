import { View, type ViewProps } from "react-native";
import { space } from "../../tokens.ts";
import type { StackSpace } from "./Stack.tsx";

/** Either a fixed `size` along the parent's main axis, or `flex` to take the free space on it. */
type SpacerSize = { size: StackSpace; flex?: never } | { flex: true; size?: never };

export type SpacerProps = Omit<ViewProps, "children"> & SpacerSize;

/**
 * Empty View that occupies the parent's main axis: a fixed `size`, or `flex`
 * to push siblings apart. Uses `flexBasis`, so the same element works in a Stack and a Row.
 */
export function Spacer({ size, flex, style, ...rest }: SpacerProps) {
  return (
    <View {...rest}
      style={[flex ? { flexGrow: 1, flexShrink: 1 } : { flexBasis: space[size ?? 0], flexGrow: 0, flexShrink: 0 }, style]} />
  );
}
