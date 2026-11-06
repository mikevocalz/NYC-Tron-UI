import { AppRegistry, Text, TextInput, View } from "react-native";
import { create } from "zustand";
import { TabBar } from "@nyc-tron/ui/components/TabBar";
import { Button } from "@nyc-tron/ui/components/Button";
import { AssetBrowser } from "@nyc-tron/ui/components/shell/AssetBrowser";
import { HistoryPanel } from "@nyc-tron/ui/components/shell/HistoryPanel";
import { FindReplacePopover } from "@nyc-tron/ui/components/shell/FindReplacePopover";
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
const useDemo = create<Demo>(() => ({ tab: "assets", cursor: 2, revision: 1, text: snapshots[2]!, open: false, selection: { start: 0, end: 0 },
  selected: [], location: "root", opened: "", lastAction: "", jobs: [{ id: "export", title: "Fixture export", status: "running", progress: .25, actions: ["pause", "cancel"] }],
  toasts: Array.from({ length: 4 }, (_, index) => ({ id: String(index), title: `Notification ${index + 1}`, tone: "info" as const })),
}));
function Fixture() {
  const state = useDemo();
  const document = { id: "notes", revision: String(state.revision) };
  const entries = state.location === "root" ? files : files.filter(item => item.mediaType === "audio/wav");
  return <View {...{ className: "bg-surface text-text" }} style={{ width: "100%", maxWidth: 640, padding: 16, gap: 12 }}>
    <TabBar tabs={["assets", "history", "find", "jobs"].map(key => ({ key, label: key[0]!.toUpperCase() + key.slice(1), active: state.tab === key, onPress: () => useDemo.setState({ tab: key }) }))}/>
    {state.tab === "assets" ? <AssetBrowser testID="assets" locationId={state.location} revision="catalog-1" entries={entries}
      path={state.location === "root" ? [{ id: "root", label: "Library" }] : [{ id: "root", label: "Library" }, { id: "audio", label: "Audio" }]}
      selectedIds={state.selected} selectionMode="multiple" onSelectionChange={selected => useDemo.setState({ selected })}
      onOpen={request => { if (request.entry.kind === "folder") useDemo.setState({ location: "audio", selected: [] }); else useDemo.setState({ opened: request.entry.id }); }}
      onNavigate={location => useDemo.setState({ location, selected: [] })}/> : null}
    {state.tab === "history" ? <HistoryPanel testID="history" documentId="notes" revision={String(state.revision)} cursor={state.cursor}
      entries={[{ id: "first", label: "Add greeting" }, { id: "second", label: "Add NYC-Tron" }]}
      onJump={request => {
        const current = useDemo.getState();
        if (request.expectedRevision !== String(current.revision)) throw Error("The document changed");
        useDemo.setState({ cursor: request.cursor, text: snapshots[request.cursor]!, revision: current.revision + 1 });
      }}/> : null}
    {state.tab === "find" ? <View style={{ gap: 12 }}>
      <TextInput accessibilityLabel="Document text" multiline value={state.text} selection={state.selection}
        onChangeText={text => useDemo.setState(current => ({ text, revision: current.revision + 1 }))}
        {...{ className: "border border-border bg-surface-sunken text-text" }} style={{ minHeight: 100, padding: 8 }}/>
      <FindReplacePopover document={document} open={state.open} onOpenChange={open => useDemo.setState({ open })}
        trigger={({ toggle, triggerProps }) => <Button title="Find and replace" onPress={toggle} {...triggerProps}/>} initialQuery="world"
        onFind={query => findLiteralText(useDemo.getState().text, query)}
        onNavigate={(_document, match) => useDemo.setState({ selection: { start: match.start, end: match.end } })}
        onReplace={request => {
          const current = useDemo.getState();
          const text = replaceLiteralText({ id: "notes", revision: String(current.revision), text: current.text }, request);
          useDemo.setState({ text, revision: current.revision + 1, lastAction: request.kind });
        }}/>
    </View> : null}
    {state.tab === "jobs" ? <ToastAndProgress scope="fixture" toasts={state.toasts} jobs={state.jobs}
      onDismissToast={id => useDemo.setState(current => ({ toasts: current.toasts.filter(item => item.id !== id) }))}
      onJobAction={(id, action) => useDemo.setState(current => ({ lastAction: action, jobs: current.jobs.map(job => job.id !== id ? job : action === "pause" ? { ...job, status: "paused", actions: ["resume", "cancel"] }
        : action === "resume" ? { ...job, status: "running", actions: ["pause", "cancel"] } : action === "cancel" ? { ...job, status: "cancelled", actions: ["retry"] }
          : { ...job, status: "queued", progress: 0, actions: ["cancel"] }) }))}/> : null}
    <Text testID="consumer-state" {...{ className: "text-text-muted" }}>{JSON.stringify({ text: state.text, cursor: state.cursor, selected: state.selected, location: state.location, opened: state.opened, action: state.lastAction, selection: state.selection })}</Text>
  </View>;
}
const query = new URLSearchParams(location.search);
document.documentElement.dataset.theme = query.get("theme") ?? "light";
document.documentElement.dir = query.get("dir") === "rtl" ? "rtl" : "ltr";
const dir = document.documentElement.dir as "ltr" | "rtl";
AppRegistry.registerComponent("ShellConsumers", () => () => <View {...{ dir }} style={{ flex: 1 }}><Fixture/></View>);
AppRegistry.runApplication("ShellConsumers", { rootTag: document.getElementById("root") });
