import { useEffect, useSyncExternalStore } from 'react';
import { Text as NativeText, View, ScrollView, useColorScheme } from 'react-native';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { Sidebar } from '@nyc-tron/macos-appkit/sidebar';
import { SplitView } from '@nyc-tron/macos-appkit/split-view';
import { Button } from '@nyc-tron/macos-appkit/button';
import { TextField } from '@nyc-tron/macos-appkit/text-field';
import { Select } from '@nyc-tron/macos-appkit/select';
import { SegmentedControl } from '@nyc-tron/macos-appkit/segmented-control';
import { DragDropView } from '@nyc-tron/macos-appkit/drag-drop';
import { createMacOSWindowHost } from '@nyc-tron/macos-appkit/windows';
import type { LayoutSnapshot } from '@nyc-tron/core/window-lifecycle';

type Appearance = 'system' | 'light' | 'dark';
interface Document { title: string; savedTitle: string; collection: string }
interface AppState {
  documents: Record<string, Document>;
  selected: string;
  appearance: Appearance;
  status: string;
  ready: boolean;
  owner: string;
  layout?: LayoutSnapshot;
}
// One app-owned document store shared by every registered React root. Window
// props carry identity, never a second document copy or a new undo session.
const store = createStore<AppState>(() => ({
  documents: { welcome: { title: 'A place for focused work', savedTitle: 'A place for focused work', collection: 'studio' } },
  selected: 'document', appearance: 'system', status: 'Opening native workspace', ready: false, owner: 'main',
}));
const fail = (error: unknown) => store.setState({ status: `Error: ${error instanceof Error ? error.message : String(error)}` });
const host = createMacOSWindowHost({
  beforeClose: id => {
    const doc = store.getState().documents.welcome;
    const allow = doc.title === doc.savedTitle;
    if (!allow) store.setState({ status: `Close blocked: save the document before closing ${id}` });
    return allow;
  },
  onError: fail,
});
let boot: Promise<void> | undefined;
const start = () => {
  if (!boot) boot = host.attach('main').then(() => { store.setState({ ready: true, status: 'Native workspace ready' }); });
  return boot;
};
const dragType = 'org.nyctron.appkit.document-reference';
// Native drag payload is an app-scoped reference. Document truth stays here.
const dragNonce = `reference-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function Text(props: React.ComponentProps<typeof NativeText>) {
  const appearance = useStore(store, state => state.appearance);
  const system = useColorScheme();
  const dark = (appearance === 'system' ? system : appearance) === 'dark';
  return <NativeText {...props} style={[{ color: dark ? '#f5f5ef' : '#23251e' }, props.style]} />;
}

function setAppearance(appearance: string) {
  if (!['system', 'light', 'dark'].includes(appearance)) return;
  store.setState({ appearance: appearance as Appearance });
  for (const window of host.getSnapshot().windows) void host.setOptions(window.id, { appearance: appearance as Appearance }).catch(fail);
}
function requestSelection(id: string | null) {
  if (id === 'locked') { store.setState({ status: 'Selection rejected: this destination is read-only' }); return; }
  if (id === 'document' || id === 'preferences') store.setState({ selected: id, status: `Selected ${id}` });
}
function setTitle(value: string) {
  if (value.includes('!')) { store.setState({ status: 'Title rejected: exclamation marks are disabled in this reference' }); return; }
  const document = store.getState().documents.welcome;
  store.setState({ documents: { welcome: { ...document, title: value } }, status: 'Unsaved document changes' });
}
function save() {
  const document = store.getState().documents.welcome;
  if (!document.title.trim()) { store.setState({ status: 'Enter a document title before saving' }); return; }
  store.setState({ documents: { welcome: { ...document, savedTitle: document.title } }, status: 'Saved in this local reference session' });
}
async function openDocument() {
  const id = 'document-1';
  if (host.getSnapshot().windows.some(w => w.id === id)) { await host.focus(id); return; }
  await host.open({ id, component: 'NYCTronDocument', props: { windowId: id, documentId: 'welcome' }, title: 'NYC-Tron · Document', size: { width: 680, height: 620 }, minSize: { width: 460, height: 420 }, appearance: store.getState().appearance });
  store.setState({ status: 'Document opened in a native window' });
}
function NativeDrop({ windowId }: { windowId: string }) {
  const owner = useStore(store, s => s.owner);
  return <DragDropView testID={`drop-${windowId}`} accessibilityLabel={`Move document to ${windowId}`}
    style={{ padding: 16, borderWidth: 1, borderColor: '#9b9b95', borderRadius: 4 }}
    source={{ data: { [dragType]: JSON.stringify({ nonce: dragNonce, sourceId: windowId, documentId: 'welcome' }) } }}
    sourceOperations={['move']} acceptedTypes={[dragType]} acceptedOperations={['move']} onError={fail}
    onDragEnter={event => {
      let value: { nonce?: string; sourceId?: string; documentId?: string };
      try { value = JSON.parse(event.data?.[dragType] ?? 'null'); } catch { return; }
      if (!value || value.nonce !== dragNonce || value.documentId !== 'welcome' || !value.sourceId || value.sourceId === windowId) return;
      const active = host.getSnapshot().drag;
      const token = active?.sourceId === value.sourceId ? active.token : host.beginDrag(value.sourceId, { documentId: 'welcome' }).token;
      if (token) host.dragOver(token, windowId);
    }}
    onDragLeave={() => { const drag = host.getSnapshot().drag; if (drag?.targetId === windowId) host.dragOver(drag.token, null); }}
    onDrop={async event => {
      let value: { nonce?: string; sourceId?: string; documentId?: string };
      try { value = JSON.parse(event.data?.[dragType] ?? 'null'); } catch { return; }
      const drag = host.getSnapshot().drag;
      if (!value || value.nonce !== dragNonce || !drag || drag.sourceId !== value.sourceId || value.documentId !== 'welcome') return;
      const result = await host.drop(drag.token, windowId, offer => offer.targetId !== offer.sourceId);
      if (result.transfer) store.setState({ owner: result.transfer.targetId, status: `Document moved to ${result.transfer.targetId}` });
    }}
    onDragEnd={event => {
      const drag = host.getSnapshot().drag;
      if (drag?.sourceId === windowId && (!event.accepted || drag.phase === 'dragging')) host.cancelDrag(drag.token);
    }}>
    <Text selectable>Drag this document between its native windows. Current owner: {owner}.</Text>
  </DragDropView>;
}

function DocumentEditor({ windowId }: { windowId: string }) {
  const document = useStore(store, s => s.documents.welcome);
  return <View style={{ gap: 14, maxWidth: 560 }}>
    <Text accessibilityRole="header" style={{ fontSize: 26, fontWeight: '600' }}>A familiar place to work</Text>
    <Text selectable>Keep one document open in two native windows. Edits, selection and the local save checkpoint stay with the app while you resize.</Text>
    <Text>Document title</Text>
    <TextField testID={`title-${windowId}`} accessibilityLabel="Document title" style={{ width: '100%', height: 34 }} value={document.title} onChangeText={setTitle} onError={fail} />
    <Text>Collection</Text>
    <Select testID={`collection-${windowId}`} accessibilityLabel="Collection" value={document.collection}
      options={[{ label: 'Studio', value: 'studio' }, { label: 'Library', value: 'library' }, { label: 'Projects', value: 'projects' }]}
      onValueChange={collection => store.setState({ documents: { welcome: { ...store.getState().documents.welcome, collection } } })} onError={fail} />
    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
      <Button testID={`save-${windowId}`} onPress={save} onError={fail}>Save local changes</Button>
      <Button testID={`open-${windowId}`} onPress={() => { void openDocument().catch(fail); }} onError={fail}>Open document window</Button>
    </View>
    <View testID={`saved-${windowId}`} style={{ padding: 16, borderRadius: 4, borderWidth: 1, borderColor: '#9b9b95', gap: 8 }}>
      <Text style={{ fontWeight: '600' }}>Local checkpoint</Text><Text selectable>{document.savedTitle}</Text>
      <Text selectable>{document.title === document.savedTitle ? 'All changes saved' : 'Unsaved changes protect this window from closing'}</Text>
    </View>
    <NativeDrop windowId={windowId} />
  </View>;
}
function Surface({ windowId, main }: { windowId: string; main: boolean }) {
  const selected = useStore(store, s => s.selected);
  const appearance = useStore(store, s => s.appearance);
  const status = useStore(store, s => s.status);
  const ready = useStore(store, s => s.ready);
  const system = useColorScheme();
  const dark = (appearance === 'system' ? system : appearance) === 'dark';
  const registry = useSyncExternalStore(host.subscribe, host.getSnapshot, host.getSnapshot);
  const content = <ScrollView testID={`content-${windowId}`} style={{ flex: 1, backgroundColor: dark ? '#1e1f1d' : '#f8f8f5' }} contentContainerStyle={{ padding: 28, gap: 20 }}>
    <View style={{ gap: 16 }}>
      <Text accessibilityRole="header" style={{ color: dark ? '#f5f5ef' : '#23251e', fontSize: 14 }}>NYC-Tron / {main ? 'Workspace' : 'Document window'}</Text>
      {main && selected === 'preferences' ? <View style={{ gap: 14, maxWidth: 560 }}>
        <Text accessibilityRole="header" style={{ fontSize: 26 }}>Appearance</Text>
        <Text>Native window chrome and app content follow the same choice.</Text>
        <SegmentedControl testID="appearance" accessibilityLabel="Appearance" value={appearance}
          options={[{ label: 'System', value: 'system' }, { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]}
          onValueChange={setAppearance} onError={fail} />
      </View> : <DocumentEditor windowId={windowId} />}
      <Text testID={`status-${windowId}`} accessibilityLabel={status} selectable>{status}</Text>
      <Text testID={`windows-${windowId}`} selectable>{registry.windows.length} native windows · {ready ? 'Ready' : 'Loading'}</Text>
      {main ? <Button testID="restore-document" onPress={() => { void host.focus('document-1').catch(fail); }} disabled={!registry.windows.some(w => w.id === 'document-1')} onError={fail}>Restore document window</Button>
        : <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button testID="minimize-document" onPress={() => { void host.minimize(windowId).catch(fail); }} onError={fail}>Minimize window</Button>
          <Button testID="close-document" onPress={() => { void host.close(windowId).catch(fail); }} onError={fail}>Close window</Button>
        </View>}
      {main && <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button testID="remember-layout" onPress={() => store.setState({ layout: host.snapshot(), status: 'Window layout remembered for this session' })} onError={fail}>Remember layout</Button>
        <Button testID="restore-layout" onPress={() => {
          const saved = store.getState().layout;
          if (saved) void host.restore(saved).then(() => store.setState({ status: 'Native window layout restored' })).catch(fail);
        }} onError={fail}>Restore layout</Button>
      </View>}
    </View>
  </ScrollView>;
  return <View testID={`root-${windowId}`} style={{ flex: 1 }}>
    {main ? <SplitView style={{ flex: 1 }} appearance={appearance} sidebarWidth={220} sidebarMinWidth={180} contentMinWidth={320}
      sidebar={<Sidebar testID="navigation" accessibilityLabel="Workspace navigation" style={{ flex: 1 }} selectedId={selected}
        items={[{ id: 'document', label: 'Document' }, { id: 'preferences', label: 'Preferences' }, { id: 'locked', label: 'Protected destination' }]}
        onSelectionChange={event => requestSelection(event.id)} onError={fail} />}
      content={content} onError={fail} /> : content}
  </View>;
}
export function MainWindow() {
  useEffect(() => { void start().catch(fail); }, []);
  return <Surface windowId="main" main />;
}
export function DocumentWindow({ windowId, documentId }: { windowId: string; documentId: string }) {
  if (documentId !== 'welcome' || windowId !== 'document-1') throw new Error('Unknown app-owned document window');
  return <Surface windowId={windowId} main={false} />;
}
