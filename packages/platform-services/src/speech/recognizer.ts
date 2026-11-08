/**
 * Speech recognition: streaming speech-to-text over the platform
 * recognizer — SFSpeechRecognizer on iOS, SpeechRecognizer on Android,
 * SpeechRecognition on web. The recognizer owns microphone capture and the
 * recognition session; this layer owns validation, the consent gate and
 * event routing. Nothing here is journaled or snapshotted: transcript text
 * crosses the boundary once, as data, exactly like decoder output.
 *
 * Privacy posture (see the Forge P-asr-backend-decision): the default is
 * on-device-only. Any request that may route audio off-device
 * (`onDeviceOnly: false`, or any web recognition — browsers give no
 * on-device guarantee) requires an explicit {@linkcode SpeechConsent}
 * grant. That consent is separate from telemetry consent by design.
 */
import type {PreferenceStorage} from "../haptics/haptics.ts";
import type {Subscription} from "../native-module.ts";

/** Why a recognition call failed. Each platform maps its own errors onto these. */
export type SpeechErrorCode=
  |"not-found"            // the session id is unknown or already finished
  |"unsupported-format"   // this build/platform cannot do what was asked
  |"permission"           // microphone or speech-recognition permission denied
  |"consent-required"     // the request may send audio off-device without consent
  |"recognition-failed"   // the recognizer engine failed
  |"out-of-range"         // a start option is outside the accepted bounds
  |"cancelled"            // the consumer aborted before the call settled
  |"busy";                // the session cap is reached

export const SPEECH_ERROR_CODES:readonly SpeechErrorCode[]=
  ["not-found","unsupported-format","permission","consent-required","recognition-failed","out-of-range","cancelled","busy"];

/** The error every recognizer call rejects with. */
export class SpeechError extends Error {
  readonly code:SpeechErrorCode;
  constructor(code:SpeechErrorCode,message:string){
    super(message);
    this.name="SpeechError";
    this.code=code;
  }
}

/** Longest BCP-47 locale tag `start` accepts. */
export const MAX_SPEECH_LOCALE_LENGTH=35;
/** Most contextual hint strings one session may carry. */
export const MAX_SPEECH_HINTS=100;
/** Longest single hint string. */
export const MAX_SPEECH_HINT_LENGTH=200;
/** Most simultaneous recognition sessions one recognizer owns. */
export const MAX_SPEECH_SESSIONS=4;
/** Default ceiling on one session's lifetime; `maxSessionMs` overrides it. */
export const DEFAULT_SPEECH_SESSION_MS=600_000;
/** Most word timings one final result may carry. */
export const MAX_SPEECH_WORDS=1000;
/** Longest word text accepted from a native event. */
export const MAX_SPEECH_WORD_CHARS=200;
/** Longest transcript text accepted from a native event. */
export const MAX_SPEECH_TEXT_CHARS=100_000;

/** One recognized word with seconds-offset timing, when the platform supplies it. */
export interface SpeechWord {
  readonly text:string;
  /** Seconds from session start. */
  readonly startS:number;
  readonly endS:number;
}

/** What a listener receives. `partial` is a hypothesis, `final` committed text. */
export type SpeechSessionEvent=
  |{readonly type:"partial";readonly text:string}
  |{readonly type:"final";readonly text:string;readonly words?:readonly SpeechWord[]}
  |{readonly type:"end";readonly reason:string}
  |{readonly type:"error";readonly error:SpeechError};

/** Options for {@linkcode SpeechRecognizer.start}. */
export interface SpeechStartOptions {
  /** BCP-47 locale, e.g. "en-US". @default the platform default */
  readonly locale?:string;
  /**
   * Prefer recognition that never sends audio off-device. @default true.
   * `false` declares the session may use a network recognizer and requires
   * {@linkcode SpeechConsent.networkRecognition}. Note the platform limits:
   * Android's EXTRA_PREFER_OFFLINE is a hint, not a guarantee.
   */
  readonly onDeviceOnly?:boolean;
  /** Contextual biasing strings (names, jargon) the recognizer may favor. Platforms may ignore them. */
  readonly hints?:readonly string[];
  /**
   * Ceiling on the session in milliseconds; the session is aborted with a
   * "recognition-failed" error past it. @default {@linkcode DEFAULT_SPEECH_SESSION_MS}
   */
  readonly maxSessionMs?:number;
}

/** What {@linkcode SpeechRecognizer.probe} reports about this build's recognizer. */
export interface SpeechRecognizerProbe {
  /** False when this build links no recognizer or the OS reports none. */
  readonly available:boolean;
  /** True when the build can prefer on-device recognition (iOS supportsOnDeviceRecognition, Android on-device API, never web). */
  readonly onDevice:boolean;
  /**
   * True when audio may leave the device on some path — always true for web
   * (browser routing is opaque), true for the platform server-recognition
   * fallbacks the native modules expose.
   */
  readonly networkPossible:boolean;
}

