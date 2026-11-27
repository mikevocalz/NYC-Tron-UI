import { KitProgressBar } from "./ProgressBar.shared.tsx";
import type { ProgressBarProps } from "./ProgressBar.types.ts";
export type { ProgressBarProps, ProgressBarSize, ProgressBarTone, ProgressValueContext } from "./ProgressBar.types.ts";

/**
 * Linear progress, web and kit build: React Native views styled with theme
 * tokens (track `bg-surface-sunken`, fill `bg-primary` / `bg-success` /
 * `bg-danger`). Exposes `progressbar` with min, max, now and a value text;
 * indeterminate progress reports busy and drops `now`. The fill grows from
 * the start edge, so it runs right to left in RTL. Indeterminate progress
 * slides a segment with React Native `Animated`, and shows a still segment
 * while reduce motion is on.
 */
export function ProgressBar(props:ProgressBarProps) {
  return <KitProgressBar {...props}/>;
}
