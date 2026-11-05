/** Mark family drawn for every series in the chart. */
export type NativeChartKind = "line" | "column" | "area";

export const NATIVE_CHART_KINDS: readonly NativeChartKind[] = ["line", "column", "area"];

export interface NativeChartPoint {
  readonly x: number;
  readonly y: number;
}

export interface NativeChartSeries {
  /** Stable key; must be unique within one chart. */
  readonly id: string;
  /** Legend and accessibility name; must be unique within one chart. */
  readonly label: string;
  readonly points: readonly NativeChartPoint[];
  /** Overrides the palette entry this series would otherwise get. */
  readonly color?: string;
}

/**
 * Chart colors, resolved by the caller from the app theme. Use
 * `chartColorsFromTheme(theme.colors)` to derive them from NYC-Tron tokens.
 */
export interface NativeChartColors {
  /** Assigned to series in order, cycling when there are more series than entries. */
  readonly series: readonly string[];
  readonly axis: string;
  readonly grid: string;
  readonly label: string;
}

export interface NativeChartProps {
  readonly series: readonly NativeChartSeries[];
  readonly kind: NativeChartKind;
  readonly colors: NativeChartColors;
  readonly xAxisLabel?: string;
  readonly yAxisLabel?: string;
  /** Points. Defaults to 240. Width follows the parent unless set. */
  readonly height?: number;
  readonly width?: number;
}

/** The subset of NYC-Tron semantic colors (`TronTheme["colors"]`) charts read. */
export interface ChartThemeColors {
  readonly primary: string;
  readonly focus: string;
  readonly text: string;
  readonly textMuted: string;
  readonly border: string;
  readonly accent?: string;
  readonly danger?: string;
}

/** Maps semantic theme tokens to chart roles. No literal colors live here. */
export function chartColorsFromTheme(colors: ChartThemeColors): NativeChartColors {
  const series = [colors.primary, colors.accent, colors.focus, colors.danger]
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0);
  return { series, axis: colors.textMuted, grid: colors.border, label: colors.text };
}

/** Exactly what both native views receive; the Swift and Kotlin records mirror these keys. */
export interface NativeChartWirePoint { x: number; y: number }
export interface NativeChartWireSeries { id: string; label: string; color: string; points: NativeChartWirePoint[] }
export interface NativeChartWireProps {
  series: NativeChartWireSeries[];
  kind: NativeChartKind;
  xAxisLabel: string;
  yAxisLabel: string;
  axisColor: string;
  gridColor: string;
  labelColor: string;
}

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

/**
 * Validates controlled props and produces the native payload: points sorted by x,
 * one resolved color per series. Throws RangeError/TypeError on input the native
 * renderers cannot draw honestly (non-finite values, duplicate keys, no palette).
 */
export function toNativeChartProps(props: NativeChartProps): NativeChartWireProps {
  if (!NATIVE_CHART_KINDS.includes(props.kind)) throw new TypeError("Unknown chart kind: " + String(props.kind));
  const { colors } = props;
  if (!colors || !Array.isArray(colors.series)) throw new TypeError("Chart colors.series must be an array");
  const palette = colors.series.filter(nonEmpty);
  for (const key of ["axis", "grid", "label"] as const) {
    if (!nonEmpty(colors[key])) throw new TypeError("Missing chart color: " + key);
  }
  const ids = new Set<string>();
  const labels = new Set<string>();
  const series = props.series.map((entry, index) => {
    if (!nonEmpty(entry.id)) throw new TypeError("Chart series " + index + " needs an id");
    if (!nonEmpty(entry.label)) throw new TypeError("Chart series " + entry.id + " needs a label");
    if (ids.has(entry.id)) throw new RangeError("Duplicate chart series id: " + entry.id);
    if (labels.has(entry.label)) throw new RangeError("Duplicate chart series label: " + entry.label);
    ids.add(entry.id);
    labels.add(entry.label);
    for (const point of entry.points) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
        throw new RangeError("Non-finite point in chart series " + entry.id);
      }
    }
    const color = nonEmpty(entry.color) ? entry.color : palette[index % Math.max(palette.length, 1)];
    if (!nonEmpty(color)) throw new TypeError("Chart series " + entry.id + " has no color and colors.series is empty");
    const points = entry.points.map(p => ({ x: p.x, y: p.y })).sort((a, b) => a.x - b.x);
    return { id: entry.id, label: entry.label, color, points };
  });
  return {
    series,
    kind: props.kind,
    xAxisLabel: props.xAxisLabel ?? "",
    yAxisLabel: props.yAxisLabel ?? "",
    axisColor: colors.axis,
    gridColor: colors.grid,
    labelColor: colors.label,
  };
}

export const CHART_UNAVAILABLE_MESSAGE = "Charts aren't available on this platform yet.";
