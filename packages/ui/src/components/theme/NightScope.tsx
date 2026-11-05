import type { ReactNode } from "react";
import { ScopedTheme } from "uniwind";

/** Props for {@linkcode NightScope}. */
export interface NightScopeProps {
  children:ReactNode;
  /**
   * The app's Uniwind theme name to resolve inside the subtree. Forge's dark
   * editor surfaces use the default.
   * @default "dark"
   */
  scheme?:string;
}

/**
 * Scheme scope: every token inside resolves at `scheme`'s value regardless of
 * the page's appearance, so a dark editor surface on a light page keeps its
 * text legible. It delegates to Uniwind's ScopedTheme (an optional peer): on
 * native that resolves the theme's variables for the subtree, and on web it
 * wraps the subtree in a `display: contents` element carrying the theme's
 * class, which the app's theme CSS must scope (`.dark { --color-...: ... }`).
 * Apps on another Tailwind runtime supply their own scope instead of
 * importing this subpath.
 */
export function NightScope({children,scheme="dark"}:NightScopeProps) {
  // ThemeName is declared by the app's generated Uniwind types; the kit cannot see it.
  return <ScopedTheme theme={scheme as never}>{children}</ScopedTheme>;
}
