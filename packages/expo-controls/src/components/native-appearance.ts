/** Appearance options supported by an Expo Host owned by a control. */
export interface NativeAppearanceProps {
  /**
   * Apply the app's explicit appearance to the native control subtree.
   * Omit this to follow the platform setting. Surrounding RN content and
   * token-styled web fallbacks continue to use the app's own theme.
   */
  readonly colorScheme?: "light" | "dark";
}
