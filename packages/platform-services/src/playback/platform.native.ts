import {findNativeModule} from "../native-module.ts";
import {PLAYBACK_SESSION_MODULE_NAME} from "../module-names.ts";
import {createPlaybackSession,type PlaybackSession,type PlaybackSessionNative,type PlaybackSessionOptions} from "./session.ts";

export {PLAYBACK_SESSION_MODULE_NAME} from "../module-names.ts";

/**
 * {@linkcode PlaybackSession} over AVAudioSession on iOS and AudioManager
 * focus plus ACTION_AUDIO_BECOMING_NOISY on Android.
 */
export function createPlatformPlaybackSession(options:PlaybackSessionOptions):PlaybackSession{
  return createPlaybackSession(findNativeModule<PlaybackSessionNative>(PLAYBACK_SESSION_MODULE_NAME),options);
}
