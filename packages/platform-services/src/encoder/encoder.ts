/**
 * Media encoding: turn bounded raw audio/video sources into a finished
 * media file. v1 is H.264 video and AAC audio in a faststart MP4, matching
 * the decoder matrix; other codecs and containers are not in scope.
 *
 * Sources are uncompressed files the host wrote itself: tightly packed
 * RGBA8 frames for video and little-endian interleaved PCM for audio.
 * Every size is validated here before a request reaches native code or a
 * browser codec, and every rejection is a {@linkcode MediaEncodeError}.
 */

/** Why an encode failed. Each platform maps its own errors onto these. */
export type MediaEncodeErrorCode="not-found"|"unsupported-format"|"encode-failed"|"out-of-range"|"permission"|"cancelled";

export const MEDIA_ENCODE_ERROR_CODES:readonly MediaEncodeErrorCode[]=
  ["not-found","unsupported-format","encode-failed","out-of-range","permission","cancelled"];

/** The error every encoder call rejects with. */
export class MediaEncodeError extends Error {
  readonly code:MediaEncodeErrorCode;
  constructor(code:MediaEncodeErrorCode,message:string){
    super(message);
    this.name="MediaEncodeError";
    this.code=code;
  }
}

/** Largest `width` or `height` an encode may declare. */
export const MAX_ENCODE_EDGE=4096;
/** Largest total pixel count one video track may declare (3840×2160). */
export const MAX_ENCODE_PIXELS=8_294_400;
/** Most frames one video track may declare. */
export const MAX_ENCODE_FRAMES=100_000;
/** Largest raw RGBA8 video source file: frames × width × height × 4. */
export const MAX_VIDEO_SOURCE_BYTES=8*1024*1024*1024;
/** Largest raw PCM audio source file. */
export const MAX_AUDIO_SOURCE_BYTES=1024*1024*1024;
/** Sample rates `encode` accepts for audio. */
export const MIN_ENCODE_SAMPLE_RATE=8000;
export const MAX_ENCODE_SAMPLE_RATE=192_000;
/** Audio channel counts v1 accepts (AAC mono/stereo). */
export const MAX_ENCODE_CHANNELS=2;
/** Frame-rate numerator/denominator bound; the rate itself must land in [MIN_ENCODE_FPS, MAX_ENCODE_FPS]. */
export const MAX_ENCODE_RATE_PART=1_000_000;
export const MIN_ENCODE_FPS=0.01;
export const MAX_ENCODE_FPS=240;
/** Byte size of one RGBA8 frame row-unit: four bytes per pixel. */
export const VIDEO_BYTES_PER_PIXEL=4;

/** The only pixel layout v1 accepts: bytes R,G,B,A per pixel, rows tightly packed. */
export const VIDEO_PIXEL_FORMAT="rgba8";
/** PCM layouts v1 accepts: little-endian, interleaved by channel. */
export const AUDIO_SAMPLE_FORMATS=["f32","s16"] as const;
export type AudioSampleFormat=(typeof AUDIO_SAMPLE_FORMATS)[number];
/** Bytes per sample for each layout. */
export const AUDIO_SAMPLE_BYTES:Record<AudioSampleFormat,number>={f32:4,s16:2};

/** A raw uncompressed video source: one file of `frameCount` RGBA8 frames. */
export interface EncodeVideoTrack {
  /** File URL (`file://`, `content://`) or fetchable URL of the raw frame bytes. */
  readonly uri:string;
  readonly width:number;
  readonly height:number;
  readonly pixelFormat?:typeof VIDEO_PIXEL_FORMAT;
  /** Rational frame rate, e.g. 30000/1001 for 29.97 fps. */
  readonly frameRateNum:number;
  readonly frameRateDen:number;
  /** Exact number of frames in the file. */
  readonly frameCount:number;
}

/** A raw uncompressed audio source: one file of interleaved PCM. */
export interface EncodeAudioTrack {
  readonly uri:string;
  readonly sampleRate:number;
  readonly channels:number;
  readonly sampleFormat?:AudioSampleFormat;
  /** Exact number of sample frames (per channel) in the file. */
  readonly frames:number;
}

