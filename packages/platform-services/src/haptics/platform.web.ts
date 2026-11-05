import {createHaptics,type Haptics,type HapticsOptions} from "./haptics.ts";

/** Name both native platforms register the haptics module under. */
export const HAPTICS_MODULE_NAME="NYCTronHaptics";

/**
 * Web has no haptics the kit relies on (`navigator.vibrate` is absent on iOS
 * Safari and desktop), so `isAvailable` is false and `play` does nothing.
 * The opt-out still persists, so one settings screen serves every platform.
 */
export function createPlatformHaptics(options?:HapticsOptions):Haptics{
  return createHaptics(null,options);
}
