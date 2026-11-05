import {findNativeModule} from "../native-module.ts";
import {createPlaybackSession,type PlaybackSession,type PlaybackSessionNative,type PlaybackSessionOptions} from "./session.ts";

/** Name both platforms register the playback session module under. */
export const PLAYBACK_SESSION_MODULE_NAME="NYCTronPlaybackSession";

/**
 * {@linkcode PlaybackSession} over AVAudioSession on iOS and AudioManager
 * focus plus ACTION_AUDIO_BECOMING_NOISY on Android.
 */
export function createPlatformPlaybackSession(options:PlaybackSessionOptions):PlaybackSession{
  return createPlaybackSession(findNativeModule<PlaybackSessionNative>(PLAYBACK_SESSION_MODULE_NAME),options);
}
