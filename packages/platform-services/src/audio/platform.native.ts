import {findNativeModule} from "../native-module.ts";
import {AUDIO_DEVICE_MODULE_NAME} from "../module-names.ts";
import {createAudioDeviceProvider,type AudioDeviceNative,type AudioDeviceProvider} from "./device.ts";

export {AUDIO_DEVICE_MODULE_NAME} from "../module-names.ts";
export {createAudioDeviceProvider} from "./device.ts";
export type {AudioDeviceProvider} from "./device.ts";

/**
 * {@linkcode AudioDeviceProvider} over AVAudioEngine on iOS
 * (AVAudioSourceNode playback ring + input-node tap capture) and
 * AudioTrack/AudioRecord on Android.
 */
export function createPlatformAudioDevice():AudioDeviceProvider{
  return createAudioDeviceProvider(findNativeModule<AudioDeviceNative>(AUDIO_DEVICE_MODULE_NAME));
}
