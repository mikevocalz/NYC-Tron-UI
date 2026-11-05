import {createPlaybackSession,type PlaybackSession,type PlaybackSessionOptions} from "./session.ts";

/** Name both native platforms register the playback session module under. */
export const PLAYBACK_SESSION_MODULE_NAME="NYCTronPlaybackSession";

/**
 * Browsers expose no interruption or output-loss events, so the web session
 * is unavailable: `activate` resolves false and only events the app feeds
 * through `dispatch` (for example from the Media Session API) run the policy.
 */
export function createPlatformPlaybackSession(options:PlaybackSessionOptions):PlaybackSession{
  return createPlaybackSession(null,options);
}
