import { useEffect, useRef, useSyncExternalStore, type ComponentRef } from 'react';
import { Text as NativeText, View, ScrollView, Pressable, useColorScheme, type GestureResponderEvent } from 'react-native';
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
import { createMenu } from '@nyc-tron/macos-appkit/menus';
import { showContextMenu } from '@nyc-tron/macos-appkit/context-menu';
import { Tooltip } from '@nyc-tron/macos-appkit/tooltip';
import { AnchoredInspector } from '@nyc-tron/macos-appkit/anchored-inspector';
import type { ControlRef } from '@legendapp/spark/ui';
import type { LayoutSnapshot } from '@nyc-tron/core/window-lifecycle';
import type { Rect2D } from '@nyc-tron/core/overlays';

type Appearance = 'system' | 'light' | 'dark';
interface Document { title: string; savedTitle: string; collection: string }
interface ResponderProbe {
  ins: number; moves: number; outs: number; presses: number; active: boolean;
  point?: { x: number; y: number }; measured?: Rect2D;
}
const emptyProbe: ResponderProbe = { ins: 0, moves: 0, outs: 0, presses: 0, active: false };
interface InspectorState { open: boolean; anchor: Rect2D; region: Rect2D; responder: ResponderProbe }
const closedInspector: InspectorState = { open: false, anchor: { x: 0, y: 0, width: 0, height: 0 }, region: { x: 0, y: 0, width: 0, height: 0 }, responder: emptyProbe };
interface AppState {
  documents: Record<string, Document>;
  selected: string;
  appearance: Appearance;
  status: string;
  ready: boolean;
  owner: string;
  inspectors: Record<string, InspectorState>;
  layout?: LayoutSnapshot;
}
// One app-owned document store shared by every registered React root. Window
// props carry identity, never a second document copy or a new undo session.
const store = createStore<AppState>(() => ({
  documents: { welcome: { title: 'A place for focused work', savedTitle: 'A place for focused work', collection: 'studio' } },
  selected: 'document', appearance: 'system', status: 'Opening native workspace', ready: false, owner: 'main', inspectors: {},
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
  if (!boot) boot = host.attach('main').then(async () => {
    await createMenu({ id: 'nyc-tron-reference', items: [{ type: 'submenu', id: 'workspace-menu', label: 'Workspace', items: [
      { type: 'action', id: 'menu-save', label: 'Save local changes', shortcut: 'Cmd+S' },
      { type: 'action', id: 'menu-open', label: 'Open document window' },
      { type: 'action', id: 'menu-disabled', label: 'Unavailable command', disabled: true },
    ] }], onAction: action => {
      if (action.itemId === 'menu-save') save();
      else if (action.itemId === 'menu-open') void openDocument().catch(fail);
    } });
    store.setState({ ready: true, status: 'Native workspace ready' });
  });
  return boot;
};
const dragType = 'application/x-nyctron-document-reference';
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
function updateInspector(windowId: string, patch: Partial<InspectorState>) {
  const inspectors = store.getState().inspectors;
  store.setState({ inspectors: { ...inspectors, [windowId]: { ...(inspectors[windowId] ?? closedInspector), ...patch } } });
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
    source={owner === windowId ? { data: { [dragType]: JSON.stringify({ nonce: dragNonce, sourceId: windowId, documentId: 'welcome' }) } } : undefined}
    sourceOperations={['move']} acceptedTypes={[dragType]} acceptedOperations={['move']} onError={fail}
    onDragEnter={event => {
      let value: { nonce?: string; sourceId?: string; documentId?: string };
      try { value = JSON.parse(event.data?.[dragType] ?? 'null'); } catch { return; }
      if (!value || value.nonce !== dragNonce || value.documentId !== 'welcome' || !value.sourceId || value.sourceId === windowId || store.getState().owner !== value.sourceId) return;
      const active = host.getSnapshot().drag;
      const token = active?.sourceId === value.sourceId ? active.token : host.beginDrag(value.sourceId, { documentId: 'welcome' }).token;
      if (token) { host.dragOver(token, windowId); store.setState({ status: `Document move offered to ${windowId}` }); }
    }}
    onDragLeave={() => { const drag = host.getSnapshot().drag; if (drag?.targetId === windowId) host.dragOver(drag.token, null); }}
    onDrop={async event => {
      let value: { nonce?: string; sourceId?: string; documentId?: string };
      try { value = JSON.parse(event.data?.[dragType] ?? 'null'); } catch { return; }
      const drag = host.getSnapshot().drag;
      if (!value || value.nonce !== dragNonce || !drag || drag.sourceId !== value.sourceId || value.documentId !== 'welcome' || store.getState().owner !== value.sourceId) return;
      const result = await host.drop(drag.token, windowId, offer => {
        const { documents, owner } = store.getState();
        return offer.targetId !== offer.sourceId && owner === offer.sourceId && documents.welcome.title === documents.welcome.savedTitle;
      });
      if (result.transfer) store.setState({ owner: result.transfer.targetId, status: `Document moved to ${result.transfer.targetId}` });
      else store.setState({ status: 'Move blocked: save the document before moving ownership' });
    }}
    onDragEnd={event => {
      const drag = host.getSnapshot().drag;
      if (drag?.sourceId === windowId && (!event.accepted || (drag.phase === 'dragging' && !drag.targetId))) {
        host.cancelDrag(drag.token); store.setState({ status: 'Native document drag canceled' });
      }
    }}>
    <Text testID={`owner-${windowId}`} accessibilityLabel={`Document owner: ${owner}`} selectable>Drag the saved document from its owner window. Current owner: {owner}.</Text>
  </DragDropView>;
}

function DocumentEditor({ windowId }: { windowId: string }) {
  const document = useStore(store, s => s.documents.welcome);
  const contextTrigger = useRef<ControlRef | null>(null);
  const contextGeneration = useRef(0);
  const inspectorTrigger = useRef<ControlRef | null>(null);
  const responderTarget = useRef<ComponentRef<typeof Pressable> | null>(null);
  const inspectorGeneration = useRef(0);
  const inspector = useStore(store, state => state.inspectors[windowId] ?? closedInspector);
  const recordResponder = (phase: 'in' | 'move' | 'out' | 'press', event: GestureResponderEvent) => {
    const previous = store.getState().inspectors[windowId]?.responder ?? emptyProbe;
    const next = { ...previous, point: { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY } };
    if (phase === 'in') { next.ins++; next.active = true; }
    else if (phase === 'move') next.moves++;
    else if (phase === 'out') { next.outs++; next.active = false; }
    else next.presses++;
    updateInspector(windowId, { responder: next });
    if (phase === 'in') {
      const generation = inspectorGeneration.current;
      responderTarget.current?.measure((_x, _y, width, height, x, y) => {
        if (generation !== inspectorGeneration.current || !store.getState().inspectors[windowId]?.open) return;
        const current = store.getState().inspectors[windowId]?.responder ?? emptyProbe;
        updateInspector(windowId, { responder: { ...current, measured: { x, y, width, height } } });
      });
    }
  };
  useEffect(() => () => { contextGeneration.current++; }, []);
  useEffect(() => () => { inspectorGeneration.current++; updateInspector(windowId, { open: false }); }, [windowId]);
  const measureInspector = (opening: boolean) => {
    const generation = ++inspectorGeneration.current;
    inspectorTrigger.current?.measureInWindow((x, y, width, height) => {
      if (generation !== inspectorGeneration.current || ![x, y, width, height].every(Number.isFinite)) return;
      updateInspector(windowId, { anchor: { x, y, width, height }, ...(opening ? { open: true } : {}) });
      if (opening) store.setState({ status: 'Native inspector opened' });
    });
  };
  useEffect(() => {
    if (inspector.open) measureInspector(false);
  }, [windowId, inspector.open, inspector.region.x, inspector.region.y, inspector.region.width, inspector.region.height]);
  const openContextMenu = () => {
    const generation = ++contextGeneration.current;
    contextTrigger.current?.measureInWindow((x, y, width, height) => {
      if (generation !== contextGeneration.current || ![x, y, width, height].every(Number.isFinite)) return;
      void showContextMenu({ windowId, position: { x, y: y + height }, items: [
        { type: 'action', id: 'context-save', label: 'Save local changes' },
        { type: 'action', id: 'context-disabled', label: 'Unavailable command', disabled: true },
      ] }).then(result => {
        if (generation !== contextGeneration.current) return;
        if (result.canceled) store.setState({ status: 'Native context menu dismissed' });
        else if (result.itemId === 'context-save') save();
      }).catch(fail);
    });
  };
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
      <Tooltip testID={`tooltip-${windowId}`} label="Save this document's local checkpoint">
        <Button testID={`save-${windowId}`} onPress={save} onError={fail}>Save local changes</Button>
      </Tooltip>
      <Button testID={`open-${windowId}`} onPress={() => { void openDocument().catch(fail); }} onError={fail}>Open document window</Button>
      <Button ref={contextTrigger} testID={`context-${windowId}`} onPress={openContextMenu} onError={fail}>Document actions</Button>
      <Button ref={inspectorTrigger} testID={`inspect-${windowId}`} onPress={() => measureInspector(true)} onError={fail}>Inspect document</Button>
    </View>
    {/* The native popover must not inherit this declaration site's page offset. */}
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 160, top: 96, width: 1, height: 1 }}>
    <AnchoredInspector testID={`inspector-${windowId}`} scope={`welcome:${windowId}`} open={inspector.open}
      onOpenChange={open => { updateInspector(windowId, { open }); store.setState({ status: open ? 'Native inspector opened' : 'Native inspector dismissed' }); }}
      onPresentationRejected={() => store.setState({ status: 'Inspector cannot fit in the available area; resize the window and try again' })}
      accessibilityLabel="Document inspector" anchor={inspector.anchor} usableRegions={[inspector.region]} width={320} maxHeight={300}>
      <View style={{ padding: 12, gap: 8 }}>
        <Text accessibilityRole="header" style={{ fontSize: 18, fontWeight: '600' }}>Document inspector</Text>
        <TextField testID={`inspector-title-${windowId}`} accessibilityLabel="Inspector document title" value={document.title}
          style={{ width: '100%', height: 34 }} onChangeText={setTitle} onError={fail} />
        <Button testID={`inspector-save-${windowId}`} onPress={save} onError={fail}>Save local changes</Button>
        <Button testID={`inspector-close-${windowId}`} onPress={() => { updateInspector(windowId, { open: false }); store.setState({ status: 'Inspector closed' }); }} onError={fail}>Close inspector</Button>
        <View onTouchMove={event => recordResponder('move', event)}>
          <Pressable ref={responderTarget} testID={`inspector-react-${windowId}`} accessibilityRole="button" accessibilityLabel="Confirm inspector action"
            onPressIn={event => recordResponder('in', event)} onPressOut={event => recordResponder('out', event)} onPress={event => recordResponder('press', event)}
            style={{ height: 36, borderWidth: 1, borderColor: '#9b9b95', alignItems: 'center', justifyContent: 'center' }}>
            <Text>Confirm inspector action</Text>
          </Pressable>
        </View>
        <Text testID={`inspector-react-report-${windowId}`} accessibilityLabel={JSON.stringify(inspector.responder)} style={{ fontSize: 11 }}>
          React action confirmed {inspector.responder.presses} times
        </Text>
      </View>
    </AnchoredInspector>
    </View>
    <View testID={`saved-${windowId}`} style={{ padding: 16, borderRadius: 4, borderWidth: 1, borderColor: '#9b9b95', gap: 8 }}>
      <Text style={{ fontWeight: '600' }}>Local checkpoint</Text><Text selectable>{document.savedTitle}</Text>
      <Text selectable>{document.title === document.savedTitle ? 'All changes saved' : 'Unsaved changes protect this window from closing'}</Text>
    </View>
    <NativeDrop windowId={windowId} />
  </View>;
}
function Surface({ windowId, main }: { windowId: string; main: boolean }) {
  const root = useRef<View | null>(null);
  const measureRegion = () => root.current?.measureInWindow((x, y, width, height) => {
    if ([x, y, width, height].every(Number.isFinite)) updateInspector(windowId, { region: { x, y, width, height } });
  });
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
  // The split view must fit the narrowest window this reference supports: the
  // 460 point document minimum, which the pointer acceptance also uses for two
  // side-by-side windows. 180 + divider + 260 fits; the former 320 content
  // minimum needed 501 points, more than an arranged 500 point window.
  return <View ref={root} testID={`root-${windowId}`} onLayout={measureRegion} style={{ flex: 1 }}>
    {main ? <SplitView style={{ flex: 1 }} appearance={appearance} sidebarWidth={220} sidebarMinWidth={180} contentMinWidth={260}
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
