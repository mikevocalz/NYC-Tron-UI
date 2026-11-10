import { Profiler, useEffect, useRef, type ProfilerOnRenderCallback, type ReactNode } from "react";
import { I18nManager, Platform, Text, View, useColorScheme, useWindowDimensions } from "react-native";
import { useStore } from "zustand";
import { resolveNavigationShell, type NavigationInput } from "@nyc-tron/core/navigation";
import { AdaptivePaneHost } from "@nyc-tron/panes/AdaptivePaneHost";
import { TabBar } from "@nyc-tron/ui/components/TabBar";
import { NavigationRail, NavigationShell } from "@nyc-tron/ui/components/NavigationRail";
import { NightScope } from "@nyc-tron/ui/components/theme/NightScope";
import { SettingsScreen } from "./SettingsScreen";
import { LibraryDetailScreen } from "./LibraryDetailScreen";
import { EditorInspectorScreen } from "./EditorInspectorScreen";
import { MediaDetailScreen } from "./MediaDetailScreen";
import { createReferenceModel, type ReferenceModelOptions, type ReferenceRoute } from "./reference-model";
import type { DemoAppearance } from "./AccountScreen";

export interface ReferenceRenderSample {
  route: ReferenceRoute;
  phase: "mount" | "update" | "nested-update";
  durationMs: number;
  commitTime: number;
}
export interface ReferenceAppProps extends ReferenceModelOptions {
  /** Verified host capability. Native hosts must not derive this from width. */
  navigation?: NavigationInput;
  /** Development profiling only. actualDuration is React render work, not frame presentation. */
  onRenderSample?: (sample: ReferenceRenderSample) => void;
  onAppearanceChange?: (appearance: DemoAppearance) => void;
  /** A native host can supply its actual SwiftUI/Compose rail. */
  renderNativeRail?: (props: { selectedId: ReferenceRoute; onSelect: (id: ReferenceRoute) => void }) => ReactNode;
}
const destinations = [
  { id: "library", label: "Library" }, { id: "editor", label: "Editor" },
  { id: "media", label: "Media" }, { id: "settings", label: "Settings" },
] as const;

/** Shared workspace. All route children remain mounted; the app store owns selection and drafts. */
export function ReferenceApp({ navigation, onRenderSample, onAppearanceChange, renderNativeRail, ...initial }: ReferenceAppProps) {
  const local = useRef<ReturnType<typeof createReferenceModel> | null>(null);
  local.current ??= createReferenceModel(initial);
  const model = local.current;
  const route = useStore(model.store, state => state.route);
  const name = useStore(model.store, state => state.savedPreferences.name);
  const appearance = useStore(model.store, state => state.preferences.appearance);
  const system = useColorScheme();
  const { width } = useWindowDimensions();
  const scheme = appearance === "system" ? system ?? "light" : appearance;
  const input: NavigationInput = navigation ?? { runtime: Platform.OS === "web" ? "web" : "native", family: "unknown" };
  const shell = resolveNavigationShell({ ...input, compactWeb: input.runtime === "web" ? width < 640 : input.compactWeb });
  const rtl = input.isRTL ?? I18nManager.isRTL;
  useEffect(() => { model.start(); return model.dispose; }, [model]);
  useEffect(() => { onAppearanceChange?.(appearance); }, [appearance, onAppearanceChange]);
  const tabs = destinations.map(item => ({ key: item.id, label: item.label, active: route === item.id, onPress: () => model.navigate(item.id) }));
  const profile: ProfilerOnRenderCallback = (_id, phase, durationMs, _base, _start, commitTime) => {
    onRenderSample?.({ route: model.store.getState().route, phase, durationMs, commitTime });
  };
  const panels = <View testID="reference-route-host" style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
    {destinations.map(item => <View key={item.id} testID={`reference-panel-${item.id}`}
      style={{ flex: 1, minWidth: 0, minHeight: 0, display: route === item.id ? "flex" : "none" }}
      accessibilityElementsHidden={route !== item.id} importantForAccessibility={route === item.id ? "auto" : "no-hide-descendants"}>
      {item.id === "library" ? <LibraryDetailScreen model={model} /> : item.id === "editor" ? <EditorInspectorScreen model={model} /> :
        item.id === "media" ? <MediaDetailScreen model={model} active={route === "media"} /> : <SettingsScreen model={model} />}
    </View>)}
  </View>;
  // The host supplies an already safe region. This pane owner keeps the detail
  // subtree stable and can be replaced by a host's existing Master/Detail shell.
  const content = <AdaptivePaneHost testID="reference-pane-host" master={null} detail={panels}
    masterConfig={{ present: false, minWidth: 280, preferredWidth: 320 }} detailConfig={{ minWidth: 280 }}
    isRTL={rtl} style={{ flex: 1, minHeight: 0, minWidth: 0 }} detailClassName="bg-surface-sunken" />;
  const rightRail = shell.kind === "physical-right-rail";
  const bottomTabs = shell.kind === "bottom-tabs" || shell.kind === "web-header" && shell.compactTabs;
  return <NightScope scheme={scheme}><Profiler id="reference-workspace" onRender={profile}>
    <View testID="reference-app" style={{ flex: 1, minWidth: 0, minHeight: 0 }} {...{ className: "bg-surface-sunken" }}>
      <View testID="reference-header" style={{ minHeight: 72, paddingHorizontal: 24, paddingVertical: 12, gap: 16, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}
        {...{ className: "border-b border-border bg-surface-raised" }}>
        <View style={{ flexGrow: 1, gap: 3 }}>
          <Text testID="reference-workspace-title" {...{ className: "text-lg font-semibold text-text" }}>{name}</Text>
          <Text {...{ className: "text-xs text-text-muted" }}>A personal workspace</Text>
        </View>
        {!rightRail && !bottomTabs ? <TabBar aria-label="Workspace" tabs={tabs} density="compact" /> : null}
      </View>
      {rightRail ? <NavigationShell edge="right" isRTL={rtl} style={{ minHeight: 0 }}
        rail={renderNativeRail?.({ selectedId: route, onSelect: model.navigate }) ?? <NavigationRail testID="reference-right-rail" edge="right" items={destinations} selectedId={route}
          onSelectionChange={id => model.navigate(id as ReferenceRoute)} style={{ width: 104 }} />}>
        {content}
      </NavigationShell> : content}
      {bottomTabs ? <TabBar testID="reference-bottom-tabs" aria-label="Workspace" tabs={tabs} /> : null}
      {(shell.kind === "windows-drawer" || shell.kind === "macos-sidebar") ?
        <Text {...{ className: "p-3 text-sm text-text-muted" }}>This reference requires the host's native desktop navigation adapter.</Text> : null}
    </View>
  </Profiler></NightScope>;
}
