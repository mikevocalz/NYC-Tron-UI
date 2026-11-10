import { ActivityIndicator, Platform, Text, View } from "react-native";
import { useStore } from "zustand";
import { Button } from "@nyc-tron/ui/components/Button";
import { SegmentedControl } from "@nyc-tron/ui/components/SegmentedControl";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";
import { AssetBrowser, type AssetBrowserProps } from "@nyc-tron/ui/components/shell/AssetBrowser";
import { EmptyState } from "@nyc-tron/ui/components/feedback/EmptyState";
import { ErrorMessage } from "@nyc-tron/ui/components/feedback/ErrorMessage";
import { ReferenceCard, ReferenceHeading, ReferencePage, StatusLine } from "./ScreenParts";
import type { ReferenceModel } from "./reference-model";

export function LibraryDetailScreen({ model }: { model: ReferenceModel }) {
  const state = useStore(model.store, value => value);
  const entries = state.collection === "saved" ? state.library.items.filter(item => state.favorites.includes(item.id)) : state.library.items;
  const detail = state.library.items.find(item => item.id === (state.openedId ?? state.selectedIds[0]));
  const saved = detail && state.favorites.includes(detail.id);
  const heading = {
    title: "Library", eyebrow: "MAKE ROOM FOR YOUR WORK",
    description: "Find a study, keep it close, and pick up where you left off.",
    actions: <Button title="Refresh library" variant="secondary" disabled={state.library.status === "loading"} onPress={() => { void model.loadLibrary(); }} />,
  };
  const collection = <SegmentedControl aria-label="Library collection" value={state.collection}
    options={[{ value: "all", label: "All work" }, { value: "saved", label: "Saved" }]}
    onChange={collection => model.store.setState({ collection })} />;
  const emptyState = state.library.status === "loading" ? <View testID="reference-library-loading" style={{ padding: 28, gap: 12, alignItems: "center" }}>
    <ActivityIndicator accessibilityLabel="Loading library" />
    <StatusLine>Opening your library…</StatusLine>
  </View> : state.library.status === "error" ? <View testID="reference-library-error" style={{ gap: 16 }}>
    <ErrorMessage message={state.library.error} />
    <Button title="Try library again" onPress={() => { void model.loadLibrary(); }} />
  </View> : !entries.length ? <EmptyState title={state.collection === "saved" ? "Keep a favorite close" : "Your library is empty"}
    description={state.collection === "saved" ? "Choose a study from All work, then save it to this collection." : "There are no items in this source. Refresh to check again."}
    exitAction={{ title: state.collection === "saved" ? "Browse all work" : "Refresh empty library", onPress: () => {
      if (state.collection === "saved") model.store.setState({ collection: "all" }); else void model.loadLibrary();
    } }} /> : null;
  const browser: AssetBrowserProps = {
    testID: "reference-assets", locationId: "library", revision: "reference-1",
    entries: state.library.status === "ready" ? entries : [],
    path: [{ id: "library", label: "Studies" }],
    selectedIds: state.selectedIds.filter(id => entries.some(item => item.id === id)),
    loading: state.library.status === "loading",
    onSelectionChange: selectedIds => model.store.setState({ selectedIds, openedId: null }),
    onOpen: ({ entry }) => model.store.setState({ openedId: entry.id }),
    onNavigate: () => undefined,
  };
  const detailCard = <ReferenceCard testID="reference-library-detail">
    {!detail ? <EmptyState title="A closer look" description="Select a study to see its details and continue working." /> : <>
      <Text {...{ className: "text-xs font-semibold tracking-widest text-text-muted" }}>{detail.collection.toUpperCase()}</Text>
      <Text accessibilityRole="header" testID="reference-item-title" {...{ className: "text-2xl font-semibold text-text" }}>{detail.name}</Text>
      <Text {...{ className: "text-base leading-relaxed text-text-muted" }}>{detail.description}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {detail.id === "cover" ? <Button title="Edit cover" onPress={() => model.navigate("editor")} /> : null}
        {detail.id === "motion" ? <Button title="Review media" onPress={() => model.navigate("media")} /> : null}
        <Button title={saved ? "Remove from saved" : "Save to collection"} variant="secondary" onPress={() => model.toggleFavorite(detail.id)} />
      </View>
      <StatusLine>{saved ? "Saved in your collection." : "Part of the local sample library."}</StatusLine>
    </>}
  </ReferenceCard>;

  // The native list owns the whole vertical scroll surface. Its heading and
  // detail remain reachable without placing a virtualized list in a ScrollView.
  if (Platform.OS !== "web") return <View testID="reference-library" style={{ flex: 1, minWidth: 0, paddingHorizontal: 24 }}>
    <ContentFrame testID="reference-library-columns" maxWidth={1120} style={{ flex: 1 }}>
      <AssetBrowser {...browser} height="fill"
        header={<View style={{ paddingTop: 24, paddingBottom: 20, gap: 28 }}>
          <ReferenceHeading {...heading} />
          {collection}
        </View>}
        emptyState={emptyState ?? undefined}
        footer={<View style={{ paddingTop: 20, paddingBottom: 40 }}>{detailCard}</View>} />
    </ContentFrame>
  </View>;

  return <ReferencePage testID="reference-library" {...heading}>
    <AdaptiveColumns gap={28} testID="reference-library-columns">
      <AdaptiveColumns.Item minWidth={320} grow={1.35}>
        <ReferenceCard>
          {collection}
          {emptyState ?? <AssetBrowser {...browser} height={510} />}
        </ReferenceCard>
      </AdaptiveColumns.Item>
      <AdaptiveColumns.Item minWidth={280}>
        {detailCard}
      </AdaptiveColumns.Item>
    </AdaptiveColumns>
  </ReferencePage>;
}
