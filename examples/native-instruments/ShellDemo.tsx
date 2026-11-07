import { Text, TextInput, View } from "react-native";
import { useRef } from "react";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { TabBar } from "@nyc-tron/ui/components/TabBar";
import { Button } from "@nyc-tron/ui/components/Button";
import { AssetBrowser } from "@nyc-tron/ui/components/shell/AssetBrowser";
import { HistoryPanel } from "@nyc-tron/ui/components/shell/HistoryPanel";
import { FindReplacePopover } from "@nyc-tron/expo-controls/FindReplacePopover";
import { ToastAndProgress } from "@nyc-tron/ui/components/shell/ToastAndProgress";
import { findLiteralText, replaceLiteralText } from "@nyc-tron/ui/components/shell/find-replace-model";
import type { AssetEntry } from "@nyc-tron/ui/components/shell/asset-browser-model";
import type { ProgressJob, ToastMessage } from "@nyc-tron/ui/components/shell/progress-model";
const files: readonly AssetEntry[] = [
  { id: "folder", name: "Audio", kind: "folder" },
  { id: "take10", name: "Take 10.wav", kind: "file", mediaType: "audio/wav", byteLength: 2048 },
  { id: "take2", name: "Take 2.wav", kind: "file", mediaType: "audio/wav", byteLength: 1024 },
  { id: "poster", name: "Poster.png", kind: "file", mediaType: "image/png" },
];
const snapshots = ["Hello", "Hello world", "Hello world. World of NYC-Tron."];
interface Demo {
  tab: string; cursor: number; revision: number; text: string; open: boolean; selection: { start: number; end: number };
  selected: readonly string[]; location: string; opened: string; jobs: readonly ProgressJob[]; toasts: readonly ToastMessage[]; lastAction: string;
}
const createDemo = () => createStore<Demo>(() => ({ tab: "assets", cursor: 2, revision: 1, text: snapshots[2]!, open: false, selection: { start: 0, end: 0 },
  selected: [], location: "root", opened: "", lastAction: "", jobs: [{ id: "export", title: "Fixture export", status: "running", progress: .25, actions: ["pause", "cancel"] }],
  toasts: Array.from({ length: 4 }, (_, index) => ({ id: String(index), title: `Notification ${index + 1}`, tone: "info" as const })),
}));
export function ShellDemo({ height = 700 }: { readonly height?: number }) {
  const local = useRef<ReturnType<typeof createDemo> | null>(null);
  local.current ??= createDemo();
  const store = local.current;
  const state = useStore(store, value => value);
  const document = { id: "notes", revision: String(state.revision) };
  const entries = state.location === "root" ? files : files.filter(item => item.mediaType === "audio/wav");
  const diagnostic = JSON.stringify({ text: state.text, cursor: state.cursor, selected: state.selected, location: state.location, opened: state.opened, action: state.lastAction, selection: state.selection });
  return <View {...{ className: "bg-surface text-text" }} style={{ width: "100%", maxWidth: 640, padding: 16, gap: 12 }}>
    <TabBar tabs={["assets", "history", "find", "jobs"].map(key => ({ key, label: key[0]!.toUpperCase() + key.slice(1), active: state.tab === key, onPress: () => store.setState({ tab: key }) }))}/>
    {state.tab === "assets" ? <AssetBrowser height={Math.max(44, height - 240)} testID="assets" locationId={state.location} revision="catalog-1" entries={entries}
      path={state.location === "root" ? [{ id: "root", label: "Library" }] : [{ id: "root", label: "Library" }, { id: "audio", label: "Audio" }]}
      selectedIds={state.selected} selectionMode="multiple" onSelectionChange={selected => store.setState({ selected })}
      onOpen={request => { if (request.entry.kind === "folder") store.setState({ location: "audio", selected: [] }); else store.setState({ opened: request.entry.id }); }}
      onNavigate={location => store.setState({ location, selected: [] })}/> : null}
    {state.tab === "history" ? <HistoryPanel height={Math.max(44, height - 380)} testID="history" documentId="notes" revision={String(state.revision)} cursor={state.cursor}
      entries={[{ id: "first", label: "Add greeting" }, { id: "second", label: "Add NYC-Tron" }]}
      onJump={request => {
        const current = store.getState();
        if (request.expectedRevision !== String(current.revision)) throw Error("The document changed");
        store.setState({ cursor: request.cursor, text: snapshots[request.cursor]!, revision: current.revision + 1 });
      }}/> : null}
    {state.tab === "find" ? <View style={{ gap: 12 }}>
      <TextInput accessibilityLabel="Document text" multiline value={state.text} selection={state.selection}
        onChangeText={text => store.setState(current => ({ text, revision: current.revision + 1 }))}
        {...{ className: "border border-border bg-surface-sunken text-text" }} style={{ minHeight: 100, padding: 8 }}/>
      <FindReplacePopover document={document} open={state.open} onOpenChange={open => store.setState({ open })}
        trigger={({ toggle, triggerProps }) => <Button title="Find and replace" onPress={toggle} {...triggerProps}/>} initialQuery="world"
        onFind={query => findLiteralText(store.getState().text, query)}
        onNavigate={(_document, match) => store.setState({ selection: { start: match.start, end: match.end } })}
        onReplace={request => {
          const current = store.getState();
          const text = replaceLiteralText({ id: "notes", revision: String(current.revision), text: current.text }, request);
          store.setState({ text, revision: current.revision + 1, lastAction: request.kind });
        }}/>
    </View> : null}
    {state.tab === "jobs" ? <ToastAndProgress height={Math.max(44, height - 240)} scope="fixture" toasts={state.toasts} jobs={state.jobs}
      onDismissToast={id => store.setState(current => ({ toasts: current.toasts.filter(item => item.id !== id) }))}
      onJobAction={(id, action) => store.setState(current => ({ lastAction: action, jobs: current.jobs.map((job): ProgressJob => {
        if (job.id !== id) return job;
        const { error: _previousFailure, ...base } = job;
        return action === "pause" ? { ...base, status: "paused", actions: ["resume", "cancel"] }
          : action === "resume" ? { ...base, status: "running", actions: ["pause", "cancel"] }
          : action === "cancel" ? { ...base, status: "cancelled", actions: ["retry"] }
          : { ...base, status: "queued", progress: 0, actions: ["cancel"] };
      }) }))}/> : null}
    <Text accessibilityLabel={`Consumer document state: ${diagnostic}`} numberOfLines={3} testID="consumer-state" {...{ className: "text-text-muted" }}>{diagnostic}</Text>
  </View>;
}
