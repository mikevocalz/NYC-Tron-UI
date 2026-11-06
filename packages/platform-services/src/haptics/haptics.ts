import {createStore,type StoreApi} from "zustand/vanilla";
import {isHapticKind,type HapticKind} from "./kinds.ts";

/**
 * Synchronous string storage for the opt-out, e.g. an MMKV instance
 * (`getString` / `set`). Without one the preference lives for the session.
 */
export interface PreferenceStorage {
  getString(key:string):string|undefined;
  set(key:string,value:string):void;
}

/** The native half: one call per feedback. Returns false when the OS did not play it. */
export interface HapticsNative {
  play(kind:HapticKind):boolean|Promise<boolean>;
  prepare?(kind:HapticKind):void|Promise<void>;
}

/** Options for {@linkcode createHaptics}. */
export interface HapticsOptions {
  /** Where the person's on/off choice is kept. */
  storage?:PreferenceStorage;
  /** @default "nyc-tron.haptics.enabled" */
  storageKey?:string;
  /**
   * Shortest gap between two feedbacks of the same kind. A scrubber crossing
   * detents fast would otherwise queue more taps than the motor can play.
   * @default 30
   */
  minIntervalMs?:number;
  /** Clock for the interval. @default performance.now or Date.now */
  now?:()=>number;
}

/** State behind {@linkcode Haptics}. */
export interface HapticsState {
  /** The person's choice. Off means no feedback from this app, whatever the OS setting. */
  readonly enabled:boolean;
}

/**
 * Tactile feedback with a user opt-out. The OS setting still applies on top:
 * iOS skips feedback when System Haptics is off, and Android when touch
 * feedback is off.
 */
export interface Haptics {
  /** False on web and when the native module is not linked; `play` then does nothing. */
  readonly isAvailable:boolean;
  readonly store:StoreApi<HapticsState>;
  /** Plays `kind` unless the person turned haptics off or the same kind just played. Returns whether it was sent. */
  play(kind:HapticKind):boolean;
  /** Warms the generator before a gesture so the first tick lands on time (iOS). */
  prepare(kind:HapticKind):void;
  setEnabled(enabled:boolean):void;
}

const ignore=()=>undefined;

/**
 * Builds a {@linkcode Haptics} over `native` (null on web or when the module
 * is missing). Platform entries pass the module; tests pass a fake.
 * @throws RangeError for a kind outside {@linkcode HapticKind}
 */
export function createHaptics(native:HapticsNative|null,options:HapticsOptions={}):Haptics{
  const key=options.storageKey??"nyc-tron.haptics.enabled";
  const minInterval=options.minIntervalMs??30;
  const now=options.now??(()=>globalThis.performance?.now?.()??Date.now());
  const stored=options.storage?.getString(key);
  const store=createStore<HapticsState>(()=>({enabled:stored!=="false"}));
  const last=new Map<HapticKind,number>();
  const check=(kind:unknown)=>{
    if(!isHapticKind(kind))throw new RangeError(`Unknown haptic kind "${String(kind)}"`);
  };
  return {
    isAvailable:native!==null,
    store,
    play(kind){
      check(kind);
      if(!native||!store.getState().enabled)return false;
      const t=now();
      const prev=last.get(kind);
      if(prev!==undefined&&t-prev<minInterval)return false;
      last.set(kind,t);
      // A rejected play is a missed tap, not an app error.
      Promise.resolve(native.play(kind)).catch(ignore);
      return true;
    },
    prepare(kind){
      check(kind);
      if(native?.prepare&&store.getState().enabled)Promise.resolve(native.prepare(kind)).catch(ignore);
    },
    setEnabled(enabled){
      store.setState({enabled});
      options.storage?.set(key,enabled?"true":"false");
    },
  };
}
