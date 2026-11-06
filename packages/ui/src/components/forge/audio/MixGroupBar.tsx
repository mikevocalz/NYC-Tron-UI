/**
 * Row of mix group chips with group solo and mute.
 *
 * Structural references (Mobbin, iOS; structure only):
 * - Discord, voice settings sheet: an input meter drawn as a filled bar
 *   directly under the control it reports on.
 * - Facebook, video volume sheet: one row per source with its own mute
 *   toggle next to the level, sources grouped in separate rounded rows.
 * - Waymo, audio settings: "Balance and fade" as its own labelled control,
 *   separate from per-band levels.
 * - Opal, sound mix: one vertical level column per source, side by side,
 *   each named underneath.
 */
import { Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import type { MixGroup, mixGroups } from "./mix-groups.ts";

const HIT = 44;

/** Props for {@linkcode MixGroupBar}. */
export interface MixGroupBarProps extends Omit<ViewProps, "children"> {
  /** From {@linkcode mixGroups}, in display order. */
  readonly groups: readonly MixGroup[];
  /**
   * Once per press. Requests `false` when every member is soloed, `true`
   * otherwise (including the mixed state). The engine applies it to every
   * member as one undo step.
   */
  readonly onGroupSoloCommit: (group: string, solo: boolean) => void | Promise<unknown>;
  /** Once per press, with the same rule as solo. */
  readonly onGroupMutedCommit: (group: string, muted: boolean) => void | Promise<unknown>;
  /** @default false */
  readonly disabled?: boolean;
  className?: string;
  unstyled?: boolean;
}

type Tri = boolean | "mixed";

function toggleA11y(state: Tri, disabled: boolean): Record<string, unknown> {
  // React Native Web passes `togglebutton` through as an unknown role, so
  // web gets a button with aria-pressed (which also carries "mixed").
  return Platform.OS === "web"
    ? { role: "button", "aria-pressed": state, "aria-disabled": disabled || undefined }
    : { accessibilityRole: "togglebutton", accessibilityState: { checked: state, disabled } };
}

/**
 * Controlled mix group chips: name, member count, and Solo and Mute toggles
 * for the whole group. A group where only some members are soloed (or
 * muted) shows that toggle as mixed: a dashed outline, `aria-pressed="mixed"`
 * on web and `checked: "mixed"` on iOS and Android.
 *
 * {@linkcode MixingConsole} draws this bar above the strips when a channel
 * has a group and both group callbacks are passed.
 */
export function MixGroupBar({
  groups, onGroupSoloCommit, onGroupMutedCommit, disabled = false, className, unstyled = false, ...rest
}: MixGroupBarProps) {
  const styled = !unstyled;
  const toggle = (kind: "Solo" | "Mute", group: MixGroup) => {
    const state: Tri = kind === "Solo"
      ? (group.mixed ? "mixed" : group.solo)
      : (group.mutedMixed ? "mixed" : group.muted);
    const on = state === true;
    const fill = kind === "Solo" ? "bg-accent border-accent" : "bg-primary border-primary";
    const onText = kind === "Solo" ? "text-surface-raised" : "text-on-primary";
    return <Pressable key={kind} {...toggleA11y(state, disabled)}
      accessibilityLabel={kind + " group " + group.name}
      accessibilityHint={state === "mixed" ? (kind === "Solo" ? "Some members soloed" : "Some members muted") : undefined}
      disabled={disabled}
      onPress={() => { void (kind === "Solo" ? onGroupSoloCommit : onGroupMutedCommit)(group.name, !on); }}
      {...{ className: joinClasses(styled && "rounded-control items-center justify-center focus-visible:ring-2 focus-visible:ring-focus active:opacity-80",
        styled && (on ? fill : state === "mixed" ? "border-accent bg-surface-raised" : "border-border bg-surface-raised")) }}
      style={{ minWidth: HIT + 8, minHeight: HIT, paddingHorizontal: 8, borderWidth: 2,
        borderStyle: state === "mixed" ? "dashed" : "solid", opacity: disabled ? 0.45 : 1 }}>
      <Text {...{ className: joinClasses(styled && "font-semibold", styled && (on ? onText : "text-text")) }}>{kind}</Text>
    </Pressable>;
  };
  return <View {...rest} accessibilityLabel="Mix groups" {...{ role: "group" }}
    {...{ className: joinClasses("flex-row flex-wrap gap-2", className) }}>
    {groups.map(group => {
      const count = group.memberIds.length + (group.memberIds.length === 1 ? " channel" : " channels");
      return <View key={group.name} {...{ role: "group", "aria-label": group.name + " group, " + count }}
        {...{ className: joinClasses("flex-row items-center gap-2", styled && "rounded-control border border-border bg-surface-sunken") }}
        style={{ paddingVertical: 4, paddingStart: 10, paddingEnd: 4 }}>
        <View style={{ minWidth: 56, maxWidth: 140 }}>
          <Text numberOfLines={1} {...{ className: joinClasses(styled && "font-semibold text-text") }}>{group.name}</Text>
          <Text numberOfLines={1} {...{ className: joinClasses(styled && "text-xs text-text-muted") }}>{count}</Text>
        </View>
        {toggle("Solo", group)}
        {toggle("Mute", group)}
      </View>;
    })}
  </View>;
}
