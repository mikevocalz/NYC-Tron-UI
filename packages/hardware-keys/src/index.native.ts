// iOS / Android entry (the "react-native" export condition).
export {useHardwareKeyboard,isHardwareKeysAvailable,getHardwareKeyRecorder,addHardwareKeyListener} from "./platform.native.ts";
export type {UseHardwareKeyboardOptions} from "./useHardwareKeyboard.ts";
export type {KeySource,Subscription} from "./key-source.ts";
export {NATIVE_MODULE_NAME,toChord} from "./payload.ts";
export type {HardwareKeyChord} from "./payload.ts";
