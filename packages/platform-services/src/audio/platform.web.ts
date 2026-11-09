import {
  AudioDeviceError,MAX_AUDIO_CHANNELS,MAX_PCM_CHUNK_BYTES,
  type AudioDeviceNative,type AudioFormat,
} from "./device.ts";
import {AUDIO_WORKLET_SOURCE} from "./audio-worklet.web.ts";

export {AUDIO_DEVICE_MODULE_NAME} from "../module-names.ts";
export {createAudioDeviceProvider} from "./device.ts";
export type {AudioDeviceProvider} from "./device.ts";
import {createAudioDeviceProvider} from "./device.ts";
import type {AudioDeviceProvider} from "./device.ts";

/**
 * {@linkcode AudioDeviceProvider} on web: an `AudioContext` feeding an
 * AudioWorklet for playback and a `getUserMedia` capture node feeding a
 * second worklet for input. Requires `AudioContext`/`audioWorklet` and,
 * for input, `navigator.mediaDevices.getUserMedia`. Browsers without
 * them report unavailable.
 */
export function createPlatformAudioDevice():AudioDeviceProvider{
  return createAudioDeviceProvider(createWebAudioNative());
}

// ---- Web Audio backend (implements AudioDeviceNative in TypeScript) ----

interface AudioContextLike extends AudioContext {
  setSinkId?(sinkId:string):Promise<void>;
}

interface PlaybackEntry {
  readonly node:AudioWorkletNode;
  readonly format:AudioFormat;
  readonly capacityFrames:number;
}

interface CaptureEntry {
  readonly node:AudioWorkletNode;
  readonly gain:GainNode;
  readonly source:MediaStreamAudioSourceNode;
  readonly stream:MediaStream;
  readonly track:MediaStreamTrack;
  readonly format:AudioFormat;
  readonly capacityFrames:number;
  /** The track "ended" listener, kept so closeInput can detach it (M6). */
  onEnded:()=>void;
}

interface PendingRead {
  resolve:(payload:unknown)=>void;
  reject:(error:unknown)=>void;
  timer:ReturnType<typeof setTimeout>;
  /** Accumulates "input-part" messages until "input-end" (chunked capture reads). */
  parts?:{buffers:ArrayBuffer[];frames:number};
}

const READ_TIMEOUT_MS=2000;
const MIN_CAPACITY_FRAMES=4096;

function webError(code:"device-not-found"|"unsupported-format"|"permission"|"device-error",message:string):AudioDeviceError{
  return new AudioDeviceError(code,message);
}

/**
 * The browser backend. One lazily created AudioContext is shared by every
 * stream; it is closed once the last stream ends. The worklet module is
 * loaded once from a Blob URL. All realtime work happens inside the
 * worklets; this side only validates, converts s16→f32 and relays port
 * messages.
 */
