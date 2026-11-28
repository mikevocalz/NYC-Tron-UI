import type { TronThemeProviderProps } from "./TronThemeProvider.types.ts";
import { TronThemeProviderBase, useTronTheme } from "./TronThemeProvider.shared.tsx";
export type { TronColorSchemePreference, TronResolvedColorScheme, TronThemeContextValue, TronThemeProviderProps } from "./TronThemeProvider.types.ts";
export { useTronTheme };

/**
 * Optional theme provider (iOS and Android build). Applies a `TronTheme` to
 * its subtree through Uniwind's `ScopedVariables`: Uniwind resolves `className`
 * utilities below it against the theme's Tron tokens, and tokens the theme
 * leaves out fall through to the app's Uniwind theme. Native @expo/ui
 * controls (SwiftUI, Compose) draw with platform colors and do not read CSS
 * variables. With a Uniwind older than ScopedVariables the theme is only
 * available through `useTronTheme()`.
 *
 * The app's Uniwind stylesheet must declare the tokens (for example by
 * importing `@nyc-tron/core/theme.css`) so the utilities exist.
 */
export function TronThemeProvider(props:TronThemeProviderProps) {
  return <TronThemeProviderBase {...props} platform="native"/>;
}
