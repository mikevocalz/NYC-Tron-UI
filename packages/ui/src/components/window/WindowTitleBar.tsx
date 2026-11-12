import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import {
  createWindowChromeController, describeTitleBar,
  type TitleBarControls, type WindowChromeCommand, type WindowChromeController, type WindowChromeHost,
  type WindowCommandResult, type WindowControlDescriptor, type WindowControlLabels,
} from "@nyc-tron/core/window-chrome";
import { joinClasses } from "../styles.ts";

/** Bar height and minimum hit height, in logical points. */
export const TITLE_BAR_HEIGHT = 44;
/** Hit square for each control in the `macos` drawn layout. */
export const CONTROL_TARGET = 44;
/** Hit width for each control in the `windows` drawn layout. */
export const CAPTION_TARGET_WIDTH = 48;
const GLYPH = 12;
const STROKE = 1.5;
const CHIP = 20;
const DOT = 8;

/**
 * Creates a {@linkcode WindowChromeController} for one window and disposes it
 * on unmount or when the host or window changes.
 */
export function useWindowChrome(host: WindowChromeHost, windowId: string): WindowChromeController {
  const chrome = useMemo(() => createWindowChromeController(host, windowId), [host, windowId]);
  useEffect(() => () => chrome.dispose(), [chrome]);
  return chrome;
}

