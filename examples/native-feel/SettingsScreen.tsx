import { Text, View } from "react-native";
import { useStore } from "zustand";
import { Button } from "@nyc-tron/ui/components/Button";
import { TextField } from "@nyc-tron/ui/components/TextField";
import { SegmentedControl } from "@nyc-tron/ui/components/SegmentedControl";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { ReferenceCard, ReferencePage, StatusLine } from "./ScreenParts";
import type { ReferenceModel, ReferenceRoute } from "./reference-model";

const routes = [{ value: "library", label: "Library" }, { value: "editor", label: "Editor" }, { value: "media", label: "Media" }] as const;
export function SettingsScreen({ model }: { model: ReferenceModel }) {
  const state = useStore(model.store, value => value);
  const scheme = state.preferences.appearance === "system" ? undefined : state.preferences.appearance;
  const dirty = JSON.stringify(state.preferences) !== JSON.stringify(state.savedPreferences);
  return <ReferencePage testID="reference-settings" title="Settings" eyebrow="YOUR WORKSPACE"
    description="A few choices that make this space feel like yours.">
    <AdaptiveColumns gap={28} testID="reference-settings-columns">
      <AdaptiveColumns.Item minWidth={320} grow={1.4}>
        <ReferenceCard>
          <Text accessibilityRole="header" {...{ className: "text-lg font-semibold text-text" }}>Workspace preferences</Text>
          <TextField id="reference-workspace-name" label="Workspace name" value={state.preferences.name}
            onChangeText={name => model.editPreferences({ name })} errorText={state.preferenceError}
            helperText="Shown in the workspace header after you save." onSubmitEditing={model.savePreferences} />
          <NativeDropdown label="Start in" value={state.preferences.start} colorScheme={scheme} options={routes}
            onValueChange={start => model.editPreferences({ start: start as ReferenceRoute })} />
          <View style={{ gap: 10 }}>
            <Text accessibilityRole="header" {...{ className: "text-base font-semibold text-text" }}>Appearance</Text>
            <Text {...{ className: "text-sm leading-relaxed text-text-muted" }}>System follows your device. A chosen appearance applies throughout this workspace.</Text>
            <SegmentedControl aria-label="Workspace appearance" value={state.preferences.appearance}
              options={[{ value: "system", label: "System" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
              onChange={appearance => model.editPreferences({ appearance })} style={{ alignSelf: "stretch" }} />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <Button title="Save settings" onPress={model.savePreferences} />
            <Button title="Reset settings" variant="ghost" disabled={!dirty && !state.preferenceError} onPress={model.resetPreferences} />
          </View>
          <StatusLine testID="reference-settings-status">{state.preferenceStatus}</StatusLine>
        </ReferenceCard>
      </AdaptiveColumns.Item>
      <AdaptiveColumns.Item minWidth={260}>
        <ReferenceCard>
          <Text accessibilityRole="header" {...{ className: "text-lg font-semibold text-text" }}>Saved preferences</Text>
          <View style={{ gap: 8 }}>
            <Text {...{ className: "text-xs font-semibold tracking-wide text-text-muted" }}>WORKSPACE</Text>
            <Text testID="reference-saved-workspace" {...{ className: "text-xl font-semibold text-text" }}>{state.savedPreferences.name}</Text>
          </View>
          <Text {...{ className: "text-sm leading-relaxed text-text-muted" }}>
            Opens in {routes.find(route => route.value === state.savedPreferences.start)?.label ?? "Library"}. Appearance: {state.savedPreferences.appearance}.
          </Text>
          <Button title="Open starting workspace" variant="secondary" onPress={() => model.navigate(state.savedPreferences.start)} />
          <Text {...{ className: "text-xs leading-relaxed text-text-muted" }}>This reference keeps edits locally for the session. Reloading starts a fresh workspace.</Text>
        </ReferenceCard>
      </AdaptiveColumns.Item>
    </AdaptiveColumns>
  </ReferencePage>;
}
