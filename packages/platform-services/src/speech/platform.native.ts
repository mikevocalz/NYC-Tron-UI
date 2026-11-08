import {findNativeModule} from "../native-module.ts";
import {SPEECH_MODULE_NAME} from "../module-names.ts";
import {createSpeechRecognizer,type SpeechRecognizer,type SpeechRecognizerNative,type SpeechRecognizerOptions} from "./recognizer.ts";

export {SPEECH_MODULE_NAME} from "../module-names.ts";

/**
 * {@linkcode SpeechRecognizer} over SFSpeechRecognizer on iOS and
 * SpeechRecognizer on Android. On-device is the default; `onDeviceOnly:
 * false` may use the platform's network recognizer and requires speech
 * consent. See README "Speech recognition" for permission keys the host
 * app must declare.
 */
export function createPlatformSpeechRecognizer(options?:SpeechRecognizerOptions):SpeechRecognizer{
  return createSpeechRecognizer(findNativeModule<SpeechRecognizerNative>(SPEECH_MODULE_NAME),options);
}
