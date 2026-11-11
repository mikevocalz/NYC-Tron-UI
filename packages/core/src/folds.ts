/**
 * Pure hinge/occlusion geometry. App adapters supply window-space logical
 * rects, normalized for density *once*, not physical pixels.
 * No synthetic hinge features or precise angles.
 */
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export interface FoldFeature {
  readonly bounds: Rect;
  readonly orientation: "vertical" | "horizontal";
  readonly separating: boolean;
  readonly occlusion: "none" | "full";
}
export interface UsableRegionsInput {
  /** Measured content container in window-space logical units. */
  readonly container: Rect;
  /** All current native fold/division features in the same units. */
  readonly features: readonly FoldFeature[];
}
/** A usable rectangle relative to the measured container's origin, not the window. */
export type UsableRect = Rect;
const valid = (v: Rect) =>
  [v.x,v.y,v.width,v.height].every(Number.isFinite) && v.width >= 0 && v.height >= 0;
const positive = (v: Rect) => v.width > 0 && v.height > 0;
const right = (v: Rect) => v.x + v.width;
const bottom = (v: Rect) => v.y + v.height;
function intersection(a: Rect,b:Rect): Rect|null {
  const x=Math.max(a.x,b.x), y=Math.max(a.y,b.y);
  const x1=Math.min(right(a),right(b)), y1=Math.min(bottom(a),bottom(b));
  return x1>x && y1>y ? {x,y,width:x1-x,height:y1-y}:null;
}
function subtract(region:Rect,blocked:Rect): Rect[] {
  const i=intersection(region,blocked);
  if(!i)return [region];
  return [
    {x:region.x,y:region.y,width:region.width,height:i.y-region.y},
    {x:region.x,y:bottom(i),width:region.width,height:bottom(region)-bottom(i)},
    {x:region.x,y:i.y,width:i.x-region.x,height:i.height},
    {x:right(i),y:i.y,width:right(region)-right(i),height:i.height}
  ].filter(positive);
}
function cutAtFeature(region:Rect,feature:FoldFeature):Rect[] {
  const b=feature.bounds;
  if(feature.orientation==="vertical"){
    if(bottom(b)<=region.y || b.y>=bottom(region) || b.x<=region.x || b.x>=right(region))return [region];
    const after=Math.min(right(region),b.x+b.width);
    return [
      {x:region.x,y:region.y,width:b.x-region.x,height:region.height},
      {x:after,y:region.y,width:right(region)-after,height:region.height}
    ].filter(positive);
  }
  if(right(b)<=region.x || b.x>=right(region) || b.y<=region.y || b.y>=bottom(region))return [region];
  const after=Math.min(bottom(region),b.y+b.height);
  return [
    {x:region.x,y:region.y,width:region.width,height:b.y-region.y},
    {x:region.x,y:after,width:region.width,height:bottom(region)-after}
  ].filter(positive);
}
/** Subtract window-space obstructions and return container-local layout rectangles. */
export function resolveUsableRegions(input:UsableRegionsInput):UsableRect[] {
  if(!valid(input.container))throw new RangeError("Invalid container");
  const container=input.container;
  let regions:Rect[]=[{x:0,y:0,width:container.width,height:container.height}];
  for(const feature of input.features){
    if(!valid(feature.bounds))continue;
    if(!feature.separating && feature.occlusion==="none")continue;
    const local={...feature,bounds:{
      x:feature.bounds.x-container.x,y:feature.bounds.y-container.y,
      width:feature.bounds.width,height:feature.bounds.height
    }};
    regions=regions.flatMap(region=>{
      if(feature.occlusion==="full" && local.bounds.width>0 && local.bounds.height>0){
        // Remove the *actual* fully occluded region, not an imagined stripe.
        return subtract(region,local.bounds);
      }
      if(feature.separating)return cutAtFeature(region,local);
      return [region];
    });
  }
  return regions.filter(positive).sort((a,b)=>a.y-b.y || a.x-b.x);
}

