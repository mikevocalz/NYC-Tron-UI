import type {ReactNode} from "react";
import type {Rect2D} from "./popover-position.ts";

/**
 * Handed to a trigger render function. Spread `triggerProps` onto the
 * pressable so screen readers hear that it opens a dialog and whether it is
 * open, and call `toggle` from its press handler.
 * @see {@linkcode PopoverTriggerProps.trigger}
 */
export interface PopoverTriggerState{
  readonly open:boolean;
  /** Opens a closed popover and closes an open one, through `onOpenChange`. */
  readonly toggle:()=>void;
  readonly triggerProps:{
    readonly accessibilityState:{readonly expanded:boolean};
    readonly "aria-expanded":boolean;
    readonly "aria-haspopup":"dialog";
  };
}

/** Props every popover form shares. */
export interface PopoverBaseProps{
  /** Controlled visibility. */
  readonly open:boolean;
  /** Called with `false` when the OS or the user dismisses the popover, and by `toggle` in the trigger form. */
  readonly onOpenChange:(open:boolean)=>void;
  /** Accessible name of the popover surface. */
  readonly accessibilityLabel:string;
  /** React Native content. */
  readonly children:ReactNode;
  /** Preferred width in points; clamped to the usable region. @default 320 */
  readonly width?:number;
  /** Preferred maximum height in points; clamped to the usable region. @default 420 */
  readonly maxHeight?:number;
  /** Web only: classes for the surface. Native surfaces are drawn by the OS. */
  readonly className?:string;
  readonly testID?:string;
}

/**
 * Rect form (the original contract): the app measured the anchor itself.
 * `anchor` and `usableRegions` are in the coordinate space of the view that
 * contains the popover (normally the screen root).
 */
export interface PopoverAnchorProps extends PopoverBaseProps{
  readonly anchor:Rect2D;
  /** Nonoccluded regions from the foldable layout owner; never infer a hinge from width. */
  readonly usableRegions:readonly Rect2D[];
  readonly trigger?:undefined;
}

/**
 * Trigger form: the popover renders `trigger`, measures it in window
 * coordinates each time it opens and anchors itself to it. Mount it where the
 * trigger belongs, not at the screen root.
 */
export interface PopoverTriggerProps extends PopoverBaseProps{
  /** The element that opens the popover, or a function of {@linkcode PopoverTriggerState}. */
  readonly trigger:ReactNode|((state:PopoverTriggerState)=>ReactNode);
  /**
   * Window-space nonoccluded regions from the foldable layout owner.
   * @default the whole window, as one region
   */
  readonly usableRegions?:readonly Rect2D[];
  readonly anchor?:undefined;
}

/** Either form; `anchor` and `trigger` are mutually exclusive. */
export type PopoverProps=PopoverAnchorProps|PopoverTriggerProps;

/** Builds the {@linkcode PopoverTriggerState} a trigger render function receives. */
export function popoverTriggerState(open:boolean,onOpenChange:(open:boolean)=>void):PopoverTriggerState{
  return {open,toggle:()=>onOpenChange(!open),
    triggerProps:{accessibilityState:{expanded:open},"aria-expanded":open,"aria-haspopup":"dialog"}};
}

/** Renders a trigger node or calls a trigger render function. */
export function renderPopoverTrigger(trigger:PopoverTriggerProps["trigger"],state:PopoverTriggerState):ReactNode{
  return typeof trigger==="function"?trigger(state):trigger;
}

/** Narrows {@linkcode PopoverProps} to the trigger form. Throws when both or neither of `anchor` and `trigger` are set. */
export function isTriggerPopover(props:PopoverProps):props is PopoverTriggerProps{
  const hasTrigger=props.trigger!==undefined,hasAnchor=props.anchor!==undefined;
  if(hasTrigger===hasAnchor)throw new TypeError("A popover takes exactly one of `anchor` or `trigger`");
  return hasTrigger;
}
