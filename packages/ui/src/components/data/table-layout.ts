/** Content layout policy. It uses the MEASURED pane, never the device family. */
export type DataTableLayout = "auto" | "table" | "cards";
export type ResolvedDataTableLayout = Exclude<DataTableLayout, "auto">;
export interface DataTableLayoutInput {
  readonly layout?: DataTableLayout;
  readonly containerWidth: number | null;
  /** A content-composition threshold, not a hardware detector. */
  readonly cardsBelow?: number;
}
export function dataTableLayout({
  layout = "auto", containerWidth, cardsBelow = 620,
}: DataTableLayoutInput): ResolvedDataTableLayout {
  if (layout === "cards" || layout === "table") return layout;
  if (layout !== "auto") throw new RangeError("Unknown table layout");
  if (!Number.isFinite(cardsBelow) || cardsBelow <= 0) throw new RangeError("Invalid table breakpoint");
  // Initial / SSR size is unknown; cards preserve every value without a
  // premature full-width or width-based device-family guess.
  if (containerWidth === null) return "cards";
  if (!Number.isFinite(containerWidth) || containerWidth < 0) {
    throw new RangeError("Invalid table host width");
  }
  return containerWidth < cardsBelow ? "cards" : "table";
}
export function tableContentWidth(
  containerWidth: number | null, columnCount: number, minColumnWidth = 144,
): number {
  if (!Number.isSafeInteger(columnCount) || columnCount < 0 ||
      !Number.isFinite(minColumnWidth) || minColumnWidth <= 0 ||
      (containerWidth !== null && (!Number.isFinite(containerWidth) || containerWidth < 0))) {
    throw new RangeError("Invalid table column geometry");
  }
  return Math.max(containerWidth ?? 0, columnCount * minColumnWidth);
}
