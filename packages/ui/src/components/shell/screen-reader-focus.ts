import {AccessibilityInfo,Platform} from "react-native";

/**
 * Moves the screen reader's cursor to `target`, e.g. the heading of a pane
 * that just opened or the first field of a sheet, so VoiceOver and TalkBack
 * start reading there instead of where the person last tapped.
 *
 * Native: AccessibilityInfo.sendAccessibilityEvent(target, "focus"), which
 * moves VoiceOver/TalkBack focus without changing keyboard focus. Web: the
 * element's own focus(), which screen readers follow; give the element
 * `tabIndex={-1}` (RN Web `focusable`) when it is not otherwise focusable.
 *
 * Returns false when `target` is null (not mounted yet), so a caller can try
 * again after layout instead of failing silently.
 */
export function focusForScreenReader(target:unknown):boolean{
  if(!target)return false;
  if(Platform.OS==="web"){
    const el=target as {focus?:(options?:{preventScroll?:boolean})=>void};
    if(typeof el.focus!=="function")return false;
    el.focus({preventScroll:false});
    return true;
  }
  AccessibilityInfo.sendAccessibilityEvent(target as Parameters<typeof AccessibilityInfo.sendAccessibilityEvent>[0],"focus");
  return true;
}
