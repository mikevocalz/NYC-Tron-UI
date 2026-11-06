import type {
  PopoverAnchorProps, PopoverProps, PopoverTriggerProps, PopoverTriggerState,
} from "@nyc-tron/ui/components/overlays/anchored-popover-types";
export type { Rect2D } from "@nyc-tron/ui/components/overlays/popover-position";

/**
 * One contract on every platform, in two forms:
 *
 * - **Rect form** (`anchor` + `usableRegions`): the original API. Both are in
 *   the coordinate space of the view that contains the NativePopover
 *   (normally the screen root): mount it there, not inside the trigger.
 * - **Trigger form** (`trigger`): the popover renders the trigger, measures
 *   it when it opens and anchors itself to it, so the app never measures.
 *   Mount it where the trigger belongs. `usableRegions` is optional here and
 *   defaults to the whole window; on a foldable pass the layout owner's
 *   window-space regions.
 *
 * Pass the nonoccluded regions from the foldable layout owner; never infer a
 * hinge from width.
 */
export type NativePopoverProps=PopoverProps;
/** The rect form of {@linkcode NativePopoverProps}. */
export type NativePopoverAnchorProps=PopoverAnchorProps;
/** The trigger form of {@linkcode NativePopoverProps}. */
export type NativePopoverTriggerProps=PopoverTriggerProps;
/** What a {@linkcode NativePopoverTriggerProps.trigger} render function receives. */
export type NativePopoverTriggerState=PopoverTriggerState;

/** Native side preference derived from placePopover's result. */
export function swiftUIPopoverEdges(side: "below" | "above" | "overlap"): {
  attachmentAnchor: "bottom" | "top";
  arrowEdge: "top" | "bottom" | "none";
} {
  if (side === "above") return { attachmentAnchor: "top", arrowEdge: "bottom" };
  if (side === "below") return { attachmentAnchor: "bottom", arrowEdge: "top" };
  return { attachmentAnchor: "bottom", arrowEdge: "none" };
}
