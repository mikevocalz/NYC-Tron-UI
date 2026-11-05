import {findNativeModule} from "../native-module.ts";
import {HAPTICS_MODULE_NAME} from "../module-names.ts";
import {createHaptics,type Haptics,type HapticsNative,type HapticsOptions} from "./haptics.ts";

export {HAPTICS_MODULE_NAME} from "../module-names.ts";

/**
 * {@linkcode Haptics} over the native module: UIFeedbackGenerator on iOS,
 * View.performHapticFeedback on Android. Create one per app and share it.
 */
export function createPlatformHaptics(options?:HapticsOptions):Haptics{
  return createHaptics(findNativeModule<HapticsNative>(HAPTICS_MODULE_NAME),options);
}
