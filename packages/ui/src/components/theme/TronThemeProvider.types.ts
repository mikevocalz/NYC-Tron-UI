import type { ReactNode } from "react";
import type { TronTheme } from "@nyc-tron/core/theme";
import type { TronColorSchemePreference, TronResolvedColorScheme } from "./theme-provider-model.ts";
export type { TronColorSchemePreference, TronResolvedColorScheme } from "./theme-provider-model.ts";

/** Props for `TronThemeProvider`. */
export interface TronThemeProviderProps {
  /**
   * The theme for the subtree. Build one with `createTronTheme` from
   * `@nyc-tron/core/theme`. When set it is used as-is in every appearance;
   * pick a light or dark theme yourself if you have both.
   * @default `tronLightTheme`, or `tronDarkTheme` when the resolved scheme is dark
   */
  theme?:TronTheme;
  /**
   * Which default theme to use when `theme` is unset. `system` follows
   * React Native's `useColorScheme()`. Also reported as `colorScheme` by
   * `useTronTheme()`.
   * @default "system"
   */
  colorScheme?:TronColorSchemePreference;
  children?:ReactNode;
}

/** What `useTronTheme()` returns inside a provider. */
export interface TronThemeContextValue {
  /** The validated theme the provider applies. */
  readonly theme:TronTheme;
  /** The resolved appearance: the `colorScheme` prop, or the system's for `system`. */
  readonly colorScheme:TronResolvedColorScheme;
  /** The CSS variables the provider sets on its subtree on this platform. */
  readonly variables:Readonly<Record<string,string>>;
}
