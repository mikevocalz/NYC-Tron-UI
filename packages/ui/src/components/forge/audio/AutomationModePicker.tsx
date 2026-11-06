/*
 * Structural references (Mobbin, iOS; structure only). Mobbin has no DAW
 * automation-mode screens, so these are the closest patterns:
 * - Waymo audio settings: the control's name sits directly above its
 *   options, no separate section heading.
 * - Facebook reel editor: a short row of equal, labelled tool choices.
 * - TikTok video editor: lane-level options grouped beside the lanes they
 *   act on rather than in a modal.
 */
import { useRef, type ComponentRef } from "react";
import { Platform, Pressable, Text, View, type KeyDownEvent, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import { AUTOMATION_MODES, type AutomationMode } from "./automation.ts";
import type { AutomationLane } from "./AutomationLane.tsx";

const HIT = 44;
const NAMES: Record<AutomationMode, string> = { off: "Off", read: "Read" };

/** Props for {@linkcode AutomationModePicker}. */
export interface AutomationModePickerProps extends Omit<ViewProps, "children"> {
  /** Committed lane mode from the engine. */
  readonly mode: AutomationMode;
  /**
   * Once per press, arrow key or screen-reader selection of a different
   * mode. The picker keeps showing `mode` until the app passes a new one.
   */
  readonly onModeCommit: (mode: AutomationMode) => void | Promise<unknown>;
  /** Visible group name and accessible name. @default "Automation" */
  readonly label?: string;
  /** @default false */
  readonly disabled?: boolean;
  className?: string;
  unstyled?: boolean;
}

/**
 * Controlled radio group for an {@linkcode AutomationLane}'s mode: Off (the
 * fader or pan control sets the value) or Read (the lane's points do). Tab
 * reaches the checked option; Left/Right or Up/Down move and commit.
 *
 * Write, touch and latch are not drawn: they record fader moves while the
 * transport plays, and the Cadence engine contract has no live-transport
 * recording, so the options would do nothing.
 */
export function AutomationModePicker({
  mode, onModeCommit, label = "Automation", disabled = false, className, unstyled = false, style, ...rest
}: AutomationModePickerProps) {
  const styled = !unstyled;
  const refs = useRef<Partial<Record<AutomationMode, ComponentRef<typeof Pressable> | null>>>({});
  const choose = (next: AutomationMode, focus = false) => {
    if (disabled) return;
    if (focus) refs.current[next]?.focus?.();
    if (next !== mode) void onModeCommit(next);
  };
  const onKeyDown = (e: KeyDownEvent) => {
    const key = e.nativeEvent.key;
    const dir = key === "ArrowRight" || key === "ArrowDown" ? 1 : key === "ArrowLeft" || key === "ArrowUp" ? -1 : 0;
    if (dir === 0) return;
    e.preventDefault();
    const i = AUTOMATION_MODES.indexOf(mode);
    choose(AUTOMATION_MODES[(i + dir + AUTOMATION_MODES.length) % AUTOMATION_MODES.length]!, true);
  };
  return <View {...rest} {...{ className: joinClasses("gap-1", className) }} style={style}>
    <Text {...{ className: joinClasses(styled && "text-text-muted text-sm") }}>{label}</Text>
    <View accessibilityRole="radiogroup" accessibilityLabel={label} accessibilityState={{ disabled }}
      {...{ className: joinClasses(styled && "rounded-control border border-border bg-surface-sunken") }}
      style={{ flexDirection: "row", alignSelf: "flex-start", padding: 2, gap: 2, opacity: disabled ? 0.45 : 1 }}>
      {AUTOMATION_MODES.map(m => {
        const on = m === mode;
        return <Pressable key={m} ref={r => { refs.current[m] = r; }}
          accessibilityRole="radio" accessibilityLabel={NAMES[m]} accessibilityState={{ checked: on, disabled }} {...(Platform.OS === "web" ? {"aria-checked":on,"aria-disabled":disabled} : {})}
          focusable={!disabled && on} disabled={disabled} onPress={() => choose(m)} onKeyDown={onKeyDown}
          {...{ className: joinClasses(styled && "rounded-control items-center justify-center focus-visible:ring-2 focus-visible:ring-focus active:opacity-80",
            styled && (on ? "bg-primary" : "bg-transparent")) }}
          style={{ minWidth: 64, minHeight: HIT, paddingHorizontal: 14 }}>
          <Text {...{ className: joinClasses(styled && "font-semibold", styled && (on ? "text-on-primary" : "text-text")) }}>{NAMES[m]}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}
