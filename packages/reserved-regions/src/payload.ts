// Pure payload handling shared by the native and web hooks. No react-native
// import, so it runs under plain node tests.
import type { ReservedRegion } from "@nyc-tron/core/folds";

export type {
  FoldOcclusionType, FoldOrientation, FoldState, ReservedRegion,
} from "@nyc-tron/core/folds";

/** The JS name both native modules register under. */
export const NATIVE_MODULE_NAME = "NYCTronReservedRegions";

export const NO_REGIONS: readonly ReservedRegion[] = Object.freeze([]);

const finite = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

function isRegion(value: unknown): value is ReservedRegion {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<ReservedRegion>;
  return (r.kind === "division" || r.kind === "occlusion") &&
    finite(r.x) && finite(r.y) && finite(r.width) && finite(r.height) &&
    r.width >= 0 && r.height >= 0 && typeof r.active === "boolean";
}

/**
 * Native payload -> regions. The v2 `changed` event and `query()` both deliver
 * a bare array; `{ regions }` is accepted too so a classic-module build of the
 * same contract needs no hook change. Malformed entries are dropped instead of
 * reaching the planners, and nullable Android fields come through as absent.
 */
export function toRegions(payload: unknown): readonly ReservedRegion[] {
  const list = Array.isArray(payload) ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { regions?: unknown }).regions)
      ? (payload as { regions: unknown[] }).regions : null;
  if (!list) return NO_REGIONS;
  const out: ReservedRegion[] = [];
  for (const item of list) {
    if (!isRegion(item)) continue;
    const m = item.margins;
    const region: ReservedRegion = {
      kind: item.kind, x: item.x, y: item.y, width: item.width, height: item.height,
      margins: m && finite(m.top) && finite(m.left) && finite(m.bottom) && finite(m.right)
        ? { top: m.top, left: m.left, bottom: m.bottom, right: m.right }
        : { top: 0, left: 0, bottom: 0, right: 0 },
      active: item.active,
    };
    if (item.orientation === "vertical" || item.orientation === "horizontal") region.orientation = item.orientation;
    if (item.state === "flat" || item.state === "halfOpened") region.state = item.state;
    if (item.occlusionType === "none" || item.occlusionType === "full") region.occlusionType = item.occlusionType;
    if (typeof item.separating === "boolean") region.separating = item.separating;
    out.push(region);
  }
  return out.length ? out : NO_REGIONS;
}

/** Structural equality, so an unchanged report never re-renders a pane host. */
export function regionsEqual(a: readonly ReservedRegion[], b: readonly ReservedRegion[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((r, i) => {
    const s = b[i]!;
    return r.kind === s.kind && r.x === s.x && r.y === s.y && r.width === s.width &&
      r.height === s.height && r.active === s.active && r.orientation === s.orientation &&
      r.state === s.state && r.occlusionType === s.occlusionType && r.separating === s.separating &&
      r.margins.top === s.margins.top && r.margins.left === s.margins.left &&
      r.margins.bottom === s.margins.bottom && r.margins.right === s.margins.right;
  });
}
