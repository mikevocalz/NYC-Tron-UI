import {useKeySource,type UseHardwareKeyboardOptions} from "./useHardwareKeyboard.ts";
import {nativeKeySource} from "./native-source.ts";

export {isHardwareKeysAvailable,getHardwareKeyRecorder,addHardwareKeyListener} from "./native-source.ts";

/**
 * Runs the {@linkcode UseHardwareKeyboardOptions.map} command for each
 * hardware keydown the native module intercepts. A no-op when the module is
 * not linked or the OS cannot deliver keys (Android before 9).
 */
export function useHardwareKeyboard(options:UseHardwareKeyboardOptions):void{
  useKeySource(nativeKeySource(),options);
}
