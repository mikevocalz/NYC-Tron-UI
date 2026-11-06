import { useId } from "react";
import { Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import { webToggleProps } from "../toggle-a11y.ts";
import type { Audibility, audibility } from "./mixer.ts";

const HIT = 44;

/** Props for {@linkcode SoloMuteButtons}. */
export interface SoloMuteButtonsProps extends Omit<ViewProps, "children"> {
  /** Channel name used in the accessible names, e.g. `"Mute Bass"`. */
  readonly label: string;
  /** Committed mute state. */
  readonly muted: boolean;
  /** Committed solo state. */
  readonly solo: boolean;
  /**
   * Whether the channel is heard, from {@linkcode audibility}. Pass it so a
   * channel silenced by another channel's solo shows that state on its mute
   * button. @default derived from `muted` alone
   */
  readonly audibility?: Audibility;
  /** Once per press with the requested mute state. */
  readonly onMutedCommit: (muted: boolean) => void | Promise<unknown>;
  /** Once per press with the requested solo state. */
  readonly onSoloCommit: (solo: boolean) => void | Promise<unknown>;
  /** Committed solo-safe state. @default false */
  readonly soloSafe?: boolean;
  /**
   * Once per press with the requested solo-safe state. When given, a third
   * toggle named `"Solo safe <label>"` is drawn under mute and solo.
   */
  readonly onSoloSafeCommit?: (safe: boolean) => void | Promise<unknown>;
  /** @default "row" */
  readonly direction?: "row" | "column";
  /** @default false */
  readonly disabled?: boolean;
  className?: string;
  unstyled?: boolean;
}

/**
 * Controlled mute and solo toggles for one channel. Each press requests the
 * opposite of the committed state through its commit callback; the buttons
 * keep showing the props until the app passes new ones.
 *
 * States: mute on, solo on, solo safe on, and "silent while another
 * channel is soloed", drawn as a dashed outline on the mute button. A
 * solo-safe channel keeps sounding under another channel's solo unless it
 * is muted (see {@linkcode audibility}). Group solo and mute live in
 * `MixGroupBar`.
 */
export function SoloMuteButtons({
  label, muted, solo, audibility, onMutedCommit, onSoloCommit, soloSafe = false, onSoloSafeCommit,
  direction = "row", disabled = false,
  className, unstyled = false, style, ...rest
}: SoloMuteButtonsProps) {
  const styled = !unstyled;
  const silenced = audibility === "silenced-by-solo";
  const hintId = useId();
  const hint = silenced && !muted ? "Silent while another channel is soloed" : undefined;
  // React Native Web drops accessibilityHint; describe the button by id there.
  const webHint = Platform.OS === "web" && hint !== undefined;
  const base = "rounded-control items-center justify-center focus-visible:ring-2 focus-visible:ring-focus active:opacity-80";
  const box = { minWidth: HIT, minHeight: HIT, borderWidth: 2, opacity: disabled ? 0.45 : 1 };
  const muteClass = joinClasses(styled && base, styled && (muted
    ? "bg-primary border-primary"
    : silenced ? "border-text-muted bg-surface-sunken" : "border-border bg-surface-sunken"));
  const soloClass = joinClasses(styled && base, styled && (solo ? "bg-accent border-accent" : "border-border bg-surface-sunken"));
  const muteText = joinClasses(styled && "font-semibold", styled && (muted ? "text-on-primary" : silenced ? "text-text-muted" : "text-text"));
  const soloText = joinClasses(styled && "font-semibold", styled && (solo ? "text-surface-raised" : "text-text"));
  const safeClass = joinClasses(styled && base, styled && (soloSafe ? "bg-text-muted border-text-muted" : "border-border bg-surface-sunken"));
  const safeText = joinClasses(styled && "font-semibold", styled && (soloSafe ? "text-surface-raised" : "text-text"));
  const withSafe = onSoloSafeCommit !== undefined;
  return <View {...rest} {...{ className: joinClasses("gap-1", className) }}
    style={[{ flexDirection: withSafe ? "column" : direction }, style]}>
    <View style={{ flexDirection: direction, gap: 4 }}>
    <Pressable accessibilityRole="togglebutton" accessibilityLabel={"Mute " + label}
      accessibilityState={{ checked: muted, disabled }} {...webToggleProps(muted)}
      accessibilityHint={hint} {...(webHint ? { "aria-describedby": hintId } : {})}
      disabled={disabled} onPress={() => { void onMutedCommit(!muted); }}
      {...{ className: muteClass }}
      style={[box, silenced && !muted ? { borderStyle: "dashed" } : null]}>
      <Text {...{ className: muteText }}>M</Text>
    </Pressable>
    <Pressable accessibilityRole="togglebutton" accessibilityLabel={"Solo " + label}
      accessibilityState={{ checked: solo, disabled }} {...webToggleProps(solo)}
      disabled={disabled} onPress={() => { void onSoloCommit(!solo); }}
      {...{ className: soloClass }} style={box}>
      <Text {...{ className: soloText }}>S</Text>
    </Pressable>
    </View>
    {withSafe ? <Pressable accessibilityRole="togglebutton" accessibilityLabel={"Solo safe " + label}
      accessibilityState={{ checked: soloSafe, disabled }} {...webToggleProps(soloSafe)}
      disabled={disabled} onPress={() => { void onSoloSafeCommit(!soloSafe); }}
      {...{ className: safeClass }} style={[box, { paddingHorizontal: 8 }]}>
      <Text {...{ className: safeText }}>Safe</Text>
    </Pressable> : null}
    {webHint ? <Text nativeID={hintId}
      style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 }}>{hint}</Text> : null}
  </View>;
}
