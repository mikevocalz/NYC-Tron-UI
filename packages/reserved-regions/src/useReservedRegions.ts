// Web fold geometry: the Viewport Segments API (`window.viewport.segments`,
// Chrome on Android 138+) plus the Device Posture API where present,
// normalized into the ReservedRegion shape iOS and Android report. Without
// `window.viewport` the browser is hinge-blind and the hook answers no regions;
// callers fall back to width classes. A ReservedRegionsOverride still wins.
// Ported from NYC-MON packages/ui/reserved-regions.web.ts. Unlike that file,
// the snapshot is cached by value: useSyncExternalStore requires a stable
// result between changes, and a fresh array per read loops forever.
import { useSyncExternalStore } from "react";
import type { FoldState, ReservedRegion } from "@nyc-tron/core/folds";
import { NO_REGIONS, regionsEqual } from "./payload.ts";
import { useReservedRegionsOverride } from "./ReservedRegionsOverride.tsx";

// The DOM lib ships no ViewportSegments / DevicePosture types yet; declare
// exactly the surface read below.
export interface ViewportSegmentRect {
  readonly left: number; readonly right: number; readonly top: number;
  readonly bottom: number; readonly width: number; readonly height: number;
}
interface ViewportWithSegments extends EventTarget { readonly segments: readonly ViewportSegmentRect[] | null }
interface DevicePostureLike extends EventTarget { readonly type: "continuous" | "folded" | "flat" }

const viewportOf = () => typeof window === "undefined" ? undefined
  : (window as Window & { viewport?: ViewportWithSegments }).viewport;
const postureOf = () => typeof navigator === "undefined" ? undefined
  : (navigator as Navigator & { devicePosture?: DevicePostureLike }).devicePosture;

/**
 * Segments -> division regions. The gap between consecutive segments is the
 * hinge. Side-by-side segments give a vertical hinge (book when folded),
 * stacked segments a horizontal one (tabletop). A flat fold is one continuous
 * surface: the division is reported but does not separate.
 */
export function regionsFromSegments(
  segments: readonly ViewportSegmentRect[] | null | undefined,
  folded: boolean,
): readonly ReservedRegion[] {
  if (!segments || segments.length < 2) return NO_REGIONS;
  const state: FoldState = folded ? "halfOpened" : "flat";
  const margins = { top: 0, left: 0, bottom: 0, right: 0 };
  const out: ReservedRegion[] = [];
  for (let i = 0; i < segments.length - 1; i += 1) {
    const a = segments[i]!, b = segments[i + 1]!;
    if (a.bottom <= b.top || b.bottom <= a.top) {
      const [upper, lower] = a.top <= b.top ? [a, b] : [b, a];
      const left = Math.min(a.left, b.left);
      out.push({ kind: "division", x: left, y: upper.bottom,
        width: Math.max(a.right, b.right) - left, height: Math.max(0, lower.top - upper.bottom),
        margins, active: folded, orientation: "horizontal", state, separating: folded });
    } else {
      const [first, second] = a.left <= b.left ? [a, b] : [b, a];
      const top = Math.min(a.top, b.top);
      out.push({ kind: "division", x: first.right, y: top,
        width: Math.max(0, second.left - first.right), height: Math.max(a.bottom, b.bottom) - top,
        margins, active: folded, orientation: "vertical", state, separating: folded });
    }
  }
  return out;
}

let cached: readonly ReservedRegion[] = NO_REGIONS;
function snapshot(): readonly ReservedRegion[] {
  const next = regionsFromSegments(viewportOf()?.segments, postureOf()?.type === "folded");
  if (!regionsEqual(cached, next)) cached = next;
  return cached;
}
function subscribe(onChange: () => void): () => void {
  const viewport = viewportOf();
  const posture = postureOf();
  window.addEventListener("resize", onChange);
  viewport?.addEventListener?.("change", onChange);
  posture?.addEventListener?.("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    viewport?.removeEventListener?.("change", onChange);
    posture?.removeEventListener?.("change", onChange);
  };
}

/** True when the browser reports viewport segments at all. */
export function isReservedRegionsAvailable(): boolean {
  return viewportOf() !== undefined;
}

/** The window's fold divisions in CSS px; empty when the browser is hinge-blind. */
export function useReservedRegions(): readonly ReservedRegion[] {
  const override = useReservedRegionsOverride();
  const regions = useSyncExternalStore(subscribe, snapshot, () => NO_REGIONS);
  return override ?? regions;
}
