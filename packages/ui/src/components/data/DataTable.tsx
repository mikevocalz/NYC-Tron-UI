import { useRef, type ReactNode } from "react";
import {
  createSortedRowModel, flexRender, rowSortingFeature, sortFns, tableFeatures,
  useTable, type ColumnDef, type Row, type RowData,
} from "@tanstack/react-table";
import {
  FlatList, Pressable, ScrollView, Text, View, type ViewProps,
} from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { joinClasses } from "../styles";
import { dataTableLayout, tableContentWidth, type DataTableLayout } from "./table-layout";

/** TanStack owns row/column logic; NYC-Tron owns actual RN rendering. */
const features = tableFeatures({
  rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns,
});
export type TronColumnDef<T extends RowData> = ColumnDef<typeof features, T, unknown>;
export interface DataTableProps<T extends RowData> extends Omit<ViewProps, "children"> {
  readonly data: readonly T[];
  readonly columns: TronColumnDef<T>[];
  readonly getRowId?: (row: T) => string;
  readonly onRowPress?: (row: T) => void;
  /** Optional measured width. When absent, onLayout tracks THIS host pane. */
  readonly width?: number;
  /** 'cards' is mobile-friendly; 'table' preserves a horizontal column grid. */
  readonly layout?: DataTableLayout;
  readonly cardsBelow?: number;
  readonly minColumnWidth?: number;
  readonly getColumnLabel?: (columnId: string) => string;
  readonly renderCard?: (row: Row<typeof features, T>) => ReactNode;
  readonly rowHeight?: number;
  readonly headerHeight?: number;
  readonly maxHeight?: number;
  readonly emptyLabel?: string;
  readonly sortable?: boolean;
  readonly className?: string;
  readonly headerClassName?: string;
  readonly rowClassName?: string;
  readonly cellClassName?: string;
  readonly unstyled?: boolean;
}
type PaneSize = { width: number | null };