/** One live recognition session. */
export interface SpeechRecognitionSession {
  /** Platform session id, for diagnostics only. */
  readonly id:string;
  /** Subscribes to partial/final/end/error events for this session. */
  addListener(listener:(event:SpeechSessionEvent)=>void):Subscription;
  /**
   * Asks the recognizer to finish: the platform flushes its last hypothesis
   * and ends the session. Resolves on the terminal "end" event, rejects on
   * "error".
   */
  stop():Promise<void>;
  /**
   * Cancels the session immediately. Resolves on the terminal event —
   * platforms report an aborted session as "end", not an error.
   */
  abort():Promise<void>;
}

/**
 * The explicit speech-recognition consent. Separate from telemetry consent:
 * granting it allows recognition paths that may send audio off-device. It
 * never authorizes telemetry, and telemetry consent never authorizes this.
 */
export interface SpeechConsent {
  /** True only after an explicit grant for off-device recognition. @default false */
  readonly networkRecognition:boolean;
}

/** A {@linkcode SpeechConsent} the app can flip, persisted through optional storage. */
export interface SpeechConsentController extends SpeechConsent {
  grantNetworkRecognition():void;
  revokeNetworkRecognition():void;
}

/** Options for {@linkcode createSpeechConsent}. */
export interface SpeechConsentOptions {
  /** Where the grant is kept, e.g. MMKV. Without one it lives for the session. */
  storage?:PreferenceStorage;
  /** @default "nyc-tron.speech.network-recognition" */
  storageKey?:string;
}

/**
 * The consent surface for off-device recognition. Default-deny: nothing is
 * granted until {@linkcode SpeechConsentController.grantNetworkRecognition}
 * runs from an explicit user action in the app's own settings UI.
 */
export function createSpeechConsent(options:SpeechConsentOptions={}):SpeechConsentController{
  const key=options.storageKey??"nyc-tron.speech.network-recognition";
  let granted=options.storage?.getString(key)==="granted";
  return {
    get networkRecognition(){return granted;},
    grantNetworkRecognition(){granted=true;options.storage?.set(key,"granted");},
    revokeNetworkRecognition(){granted=false;options.storage?.set(key,"denied");},
  };
}

/** Platform media speech recognition. */
export interface SpeechRecognizer {
  /** False when this build links no recognizer; every call then rejects with "unsupported-format". */
  readonly isAvailable:boolean;
  /** Reports recognizer/on-device support. It does not prove a given locale or device succeeds. */
  probe():Promise<SpeechRecognizerProbe>;
  /**
   * Starts a streaming session. Partial hypotheses arrive as "partial",
   * committed text as "final", then exactly one terminal "end" or "error".
   * @throws SpeechError "consent-required" when the request may leave the device without consent
   */
  start(options?:SpeechStartOptions):Promise<SpeechRecognitionSession>;
}

/** The native half. Records are flat; this file validates them. */
export interface SpeechRecognizerNative {
  probe():Promise<unknown>;
  /** Returns `{session: string}`. JS never sends listeners or signals across the bridge. */
  start(request:SpeechStartNative):Promise<unknown>;
  stop(session:string):Promise<unknown>;
  abort(session:string):Promise<unknown>;
  addListener(eventName:"speech",listener:(payload:unknown)=>void):Subscription;
}

/** Flat start record sent over the bridge. */
export interface SpeechStartNative {
  readonly locale?:string;
  readonly onDeviceOnly:boolean;
  readonly hints:string[];
}

const isCode=(v:unknown):v is SpeechErrorCode=>SPEECH_ERROR_CODES.includes(v as SpeechErrorCode);

/**
 * Reads any rejection into a {@linkcode SpeechError}. Native modules throw
 * with the code as the error's `code` and as a `[code]` prefix on the
 * message, so it survives whichever field the bridge keeps.
 */
export function toSpeechError(error:unknown):SpeechError{
  if(error instanceof SpeechError)return error;
  const e=(error&&typeof error==="object"?error:{}) as {code?:unknown;message?:unknown};
  const raw=typeof e.message==="string"?e.message:typeof error==="string"?error:"";
  const prefixed=/^\s*\[([a-z-]+)\]\s*/.exec(raw);
  const code=isCode(e.code)?e.code:prefixed&&isCode(prefixed[1])?prefixed[1]:"recognition-failed";
  const message=(prefixed?raw.slice(prefixed[0].length):raw)||"Speech recognition failed.";
  return new SpeechError(code,message);
}

