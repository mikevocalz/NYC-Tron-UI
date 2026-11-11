/**
 * Media decoding (N-19): probe a file, decode a frame near a media
 * time, decode a span of audio to PCM. Every time is an integer number of
 * microseconds. Returned data is bounded per call: at most
 * {@linkcode MAX_DECODE_DURATION_US} of audio and frames no larger than
 * {@linkcode MAX_FRAME_EDGE} on a side.
 */

/** Why a decode failed. Each platform maps its own errors onto these. */
export type MediaDecodeErrorCode="not-found"|"unsupported-format"|"decode-failed"|"out-of-range"|"permission"|"cancelled";

export const MEDIA_DECODE_ERROR_CODES:readonly MediaDecodeErrorCode[]=
  ["not-found","unsupported-format","decode-failed","out-of-range","permission","cancelled"];

/** The error every decoder call rejects with. */
export class MediaDecodeError extends Error {
  readonly code:MediaDecodeErrorCode;
  constructor(code:MediaDecodeErrorCode,message:string){
    super(message);
    this.name="MediaDecodeError";
    this.code=code;
  }
}

/** Longest audio span one `decodeAudio` call returns: 60 s. */
export const MAX_DECODE_DURATION_US=60_000_000;
/** Largest `maxWidth` or `maxHeight` a frame request may ask for. */
export const MAX_FRAME_EDGE=4096;
/** Bounding box used when a frame request gives no size. */
export const DEFAULT_FRAME_EDGE=1920;
/** Sample rates `decodeAudio` accepts when one is requested. */
export const MIN_SAMPLE_RATE=8000;
export const MAX_SAMPLE_RATE=192_000;

/** Maximum number of actual video presentation timestamps returned per index. */
export const MAX_PRESENTATION_INDEX_FRAMES=200_000;
export interface PresentationIndexOptions {
  readonly maxFrames?:number;
  /** Detaches the consumer; native enumeration already submitted may drain. */
  readonly signal?:AbortSignal;
}
export interface MediaPresentationIndex {
  readonly durationUs:number;
  /** Complete first-video-track index, sorted strictly, in integer microseconds. */
  readonly timesUs:readonly number[];
}

/** What {@linkcode MediaDecoder.probe} reports about a file. */
export interface MediaProbe {
  readonly durationUs:number;
  /** First video track, if any. */
  readonly video?:{
    readonly width:number;
    readonly height:number;
    /** Nominal frames per second; undefined when the container does not say (and always on web). */
    readonly frameRate?:number;
    /** Platform codec id: FourCC on iOS ("avc1"), Undefined on web. */
    readonly codec?:string;
  };
  /** First audio track, if any. Web cannot see audio tracks without decoding, so it leaves this out. */
  readonly audio?:{
    readonly sampleRate:number;
    readonly channels:number;
    readonly codec?:string;
  };
}

/** Options for {@linkcode MediaDecoder.decodeFrame}. */
export interface DecodeFrameOptions {
  /** Detaches this request on abort. Codec work already submitted may drain on its native owner. */
  readonly signal?:AbortSignal;
  /** Media time of the wanted frame, integer microseconds from the start. */
  readonly timeUs:number;
  /** The frame is scaled down (never up) to fit this box. @default 1920 */
  readonly maxWidth?:number;
  /** @default 1920 */
  readonly maxHeight?:number;
}

/** A decoded video frame. */
export interface DecodedFrame {
  /** JPEG in the app's caches directory on iOS/Android (`file://`), a `data:` URL on web. */
  readonly uri:string;
  /** Native presentation time or browser seek target; consult `timing`. */
  readonly actualTimeUs:number;
  /** Native presentation timestamp, or the settled seek target on the browser fallback. */
  readonly timing:"presentation"|"seek-target";
  readonly width:number;
  readonly height:number;
}

/** Options for {@linkcode MediaDecoder.decodeAudio}. */
export interface DecodeAudioOptions {
  readonly startUs:number;
  /** At most {@linkcode MAX_DECODE_DURATION_US}. */
  readonly durationUs:number;
  /** Resample to this rate. Native default: the file's rate. Web default: 48000. */
  readonly sampleRate?:number;
}

/**
 * Where the samples are. Web hands them over in memory; iOS/Android write
 * a raw file of little-endian Float32 samples, interleaved by channel, so a
 * minute of 48 kHz stereo (23 MB) never crosses the bridge as JS values.
 */
export type DecodedPcm=
  | {readonly kind:"samples";readonly samples:Float32Array}
  | {readonly kind:"file";readonly uri:string;readonly byteLength:number};

