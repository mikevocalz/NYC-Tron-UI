import type { ReactElement } from "react";
import type { NativeAppearanceProps } from "./native-appearance.ts";

/**
 * Short supplementary text for a control.
 *
 * - Android: Material 3 plain tooltip (Compose `TooltipBox`), shown on
 *   long-press and hover; TalkBack also gets the text as the anchor's hint.
 * - iOS: there is no touch tooltip on iPhone or iPad, so nothing is drawn.
 *   The text becomes the anchor's `accessibilityHint`, which VoiceOver reads
 *   after the label. Never put information only here that sighted touch
 *   users need.
 * - Web: shown after a hover or keyboard-focus delay, hidden on leave, blur
 *   or Escape, and linked to the anchor with `aria-describedby`.
 * - QNX/Marathon: a measured RN tooltip after hover, keyboard focus or a
 *   stationary touch delay. Escape, leaving the anchor or moving the touch
 *   dismisses it. The full text also becomes the anchor's accessibility hint.
 */
export interface TooltipProps extends NativeAppearanceProps {
  readonly label: string;
  /** One control element; the tooltip text is attached to it. */
  readonly children: ReactElement;
  /** Web and Qt: hover/focus delay before showing, in ms. Qt also uses it for touch. */
  readonly delayMs?: number;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export const DEFAULT_TOOLTIP_DELAY_MS=500;

export function validateTooltipLabel(label:string):string{
  const text=typeof label==="string"?label.trim():"";
  if(!text)throw new TypeError("Tooltip label required");
  return text;
}
