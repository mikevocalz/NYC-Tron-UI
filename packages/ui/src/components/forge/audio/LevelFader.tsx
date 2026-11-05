import { useRef } from "react";
import { I18nManager, PanResponder, Pressable, Text, View, type ViewProps } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { cancelPreview } from "../cancel-preview.ts";
import { joinClasses } from "../../styles.ts";
import {
  FADER_RANGES, clampGain, dragToGain, formatDb, gainToPosition, stepGain,
  type FaderRange,
} from "./level.ts";

/** Visual thickness of the thumb along the travel axis, in points. */
const THUMB = 16;
/** Minimum hit area across the travel axis (iOS 44pt / Android 48dp floor). */
const HIT = 44;

type Local = { preview: number; active: boolean };

/** Props for {@linkcode LevelFader}. */
export interface LevelFaderProps extends Omit<ViewProps, "children"> {
  /** Committed linear gain from the app or engine (0 = silence, 1 = 0 dB). */
  readonly value: number;
  /** Accessible name and visible label, e.g. `"Vocals"`. */
  readonly label: string;
  /**
   * Called with each new gain while a drag is in progress, and with the
   * restored `value` when a drag is cancelled. Use it for live preview only.
   */
  readonly onChange?: (gain: number) => void;
  /**
   * Called once per completed drag on release, and once per step from the
   * buttons or a screen-reader action. Not called when the gain is unchanged.
   */
  readonly onCommit: (gain: number) => void | Promise<unknown>;
  /**
   * Decibel window of the travel. The bottom of travel is always silence.
   * @default FADER_RANGES.UNITY (-60 dB to 0 dB)
   */
  readonly range?: FaderRange;
  /**
   * Size of one button or screen-reader step, in dB.
   * @default 1
   */
  readonly stepDb?: number;
  /** @default "vertical" */
  readonly orientation?: "vertical" | "horizontal";
  /**
   * Track length along the travel axis, in points.
   * @default 160
   */
  readonly length?: number;
  /** @default false */
  readonly disabled?: boolean;
  className?: string;
  /** Drop the default token recipe; supply a full app recipe via `className`. */
  unstyled?: boolean;
}

/**
 * Controlled audio level fader. It holds no engine state: the app passes the
 * committed `value`, sees previews through `onChange`, and receives exactly
 * one `onCommit` per gesture. Travel is linear in dB (see `level.ts`).
 *
 * Extracted from Nitro Forge PR #25 `NativeLevelSlider`, which wrapped the
 * `@expo/ui` Slider and fired on every move. This version draws its own
 * track with responder gestures so it can separate preview from commit and
 * needs no `@expo/ui` host.
 */
