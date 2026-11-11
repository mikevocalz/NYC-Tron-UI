import { useLayoutEffect, useMemo, useRef, type ComponentRef } from "react";
import { FlatList, Image, Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Button } from "../Button.tsx";
import { Select } from "../Select.tsx";
import { ErrorMessage } from "../feedback/ErrorMessage.tsx";
import { InspectorSearch } from "./InspectorSearch.tsx";
import { shellKey } from "./shell-keys.ts";
import { useOwnedAction } from "./useOwnedAction.ts";
import { joinClasses } from "../styles.ts";
import { filterAssets, selectAsset, formatAssetBytes, assetDisplayName, type AssetEntry, type AssetLocation, type AssetRequest, type AssetSort } from "./asset-browser-model.ts";
export type { AssetEntry, AssetLocation, AssetRequest, AssetSort } from "./asset-browser-model.ts";

export interface AssetBrowserProps extends Omit<ViewProps, "children"> {
  readonly locationId: string;
  readonly revision: string;
  readonly entries: readonly AssetEntry[];
  readonly path: readonly AssetLocation[];
  readonly selectedIds: readonly string[];
  readonly selectionMode?: "single" | "multiple";
  readonly onSelectionChange: (ids: readonly string[]) => void;
  readonly onOpen: (request: AssetRequest, signal: AbortSignal) => void | Promise<void>;
  readonly onNavigate: (locationId: string, signal: AbortSignal) => void | Promise<void>;
  readonly loading?: boolean;
  readonly error?: string;
  readonly height?: number;
  readonly className?: string;
  readonly unstyled?: boolean;
}