/** Linear PCM for a span of audio. */
export interface DecodedAudio {
  readonly sampleRate:number;
  readonly channels:number;
  /** Sample frames (one sample per channel each). May be shorter than asked at the end of the file. */
  readonly frames:number;
  readonly pcm:DecodedPcm;
}

/** Platform frame and audio decoding. */
export interface MediaDecoder {
  /** False when this build links no native decoder; every call then rejects with "unsupported-format". */
  readonly isAvailable:boolean;
  /** Present only when the linked binary exposes presentationIndexV1. Absent in alpha.4. */
  readonly presentationIndexVersion?:1;
  presentationIndex?(uri:string,options?:PresentationIndexOptions):Promise<MediaPresentationIndex>;
  /** Optional strict actual-PTS decode; older binaries keep decodeFrame semantics. */
  readonly indexedFrameVersion?:1;
  decodeIndexedFrame?(uri:string,options:DecodeFrameOptions):Promise<DecodedFrame>;
  probe(uri:string):Promise<MediaProbe>;
  decodeFrame(uri:string,options:DecodeFrameOptions):Promise<DecodedFrame>;
  decodeAudio(uri:string,options:DecodeAudioOptions):Promise<DecodedAudio>;
  /** Deletes the frame and PCM files this decoder wrote. Web keeps nothing and resolves at once. */
  clearCache():Promise<void>;
}

/** The native half. Records are flat; this file validates them. */
export interface MediaDecoderNative {
  /** Optional ABI addition; old linked binaries remain valid. */
  presentationIndexV1?(uri:string,maxFrames:number):Promise<unknown>;
  decodeIndexedFrameV1?(uri:string,options:{timeUs:number;maxWidth:number;maxHeight:number}):Promise<unknown>;
  probe(uri:string):Promise<unknown>;
  decodeFrame(uri:string,options:{timeUs:number;maxWidth:number;maxHeight:number}):Promise<unknown>;
  /** `sampleRate` 0 keeps the file's rate. */
  decodeAudio(uri:string,options:{startUs:number;durationUs:number;sampleRate:number}):Promise<unknown>;
  clearCache():Promise<void>;
}

const isCode=(v:unknown):v is MediaDecodeErrorCode=>MEDIA_DECODE_ERROR_CODES.includes(v as MediaDecodeErrorCode);

/**
 * Reads any rejection into a {@linkcode MediaDecodeError}. Native modules
 * throw with the code as the error's `code` and as a `[code]` prefix on the
 * message, so it survives whichever field the bridge keeps.
 */
export function toMediaDecodeError(error:unknown):MediaDecodeError{
  if(error instanceof MediaDecodeError)return error;
  const e=(error&&typeof error==="object"?error:{}) as {code?:unknown;message?:unknown};
  const raw=typeof e.message==="string"?e.message:typeof error==="string"?error:"";
  const prefixed=/^\s*\[([a-z-]+)\]\s*/.exec(raw);
  const code=isCode(e.code)?e.code:prefixed&&isCode(prefixed[1])?prefixed[1]:"decode-failed";
  const message=(prefixed?raw.slice(prefixed[0].length):raw)||"The media could not be decoded.";
  return new MediaDecodeError(code,message);
}

const outOfRange=(message:string)=>new MediaDecodeError("out-of-range",message);
const isMicros=(v:unknown):v is number=>typeof v==="number"&&Number.isSafeInteger(v)&&v>=0;

function edge(value:number|undefined,name:string):number{
  if(value===undefined)return DEFAULT_FRAME_EDGE;
  if(!Number.isSafeInteger(value)||value<1||value>MAX_FRAME_EDGE)
    throw outOfRange(`${name} must be an integer from 1 to ${MAX_FRAME_EDGE}`);
  return value;
}

/**
 * Checks a frame request and fills the default box.
 * @throws MediaDecodeError "out-of-range" for a negative or fractional time or a box past the cap
 */
export function normalizeFrameOptions(options:DecodeFrameOptions):{timeUs:number;maxWidth:number;maxHeight:number}{
  if(!isMicros(options.timeUs))throw outOfRange("timeUs must be a nonnegative integer");
  return {timeUs:options.timeUs,maxWidth:edge(options.maxWidth,"maxWidth"),maxHeight:edge(options.maxHeight,"maxHeight")};
}

/**
 * Checks an audio request. `sampleRate` 0 means the source rate.
 * @throws MediaDecodeError "out-of-range" for a span longer than 60 s, an empty span, or a rate outside 8–192 kHz
 */