function asNativeNode(value: unknown): ReactNode {
  if (value === null || value === undefined || typeof value === "boolean") return null;
  return typeof value === "string" || typeof value === "number"
    ? <Text>{value}</Text>
    : value as ReactNode;
}
export function DataTable<T extends RowData>({
  data, columns, getRowId, onRowPress, width, layout = "auto",
  cardsBelow = 620, minColumnWidth = 144, getColumnLabel, renderCard,
  rowHeight = 44, headerHeight = 44, maxHeight = 640, emptyLabel = "No records",
  sortable = true, className, headerClassName, rowClassName, cellClassName,
  unstyled = false, onLayout, style, ...rest
}: DataTableProps<T>) {
  const sizeStoreRef = useRef<StoreApi<PaneSize> | null>(null);
  if (!sizeStoreRef.current) {
    sizeStoreRef.current = createStore<PaneSize>(() => ({ width: null }));
  }
  const store = sizeStoreRef.current;
  const measuredWidth = useStore(store, s => s.width);
  const availableWidth = width ?? measuredWidth;
  const displayMode = dataTableLayout({ layout, containerWidth: availableWidth, cardsBelow });
  const columnWidth = tableContentWidth(availableWidth, columns.length, minColumnWidth);

  const table = useTable({
    key: "nyc-tron-data-table", features, data: [...data], columns,
    ...(getRowId ? { getRowId } : {}),
  });
  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups().at(-1)?.headers ?? [];
  const headerByColumn = new Map(headers.map(header => [header.column.id, header]));
  const labelFor = (id: string): string => {
    const custom = getColumnLabel?.(id);
    if (custom) return custom;
    const header = headerByColumn.get(id)?.column.columnDef.header;
    return typeof header === "string" && header.trim() ? header : id;
  };

  const cardRow = (row: (typeof rows)[number]) => {
    if (renderCard) return renderCard(row);
    return (
      <View accessible accessibilityLabel={`Record ${row.id}`}
        {...{ className: joinClasses(
          "gap-3 p-4", !unstyled && "rounded-card border border-border bg-surface-raised",
          rowClassName,
        ) }}>
        {row.getAllCells().map(cell => (
          <View key={cell.id} {...{ className: joinClasses("flex-row items-start gap-3", cellClassName) }}>
            <Text style={{ width: "40%", flexShrink: 0, fontWeight: "600" }}
              {...{ className: !unstyled ? "text-text-muted" : undefined }}>
              {labelFor(cell.column.id)}
            </Text>
            <View style={{ flex: 1, minWidth: 0 }} accessibilityLabel={labelFor(cell.column.id)}>
              {asNativeNode(flexRender(cell.column.columnDef.cell, cell.getContext()))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const sortingControls = sortable ? headers.filter(header =>
    !header.isPlaceholder && header.column.getCanSort()
  ) : [];
  const onHostLayout: ViewProps["onLayout"] = event => {
    const next = event.nativeEvent.layout.width;
    if (Number.isFinite(next) && next >= 0 && store.getState().width !== next) {
      store.setState({ width: next });
    }
    onLayout?.(event);
  };

  return (
    <View {...rest}
      onLayout={onHostLayout}
      accessibilityLabel={rest.accessibilityLabel ?? "Data table"}
      {...{ className: joinClasses(
        "w-full min-w-0", !unstyled && "bg-surface-raised", className,
      ) }}
      style={[{ maxHeight }, style]}>
      {displayMode === "cards" ? (
        <>
          {sortingControls.length > 0 ? (
            <ScrollView horizontal style={{ flexGrow: 0, maxHeight: headerHeight + 12 }}
              contentContainerStyle={{ alignItems: "center", gap: 8, paddingVertical: 6 }}
              accessibilityLabel="Sort records">
              {sortingControls.map(header => {
                const current = header.column.getIsSorted();
                return (
                  <Pressable key={header.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Sort by ${labelFor(header.column.id)}`}
                    onPress={() => header.column.toggleSorting()}
                    {...{ className: joinClasses(
                      "min-h-11 flex-row items-center gap-2 px-3",
                      !unstyled && "rounded-control border border-border bg-surface-sunken",
                      headerClassName,
                    ) }}>
                    <Text>{labelFor(header.column.id)}</Text>
                    {current ? <Text>{current === "asc" ? "↑" : "↓"}</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
          <FlatList data={rows} keyExtractor={row => row.id}
            contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
            style={{ maxHeight: Math.max(0, maxHeight - (sortingControls.length ? headerHeight + 12 : 0)) }}
            renderItem={({ item: row }) => (
              <Pressable
                accessibilityRole={onRowPress ? "button" : undefined}
                accessibilityLabel={onRowPress ? `Open record ${row.id}` : undefined}
                onPress={onRowPress ? () => onRowPress(row.original) : undefined}
                disabled={!onRowPress}
              >
                {cardRow(row)}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={{ minHeight: rowHeight, justifyContent: "center", paddingHorizontal: 12 }}>
                <Text>{emptyLabel}</Text>
              </View>
            }
          />
        </>
      ) : (
        <ScrollView horizontal keyboardShouldPersistTaps="handled"
          accessibilityLabel="Table columns; scroll sideways for more columns">
          <View style={{ width: columnWidth }}>
            {table.getHeaderGroups().map(group => (
              <View key={group.id}
                {...{ className: joinClasses("flex-row", !unstyled && "border-b border-border bg-surface-sunken", headerClassName) }}
                style={{ minHeight: headerHeight }}>
                {group.headers.map(header => {
                  const sorting = sortable && header.column.getCanSort();
                  return (
                    <Pressable key={header.id} accessibilityRole="button"
                      accessibilityLabel={`Column ${labelFor(header.column.id)}`}
                      accessibilityState={{ disabled: !sorting }}
                      disabled={!sorting}
                      onPress={sorting ? () => header.column.toggleSorting() : undefined}
                      {...{ className: joinClasses("flex-1 min-w-0 justify-center px-3", cellClassName) }}>
                      {header.isPlaceholder ? null
                        : asNativeNode(flexRender(header.column.columnDef.header, header.getContext()))}
                      {header.column.getIsSorted() ? <Text>
                        {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                      </Text> : null}
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <FlatList data={rows} keyExtractor={row => row.id}
              style={{ maxHeight: Math.max(0, maxHeight - headerHeight) }}
              renderItem={({ item: row }) => (
                <Pressable accessibilityRole={onRowPress ? "button" : undefined}
                  accessibilityLabel={onRowPress ? `Open record ${row.id}` : undefined}
                  onPress={onRowPress ? () => onRowPress(row.original) : undefined}
                  disabled={!onRowPress}
                  {...{ className: joinClasses(
                    "flex-row", !unstyled && "border-b border-border", rowClassName,
                  ) }}
                  style={{ minHeight: rowHeight }}>
                  {row.getAllCells().map(cell => (
                    <View key={cell.id}
                      {...{ className: joinClasses("flex-1 min-w-0 justify-center px-3", cellClassName) }}>
                      {asNativeNode(flexRender(cell.column.columnDef.cell, cell.getContext()))}
                    </View>
                  ))}
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={{ minHeight: rowHeight, justifyContent: "center", paddingHorizontal: 12 }}>
                  <Text>{emptyLabel}</Text>
                </View>
              }
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
