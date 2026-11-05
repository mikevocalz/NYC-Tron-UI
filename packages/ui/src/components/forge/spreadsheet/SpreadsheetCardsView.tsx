// Portions ported from GridCraft for Android,
// apps/gridcraft-android/android/app/src/main/java/io/github/artcraftandroid/gridcraft/ui/editor/Cards.kt
// at https://github.com/artcraft-android/gridcraft-android/commit/72d5bfc0729d0966e9bd966c2eabaa0312eea3ff
// Copyright (c) 2026 ArtCraft Team and the GridCraft contributors.
// Licensed under the MIT License or the Apache License, Version 2.0, at your option;
// see licenses/GridCraft-MIT.txt and licenses/GridCraft-Apache-2.0.txt.
// Modified by NYC-Tron UI contributors, 2026-11-05: Jetpack Compose replaced with React
// Native views styled by app theme tokens; the AlertDialog field editor replaced with
// in-place editing; card state is controlled by the app; RTL, keyboard and screen-reader
// labels added; commits go through the app's onCommitField.
import { useRef } from "react";
import { Pressable, ScrollView, Text, TextInput, View, type ViewProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { joinClasses } from "../../styles.ts";
import type { SheetRange } from "../sheet-window.ts";
import { CARD_PREVIEW_FIELDS, sheetCards, type CardCellValues, type SheetCard } from "./cards-model.ts";

/**
 * Table rows as readable cards for phones and folded panes: the first column
 * titles each card and the next three fields preview under it. Opening a card
 * lists every field; tapping one edits its cell in place. Card and field
 * state are controlled; the app writes through `onCommitField` (for Forge,
 * `TallyDocument.setCell`) and passes refreshed `cells` back.
 */
export interface SpreadsheetCardsViewProps extends Omit<ViewProps, "children"> {
  /** Table name shown in the bar. */
  readonly name: string;
  /** Header row plus data rows. */
  readonly table: SheetRange;
  readonly cells: CardCellValues;
  /** Index into the cards (0 = first data row) or `undefined` for the list. */
  readonly openCard: number | undefined;
  readonly onOpenCardChange: (index: number | undefined) => void;
  /** Persist one field. Reject to keep the draft and show the message. */
  readonly onCommitField?: (address: string, raw: string) => Promise<unknown> | unknown;
  /** Back from the list to the grid; adds the bar's back button on the list. */
  readonly onClose?: () => void;
  /** More rows exist beyond `table` than the app loaded. */
  readonly hasMore?: boolean;
  /** Cards rendered in the list before "Show more". @default 200 */
  readonly pageSize?: number;
  readonly className?: string;
  readonly unstyled?: boolean;
}

type Local = { editing: string | undefined; draft: string; pending: boolean; error: string | null; shown: number };

function BarButton({ label, onPress, disabled, unstyled, children }: {
  label: string; onPress: () => void; disabled?: boolean; unstyled: boolean; children: string;
}) {
  return <Pressable role="button" accessibilityLabel={label} disabled={disabled} aria-disabled={disabled} onPress={onPress}
    {...{ className: joinClasses(!unstyled && "rounded-control focus-visible:ring-2 focus-visible:ring-focus",
      !unstyled && disabled && "opacity-40") }}
    style={{ minWidth: 48, minHeight: 48, paddingHorizontal: 12, alignItems: "center", justifyContent: "center" }}>
    <Text {...{ className: !unstyled ? "text-text" : undefined }}>{children}</Text>
  </Pressable>;
}

export function SpreadsheetCardsView({
  name, table, cells, openCard, onOpenCardChange, onCommitField, onClose, hasMore = false, pageSize = 200,
  className, unstyled = false, ...props
}: SpreadsheetCardsViewProps) {
  const storeRef = useRef<StoreApi<Local> | null>(null);
  if (!storeRef.current) storeRef.current = createStore<Local>(() => ({ editing: undefined, draft: "", pending: false, error: null, shown: pageSize }));
  const store = storeRef.current;
  const editing = useStore(store, s => s.editing);
  const draft = useStore(store, s => s.draft);
  const pending = useStore(store, s => s.pending);
  const error = useStore(store, s => s.error);
  const shown = useStore(store, s => s.shown);
  const cards: SheetCard[] = table.endRow > table.startRow ? sheetCards(table, cells) : [];
  const open = openCard !== undefined && openCard >= 0 && openCard < cards.length ? cards[openCard] : undefined;
  const text = !unstyled ? "text-text" : undefined;
  const muted = !unstyled ? "text-text-muted" : undefined;

  const go = (index: number | undefined) => {
    store.setState({ editing: undefined, error: null });
    onOpenCardChange(index);
  };
  const commit = async () => {
    const s = store.getState();
    if (s.editing === undefined || s.pending || !onCommitField) return;
    const field = open?.fields.find(f => f.address === s.editing);
    if (field && field.raw === s.draft) { store.setState({ editing: undefined }); return; }
    store.setState({ pending: true, error: null });
    try {
      await onCommitField(s.editing, s.draft);
      if (store.getState().editing === s.editing) store.setState({ editing: undefined });
    } catch (e) {
      store.setState({ error: e instanceof Error ? e.message : "Couldn't save this field. Try again." });
    } finally {
      store.setState({ pending: false });
    }
  };

  const title = open ? open.title : name;
  const countLabel = `${cards.length}${hasMore ? "+" : ""} ${cards.length === 1 && !hasMore ? "card" : "cards"}`;
  return <View {...props} {...{ className: joinClasses(!unstyled && "bg-surface-sunken", className) }}
    style={[{ flex: 1 }, props.style]}>
    <View {...{ className: joinClasses(!unstyled && "border-b border-border bg-surface-raised") }}
      style={{ minHeight: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: 4, gap: 4 }}>
      {open ? <BarButton unstyled={unstyled} label="Back to all cards" onPress={() => go(undefined)}>All cards</BarButton>
        : onClose ? <BarButton unstyled={unstyled} label="Back to the grid" onPress={onClose}>Grid</BarButton> : null}
      <Text role="heading" aria-level={2} numberOfLines={1} {...{ className: joinClasses(text, "font-semibold") }}
        style={{ flex: 1, fontSize: 16, paddingHorizontal: 8 }}>{title}</Text>
      {open ? <>
        <BarButton unstyled={unstyled} label="Previous card" disabled={openCard === 0} onPress={() => go(openCard! - 1)}>Previous</BarButton>
        <BarButton unstyled={unstyled} label="Next card" disabled={openCard === cards.length - 1} onPress={() => go(openCard! + 1)}>Next</BarButton>
      </> : <Text {...{ className: muted }} style={{ paddingHorizontal: 12, fontVariant: ["tabular-nums"] }}>{countLabel}</Text>}
    </View>
    {open ? <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
      {open.fields.map(field => {
        const isEditing = editing === field.address;
        return <View key={field.address} {...{ className: joinClasses(!unstyled && "border-b border-border") }}
          style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 4 }}>
          <Text {...{ className: muted }} style={{ fontSize: 13 }} numberOfLines={1}>{field.name}</Text>
          {isEditing ? <>
            <TextInput autoFocus value={draft} editable={!pending} accessibilityLabel={`Edit ${field.name}`}
              onChangeText={next => store.setState({ draft: next, error: null })}
              onSubmitEditing={() => void commit()}
              onBlur={() => { if (store.getState().editing === field.address) void commit(); }}
              onKeyPress={e => { if (e.nativeEvent.key === "Escape") store.setState({ editing: undefined, error: null }); }}
              {...{ className: joinClasses(!unstyled && "rounded-control border bg-surface-raised text-text",
                !unstyled && (error ? "border-danger" : "border-focus")) }}
              style={{ minHeight: 44, paddingHorizontal: 10, fontSize: 16 }} />
            {error ? <Text selectable accessibilityRole="alert" accessibilityLiveRegion="polite"
              {...{ className: !unstyled ? "text-danger" : undefined }}>{error}</Text> : null}
          </> : <Pressable role="button" disabled={!onCommitField}
            accessibilityLabel={`${field.name}, ${field.display || "empty"}`}
            accessibilityHint={onCommitField ? "Edits this cell" : undefined}
            onPress={() => store.setState({ editing: field.address, draft: field.raw, error: null })}
            {...{ className: joinClasses(!unstyled && "rounded-control focus-visible:ring-2 focus-visible:ring-focus") }}
            style={{ minHeight: 44, justifyContent: "center" }}>
            <Text selectable {...{ className: text }} style={{ fontSize: 16 }}>{field.display || " "}</Text>
          </Pressable>}
        </View>;
      })}
    </ScrollView>
    : cards.length === 0 ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 }}>
      <Text {...{ className: text }} style={{ fontSize: 15, textAlign: "center" }}>This table has no rows to show.</Text>
      <Text {...{ className: muted }} style={{ textAlign: "center" }}>Add a row under the header in the grid, then come back.</Text>
    </View>
    : <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
      {cards.slice(0, shown).map((card, index) => <Pressable key={card.row} role="button"
        accessibilityLabel={`${card.title}. ${card.fields.slice(1, 1 + CARD_PREVIEW_FIELDS).map(f => `${f.name} ${f.display || "empty"}`).join(", ")}`}
        accessibilityHint="Opens every field of this row"
        onPress={() => go(index)}
        {...{ className: joinClasses(!unstyled && "rounded-card border border-border bg-surface-raised focus-visible:ring-2 focus-visible:ring-focus") }}
        style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 6 }}>
        <Text numberOfLines={1} {...{ className: joinClasses(text, "font-semibold") }} style={{ fontSize: 17 }}>{card.title}</Text>
        {card.fields.slice(1, 1 + CARD_PREVIEW_FIELDS).map(field => <View key={field.address}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text numberOfLines={1} {...{ className: muted }} style={{ flex: 2, fontSize: 13 }}>{field.name}</Text>
          <Text numberOfLines={1} {...{ className: text }} style={{ flex: 3, fontSize: 14 }}>{field.display}</Text>
        </View>)}
      </Pressable>)}
      {cards.length > shown ? <Pressable role="button" accessibilityLabel={`Show ${Math.min(pageSize, cards.length - shown)} more cards`}
        onPress={() => store.setState(s => ({ shown: s.shown + pageSize }))}
        {...{ className: joinClasses(!unstyled && "rounded-control border border-border bg-surface-raised focus-visible:ring-2 focus-visible:ring-focus") }}
        style={{ minHeight: 44, alignItems: "center", justifyContent: "center" }}>
        <Text {...{ className: text }}>{`Show more (${cards.length - shown} left)`}</Text>
      </Pressable> : null}
    </ScrollView>}
  </View>;
}
