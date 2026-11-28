import { expoUiCssVariables, themeCssVariables, type TronTheme } from "@nyc-tron/core/theme";
import { tronDarkTheme, tronLightTheme } from "@nyc-tron/core/presets/tron";

/** What `TronThemeProvider` follows: a fixed appearance, or the system's. */
export type TronColorSchemePreference="light"|"dark"|"system";
/** The appearance a provider resolved to. */
export type TronResolvedColorScheme="light"|"dark";

/**
 * The appearance for a preference. `system` follows React Native's
 * `useColorScheme()` value; an unknown system value (`null`, `"unspecified"`)
 * falls back to light, as Uniwind does.
 */
export function resolveTronColorScheme(preference:TronColorSchemePreference,system:string|null|undefined):TronResolvedColorScheme {
  if(preference==="light"||preference==="dark")return preference;
  if(preference!=="system")throw new RangeError(`Unknown color scheme ${String(preference)}`);
  return system==="dark"?"dark":"light";
}

/** An explicit theme always wins; otherwise the default theme for the appearance. */
export function resolveTronTheme(theme:TronTheme|undefined,scheme:TronResolvedColorScheme):TronTheme {
  return theme??(scheme==="dark"?tronDarkTheme:tronLightTheme);
}

/**
 * CSS variables a provider sets on its subtree: every Tron token the theme
 * defines and, on web, the `--expo-ui-*` variables @expo/ui's universal
 * components read. Native @expo/ui controls draw with platform colors and
 * read no CSS variables, so native gets the Tron tokens only.
 */
export function tronProviderVariables(theme:TronTheme,platform:"web"|"native"):Readonly<Record<string,string>> {
  return Object.freeze(platform==="web"
    ?{...themeCssVariables(theme),...expoUiCssVariables(theme)}
    :{...themeCssVariables(theme)});
}