function createWebAudioNative():AudioDeviceNative|null{
  if(typeof AudioContext==="undefined"||typeof AudioWorkletNode==="undefined")return null;

  let context:AudioContextLike|null=null;
  let moduleUrl:string|null=null;
  let modulePromise:Promise<void>|null=null;
  const outputs=new Map<string,PlaybackEntry>();
  const inputs=new Map<string,CaptureEntry>();
  const pending=new Map<number,PendingRead>();
  const listeners=new Set<(payload:unknown)=>void>();
  let nextId=0;
  let nextRequest=1;

  const emit=(payload:unknown)=>{for(const l of listeners){try{l(payload);}catch{/* advisory fan-out */}}};

  async function ensureContext():Promise<AudioContextLike>{
    if(!context)context=new AudioContext() as AudioContextLike;
    if(context.state==="suspended"){
      try{await context.resume();}catch{/* autoplay policy: report state honestly later */}
    }
    return context;
  }

  async function ensureModule(ctx:AudioContextLike):Promise<void>{
    if(!modulePromise){
      moduleUrl=URL.createObjectURL(new Blob([AUDIO_WORKLET_SOURCE],{type:"application/javascript"}));
      modulePromise=ctx.audioWorklet.addModule(moduleUrl).catch(error=>{
        modulePromise=null;
        throw webError("unsupported-format",`The AudioWorklet module failed to load: ${String(error)}`);
      });
    }
    await modulePromise;
  }

  function requestStats(port:MessagePort,extra:Record<string,unknown>={}):Promise<Record<string,unknown>>{
    const requestId=nextRequest++;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{pending.delete(requestId);reject(webError("device-error","The audio worklet did not answer a stats request."));},READ_TIMEOUT_MS);
      pending.set(requestId,{resolve:payload=>{clearTimeout(timer);pending.delete(requestId);resolve(payload as Record<string,unknown>);},reject:()=>{clearTimeout(timer);pending.delete(requestId);reject(webError("device-error","The audio worklet failed."));},timer});
      port.postMessage({type:"stats",requestId,...extra});
    });
  }

  function onPortMessage(entry:PlaybackEntry|CaptureEntry){
    entry.node.port.onmessage=(event:MessageEvent)=>{
      const m=event.data as {type?:string;requestId?:number;kind?:string;frames?:number;buffer?:ArrayBuffer}|undefined;
      if(!m||typeof m!=="object")return;
      if(m.type==="stats"&&typeof m.requestId==="number"){
        const waiter=pending.get(m.requestId);
        if(waiter){pending.delete(m.requestId);clearTimeout(waiter.timer);waiter.resolve(m as Record<string,unknown>);}
        return;
      }
      if(m.type==="input"&&typeof m.requestId==="number"){
        const waiter=pending.get(m.requestId);
        if(waiter){pending.delete(m.requestId);clearTimeout(waiter.timer);waiter.resolve(m as Record<string,unknown>);}
        return;
      }
      // Chunked capture reads: the worklet replies in bounded transferred
      // parts so it never allocates an unbounded buffer on the audio thread.
      if(m.type==="input-part"&&typeof m.requestId==="number"&&m.buffer instanceof ArrayBuffer){
        const waiter=pending.get(m.requestId);
        if(waiter?.parts){waiter.parts.buffers.push(m.buffer);waiter.parts.frames+=typeof m.frames==="number"?m.frames:0;}
        return;
      }
      if(m.type==="input-end"&&typeof m.requestId==="number"){
        const waiter=pending.get(m.requestId);
        if(waiter?.parts){
          pending.delete(m.requestId);clearTimeout(waiter.timer);
          const parts=waiter.parts;waiter.parts=undefined;
          let floats=0;
          for(const b of parts.buffers)floats+=b.byteLength/4;
          const merged=new Float32Array(floats);
          let offset=0;
          for(const b of parts.buffers){const view=new Float32Array(b);merged.set(view,offset);offset+=view.length;}
          waiter.resolve({type:"input",requestId:m.requestId,buffer:merged.buffer,frames:parts.frames});
        }
        return;
      }
      if(m.type==="event"&&m.kind==="underrun"){
        // Underrun detail is pollable through stats(); the event bus carries
        // lifecycle only, matching the native contract.
        return;
      }
    };
  }

  /** Detaches the ended listener, closes the worklet port and stops the graph. */
  function teardownCapture(entry:CaptureEntry){
    entry.track.removeEventListener("ended",entry.onEnded);
    try{entry.node.port.onmessage=null;entry.node.port.close();}catch{/* already closed */}
    try{entry.node.disconnect();entry.gain.disconnect();entry.source.disconnect();}catch{/* already gone */}
    entry.stream.getTracks().forEach(t=>t.stop());
  }

  async function maybeCloseContext(){
    if(outputs.size===0&&inputs.size===0&&context&&context.state!=="closed"){
      try{await context.close();}catch{/* already closed */}
      context=null;
    }
  }

  function capacityFramesFor(format:{sampleRate:number},bufferMs:number):number{
    const frames=Math.round(format.sampleRate*bufferMs/1000);
    return Math.max(MIN_CAPACITY_FRAMES,Math.min(1<<22,frames));
  }

  async function openOutput(options:{deviceId:string;sampleRate:number;channels:number;sampleFormat:string;bufferMs:number}){
    const ctx=await ensureContext();
    await ensureModule(ctx);
    if(options.deviceId&&typeof ctx.setSinkId!=="function")
      throw webError("unsupported-format","This browser cannot select an output device.");
    if(options.deviceId&&ctx.setSinkId)await ctx.setSinkId(options.deviceId);
    const sampleRate=ctx.sampleRate;
    if(options.sampleRate&&options.sampleRate!==sampleRate)
      throw webError("unsupported-format",`Web Audio runs at the context rate ${sampleRate} Hz; requested ${options.sampleRate} Hz.`);
    const requestedChannels=options.channels||2;
    const channels=Math.max(1,Math.min(MAX_AUDIO_CHANNELS,requestedChannels|0));
    const capacityFrames=capacityFramesFor({sampleRate},options.bufferMs||2000);
    const node=new AudioWorkletNode(ctx,"nyc-tron-playback",{
      numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[channels],
      processorOptions:{channels,capacityFrames},
    });
    node.channelCount=channels;
    node.channelCountMode="explicit";
    node.connect(ctx.destination);
    const id=`web-out-${++nextId}`;
    const entry:PlaybackEntry={node,format:{sampleRate,channels,sampleFormat:"f32"},capacityFrames};
    outputs.set(id,entry);
    onPortMessage(entry);
    return {stream:id,format:entry.format,latencyMs:(ctx.outputLatency||0)+(ctx.baseLatency||0)};
  }

  async function openInput(options:{deviceId:string;sampleRate:number;channels:number;sampleFormat:string;bufferMs:number}){
    if(typeof navigator==="undefined"||!navigator.mediaDevices?.getUserMedia)
      throw webError("unsupported-format","This browser has no microphone capture (getUserMedia).");
    const ctx=await ensureContext();
    await ensureModule(ctx);
    let stream:MediaStream;
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:{
        ...(options.deviceId?{deviceId:{exact:options.deviceId}}:{}),
        ...(options.sampleRate?{sampleRate:options.sampleRate}:{}),
      }});
    }catch(error){
      const name=(error as {name?:string})?.name??"";
      if(name==="NotAllowedError"||name==="SecurityError")
        throw webError("permission","Microphone permission was denied.");
      if(name==="NotFoundError"||name==="OverconstrainedError")
        throw webError("device-not-found","No matching audio input device.");
      throw webError("device-error",`getUserMedia failed: ${String(error)}`);
    }
    const track=stream.getAudioTracks()[0];
    if(!track)throw webError("device-not-found","The granted stream has no audio track.");
    const settings=track.getSettings();
    const sampleRate=settings.sampleRate||ctx.sampleRate;
    if(options.sampleRate&&options.sampleRate!==sampleRate)
      throw webError("unsupported-format",`The input runs at ${sampleRate} Hz; requested ${options.sampleRate} Hz.`);
    const deviceChannels=settings.channelCount||options.channels||1;
    const channels=Math.max(1,Math.min(MAX_AUDIO_CHANNELS,deviceChannels|0||1));
    const capacityFrames=capacityFramesFor({sampleRate},options.bufferMs||2000);
    const source=ctx.createMediaStreamSource(stream);
    const node=new AudioWorkletNode(ctx,"nyc-tron-capture",{
      numberOfInputs:1,numberOfOutputs:1,
      processorOptions:{channels,capacityFrames},
    });
    // Capture nodes must sit in the rendered graph for process() to run;
    // a zero-gain tap to the destination keeps it silent.
    const gain=ctx.createGain();
    gain.gain.value=0;
    source.connect(node);
    node.connect(gain);
    gain.connect(ctx.destination);
    const id=`web-in-${++nextId}`;
    const entry:CaptureEntry={node,gain,source,stream,track,format:{sampleRate,channels,sampleFormat:"f32"},capacityFrames,onEnded:()=>{}};
    inputs.set(id,entry);
    onPortMessage(entry);
    entry.onEnded=()=>{
      inputs.delete(id);
      teardownCapture(entry);
      emit({stream:id,kind:"device-lost",message:"The capture device went away."});
      void maybeCloseContext();
    };
    track.addEventListener("ended",entry.onEnded);
    return {stream:id,format:entry.format,latencyMs:0};
  }

  function toFloat(samples:ArrayBuffer|ArrayBufferView,sampleFormat:string):ArrayBuffer{
    // Accept the normalized Uint8Array view the provider hands over (and any
    // other view) without leaking bytes outside its byteOffset/byteLength.
    const u8=samples instanceof ArrayBuffer?new Uint8Array(samples)
      :new Uint8Array(samples.buffer,samples.byteOffset,samples.byteLength);
    if(sampleFormat==="f32"){
      // Copy before transfer: postMessage's transfer list would neuter the
      // caller's ArrayBuffer (the view shares it), which the contract forbids.
      const copy=new Uint8Array(u8.byteLength);
      copy.set(u8);
      return copy.buffer;
    }
    const src=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);
    const frames=u8.byteLength/2;
    const out=new Float32Array(frames);
    for(let i=0;i<frames;i++)out[i]=src.getInt16(i*2,true)/32768;
    return out.buffer;
  }

  return {
    probe:async()=>{
      // Lazy: probing must not spin up an AudioContext (autoplay policies and
      // audio hardware stay untouched until the first stream opens). The rate
      // is reported once a context exists; 0 means "not yet known".
      const devices=typeof navigator!=="undefined"&&navigator.mediaDevices?.enumerateDevices
        ?await navigator.mediaDevices.enumerateDevices().catch(()=>[]):[];
      const outputs:unknown[]=[],inputs:unknown[]=[];
      for(const d of devices as MediaDeviceInfo[]){
        if(d.kind==="audiooutput")outputs.push({id:d.deviceId,name:d.label||"audio output",kind:"output"});
        if(d.kind==="audioinput")inputs.push({id:d.deviceId,name:d.label||"audio input",kind:"input"});
      }
      return {available:true,defaultSampleRate:context?.sampleRate??0,outputs,inputs};
    },
    openOutput:(o)=>openOutput(o),
    writeOutput:async(stream,payload)=>{
      const entry=outputs.get(stream);
      if(!entry)throw webError("device-not-found",`Unknown output stream "${stream}".`);
      const channels=entry.format.channels;
      const expected=payload.frames*channels*(payload.sampleFormat==="f32"?4:2);
      if(payload.samples.byteLength!==expected)
        throw webError("device-error","PCM chunk size does not match its frame count.");
      if(payload.samples.byteLength>MAX_PCM_CHUNK_BYTES)
        throw webError("device-error","PCM chunk exceeds the per-call byte limit.");
      const buffer=toFloat(payload.samples,payload.sampleFormat);
      entry.node.port.postMessage({type:"write",buffer},[buffer]);
    },
    stats:async(stream)=>{
      const entry=outputs.get(stream)??inputs.get(stream);
      if(!entry)throw webError("device-not-found",`Unknown stream "${stream}".`);
      const reply=await requestStats(entry.node.port);
      const queued=typeof reply.queuedFrames==="number"?reply.queuedFrames:0;
      const capacity=typeof reply.capacityFrames==="number"?reply.capacityFrames:entry.capacityFrames;
      const dropped=typeof reply.droppedFrames==="number"?reply.droppedFrames:0;
      const underrun=typeof reply.underrunFrames==="number"?reply.underrunFrames:0;
      return {stream,format:entry.format,queuedFrames:queued,capacityFrames:capacity,droppedFrames:dropped,underrunFrames:underrun};
    },
    closeOutput:async(stream)=>{
      const entry=outputs.get(stream);
      if(!entry)return;
      outputs.delete(stream);
      entry.node.port.onmessage=null;
      entry.node.port.postMessage({type:"reset"});
      entry.node.port.close();
      entry.node.disconnect();
      await maybeCloseContext();
    },
    openInput:(o)=>openInput(o),
    readInput:async(stream,maxFrames)=>{
      const entry=inputs.get(stream);
      if(!entry)throw webError("device-not-found",`Unknown input stream "${stream}".`);
      const requestId=nextRequest++;
      const reply=await new Promise<Record<string,unknown>>((resolve,reject)=>{
        const timer=setTimeout(()=>{pending.delete(requestId);reject(webError("device-error","The capture worklet did not answer a read."));},READ_TIMEOUT_MS);
        pending.set(requestId,{resolve:p=>{clearTimeout(timer);pending.delete(requestId);resolve(p as Record<string,unknown>);},reject:()=>{clearTimeout(timer);pending.delete(requestId);reject(webError("device-error","The capture worklet failed."));},timer,parts:{buffers:[],frames:0}});
        entry.node.port.postMessage({type:"read",requestId,maxFrames});
      });
      const buffer=reply.buffer;
      const frames=typeof reply.frames==="number"?reply.frames:0;
      if(!(buffer instanceof ArrayBuffer))throw webError("device-error","The capture worklet returned no PCM.");
      return {samples:buffer,frames,sampleFormat:"f32"};
    },
    closeInput:async(stream)=>{
      const entry=inputs.get(stream);
      if(!entry)return;
      inputs.delete(stream);
      teardownCapture(entry);
      await maybeCloseContext();
    },
    addListener(_eventName:"audio",listener:(payload:unknown)=>void){
      listeners.add(listener);
      return{remove:()=>{listeners.delete(listener);}};
    },
  };
}
