import { useEffect, useRef } from "react";
import { AccessibilityInfo, Platform } from "react-native";

/**
 * Speak `text` at low priority after current speech. react-native-web has no
 * `announceForAccessibilityWithOptions`; calling it there threw inside an
 * effect and unmounted the whole screen, so fall back to the plain call.
 */
export function announce(text: string): void {
  const info: Partial<typeof AccessibilityInfo> = AccessibilityInfo;
  if (typeof info.announceForAccessibilityWithOptions === "function") {
    info.announceForAccessibilityWithOptions(text, { queue: true, priority: "low" });
  } else {
    info.announceForAccessibility?.(text);
  }
}

/**
 * Announce `status` on iOS each time it changes after mount. Android and web
 * already speak it through the `accessibilityLiveRegion` on the status text;
 * VoiceOver ignores live regions, so without this it heard no phase change.
 */
export function useStatusAnnouncement(status: string): void {
  const previous = useRef(status);
  useEffect(() => {
    if (previous.current === status) return;
    previous.current = status;
    if (Platform.OS === "ios") announce(status);
  }, [status]);
}
