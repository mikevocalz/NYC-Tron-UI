import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { useStore } from "zustand";
import { Button } from "@nyc-tron/ui/components/Button";
import { TextField } from "@nyc-tron/ui/components/TextField";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";
import { ErrorMessage } from "@nyc-tron/ui/components/feedback/ErrorMessage";
import { NativeSliderField } from "@nyc-tron/expo-controls/NativeSliderField";
import { ReferenceCard, ReferencePage, StatusLine } from "./ScreenParts";
import type { ReferenceModel } from "./reference-model";

export function MediaDetailScreen({ model, active }: { model: ReferenceModel; active: boolean }) {
  const state = useStore(model.store, value => value);
  useEffect(() => { if (active && model.store.getState().media.status === "empty") void model.loadFrame(0); }, [active, model, state.media.status]);
  const scheme = state.preferences.appearance === "system" ? undefined : state.preferences.appearance;
  const { media } = state;
  const frame = media.frame;
  const maximumMs = Math.max(1, Math.floor((frame?.durationUs ?? 1_000_000) / 1000) - 1);
  return <ReferencePage testID="reference-media" title="Motion study" eyebrow="FRAME REVIEW"
    description="Inspect a decoded frame and leave a note at that point in the clip.">
    <AdaptiveColumns gap={28} testID="reference-media-columns">
      <AdaptiveColumns.Item minWidth={320} grow={1.5}>
        <ReferenceCard>
          <View testID="reference-media-surface" style={{ aspectRatio: 4 / 3, minHeight: 180, justifyContent: "center", alignItems: "center", overflow: "hidden" }}
            {...{ className: "rounded-sm border border-border bg-surface-sunken" }}>
            {frame ? <Image accessibilityLabel={`Decoded frame at ${(frame.actualTimeUs / 1_000_000).toFixed(3)} seconds`}
              source={{ uri: frame.uri }} resizeMode="contain" style={{ width: "100%", height: "100%" }} /> :
              <Text style={{ padding: 24 }} {...{ className: "text-sm text-text-muted" }}>The frame preview appears here.</Text>}
            {media.status === "loading" ? <View style={{ position: "absolute", padding: 12, gap: 8, alignItems: "center" }}
              {...{ className: "rounded-sm bg-surface-raised" }}>
              <ActivityIndicator accessibilityLabel="Decoding frame" /><StatusLine>Opening frame…</StatusLine>
            </View> : null}
          </View>
          <ErrorMessage message={media.error} />
          {media.status === "error" ? <Button title="Try frame again" onPress={() => { void model.loadFrame(); }} /> : null}
          <NativeSliderField label="Review position" value={Math.min(maximumMs, Math.round(media.requestedUs / 1000))}
            min={0} max={maximumMs} step={1} unit="ms" colorScheme={scheme}
            disabled={!frame || media.status === "loading"} onCommit={timeMs => { void model.loadFrame(Math.round(timeMs) * 1000); }} />
          <StatusLine testID="reference-frame-status">{media.status === "ready" && frame
            ? `Frame ready at ${(frame.actualTimeUs / 1_000_000).toFixed(3)} s · ${frame.width} × ${frame.height}`
            : media.status === "error" ? "The frame is unavailable. Your note is still here." : "Waiting for a decoded frame."}</StatusLine>
          <Text {...{ className: "text-xs leading-relaxed text-text-muted" }}>
            {frame?.timing === "presentation" ? "Time comes from the decoded frame's presentation timestamp." : "Time follows the browser's settled seek target."}
            {" "}This is frame review, with no playback clock running in the background.
          </Text>
        </ReferenceCard>
      </AdaptiveColumns.Item>
      <AdaptiveColumns.Item minWidth={280}>
        <ReferenceCard>
          <Text accessibilityRole="header" {...{ className: "text-lg font-semibold text-text" }}>Review note</Text>
          <TextField id="reference-review-note" label="Note for this frame" value={state.note} multiline maxLength={1000}
            onChangeText={note => model.store.setState({ note, noteError: undefined, noteStatus: "You have an unsaved note." })}
            errorText={state.noteError} helperText="Save a note against the frame currently shown." />
          <Button title="Save review note" disabled={media.status !== "ready"} onPress={model.saveNote} />
          <StatusLine testID="reference-note-status">{state.noteStatus}</StatusLine>
          {state.savedNote ? <View style={{ paddingTop: 16, borderTopWidth: 1, gap: 8 }} {...{ className: "border-border" }}>
            <Text {...{ className: "text-xs font-semibold tracking-wide text-text-muted" }}>SAVED AT {((state.savedTimeUs ?? 0) / 1_000_000).toFixed(3)} S</Text>
            <Text selectable testID="reference-saved-note" {...{ className: "text-base leading-relaxed text-text" }}>{state.savedNote}</Text>
          </View> : null}
          <Text {...{ className: "text-xs leading-relaxed text-text-muted" }}>{model.mediaLabel}. The sample contains generated test imagery; notes stay in this session.</Text>
        </ReferenceCard>
      </AdaptiveColumns.Item>
    </AdaptiveColumns>
  </ReferencePage>;
}
