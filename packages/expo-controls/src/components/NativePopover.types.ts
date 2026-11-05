import type { ReactNode } from "react";
import type { Rect2D } from "@nyc-tron/ui/components/overlays/popover-position";
export type { Rect2D } from "@nyc-tron/ui/components/overlays/popover-position";

/**
 * One contract on every platform, the same one placePopover takes.
 *
 * `anchor` and `usableRegions` are in the coordinate space of the view that
 * contains the NativePopover (normally the screen root): mount it there, not
 * inside the trigger. Pass the nonoccluded regions from the foldable layout
 * owner; never infer a hinge from width.
 */
export interface NativePopoverProps {
  /** Controlled visibility. */
  readonly open: boolean;
  /** Called with `false` when the OS or the user dismisses the popover. */
  readonly onOpenChange: (open: boolean) => void;
  readonly anchor: Rect2D;
  readonly usableRegions: readonly Rect2D[];
  /** Accessible name of the popover surface. */
  readonly accessibilityLabel: string;
  /** React Native content. Hosted inside the native popover on iOS and Android. */
  readonly children: ReactNode;
  /** Preferred width in points; clamped to the usable region. */
  readonly width?: number;
  /** Preferred maximum height in points; clamped to the usable region. */
  readonly maxHeight?: number;
  /** Web only: classes for the surface. Native surfaces are drawn by the OS. */
  readonly className?: string;
  readonly testID?: string;
}

/** Native side preference derived from placePopover's result. */
export function swiftUIPopoverEdges(side: "below" | "above" | "overlap"): {
  attachmentAnchor: "bottom" | "top";
  arrowEdge: "top" | "bottom" | "none";
} {
  if (side === "above") return { attachmentAnchor: "top", arrowEdge: "bottom" };
  if (side === "below") return { attachmentAnchor: "bottom", arrowEdge: "top" };
  return { attachmentAnchor: "bottom", arrowEdge: "none" };
}
