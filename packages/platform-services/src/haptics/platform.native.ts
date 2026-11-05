import {findNativeModule} from "../native-module.ts";
import {createHaptics,type Haptics,type HapticsNative,type HapticsOptions} from "./haptics.ts";

/** Name both platforms register the haptics module under. */
export const HAPTICS_MODULE_NAME="NYCTronHaptics";

/**
 * {@linkcode Haptics} over the native module: UIFeedbackGenerator on iOS,
 * View.performHapticFeedback on Android. Create one per app and share it.
 */
export function createPlatformHaptics(options?:HapticsOptions):Haptics{
  return createHaptics(findNativeModule<HapticsNative>(HAPTICS_MODULE_NAME),options);
}
