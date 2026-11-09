/**
 * Audio device provider (Forge P09 cadence audio device host decision):
 * play interleaved PCM through the platform output device and capture
 * input PCM, behind one typed contract. The engine never runs on an audio
 * callback: the host renders lookahead windows and pushes bounded chunks
 * through {@linkcode AudioDeviceProvider.writeOutput}; each platform keeps
 * its own bounded ring/queue between the write path and the realtime
 * consumer, and reports drops and underruns through {@linkcode
 * AudioDeviceProvider.stats} instead of stalling callbacks.
 *
 * v1 scope: playback of f32/s16 PCM on iOS (AVAudioEngine source node),
 * Android (AudioTrack) and web (AudioWorklet); capture is implemented on
 * the same three platforms but is unverified on every target — see the
 * package README "Verified so far".
 */

/** Why an audio device call failed. Each platform maps its own errors onto these. */
export type AudioDeviceErrorCode=
  |"device-not-found"|"unsupported-format"|"busy"|"permission"|"out-of-range"
  |"cancelled"|"device-lost"|"device-error";

export const AUDIO_DEVICE_ERROR_CODES:readonly AudioDeviceErrorCode[]=[
  "device-not-found","unsupported-format","busy","permission","out-of-range","cancelled","device-lost","device-error",
];

/** The error every provider call rejects with. */
export class AudioDeviceError extends Error {
  readonly code:AudioDeviceErrorCode;
  constructor(code:AudioDeviceErrorCode,message:string){
    super(message);
    this.name="AudioDeviceError";
    this.code=code;
  }
}

/** PCM sample encodings the contract accepts on input and reports on output. */
export type PcmSampleFormat="f32"|"s16";

/** Interleaved little-endian PCM layout: frame-major, one sample per channel per frame. */
export interface AudioFormat {
  readonly sampleRate:number;
  readonly channels:number;
  readonly sampleFormat:PcmSampleFormat;
}

/** One enumerated audio endpoint. `id` is platform-specific and may be empty before permission. */
export interface AudioDeviceDescriptor {
  readonly id:string;
  readonly name:string;
  readonly kind:"input"|"output"|"duplex";
}

/** What {@linkcode AudioDeviceProvider.probe} reports. */
export interface AudioDeviceProbe {
  readonly available:boolean;
  /** Negotiation hint: the device's native rate when the platform reports one. */
  readonly defaultSampleRate:number;
  readonly outputs:readonly AudioDeviceDescriptor[];
  readonly inputs:readonly AudioDeviceDescriptor[];
}

/** Options for opening an output or input stream. */
export interface OpenAudioStreamOptions {
  /** Platform device id from {@linkcode AudioDeviceProvider.probe}; empty/omitted picks the default. */
  readonly deviceId?:string;
  /** Requested rate; the platform may substitute its native rate and reports the actual one. */
  readonly sampleRate?:number;
  /** 1..{@linkcode MAX_AUDIO_CHANNELS}; native may clamp and reports the actual count. */
  readonly channels?:number;
  /** Requested encoding. Platforms may substitute a supported encoding and report the actual one. */
  readonly sampleFormat?:PcmSampleFormat;
  /** Ring/queue capacity hint in milliseconds; clamped to platform bounds. @default 2000 */
  readonly bufferMs?:number;
}

/** An opened stream: the id later calls take, plus the format actually negotiated. */
export interface AudioStreamHandle {
  readonly stream:string;
  readonly format:AudioFormat;
  /** Reported output latency (hardware + buffer) in milliseconds; 0 when the platform cannot say. */
  readonly latencyMs:number;
}

/**
 * Interleaved PCM handed to {@linkcode AudioDeviceProvider.writeOutput} or
 * returned by readInput. Callers may pass an `ArrayBuffer` or any
 * `ArrayBufferView` (e.g. `Uint8Array`); the provider normalizes views —
 * honouring `byteOffset`/`byteLength` — to a `Uint8Array` view before the
 * payload crosses the native bridge, because Expo Modules delivers
 * `Data`/`ByteArray` as `Uint8Array`, never `ArrayBuffer`.
 */
export interface PcmChunk {
  /** Little-endian interleaved samples: `frames * channels` values in `format.sampleFormat`. */
  readonly samples:ArrayBuffer|ArrayBufferView;
  readonly frames:number;
  readonly sampleFormat:PcmSampleFormat;
}