/** What {@linkcode MediaEncoder.encode} writes. At least one track is required. */
export interface EncodeRequest {
  readonly video?:EncodeVideoTrack;
  readonly audio?:EncodeAudioTrack;
}

export interface EncodeOptions {
  /** Detaches the consumer; native encode work already submitted may drain on its owner. */
  readonly signal?:AbortSignal;
}

/** What {@linkcode MediaEncoder.probe} reports about this build's encoder. */
export interface MediaEncoderProbe {
  /** The only container v1 writes. */
  readonly container:"mp4";
  /** True when this build reports H.264 encode support. */
  readonly video:boolean;
  /** True when this build reports AAC encode support. */
  readonly audio:boolean;
  /** Hardware acceleration when the platform can tell; absent means unknown. */
  readonly hardwareAccelerated?:boolean;
}

/** A finished media file. */
export interface EncodedMedia {
  /** `file://` in the encoder cache on native, a `data:` URL on web. */
  readonly uri:string;
  readonly mimeType:"video/mp4";
  readonly byteLength:number;
  /** Longest track duration in integer microseconds. */
  readonly durationUs:number;
}

/** Platform media encoding (H.264 + AAC → faststart MP4). */
export interface MediaEncoder {
  /** False when this build links no encoder; every call then rejects with "unsupported-format". */
  readonly isAvailable:boolean;
  /** Reports codec/container support. It does not prove a given device can encode a given size. */
  probe():Promise<MediaEncoderProbe>;
  encode(request:EncodeRequest,options?:EncodeOptions):Promise<EncodedMedia>;
  /** Deletes the media files this encoder wrote. Web keeps nothing and resolves at once. */
  clearCache():Promise<void>;
}

/** The native half. Records are flat; this file validates them. */
export interface MediaEncoderNative {
  probe():Promise<unknown>;
  /** `null` for an absent track. JS never sends an AbortSignal across the bridge. */
  encode(video:EncodeVideoNative|null,audio:EncodeAudioNative|null):Promise<unknown>;
  clearCache():Promise<void>;
}

/** Flat video record sent over the bridge. */
export interface EncodeVideoNative {
  readonly uri:string;
  readonly width:number;
  readonly height:number;
  readonly pixelFormat:string;
  readonly frameRateNum:number;
  readonly frameRateDen:number;
  readonly frameCount:number;
}

/** Flat audio record sent over the bridge. */
export interface EncodeAudioNative {
  readonly uri:string;
  readonly sampleRate:number;
  readonly channels:number;
  readonly sampleFormat:string;
  readonly frames:number;
}

const isCode=(v:unknown):v is MediaEncodeErrorCode=>MEDIA_ENCODE_ERROR_CODES.includes(v as MediaEncodeErrorCode);

/**
 * Reads any rejection into a {@linkcode MediaEncodeError}. Native modules
 * throw with the code as the error's `code` and as a `[code]` prefix on the
 * message, so it survives whichever field the bridge keeps.
 */
export function toMediaEncodeError(error:unknown):MediaEncodeError{
  if(error instanceof MediaEncodeError)return error;
  const e=(error&&typeof error==="object"?error:{}) as {code?:unknown;message?:unknown};
  const raw=typeof e.message==="string"?e.message:typeof error==="string"?error:"";
  const prefixed=/^\s*\[([a-z-]+)\]\s*/.exec(raw);
  const code=isCode(e.code)?e.code:prefixed&&isCode(prefixed[1])?prefixed[1]:"encode-failed";
  const message=(prefixed?raw.slice(prefixed[0].length):raw)||"The media could not be encoded.";
  return new MediaEncodeError(code,message);
}

const outOfRange=(message:string)=>new MediaEncodeError("out-of-range",message);
const isCount=(v:unknown):v is number=>typeof v==="number"&&Number.isSafeInteger(v)&&v>=0;
const isUri=(v:unknown):v is string=>typeof v==="string"&&v.length>0;