export function normalizeAudioOptions(options:DecodeAudioOptions):{startUs:number;durationUs:number;sampleRate:number}{
  if(!isMicros(options.startUs))throw outOfRange("startUs must be a nonnegative integer");
  if(!isMicros(options.durationUs)||options.durationUs===0)throw outOfRange("durationUs must be a positive integer");
  if(options.durationUs>MAX_DECODE_DURATION_US)throw outOfRange(`durationUs is limited to ${MAX_DECODE_DURATION_US} (60 s) per call`);
  const rate=options.sampleRate;
  if(rate!==undefined&&(!Number.isSafeInteger(rate)||rate<MIN_SAMPLE_RATE||rate>MAX_SAMPLE_RATE))
    throw outOfRange(`sampleRate must be an integer from ${MIN_SAMPLE_RATE} to ${MAX_SAMPLE_RATE}`);
  return {startUs:options.startUs,durationUs:options.durationUs,sampleRate:rate??0};
}

/** Scales a size down to fit a box, keeping the aspect ratio. Never scales up; never returns 0. */
export function fitWithin(width:number,height:number,maxWidth:number,maxHeight:number):{width:number;height:number}{
  if(!(width>0&&height>0))throw new RangeError("width and height must be positive");
  const scale=Math.min(1,maxWidth/width,maxHeight/height);
  return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}

/** First and one-past-last sample frame for a span at `sampleRate`, clamped to `totalFrames`. */
export function frameSpan(startUs:number,durationUs:number,sampleRate:number,totalFrames:number):{start:number;end:number}{
  const start=Math.min(totalFrames,Math.round(startUs*sampleRate/1e6));
  const end=Math.min(totalFrames,start+Math.round(durationUs*sampleRate/1e6));
  return {start,end};
}

/** Interleaves planar channels over `[start, end)` into one buffer: L R L R … */
export function interleave(channels:readonly Float32Array[],start:number,end:number):Float32Array{
  const count=channels.length,frames=Math.max(0,end-start);
  const out=new Float32Array(frames*count);
  for(let c=0;c<count;c++){
    const src=channels[c]!;
    for(let i=0;i<frames;i++)out[i*count+c]=src[start+i]??0;
  }
  return out;
}

const num=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)?v:undefined;
const str=(v:unknown)=>typeof v==="string"&&v?v:undefined;
const bad=(what:string)=>new MediaDecodeError("decode-failed",`The native decoder returned an unreadable ${what}.`);

/** Reads the flat native probe record. */
export function toMediaProbe(payload:unknown):MediaProbe{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const durationUs=num(p.durationUs);
  if(durationUs===undefined||durationUs<0)throw bad("probe");
  const width=num(p.width),height=num(p.height),frameRate=num(p.frameRate),videoCodec=str(p.videoCodec);
  const sampleRate=num(p.sampleRate),channels=num(p.channels),audioCodec=str(p.audioCodec);
  const video=p.hasVideo===true&&width&&height
    ?{width,height,...(frameRate?{frameRate}:{}),...(videoCodec?{codec:videoCodec}:{})}:undefined;
  const audio=p.hasAudio===true&&sampleRate&&channels
    ?{sampleRate,channels,...(audioCodec?{codec:audioCodec}:{})}:undefined;
  return {durationUs:Math.round(durationUs),...(video?{video}:{}),...(audio?{audio}:{})};
}

/** Reads the native frame record. */
export function toDecodedFrame(payload:unknown):DecodedFrame{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const uri=str(p.uri),actual=num(p.actualTimeUs),width=num(p.width),height=num(p.height);
  if(!uri||actual===undefined||actual<0||!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||!width||!height||width<1||height<1||width>MAX_FRAME_EDGE||height>MAX_FRAME_EDGE)throw bad("frame");
  return {uri,actualTimeUs:Math.round(actual),timing:"presentation",width,height};
}

/** Reads the native audio record (samples written to a file). */
export function toDecodedAudio(payload:unknown):DecodedAudio{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const uri=str(p.uri),sampleRate=num(p.sampleRate),channels=num(p.channels),frames=num(p.frames);
  if(!uri||!sampleRate||sampleRate<8000||sampleRate>192000||!channels||!Number.isSafeInteger(channels)||channels<1||channels>32||frames===undefined||!Number.isSafeInteger(frames)||frames<0||frames*channels*4>256*1024*1024)throw bad("audio result");
  return {sampleRate,channels,frames,pcm:{kind:"file",uri,byteLength:frames*channels*4}};
}