/** Counters a stream reports. Underruns are counted on the realtime consumer; drops on the write path. */
export interface AudioStreamStats {
  readonly stream:string;
  readonly format:AudioFormat;
  /** Frames currently queued for playback (output) or waiting to be read (input). */
  readonly queuedFrames:number;
  readonly capacityFrames:number;
  /** Frames discarded on write because the queue was full (output) or overwritten (input). */
  readonly droppedFrames:number;
  /** Output frames rendered as silence because the queue ran dry. Always 0 for input streams. */
  readonly underrunFrames:number;
}

/** Asynchronous device events. Underrun detail lives in {@linkcode AudioStreamStats}; these are lifecycle. */
export interface AudioDeviceEvent {
  readonly stream:string;
  readonly kind:"device-lost"|"error";
  readonly message?:string;
}

/** Platform audio device I/O. */
export interface AudioDeviceProvider {
  /** False when this build has no audio backend; every call then rejects with "unsupported-format". */
  readonly isAvailable:boolean;
  probe():Promise<AudioDeviceProbe>;
  openOutput(options?:OpenAudioStreamOptions):Promise<AudioStreamHandle>;
  /** Queue one PCM chunk for playback. Validated here; oversized chunks reject "out-of-range". */
  writeOutput(stream:string,chunk:PcmChunk):Promise<void>;
  /** Live counters for an open stream; rejects "device-not-found" for unknown ids. */
  stats(stream:string):Promise<AudioStreamStats>;
  closeOutput(stream:string):Promise<void>;
  openInput(options?:OpenAudioStreamOptions):Promise<AudioStreamHandle>;
  /** Drain up to `maxFrames` of captured PCM as interleaved f32; fewer at stream end or when empty. */
  readInput(stream:string,maxFrames:number):Promise<PcmChunk>;
  closeInput(stream:string):Promise<void>;
  addListener(listener:(event:AudioDeviceEvent)=>void):{remove():void};
}

/** The native half. Records are flat; this file validates them. */
export interface AudioDeviceNative {
  probe():Promise<unknown>;
  openOutput(options:{deviceId:string;sampleRate:number;channels:number;sampleFormat:string;bufferMs:number}):Promise<unknown>;
  writeOutput(stream:string,payload:{samples:Uint8Array;sampleFormat:string;frames:number}):Promise<void>;
  stats(stream:string):Promise<unknown>;
  closeOutput(stream:string):Promise<void>;
  openInput(options:{deviceId:string;sampleRate:number;channels:number;sampleFormat:string;bufferMs:number}):Promise<unknown>;
  readInput(stream:string,maxFrames:number):Promise<unknown>;
  closeInput(stream:string):Promise<void>;
  addListener?(eventName:"audio",listener:(payload:unknown)=>void):{remove():void};
}

/** Largest single PCM chunk accepted by writeOutput: 8 MiB of payload. */
export const MAX_PCM_CHUNK_BYTES=8*1024*1024;
/** Largest frames one readInput call may ask for. */
export const MAX_READ_FRAMES=1<<20;
export const MIN_AUDIO_SAMPLE_RATE=8000;
export const MAX_AUDIO_SAMPLE_RATE=384_000;
export const MAX_AUDIO_CHANNELS=8;
export const MIN_AUDIO_CHANNELS=1;
export const DEFAULT_BUFFER_MS=2000;
export const MAX_BUFFER_MS=10_000;

const isCode=(v:unknown):v is AudioDeviceErrorCode=>AUDIO_DEVICE_ERROR_CODES.includes(v as AudioDeviceErrorCode);

/**
 * Reads any rejection into an {@linkcode AudioDeviceError}. Native modules
 * throw with the code as the error's `code` and as a `[code]` prefix on the
 * message, so it survives whichever field the bridge keeps.
 */
export function toAudioDeviceError(error:unknown):AudioDeviceError{
  if(error instanceof AudioDeviceError)return error;
  const e=(error&&typeof error==="object"?error:{}) as {code?:unknown;message?:unknown};
  const raw=typeof e.message==="string"?e.message:typeof error==="string"?error:"";
  const prefixed=/^\s*\[([a-z-]+)\]\s*/.exec(raw);
  const code=isCode(e.code)?e.code:prefixed&&isCode(prefixed[1])?prefixed[1]:"device-error";
  const message=(prefixed?raw.slice(prefixed[0].length):raw)||"The audio device request failed.";
  return new AudioDeviceError(code,message);
}

