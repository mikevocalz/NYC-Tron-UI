import {
  MediaEncodeError,normalizeAudioTrack,normalizeVideoTrack,toMediaEncodeError,
  AUDIO_SAMPLE_BYTES,VIDEO_BYTES_PER_PIXEL,
  type EncodeAudioNative,type EncodeAudioTrack,type EncodeRequest,type EncodeVideoNative,type EncodeVideoTrack,
  type EncodedMedia,
} from "./encoder.ts";
import { fetchEncodeBytes } from "./fetch-bytes.web.ts";
import type { AudioSample, AudioSampleSource, Output, VideoSample, VideoSampleSource } from "mediabunny";

/**
 * WebCodecs + Mediabunny encode: raw RGBA8 frames and interleaved PCM are
 * fetched whole (the same 64 MiB complete-file cap the decoder uses), fed
 * through VideoEncoder/AudioEncoder by Mediabunny's sample sources, and
 * muxed into a faststart MP4 in memory. The result returns as a `data:` URL.
 */

/** Chunk audio into samples of at most this many frames for AudioData. */
const AUDIO_CHUNK_FRAMES=8192;
/** Web encode deadline: the complete-file path is already size-bounded. */
const ENCODE_DEADLINE_MS=120_000;

async function loadVideo(uri:string,request:EncodeVideoNative,signal:AbortSignal):Promise<Uint8Array<ArrayBuffer>>{
  const bytes=await fetchEncodeBytes(uri,signal);
  const expected=request.frameCount*request.width*request.height*VIDEO_BYTES_PER_PIXEL;
  if(bytes.byteLength!==expected)throw new MediaEncodeError("encode-failed","The raw video file size does not match width, height and frameCount.");
  return bytes;
}

async function loadAudio(uri:string,request:EncodeAudioNative,signal:AbortSignal):Promise<Uint8Array<ArrayBuffer>>{
  const bytes=await fetchEncodeBytes(uri,signal);
  const expected=request.frames*request.channels*AUDIO_SAMPLE_BYTES[request.sampleFormat as keyof typeof AUDIO_SAMPLE_BYTES];
  if(bytes.byteLength!==expected)throw new MediaEncodeError("encode-failed","The raw audio file size does not match sampleRate layout, channels and frames.");
  return bytes;
}

