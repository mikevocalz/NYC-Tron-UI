/**
 * What the audio session reported. iOS sends interruptions, route loss and
 * media-services resets; Android sends focus changes and becoming-noisy.
 */
export type AudioSessionEvent=
  | {readonly type:"interruption-began"}
  | {readonly type:"interruption-ended";readonly shouldResume:boolean}
  | {readonly type:"focus-lost";readonly transient:boolean;readonly canDuck:boolean}
  | {readonly type:"focus-gained"}
  | {readonly type:"output-lost";readonly reason:OutputLossReason}
  | {readonly type:"media-services-reset"};

/** Why audio output went away. */
export type OutputLossReason="headphones-unplugged"|"bluetooth-disconnected"|"device-unavailable";

/**
 * What the app's player should do next. `reactivate` means the OS restarted
 * its media services: rebuild players and activate the session again.
 */
export type PlaybackAction="pause"|"resume"|"duck"|"unduck"|"reactivate"|"none";

/** Where playback stands from the session's point of view. */
export interface PlaybackLifecycleState {
  /** What the person last asked for. Only they, or a permanent loss, change it. */
  readonly intent:"playing"|"paused";
  /** Paused by the system and expected back: an interruption or a transient focus loss. */
  readonly suspendedBy:"interruption"|"focus"|undefined;
  /** Volume lowered for another app's short sound. */
  readonly ducked:boolean;
}

/** Nothing playing, nothing suspended. */
export const IDLE_PLAYBACK:PlaybackLifecycleState={intent:"paused",suspendedBy:undefined,ducked:false};

/** Next state and the action for the player. */
export interface PlaybackTransition {
  readonly state:PlaybackLifecycleState;
  readonly action:PlaybackAction;
}

const stay=(state:PlaybackLifecycleState):PlaybackTransition=>({state,action:"none"});

/**
 * The session policy as a pure function. The rules:
 * - An interruption (call, alarm, Siri) pauses; it resumes afterwards only
 *   when the OS says `shouldResume`. Otherwise the person presses play.
 * - A transient focus loss that allows ducking lowers the volume; one that
 *   does not pauses and resumes when focus returns. A permanent loss (another
 *   app started playing) pauses for good.
 * - Losing the output device (headphones out, Bluetooth gone) pauses and
 *   never resumes by itself, so audio does not jump to the speaker.
 * - A media-services reset asks the app to rebuild its players.
 */
export function nextPlaybackState(state:PlaybackLifecycleState,event:AudioSessionEvent):PlaybackTransition{
  const playing=state.intent==="playing"&&state.suspendedBy===undefined;
  switch(event.type){
    case "interruption-began":
      return playing?{state:{...state,suspendedBy:"interruption"},action:"pause"}:stay(state);
    case "interruption-ended":
      if(state.suspendedBy!=="interruption")return stay(state);
      return event.shouldResume
        ?{state:{...state,suspendedBy:undefined},action:"resume"}
        :{state:{...state,intent:"paused",suspendedBy:undefined},action:"none"};
    case "focus-lost":
      if(!playing)return stay(state);
      if(!event.transient)return {state:{intent:"paused",suspendedBy:undefined,ducked:false},action:"pause"};
      if(event.canDuck)return state.ducked?stay(state):{state:{...state,ducked:true},action:"duck"};
      return {state:{...state,suspendedBy:"focus"},action:"pause"};
    case "focus-gained":
      if(state.suspendedBy==="focus")return {state:{...state,suspendedBy:undefined,ducked:false},action:"resume"};
      if(state.ducked)return {state:{...state,ducked:false},action:"unduck"};
      return stay(state);
    case "output-lost":
      if(state.intent!=="playing")return stay(state);
      return {state:{intent:"paused",suspendedBy:undefined,ducked:false},action:state.suspendedBy?"none":"pause"};
    case "media-services-reset":
      return {state:{...state,suspendedBy:undefined,ducked:false},action:"reactivate"};
  }
}

/** The person pressed play or pause. */
export function setPlaybackIntent(state:PlaybackLifecycleState,intent:"playing"|"paused"):PlaybackLifecycleState{
  return {intent,suspendedBy:undefined,ducked:intent==="playing"?state.ducked:false};
}

/** Reads a native payload; undefined for anything that is not a session event. */
export function toSessionEvent(payload:unknown):AudioSessionEvent|undefined{
  if(!payload||typeof payload!=="object")return undefined;
  const p=payload as Record<string,unknown>;
  switch(p.type){
    case "interruption-began":case "focus-gained":case "media-services-reset":return {type:p.type};
    case "interruption-ended":return {type:"interruption-ended",shouldResume:p.shouldResume===true};
    case "focus-lost":return {type:"focus-lost",transient:p.transient===true,canDuck:p.canDuck===true};
    case "output-lost":{
      const reason=p.reason==="headphones-unplugged"||p.reason==="bluetooth-disconnected"?p.reason:"device-unavailable";
      return {type:"output-lost",reason};
    }
    default:return undefined;
  }
}