/** Paged, controlled asset list. The app owns filesystem/catalog access and selection. */
export function AssetBrowser({ locationId, revision, entries, path, selectedIds, selectionMode = "single", onSelectionChange,
  onOpen, onNavigate, loading = false, error, height = 360, className, unstyled = false, style, ...rest }: AssetBrowserProps) {
  const multipleSelection = selectionMode === "multiple";
  if (selectionMode === "single" && selectedIds.length > 1) throw new TypeError("A single-selection asset browser accepts at most one selected ID");
  if (new Set(path.map(item => item.id)).size !== path.length || path.some(item => !item.id || !item.label.trim())) throw new TypeError("Asset locations need distinct IDs and labels");
  if (!Number.isFinite(height) || height < 44) throw new RangeError("Asset height must be at least 44");
  if (new Set(selectedIds).size !== selectedIds.length || selectedIds.some(id => !id)) throw new TypeError("Selected asset IDs must be distinct and nonempty");
  const local = useRef<StoreApi<{ query: string; sort: AssetSort; anchor: string | null; headerHeight: number }> | null>(null);
  local.current ??= createStore(() => ({ query: "", sort: "name" as AssetSort, anchor: null as string | null, headerHeight: 0 }));
  const state = useStore(local.current, value => value);
  const visible = useMemo(() => filterAssets(entries, state.query, state.sort), [entries, state.query, state.sort]);
  const action = useOwnedAction(JSON.stringify([locationId, revision]));
  const list = useRef<FlatList<AssetEntry>>(null);
  const rows = useRef(new Map<string, ComponentRef<typeof Pressable>>());
  const focusRequest = useRef<string | null>(null);
  useLayoutEffect(() => {
    focusRequest.current = null;
    local.current!.setState({ anchor: null });
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }, [locationId]);
  const busy = loading || action.pending !== null;
  const active = selectedIds.find(id => visible.some(entry => entry.id === id)) ?? visible[0]?.id;
  const selected = new Set(selectedIds);
  const styled = !unstyled;
  const open = (entry: AssetEntry) => {
    if (!busy) void action.run(`open:${entry.id}`, signal => onOpen({ locationId, expectedRevision: revision, entry }, signal));
  };
  const choose = (id: string, modifiers: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {}) => {
    if (busy) return;
    const mode = selectionMode === "single" ? "replace" : modifiers.shiftKey ? "range"
      : Platform.OS !== "web" || modifiers.ctrlKey || modifiers.metaKey ? "toggle" : "replace";
    onSelectionChange(selectAsset(visible, selectedIds, id, mode, state.anchor));
    if (mode !== "range") local.current!.setState({ anchor: id });
  };
  const key = (event: unknown, entry: AssetEntry, index: number) => {
    const k = shellKey(event);
    if (busy) return;
    if (k.key === "Enter") { k.preventDefault(); open(entry); return; }
    if (k.key === " ") { k.preventDefault(); choose(entry.id, k); return; }
    if ((k.ctrlKey || k.metaKey) && k.key.toLowerCase() === "a" && selectionMode === "multiple") {
      k.preventDefault(); onSelectionChange(visible.map(item => item.id)); return;
    }
    const next = k.key === "ArrowDown" ? Math.min(visible.length - 1, index + 1) : k.key === "ArrowUp" ? Math.max(0, index - 1)
      : k.key === "Home" ? 0 : k.key === "End" ? visible.length - 1 : null;
    if (next === null || !visible[next]) return;
    k.preventDefault(); choose(visible[next]!.id, k);
    focusRequest.current = visible[next]!.id;
    const node = rows.current.get(focusRequest.current) as unknown as { focus?: () => void } | undefined;
    if (node) { node.focus?.(); focusRequest.current = null; }
    else list.current?.scrollToIndex({ index: next, animated: false });
  };
  const header = <View style={{ gap: 8 }} onLayout={event => {
    const height = Math.ceil(event.nativeEvent.layout.height);
    if (Number.isFinite(height) && height !== local.current!.getState().headerHeight) local.current!.setState({ headerHeight: height });
  }}>
    <View accessibilityRole="toolbar" accessibilityLabel="Asset location" style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      {path.map(item => <Button key={item.id} title={item.label} disabled={busy || item.id === locationId} unstyled={unstyled}
        onPress={() => { void action.run(`navigate:${item.id}`, signal => onNavigate(item.id, signal)); }}/>) }
    </View>
    <InspectorSearch maxLength={256} query={state.query} onQueryChange={query => local.current!.setState({ query })} label="Search assets" summary={`${visible.length} assets; ${selectedIds.length} selected`} unstyled={unstyled}/>
    <Select label="Sort assets" value={state.sort} options={[{ value: "name", label: "Name" }, { value: "modified", label: "Newest" }, { value: "size", label: "Largest" }]}
      onValueChange={sort => local.current!.setState({ sort: sort as AssetSort })} disabled={busy} unstyled={unstyled}/>
  </View>;
  const footer = <View style={{ gap: 8 }}>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <Button title="Open selected asset" disabled={busy || selectedIds.length !== 1 || !entries.some(entry => entry.id === selectedIds[0])}
        onPress={() => { const entry = entries.find(item => item.id === selectedIds[0]); if (entry) open(entry); }} unstyled={unstyled}/>
      {action.pending ? <Button title="Cancel asset request" onPress={action.cancel} unstyled={unstyled}/> : null}
    </View>
    <ErrorMessage {...(error || action.error ? { message: error || action.error! } : {})} unstyled={unstyled}/>
  </View>;
  return <View {...rest} style={style} {...{ className: joinClasses(className) }}>
    <FlatList ref={list} data={visible} keyExtractor={entry => entry.id} initialNumToRender={12} windowSize={5} style={{ height }}
      accessibilityLabel="Assets" ListHeaderComponent={header} ListFooterComponent={footer}
      onScrollToIndexFailed={info => list.current?.scrollToOffset({ offset: state.headerHeight + info.averageItemLength * info.index, animated: false })}
      ListEmptyComponent={<Text {...{ className: joinClasses(styled && "text-text-muted") }}>{loading ? "Loading assets…" : state.query ? "No assets match" : "This location is empty"}</Text>}
      renderItem={({ item, index }) => <Pressable ref={node => {
        if (node) { rows.current.set(item.id, node); if (focusRequest.current === item.id) { (node as unknown as { focus?: () => void }).focus?.(); focusRequest.current = null; } }
        else rows.current.delete(item.id);
      }} accessibilityRole={multipleSelection ? "checkbox" : "radio"} accessibilityLabel={`${assetDisplayName(item.name)}, ${item.kind}${item.byteLength !== undefined ? `, ${formatAssetBytes(item.byteLength)}` : ""}`}
        aria-checked={selected.has(item.id)} aria-disabled={busy || undefined}
        accessibilityState={{ checked: selected.has(item.id), disabled: busy }} disabled={busy}
        {...{ tabIndex: item.id === active ? 0 : -1, onKeyDown: (event: unknown) => key(event, item, index), className: joinClasses(styled && "border-b border-border focus-visible:ring-2 focus-visible:ring-focus") }}
        onPress={event => choose(item.id, event.nativeEvent as { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean })}
        accessibilityActions={[{ name: "activate", label: "Select asset" }, { name: "open", label: `Open ${item.name}` }]}
        onAccessibilityAction={event => { if (event.nativeEvent.actionName === "open") open(item); else if (event.nativeEvent.actionName === "activate") choose(item.id); }}
        style={{ minHeight: 64, padding: 10, flexDirection: "row", gap: 10, alignItems: "center" }}>
        {item.thumbnailUri ? <Image source={{ uri: item.thumbnailUri }} style={{ width: 40, height: 40 }} accessibilityIgnoresInvertColors/> : null}
        <View style={{ flex: 1, minWidth: 0 }}><Text {...{ className: joinClasses(styled && "text-text") }}>{assetDisplayName(item.name)}</Text>
          <Text {...{ className: joinClasses(styled && "text-text-muted text-sm") }}>{item.kind === "folder" ? "Folder" : item.mediaType ?? "File"}</Text></View>
        {selected.has(item.id) ? <Text accessibilityElementsHidden importantForAccessibility="no" {...{ className: joinClasses(styled && "text-text") }}>✓</Text> : null}
      </Pressable>}/>
  </View>;
}