/** Props for {@linkcode WindowTitleBar}. */
export interface WindowTitleBarProps {
  /** One window's controller, from {@linkcode useWindowChrome} or `createWindowChromeController`. */
  chrome: WindowChromeController;
  /** Document or window name. Empty shows "Untitled". */
  title: string;
  /**
   * `drawn` draws controls in the `macos` (leading) or `windows` (trailing)
   * layout. `native` draws none and reserves the system's insets: AppKit
   * window buttons, Windows caption buttons or iPadOS window controls.
   */
  controls: TitleBarControls;
  /** Shows the unsaved-changes dot and word, and adds ", edited" to the accessible title. */
  edited?: boolean;
  /** Localized control names. Defaults follow the layout. */
  labels?: Partial<WindowControlLabels>;
  /** Visible word next to the title while edited. @default "Edited" */
  editedLabel?: string;
  /** Announced when the app's close decision keeps the window open. @default "Window not closed." */
  closeBlockedLabel?: string;
  /** Receives every command result, including vetoed and ignored ones. */
  onCommandResult?: (result: WindowCommandResult) => void;
  /** Receives host failures. @default console.error */
  onError?: (error: unknown) => void;
  /** App content placed after the title, such as a document switcher. */
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  controlClassName?: string;
  /** Drops the token recipe; the app supplies every class. */
  unstyled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Window title bar bound to `@nyc-tron/core/window-lifecycle` through a
 * {@linkcode WindowChromeController}. Close goes through the host, so the
 * app's close decision runs before any window closes. Colours, radius and
 * type come from the app's tokens.
 */
export function WindowTitleBar({
  chrome, title, controls, edited = false, labels, editedLabel = "Edited", closeBlockedLabel = "Window not closed.",
  onCommandResult, onError, children, className, titleClassName, controlClassName, unstyled = false, style, testID,
}: WindowTitleBarProps) {
  const snapshot = useSyncExternalStore(chrome.subscribe, chrome.getSnapshot, chrome.getSnapshot);
  const blocked = useSyncExternalStore(blockedStore.subscribe, () => blockedStore.get(chrome), () => false);
  const layout = controls.kind === "drawn" ? controls.layout : undefined;
  // The controller's snapshot is the registry view for this window; lay it out once per change.
  const list = describeTitleBar(stateFor(chrome.windowId, snapshot.status, snapshot.focused), chrome.windowId,
    { controls, labels, pending: snapshot.pending, zoomed: snapshot.zoomed });
  const styled = !unstyled;
  const shown = title.trim() || "Untitled";
  const run = (command: WindowChromeCommand) => {
    blockedStore.set(chrome, false);
    chrome.run(command).then(result => {
      if (result.status === "vetoed") blockedStore.set(chrome, true);
      onCommandResult?.(result);
    }, error => { (onError ?? console.error)(error); });
  };
  const button = (control: WindowControlDescriptor) => (
    <Pressable key={control.command} testID={testID ? `${testID}-${control.command}` : undefined}
      accessibilityRole="button" accessibilityLabel={control.label}
      accessibilityState={{ disabled: !control.enabled, ...(control.pressed === undefined ? {} : { selected: control.pressed }) }}
      disabled={!control.enabled} onPress={() => run(control.command)}
      {...{ title: control.label } as object}
      {...{ className: joinClasses("items-center justify-center",
        styled && "focus-visible:ring-2 focus-visible:ring-focus active:opacity-80 motion-reduce:transition-none",
        styled && (layout === "windows" && control.command === "close" ? "hover:bg-danger" : "hover:bg-surface-raised"),
        styled && layout === "macos" && "rounded-control",
        !control.enabled && "opacity-50", controlClassName) }}
      style={{ minWidth: layout === "windows" ? CAPTION_TARGET_WIDTH : CONTROL_TARGET, minHeight: TITLE_BAR_HEIGHT }}>
      {layout === "macos"
        ? <View {...{ className: joinClasses("items-center justify-center", styled && "rounded-control border-text-muted") }} style={{ width: CHIP, height: CHIP, borderWidth: STROKE }}>
            <Glyph command={control.command} pressed={control.pressed} styled={styled} />
          </View>
        : <Glyph command={control.command} pressed={control.pressed} styled={styled} />}
    </Pressable>
  );
  const startInset = list.insets.leading, endInset = list.insets.trailing;
  return (
    <View testID={testID} accessibilityRole="toolbar" accessibilityLabel={`${shown} window controls`}
      {...{ className: joinClasses("flex-row items-center", styled && "bg-surface-sunken border-b border-border", className) }}
      style={[{ minHeight: Math.max(TITLE_BAR_HEIGHT, list.insets.height), paddingStart: startInset, paddingEnd: endInset }, style]}>
      {list.leading.length ? <View style={{ flexDirection: "row" }}>{list.leading.map(button)}</View> : null}
      <View style={{ flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8 }}>
        {edited ? <View accessible={false} {...{ className: joinClasses(styled && "border-accent") }} style={{ width: DOT, height: DOT, borderWidth: DOT / 2, borderRadius: DOT / 2 }} /> : null}
        <Text accessibilityRole="header" accessibilityLabel={edited ? `${shown}, edited` : shown} numberOfLines={1} ellipsizeMode="tail" style={{ flexShrink: 1 }}
          {...{ title: shown } as object}
          {...{ className: joinClasses(styled && "text-sm font-semibold", styled && (snapshot.focused ? "text-text" : "text-text-muted"), titleClassName) }}>{shown}</Text>
        {edited ? <Text accessible={false} numberOfLines={1} {...{ className: joinClasses(styled && "text-sm text-text-muted") }}>{editedLabel}</Text> : null}
        {children}
      </View>
      {list.trailing.length ? <View style={{ flexDirection: "row" }}>{list.trailing.map(button)}</View> : null}
      <Text accessibilityLiveRegion="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 }}>{blocked ? closeBlockedLabel : ""}</Text>
    </View>
  );
}

function stateFor(id: string, status: "open" | "minimized" | "closed", focused: boolean) {
  const rect = { x: 0, y: 0, width: 1, height: 1 };
  return {
    windows: status === "closed" ? [] : [{ id, displayId: "title-bar", rect, status }],
    focusedId: focused ? id : null, drag: null, tokenSeq: 0,
  };
}

/** Per-controller "last close was vetoed" flag, so the live region survives re-renders without component state. */
const blockedStore = (() => {
  const flags = new WeakMap<WindowChromeController, boolean>();
  const listeners = new Set<() => void>();
  return {
    get: (chrome: WindowChromeController) => flags.get(chrome) === true,
    set(chrome: WindowChromeController, value: boolean) {
      if ((flags.get(chrome) === true) === value) return;
      flags.set(chrome, value);
      for (const listener of [...listeners]) listener();
    },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  };
})();

/** Original line glyphs drawn from borders, so forced-colors mode keeps them. */
function Glyph({ command, pressed, styled }: { command: WindowChromeCommand; pressed?: boolean; styled: boolean }) {
  const bar = joinClasses(styled && "border-text-muted");
  const line = (extra: ViewStyle, key: string) => <View key={key} {...{ className: bar }} style={[{ position: "absolute", height: 0, borderTopWidth: STROKE }, extra]} />;
  const tick = (extra: ViewStyle, key: string) => <View key={key} {...{ className: bar }} style={[{ position: "absolute", width: 3, height: 3 }, extra]} />;
  let parts: ReactNode[];
  switch (command) {
    case "close":
      parts = [line({ width: 14, transform: [{ rotate: "45deg" }] }, "a"), line({ width: 14, transform: [{ rotate: "-45deg" }] }, "b")];
      break;
    case "minimize":
      parts = [line({ width: 10 }, "a")];
      break;
    case "restore":
      parts = [line({ width: 10, bottom: 1 }, "a"), <View key="b" {...{ className: bar }} style={{ position: "absolute", width: 0, height: 4, borderLeftWidth: STROKE, bottom: 2 }} />];
      break;
    case "zoom": {
      // Four corner ticks: outward marks "maximize", inward "restore down".
      const inset = pressed ? 3 : 1;
      parts = [
        tick({ top: inset, left: inset, borderTopWidth: STROKE, borderLeftWidth: STROKE }, "tl"),
        tick({ top: inset, right: inset, borderTopWidth: STROKE, borderRightWidth: STROKE }, "tr"),
        tick({ bottom: inset, left: inset, borderBottomWidth: STROKE, borderLeftWidth: STROKE }, "bl"),
        tick({ bottom: inset, right: inset, borderBottomWidth: STROKE, borderRightWidth: STROKE }, "br"),
      ];
      break;
    }
  }
  return <View pointerEvents="none" style={{ width: GLYPH, height: GLYPH, alignItems: "center", justifyContent: "center" }}>{parts}</View>;
}