const outOfRange=(message:string)=>new AudioDeviceError("out-of-range",message);

/** Bytes per sample for an encoding. */
export function bytesPerSample(format:PcmSampleFormat):number{return format==="f32"?4:2;}

/** Validates a format triple and returns it normalized. */
export function normalizeFormat(format:AudioFormat):AudioFormat{
  const {sampleRate,channels,sampleFormat}=format;
  if(!Number.isSafeInteger(sampleRate)||sampleRate<MIN_AUDIO_SAMPLE_RATE||sampleRate>MAX_AUDIO_SAMPLE_RATE)
    throw outOfRange(`sampleRate must be an integer from ${MIN_AUDIO_SAMPLE_RATE} to ${MAX_AUDIO_SAMPLE_RATE}`);
  if(!Number.isSafeInteger(channels)||channels<MIN_AUDIO_CHANNELS||channels>MAX_AUDIO_CHANNELS)
    throw outOfRange(`channels must be an integer from ${MIN_AUDIO_CHANNELS} to ${MAX_AUDIO_CHANNELS}`);
  if(sampleFormat!=="f32"&&sampleFormat!=="s16")throw outOfRange("sampleFormat must be \"f32\" or \"s16\"");
  return {sampleRate,channels,sampleFormat};
}

/**
 * Checks open options. Zero/omitted values mean "platform default" and are
 * sent as 0 so native picks its native rate and channel count.
 * @throws AudioDeviceError "out-of-range" for values outside the contract bounds
 */
export function normalizeOpenOptions(options:OpenAudioStreamOptions={}):{deviceId:string;sampleRate:number;channels:number;sampleFormat:string;bufferMs:number}{
  const rate=options.sampleRate??0;
  if(rate!==0&&(!Number.isSafeInteger(rate)||rate<MIN_AUDIO_SAMPLE_RATE||rate>MAX_AUDIO_SAMPLE_RATE))
    throw outOfRange(`sampleRate must be 0 (platform default) or an integer from ${MIN_AUDIO_SAMPLE_RATE} to ${MAX_AUDIO_SAMPLE_RATE}`);
  const channels=options.channels??0;
  if(channels!==0&&(!Number.isSafeInteger(channels)||channels<MIN_AUDIO_CHANNELS||channels>MAX_AUDIO_CHANNELS))
    throw outOfRange(`channels must be 0 (platform default) or an integer from ${MIN_AUDIO_CHANNELS} to ${MAX_AUDIO_CHANNELS}`);
  const format=options.sampleFormat??"";
  if(format!==""&&format!=="f32"&&format!=="s16")throw outOfRange("sampleFormat must be \"f32\", \"s16\" or omitted");
  const bufferMs=options.bufferMs??DEFAULT_BUFFER_MS;
  if(!Number.isSafeInteger(bufferMs)||bufferMs<1||bufferMs>MAX_BUFFER_MS)
    throw outOfRange(`bufferMs must be an integer from 1 to ${MAX_BUFFER_MS}`);
  const deviceId=options.deviceId??"";
  if(typeof deviceId!=="string"||deviceId.length>256)throw outOfRange("deviceId must be a string of at most 256 characters");
  return {deviceId,sampleRate:rate,channels,sampleFormat:format,bufferMs};
}

/**
 * Checks a PCM chunk against its declared format: the buffer must hold
 * exactly `frames * channels * bytesPerSample` bytes and stay under
 * {@linkcode MAX_PCM_CHUNK_BYTES}.
 * @throws AudioDeviceError "out-of-range" on any mismatch
 */
/** A {@linkcode PcmChunk} whose samples are already normalized to a `Uint8Array` view. */
export type NormalizedPcmChunk=PcmChunk&{readonly samples:Uint8Array};

export function normalizePcmChunk(chunk:PcmChunk,channels:number):NormalizedPcmChunk{
  if(!chunk||typeof chunk!=="object")throw outOfRange("chunk must be an object");
  const {samples,frames,sampleFormat}=chunk;
  if(!(samples instanceof ArrayBuffer)&&!ArrayBuffer.isView(samples))
    throw outOfRange("chunk.samples must be an ArrayBuffer or ArrayBufferView");
  if(!Number.isSafeInteger(frames)||frames<0)throw outOfRange("chunk.frames must be a nonnegative integer");
  if(sampleFormat!=="f32"&&sampleFormat!=="s16")throw outOfRange("chunk.sampleFormat must be \"f32\" or \"s16\"");
  const view=toPcmView(samples);
  const expected=frames*channels*bytesPerSample(sampleFormat);
  if(view.byteLength!==expected)
    throw outOfRange(`chunk.samples is ${view.byteLength} bytes but ${frames} frames at ${channels} channels/${sampleFormat} needs ${expected}`);
  if(view.byteLength>MAX_PCM_CHUNK_BYTES)
    throw outOfRange(`chunk.samples exceeds the ${MAX_PCM_CHUNK_BYTES}-byte per-call limit`);
  return {samples:view,frames,sampleFormat};
}

