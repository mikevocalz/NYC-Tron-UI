import { Text, View, type ViewProps } from "react-native";
import { Button } from "../../Button.tsx";
import { joinClasses } from "../../styles.ts";
import { columnName, parseCellAddress } from "../sheet-window.ts";
import { freezeFor, type FreezeCommand, type FreezeState, type SplitAxis, type SplitState } from "./freeze-split-model.ts";
import { PanelHeading } from "./panel-controls.tsx";

/**
 * Controlled freeze-panes and split-view commands. Frozen panes and the split
 * are view state the app keeps (they feed `SpreadsheetGrid`'s `frozenRows`/
 * `frozenColumns` and {@linkcode SplitSpreadsheetView}); this panel only
 * reports the next state.
 */
export interface FreezeSplitControlsProps extends Omit<ViewProps, "children"> {
  readonly freeze: FreezeState;
  readonly onFreezeChange: (next: FreezeState) => void;
  /** Focus cell of the grid selection; enables "Freeze at selection". */
  readonly focus?: string;
  /** Current split, `undefined` when the sheet shows one pane. */
  readonly split?: SplitState;
  /** Supplying this shows the split commands. */
  readonly onSplitChange?: (next: SplitState | undefined) => void;
  readonly className?: string;
  readonly unstyled?: boolean;
}

/** "Rows 1–2 and columns A–B stay in view." in plain words. */
export function describeFreeze({ frozenRows, frozenColumns }: FreezeState): string {
  const rows = frozenRows === 0 ? "" : frozenRows === 1 ? "Row 1" : `Rows 1–${frozenRows}`;
  const cols = frozenColumns === 0 ? "" : frozenColumns === 1 ? "column A" : `columns A–${columnName(frozenColumns - 1)}`;
  if (!rows && !cols) return "Nothing is frozen.";
  const subject = rows && cols ? `${rows} and ${cols}` : rows || cols.charAt(0).toUpperCase() + cols.slice(1);
  return `${subject} stay${!cols && frozenRows === 1 || !rows && frozenColumns === 1 ? "s" : ""} in view while you scroll.`;
}

export function FreezeSplitControls({
  freeze, onFreezeChange, focus, split, onSplitChange, className, unstyled = false, ...props
}: FreezeSplitControlsProps) {
  const apply = (command: FreezeCommand) => onFreezeChange(freezeFor(command, focus));
  const cell = focus ? parseCellAddress(focus) : undefined;
  const canFreezeAtSelection = cell !== undefined && (cell.row > 0 || cell.column > 0);
  const frozen = freeze.frozenRows > 0 || freeze.frozenColumns > 0;
  const same = (s: FreezeState) => s.frozenRows === freeze.frozenRows && s.frozenColumns === freeze.frozenColumns;
  const muted = !unstyled ? "text-text-muted" : undefined;
  const splitButton = (axis: SplitAxis, title: string) => <Button key={axis} title={title} unstyled={unstyled}
    variant={split?.axis === axis ? "primary" : "secondary"} aria-pressed={split?.axis === axis}
    onPress={() => onSplitChange!({ axis, ratio: split?.ratio ?? 0.5 })} />;

  return <View {...props} {...{ className: joinClasses(!unstyled && "rounded-card border border-border bg-surface-raised", className) }}
    style={[{ padding: 16, gap: 12 }, props.style]}>
    <PanelHeading title="Freeze panes" unstyled={unstyled} />
    <Text accessibilityLiveRegion="polite" {...{ className: muted }}>{describeFreeze(freeze)}</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <Button title="Top row" unstyled={unstyled} variant={same({ frozenRows: 1, frozenColumns: 0 }) ? "primary" : "secondary"}
        aria-pressed={same({ frozenRows: 1, frozenColumns: 0 })} onPress={() => apply("top-row")} />
      <Button title="First column" unstyled={unstyled} variant={same({ frozenRows: 0, frozenColumns: 1 }) ? "primary" : "secondary"}
        aria-pressed={same({ frozenRows: 0, frozenColumns: 1 })} onPress={() => apply("first-column")} />
      <Button title={canFreezeAtSelection ? `At selection (${focus})` : "At selection"} unstyled={unstyled} variant="secondary"
        disabled={!canFreezeAtSelection} accessibilityHint={canFreezeAtSelection ? undefined : "Select a cell other than A1 first"}
        onPress={() => apply("at-selection")} />
      <Button title="Unfreeze" unstyled={unstyled} variant="ghost" disabled={!frozen} onPress={() => apply("none")} />
    </View>
    {onSplitChange ? <>
      <PanelHeading title="Split view" unstyled={unstyled} />
      <Text {...{ className: muted }}>
        {split ? `Two ${split.axis === "horizontal" ? "stacked" : "side-by-side"} panes scroll the same sheet on their own.`
          : "Show the sheet twice to compare distant rows or columns."}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {splitButton("horizontal", "Stacked")}
        {splitButton("vertical", "Side by side")}
        <Button title="Remove split" unstyled={unstyled} variant="ghost" disabled={!split} onPress={() => onSplitChange(undefined)} />
      </View>
    </> : null}
  </View>;
}
