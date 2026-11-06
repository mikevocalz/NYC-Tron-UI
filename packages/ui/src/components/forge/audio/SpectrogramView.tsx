/*
 * Structural references (Mobbin, iOS, structure only):
 * - TIDE, Ambient Noise: time-banded history with a step legend under it.
 * - Suno, Extend: audio card with time readouts along the bottom edge.
 * - How We Feel, voice entry: a dense column strip of audio energy.
 * - Facebook, music clip picker: waveform strip with a time window over it.
 */
import { useRef } from "react";
import { Text, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { joinClasses } from "../../styles.ts";
import { useStatusAnnouncement } from "../announce.ts";
import {
  SPECTROGRAM_THRESHOLDS_DB, columnsForWidth, describeSpectrogram, frequencyTicks, poolSpectrogram,
  spectrogramRuns, timeTicks, type IntensityStep,
} from "./spectrogram.ts";

/** Load state of a {@linkcode SpectrogramView}. */
export type SpectrogramStatus = "measuring" | "ready" | "error" | "empty";

/** Props for {@linkcode SpectrogramView}. Data comes from the engine's `spectrogram` op. */
export interface SpectrogramViewProps extends Omit<ViewProps, "children"> {
  /** Name of the analysed range, used as the group label. */
  readonly label: string;
  /** What to draw: a placeholder, the grid, an error or the empty message. */
  readonly status: SpectrogramStatus;
  /** One row per hop, one dB value per band (floored at -120, full-scale sine about 0). */
  readonly frames: readonly (readonly number[])[];
  /** Band centres in Hz, low to high, log-spaced. */
  readonly bandsHz: readonly number[];
  /** Seconds between frames. */
  readonly hopSeconds: number;
  /** Plot height in pt. @default 160 */
  readonly height?: number;
  /** Shown when `status` is `"error"`. */
  readonly error?: string;
  className?: string;
  unstyled?: boolean;
}

const AXIS = 52;
/** Sequential single-hue steps, light to dark; tokens only. */
const STEP_CLASS: Record<Exclude<IntensityStep, 0>, string> = {
  1: "bg-primary/15", 2: "bg-primary/30", 3: "bg-primary/50", 4: "bg-primary/75", 5: "bg-primary",
};

/**
 * Spectrogram drawn with plain Views: time runs left to right (also in RTL),
 * low frequencies at the bottom. The engine matrix is max-pooled to at most
 * 96 columns by measured width and 32 rows, then mapped to five intensity
 * steps; equal adjacent cells merge into one View, so the drawn count stays
 * at or under 96 x 32.
 */
export function SpectrogramView({
  label, status, frames, bandsHz, hopSeconds, height = 160, error, className, unstyled = false, style, ...props
}: SpectrogramViewProps) {
  const local = useRef<StoreApi<{width:number}> | null>(null);
  if (!local.current) local.current = createStore(() => ({width:0}));
  const store = local.current;
  const width = useStore(store, s => s.width);
  const statusText = status === "measuring" ? "Analysing spectrum" : status === "error" ? (error ?? "Spectrum could not be analysed")
    : status === "empty" ? "Nothing to analyse" : "Spectrum ready";
  useStatusAnnouncement(statusText);
  const muted = !unstyled ? "text-text-muted" : undefined;
  const plotWidth = Math.max(0, width - AXIS);
  const ready = status === "ready" && frames.length > 0 && bandsHz.length > 0;
  const grid = ready && plotWidth > 0
    ? poolSpectrogram(frames, bandsHz.length, columnsForWidth(plotWidth, frames.length)) : undefined;
  const runs = grid ? spectrogramRuns(grid) : [];
  const duration = frames.length * hopSeconds;
  // Whole-point edges so neighbouring runs share a boundary with no seam.
  const edges = (column: number, span: number, row: number) => {
    const x0 = Math.round(column * plotWidth / grid!.columns), x1 = Math.round((column + span) * plotWidth / grid!.columns);
    const y0 = Math.round(row * height / grid!.rows), y1 = Math.round((row + 1) * height / grid!.rows);
    return { position: "absolute" as const, left: x0, width: x1 - x0, bottom: y0, height: y1 - y0 };
  };
  const summary = ready ? describeSpectrogram(frames, bandsHz, hopSeconds) : statusText;

  let body;
  if (status === "measuring") {
    body = <View style={{ gap: 8 }}>
      <Text accessibilityLiveRegion="polite" {...{ className: muted }} style={{ fontSize: 13 }}>Analysing the spectrum of the selected range</Text>
      <View aria-hidden {...{ className: joinClasses(!unstyled && "rounded-control bg-surface-sunken") }} style={{ height }} />
    </View>;
  } else if (status === "error") {
    body = <View accessibilityRole="alert"><Text selectable {...{ className: joinClasses(!unstyled && "text-text") }} style={{ fontSize: 14 }}>
      {error ?? "The spectrum could not be analysed."}</Text></View>;
  } else if (!ready) {
    body = <Text accessibilityLiveRegion="polite" {...{ className: muted }} style={{ fontSize: 14 }}>
      There is no audio in this range to analyse. Select a range with audio.
    </Text>;
  } else {
    body = <View style={{ gap: 6, direction: "ltr" }}>
      <View role="img" accessibilityLabel={summary} onLayout={e => store.setState({width:e.nativeEvent.layout.width})}
        style={{ flexDirection: "row", height }}>
        <View aria-hidden style={{ width: AXIS, height }}>
          {frequencyTicks(bandsHz).map(t => <Text key={t.label} {...{ className: muted }}
            style={{ position: "absolute", right: 8, fontSize: 11, fontVariant: ["tabular-nums"],
              top: Math.min(height - 14, Math.max(0, height * (1 - t.position) - 7)) }}>{t.label}</Text>)}
        </View>
        <View aria-hidden testID={props.testID ? props.testID + "-plot" : undefined}
          {...{ className: joinClasses(!unstyled && "rounded-control bg-surface-sunken") }}
          style={{ flex: 1, height, overflow: "hidden" }}>
          {grid ? runs.map(r => <View key={r.row + ":" + r.column} {...{ className: joinClasses(!unstyled && STEP_CLASS[r.step]) }}
            style={edges(r.column, r.span, r.row)} />) : null}
        </View>
      </View>
      <View aria-hidden style={{ marginLeft: AXIS, height: 16 }}>
        {timeTicks(duration).map((t, i, all) => <Text key={t.label} {...{ className: muted }}
          style={{ position: "absolute", fontSize: 11, fontVariant: ["tabular-nums"],
            ...(i === 0 ? { left: 0 } : i === all.length - 1 && t.position > 0.92
              ? { right: ((1 - t.position) * 100) + "%" }
              : { left: (t.position * 100) + "%", transform: [{ translateX: "-50%" }] }) }}>{t.label}</Text>)}
      </View>
      <View aria-hidden style={{ flexDirection: "row", alignItems: "center", gap: 6, marginLeft: AXIS, flexWrap: "wrap" }}>
        <Text {...{ className: muted }} style={{ fontSize: 11 }}>Quiet</Text>
        {([1, 2, 3, 4, 5] as const).map(s => <View key={s} {...{ className: joinClasses(!unstyled && STEP_CLASS[s], !unstyled && "rounded-sm") }}
          style={{ width: 16, height: 10 }} />)}
        <Text {...{ className: muted }} style={{ fontSize: 11 }}>
          {"Loud (steps at " + SPECTROGRAM_THRESHOLDS_DB.map(d => "−" + -d).join(", ") + " dB)"}
        </Text>
      </View>
    </View>;
  }

  return <View {...props} role="group" aria-label={label} aria-busy={status === "measuring" || undefined}
    {...{ className: joinClasses(!unstyled && "rounded-card border border-border bg-surface-raised", className) }}
    style={[{ padding: 16, gap: 12 }, style]}>
    <Text role="heading" aria-level={3} {...{ className: joinClasses(!unstyled && "text-text font-semibold") }} style={{ fontSize: 15 }}>{label}</Text>
    {body}
  </View>;
}