/**
 * Normalizes `ArrayBuffer | ArrayBufferView` to a `Uint8Array` view covering
 * exactly the payload bytes. Views keep their `byteOffset`/`byteLength`, so
 * a window into a larger buffer never leaks neighbouring bytes across the
 * bridge. The view shares the caller's storage — native sides must treat it
 * as read-only input.
 */
function toPcmView(samples:ArrayBuffer|ArrayBufferView):Uint8Array{
  if(samples instanceof ArrayBuffer)return new Uint8Array(samples);
  return new Uint8Array(samples.buffer,samples.byteOffset,samples.byteLength);
}

const num=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)?v:undefined;
const str=(v:unknown)=>typeof v==="string"?v:undefined;
const bad=(what:string)=>new AudioDeviceError("device-error",`The audio backend returned an unreadable ${what}.`);

function toFormat(p:Record<string,unknown>,what:string):AudioFormat{
  const sampleRate=num(p.sampleRate),channels=num(p.channels),sampleFormat=str(p.sampleFormat);
  try{return normalizeFormat({sampleRate:sampleRate??0,channels:channels??0,sampleFormat:(sampleFormat??"") as PcmSampleFormat});}
  catch{throw bad(what);}
}

/** Reads the flat native probe record. */
export function toAudioDeviceProbe(payload:unknown):AudioDeviceProbe{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const devices=(v:unknown):AudioDeviceDescriptor[]=>{
    if(!Array.isArray(v))return[];
    return v.flatMap(item=>{
      const d=(item&&typeof item==="object"?item:{}) as Record<string,unknown>;
      const id=str(d.id),name=str(d.name),kind=str(d.kind);
      return id!==undefined&&name!==undefined&&(kind==="input"||kind==="output"||kind==="duplex")?[{id,name,kind}]:[];
    });
  };
  return {
    available:p.available===true,
    defaultSampleRate:num(p.defaultSampleRate)??0,
    outputs:devices(p.outputs),
    inputs:devices(p.inputs),
  };
}

/** Reads a native opened-stream record. */
export function toAudioStreamHandle(payload:unknown):AudioStreamHandle{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const stream=str(p.stream);
  if(!stream)throw bad("stream handle");
  return {stream,format:toFormat(p,"stream handle"),latencyMs:num(p.latencyMs)??0};
}

/** Reads a native stats record. */
export function toAudioStreamStats(payload:unknown):AudioStreamStats{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const stream=str(p.stream);
  if(!stream)throw bad("stream stats");
  const count=(key:string)=>{const v=num(p[key]);if(v===undefined||v<0||!Number.isSafeInteger(v))throw bad("stream stats");return v;};
  return {stream,format:toFormat(p,"stream stats"),queuedFrames:count("queuedFrames"),capacityFrames:count("capacityFrames"),
    droppedFrames:count("droppedFrames"),underrunFrames:count("underrunFrames")};
}

/** Reads a native captured-PCM record; input is always interleaved f32. */
export function toPcmChunk(payload:unknown,expectedChannels?:number):PcmChunk{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const frames=num(p.frames);
  if(frames===undefined||!Number.isSafeInteger(frames)||frames<0||frames>MAX_READ_FRAMES)throw bad("PCM chunk");
  const sampleFormat=str(p.sampleFormat);
  if(sampleFormat!=="f32")throw bad("PCM chunk"); // capture is delivered as f32 on every platform
  const samples=p.samples;
  // Expo Modules delivers Data/ByteArray as Uint8Array; accept it and any
  // other view the same way.
  if(!(samples instanceof ArrayBuffer)&&!ArrayBuffer.isView(samples))throw bad("PCM chunk");
  const view=toPcmView(samples as ArrayBuffer|ArrayBufferView);
  const channels=expectedChannels??num(p.channels)??0;
  const need=frames*channels*4;
  if(need!==view.byteLength)throw bad("PCM chunk");
  return {samples:view,frames,sampleFormat};
}

