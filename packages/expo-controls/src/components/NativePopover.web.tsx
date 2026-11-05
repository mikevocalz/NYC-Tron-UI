import { AnchoredPopover } from "@nyc-tron/ui/components/overlays/AnchoredPopover";
import type { NativePopoverProps } from "./NativePopover.types.ts";
export type {
  NativePopoverProps, NativePopoverAnchorProps, NativePopoverTriggerProps, NativePopoverTriggerState,
} from "./NativePopover.types.ts";

/**
 * RN web presentation: the kit's AnchoredPopover, placed by placePopover in
 * the caller's usable regions. Tab and Shift+Tab cycle through the popover's
 * own focusable content, Escape closes, the backdrop closes on pointer press,
 * and focus returns to the element that opened it. Takes either an `anchor`
 * rect or a `trigger` it measures on open.
 */
export function NativePopover(props:NativePopoverProps){
  return <AnchoredPopover {...props}/>;
}
