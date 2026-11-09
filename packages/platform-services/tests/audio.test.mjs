import test from 'node:test';import assert from 'node:assert/strict';
import {createAudioDeviceProvider,AudioDeviceError,normalizeOpenOptions,normalizePcmChunk,normalizeFormat,
  toAudioDeviceProbe,toAudioStreamHandle,toAudioStreamStats,toPcmChunk,toAudioDeviceEvent,toAudioDeviceError,
  MAX_PCM_CHUNK_BYTES,MAX_READ_FRAMES,AUDIO_DEVICE_ERROR_CODES} from '../src/audio/device.ts';
import {AUDIO_DEVICE_MODULE_NAME} from '../src/module-names.ts';

const stereo={sampleRate:48000,channels:2,sampleFormat:'f32'};

test('open options are validated before any native call',()=>{
  assert.deepEqual(normalizeOpenOptions(),{deviceId:'',sampleRate:0,channels:0,sampleFormat:'',bufferMs:2000});
  assert.throws(()=>normalizeOpenOptions({sampleRate:7999}),{code:'out-of-range'});
  assert.throws(()=>normalizeOpenOptions({sampleRate:384001}),{code:'out-of-range'});
  assert.throws(()=>normalizeOpenOptions({channels:9}),{code:'out-of-range'});
  assert.throws(()=>normalizeOpenOptions({sampleFormat:'u8'}),{code:'out-of-range'});
  assert.throws(()=>normalizeOpenOptions({bufferMs:0}),{code:'out-of-range'});
  assert.throws(()=>normalizeOpenOptions({bufferMs:10001}),{code:'out-of-range'});
  assert.throws(()=>normalizeOpenOptions({deviceId:'x'.repeat(257)}),{code:'out-of-range'});
  assert.deepEqual(normalizeOpenOptions({sampleRate:44100,channels:2,sampleFormat:'s16',bufferMs:500,deviceId:'ad-3'}),
    {deviceId:'ad-3',sampleRate:44100,channels:2,sampleFormat:'s16',bufferMs:500});
});

test('pcm chunks must match their declared format byte for byte',()=>{
  const f32=new ArrayBuffer(4*2*10); // 10 stereo f32 frames
  const ok={samples:f32,frames:10,sampleFormat:'f32'};
  assert.equal(normalizePcmChunk(ok,2).frames,10);
  assert.throws(()=>normalizePcmChunk({...ok,frames:11},2),{code:'out-of-range'});
  assert.throws(()=>normalizePcmChunk({...ok,sampleFormat:'s16'},2),{code:'out-of-range'});
  assert.throws(()=>normalizePcmChunk({samples:new ArrayBuffer(4),frames:1,sampleFormat:'f32'},2),{code:'out-of-range'});
  assert.throws(()=>normalizePcmChunk({samples:new Uint8Array(64).buffer,frames:1,sampleFormat:'f32'},2),{code:'out-of-range'});
  assert.throws(()=>normalizePcmChunk({samples:new ArrayBuffer(MAX_PCM_CHUNK_BYTES+4),frames:1,sampleFormat:'f32'},2),{code:'out-of-range'});
  const s16=new ArrayBuffer(2*2*5);
  assert.equal(normalizePcmChunk({samples:s16,frames:5,sampleFormat:'s16'},2).frames,5);
});

test('format normalization enforces contract bounds',()=>{
  assert.deepEqual(normalizeFormat({sampleRate:48000,channels:2,sampleFormat:'s16'}),{sampleRate:48000,channels:2,sampleFormat:'s16'});
  assert.throws(()=>normalizeFormat({sampleRate:48000,channels:0,sampleFormat:'f32'}),{code:'out-of-range'});
  assert.throws(()=>normalizeFormat({sampleRate:48000,channels:2,sampleFormat:'i32'}),{code:'out-of-range'});
});