export function LevelFader({
  value, label, onChange, onCommit, range = FADER_RANGES.UNITY, stepDb = 1,
  orientation = "vertical", length = 160, disabled = false,
  className, unstyled = false, ...rest
}: LevelFaderProps) {
  if (!Number.isFinite(value)) throw new RangeError("Gain must be finite");
  if (!Number.isFinite(length) || length <= THUMB * 2) {
    throw new RangeError(`Fader length must be greater than ${THUMB * 2}`);
  }
  const vertical = orientation === "vertical";
  const travel = length - THUMB;
  const latest = useRef({ value, range, stepDb, disabled, onChange, onCommit, vertical, travel });
  latest.current = { value, range, stepDb, disabled, onChange, onCommit, vertical, travel };
  const local = useRef<StoreApi<Local> | null>(null);
  if (!local.current) local.current = createStore<Local>(() => ({ preview: value, active: false }));
  const store = local.current;
  const active = useStore(store, s => s.active);
  const preview = useStore(store, s => s.preview);
  const current = clampGain(active ? preview : value, range);
  const position = gainToPosition(current, range);
  const startPosition = useRef(0);

  const cancel = () => cancelPreview(
    latest.current.value,
    restored => store.setState({ active: false, preview: restored }),
    latest.current.onChange,
  );
  const commit = (next: number) => {
    const p = latest.current;
    store.setState({ active: false, preview: next });
    if (next !== p.value) void p.onCommit(next);
  };
  const responder = useRef<ReturnType<typeof PanResponder.create> | null>(null);
  if (!responder.current) responder.current = PanResponder.create({
    onStartShouldSetPanResponder: () => !latest.current.disabled,
    onMoveShouldSetPanResponder: () => !latest.current.disabled,
    onPanResponderGrant: () => {
      const p = latest.current;
      const start = clampGain(p.value, p.range);
      startPosition.current = gainToPosition(start, p.range);
      store.setState({ active: true, preview: start });
    },
    onPanResponderMove: (_event, gesture) => {
      const p = latest.current;
      if (p.disabled) return;
      // Up raises a vertical fader. Horizontal travel follows reading
      // direction, so RTL layouts raise the level toward the left.
      const delta = p.vertical ? -gesture.dy : I18nManager.isRTL ? -gesture.dx : gesture.dx;
      const next = dragToGain(startPosition.current, delta, p.travel, p.range);
      if (next !== store.getState().preview) {
        store.setState({ preview: next });
        p.onChange?.(next);
      }
    },
    onPanResponderRelease: () => {
      if (!store.getState().active) return;
      if (latest.current.disabled) { cancel(); return; }
      commit(store.getState().preview);
    },
    onPanResponderTerminate: cancel,
    onPanResponderTerminationRequest: () => true,
  });
  const nudge = (direction: -1 | 1) => {
    const p = latest.current;
    if (p.disabled || store.getState().active) return;
    const next = stepGain(p.value, direction, p.stepDb, p.range);
    if (next === p.value) return;
    p.onChange?.(next);
    commit(next);
  };

  const styled = !unstyled;
  const offset = position * travel;
  const readout = formatDb(current);
  const trackStyle = vertical
    ? { width: HIT, height: length }
    : { width: length, height: HIT };
  const railStyle = vertical
    ? { position: "absolute" as const, top: THUMB / 2, bottom: THUMB / 2, width: 6, left: (HIT - 6) / 2, borderRadius: 3 }
    : { position: "absolute" as const, start: THUMB / 2, end: THUMB / 2, height: 6, top: (HIT - 6) / 2, borderRadius: 3 };
  const fillStyle = vertical
    ? { position: "absolute" as const, bottom: THUMB / 2, height: offset, width: 6, left: (HIT - 6) / 2, borderRadius: 3 }
    : { position: "absolute" as const, start: THUMB / 2, width: offset, height: 6, top: (HIT - 6) / 2, borderRadius: 3 };
  const thumbStyle = vertical
    ? { position: "absolute" as const, bottom: offset, left: 4, width: HIT - 8, height: THUMB, borderRadius: 4, borderWidth: 2 }
    : { position: "absolute" as const, start: offset, top: 4, width: THUMB, height: HIT - 8, borderRadius: 4, borderWidth: 2 };
  const text = joinClasses(styled && "text-text");
  const stepButton = { minWidth: HIT, minHeight: HIT, justifyContent: "center" as const, alignItems: "center" as const, opacity: disabled ? 0.45 : 1 };

  return <View {...rest}
    {...{ className: joinClasses("items-center gap-2", styled && "rounded-control bg-surface-raised p-3", className) }}>
    <Text {...{ className: joinClasses(styled && "text-text font-semibold") }}>{label}</Text>
    <View {...responder.current.panHandlers}
      accessible accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(position * 100), text: readout }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={e => {
        if (e.nativeEvent.actionName === "increment") nudge(1);
        if (e.nativeEvent.actionName === "decrement") nudge(-1);
      }}
      style={{ ...trackStyle, opacity: disabled ? 0.45 : 1 }}>
      <View pointerEvents="none" {...{ className: joinClasses(styled && "bg-surface-sunken") }} style={railStyle} />
      <View pointerEvents="none" {...{ className: joinClasses(styled && "bg-accent") }} style={fillStyle} />
      <View pointerEvents="none"
        {...{ className: joinClasses(styled && "bg-surface-sunken border-accent") }}
        style={thumbStyle} />
    </View>
    <Text {...{ className: joinClasses(styled && "text-text-muted") }}
      style={{ fontVariant: ["tabular-nums"] }}>{readout}</Text>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Lower ${label} by ${stepDb} dB`}
        disabled={disabled} onPress={() => nudge(-1)} style={stepButton}>
        <Text {...{ className: text }}>−</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Raise ${label} by ${stepDb} dB`}
        disabled={disabled} onPress={() => nudge(1)} style={stepButton}>
        <Text {...{ className: text }}>+</Text>
      </Pressable>
    </View>
  </View>;
}
