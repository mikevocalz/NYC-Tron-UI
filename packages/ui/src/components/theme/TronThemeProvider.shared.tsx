import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import * as Uniwind from "uniwind";
import type { TronThemeContextValue, TronThemeProviderProps } from "./TronThemeProvider.types.ts";
import { resolveTronColorScheme, resolveTronTheme, tronProviderVariables } from "./theme-provider-model.ts";

const TronThemeContext=createContext<TronThemeContextValue|null>(null);

/**
 * The nearest `TronThemeProvider`'s theme, resolved appearance and CSS
 * variables, or `null` when no provider is above. `null` means the app's own
 * CSS variables are in charge, which is the default way to theme NYC-Tron.
 */
export function useTronTheme():TronThemeContextValue|null {
  return useContext(TronThemeContext);
}

// Uniwind is an optional peer. ScopedVariables is in the 1.13.2 this
// repository builds with; read it off the namespace so an older Uniwind
// still loads, with context only.
type ScopedVariablesComponent=(props:{variables:Record<string,string>;children?:ReactNode})=>ReactNode;
const ScopedVariables=(Uniwind as unknown as {ScopedVariables?:ScopedVariablesComponent}).ScopedVariables;

export function TronThemeProviderBase({theme,colorScheme="system",children,platform}:TronThemeProviderProps&{platform:"web"|"native"}) {
  const system=useColorScheme();
  const scheme=resolveTronColorScheme(colorScheme,system);
  const resolved=resolveTronTheme(theme,scheme);
  const value=useMemo<TronThemeContextValue>(()=>({
    theme:resolved,colorScheme:scheme,variables:tronProviderVariables(resolved,platform),
  }),[resolved,scheme,platform]);
  return (
    <TronThemeContext.Provider value={value}>
      {ScopedVariables?<ScopedVariables variables={value.variables as Record<string,string>}>{children}</ScopedVariables>:children}
    </TronThemeContext.Provider>
  );
}
