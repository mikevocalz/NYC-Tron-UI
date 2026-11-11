import { I18nManager, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

/** Explicit app direction wins; an unspecified island uses the RN host locale. */
export function nativeIsRTL(style?: StyleProp<ViewStyle>): boolean {
  const direction = StyleSheet.flatten(style)?.direction;
  return direction === "rtl" || (direction !== "ltr" && I18nManager.isRTL);
}
