import {
  MediaDecodeError,fitWithin,frameSpan,interleave,normalizeAudioOptions,normalizeFrameOptions,toMediaDecodeError,
  type DecodedAudio,type DecodedFrame,type MediaDecodeErrorCode,type MediaDecoder,type MediaProbe,
} from "./decoder.ts";

export {MEDIA_DECODER_MODULE_NAME} from "../module-names.ts";

/** Rate web resamples to when the request names none (decodeAudioData always resamples to its context's rate). */
export const WEB_DEFAULT_SAMPLE_RATE=48_000;

// HTMLMediaElement.error codes: 2 network, 3 decode, 4 source not supported.
const MEDIA_ERROR_CODES:Record<number,MediaDecodeErrorCode>={1:"decode-failed",2:"not-found",3:"decode-failed",4:"unsupported-format"};

function mediaError(video:HTMLVideoElement):MediaDecodeError{
  const code=MEDIA_ERROR_CODES[video.error?.code??3]??"decode-failed";
  return new MediaDecodeError(code,video.error?.message||"The browser could not open this media.");
}

/** Resolves on `ok`, rejects on the element's `error`. */
function waitFor(video:HTMLVideoElement,ok:"loadedmetadata"|"loadeddata"|"seeked"):Promise<void>{
  return new Promise((resolve,reject)=>{
    const cleanup=()=>{clearTimeout(timer);video.removeEventListener(ok,done);video.removeEventListener("error",fail);};
    const done=()=>{cleanup();resolve();};
    const fail=()=>{cleanup();reject(mediaError(video));};
    const timer=setTimeout(()=>{cleanup();reject(new MediaDecodeError("decode-failed","The media did not become ready within 15 seconds."));},15000);
    video.addEventListener(ok,done);video.addEventListener("error",fail);
  });
}

async function openVideo(uri:string):Promise<HTMLVideoElement>{
  const video=document.createElement("video");
  video.crossOrigin="anonymous";
  video.muted=true;
  video.preload="auto";
  const loaded=waitFor(video,"loadedmetadata");
  video.src=uri;
  try{await loaded;return video;}catch(error){close(video);throw error;}
}

const close=(video:HTMLVideoElement)=>{video.removeAttribute("src");video.load();};
const micros=(seconds:number)=>Math.round(seconds*1e6);

async function probe(uri:string):Promise<MediaProbe>{
  const video=await openVideo(uri);
  try{
    if(!Number.isFinite(video.duration))throw new MediaDecodeError("unsupported-format","The browser reports no finite duration for this media.");
    const {videoWidth:width,videoHeight:height}=video;
    return {durationUs:micros(video.duration),...(width&&height?{video:{width,height}}:{})};
  }finally{close(video);}
}

/**
 * Seeks a muted video element and draws the frame on a canvas. The reported
 * time is the element's settled currentTime; browsers do not expose a
 * frame-exact timestamp on this fallback path.
 */
async function decodeFrame(uri:string,options:Parameters<MediaDecoder["decodeFrame"]>[1]):Promise<DecodedFrame>{
  const request=normalizeFrameOptions(options);
  const video=await openVideo(uri);
  try{
    const durationUs=micros(video.duration);
    if(request.timeUs>=durationUs)throw new MediaDecodeError("out-of-range",`timeUs ${request.timeUs} is at or past the end (${durationUs})`);
    if(!video.videoWidth||!video.videoHeight)throw new MediaDecodeError("unsupported-format","This media has no video track.");
    // Setting currentTime to its current value need not emit seeked.
    const target=request.timeUs/1e6;
    if(Math.abs(video.currentTime-target)>0.000001){const seeked=waitFor(video,"seeked");video.currentTime=target;await seeked;}
    if(video.readyState<2)await waitFor(video,"loadeddata");
    const size=fitWithin(video.videoWidth,video.videoHeight,request.maxWidth,request.maxHeight);
    const canvas=document.createElement("canvas");
    canvas.width=size.width;
    canvas.height=size.height;
    const context=canvas.getContext("2d");
    if(!context)throw new MediaDecodeError("decode-failed","No 2D canvas is available.");
    context.drawImage(video,0,0,size.width,size.height);
    let dataUrl:string;
    try{dataUrl=canvas.toDataURL("image/jpeg",0.9);}
    catch{throw new MediaDecodeError("permission","The media comes from another origin without CORS, so its pixels cannot be read.");}
    return {uri:dataUrl,actualTimeUs:micros(video.currentTime),timing:"seek-target",...size};
  }finally{close(video);}
}