test('native records are validated into typed results',()=>{
  const probe=toAudioDeviceProbe({available:true,defaultSampleRate:48000,
    outputs:[{id:'ad-1',name:'Speakers',kind:'output'},{id:'x',name:'bad',kind:'nope'}],inputs:[]});
  assert.equal(probe.available,true);
  assert.equal(probe.outputs.length,1);
  assert.equal(probe.outputs[0].kind,'output');
  const handle=toAudioStreamHandle({stream:'s1',sampleRate:48000,channels:2,sampleFormat:'f32',latencyMs:10.5});
  assert.deepEqual(handle,{stream:'s1',format:stereo,latencyMs:10.5});
  assert.throws(()=>toAudioStreamHandle({stream:'',sampleRate:48000,channels:2,sampleFormat:'f32'}),{code:'device-error'});
  const stats=toAudioStreamStats({stream:'s1',sampleRate:48000,channels:2,sampleFormat:'s16',queuedFrames:3,capacityFrames:9,droppedFrames:1,underrunFrames:2});
  assert.equal(stats.underrunFrames,2);
  assert.equal(stats.format.sampleFormat,'s16');
  const chunk=toPcmChunk({stream:'s1',samples:new ArrayBuffer(16),frames:2,sampleRate:48000,channels:2,sampleFormat:'f32'});
  assert.equal(chunk.frames,2);
  assert.throws(()=>toPcmChunk({samples:new ArrayBuffer(8),frames:2,sampleRate:48000,channels:2,sampleFormat:'s16'}),{code:'device-error'});
  assert.deepEqual(toAudioDeviceEvent({stream:'s1',kind:'device-lost',message:'gone'}),{stream:'s1',kind:'device-lost',message:'gone'});
  assert.equal(toAudioDeviceEvent({stream:'s1',kind:'underrun'}),null);
  assert.equal(toAudioDeviceError(new Error('[permission] mic denied')).code,'permission');
  assert.equal(toAudioDeviceError({code:'busy',message:'x'}).code,'busy');
  assert.equal(AUDIO_DEVICE_ERROR_CODES.includes('device-lost'),true);
  assert.equal(AUDIO_DEVICE_MODULE_NAME,'NYCTronAudioDevice');
});

test('provider validates writes against the negotiated format',async()=>{
  const calls=[];
  const native={
    probe:async()=>({available:true,defaultSampleRate:48000,outputs:[],inputs:[]}),
    openOutput:async o=>{calls.push(['open',o]);return {stream:'out-1',sampleRate:o.sampleRate||48000,channels:o.channels||2,sampleFormat:'f32',latencyMs:5};},
    writeOutput:async(s,p)=>{calls.push(['write',s,p.frames,p.sampleFormat]);},
    stats:async s=>({stream:s,sampleRate:48000,channels:2,sampleFormat:'f32',queuedFrames:1,capacityFrames:10,droppedFrames:0,underrunFrames:0}),
    closeOutput:async s=>{calls.push(['close',s]);},
    openInput:async()=>({stream:'in-1',sampleRate:48000,channels:1,sampleFormat:'f32',latencyMs:0}),
    readInput:async()=>({stream:'in-1',samples:new ArrayBuffer(0),frames:0,sampleRate:48000,channels:1,sampleFormat:'f32'}),
    closeInput:async()=>{},
    addListener:(_e,fn)=>{globalThis.__audioListener=fn;return{remove(){}};},
  };
  const p=createAudioDeviceProvider(native);
  assert.equal(p.isAvailable,true);
  const handle=await p.openOutput({sampleRate:44100,channels:2});
  assert.equal(handle.stream,'out-1');
  const chunk={samples:new ArrayBuffer(4*2*100),frames:100,sampleFormat:'f32'};
  await p.writeOutput('out-1',chunk);
  assert.deepEqual(calls.at(-1),['write','out-1',100,'f32']);
  // wrong sampleFormat for the negotiated stream rejects before native
  await assert.rejects(p.writeOutput('out-1',{samples:new ArrayBuffer(2*2*10),frames:10,sampleFormat:'s16'}),{code:'out-of-range'});
  await assert.rejects(p.writeOutput('nope',chunk),{code:'device-not-found'});
  const stats=await p.stats('out-1');
  assert.equal(stats.capacityFrames,10);
  await p.closeOutput('out-1');
  await assert.rejects(p.writeOutput('out-1',chunk),{code:'device-not-found'});
  assert.deepEqual(calls.at(-1),['close','out-1']);
  // readInput bounds and direction checks
  await assert.rejects(p.readInput('out-1',10),{code:'device-not-found'});
  const input=await p.openInput();
  assert.equal(input.stream,'in-1');
  await assert.rejects(p.readInput('in-1',0),{code:'out-of-range'});
  await assert.rejects(p.readInput('in-1',MAX_READ_FRAMES+1),{code:'out-of-range'});
  const drained=await p.readInput('in-1',48000);
  assert.equal(drained.frames,0);
  await p.closeInput('in-1');
  await assert.rejects(p.readInput('in-1',10),{code:'device-not-found'});
});