function dimension(value:number|undefined,name:string):number{
  if(typeof value!=="number"||!Number.isSafeInteger(value)||value<1||value>MAX_ENCODE_EDGE)
    throw outOfRange(`${name} must be an integer from 1 to ${MAX_ENCODE_EDGE}`);
  return value;
}

/** Validates a video track and returns its flat native form. */
export function normalizeVideoTrack(track:EncodeVideoTrack):EncodeVideoNative{
  if(!isUri(track.uri))throw outOfRange("video.uri must be a nonempty URL");
  const width=dimension(track.width,"width"),height=dimension(track.height,"height");
  if(width*height>MAX_ENCODE_PIXELS)throw outOfRange(`width×height is limited to ${MAX_ENCODE_PIXELS} pixels`);
  const pixelFormat=track.pixelFormat??VIDEO_PIXEL_FORMAT;
  if(pixelFormat!==VIDEO_PIXEL_FORMAT)throw new MediaEncodeError("unsupported-format",`pixelFormat must be "${VIDEO_PIXEL_FORMAT}"`);
  const {frameRateNum,frameRateDen}=track;
  if(!isCount(frameRateNum)||frameRateNum<1||frameRateNum>MAX_ENCODE_RATE_PART||
     !isCount(frameRateDen)||frameRateDen<1||frameRateDen>MAX_ENCODE_RATE_PART)
    throw outOfRange(`frameRateNum and frameRateDen must be integers from 1 to ${MAX_ENCODE_RATE_PART}`);
  const fps=frameRateNum/frameRateDen;
  if(!(fps>=MIN_ENCODE_FPS&&fps<=MAX_ENCODE_FPS))throw outOfRange(`frame rate must be within ${MIN_ENCODE_FPS}–${MAX_ENCODE_FPS} fps`);
  if(!isCount(track.frameCount)||track.frameCount<1||track.frameCount>MAX_ENCODE_FRAMES)
    throw outOfRange(`frameCount must be an integer from 1 to ${MAX_ENCODE_FRAMES}`);
  const bytes=track.frameCount*width*height*VIDEO_BYTES_PER_PIXEL;
  if(bytes>MAX_VIDEO_SOURCE_BYTES)throw outOfRange(`the raw video source is limited to ${MAX_VIDEO_SOURCE_BYTES} bytes`);
  return {uri:track.uri,width,height,pixelFormat,frameRateNum,frameRateDen,frameCount:track.frameCount};
}

/** Validates an audio track and returns its flat native form. */
export function normalizeAudioTrack(track:EncodeAudioTrack):EncodeAudioNative{
  if(!isUri(track.uri))throw outOfRange("audio.uri must be a nonempty URL");
  const {sampleRate,channels}=track;
  if(!Number.isSafeInteger(sampleRate)||sampleRate<MIN_ENCODE_SAMPLE_RATE||sampleRate>MAX_ENCODE_SAMPLE_RATE)
    throw outOfRange(`sampleRate must be an integer from ${MIN_ENCODE_SAMPLE_RATE} to ${MAX_ENCODE_SAMPLE_RATE}`);
  if(!Number.isSafeInteger(channels)||channels<1||channels>MAX_ENCODE_CHANNELS)
    throw outOfRange(`channels must be an integer from 1 to ${MAX_ENCODE_CHANNELS}`);
  const sampleFormat=track.sampleFormat??"f32";
  if(!AUDIO_SAMPLE_FORMATS.includes(sampleFormat))throw new MediaEncodeError("unsupported-format",`sampleFormat must be one of ${AUDIO_SAMPLE_FORMATS.join(", ")}`);
  if(!isCount(track.frames)||track.frames<1)throw outOfRange("frames must be a positive integer");
  const bytes=track.frames*channels*AUDIO_SAMPLE_BYTES[sampleFormat];
  if(bytes>MAX_AUDIO_SOURCE_BYTES)throw outOfRange(`the raw audio source is limited to ${MAX_AUDIO_SOURCE_BYTES} bytes`);
  return {uri:track.uri,sampleRate,channels,sampleFormat,frames:track.frames};
}

