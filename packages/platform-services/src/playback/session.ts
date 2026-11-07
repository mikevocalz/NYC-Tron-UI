import {createStore,type StoreApi} from "zustand/vanilla";
import type {Subscription} from "../native-module.ts";
import {IDLE_PLAYBACK,nextPlaybackState,setPlaybackIntent,toSessionEvent,type AudioSessionEvent,
  type PlaybackAction,type PlaybackLifecycleState} from "./policy.ts";

/**
 * How the app uses audio. `playback` keeps playing with the silent switch on
 * (iOS) and asks for full focus (Android); `play-and-record` is for
 * recording or monitoring; `ambient` mixes with other apps and obeys the
 * silent switch.
 */
export type AudioSessionCategory="playback"|"play-and-record"|"ambient";

/** Options for {@linkcode PlaybackSession.activate}. */
export interface ActivateOptions {
  category:AudioSessionCategory;
  /** Let other apps keep playing underneath. @default false */
  mixWithOthers?:boolean;
}

/** The native half. Event payloads are flat records; JS validates them. */
export interface PlaybackSessionNative {
  activate(options:{category:string;mixWithOthers:boolean}):Promise<boolean>|boolean;
  deactivate():Promise<void>|void;
  addListener(eventName:"session",listener:(payload:unknown)=>void):Subscription;
}

/**
 * The audio session around an app's player (N-17): it activates the OS
 * session, listens for interruptions, focus changes and output loss, and
 * tells the player what to do through `onAction`. The player stays the app's;
 * this owns only the lifecycle around it.
 */
export interface PlaybackSession {
  /** False on web and when the native module is not linked; the policy still runs on {@linkcode PlaybackSession.dispatch}. */
  readonly isAvailable:boolean;
  readonly store:StoreApi<PlaybackLifecycleState>;
  /**
   * Activates the OS audio session. Resolves false when the OS refused
   * (Android denied focus, iOS could not activate during a call).
   */
  activate(options:ActivateOptions):Promise<boolean>;
  /** Releases the session so other apps' audio returns to full volume. */
  deactivate():Promise<void>;
  /** The person pressed play or pause. */
  setIntent(intent:"playing"|"paused"):void;
  /** Feeds one event through the policy, as the native listener does. Returns the action taken. */
  dispatch(event:AudioSessionEvent):PlaybackAction;
  /**
   * Stops listening immediately and drains accepted operations. Idempotent.
   * releaseFocus is opt-in: only the app's sole session owner may release the
   * process-wide OS session; preview/capture coordinators arbitrate it themselves.
   */
  dispose(options?:{releaseFocus?:boolean}):Promise<void>;
}

/** Options for {@linkcode createPlaybackSession}. */
export interface PlaybackSessionOptions {
  /** Applies a policy decision to the player: pause, resume, lower volume, rebuild. */
  onAction:(action:Exclude<PlaybackAction,"none">,event:AudioSessionEvent)=>void;
}

/**
 * Builds a {@linkcode PlaybackSession} over `native` (null on web or when the
 * module is missing). Platform entries pass the module; tests pass a fake.
 */
export function createPlaybackSession(native:PlaybackSessionNative|null,options:PlaybackSessionOptions):PlaybackSession{
  const store=createStore<PlaybackLifecycleState>(()=>IDLE_PLAYBACK);
  let closed=false;
  let tail:Promise<unknown>=Promise.resolve();
  let disposal:Promise<void>|undefined;
  const enqueue=<T>(work:()=>Promise<T>|T):Promise<T>=>{
    if(closed)return Promise.reject(new Error("Playback session is disposed"));
    const result=tail.then(work);
    tail=result.catch(()=>undefined);
    return result;
  };
  const dispatch=(event:AudioSessionEvent):PlaybackAction=>{
    if(closed)return "none";
    const {state,action}=nextPlaybackState(store.getState(),event);
    store.setState(state,true);
    if(action!=="none")options.onAction(action,event);
    return action;
  };
  const sub=native?.addListener("session",payload=>{
    const event=toSessionEvent(payload);
    if(event)dispatch(event);
  });
  return {
    isAvailable:native!==null,
    store,
    activate({category,mixWithOthers=false}){
      return enqueue(()=>native?native.activate({category,mixWithOthers}):false);
    },
    deactivate(){
      return enqueue(async()=>{if(native)await native.deactivate();});
    },
    setIntent(intent){
      if(closed)return;
      store.setState(setPlaybackIntent(store.getState(),intent),true);
    },
    dispatch,
    dispose({releaseFocus=false}={}){
      if(disposal)return disposal;
      closed=true;
      sub?.remove();
      store.setState(IDLE_PLAYBACK,true);
      disposal=tail.then(async()=>{if(native&&releaseFocus)await native.deactivate();});
      return disposal;
    },
  };
}