test('pcm payloads cross the bridge as Uint8Array views (H1 contract)',async()=>{
  // Expo Modules delivers Data/ByteArray as Uint8Array, never ArrayBuffer:
  // writeOutput must hand native a Uint8Array, and readInput must accept one.
  let writeSamples=null;
  const native={
    probe:async()=>({available:true,defaultSampleRate:48000,outputs:[],inputs:[]}),
    openOutput:async()=>({stream:'out-1',sampleRate:48000,channels:2,sampleFormat:'f32',latencyMs:0}),
    writeOutput:async(s,p)=>{writeSamples=p.samples;},
    stats:async s=>({stream:s,sampleRate:48000,channels:2,sampleFormat:'f32',queuedFrames:0,capacityFrames:1,droppedFrames:0,underrunFrames:0}),
    closeOutput:async()=>{},
    openInput:async()=>({stream:'in-1',sampleRate:48000,channels:1,sampleFormat:'f32',latencyMs:0}),
    // Native returns a Uint8Array view, possibly offset into a larger buffer.
    readInput:async()=>{
      const backing=new Uint8Array(64);
      backing.set(new Uint8Array(8),24); // 2 frames x 1ch x f32 at byteOffset 24
      return {stream:'in-1',samples:backing.subarray(24,32),frames:2,sampleRate:48000,channels:1,sampleFormat:'f32'};
    },
    closeInput:async()=>{},
  };
  const p=createAudioDeviceProvider(native);
  await p.openOutput();
  // Caller may pass an ArrayBuffer …
  await p.writeOutput('out-1',{samples:new ArrayBuffer(4*2*10),frames:10,sampleFormat:'f32'});
  assert.ok(writeSamples instanceof Uint8Array,'native.writeOutput must receive a Uint8Array');
  assert.equal(writeSamples.byteLength,80);
  // … or a view with a nonzero byteOffset; only its window crosses the bridge.
  const wide=new Uint8Array(88);
  await p.writeOutput('out-1',{samples:wide.subarray(8,88),frames:10,sampleFormat:'f32'});
  assert.ok(writeSamples instanceof Uint8Array);
  assert.equal(writeSamples.byteLength,80);
  assert.equal(writeSamples.byteOffset,8,'the view offset must be preserved for native');
  // readInput accepts the bridged Uint8Array and returns a normalized view.
  await p.openInput();
  const chunk=await p.readInput('in-1',64);
  assert.equal(chunk.frames,2);
  assert.ok(chunk.samples instanceof Uint8Array||chunk.samples instanceof ArrayBuffer);
  assert.equal(chunk.samples.byteLength,8);
});

test('unavailable provider rejects honestly and never calls native',async()=>{
  const p=createAudioDeviceProvider(null);
  assert.equal(p.isAvailable,false);
  await assert.rejects(p.probe(),{code:'unsupported-format'});
  await assert.rejects(p.openOutput(),{code:'unsupported-format'});
  await assert.rejects(p.openInput(),{code:'unsupported-format'});
  await p.closeOutput('x');await p.closeInput('x'); // idempotent no-ops
});

test('native error codes survive the bridge prefix',async()=>{
  const native={
    probe:async()=>{throw new Error('[device-not-found] stream gone');},
    openOutput:async()=>{throw Object.assign(new Error('busy'),{code:'busy'});},
    writeOutput:async()=>{},stats:async()=>({}),closeOutput:async()=>{},
    openInput:async()=>({}),readInput:async()=>({}),closeInput:async()=>{},
  };
  const p=createAudioDeviceProvider(native);
  await assert.rejects(p.probe(),{code:'device-not-found'});
  await assert.rejects(p.openOutput(),{code:'busy'});
});