/** Validate a complete native index; never repair, truncate or extrapolate it. */
export function toMediaPresentationIndex(payload:unknown,maxFrames=MAX_PRESENTATION_INDEX_FRAMES):MediaPresentationIndex{
  if(!Number.isSafeInteger(maxFrames)||maxFrames<1||maxFrames>MAX_PRESENTATION_INDEX_FRAMES)
    throw outOfRange(`maxFrames must be an integer from 1 to ${MAX_PRESENTATION_INDEX_FRAMES}`);
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  if(!isMicros(p.durationUs)||p.durationUs===0||!Array.isArray(p.timesUs)||p.timesUs.length===0||p.timesUs.length>maxFrames)
    throw bad("presentation index");
  const times:number[]=[];
  for(const value of p.timesUs){
    if(!isMicros(value)||value>=p.durationUs||(times.length>0&&value<=times[times.length-1]!))throw bad("presentation index");
    times.push(value);
  }
  return Object.freeze({durationUs:p.durationUs,timesUs:Object.freeze(times)});
}

const unavailable=()=>Promise.reject(new MediaDecodeError("unsupported-format","This build has no media decoder for this platform."));

/**
 * Builds {@linkcode MediaDecoder} over `native` (null when the module is not
 * linked). Requests are validated here before they reach native code, and
 * every rejection is a {@linkcode MediaDecodeError}.
 */
export function createMediaDecoder(native:MediaDecoderNative|null):MediaDecoder{
  const call=async<T>(run:()=>Promise<unknown>,read:(payload:unknown)=>T):Promise<T>=>{
    let payload:unknown;
    try{payload=await run();}catch(error){throw toMediaDecodeError(error);}
    return read(payload);
  };
  if(!native)return {isAvailable:false,probe:unavailable,decodeFrame:unavailable,decodeAudio:unavailable,clearCache:async()=>{}};
  return {
    isAvailable:true,
    ...(typeof native.presentationIndexV1==="function"?{
      presentationIndexVersion:1 as const,
      async presentationIndex(uri:string,options:PresentationIndexOptions={}){
        const maxFrames=options.maxFrames??MAX_PRESENTATION_INDEX_FRAMES;
        if(!Number.isSafeInteger(maxFrames)||maxFrames<1||maxFrames>MAX_PRESENTATION_INDEX_FRAMES)
          throw outOfRange(`maxFrames must be an integer from 1 to ${MAX_PRESENTATION_INDEX_FRAMES}`);
        return withDecodeCancellation(options.signal,()=>call(()=>native.presentationIndexV1!(uri,maxFrames),payload=>toMediaPresentationIndex(payload,maxFrames)));
      },
    }:{}),
    ...(typeof native.decodeIndexedFrameV1==="function"?{
      indexedFrameVersion:1 as const,
      async decodeIndexedFrame(uri:string,options:DecodeFrameOptions){
        const request=normalizeFrameOptions(options);
        return withDecodeCancellation(options.signal,()=>call(()=>native.decodeIndexedFrameV1!(uri,request),payload=>{
          const nativeTime=(payload&&typeof payload==="object"?payload:{}) as {actualTimeUs?:unknown};
          if(!isMicros(nativeTime.actualTimeUs)||nativeTime.actualTimeUs!==request.timeUs)throw bad("indexed frame presentation time");
          const frame=toDecodedFrame(payload);
          return frame;
        }));
      },
    }:{}),
    probe:uri=>call(()=>native.probe(uri),toMediaProbe),
    async decodeFrame(uri,options){
      const request=normalizeFrameOptions(options);
      return withDecodeCancellation(options.signal,()=>call(()=>native.decodeFrame(uri,request),toDecodedFrame));
    },
    async decodeAudio(uri,options){
      const request=normalizeAudioOptions(options);
      return call(()=>native.decodeAudio(uri,request),toDecodedAudio);
    },
    async clearCache(){
      try{await native.clearCache();}catch(error){throw toMediaDecodeError(error);}
    },
  };
}

/** Abort the consumer without sending an imperative AbortSignal through the native bridge. */
export function withDecodeCancellation<T>(signal: AbortSignal | undefined, run: () => Promise<T>): Promise<T> {
  if (signal?.aborted) return Promise.reject(new MediaDecodeError("cancelled", "Media decoding was cancelled."));
  if (!signal) return run();
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => signal.removeEventListener("abort", abort);
    const abort = () => {
      if (settled) return;
      settled = true; cleanup(); reject(new MediaDecodeError("cancelled", "Media decoding was cancelled."));
    };
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) { abort(); return; }
    Promise.resolve().then(() => signal.aborted ? Promise.reject(new MediaDecodeError("cancelled", "Media decoding was cancelled.")) : run()).then(value => {
      if (!settled) { settled = true; cleanup(); resolve(value); }
    }, error => { if (!settled) { settled = true; cleanup(); reject(error); } });
  });
}
