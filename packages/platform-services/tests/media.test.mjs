import test from 'node:test';import assert from 'node:assert/strict';
import {createMediaDecoder,normalizeAudioOptions,normalizeFrameOptions,toDecodedAudio,toDecodedFrame,frameSpan,interleave,toMediaDecodeError} from '../src/media/decoder.ts';
test('decode request bounds reject before touching native resources',async()=>{
 let calls=0;const decoder=createMediaDecoder({decodeFrame:async()=>{calls++;},decodeAudio:async()=>{calls++;},probe:async()=>({}),clearCache:async()=>{}});
 await assert.rejects(decoder.decodeFrame('x',{timeUs:-1}),{code:'out-of-range'});await assert.rejects(decoder.decodeAudio('x',{startUs:0,durationUs:60000001}),{code:'out-of-range'});assert.equal(calls,0);assert.equal(normalizeFrameOptions({timeUs:0}).maxWidth,1920);assert.equal(normalizeAudioOptions({startUs:0,durationUs:1000}).sampleRate,0);
});
test('unavailable decoder reports a real unsupported error and malformed native records reject',async()=>{
 await assert.rejects(createMediaDecoder(null).probe('x'),{code:'unsupported-format'});assert.throws(()=>toDecodedFrame({uri:'file://x',actualTimeUs:0,width:-1,height:4}));assert.throws(()=>toDecodedAudio({uri:'file://x',sampleRate:48000,channels:1.5,frames:4}));assert.equal(toDecodedFrame({uri:'file://x',actualTimeUs:0,width:4,height:4}).timing,'presentation');assert.equal(toMediaDecodeError(Error('[permission] Denied')).code,'permission');
});
test('PCM selection remains frame-aligned and interleaved',()=>{
 assert.deepEqual(frameSpan(250000,500000,4,4),{start:1,end:3});assert.deepEqual(Array.from(interleave([new Float32Array([1,2,3]),new Float32Array([4,5,6])],1,3)),[2,5,3,6]);
});

test('an already-aborted frame request never enters native code',async()=>{
 const cancellation=new AbortController();cancellation.abort();let calls=0;
 const decoder=createMediaDecoder({decodeFrame:async()=>{calls++;},decodeAudio:async()=>{},probe:async()=>({}),clearCache:async()=>{}});
 await assert.rejects(decoder.decodeFrame('file:///x',{timeUs:0,signal:cancellation.signal}),{code:'cancelled'});
 assert.equal(calls,0);
});
test('abort settles the consumer and drains a late native completion without serializing its signal',async()=>{
 let finish;let request;
 const native=new Promise(resolve=>{finish=resolve;});
 const decoder=createMediaDecoder({decodeFrame:async(_uri,options)=>{request=options;return native;},decodeAudio:async()=>{},probe:async()=>({}),clearCache:async()=>{}});
 const cancellation=new AbortController();const result=decoder.decodeFrame('file:///x',{timeUs:1000,signal:cancellation.signal});
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(Object.keys(request).sort(),['maxHeight','maxWidth','timeUs']);
 cancellation.abort();await assert.rejects(result,{code:'cancelled'});
 finish({uri:'file:///frame.jpg',actualTimeUs:1000,width:10,height:10});
 await new Promise(resolve=>setImmediate(resolve));
});