export async function encodeWebCodecsMp4(request:EncodeRequest,signal:AbortSignal|undefined):Promise<EncodedMedia>{
  const video=request.video?normalizeVideoTrack(request.video):null;
  const audio=request.audio?normalizeAudioTrack(request.audio):null;
  if(!video&&!audio)throw new MediaEncodeError("out-of-range","encode requires a video or an audio track");
  if(typeof VideoEncoder==="undefined"&&video)throw new MediaEncodeError("unsupported-format","This browser has no VideoEncoder (WebCodecs).");
  if(typeof AudioEncoder==="undefined"&&audio)throw new MediaEncodeError("unsupported-format","This browser has no AudioEncoder (WebCodecs).");

  const cancellation=new AbortController();
  const abort=()=>cancellation.abort();
  if(signal?.aborted)cancellation.abort();
  signal?.addEventListener("abort",abort,{once:true});
  // The deadline must also bound awaits that never settle on their own:
  // Mediabunny's add()/start()/finalize() can stall inside a codec callback
  // that ignores the signal, so each one races the shared cancellation.
  let timedOut=false;
  const deadline=setTimeout(()=>{timedOut=true;cancellation.abort();},ENCODE_DEADLINE_MS);
  const deadlineError=()=>new MediaEncodeError(timedOut?"encode-failed":"cancelled",
    timedOut?"Media encoding exceeded its time budget.":"Media encoding was cancelled.");
  const withinDeadline=<T>(promise:Promise<T>):Promise<T>=>new Promise((resolve,reject)=>{
    if(cancellation.signal.aborted){reject(deadlineError());return;}
    const onAbort=()=>reject(deadlineError());
    cancellation.signal.addEventListener("abort",onAbort,{once:true});
    promise.then(
      value=>{cancellation.signal.removeEventListener("abort",onAbort);resolve(value);},
      error=>{cancellation.signal.removeEventListener("abort",onAbort);reject(error);});
  });
  try{
    const {Output,Mp4OutputFormat,BufferTarget,VideoSampleSource,AudioSampleSource,VideoSample,AudioSample,Quality}=await import("mediabunny");
    const target=new BufferTarget();
    const output:Output=new Output({format:new Mp4OutputFormat({fastStart:"in-memory"}),target});

    let videoSource:VideoSampleSource|null=null,audioSource:AudioSampleSource|null=null;
    let frameBytes:Uint8Array<ArrayBuffer>|null=null,audioBytes:Uint8Array<ArrayBuffer>|null=null;
    if(video){
      frameBytes=await loadVideo(video.uri,video,cancellation.signal);
      videoSource=new VideoSampleSource({codec:"avc",quality:new Quality("medium"),keyFrameInterval:2,latencyMode:"quality"});
      output.addVideoTrack(videoSource);
    }
    if(audio){
      audioBytes=await loadAudio(audio.uri,audio,cancellation.signal);
      audioSource=new AudioSampleSource({codec:"aac",quality:new Quality("medium")});
      output.addAudioTrack(audioSource);
    }
    await withinDeadline(output.start());

    if(video&&videoSource&&frameBytes){
      const frameSize=video.width*video.height*VIDEO_BYTES_PER_PIXEL;
      const frameSeconds=video.frameRateDen/video.frameRateNum;
      for(let i=0;i<video.frameCount;i++){
        if(cancellation.signal.aborted)throw new MediaEncodeError("cancelled","Media encoding was cancelled.");
        const data=frameBytes.subarray(i*frameSize,(i+1)*frameSize);
        const sample:VideoSample=new VideoSample(data,{format:"RGBA",codedWidth:video.width,codedHeight:video.height,timestamp:i*frameSeconds,duration:frameSeconds});
        try{await withinDeadline(videoSource.add(sample));}finally{sample.close();}
      }
    }

    if(audio&&audioSource&&audioBytes){
      const bytesPerFrame=audio.channels*AUDIO_SAMPLE_BYTES[audio.sampleFormat as keyof typeof AUDIO_SAMPLE_BYTES];
      let offset=0,framesWritten=0;
      const sampleRate=audio.sampleRate;
      while(offset<audioBytes.byteLength){
        if(cancellation.signal.aborted)throw new MediaEncodeError("cancelled","Media encoding was cancelled.");
        const frames=Math.min(AUDIO_CHUNK_FRAMES,Math.floor((audioBytes.byteLength-offset)/bytesPerFrame),audio.frames-framesWritten);
        if(frames<=0)break;
        const data=audioBytes.slice(offset,offset+frames*bytesPerFrame);
        const timestamp=framesWritten/sampleRate;
        offset+=frames*bytesPerFrame;framesWritten+=frames;
        const sample:AudioSample=new AudioSample({data,format:audio.sampleFormat as "f32"|"s16",numberOfChannels:audio.channels,sampleRate,timestamp});
        try{await withinDeadline(audioSource.add(sample));}finally{sample.close();}
      }
    }

    await withinDeadline(output.finalize());
    const buffer=target.buffer;
    if(!buffer||buffer.byteLength<1)throw new MediaEncodeError("encode-failed","The encoder produced an empty file.");
    // data: URL keeps the result self-contained like the decoder's frame URIs.
    let binary="";const chunk=0x8000;
    const view=new Uint8Array(buffer);
    for(let i=0;i<view.length;i+=chunk)binary+=String.fromCharCode(...view.subarray(i,i+chunk));
    const durationUs=video
      ? Math.max(video.frameCount*video.frameRateDen*1_000_000/video.frameRateNum,
          audio?audio.frames*1_000_000/audio.sampleRate:0)
      : audio!.frames*1_000_000/audio!.sampleRate;
    return {uri:`data:video/mp4;base64,${btoa(binary)}`,mimeType:"video/mp4",byteLength:buffer.byteLength,durationUs:Math.round(durationUs)};
  }catch(error){
    throw toMediaEncodeError(error);
  }finally{
    clearTimeout(deadline);
    signal?.removeEventListener("abort",abort);
    cancellation.abort();
  }
}