const outOfRange=(message:string)=>new SpeechError("out-of-range",message);
const LOCALE=/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

/** Validated start options; `maxSessionMs` is enforced in JS and never crosses the bridge. */
export interface NormalizedSpeechStart {
  readonly locale?:string;
  readonly onDeviceOnly:boolean;
  readonly hints:string[];
  readonly maxSessionMs?:number;
}

/** Validates start options into {@linkcode NormalizedSpeechStart}. */
export function normalizeSpeechStart(options:SpeechStartOptions={}):NormalizedSpeechStart{
  const {locale,onDeviceOnly=true,hints=[],maxSessionMs}=options;
  if(locale!==undefined&&(typeof locale!=="string"||locale.length>MAX_SPEECH_LOCALE_LENGTH||!LOCALE.test(locale)))
    throw outOfRange(`locale must be a BCP-47 tag of at most ${MAX_SPEECH_LOCALE_LENGTH} characters`);
  if(!Array.isArray(hints)||hints.length>MAX_SPEECH_HINTS)
    throw outOfRange(`hints must be an array of at most ${MAX_SPEECH_HINTS} strings`);
  for(const hint of hints)
    if(typeof hint!=="string"||hint.length<1||hint.length>MAX_SPEECH_HINT_LENGTH)
      throw outOfRange(`each hint must be a string of 1–${MAX_SPEECH_HINT_LENGTH} characters`);
  if(maxSessionMs!==undefined&&(!Number.isFinite(maxSessionMs)||maxSessionMs<1000||maxSessionMs>86_400_000))
    throw outOfRange("maxSessionMs must be a finite number from 1000 to 86400000");
  return {locale,onDeviceOnly,hints:[...hints],maxSessionMs};
}

const str=(v:unknown)=>typeof v==="string"&&v?v:undefined;
const num=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)&&v>=0?v:undefined;
const bad=(what:string)=>new SpeechError("recognition-failed",`The recognizer returned an unreadable ${what}.`);

/** Reads the flat native probe record. */
export function toSpeechRecognizerProbe(payload:unknown):SpeechRecognizerProbe{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  if(typeof p.available!=="boolean"||typeof p.onDevice!=="boolean"||typeof p.networkPossible!=="boolean")throw bad("probe");
  return {available:p.available,onDevice:p.onDevice,networkPossible:p.networkPossible};
}

/** Reads the flat native session-start record. */
export function toSpeechSessionStart(payload:unknown):{session:string}{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const session=str(p.session);
  if(!session)throw bad("session");
  return {session};
}

function toSpeechWords(json:string|undefined):readonly SpeechWord[]|undefined{
  if(!json)return undefined;
  let parsed:unknown;
  try{parsed=JSON.parse(json);}catch{return undefined;}
  if(!Array.isArray(parsed))return undefined;
  const words:SpeechWord[]=[];
  for(const item of parsed.slice(0,MAX_SPEECH_WORDS)){
    const w=(item&&typeof item==="object"?item:{}) as Record<string,unknown>;
    const text=str(w.text),startS=num(w.startS),endS=num(w.endS);
    if(!text||text.length>MAX_SPEECH_WORD_CHARS||startS===undefined||endS===undefined)continue;
    words.push({text,startS,endS});
  }
  return words.length?words:undefined;
}

/**
 * Reads one flat native "speech" event into `{session,event}`. Returns null
 * for payloads that cannot be a session event; event streams are advisory,
 * so a malformed one is dropped rather than failing the session.
 */
export function toSpeechSessionEvent(payload:unknown):{session:string;event:SpeechSessionEvent}|null{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const session=str(p.session),kind=str(p.kind);
  if(!session||!kind)return null;
  const text=typeof p.text==="string"?p.text.slice(0,MAX_SPEECH_TEXT_CHARS):undefined;
  const words=toSpeechWords(typeof p.wordsJson==="string"?p.wordsJson:undefined);
  switch(kind){
    case "partial":return text===undefined?null:{session,event:{type:"partial",text}};
    case "final":return text===undefined?null:{session,event:words?{type:"final",text,words}:{type:"final",text}};
    case "end":return {session,event:{type:"end",reason:str(p.reason)??"ended"}};
    case "error":{
      const code=isCode(p.code)?p.code:"recognition-failed";
      const message=str(p.message)??"Speech recognition failed.";
      return {session,event:{type:"error",error:new SpeechError(code,message)}};
    }
    default:return null;
  }
}

interface SessionState {
  readonly listeners:Set<(event:SpeechSessionEvent)=>void>;
  readonly waiters:{resolve:()=>void;reject:(e:SpeechError)=>void}[];
  timer:ReturnType<typeof setTimeout>|undefined;
  done:boolean;
}