// ---------------------------------------------------------------------------
// Reserved regions: the shape @nyc-tron/reserved-regions reports.
//
// Window-relative, in React Native layout units (points on iOS, dp on Android,
// CSS px on web). iOS 27.1 contributes UIKit reserved regions (division and
// occlusion). Android contributes Jetpack WindowManager FoldingFeatures as
// "division" regions plus the posture metadata WindowManager exposes.
// WindowManager has no continuous hinge angle; nothing here infers one.
// Ported from NYC-MON packages/ui/reserved-regions.types.ts.
// ---------------------------------------------------------------------------
export type FoldOrientation = "vertical" | "horizontal";
export type FoldState = "flat" | "halfOpened";
export type FoldOcclusionType = "none" | "full";

export interface ReservedRegion {
  kind: "division" | "occlusion";
  x: number;
  y: number;
  width: number;
  height: number;
  margins: { top: number; left: number; bottom: number; right: number };
  active: boolean;
  /** Android FoldingFeature orientation. Absent on UIKit regions. */
  orientation?: FoldOrientation;
  /** Android FoldingFeature state. Absent on UIKit regions. */
  state?: FoldState;
  /** Android FoldingFeature occlusion mode. Absent on UIKit regions. */
  occlusionType?: FoldOcclusionType;
  /**
   * Whether the feature makes two logical display areas: true for a physical
   * dual-screen hinge even while FLAT, and for HALF_OPENED folds.
   */
  separating?: boolean;
}

export type FoldPosture = "flat" | "book" | "tabletop";

