import type { ComponentRef, Ref } from "react";
import type { View, ViewProps } from "react-native";
import { progressA11y, type ProgressA11y, type ProgressValueContext } from "./progress-model.ts";
export type { ProgressValueContext } from "./progress-model.ts";

export type ProgressBarTone="default"|"success"|"danger";
export type ProgressBarSize="sm"|"md"|"lg";

/**
 * Props for `ProgressBar`. Either `label` or `accessibilityLabel` is required.
 * Fork support is noted per prop: "web" is the React Native kit build
 * (`ProgressBar.web`), "native" the Expo UI build (SwiftUI linear
 * `ProgressView` on iOS, Compose `LinearProgressIndicator` on Android). The
 * native build falls back to the kit bar for indeterminate progress while
 * reduce motion is on.
 */
export interface ProgressBarProps extends Omit<ViewProps,"children"|"role"|"accessibilityRole"|"accessibilityValue"> {
  /** The root view in both forks. */
  ref?:Ref<ComponentRef<typeof View>>;
  /** Current value in `min..max`; clamped. Leave unset (or set `indeterminate`) when the end is unknown. */
  value?:number;
  /** @default 0 */
  min?:number;
  /** @default 100 */
  max?:number;
  /** Shows a moving segment instead of a value, and reports busy. */
  indeterminate?:boolean;
  /** Visible label above the track (RN text in both forks), also the accessible name. */
  label?:string;
  /** Shows the spoken value text at the end of the label row. Ignored while indeterminate. @default false */
  showValue?:boolean;
  /** Formats the value for screen readers and `showValue`. @default whole percent, e.g. "45%" */
  valueText?:(value:number,context:ProgressValueContext)=>string;
  /** Spoken while indeterminate. @default "Loading" */
  busyText?:string;
  /**
   * web: fill color `bg-primary`, `bg-success` or `bg-danger`. native: ignored,
   * the OS tint (or `color`) is used, because app tokens are CSS variables.
   * Never the only signal: pair a non-default tone with words in `label`.
   * @default "default"
   */
  tone?:ProgressBarTone;
  /** web: track height 4, 8 or 12 points. native: ignored (OS bar height). @default "md" */
  size?:ProgressBarSize;
  /** native only: indicator color for SwiftUI `tint` / Compose `color`. Leave unset for the OS tint. */
  color?:string;
  /** native only: appearance for the Expo UI subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /** Root view in both forks. */
  className?:string;
  /** Visible label text in both forks. */
  labelClassName?:string;
  /** Visible value text in both forks. */
  valueClassName?:string;
  /** web only (and the native reduced-motion fallback). */
  trackClassName?:string;
  /** web only (and the native reduced-motion fallback). */
  fillClassName?:string;
  /** Drops the default classes from the RN parts (label row in both forks; track and fill on web). */
  unstyled?:boolean;
}

export const PROGRESS_BAR_HEIGHT:Record<ProgressBarSize,number>={sm:4,md:8,lg:12};

/** Validated name, track height and accessibility values for a ProgressBar. */
export interface ResolvedProgressBar { readonly name:string; readonly height:number; readonly a11y:ProgressA11y }

/**
 * Shared validation for both forks. Throws a RangeError when `min >= max`,
 * when a bound or the value is not finite, or for an unknown size, and a
 * TypeError when there is no label in words.
 */
export function resolveProgressBar({value,min=0,max=100,indeterminate,label,accessibilityLabel,valueText,busyText,size="md"}:ProgressBarProps):ResolvedProgressBar{
  const name=accessibilityLabel??label;
  if(!name?.trim())throw new TypeError("ProgressBar needs a label or accessibilityLabel");
  const height=PROGRESS_BAR_HEIGHT[size];
  if(height===undefined)throw new RangeError(`Unknown progress bar size ${String(size)}`);
  return {name,height,a11y:progressA11y({value,min,max,indeterminate,label:name,valueText,busyText})};
}