/**
 * Checks an encode request: at least one track, each normalized.
 * @throws MediaEncodeError "out-of-range" for bounds violations, "unsupported-format" for a bad pixel/sample format
 */
export function normalizeEncodeRequest(request:EncodeRequest):{video:EncodeVideoNative|null;audio:EncodeAudioNative|null}{
  const video=request.video?normalizeVideoTrack(request.video):null;
  const audio=request.audio?normalizeAudioTrack(request.audio):null;
  if(!video&&!audio)throw outOfRange("encode requires a video or an audio track");
  return {video,audio};
}

const num=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)?v:undefined;
const str=(v:unknown)=>typeof v==="string"&&v?v:undefined;
const bad=(what:string)=>new MediaEncodeError("encode-failed",`The encoder returned an unreadable ${what}.`);

/** Reads the flat native probe record. */
export function toMediaEncoderProbe(payload:unknown):MediaEncoderProbe{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  if(p.container!=="mp4"||typeof p.video!=="boolean"||typeof p.audio!=="boolean")throw bad("probe");
  const hardware=p.hardwareAccelerated;
  return {container:"mp4",video:p.video,audio:p.audio,
    ...(typeof hardware==="boolean"?{hardwareAccelerated:hardware}:{})};
}

/** Reads the native encoded-media record. */
export function toEncodedMedia(payload:unknown):EncodedMedia{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const uri=str(p.uri),byteLength=num(p.byteLength),durationUs=num(p.durationUs);
  if(!uri||p.mimeType!=="video/mp4"||byteLength===undefined||!Number.isSafeInteger(byteLength)||byteLength<1||
     durationUs===undefined||!Number.isFinite(durationUs)||durationUs<1)throw bad("result");
  return {uri,mimeType:"video/mp4",byteLength,durationUs:Math.round(durationUs)};
}

const unavailable=()=>Promise.reject(new MediaEncodeError("unsupported-format","This build has no media encoder for this platform."));

/**
 * Builds {@linkcode MediaEncoder} over `native` (null when the module is not
 * linked). Requests are validated here before they reach native code, and
 * every rejection is a {@linkcode MediaEncodeError}.
 */
export function createMediaEncoder(native:MediaEncoderNative|null):MediaEncoder{
  const call=async<T>(run:()=>Promise<unknown>,read:(payload:unknown)=>T):Promise<T>=>{
    let payload:unknown;
    try{payload=await run();}catch(error){throw toMediaEncodeError(error);}
    return read(payload);
  };
  if(!native)return {isAvailable:false,probe:unavailable,encode:unavailable,clearCache:async()=>{}};
  return {
    isAvailable:true,
    probe:()=>call(()=>native.probe(),toMediaEncoderProbe),
    async encode(request,options){
      const normalized=normalizeEncodeRequest(request);
      return withEncodeCancellation(options?.signal,()=>call(()=>native.encode(normalized.video,normalized.audio),toEncodedMedia));
    },
    async clearCache(){
      try{await native.clearCache();}catch(error){throw toMediaEncodeError(error);}
    },
  };
}

/** Abort the consumer without sending an imperative AbortSignal through the native bridge. */
export function withEncodeCancellation<T>(signal: AbortSignal | undefined, run: () => Promise<T>): Promise<T> {
  if (signal?.aborted) return Promise.reject(new MediaEncodeError("cancelled", "Media encoding was cancelled."));
  if (!signal) return run();
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => signal.removeEventListener("abort", abort);
    const abort = () => {
      if (settled) return;
      settled = true; cleanup(); reject(new MediaEncodeError("cancelled", "Media encoding was cancelled."));
    };
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) { abort(); return; }
    Promise.resolve().then(() => signal.aborted ? Promise.reject(new MediaEncodeError("cancelled", "Media encoding was cancelled.")) : run()).then(value => {
      if (!settled) { settled = true; cleanup(); resolve(value); }
    }, error => { if (!settled) { settled = true; cleanup(); reject(error); } });
  });
}
