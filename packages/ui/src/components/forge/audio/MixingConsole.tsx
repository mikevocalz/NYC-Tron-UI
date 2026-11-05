import { ScrollView, View, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import { EmptyState, type EmptyStateExit } from "../../feedback/EmptyState.tsx";
import { ChannelStrip } from "./ChannelStrip.tsx";
import { FADER_RANGES, type FaderRange } from "./level.ts";
import { audibility, type MixerChannel } from "./mixer.ts";

type Id = MixerChannel["id"];

/** Props for {@linkcode MixingConsole}. */
export interface MixingConsoleProps extends Omit<ViewProps, "children"> {
  /** Committed channel state from the engine, in strip order. */
  readonly channels: readonly MixerChannel[];
  readonly onGainCommit: (id: Id, gain: number) => void | Promise<unknown>;
  readonly onPanCommit: (id: Id, pan: number) => void | Promise<unknown>;
  readonly onMutedCommit: (id: Id, muted: boolean) => void | Promise<unknown>;
  readonly onSoloCommit: (id: Id, solo: boolean) => void | Promise<unknown>;
  /** Live gain preview, e.g. for an audio graph that follows the drag. */
  readonly onGainChange?: (id: Id, gain: number) => void;
  readonly onPanChange?: (id: Id, pan: number) => void;
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
 * Controlled channel-strip console. Strips scroll horizontally; faders
 * claim only vertical drags, so a sideways swipe across them scrolls.
 * Solo-over-mute audibility is computed across all channels the same way
 * the Cadence engine renders.
 *
 * Not drawn, with reasons: level meters (no engine meter stream yet,
 * roster E-16), FX insert slots and routing (E-19/E-20), and channel
 * grouping (no group model in the engine).
 */
export function MixingConsole({
  channels, onGainCommit, onPanCommit, onMutedCommit, onSoloCommit, onGainChange, onPanChange,
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
  return <View {...rest} accessibilityLabel={label} {...{ role: "group" }}
    {...{ className: joinClasses(styled && "rounded-card border border-border bg-surface-raised", className) }}>
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingHorizontal: 4 }}>
      {channels.map((channel, i) => <View key={channel.id} style={{ flexDirection: "row" }}>
        {i > 0 ? <View {...{ className: joinClasses(styled && "bg-border") }} style={{ width: 1, alignSelf: "stretch" }} /> : null}
        <ChannelStrip channel={channel} audibility={states[i]} range={range} faderLength={faderLength}
          disabled={disabled} unstyled={unstyled}
          onGainCommit={gain => onGainCommit(channel.id, gain)}
          onPanCommit={pan => onPanCommit(channel.id, pan)}
          onMutedCommit={muted => onMutedCommit(channel.id, muted)}
          onSoloCommit={solo => onSoloCommit(channel.id, solo)}
          onGainChange={onGainChange ? gain => onGainChange(channel.id, gain) : undefined}
          onPanChange={onPanChange ? pan => onPanChange(channel.id, pan) : undefined} />
      </View>)}
    </ScrollView>
  </View>;
}
