import { useRef } from "react";
import { ScrollView, Text, View, useColorScheme, useWindowDimensions } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { Button } from "@nyc-tron/ui/components/Button";
import { TextField } from "@nyc-tron/ui/components/TextField";
import { SegmentedControl } from "@nyc-tron/ui/components/SegmentedControl";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";
import { NightScope } from "@nyc-tron/ui/components/theme/NightScope";
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";

export type DemoAppearance = "system" | "light" | "dark";
type Workspace = "studio" | "library" | "projects";
type Preferences = { displayName: string; workspace: Workspace; appearance: DemoAppearance };
type AccountState = {
  draft: Preferences;
  saved: Preferences;
  nameError?: string;
  saveStatus: string;
};

export interface AccountScreenProps {
  /** Initial values only; the mounted screen owns this demo's draft. */
  initialAppearance?: DemoAppearance;
  initialDisplayName?: string;
}

const workspaces = [
  { value: "studio", label: "Studio" },
  { value: "library", label: "Library" },
  { value: "projects", label: "Projects" },
] as const;
const appearances = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

/**
 * Shared screen recipe. The app supplies its tokens and platform shell.
 * Save changes this instance's local preview; it makes no network request.
 */
export function AccountScreen({
  initialAppearance = "system", initialDisplayName = "Alex Morgan",
}: AccountScreenProps) {
  const local = useRef<StoreApi<AccountState> | null>(null);
  if (!local.current) {
    const initial = { displayName: initialDisplayName, workspace: "studio" as const, appearance: initialAppearance };
    local.current = createStore<AccountState>(() => ({
      draft: { ...initial }, saved: { ...initial }, saveStatus: "Ready to save in this demo session.",
    }));
  }
  const store = local.current;
  const state = useStore(store, value => value);
  const systemScheme = useColorScheme();
  const { fontScale } = useWindowDimensions();
  const scale = Number.isFinite(fontScale) ? Math.max(1, fontScale) : 1;
  const scheme = state.draft.appearance === "system" ? systemScheme ?? "light" : state.draft.appearance;
  const nativeScheme = state.draft.appearance === "system" ? undefined : state.draft.appearance;
  const dirty = state.draft.displayName !== state.saved.displayName ||
    state.draft.workspace !== state.saved.workspace || state.draft.appearance !== state.saved.appearance;
  const workspaceLabel = workspaces.find(item => item.value === state.saved.workspace)?.label;
  const appearanceLabel = appearances.find(item => item.value === state.saved.appearance)?.label;

  const edit = (patch: Partial<Preferences>) => {
    const current = store.getState();
    const draft = { ...current.draft, ...patch };
    const changed = draft.displayName !== current.saved.displayName ||
      draft.workspace !== current.saved.workspace || draft.appearance !== current.saved.appearance;
    store.setState({
      draft, nameError: undefined,
      saveStatus: changed ? "You have unsaved changes." : "Your saved preferences are unchanged.",
    });
  };
  const save = () => {
    const draft = store.getState().draft;
    const displayName = draft.displayName.trim();
    if (!displayName) {
      store.setState({ nameError: "Enter a display name before saving.", saveStatus: "Your changes have not been saved." });
      return;
    }
    const saved = { ...draft, displayName };
    store.setState({ draft: saved, saved, nameError: undefined, saveStatus: "Preferences saved for this demo session." });
  };
  const reset = () => store.setState({
    draft: { ...store.getState().saved }, nameError: undefined, saveStatus: "Restored your last saved preferences.",
  });

  return <NightScope scheme={scheme}>
    <View testID="native-feel-surface" style={{ flex: 1, minWidth: 0 }}
      {...{ className: "bg-surface-sunken" }}>
    <ScrollView testID="native-feel-screen" keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, minWidth: 0 }}
      contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
      <ContentFrame maxWidth={1024} style={{ gap: 36 }}>
        <View style={{ gap: 10, paddingTop: 16 }}>
          <Text {...{ className: "text-xs font-semibold tracking-widest text-text-muted" }}>PERSONAL PREFERENCES</Text>
          <Text accessibilityRole="header" {...{ className: "text-4xl font-semibold text-text" }}>Account</Text>
          <Text style={{ maxWidth: 560 }}
            {...{ className: "text-base leading-relaxed text-text-muted" }}>
            Make this space yours. Choose your name, starting workspace and appearance.
          </Text>
        </View>

        <AdaptiveColumns gap={32} testID="native-feel-columns">
          <AdaptiveColumns.Item minWidth={320 * scale} grow={1.5} testID="native-feel-profile">
            <ContentFrame maxWidth={560} align="start" style={{ gap: 28 }}>
              <View style={{ gap: 18 }}>
                <Text accessibilityRole="header" {...{ className: "text-lg font-semibold text-text" }}>Your profile</Text>
                <TextField id="native-feel-display-name" label="Display name" value={state.draft.displayName}
                  onChangeText={displayName => edit({ displayName })} autoComplete="name"
                  onSubmitEditing={save} returnKeyType="done"
                  helperText="The name shown in your workspace."
                  errorText={state.nameError} />
                <NativeDropdown label="Default workspace" value={state.draft.workspace}
                  options={workspaces} colorScheme={nativeScheme}
                  onValueChange={workspace => edit({ workspace: workspace as Workspace })} />
              </View>

              <View style={{ gap: 12 }}>
                <Text nativeID="native-feel-appearance-label" accessibilityRole="header"
                  {...{ className: "text-lg font-semibold text-text" }}>Appearance</Text>
                <Text {...{ className: "text-sm leading-relaxed text-text-muted" }}>
                  Follow your device or choose a look for this screen. Changes appear immediately.
                </Text>
                <SegmentedControl options={appearances} value={state.draft.appearance}
                  onChange={appearance => edit({ appearance })}
                  aria-label="Appearance" style={{ alignSelf: "stretch" }} />
              </View>

              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  <Button title="Save preferences" onPress={save} />
                  <Button title="Reset changes" variant="ghost" onPress={reset} disabled={!dirty && !state.nameError} />
                </View>
                <Text testID="native-feel-save-status" role="status" accessibilityLiveRegion="polite"
                  {...{ className: "text-sm leading-relaxed text-text-muted" }}>{state.saveStatus}</Text>
                <Text {...{ className: "text-xs leading-relaxed text-text-muted" }}>
                  Local demo only. Preferences stay in this screen until you close or reload it.
                </Text>
              </View>
            </ContentFrame>
          </AdaptiveColumns.Item>

          <AdaptiveColumns.Item minWidth={280 * scale} testID="native-feel-preview">
            <View style={{ padding: 24, gap: 24 }}
              {...{ className: "rounded-control border border-border bg-surface-raised" }}>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <Text accessibilityRole="header" style={{ flexGrow: 1 }}
                    {...{ className: "text-lg font-semibold text-text" }}>Profile preview</Text>
                  <Text {...{ className: "text-xs font-medium text-text-muted" }}>LOCAL DEMO</Text>
                </View>
                <Text {...{ className: "text-sm leading-relaxed text-text-muted" }}>
                  Your saved preferences, all in one place.
                </Text>
              </View>
              <View style={{ gap: 8, paddingVertical: 8 }}>
                <Text {...{ className: "text-xs font-medium text-text-muted" }}>DISPLAY NAME</Text>
                <Text selectable testID="native-feel-saved-name"
                  {...{ className: "text-2xl font-semibold text-text" }}>{state.saved.displayName}</Text>
              </View>
              <View style={{ borderTopWidth: 1, paddingTop: 20, gap: 20 }} {...{ className: "border-border" }}>
                <View style={{ gap: 6 }}>
                  <Text {...{ className: "text-xs font-medium text-text-muted" }}>DEFAULT WORKSPACE</Text>
                  <Text selectable {...{ className: "text-base font-medium text-text" }}>{workspaceLabel}</Text>
                </View>
                <View style={{ gap: 6 }}>
                  <Text {...{ className: "text-xs font-medium text-text-muted" }}>SAVED APPEARANCE</Text>
                  <Text selectable {...{ className: "text-base font-medium text-text" }}>{appearanceLabel}</Text>
                </View>
              </View>
            </View>
          </AdaptiveColumns.Item>
        </AdaptiveColumns>
      </ContentFrame>
    </ScrollView>
    </View>
  </NightScope>;
}
