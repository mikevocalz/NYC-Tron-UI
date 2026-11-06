/**
 * Plugin preset browser (roster E-23).
 *
 * Structural references pulled from Mobbin (structure only; Mobbin has no
 * GarageBand, BandLab, Logic Remote, Koala or Ableton Note screens, so these
 * are the closest matches it returned):
 * - Shopify, category picker: search field above a single-choice radio list.
 * - Oura, Soundscapes: sound list with the current choice checked in place.
 * - Brink, Genres filter: search field plus a list of single-line rows with radio marks.
 * - Discord, Soundboard: "Find the perfect sound" search above a sound grid.
 */
import { useRef } from "react";
import { I18nManager, Platform, Pressable, Text, TextInput, View, type KeyDownEvent, type ViewProps } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { joinClasses } from "../../styles.ts";
import { useStatusAnnouncement } from "../announce.ts";
import { INSERT_KIND_LABELS, filterPresets, type InsertKind, type InsertPreset } from "./inserts.ts";

const HIT = 44;

/** Load state of the preset list passed to {@linkcode PluginPresetBrowser}. */
export type PresetListStatus = "loading" | "error" | "ready";

/** Props for {@linkcode PluginPresetBrowser}. */
export interface PluginPresetBrowserProps extends Omit<ViewProps, "children"> {
  /** Effect type whose presets are listed. Names the heading and the list. */
  readonly kind: InsertKind;
  /** Presets for `kind`, factory first, in display order. */
  readonly presets: readonly InsertPreset[];
  /** Preset the slot was last set from. Marked as the checked radio. */
  readonly currentId?: string;
  /**
   * Once per press or arrow key with the chosen preset. Pressing the
   * current preset applies it again, which resets parameters edited since.
   * A rejected promise leaves `currentId` unchanged on screen.
   */
  readonly onApply: (presetId: string) => void | Promise<unknown>;
  /** @default "ready" */
  readonly status?: PresetListStatus;
  /** Shown as a Retry button when `status` is `"error"`. */
  readonly onRetry?: () => void;
  /** @default false */
  readonly disabled?: boolean;
  className?: string;
  /** Drop the default token recipe; supply a full app recipe via `className`. */
  unstyled?: boolean;
}

/**
 * Controlled preset list for one insert effect, with a label search.
 * Presets are radios in one group: press to apply, or move with the arrow
 * keys, which applies each preset reached so it can be heard in place.
 * Loading and error states say what is happening; nothing is listed while
 * presets load.
 */
