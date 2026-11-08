import test from 'node:test';import assert from 'node:assert/strict';
import {createMediaEncoder,normalizeEncodeRequest,normalizeVideoTrack,normalizeAudioTrack,toMediaEncoderProbe,toEncodedMedia,toMediaEncodeError,
  MAX_ENCODE_EDGE,MAX_ENCODE_FRAMES,MAX_VIDEO_SOURCE_BYTES,MAX_AUDIO_SOURCE_BYTES} from '../src/encoder/encoder.ts';

const video=()=>({uri:'file:///frames.rgba',width:64,height:64,frameRateNum:30,frameRateDen:1,frameCount:90});
const audio=()=>({uri:'file:///pcm.f32',sampleRate:48000,channels:2,frames:48000});
const base=()=>({probe:async()=>({container:'mp4',video:true,audio:true}),encode:async()=>({uri:'file:///out.mp4',mimeType:'video/mp4',byteLength:1024,durationUs:3000000}),clearCache:async()=>{}});

test('encode request bounds reject before touching native resources',async()=>{
 let calls=0;const encoder=createMediaEncoder({...base(),encode:async()=>{calls++;throw Error('must not run');}});
 await assert.rejects(encoder.encode({}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),width:0}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),width:MAX_ENCODE_EDGE+1}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),width:5000,height:5000}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),pixelFormat:'bgra8'}}),{code:'unsupported-format'});
 await assert.rejects(encoder.encode({video:{...video(),frameCount:0}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),frameCount:MAX_ENCODE_FRAMES+1}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),frameRateNum:0}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{...video(),frameRateNum:300,frameRateDen:1}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({audio:{...audio(),sampleRate:7999}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({audio:{...audio(),channels:3}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({audio:{...audio(),sampleFormat:'u8'}}),{code:'unsupported-format'});
 await assert.rejects(encoder.encode({audio:{...audio(),frames:0}}),{code:'out-of-range'});
 await assert.rejects(encoder.encode({video:{uri:'',width:64,height:64,frameRateNum:30,frameRateDen:1,frameCount:1}}),{code:'out-of-range'});
 assert.equal(calls,0);
});

test('source byte budgets reject oversized raw files',()=>{
 assert.throws(()=>normalizeVideoTrack({...video(),width:4096,height:2160,frameCount:100000}),{code:'out-of-range'});
 assert.throws(()=>normalizeAudioTrack({...audio(),sampleRate:192000,channels:2,frames:1_000_000_000}),{code:'out-of-range'});
 const ok=normalizeVideoTrack(video());
 assert.equal(ok.pixelFormat,'rgba8');assert.equal(ok.frameCount,90);
 const aok=normalizeAudioTrack(audio());
 assert.equal(aok.sampleFormat,'f32');assert.equal(aok.channels,2);
});

test('unavailable encoder reports a real unsupported error and malformed native records reject',async()=>{
 await assert.rejects(createMediaEncoder(null).probe('x'),{code:'unsupported-format'});
 await assert.rejects(createMediaEncoder(null).encode({video:video()}),{code:'unsupported-format'});
 assert.throws(()=>toMediaEncoderProbe({container:'mp4',video:'yes',audio:true}),{code:'encode-failed'});
 assert.throws(()=>toMediaEncoderProbe({container:'webm',video:true,audio:true}),{code:'encode-failed'});
 assert.throws(()=>toEncodedMedia({uri:'file:///x',mimeType:'video/mp4',byteLength:0,durationUs:1}),{code:'encode-failed'});
 assert.throws(()=>toEncodedMedia({uri:'file:///x',mimeType:'video/webm',byteLength:10,durationUs:1}),{code:'encode-failed'});
 assert.equal(toMediaEncoderProbe({container:'mp4',video:true,audio:false}).audio,false);
 assert.deepEqual(toEncodedMedia({uri:'file:///x',mimeType:'video/mp4',byteLength:10,durationUs:1500.4}),
   {uri:'file:///x',mimeType:'video/mp4',byteLength:10,durationUs:1500});
 assert.equal(toMediaEncodeError(Error('[permission] Denied')).code,'permission');
});

test('the native call receives only normalized flat records, never a signal',async()=>{
 const calls=[];
 const encoder=createMediaEncoder({...base(),encode:async(...args)=>{calls.push(args);return {uri:'file:///o.mp4',mimeType:'video/mp4',byteLength:5,durationUs:1};}});
 const result=await encoder.encode({video:video(),audio:audio()});
 assert.equal(result.byteLength,5);
 assert.deepEqual(calls,[[
   {uri:'file:///frames.rgba',width:64,height:64,pixelFormat:'rgba8',frameRateNum:30,frameRateDen:1,frameCount:90},
   {uri:'file:///pcm.f32',sampleRate:48000,channels:2,sampleFormat:'f32',frames:48000},
 ]]);
 const audioOnly=await encoder.encode({audio:audio()});
 assert.equal(audioOnly.uri,'file:///o.mp4');
 assert.equal(calls[1][0],null,'video slot is null for an audio-only encode');
});

test('an already-aborted encode never enters native code',async()=>{
 const cancellation=new AbortController();cancellation.abort();let calls=0;
 const encoder=createMediaEncoder({...base(),encode:async()=>{calls++;}});
 await assert.rejects(encoder.encode({video:video()},{signal:cancellation.signal}),{code:'cancelled'});
 assert.equal(calls,0);
});

test('abort settles the consumer and drains a late native completion without serializing its signal',async()=>{
 let finish;
 const native=new Promise(resolve=>{finish=resolve;});
 const encoder=createMediaEncoder({...base(),encode:()=>native});
 const cancellation=new AbortController();
 const result=encoder.encode({video:video()},{signal:cancellation.signal});
 await new Promise(resolve=>setImmediate(resolve));
 cancellation.abort();
 await assert.rejects(result,{code:'cancelled'});
 finish({uri:'file:///late.mp4',mimeType:'video/mp4',byteLength:9,durationUs:1});
 await new Promise(resolve=>setImmediate(resolve));
});

test('native failures retain their stable code',async()=>{
 const encoder=createMediaEncoder({...base(),encode:async()=>{throw Error('[out-of-range] Frame count exceeds the budget');}});
 await assert.rejects(encoder.encode({video:video()}),error=>error.code==='out-of-range');
 const denied=createMediaEncoder({...base(),encode:async()=>{throw {code:'permission',message:'Access expired'};}});
 await assert.rejects(denied.encode({video:video()}),error=>error.code==='permission');
});
