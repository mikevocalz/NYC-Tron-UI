import { Platform } from "react-native";

/**
 * Web semantics for a toggle button. React Native's `togglebutton` role is
 * right on iOS and Android, but React Native Web passes it through as an
 * unknown ARIA role, so browsers and screen readers see no button. On web
 * this returns `role="button"` plus `aria-pressed`, which React Native Web
 * reads ahead of `accessibilityRole`. Native gets nothing, because `role`
 * would override `togglebutton` there too.
 */
export function webToggleProps(pressed: boolean): Record<string, unknown> {
  return Platform.OS === "web" ? { role: "button", "aria-pressed": pressed } : {};
}
