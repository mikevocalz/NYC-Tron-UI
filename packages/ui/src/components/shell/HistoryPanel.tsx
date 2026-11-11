import { FlatList, Pressable, Text, View, type ViewProps } from "react-native";
import { Button } from "../Button.tsx";
import { ErrorMessage } from "../feedback/ErrorMessage.tsx";
import { joinClasses } from "../styles.ts";
import { validateHistory, type HistoryEntry, type HistoryJump } from "./history-model.ts";
import { useOwnedAction } from "./useOwnedAction.ts";
export type { HistoryEntry, HistoryJump } from "./history-model.ts";

export interface HistoryPanelProps extends Omit<ViewProps, "children"> {
  readonly documentId: string;
  readonly revision: string;
  readonly entries: readonly HistoryEntry[];
  readonly cursor: number;
  readonly onJump: (request: HistoryJump, signal: AbortSignal) => void | Promise<void>;
  readonly label?: string;
  readonly height?: number;
  readonly className?: string;
  readonly unstyled?: boolean;
}

/** Controlled history. The host applies the jump atomically and supplies the new cursor. */
export function HistoryPanel({ documentId, revision, entries, cursor, onJump, label = "History", height = 320, className, unstyled = false, style, ...rest }: HistoryPanelProps) {
  validateHistory(entries, cursor);
  if (!Number.isFinite(height) || height < 44) throw new RangeError("History height must be at least 44");
  const action = useOwnedAction(JSON.stringify([documentId, revision]));
  const pending = action.pending !== null;
  const jump = (target: number) => {
    if (pending || target === cursor) return;
    void action.run(String(target), signal => onJump({ documentId, expectedRevision: revision, cursor: target }, signal));
  };
  const styled = !unstyled;
  return <View {...rest} style={[{ gap: 8 }, style]} {...{ className: joinClasses(className) }}>
    <Text accessibilityRole="header" {...{ className: joinClasses(styled && "text-text font-semibold") }}>{label}</Text>
    <Text accessibilityLiveRegion="polite" {...{ className: joinClasses(styled && "text-text-muted") }}>{pending ? "Restoring history…" : `State ${cursor} of ${entries.length}`}</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <Button title="Undo" disabled={pending || cursor === 0} onPress={() => jump(cursor - 1)} unstyled={unstyled}/>
      <Button title="Redo" disabled={pending || cursor === entries.length} onPress={() => jump(cursor + 1)} unstyled={unstyled}/>
      {pending ? <Button title="Cancel history request" onPress={action.cancel} unstyled={unstyled}/> : null}
    </View>
    <Button title="Initial state" accessibilityLabel={cursor === 0 ? "Current state: Initial state" : "Restore initial state"} disabled={pending || cursor === 0} onPress={() => jump(0)} unstyled={unstyled}/>
    <FlatList data={entries} keyExtractor={entry => entry.id} style={{ height }} initialNumToRender={12} windowSize={5}
      accessibilityLabel={label} ListEmptyComponent={<Text {...{ className: joinClasses(styled && "text-text-muted") }}>No document edits</Text>}
      renderItem={({ item, index }) => <Pressable accessibilityRole="button" accessibilityLabel={`${cursor === index + 1 ? "Current state" : "Restore state"} ${index + 1}: ${item.label}`}
        accessibilityState={{ disabled: pending }} {...(cursor === index + 1 ? { "aria-current": "step" as const } : {})}
        disabled={pending} onPress={() => jump(index + 1)}
        {...{ className: joinClasses(styled && "border-b border-border focus-visible:ring-2 focus-visible:ring-focus") }}
        style={{ minHeight: 56, padding: 10, gap: 4 }}>
        <Text {...{ className: joinClasses(styled && (index < cursor ? "text-text" : "text-text-muted")) }}>{item.label}</Text>
        {item.detail ? <Text {...{ className: joinClasses(styled && "text-text-muted text-sm") }}>{item.detail}</Text> : null}
        {item.timestampMs !== undefined ? <Text {...{ className: joinClasses(styled && "text-text-muted text-sm") }}>{new Date(item.timestampMs).toLocaleString()}</Text> : null}
      </Pressable>}/>
    <ErrorMessage {...(action.error ? { message: action.error } : {})} unstyled={unstyled}/>
  </View>;
}
