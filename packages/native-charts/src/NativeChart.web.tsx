import { Text, View } from "react-native";
import { CHART_UNAVAILABLE_MESSAGE } from "./NativeChart.types.ts";
import type { NativeChartProps } from "./NativeChart.types.ts";

/**
 * Web, Windows and macOS charts are deferred. This renders a plain notice
 * instead of an imitation chart, sized like the native view would be.
 */
export function NativeChart({ height = 240, width, colors }: NativeChartProps) {
  return <View accessibilityRole="text" style={{
    height, width, alignSelf: width === undefined ? "stretch" : undefined,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderStyle: "dashed", borderColor: colors.grid, padding: 16,
  }}>
    <Text style={{ color: colors.axis, textAlign: "center" }}>{CHART_UNAVAILABLE_MESSAGE}</Text>
  </View>;
}
