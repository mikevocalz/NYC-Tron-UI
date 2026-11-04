import {
  createSortedRowModel,
  flexRender,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { FlatList, Pressable, ScrollView, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../styles";

/**
 * The table model belongs to headless TanStack Table v9; the accessible native
 * renderer belongs to NYC-Tron. This component fetches no records and never
 * owns the source data. The app/Query layer provides the data and columns.
 */
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});
export type TronColumnDef<T extends RowData> = ColumnDef<typeof features, T, unknown>;
export interface DataTableProps<T extends RowData>
  extends Omit<ViewProps, "children"> {
  readonly data: readonly T[];
  readonly columns: TronColumnDef<T>[];
  readonly getRowId?: (row: T) => string;
  readonly onRowPress?: (row: T) => void;
  readonly width?: number;
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

function asNativeNode(value: unknown) {
  if (value === null || value === undefined || typeof value === "boolean") return null;
  return typeof value === "string" || typeof value === "number"
    ? <Text>{value}</Text>
    : value as React.ReactNode;
}

export function DataTable<T extends RowData>({
  data, columns, getRowId, onRowPress,
  width, rowHeight = 44, headerHeight = 44, maxHeight = 640,
  emptyLabel = "No records", sortable = true,
  className, headerClassName, rowClassName, cellClassName, unstyled = false,
  style, ...rest
}: DataTableProps<T>) {
  const table = useTable({
    key: "nyc-tron-data-table",
    features,
    data: [...data],
    columns,
    ...(getRowId ? { getRowId } : {}),
  });
  const rows = table.getRowModel().rows;
  const tableWidth = width ?? Math.max(320, columns.length * 160);
  return (
    <View {...rest}
      accessibilityLabel={rest.accessibilityLabel ?? "Data table"}
      {...{ className: joinClasses(!unstyled && "rounded-card border border-border bg-surface-raised", className) }}
      style={[{ maxHeight, minHeight: headerHeight }, style]}>
      <ScrollView horizontal keyboardShouldPersistTaps="handled">
        <View style={{ width: tableWidth }}>
          {table.getHeaderGroups().map(group => (
            <View key={group.id}
              {...{ className: joinClasses("flex-row", !unstyled && "border-b border-border bg-surface-sunken", headerClassName) }}
              style={{ minHeight: headerHeight }}>
              {group.headers.map(header => {
                const sorting = sortable && header.column.getCanSort();
                const content = header.isPlaceholder ? null : asNativeNode(
                  flexRender(header.column.columnDef.header, header.getContext())
                );
                return (
                  <Pressable key={header.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Column ${header.column.id}`}
                    accessibilityState={{ disabled: !sorting }}
                    disabled={!sorting}
                    onPress={() => { if (sorting) header.column.toggleSorting(); }}
                    {...{ className: joinClasses("flex-1 min-w-0 justify-center px-3", cellClassName) }}>
                    {content}
                    {header.column.getIsSorted() ? <Text>
                      {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                    </Text> : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
          {rows.length ? (
            <FlatList
              data={rows}
              keyExtractor={row => row.id}
              style={{ maxHeight: Math.max(0, maxHeight - headerHeight) }}
              getItemLayout={(_, i) => ({ index: i, length: rowHeight, offset: i * rowHeight })}
              renderItem={({ item: row }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Record ${row.id}`}
                  disabled={!onRowPress}
                  onPress={() => onRowPress?.(row.original)}
                  {...{ className: joinClasses(
                    "flex-row", !unstyled && "border-b border-border",
                    rowClassName,
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
            />
          ) : (
            <View style={{ minHeight: rowHeight, justifyContent: "center", paddingHorizontal: 12 }}>
              <Text accessibilityRole="text">{emptyLabel}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
