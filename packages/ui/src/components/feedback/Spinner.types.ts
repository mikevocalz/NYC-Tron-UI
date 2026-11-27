import type { ComponentRef, Ref } from "react";
import type { View, ViewProps } from "react-native";

export type SpinnerSize="sm"|"md"|"lg";

/**
 * Props for `Spinner`. Fork support is noted per prop: "web" is the React
 * Native kit build (`Spinner.web`, also used on any host without Expo UI),
 * "native" is the Expo UI build (SwiftUI `ProgressView` on iOS, Compose
 * `CircularProgressIndicator` on Android).
 */
export interface SpinnerProps extends Omit<ViewProps,"children"|"role"|"accessibilityRole"> {
  /** web: the `ActivityIndicator` host. native: the RN wrapper around the Expo UI host. */
  ref?:Ref<ComponentRef<typeof View>>;
  /**
   * web: sm is the small indicator drawn at 80%, md the platform small one,
   * lg the platform large one. native: SwiftUI control size small/regular/large;
   * Compose 20/32/48dp. @default "md"
   */
  size?:SpinnerSize;
  /** What is loading, read by screen readers (both forks). Overridden by `accessibilityLabel`. @default "Loading" */
  label?:string;
  /**
   * Indicator color (both forks). React Native's `ActivityIndicator`, its web
   * build and the Expo UI indicators draw with a color value, not with CSS
   * text color, so a `text-*` class does not tint them. Leave unset to use the
   * platform default (SwiftUI and Compose follow the system or Host theme).
   */
  color?:string;
  /** web only: forwarded to Uniwind's ActivityIndicator color mapping (e.g. an `accent-*` class); plain React Native ignores it. */
  colorClassName?:string;
  /** native only: appearance for the Expo UI subtree. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  /** web: on the indicator. native: on the RN wrapper. */
  className?:string;
  /** The spinner ships no visual classes of its own in either fork; kept for API symmetry. */
  unstyled?:boolean;
}

export const SPINNER_SIZES:readonly SpinnerSize[]=["sm","md","lg"];

/** Throws a RangeError for a size outside {@linkcode SPINNER_SIZES}. */
export function assertSpinnerSize(size:string):asserts size is SpinnerSize{
  if(!(SPINNER_SIZES as readonly string[]).includes(size))throw new RangeError(`Unknown spinner size ${size}`);
}
