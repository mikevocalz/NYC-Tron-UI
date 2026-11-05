import { useRef } from "react";
import {
  PanResponder, Platform, ScrollView, Text, View,
  type GestureResponderEvent, type KeyDownEvent, type PanResponderGestureState, type ViewProps, type ViewStyle,
} from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { joinClasses } from "../../styles.ts";
import { clampVelocity, dragVelocity, pitchName, velocityToHeight, type MidiNote } from "./note-grid.ts";

const HIT = 44;
const BAR = 8;
const SLOP = 4;

/** Props for {@linkcode MIDIVelocityLane}. */
export interface MIDIVelocityLaneProps extends Omit<ViewProps, "children"> {
  /** The same notes, in the same order, as the piano roll above. */
  readonly notes: readonly MidiNote[];
  readonly clipTicks: number;
  /** Must match the piano roll. @default 0.1 */
  readonly pixelsPerTick?: number;
  /** Lane height, points. @default 96 */
  readonly height?: number;
  /** Leading space so bars line up with the roll's grid, e.g. `PIANO_ROLL_KEY_COLUMN`. @default 0 */
  readonly inset?: number;
  /**
   * Follow another view's horizontal scroll (the roll's `onScrollX`). When
   * omitted the lane scrolls on its own.
   */
  readonly scrollX?: number;
  /** Arrow-key and screen-reader step. @default 4 */
  readonly step?: number;
  readonly selectedIndex?: number;
  readonly onSelect?: (index: number) => void;
  /** Once per finished bar drag or step. */
  readonly onVelocityCommit: (index: number, velocity: number) => void | Promise<unknown>;
  /** @default false */
  readonly disabled?: boolean;
  /** @default "Velocity" */
  readonly label?: string;
  className?: string;
  unstyled?: boolean;
}

/**
 * Controlled per-note velocity bars under a {@linkcode MIDIPianoRoll}. Drag
 * a bar up or down, or focus it and use Up/Down (PageUp/PageDown for 16).
 * One commit per gesture.
 *
 * Drawing a line across several bars and MIDI channel editing are
 * deferred: a line would be many notes in one gesture and the Cadence
 * engine has no batch velocity op (sequential ops would split one gesture
 * into many undo steps), and notes carry no channel.
 */
export function MIDIVelocityLane({
  notes, clipTicks, pixelsPerTick = 0.1, height = 96, inset = 0, scrollX, step = 4, selectedIndex, onSelect,
  onVelocityCommit, disabled = false, label = "Velocity", className, unstyled = false, style, ...rest
}: MIDIVelocityLaneProps) {
  if (!Number.isInteger(clipTicks) || clipTicks <= 0) throw new RangeError("clipTicks must be a positive integer");
  if (!Number.isFinite(height) || height < HIT) throw new RangeError(`Velocity lane height must be at least ${HIT}`);
  const styled = !unstyled;
  const width = clipTicks * pixelsPerTick;
  const content = <View style={{ width, height, direction: "ltr" }}>
    {[0.25, 0.5, 0.75].map(f => <View key={f} pointerEvents="none" {...{ className: joinClasses(styled && "bg-border") }}
      style={{ position: "absolute", left: 0, right: 0, top: height * (1 - f), height: 1 }} />)}
    {notes.map((note, index) => <VelocityBar key={index} index={index} note={note} x={note.startTicks * pixelsPerTick}
      laneHeight={height} step={step} selected={index === selectedIndex} disabled={disabled} styled={styled}
      onSelect={onSelect} onCommit={onVelocityCommit} />)}
  </View>;
  return <View {...rest} accessibilityLabel={label} {...{ role: "group" }}
    {...{ className: joinClasses(styled && "rounded-card border border-border bg-surface-raised overflow-hidden", className) }}
    style={[{ flexDirection: "row", direction: "ltr" }, style]}>
    <View style={{ width: inset, justifyContent: "center" }}>
      {inset >= 40 ? <Text {...{ className: joinClasses(styled && "text-text-muted") }} style={{ paddingHorizontal: 6 }}>Vel</Text> : null}
    </View>
    {scrollX === undefined
      ? <ScrollView horizontal style={{ flex: 1 }}>{content}</ScrollView>
      : <View style={{ flex: 1, overflow: "hidden" }}>
          <View style={{ transform: [{ translateX: -scrollX }] }}>{content}</View>
        </View>}
  </View>;
}

type Bar = { preview: number; active: boolean };

