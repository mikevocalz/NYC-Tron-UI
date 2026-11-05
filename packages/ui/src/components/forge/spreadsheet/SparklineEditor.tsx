import { useMemo } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "../../Button.tsx";
import { joinClasses } from "../../styles.ts";
import { cellAddress, rangeAddress, type SheetRange } from "../sheet-window.ts";
import { parseA1Range } from "./chart-model.ts";
import { PanelCheckbox, PanelChoices, PanelField, PanelHeading } from "./panel-controls.tsx";
import { Sparkline } from "./Sparkline.tsx";
import { SPARKLINE_KINDS, sparklineSpecProblem, type SparklineKind, type SparklineSpec } from "./sparkline-model.ts";

/**
 * Controlled sparkline editor: type, data range, target cell, high/low and
 * negative markers, axis minimum and a live preview from the cells the app
 * passes for `spec.dataRange`. Saving is the app's `onApply`; without it there
 * is no apply button.
 */
export interface SparklineEditorProps extends Omit<ViewProps, "children"> {
  readonly spec: SparklineSpec;
  readonly onSpecChange: (spec: SparklineSpec) => void;
  readonly cells: Readonly<Record<string, { readonly computed: string | number | boolean | null } | undefined>>;
  /** Adds "Use selection" for the data range. */
  readonly selection?: SheetRange;
  readonly onApply?: (spec: SparklineSpec) => unknown;
  readonly onRemove?: (spec: SparklineSpec) => unknown;
  readonly className?: string;
  readonly unstyled?: boolean;
}

const KIND_LABEL: Record<SparklineKind, string> = { line: "Line", column: "Column", winloss: "Win/loss" };
/** Longest range a sparkline draws, matching a 1-row cell's practical resolution. */
export const MAX_SPARKLINE_VALUES = 512;

/** Values along a one-row or one-column range, in order. */
export function sparklineValues(range: SheetRange, cells: SparklineEditorProps["cells"]): (number | undefined)[] {
  const out: (number | undefined)[] = [];
  const along = range.startRow === range.endRow;
  const from = along ? range.startColumn : range.startRow;
  const to = Math.min(along ? range.endColumn : range.endRow, from + MAX_SPARKLINE_VALUES - 1);
  for (let i = from; i <= to; i++) {
    const v = cells[along ? cellAddress(range.startRow, i) : cellAddress(i, range.startColumn)]?.computed;
    out.push(typeof v === "number" && Number.isFinite(v) ? v : undefined);
  }
  return out;
}

export function SparklineEditor({
  spec, onSpecChange, cells, selection, onApply, onRemove, className, unstyled = false, ...props
}: SparklineEditorProps) {
  const set = (patch: Partial<SparklineSpec>) => onSpecChange({ ...spec, ...patch });
  const problem = sparklineSpecProblem(spec, parseA1Range);
  const range = parseA1Range(spec.dataRange);
  const valid = range !== undefined && problem === undefined;
  const values = useMemo(() => (valid ? sparklineValues(range, cells) : []), [valid, range?.startRow, range?.endRow,
    range?.startColumn, range?.endColumn, cells]);
  const numeric = values.filter(v => v !== undefined).length;
  const negativeMatters = spec.kind !== "line";
  const muted = !unstyled ? "text-text-muted" : undefined;
  const selectionIsLine = selection && (selection.startRow === selection.endRow || selection.startColumn === selection.endColumn);

  return <View {...props} {...{ className: joinClasses(!unstyled && "rounded-card border border-border bg-surface-raised", className) }}
    style={[{ padding: 16, gap: 16 }, props.style]}>
    <PanelHeading title="Sparkline" unstyled={unstyled} />
    <PanelChoices label="Type" value={spec.kind} unstyled={unstyled}
      choices={SPARKLINE_KINDS.map(kind => ({ value: kind, label: KIND_LABEL[kind] }))}
      onChange={kind => set({ kind })} />
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
      <PanelField label="Data range" value={spec.dataRange} placeholder="B2:M2" unstyled={unstyled}
        error={problem?.field === "dataRange" ? problem.message : undefined}
        onChange={dataRange => set({ dataRange })} />
      {selectionIsLine ? <Button title="Use selection" variant="secondary" unstyled={unstyled}
        onPress={() => set({ dataRange: rangeAddress(selection) })} /> : null}
      <PanelField label="Show in cell" value={spec.location} placeholder="N2" unstyled={unstyled}
        error={problem?.field === "location" ? problem.message : undefined}
        onChange={location => set({ location })} />
    </View>
    <View>
      <PanelCheckbox unstyled={unstyled} label="Mark the high point" checked={spec.showHigh} onChange={showHigh => set({ showHigh })} />
      <PanelCheckbox unstyled={unstyled} label="Mark the low point" checked={spec.showLow} onChange={showLow => set({ showLow })} />
      {negativeMatters ? <PanelCheckbox unstyled={unstyled} label="Shade negative values" checked={spec.showNegative}
        onChange={showNegative => set({ showNegative })} /> : null}
    </View>
    {spec.kind !== "winloss" ? <PanelChoices label="Axis starts at" value={spec.axisMin} unstyled={unstyled}
      choices={[{ value: "auto", label: "Lowest value" }, { value: "zero", label: "Zero" }]}
      onChange={axisMin => set({ axisMin })} /> : null}
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View {...{ className: joinClasses(!unstyled && "rounded-control border border-border bg-surface-sunken") }}
        style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
        <Sparkline values={values} kind={spec.kind} width={112} height={28} axisMin={spec.axisMin}
          showHigh={spec.showHigh} showLow={spec.showLow} showNegative={spec.showNegative} unstyled={unstyled} />
      </View>
      <Text accessibilityLiveRegion="polite" {...{ className: muted }} style={{ flexShrink: 1 }}>
        {problem ? "Fix the fields above to see a preview."
          : numeric === 0 ? "No numbers in this range yet."
          : `${numeric} of ${values.length} cells have numbers.`}
      </Text>
    </View>
    {onApply || onRemove ? <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
      {onRemove ? <Button title="Remove sparkline" variant="secondary" unstyled={unstyled} onPress={() => onRemove(spec)} /> : null}
      {onApply ? <Button title="Apply" disabled={Boolean(problem)} unstyled={unstyled} onPress={() => onApply(spec)} /> : null}
    </View> : null}
    {range && !problem ? <Text {...{ className: muted }} style={{ fontSize: 12 }}>
      {`Draws ${rangeAddress(range)} in ${spec.location.toUpperCase()}.`}
    </Text> : null}
  </View>;
}