export function PluginPresetBrowser({
  kind, presets, currentId, onApply, status = "ready", onRetry, disabled = false,
  className, unstyled = false, ...rest
}: PluginPresetBrowserProps) {
  const styled = !unstyled;
  const local = useRef<StoreApi<{ query: string }> | null>(null);
  if (!local.current) local.current = createStore(() => ({ query: "" }));
  const store = local.current;
  const query = useStore(store, s => s.query);
  const refs = useRef(new Map<string, { focus?: () => void } | null>());
  const name = INSERT_KIND_LABELS[kind];
  const shown = filterPresets(presets, query);
  const statusText = status === "loading" ? `Loading ${name} presets` : status === "error" ? `${name} presets could not be loaded` : "";
  useStatusAnnouncement(statusText);

  const apply = (id: string) => { if (!disabled) void onApply(id); };
  const onKeyDown = (e: KeyDownEvent) => {
    const key = e.nativeEvent.key;
    const rtl = I18nManager.isRTL || (Platform.OS === "web" && typeof document !== "undefined" && document.documentElement.dir === "rtl");
    const dir = key === "ArrowDown" || key === (rtl ? "ArrowLeft" : "ArrowRight") ? 1
      : key === "ArrowUp" || key === (rtl ? "ArrowRight" : "ArrowLeft") ? -1 : 0;
    if (dir === 0 || disabled || shown.length === 0) return;
    e.preventDefault();
    const at = shown.findIndex(p => p.id === currentId);
    const next = shown[at < 0 ? (dir > 0 ? 0 : shown.length - 1) : (at + dir + shown.length) % shown.length];
    apply(next.id);
    refs.current.get(next.id)?.focus?.();
  };

  const muted = joinClasses(styled && "text-text-muted text-sm");
  const body = joinClasses(styled && "text-text");
  const checkedVisible = shown.some(p => p.id === currentId);
  let content;
  if (status === "loading") {
    content = <Text accessibilityLiveRegion="polite" {...{ className: muted }} style={{ paddingVertical: 12 }}>{statusText}…</Text>;
  } else if (status === "error") {
    content = <View style={{ gap: 8, paddingVertical: 8, alignItems: "flex-start" }}>
      <Text accessibilityLiveRegion="polite" {...{ className: body }}>{`${statusText}. The effect keeps its current settings.`}</Text>
      {onRetry ? <Pressable role="button" accessibilityLabel={`Retry loading ${name} presets`} onPress={onRetry}
        {...{ className: joinClasses(styled && "rounded-control border border-border bg-surface-sunken items-center justify-center focus-visible:ring-2 focus-visible:ring-focus active:opacity-80") }}
        style={{ minHeight: HIT, paddingHorizontal: 16 }}>
        <Text {...{ className: joinClasses(styled && "text-text font-semibold") }}>Retry</Text>
      </Pressable> : null}
    </View>;
  } else if (presets.length === 0) {
    content = <Text {...{ className: muted }} style={{ paddingVertical: 12 }}>{`No presets for ${name} yet.`}</Text>;
  } else {
    content = <>
      <TextInput value={query} onChangeText={q => store.setState({ query: q })}
        accessibilityLabel={`Search ${name} presets`} placeholder="Search presets"
        autoCorrect={false} autoCapitalize="none" editable={!disabled} {...{ inputMode: "search" }}
        {...{ className: joinClasses(styled && "rounded-control border border-border bg-surface-sunken text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-focus") }}
        style={{ minHeight: HIT, paddingHorizontal: 12, fontSize: 16, opacity: disabled ? 0.45 : 1 }} />
      {shown.length === 0
        ? <View style={{ gap: 8, alignItems: "flex-start", paddingVertical: 4 }}>
            <Text accessibilityLiveRegion="polite" {...{ className: body }}>{`No ${name} presets match "${query.trim()}".`}</Text>
            <Pressable role="button" onPress={() => store.setState({ query: "" })}
              {...{ className: joinClasses(styled && "rounded-control border border-border items-center justify-center focus-visible:ring-2 focus-visible:ring-focus active:opacity-80") }}
              style={{ minHeight: HIT, paddingHorizontal: 16 }}>
              <Text {...{ className: joinClasses(styled && "text-text font-semibold") }}>Clear search</Text>
            </Pressable>
          </View>
        : <View accessibilityLabel={`${name} presets`} {...{ role: "radiogroup" }}>
            {shown.map((preset, i) => {
              const checked = preset.id === currentId;
              const tabStop = checked || (!checkedVisible && i === 0);
              return <Pressable key={preset.id} ref={r => { refs.current.set(preset.id, r); }}
                role="radio" aria-checked={checked} accessibilityState={{ checked, disabled }}
                accessibilityLabel={preset.label} disabled={disabled} focusable={tabStop && !disabled}
                {...(Platform.OS === "web" ? { tabIndex: tabStop && !disabled ? 0 : -1 } : {})}
                onPress={() => apply(preset.id)} onKeyDown={onKeyDown}
                {...{ className: joinClasses(styled && "rounded-control focus-visible:ring-2 focus-visible:ring-focus active:opacity-80",
                  styled && checked && "bg-surface-sunken") }}
                style={{ minHeight: HIT, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 10, opacity: disabled ? 0.45 : 1 }}>
                <View pointerEvents="none" style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" }}
                  {...{ className: joinClasses(styled && (checked ? "border-primary" : "border-text-muted")) }}>
                  {checked ? <View style={{ width: 10, height: 10, borderRadius: 5 }} {...{ className: joinClasses(styled && "bg-primary") }} /> : null}
                </View>
                <Text numberOfLines={1} style={{ flex: 1 }} {...{ className: joinClasses(styled && "text-text", styled && checked && "font-semibold") }}>{preset.label}</Text>
                {checked ? <Text {...{ className: muted }}>Current</Text> : null}
              </Pressable>;
            })}
          </View>}
    </>;
  }
  return <View {...rest} accessibilityLabel={`${name} preset browser`} {...{ role: "group" }}
    {...{ className: joinClasses(styled && "rounded-card border border-border bg-surface-raised", className) }}
    style={[{ padding: 12, gap: 10 }, rest.style]}>
    <Text role="heading" {...{ "aria-level": 3 }} {...{ className: joinClasses(styled && "text-text font-semibold text-base") }}>{`${name} presets`}</Text>
    {content}
  </View>;
}
