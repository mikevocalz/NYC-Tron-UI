import {
  createSpeechRecognizer,SpeechError,toSpeechError,
  type SpeechConsent,type SpeechRecognizer,type SpeechRecognizerNative,type SpeechRecognizerOptions,
  type SpeechStartNative,
} from "./recognizer.ts";
import type {Subscription} from "../native-module.ts";

export {SPEECH_MODULE_NAME} from "../module-names.ts";

/**
 * The browser SpeechRecognition surface. `webkitSpeechRecognition` is the
 * same API under its old name; either counts.
 */
interface WebSpeechRecognitionLike {
  lang:string;
  continuous:boolean;
  interimResults:boolean;
  maxAlternatives:number;
  start():void;
  stop():void;
  abort():void;
  addEventListener?(type:string,listener:(event:never)=>void):void;
  onresult:((event:unknown)=>void)|null;
  onerror:((event:unknown)=>void)|null;
  onend:(()=>void)|null;
}
type WebSpeechRecognitionCtor=new()=>WebSpeechRecognitionLike;

function webCtor():WebSpeechRecognitionCtor|null{
  const w=globalThis as {SpeechRecognition?:WebSpeechRecognitionCtor;webkitSpeechRecognition?:WebSpeechRecognitionCtor};
  return w.SpeechRecognition??w.webkitSpeechRecognition??null;
}

interface WebSession {
  readonly recognition:WebSpeechRecognitionLike;
  stopping:boolean;
  aborted:boolean;
}

const MAX_WEB_SESSIONS=4;

const webErrorCode=(name:string):"permission"|"recognition-failed"=>
  name==="not-allowed"||name==="service-not-allowed"||name==="audio-capture"?"permission":"recognition-failed";

/**
 * One web recognition behind the {@linkcode SpeechRecognizerNative} shape so
 * the shared dispatch layer routes its events. The browser owns the
 * microphone; this only translates events.
 */
function createWebNative(consent:SpeechConsent|undefined):SpeechRecognizerNative|null{
  const Ctor=webCtor();
  if(!Ctor)return null;
  const sessions=new Map<string,WebSession>();
  const listeners=new Set<(payload:unknown)=>void>();
  let counter=0;
  // One throwing listener must not starve the others.
  const emit=(payload:unknown)=>{for(const l of listeners){try{l(payload);}catch{/* advisory fan-out */}}};
  return {
    async probe(){
      // Browsers give no on-device guarantee and may route audio to their
      // own backend; report the honest posture, not a capability guess.
      return {available:true,onDevice:false,networkPossible:true};
    },
    async start(request:SpeechStartNative){
      // Every browser path is treated as cloud-class for privacy purposes:
      // there is no API to verify on-device routing, so onDeviceOnly cannot
      // be honored and is rejected rather than silently ignored.
      if(request.onDeviceOnly)
        throw new SpeechError("unsupported-format","This browser cannot guarantee on-device recognition; pass onDeviceOnly:false with speech consent.");
      if(!consent?.networkRecognition)
        throw new SpeechError("consent-required","Browser speech recognition may send audio off-device; grant speech consent first.");
      if(sessions.size>=MAX_WEB_SESSIONS)
        throw new SpeechError("busy",`At most ${MAX_WEB_SESSIONS} speech sessions may run at once.`);
      const id=`web-${++counter}`;
      const recognition=new Ctor();
      if(request.locale)recognition.lang=request.locale;
      recognition.continuous=true;
      recognition.interimResults=true;
      recognition.maxAlternatives=1;
      const session:WebSession={recognition,stopping:false,aborted:false};
      sessions.set(id,session);
      // Exactly one terminal event per session; the first finish wins.
      const finish=(kind:"end"|"error",extra:Record<string,unknown>={})=>{
        if(!sessions.delete(id))return;
        emit({session:id,kind,...extra});
      };
      const on=(target:"result"|"error"|"end",fn:(event:unknown)=>void)=>{
        if(recognition.addEventListener)recognition.addEventListener(target,fn as never);
        else (recognition as unknown as Record<string,unknown>)[`on${target}`]=fn;
      };
      on("result",(raw:unknown)=>{
        const event=raw as {resultIndex?:number;results?:ArrayLike<ArrayLike<{transcript?:string}> & {isFinal?:boolean}>};
        const results=event.results;
        if(!results)return;
        const from=event.resultIndex??0;
        const interim:string[]=[];
        for(let i=from;i<results.length;i++){
          const result=results[i];
          const transcript=result?.[0]?.transcript?.trim()??"";
          if(result?.isFinal){
            if(transcript)emit({session:id,kind:"final",text:transcript});
          }else if(transcript)interim.push(transcript);
        }
        if(interim.length)emit({session:id,kind:"partial",text:interim.join(" ")});
      });
      on("error",(raw:unknown)=>{
        const name=String((raw as {error?:unknown})?.error??"unknown");
        if(name==="aborted"){finish("end",{reason:"aborted"});return;}
        if(name==="no-speech"){finish("end",{reason:"no-speech"});return;}
        finish("error",{code:webErrorCode(name),message:`Speech recognition error: ${name}`});
      });
      on("end",()=>{
        finish("end",{reason:session.aborted?"aborted":session.stopping?"stopped":"ended"});
      });
      try{recognition.start();}catch(error){
        sessions.delete(id);
        throw toSpeechError(error);
      }
      return {session:id};
    },
    async stop(session:string){
      const s=sessions.get(session);
      if(!s)return;
      s.stopping=true;
      s.recognition.stop();
    },
    async abort(session:string){
      const s=sessions.get(session);
      if(!s)return;
      s.aborted=true;
      s.recognition.abort();
    },
    addListener(_eventName:"speech",listener:(payload:unknown)=>void):Subscription{
      listeners.add(listener);
      return{remove:()=>{listeners.delete(listener);}};
    },
  };
}

/**
 * {@linkcode SpeechRecognizer} on web: the browser's SpeechRecognition.
 * There is no on-device mode — browsers may route audio to their own
 * backend — so every session requires {@linkcode SpeechConsent} and
 * `onDeviceOnly` requests reject with "unsupported-format". Requires
 * `SpeechRecognition`/`webkitSpeechRecognition`; other browsers report
 * unavailable.
 */
export function createPlatformSpeechRecognizer(options:SpeechRecognizerOptions={}):SpeechRecognizer{
  return createSpeechRecognizer(createWebNative(options.consent),options);
}
