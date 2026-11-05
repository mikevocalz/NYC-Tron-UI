/**
 * What a haptic says, not how hard the motor runs. Each platform maps a kind
 * to its own feedback: UIFeedbackGenerator styles on iOS,
 * HapticFeedbackConstants on Android.
 *
 * - `selection`: the value or item under the finger changed.
 * - `detent`: a scrubber or knob crossed a snap point.
 * - `light` / `medium` / `heavy`: a physical-feeling impact, e.g. a panel docking.
 * - `success` / `warning` / `error`: the outcome of an action.
 * - `gesture-start` / `gesture-end`: a drag picked something up or let it go.
 */
export type HapticKind="selection"|"detent"|"light"|"medium"|"heavy"|"success"|"warning"|"error"|"gesture-start"|"gesture-end";

/** Every {@linkcode HapticKind}, for validation and settings screens. */
export const HAPTIC_KINDS:readonly HapticKind[]=["selection","detent","light","medium","heavy","success","warning","error","gesture-start","gesture-end"];

/** True when `value` is a {@linkcode HapticKind}. */
export function isHapticKind(value:unknown):value is HapticKind{
  return typeof value==="string"&&(HAPTIC_KINDS as readonly string[]).includes(value);
}
