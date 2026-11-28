import type { TronThemeProviderProps } from "./TronThemeProvider.types.ts";
import { TronThemeProviderBase, useTronTheme } from "./TronThemeProvider.shared.tsx";
export type { TronColorSchemePreference, TronResolvedColorScheme, TronThemeContextValue, TronThemeProviderProps } from "./TronThemeProvider.types.ts";
export { useTronTheme };

/**
 * Optional theme provider (web build). Applies a `TronTheme` to its subtree:
 * Uniwind's `ScopedVariables` renders a `display: contents` element whose
 * inline style sets every Tron token and the `--expo-ui-*` variables, so
 * every component below, including @expo/ui's universal Switch, Checkbox and
 * TextInput, resolves the theme's colors through the CSS cascade. Without a
 * `theme` it uses `tronLightTheme` or `tronDarkTheme` for `colorScheme`.
 *
 * The app's stylesheet must still declare the tokens (for example by
 * importing `@nyc-tron/core/theme.css`) so Tailwind generates the utilities
 * the components use. Apps that define their own CSS variables do not need
 * this provider.
 */
export function TronThemeProvider(props:TronThemeProviderProps) {
  return <TronThemeProviderBase {...props} platform="web"/>;
}