/** Fetches the file and decodes it with WebAudio, resampled to the requested rate. */
async function decodeAudio(uri:string,options:Parameters<MediaDecoder["decodeAudio"]>[1]):Promise<DecodedAudio>{
  const request=normalizeAudioOptions(options);
  const sampleRate=request.sampleRate||WEB_DEFAULT_SAMPLE_RATE;
  let bytes:ArrayBuffer;
  try{
    const response=await fetch(uri);
    if(response.status===401||response.status===403)throw new MediaDecodeError("permission",`The server refused access (${response.status}).`);
    if(!response.ok)throw new MediaDecodeError("not-found",`The media could not be loaded (${response.status}).`);
    const length=Number(response.headers.get("content-length"));
    if(length>64*1024*1024)throw new MediaDecodeError("out-of-range","The web source exceeds 64 MiB.");
    if(!response.body)throw new MediaDecodeError("decode-failed","The source body is unavailable.");
    const reader=response.body.getReader(),parts:Uint8Array[]=[];let total=0;
    try{for(;;){const part=await reader.read();if(part.done)break;total+=part.value.byteLength;if(total>64*1024*1024)throw new MediaDecodeError("out-of-range","The web source exceeds 64 MiB.");parts.push(part.value);}}finally{await reader.cancel();reader.releaseLock();}
    const owned=new Uint8Array(total);let offset=0;for(const part of parts){owned.set(part,offset);offset+=part.length;}bytes=owned.buffer;
  }catch(error){
    throw error instanceof MediaDecodeError?error:new MediaDecodeError("not-found","The media could not be loaded.");
  }
  // WebAudio decodes the complete source. Bound source duration before decoding;
  // arbitrary spans of long assets need a streaming decoder backend.
  const info=await probe(uri);
  if(info.durationUs>60_000_000)throw new MediaDecodeError("unsupported-format","WebAudio decoding is limited to sources up to 60 seconds; use a streaming/native decoder for longer media.");
  const context=new OfflineAudioContext(1,1,sampleRate);
  let buffer:AudioBuffer;
  try{buffer=await context.decodeAudioData(bytes);}
  catch{throw new MediaDecodeError("unsupported-format","The browser cannot decode this audio.");}
  const span=frameSpan(request.startUs,request.durationUs,buffer.sampleRate,buffer.length);
  if(span.start>=buffer.length&&buffer.length>0)throw new MediaDecodeError("out-of-range","startUs is past the end of the audio.");
  const planes=Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c));
  const samples=interleave(planes,span.start,span.end);
  return {sampleRate:buffer.sampleRate,channels:buffer.numberOfChannels,frames:span.end-span.start,pcm:{kind:"samples",samples}};
}

const guarded=<A extends unknown[],T>(run:(...args:A)=>Promise<T>)=>async(...args:A):Promise<T>=>{
  try{return await run(...args);}catch(error){throw toMediaDecodeError(error);}
};

/**
 * {@linkcode MediaDecoder} on web: a muted `<video>` seek plus a canvas for
 * frames, `decodeAudioData` for PCM. Cross-origin media needs CORS for
 * frames. Each call opens the media afresh; nothing is cached.
 */
export function createPlatformMediaDecoder():MediaDecoder{
  return {
    isAvailable:typeof document!=="undefined",
    probe:guarded(probe),
    decodeFrame:guarded(decodeFrame),
    decodeAudio:guarded(decodeAudio),
    clearCache:async()=>{},
  };
}
