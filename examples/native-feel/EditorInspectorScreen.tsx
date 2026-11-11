import { Text, View } from "react-native";
import { useStore } from "zustand";
import { Button } from "@nyc-tron/ui/components/Button";
import { TextField } from "@nyc-tron/ui/components/TextField";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";
import { InspectorPanel } from "@nyc-tron/ui/components/shell/InspectorPanel";
import { InspectorSection } from "@nyc-tron/ui/components/shell/InspectorSection";
import { PropertyRow } from "@nyc-tron/ui/components/shell/PropertyRow";
import { ErrorMessage } from "@nyc-tron/ui/components/feedback/ErrorMessage";
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { NativeSliderField } from "@nyc-tron/expo-controls/NativeSliderField";
import { ReferenceCard, ReferencePage, StatusLine } from "./ScreenParts";
import type { CoverDocument, ReferenceModel } from "./reference-model";

export function EditorInspectorScreen({ model }: { model: ReferenceModel }) {
  const state = useStore(model.store, value => value);
  const scheme = state.preferences.appearance === "system" ? undefined : state.preferences.appearance;
  const modified = JSON.stringify(state.document) !== JSON.stringify(state.savedDocument);
  return <ReferencePage testID="reference-editor" title="Quiet forms" eyebrow="DESIGN STUDY / 01"
    description="Work on the cover while its properties stay close. Your draft stays with you as the space changes."
    actions={<Button title="Save cover" onPress={model.saveDocument} />}>
    <AdaptiveColumns gap={28} testID="reference-editor-columns">
      <AdaptiveColumns.Item minWidth={320} grow={1.5} testID="reference-canvas-column">
        <ReferenceCard>
          <View testID="reference-cover-preview" style={{ minHeight: 350, padding: 28, justifyContent: "space-between", gap: 44 }}
            {...{ className: "rounded-sm bg-primary" }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
              <Text {...{ className: "text-xs font-semibold tracking-widest text-on-primary" }}>FIELD NOTES</Text>
              <Text {...{ className: "text-xs text-on-primary" }}>VOL. 01</Text>
            </View>
            <View style={{ gap: 18, opacity: (state.opacityPreview ?? state.document.opacity) / 100 }}>
              <Text testID="reference-cover-headline" style={{ textAlign: state.document.alignment }}
                {...{ className: "text-4xl font-semibold leading-tight text-on-primary" }}>{state.document.headline || "Add a headline"}</Text>
              <Text style={{ textAlign: state.document.alignment }} {...{ className: "text-base leading-relaxed text-on-primary" }}>{state.document.subtitle}</Text>
            </View>
            <Text {...{ className: "text-xs font-medium tracking-wide text-on-primary" }}>A STUDY IN SPACE AND TYPE</Text>
          </View>
          <ErrorMessage message={state.documentError} />
          <StatusLine testID="reference-cover-status">{state.documentStatus}</StatusLine>
          <Button title="Restore saved cover" variant="ghost" onPress={model.resetDocument} disabled={!modified && !state.documentError} />
        </ReferenceCard>
      </AdaptiveColumns.Item>
      <AdaptiveColumns.Item minWidth={300} testID="reference-inspector-column">
        <View style={{ minHeight: 570, overflow: "hidden" }} {...{ className: "rounded-sm border border-border bg-surface-raised" }}>
          <InspectorPanel testID="reference-inspector" scope="reference-cover" selection={{ kind: "single", title: "Cover properties", detail: "Live preview · local session" }}
            query={state.inspectorQuery} onQueryChange={inspectorQuery => model.store.setState({ inspectorQuery })}>
            <InspectorSection title="Typography" expanded={state.typographyExpanded}
              onExpandedChange={typographyExpanded => model.store.setState({ typographyExpanded })}>
              <PropertyRow label="Headline" stackBelow={600}>
                {({ disabled }) => <TextField id="reference-headline" testID="reference-headline" label="Cover headline" value={state.document.headline} maxLength={100}
                  returnKeyType="done" submitBehavior="blurAndSubmit"
                  editable={!disabled} onChangeText={headline => model.editDocument({ headline })} errorText={state.documentError} />}
              </PropertyRow>
              <PropertyRow label="Supporting text" keywords={["subtitle"]} stackBelow={600}>
                {({ disabled }) => <TextField id="reference-subtitle" label="Cover subtitle" value={state.document.subtitle}
                  multiline maxLength={240} editable={!disabled} onChangeText={subtitle => model.editDocument({ subtitle })} />}
              </PropertyRow>
            </InspectorSection>
            <InspectorSection title="Composition" expanded={state.compositionExpanded}
              onExpandedChange={compositionExpanded => model.store.setState({ compositionExpanded })}>
              <PropertyRow label="Alignment" stackBelow={600}>
                {({ disabled }) => <NativeDropdown label="Text alignment" value={state.document.alignment} disabled={disabled} colorScheme={scheme}
                  options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]}
                  onValueChange={alignment => model.editDocument({ alignment: alignment as CoverDocument["alignment"] })} />}
              </PropertyRow>
              <PropertyRow label="Opacity" keywords={["contrast", "transparency"]} stackBelow={600}>
                {({ disabled }) => <NativeSliderField label="Text opacity" value={state.document.opacity} min={10} max={100} step={1}
                  defaultValue={100} unit="%" disabled={disabled} colorScheme={scheme}
                  onPreview={model.previewOpacity} onCommit={opacity => model.editDocument({ opacity })} />}
              </PropertyRow>
            </InspectorSection>
          </InspectorPanel>
        </View>
      </AdaptiveColumns.Item>
    </AdaptiveColumns>
  </ReferencePage>;
}