const unavailable=()=>Promise.reject(new SpeechError("unsupported-format","This build has no speech recognizer for this platform."));

/** Options for {@linkcode createSpeechRecognizer} and the platform factories. */
export interface SpeechRecognizerOptions {
  /**
   * The speech-recognition consent. Defaults to deny: `onDeviceOnly: false`
   * rejects with "consent-required" until the host supplies a consent with
   * `networkRecognition` granted.
   */
  readonly consent?:SpeechConsent;
}

/**
 * Builds {@linkcode SpeechRecognizer} over `native` (null when the module is
 * not linked). Start options are validated and the consent gate applied here
 * before anything reaches native code; every rejection is a
 * {@linkcode SpeechError}.
 */
export function createSpeechRecognizer(native:SpeechRecognizerNative|null,options:SpeechRecognizerOptions={}):SpeechRecognizer{
  const consent=options.consent??{networkRecognition:false};
  const sessions=new Map<string,SessionState>();
  native?.addListener("speech",payload=>{
    const parsed=toSpeechSessionEvent(payload);
    if(!parsed)return;
    const state=sessions.get(parsed.session);
    if(!state||state.done)return;
    deliver(state,parsed.session,parsed.event);
  });
  const remove=(id:string)=>{const s=sessions.get(id);if(s?.timer!==undefined)clearTimeout(s.timer);sessions.delete(id);};
  const deliver=(state:SessionState,id:string,event:SpeechSessionEvent)=>{
    for(const listener of state.listeners)listener(event);
    if(event.type==="error"){
      state.done=true;remove(id);
      for(const w of state.waiters)w.reject(event.error);
      state.waiters.length=0;
    }else if(event.type==="end"){
      state.done=true;remove(id);
      for(const w of state.waiters)w.resolve();
      state.waiters.length=0;
    }
  };
  const settle=(id:string,nativeCall:()=>Promise<unknown>):Promise<void>=>{
    const state=sessions.get(id);
    if(!state)return Promise.reject(new SpeechError("not-found","The speech session is unknown or already finished."));
    const done=new Promise<void>((resolve,reject)=>state.waiters.push({resolve,reject}));
    return Promise.resolve()
      .then(nativeCall)
      .then(()=>done,(error)=>{throw toSpeechError(error);});
  };
  return {
    isAvailable:native!==null,
    async probe(){
      if(!native)throw new SpeechError("unsupported-format","This build has no speech recognizer for this platform.");
      let payload:unknown;
      try{payload=await native.probe();}catch(error){throw toSpeechError(error);}
      return toSpeechRecognizerProbe(payload);
    },
    async start(startOptions={}){
      if(!native)throw new SpeechError("unsupported-format","This build has no speech recognizer for this platform.");
      const normalized=normalizeSpeechStart(startOptions);
      if(!normalized.onDeviceOnly&&!consent.networkRecognition)
        throw new SpeechError("consent-required","This recognition path may send audio off-device; grant speech consent first.");
      if(sessions.size>=MAX_SPEECH_SESSIONS)
        throw new SpeechError("busy",`At most ${MAX_SPEECH_SESSIONS} speech sessions may run at once.`);
      let payload:unknown;
      // Native records take "" for an absent locale; web treats it the same.
      const request:SpeechStartNative={locale:normalized.locale??"",onDeviceOnly:normalized.onDeviceOnly,hints:normalized.hints};
      try{payload=await native.start(request);}catch(error){throw toSpeechError(error);}
      const {session}=toSpeechSessionStart(payload);
      if(sessions.has(session)){
        // A duplicate id would orphan the earlier session's timer and
        // listeners; refuse rather than silently overwrite.
        try{await native.abort(session);}catch{/* best effort */}
        throw new SpeechError("recognition-failed","The recognizer returned a duplicate session id.");
      }
      const state:SessionState={listeners:new Set(),waiters:[],timer:undefined,done:false};
      sessions.set(session,state);
      const budget=normalized.maxSessionMs??DEFAULT_SPEECH_SESSION_MS;
      state.timer=setTimeout(()=>{
        if(state.done)return;
        void Promise.resolve(native.abort(session)).catch(()=>undefined);
        deliver(state,session,{type:"error",error:new SpeechError("recognition-failed","The speech session exceeded its time budget.")});
      },budget);
      return {
        id:session,
        addListener(listener){state.listeners.add(listener);return{remove:()=>{state.listeners.delete(listener);}};},
        stop:()=>settle(session,()=>native.stop(session)),
        abort:()=>settle(session,()=>native.abort(session)),
      };
    },
  };
}
