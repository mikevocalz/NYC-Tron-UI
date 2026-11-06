import { ScrollView, View, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import { EmptyState, type EmptyStateExit } from "../../feedback/EmptyState.tsx";
import { ChannelStrip, channelRouting, type ChannelMeter } from "./ChannelStrip.tsx";
import { MixGroupBar } from "./MixGroupBar.tsx";
import { FADER_RANGES, type FaderRange } from "./level.ts";
import { mixGroups } from "./mix-groups.ts";
import { audibility, type MixerChannel } from "./mixer.ts";

type Id = MixerChannel["id"];

/** Props for {@linkcode MixingConsole}. */
export interface MixingConsoleProps extends Omit<ViewProps, "children"> {
  /** Committed channel state from the engine, tracks and buses in strip order. */
  readonly channels: readonly MixerChannel[];
  readonly onGainCommit: (id: Id, gain: number) => void | Promise<unknown>;
  /** Pan on a track, balance on a bus. */
  readonly onPanCommit: (id: Id, pan: number) => void | Promise<unknown>;
  readonly onMutedCommit: (id: Id, muted: boolean) => void | Promise<unknown>;
  readonly onSoloCommit: (id: Id, solo: boolean) => void | Promise<unknown>;
  /** When given, every strip draws a solo-safe toggle. */
  readonly onSoloSafeCommit?: (id: Id, safe: boolean) => void | Promise<unknown>;
  /**
   * Group solo for every member as one engine step. With
   * {@linkcode MixingConsoleProps.onGroupMutedCommit} and at least one
   * grouped channel, a group bar is drawn above the strips.
   */
  readonly onGroupSoloCommit?: (group: string, solo: boolean) => void | Promise<unknown>;
  /** Group mute for every member as one engine step. */
  readonly onGroupMutedCommit?: (group: string, muted: boolean) => void | Promise<unknown>;
  /** Live gain preview, e.g. for an audio graph that follows the drag. */
  readonly onGainChange?: (id: Id, gain: number) => void;
  readonly onPanChange?: (id: Id, pan: number) => void;
  /**
   * Meter values keyed by `String(channel.id)`: linear sample peak from the
   * Cadence `meter` op, after `createPeakHold`. Omit it and no meters are
   * drawn; a channel missing from the record draws an empty meter.
   */
  readonly meters?: Readonly<Record<string, ChannelMeter>>;
  /** @default FADER_RANGES.UNITY */
  readonly range?: FaderRange;
  /** @default 160 */
  readonly faderLength?: number;
  /**
   * The way out when there are no channels, e.g. "Add track". Without it the
   * empty state only explains what is missing.
   */
  readonly emptyAction?: EmptyStateExit;
  /** @default false */
  readonly disabled?: boolean;
  /** Accessible name of the console region. @default "Mixer" */
  readonly label?: string;
  className?: string;
  unstyled?: boolean;
}

/**
 * Controlled channel-strip console for tracks and buses. Strips scroll
 * horizontally; faders claim only vertical drags, so a sideways swipe
 * across them scrolls. Audibility (solo over mute, solo safe, solo through
 * a bus) is computed across all channels the same way the Cadence engine
 * renders.
 *
 * Draws: per-strip sample-peak meters when `meters` is passed, a mix group
 * bar with group solo and mute, solo-safe toggles, bus strips with balance,
 * and each track's output bus.
 *
 * Not drawn, with reasons: a true-peak meter (the engine reports sample
 * peak only), surround panning (roster E-33 struck: the engine is stereo
 * only), and FX insert slots and send editing (E-19/E-20).
 */
export function MixingConsole({
  channels, onGainCommit, onPanCommit, onMutedCommit, onSoloCommit, onSoloSafeCommit,
  onGroupSoloCommit, onGroupMutedCommit, onGainChange, onPanChange, meters,
  range = FADER_RANGES.UNITY, faderLength = 160, emptyAction, disabled = false, label = "Mixer",
  className, unstyled = false, ...rest
}: MixingConsoleProps) {
  const styled = !unstyled;
  const states = audibility(channels);
  if (channels.length === 0) {
    return <EmptyState {...rest} title="No tracks to mix"
      description="Add a track to the project and its channel strip appears here."
      exitAction={emptyAction}
      {...{ className: joinClasses(styled && "rounded-card border border-border bg-surface-raised", className) }} />;
  }
  const busNames = new Map<Id, string>();
  for (const c of channels) if (c.kind === "bus") busNames.set(c.id, c.name);
  const outputNameOf = (c: MixerChannel) =>
    c.output === undefined || c.output === null ? undefined : busNames.get(c.output);
  const routingLines = Math.max(0, ...channels.map(c => channelRouting(c, outputNameOf(c)).length));
  const groups = onGroupSoloCommit && onGroupMutedCommit ? mixGroups(channels) : [];
  return <View {...rest} accessibilityLabel={label} {...{ role: "group" }}
    {...{ className: joinClasses(styled && "rounded-card border border-border bg-surface-raised", className) }}>
    {groups.length > 0 && onGroupSoloCommit && onGroupMutedCommit
      ? <MixGroupBar groups={groups} disabled={disabled} unstyled={unstyled}
        onGroupSoloCommit={onGroupSoloCommit} onGroupMutedCommit={onGroupMutedCommit}
        {...{ className: joinClasses(styled && "border-b border-border") }}
        style={{ padding: 8 }} />
      : null}
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingHorizontal: 4 }}>
      {channels.map((channel, i) => <View key={channel.id} style={{ flexDirection: "row" }}>
        {i > 0 ? <View {...{ className: joinClasses(styled && "bg-border") }} style={{ width: 1, alignSelf: "stretch" }} /> : null}
        <ChannelStrip channel={channel} audibility={states[i]} range={range} faderLength={faderLength}
          disabled={disabled} unstyled={unstyled} outputName={outputNameOf(channel)} routingLines={routingLines}
          meter={meters ? meters[String(channel.id)] ?? { peak: 0 } : undefined}
          onGainCommit={gain => onGainCommit(channel.id, gain)}
          onPanCommit={pan => onPanCommit(channel.id, pan)}
          onMutedCommit={muted => onMutedCommit(channel.id, muted)}
          onSoloCommit={solo => onSoloCommit(channel.id, solo)}
          onSoloSafeCommit={onSoloSafeCommit ? safe => onSoloSafeCommit(channel.id, safe) : undefined}
          onGainChange={onGainChange ? gain => onGainChange(channel.id, gain) : undefined}
          onPanChange={onPanChange ? pan => onPanChange(channel.id, pan) : undefined} />
      </View>)}
    </ScrollView>
  </View>;
}
