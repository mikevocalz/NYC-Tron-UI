/** Stable destination contract with no app theme or routing dependency. */
export interface NativeNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly glyph?: string;
  readonly disabled?: boolean;
}
export function validateNavigationItems(
  items: readonly NativeNavigationItem[], selectedId: string | null
): void {
  const ids=new Set<string>();
  if(items.length>20)throw new RangeError("Navigation rail supports up to 20 visible destinations");
  for(const item of items){
    if(!item.id||!item.label?.trim()||ids.has(item.id))
      throw new TypeError("Native navigation IDs and labels must be unique");
    ids.add(item.id);
  }
  if(selectedId!==null&&!ids.has(selectedId))
    throw new RangeError("Selected destination must be present");
}

/** Validate the measured host consistently for native and web renderers. */
export function resolveRailDimensions(
  expanded: boolean, width?: number, height?: number
): { width: number; height: number | "100%" } {
  if (width !== undefined && (!Number.isFinite(width) || width < 64))
    throw new RangeError("Rail width must be >=64");
  if (height !== undefined && (!Number.isFinite(height) || height < 44))
    throw new RangeError("Rail height must be >=44");
  return { width: width ?? (expanded ? 208 : 80), height: height ?? "100%" };
}

/** Window-space logical rect, structurally compatible with `@nyc-tron/core/folds`. */
export interface RailRegion {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Pick the usable region that hosts a physical-right rail.
 *
 * Pass the hinge-free regions from `resolveUsableRegions` (or any host fold
 * adapter). The rail goes in the region whose right edge is the window's
 * physical right edge; a vertical hinge (Surface Duo double portrait) therefore
 * puts it on the right screen. When a horizontal fold splits that right column,
 * the taller segment wins and the top one breaks ties, so the rail never
 * straddles the fold. Text direction is deliberately not an input.
 *
 * @throws RangeError when no positive, finite region is supplied.
 */
export function resolvePhysicalRightRailRegion(regions: readonly RailRegion[]): RailRegion {
  const usable = regions.filter(r =>
    [r.x, r.y, r.width, r.height].every(Number.isFinite) && r.width > 0 && r.height > 0);
  if (usable.length === 0) throw new RangeError("Rail needs at least one usable region");
  const rightEdge = Math.max(...usable.map(r => r.x + r.width));
  const column = usable.filter(r => Math.abs(r.x + r.width - rightEdge) < 0.5);
  let best = column[0]!;
  for (const r of column) {
    if (r.height > best.height || (r.height === best.height && r.y < best.y)) best = r;
  }
  return best;
}

/**
 * Default selected-pill fill: the active color at 15% alpha when it is a
 * `#RRGGBB` token, otherwise `undefined` so the platform default applies.
 */
export function defaultIndicatorColor(activeColor?: string): string | undefined {
  return activeColor !== undefined && /^#[0-9a-f]{6}$/i.test(activeColor)
    ? activeColor + "26"
    : undefined;
}
