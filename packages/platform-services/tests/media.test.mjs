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
