import { View, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import { LevelFader } from "./LevelFader.tsx";
import { PanControl } from "./PanControl.tsx";
import { SoloMuteButtons } from "./SoloMuteButtons.tsx";
import { FADER_RANGES, type FaderRange } from "./level.ts";
import { describeAudibility, type Audibility, type MixerChannel } from "./mixer.ts";

/** Props for {@linkcode ChannelStrip}. */
export interface ChannelStripProps extends Omit<ViewProps, "children"> {
  readonly channel: MixerChannel;
  /** From {@linkcode audibility} across the whole console. @default from `channel.muted` */
  readonly audibility?: Audibility;
  readonly onGainCommit: (gain: number) => void | Promise<unknown>;
  readonly onPanCommit: (pan: number) => void | Promise<unknown>;
  readonly onMutedCommit: (muted: boolean) => void | Promise<unknown>;
  readonly onSoloCommit: (solo: boolean) => void | Promise<unknown>;
  /** Live previews; never persist these. */
  readonly onGainChange?: (gain: number) => void;
  readonly onPanChange?: (pan: number) => void;
  /**
   * Fader window. The Cadence engine stores gain 0..1, so the default tops
   * out at unity. @default FADER_RANGES.UNITY
   */
  readonly range?: FaderRange;
  /** Fader travel, points. @default 160 */
  readonly faderLength?: number;
  /** @default false */
  readonly disabled?: boolean;
  className?: string;
  unstyled?: boolean;
}

/** Strip width. Fits the fader's −/+ row and the pan track at 44pt targets. */
export const CHANNEL_STRIP_WIDTH = 120;

/**
 * One mixer column: level fader with dB readout, pan, mute and solo.
 * Controlled; every control commits once per gesture through its callback.
 */
export function ChannelStrip({
  channel, audibility, onGainCommit, onPanCommit, onMutedCommit, onSoloCommit, onGainChange, onPanChange,
  range = FADER_RANGES.UNITY, faderLength = 160, disabled = false, className, unstyled = false, style, ...rest
}: ChannelStripProps) {
  const state: Audibility = audibility ?? (channel.muted ? "muted" : "audible");
  // Web reads this as the group name; native screen readers reach each control.
  return <View {...rest} {...{ role: "group", "aria-label": describeAudibility(channel.name, state, channel.solo) }}
    {...{ className: joinClasses("items-center gap-2 py-2", className) }}
    style={[{ width: CHANNEL_STRIP_WIDTH }, style]}>
    <LevelFader value={channel.gain} label={channel.name} range={range} length={faderLength}
      disabled={disabled} onChange={onGainChange} onCommit={onGainCommit} unstyled={unstyled} />
    <PanControl value={channel.pan} label={channel.name} width={CHANNEL_STRIP_WIDTH - 16}
      disabled={disabled} onChange={onPanChange} onCommit={onPanCommit} unstyled={unstyled} />
    <SoloMuteButtons label={channel.name} muted={channel.muted} solo={channel.solo} audibility={state}
      disabled={disabled} onMutedCommit={onMutedCommit} onSoloCommit={onSoloCommit} unstyled={unstyled} />
  </View>;
}