interface VelocityBarProps {
  readonly index: number;
  readonly note: MidiNote;
  readonly x: number;
  readonly laneHeight: number;
  readonly step: number;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly styled: boolean;
  readonly onSelect?: (index: number) => void;
  readonly onCommit: MIDIVelocityLaneProps["onVelocityCommit"];
}

function VelocityBar({ index, note, x, laneHeight, step, selected, disabled, styled, onSelect, onCommit }: VelocityBarProps) {
  const latest = useRef({ index, note, laneHeight, step, disabled, onSelect, onCommit });
  latest.current = { index, note, laneHeight, step, disabled, onSelect, onCommit };
  const local = useRef<StoreApi<Bar> | null>(null);
  if (!local.current) local.current = createStore<Bar>(() => ({ preview: note.velocity, active: false }));
  const store = local.current;
  const active = useStore(store, s => s.active);
  const preview = useStore(store, s => s.preview);
  const current = active ? preview : note.velocity;
  const cancel = () => store.setState({ active: false, preview: latest.current.note.velocity });
  const commit = (next: number) => {
    const p = latest.current;
    store.setState({ active: false, preview: next });
    if (!p.disabled && next !== p.note.velocity) void p.onCommit(p.index, next);
  };
  const claims = (_e: GestureResponderEvent, g: PanResponderGestureState) =>
    !latest.current.disabled && Math.abs(g.dy) >= SLOP && Math.abs(g.dy) > Math.abs(g.dx);
  const responder = useRef<ReturnType<typeof PanResponder.create> | null>(null);
  if (!responder.current) responder.current = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: claims,
    onMoveShouldSetPanResponderCapture: claims,
    onPanResponderGrant: () => {
      const p = latest.current;
      p.onSelect?.(p.index);
      store.setState({ active: true, preview: p.note.velocity });
    },
    onPanResponderMove: (_e, g) => {
      const p = latest.current;
      const next = dragVelocity(p.note.velocity, g.dy, p.laneHeight);
      if (next !== store.getState().preview) store.setState({ preview: next });
    },
    onPanResponderRelease: () => { if (store.getState().active) commit(store.getState().preview); },
    onPanResponderTerminate: cancel,
    onPanResponderTerminationRequest: () => !store.getState().active,
    onShouldBlockNativeResponder: () => true,
  });
  const nudge = (delta: number) => {
    const p = latest.current;
    if (p.disabled || store.getState().active) return;
    commit(clampVelocity(p.note.velocity + delta));
  };
  const onKeyDown = (e: KeyDownEvent) => {
    const key = e.nativeEvent.key;
    const delta = key === "ArrowUp" ? step : key === "ArrowDown" ? -step : key === "PageUp" ? 16 : key === "PageDown" ? -16 : 0;
    if (key === "Escape" && store.getState().active) { e.preventDefault(); cancel(); return; }
    if (delta === 0) return;
    e.preventDefault();
    nudge(delta);
  };
  const h = velocityToHeight(current, laneHeight);
  const webStyle = Platform.OS === "web" ? { touchAction: "pan-x", cursor: "ns-resize" } as unknown as ViewStyle : undefined;
  return <View {...responder.current.panHandlers}
    accessible focusable={!disabled} accessibilityRole="adjustable"
    accessibilityLabel={`Velocity of ${pitchName(note.pitch)} note ${index + 1}`}
    accessibilityValue={{ min: 0, max: 127, now: current }}
    accessibilityState={{ selected, disabled }}
    accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
    onAccessibilityAction={e => nudge(e.nativeEvent.actionName === "increment" ? step : -step)}
    onKeyDown={onKeyDown}
    onFocus={() => onSelect?.(index)}
    {...{ className: joinClasses(styled && "rounded-control focus-visible:ring-2 focus-visible:ring-focus") }}
    style={{ position: "absolute", left: x - (HIT - BAR) / 2, top: 0, width: HIT, height: laneHeight,
      opacity: disabled ? 0.45 : 1, ...webStyle }}>
    <View pointerEvents="none" {...{ className: joinClasses(styled && (selected || active ? "bg-primary" : "bg-accent")) }}
      style={{ position: "absolute", left: (HIT - BAR) / 2, width: BAR, bottom: 0, height: Math.max(2, h), borderRadius: 2 }} />
    <View pointerEvents="none" {...{ className: joinClasses(styled && (selected || active ? "bg-primary" : "bg-accent")) }}
      style={{ position: "absolute", left: (HIT - BAR) / 2 - 3, width: BAR + 6, height: 4, borderRadius: 2, bottom: Math.max(2, h) - 2 }} />
  </View>;
}
