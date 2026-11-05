import { useMemo, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "../../Button.tsx";
import { joinClasses } from "../../styles.ts";
import { rangeAddress, type SheetRange } from "../sheet-window.ts";
import {
  chartSeriesFromCells, parseA1Range, SHEET_CHART_KINDS, MAX_CHART_CELLS,
  type ChartCellValues, type SheetChartData, type SheetChartKind, type SheetChartSpec,
} from "./chart-model.ts";
import { PanelCheckbox, PanelChoices, PanelField, PanelHeading } from "./panel-controls.tsx";

/**
 * Controlled chart builder: type gallery, data range, series orientation,
 * header/x-value options and axis titles. It derives series from the cells
 * the app passes for `spec.range` and hands them to `renderPreview`, where the
 * app mounts `@nyc-tron/native-charts` (a separate package this one does not
 * import). Saving a chart into a document is the app's `onInsert`; without it
 * there is no insert button.
 */
export interface ChartBuilderProps extends Omit<ViewProps, "children"> {
  readonly spec: SheetChartSpec;
  readonly onSpecChange: (spec: SheetChartSpec) => void;
  /** Values for `spec.range`, keyed by A1 address. */
  readonly cells: ChartCellValues;
  /** The grid's current selection; adds a "Use selection" button. */
  readonly selection?: SheetRange;
  /** Draws the chart. Receives series already validated and labeled. */
  readonly renderPreview?: (spec: SheetChartSpec, data: SheetChartData) => ReactNode;
  readonly onInsert?: (spec: SheetChartSpec, data: SheetChartData) => unknown;
  /** `true` while the app is still loading `cells` for the range. */
  readonly loading?: boolean;
  readonly className?: string;
  readonly unstyled?: boolean;
}

const KIND_LABEL: Record<SheetChartKind, string> = { line: "Line", column: "Column", area: "Area" };

/** Small drawn previews for the gallery; theme tokens only. */
function KindGlyph({ kind, unstyled }: { kind: SheetChartKind; unstyled: boolean }) {
  const ink = !unstyled ? "bg-primary" : undefined;
  if (kind === "column") {
    return <View aria-hidden style={{ width: 36, height: 24, flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
      {[10, 20, 14, 24].map((h, i) => <View key={i} {...{ className: ink }} style={{ width: 6, height: h, borderRadius: 1 }} />)}
    </View>;
  }
  if (kind === "area") {
    return <View aria-hidden style={{ width: 36, height: 24, flexDirection: "row", alignItems: "flex-end" }}>
      {[8, 12, 18, 14, 20, 24].map((h, i) => <View key={i} {...{ className: !unstyled ? "bg-primary/40 border-t-2 border-t-primary" : undefined }}
        style={{ width: 6, height: h }} />)}
    </View>;
  }
  // Line: three rotated strokes.
  const strokes = [{ x: 0, y: 14, len: 14, deg: -30 }, { x: 12, y: 10, len: 13, deg: 25 }, { x: 23, y: 8, len: 15, deg: -45 }];
  return <View aria-hidden style={{ width: 36, height: 24 }}>
    {strokes.map((s, i) => <View key={i} {...{ className: ink }}
      style={{ position: "absolute", left: s.x, top: s.y, width: s.len, height: 2, borderRadius: 1, transform: [{ rotate: `${s.deg}deg` }] }} />)}
  </View>;
}

export function ChartBuilder({
  spec, onSpecChange, cells, selection, renderPreview, onInsert, loading = false,
  className, unstyled = false, ...props
}: ChartBuilderProps) {
  const set = (patch: Partial<SheetChartSpec>) => onSpecChange({ ...spec, ...patch });
  const result = useMemo((): { data: SheetChartData } | { error: string } => {
    try {
      return { data: chartSeriesFromCells(spec, cells) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Check the data range." };
    }
  }, [spec, cells]);
  const data = "data" in result ? result.data : undefined;
  const rangeError = spec.range.trim() === "" ? "Enter a range such as A1:C12."
    : parseA1Range(spec.range) ? ("error" in result ? result.error : undefined) : `"${spec.range}" is not a cell range.`;
  const points = data?.series.reduce((n, s) => n + s.points.length, 0) ?? 0;
  const muted = !unstyled ? "text-text-muted" : undefined;
  const byColumns = spec.seriesIn === "columns";

  let summary: string;
  if (loading) summary = "Loading the range…";
  else if (!data) summary = "Fix the range to see a preview.";
  else if (points === 0) summary = "No numbers in this range yet. Pick cells that hold values.";
  else summary = `${data.series.length} series, ${points} ${points === 1 ? "point" : "points"}` +
    (data.skippedCells ? `; ${data.skippedCells} ${data.skippedCells === 1 ? "cell has" : "cells have"} no number and ${data.skippedCells === 1 ? "is" : "are"} left out.` : ".");

  return <View {...props} {...{ className: joinClasses(!unstyled && "rounded-card border border-border bg-surface-raised", className) }}
    style={[{ padding: 16, gap: 16 }, props.style]}>
    <PanelHeading title="Chart" unstyled={unstyled} />
    <PanelChoices label="Chart type" value={spec.kind} unstyled={unstyled}
      choices={SHEET_CHART_KINDS.map(kind => ({ value: kind, label: KIND_LABEL[kind], glyph: <KindGlyph kind={kind} unstyled={unstyled} /> }))}
      onChange={kind => set({ kind })} />
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
      <PanelField label="Data range" value={spec.range} placeholder="A1:C12" unstyled={unstyled}
        hint={`Up to ${MAX_CHART_CELLS} cells on this sheet`} error={rangeError}
        onChange={range => set({ range })} />
      {selection ? <Button title="Use selection" variant="secondary" unstyled={unstyled}
        onPress={() => set({ range: rangeAddress(selection) })} /> : null}
    </View>
    <PanelChoices label="Series run down" value={spec.seriesIn} unstyled={unstyled}
      choices={[{ value: "columns", label: "Columns" }, { value: "rows", label: "Rows" }]}
      onChange={seriesIn => set({ seriesIn })} />
    <View>
      <PanelCheckbox unstyled={unstyled} checked={spec.hasHeader} onChange={hasHeader => set({ hasHeader })}
        label={byColumns ? "First row names the series" : "First column names the series"} />
      <PanelCheckbox unstyled={unstyled} checked={spec.hasXValues} onChange={hasXValues => set({ hasXValues })}
        label={byColumns ? "First column holds x values" : "First row holds x values"} />
    </View>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      <PanelField label="Title" value={spec.title ?? ""} unstyled={unstyled} autoCapitalize="sentences"
        onChange={title => set({ title })} />
      <PanelField label="X axis title" value={spec.xAxisLabel ?? ""} unstyled={unstyled} autoCapitalize="sentences"
        onChange={xAxisLabel => set({ xAxisLabel })} />
      <PanelField label="Y axis title" value={spec.yAxisLabel ?? ""} unstyled={unstyled} autoCapitalize="sentences"
        onChange={yAxisLabel => set({ yAxisLabel })} />
    </View>
    {data && points > 0 && renderPreview ? <View accessibilityLabel={spec.title || `${KIND_LABEL[spec.kind]} chart preview`}
      {...{ className: joinClasses(!unstyled && "rounded-control border border-border bg-surface-sunken") }}
      style={{ padding: 8 }}>
      {renderPreview(spec, data)}
    </View> : null}
    <Text accessibilityLiveRegion="polite" {...{ className: muted }}>{summary}</Text>
    {onInsert ? <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      <Button title="Insert chart" disabled={!data || points === 0 || loading} unstyled={unstyled}
        onPress={() => data && onInsert(spec, data)} />
    </View> : null}
  </View>;
}