/** One division region, normalized and in a pane row's local x. */
export interface FoldLayout {
  orientation: FoldOrientation;
  state: FoldState;
  posture: FoldPosture;
  occlusionType?: FoldOcclusionType | undefined;
  separating: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

const regionOrientation = (r: ReservedRegion): FoldOrientation =>
  r.orientation ?? (r.height >= r.width ? "vertical" : "horizontal");

// UIKit division regions carry no `separating`; their `active` flag is the
// equivalent signal, so an inactive zero-width Duo division never rearranges
// panes. FULL occlusion always separates, whatever a vendor's isSeparating says.
const regionSeparates = (r: ReservedRegion) =>
  (r.separating ?? r.active) || r.occlusionType === "full";

/**
 * Division regions as fold layouts, x relative to a row that starts at
 * `windowOriginX` in the window. Negative local x is kept: a fold wholly left
 * of a nested row must not become a phantom hinge on its leading edge.
 * UIKit regions lack orientation and state, so orientation is inferred from
 * the rect and state defaults to flat. Android metadata wins when present.
 */
export function foldLayoutsFromRegions(
  regions: readonly ReservedRegion[],
  windowOriginX = 0,
): FoldLayout[] {
  return regions
    .filter(r => r.kind === "division")
    .map((r): FoldLayout => {
      const orientation = regionOrientation(r);
      const state: FoldState = r.state ?? "flat";
      return {
        orientation, state,
        posture: state === "halfOpened" ? (orientation === "horizontal" ? "tabletop" : "book") : "flat",
        occlusionType: r.occlusionType,
        separating: regionSeparates(r),
        x: r.x - windowOriginX,
        y: r.y,
        width: Math.max(0, r.width),
        height: Math.max(0, r.height),
      };
    })
    .sort((a, b) => a.orientation === b.orientation
      ? (a.orientation === "vertical" ? a.x - b.x : a.y - b.y)
      : (a.orientation === "vertical" ? -1 : 1));
}

/** The first fold only, for layouts that can place a single boundary. */
export function foldLayoutFromRegions(
  regions: readonly ReservedRegion[],
  windowOriginX = 0,
): FoldLayout | null {
  return foldLayoutsFromRegions(regions, windowOriginX)[0] ?? null;
}

/**
 * Reserved regions as the FoldFeature list resolveUsableRegions and
 * resolvePanePlan take. Division regions only by default. Camera occlusion
 * regions (iOS `occlusion` kind) are opt-in: subtracting a camera housing
 * from the container fragments it, and the app's safe-area insets usually
 * cover that space already.
 */
export function foldFeaturesFromRegions(
  regions: readonly ReservedRegion[],
  options: { includeOcclusions?: boolean } = {},
): FoldFeature[] {
  const out: FoldFeature[] = [];
  for (const r of regions) {
    const bounds = { x: r.x, y: r.y, width: Math.max(0, r.width), height: Math.max(0, r.height) };
    if (r.kind === "division") {
      out.push({ bounds, orientation: regionOrientation(r), separating: regionSeparates(r),
        occlusion: r.occlusionType ?? "none" });
    } else if (options.includeOcclusions && r.active) {
      out.push({ bounds, orientation: regionOrientation(r), separating: false, occlusion: "full" });
    }
  }
  return out;
}

/**
 * Device posture from the separating folds: a half-opened horizontal fold is
 * tabletop, a half-opened vertical one is book, anything else is flat.
 */
export function foldPostureFromRegions(regions: readonly ReservedRegion[]): FoldPosture {
  const folded = foldLayoutsFromRegions(regions).find(f => f.separating && f.state === "halfOpened");
  return folded?.posture ?? "flat";
}

/** Folds that touch a row of `rowWidth`; zero-width creases count when inside it. */
export function foldLayoutsIntersectingRow(
  folds: readonly FoldLayout[],
  rowWidth: number | null,
): FoldLayout[] {
  if (rowWidth === null) return [];
  return folds.filter(fold => {
    const end = fold.x + Math.max(0, fold.width);
    return fold.x < rowWidth && (fold.width === 0 ? fold.x > 0 : end > 0);
  });
}

export interface VerticalFoldPanePlan {
  splitAfter: "primary" | "supplementary";
  primaryWidth: number;
  supplementaryWidth: number;
  gapWidth: number;
}
export interface VerticalFoldPanePlanInput {
  fold: FoldLayout | null;
  rowWidth: number | null;
  primaryVisible: boolean;
  supplementaryVisible: boolean;
  detailVisible: boolean;
  primaryWidth: number;
  supplementaryWidth: number;
  detailMinWidth: number;
  paneMinWidth: number;
}

/**
 * Snap a primary / supplementary / detail row to one separating vertical fold.
 * First choice keeps primary and supplementary on the leading region with
 * detail on the trailing one. Second choice puts primary alone on the leading
 * region and fits supplementary and detail on the trailing one. Returns null
 * when neither fits, so the caller keeps its width-class layout instead of
 * hiding a pane.
 */
export function resolveVerticalFoldPanePlan(input: VerticalFoldPanePlanInput): VerticalFoldPanePlan | null {
  const { fold, rowWidth, primaryVisible, supplementaryVisible, detailVisible,
    primaryWidth, supplementaryWidth, detailMinWidth, paneMinWidth } = input;
  if (!fold || !fold.separating || fold.orientation !== "vertical" || rowWidth === null || !detailVisible) return null;
  const gapWidth = Math.min(fold.width, Math.max(0, rowWidth - fold.x));
  const leadingWidth = Math.min(Math.max(0, fold.x), rowWidth);
  const trailingWidth = Math.max(0, rowWidth - leadingWidth - gapWidth);
  if (leadingWidth < paneMinWidth || trailingWidth < detailMinWidth) return null;

  if (supplementaryVisible) {
    const primaryOnLeading = primaryVisible ? primaryWidth : 0;
    const supplementaryOnLeading = leadingWidth - primaryOnLeading;
    if (supplementaryOnLeading >= paneMinWidth && (!primaryVisible || primaryOnLeading >= paneMinWidth)) {
      return { splitAfter: "supplementary", primaryWidth, supplementaryWidth: supplementaryOnLeading, gapWidth };
    }
    if (primaryVisible && trailingWidth >= paneMinWidth + detailMinWidth) {
      return {
        splitAfter: "primary", primaryWidth: leadingWidth,
        supplementaryWidth: Math.max(paneMinWidth, Math.min(supplementaryWidth, trailingWidth - detailMinWidth)),
        gapWidth,
      };
    }
    return null;
  }
  return primaryVisible ? { splitAfter: "primary", primaryWidth: leadingWidth, supplementaryWidth, gapWidth } : null;
}

export interface VerticalMultiFoldPanePlan {
  primaryWidth: number;
  supplementaryWidth: number;
  gapAfterPrimary: number;
  gapAfterSupplementary: number;
}
export interface VerticalMultiFoldPanePlanInput extends Omit<VerticalFoldPanePlanInput, "fold"> {
  folds: readonly FoldLayout[];
}

/**
 * Trifold planner: with three visible panes and at least two separating
 * vertical folds inside the row, pick the fold pair that puts one pane in each
 * physical region, closest to the authored primary and supplementary widths.
 * Two-pane rows use resolveVerticalFoldPanePlan.
 */
export function resolveVerticalMultiFoldPanePlan(input: VerticalMultiFoldPanePlanInput): VerticalMultiFoldPanePlan | null {
  const { folds, rowWidth, primaryVisible, supplementaryVisible, detailVisible,
    primaryWidth, supplementaryWidth, detailMinWidth, paneMinWidth } = input;
  if (rowWidth === null || !primaryVisible || !supplementaryVisible || !detailVisible) return null;
  const vertical = folds
    .filter(f => f.separating && f.orientation === "vertical" && f.x > 0 && f.x < rowWidth)
    .sort((a, b) => a.x - b.x);
  if (vertical.length < 2) return null;

  let best: (VerticalMultiFoldPanePlan & { score: number }) | null = null;
  for (let i = 0; i < vertical.length - 1; i += 1) {
    for (let j = i + 1; j < vertical.length; j += 1) {
      const first = vertical[i]!, second = vertical[j]!;
      const firstStart = Math.max(0, Math.min(rowWidth, first.x));
      const firstEnd = Math.max(firstStart, Math.min(rowWidth, first.x + first.width));
      const secondStart = Math.max(firstEnd, Math.min(rowWidth, second.x));
      const secondEnd = Math.max(secondStart, Math.min(rowWidth, second.x + second.width));
      const a = firstStart, b = secondStart - firstEnd, c = rowWidth - secondEnd;
      if (a < paneMinWidth || b < paneMinWidth || c < detailMinWidth) continue;
      const score = Math.abs(a - primaryWidth) + Math.abs(b - supplementaryWidth);
      if (!best || score < best.score) {
        best = { primaryWidth: a, supplementaryWidth: b,
          gapAfterPrimary: firstEnd - firstStart, gapAfterSupplementary: secondEnd - secondStart, score };
      }
    }
  }
  if (!best) return null;
  const { score: _score, ...plan } = best;
  return plan;
}

export interface TrailingInspectorLayout {
  width: number;
  edge: "left" | "right";
  /** Translation that parks the inspector fully beyond its trailing edge. */
  closedX: number;
}
export interface TrailingInspectorLayoutInput {
  folds: readonly FoldLayout[];
  rowWidth: number | null;
  preferredWidth: number;
  isRTL: boolean;
}

/**
 * Width and edge for an inspector that overlays from the logical trailing
 * edge. On a foldable its width is capped to the physical region on that side,
 * so it never covers the hinge or spills onto the other display.
 */
export function resolveTrailingInspectorLayout(input: TrailingInspectorLayoutInput): TrailingInspectorLayout {
  const { folds, rowWidth, preferredWidth, isRTL } = input;
  const edge: "left" | "right" = isRTL ? "left" : "right";
  let available = rowWidth ?? preferredWidth;
  if (rowWidth !== null) {
    const vertical = foldLayoutsIntersectingRow(folds, rowWidth)
      .filter(f => f.separating && f.orientation === "vertical")
      .sort((a, b) => a.x - b.x);
    if (vertical.length > 0) {
      if (isRTL) available = Math.min(Math.max(0, vertical[0]!.x), rowWidth);
      else {
        const last = vertical[vertical.length - 1]!;
        available = Math.max(0, rowWidth - Math.min(rowWidth, Math.max(0, last.x + last.width)));
      }
    }
  }
  const width = Math.max(0, Math.min(preferredWidth, available));
  // 20 units clear the edge shadow instead of leaving a sliver on screen.
  const travel = width + 20;
  return { width, edge, closedX: isRTL ? -travel : travel };
}
