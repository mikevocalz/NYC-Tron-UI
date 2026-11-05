import { Host } from "@expo/ui";
import { requireNativeView } from "expo";
import { useMemo } from "react";
import { toNativeChartProps } from "./NativeChart.types.ts";
import type { NativeChartProps, NativeChartWireProps } from "./NativeChart.types.ts";

const NativeChartView = requireNativeView<NativeChartWireProps>("NYCTronCharts", "TronChartView");

/** SwiftUI Charts on iOS 16+, Vico (Compose) on Android. Fully controlled; no events. */
export function NativeChart({ height = 240, width, ...props }: NativeChartProps) {
  if (!Number.isFinite(height) || height <= 0 || (width !== undefined && (!Number.isFinite(width) || width <= 0))) {
    throw new RangeError("Invalid native chart size");
  }
  const wire = useMemo(() => toNativeChartProps(props), [props.series, props.kind, props.colors, props.xAxisLabel, props.yAxisLabel]);
  return <Host style={width === undefined ? { height, alignSelf: "stretch" } : { width, height }}>
    <NativeChartView {...wire} />
  </Host>;
}