/** Reads a native "audio" event payload. */
export function toAudioDeviceEvent(payload:unknown):AudioDeviceEvent|null{
  const p=(payload&&typeof payload==="object"?payload:{}) as Record<string,unknown>;
  const stream=str(p.stream),kind=str(p.kind);
  if(!stream||(kind!=="device-lost"&&kind!=="error"))return null;
  const message=str(p.message);
  return {stream,kind,...(message?{message}:{})};
}

const unavailable=()=>Promise.reject(new AudioDeviceError("unsupported-format","This build has no audio device backend for this platform."));
const noopSubscription={remove(){}};

/**
 * Builds {@linkcode AudioDeviceProvider} over `native` (null when the module
 * is not linked). Open options and PCM chunks are validated here before they
 * reach native code, and every rejection is an {@linkcode AudioDeviceError}.
 */
export function createAudioDeviceProvider(native:AudioDeviceNative|null):AudioDeviceProvider{
  const call=async<T>(run:()=>Promise<unknown>,read:(payload:unknown)=>T):Promise<T>=>{
    let payload:unknown;
    try{payload=await run();}catch(error){throw toAudioDeviceError(error);}
    return read(payload);
  };
  const streams=new Map<string,{format:AudioFormat;kind:"output"|"input"}>();
  const remember=(handle:AudioStreamHandle,kind:"output"|"input")=>{streams.set(handle.stream,{format:handle.format,kind});return handle;};
  const forget=(stream:string)=>{streams.delete(stream);};
  if(!native)return {
    isAvailable:false,probe:unavailable,openOutput:unavailable,writeOutput:unavailable,stats:unavailable,
    closeOutput:async()=>{},openInput:unavailable,readInput:unavailable,closeInput:async()=>{},
    addListener:()=>noopSubscription,
  };
  return {
    isAvailable:true,
    probe:()=>call(()=>native.probe(),toAudioDeviceProbe),
    async openOutput(options){
      const request=normalizeOpenOptions(options);
      const handle=await call(()=>native.openOutput(request),toAudioStreamHandle);
      return remember(handle,"output");
    },
    async writeOutput(stream,chunk){
      const entry=streams.get(stream);
      if(!entry||entry.kind!=="output")throw new AudioDeviceError("device-not-found",`Unknown output stream "${stream}".`);
      const format=entry.format;
      const request=normalizePcmChunk(chunk,format.channels);
      if(request.sampleFormat!==format.sampleFormat)
        throw outOfRange(`chunk.sampleFormat ${request.sampleFormat} does not match the stream's ${format.sampleFormat}`);
      try{await native.writeOutput(stream,{samples:request.samples,sampleFormat:request.sampleFormat,frames:request.frames});}
      catch(error){throw toAudioDeviceError(error);}
    },
    stats:stream=>call(()=>native.stats(stream),toAudioStreamStats),
    async closeOutput(stream){forget(stream);try{await native.closeOutput(stream);}catch(error){throw toAudioDeviceError(error);}},
    async openInput(options){
      const request=normalizeOpenOptions(options);
      const handle=await call(()=>native.openInput(request),toAudioStreamHandle);
      return remember(handle,"input");
    },
    async readInput(stream,maxFrames){
      const entry=streams.get(stream);
      if(!entry||entry.kind!=="input")throw new AudioDeviceError("device-not-found",`Unknown input stream "${stream}".`);
      if(!Number.isSafeInteger(maxFrames)||maxFrames<1||maxFrames>MAX_READ_FRAMES)
        throw outOfRange(`maxFrames must be an integer from 1 to ${MAX_READ_FRAMES}`);
      const channels=entry.format.channels;
      return call(()=>native.readInput(stream,maxFrames),payload=>{
        const chunk=toPcmChunk(payload);
        if(chunk.frames*channels*4!==chunk.samples.byteLength)throw bad("PCM chunk");
        return chunk;
      });
    },
    async closeInput(stream){forget(stream);try{await native.closeInput(stream);}catch(error){throw toAudioDeviceError(error);}},
    addListener(listener){
      if(!native.addListener)return noopSubscription;
      const sub=native.addListener("audio",payload=>{
        const event=toAudioDeviceEvent(payload);
        if(event){try{listener(event);}catch{/* advisory fan-out */}}
      });
      return{remove:()=>sub.remove()};
    },
  };
}
