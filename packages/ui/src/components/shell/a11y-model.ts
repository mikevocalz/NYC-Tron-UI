import {createStore,type StoreApi} from "zustand/vanilla";

/** How the person last moved focus: by keyboard or by pointer (mouse, touch, pen). */
export type InputModality="keyboard"|"pointer"|"unknown";
/** Live-region urgency. `assertive` interrupts; keep it for errors. */
export type Politeness="polite"|"assertive";

/**
 * The accessibility settings a {@linkcode FocusAndA11yLayer} reads from the
 * OS and the browser.
 */
export interface A11yPreferences {
  /** OS "reduce motion" (iOS, Android "remove animations") or `prefers-reduced-motion`. */
  readonly reduceMotion:boolean;
  /** VoiceOver, TalkBack or another screen reader is on. Web cannot detect this and reports false. */
  readonly screenReader:boolean;
  /** Web forced colors, iOS "increase contrast", Android "high contrast text". */
  readonly highContrast:boolean;
  readonly inputModality:InputModality;
}
/** One pending announcement; `seq` changes so identical text is read again. */
export interface Announcement {
  readonly text:string;
  readonly politeness:Politeness;
  readonly seq:number;
}
/** Store state behind a {@linkcode FocusAndA11yLayer}. */
export interface A11yState extends A11yPreferences {
  readonly announcement:Announcement|undefined;
}

/** A store with every preference off until the platform reports otherwise. */
export function createA11yStore(initial:Partial<A11yPreferences>={}):StoreApi<A11yState>{
  return createStore<A11yState>(()=>({reduceMotion:false,screenReader:false,highContrast:false,inputModality:"unknown",
    announcement:undefined,...initial}));
}

/** Queue `text` for screen readers. Empty text is ignored. */
export function queueAnnouncement(store:StoreApi<A11yState>,text:string,politeness:Politeness="polite"):void{
  const trimmed=text.trim();
  if(!trimmed)return;
  const seq=(store.getState().announcement?.seq??0)+1;
  store.setState({announcement:{text:trimmed,politeness,seq}});
}

/** Animation length to use: zero when reduce motion is on. */
export function motionDuration(ms:number,preferences:Pick<A11yPreferences,"reduceMotion">):number{
  if(!Number.isFinite(ms)||ms<0)throw new RangeError("Invalid duration");
  return preferences.reduceMotion?0:ms;
}

const NAVIGATION_KEYS=new Set(["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End","PageUp","PageDown","Enter"," ","Escape","F6"]);
/**
 * Modality after a keydown: navigation keys mean keyboard focus. Typing into
 * a field and lone modifier presses leave it unchanged.
 */
export function modalityAfterKey(current:InputModality,key:string,modified:boolean):InputModality{
  return NAVIGATION_KEYS.has(key)||(modified&&key.length===1)?"keyboard":current;
}
