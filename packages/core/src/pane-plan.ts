import { resolveUsableRegions, type FoldFeature, type Rect } from "./folds.ts";

/**
 * Master discovers, Detail owns the selected record/workspace, Inspector
 * overlays contextual controls; no duplicate scene or routing state.
 * All feature bounds and container origins are window-space logical units.
 * Only pane rectangles are local to the host.
 */
export interface PanePlanInput {
  readonly container: Rect;
  readonly features: readonly FoldFeature[];
  readonly posture?: "flat" | "book" | "tabletop";
  readonly isRTL?: boolean;
  readonly master: {
    readonly present: boolean;
    readonly openOnCompact?: boolean;
    readonly minWidth: number;
    readonly preferredWidth: number;
    readonly minHeight?: number;
  };
  readonly detail: { readonly minWidth: number; readonly minHeight?: number };
  readonly inspector?: {
    readonly open: boolean;
    readonly preferredWidth: number;
    readonly minWidth: number;
  };
}
export type MasterPlacement = "tiled" | "overlay" | "hidden";
export type InspectorPlacement = "overlay" | "contained-sheet" | "closed";
export interface PanePlan {
  readonly arrangement: "single" | "side-by-side" | "book" | "tabletop";
  readonly regions: readonly Rect[];
  readonly master: { readonly placement: MasterPlacement; readonly rect: Rect };
  readonly detail: { readonly rect: Rect };
  readonly inspector: {
    readonly placement: InspectorPlacement;
    readonly rect: Rect;
    readonly edge: "left" | "right";
  };
}

const empty: Rect = { x: 0, y: 0, width: 0, height: 0 };
const area = (r: Rect) => r.width * r.height;
const left = (r: Rect) => r.x;
const right = (r: Rect) => r.x + r.width;
const bottom = (r: Rect) => r.y + r.height;
const overlapsY = (a: Rect, b: Rect) =>
  Math.min(bottom(a), bottom(b)) > Math.max(a.y, b.y);

function validSize(n: number) {
  return Number.isFinite(n) && n > 0;
}
function wholeRegionMaster(region: Rect, preferred: number, min: number): Rect {
  return {
    x: region.x, y: region.y,
    width: Math.min(region.width, Math.max(min, preferred)), height: region.height,
  };
}
function findSidePair(regions: readonly Rect[], minMaster: number, minDetail: number, rtl: boolean) {
  let found: { master: Rect; detail: Rect; score: number } | null = null;
  for (const master of regions) for (const detail of regions) {
    if (master === detail || master.width < minMaster || detail.width < minDetail ||
        !overlapsY(master, detail)) continue;
    if (rtl ? left(master) < right(detail) : right(master) > left(detail)) continue;
    const score = Math.min(master.height, detail.height) * (master.width + detail.width);
    if (!found || score > found.score) found = { master, detail, score };
  }
  return found;
}
function findTabletopPair(
  regions: readonly Rect[], minMasterHeight: number, minDetailHeight: number,
) {
  let found: { master: Rect; detail: Rect; score: number } | null = null;
  for (const detail of regions) for (const master of regions) {
    if (detail === master || detail.height < minDetailHeight ||
        master.height < minMasterHeight || bottom(detail) > master.y ||
        Math.min(right(detail),right(master)) <= Math.max(left(detail),left(master))) continue;
    const score = Math.min(detail.width,master.width) * (detail.height+master.height);
    if (!found || score > found.score) found = { master, detail, score };
  }
  return found;
}
export function resolvePanePlan(input: PanePlanInput): PanePlan {
  const { container, features, master, detail, inspector, isRTL = false } = input;
  if (!validSize(container.width) || !validSize(container.height) ||
      !validSize(master.minWidth) || !validSize(master.preferredWidth) ||
      !validSize(detail.minWidth) ||
      !validSize(master.minHeight ?? 1) || !validSize(detail.minHeight ?? 1) ||
      (inspector && (!validSize(inspector.preferredWidth) ||
                     !validSize(inspector.minWidth)))) {
    throw new RangeError("Invalid adaptive pane geometry");
  }
  const regions = resolveUsableRegions({ container, features });
  // In a rare fully-occluded container, return a zero-area destination rather
  // than fabricate a pane over a hinge. The host may show a safety state.
  const largest = regions.reduce<Rect>(
    (best, current) => area(current) > area(best) ? current : best,
    empty,
  );
  let main = largest;
  let masterRect = largest;
  let placement: MasterPlacement = "hidden";
  let arrangement: PanePlan["arrangement"] = "single";

  if (master.present && input.posture === "tabletop") {
    const pair = findTabletopPair(
      regions, master.minHeight ?? 44, detail.minHeight ?? 44,
    );
    if (pair) {
      main = pair.detail;
      masterRect = pair.master;
      placement = "tiled";
      arrangement = "tabletop";
    }
  }

  if (master.present && arrangement === "single") {
    const pair = findSidePair(regions, master.minWidth, detail.minWidth, isRTL);
    if (pair) {
      main = pair.detail;
      masterRect = pair.master;
      placement = "tiled";
      arrangement = "book";
    } else if (largest.width >= master.minWidth + detail.minWidth &&
               largest.height >= (detail.minHeight ?? 1)) {
      const masterWidth = Math.min(
        largest.width - detail.minWidth,
        Math.max(master.minWidth, master.preferredWidth),
      );
      if (isRTL) {
        masterRect = {
          x: largest.x + largest.width - masterWidth,
          y: largest.y, width: masterWidth, height: largest.height,
        };
        main = { ...largest, width: largest.width - masterWidth };
      } else {
        masterRect = { ...largest, width: masterWidth };
        main = {
          ...largest, x: largest.x + masterWidth,
          width: largest.width - masterWidth,
        };
      }
      placement = "tiled";
      arrangement = "side-by-side";
    } else {
      // Compact master is an overlay only when the route owner asks to open it;
      // otherwise it remains mounted but non-interactive in the UI wrapper.
      masterRect = wholeRegionMaster(largest, master.preferredWidth, master.minWidth);
      if (isRTL) masterRect = { ...masterRect, x: right(largest) - masterRect.width };
      placement = master.openOnCompact ? "overlay" : "hidden";
    }
  }
  const edge = isRTL ? "left" : "right";
  const desired = inspector?.preferredWidth ?? 0;
  const inspectorPlacement: InspectorPlacement =
    !inspector || !inspector.open || area(main) === 0 ? "closed" :
    main.width < inspector.minWidth ? "contained-sheet" : "overlay";
  const overlayWidth = inspectorPlacement === "closed" ? 0 :
    inspectorPlacement === "contained-sheet" ? main.width :
    Math.min(main.width, Math.max(inspector?.minWidth ?? 0, desired));
  const inspectorRect: Rect = {
    x: edge === "right" ? right(main) - overlayWidth : main.x,
    y: main.y,
    width: overlayWidth,
    height: main.height,
  };

  return {
    arrangement, regions,
    master: { placement, rect: masterRect },
    detail: { rect: main },
    inspector: { placement: inspectorPlacement, rect: inspectorRect, edge },
  };
}
