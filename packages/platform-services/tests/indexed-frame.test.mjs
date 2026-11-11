import test from 'node:test';
import assert from 'node:assert/strict';
import {createMediaDecoder} from '../src/media/decoder.ts';

const base = () => ({probe:async()=>({}),decodeFrame:async()=>{throw Error('ordinary decoder must not be called');},decodeAudio:async()=>({}),clearCache:async()=>{}});
const frame = actualTimeUs => ({uri:'file:///fixture.jpg',actualTimeUs,width:64,height:64});

test('strict frame capability is absent with old, missing, or noncallable bridge', () => {
  for(const native of [null,base(),{...base(),decodeIndexedFrameV1:true}]){
    const decoder=createMediaDecoder(native);
    assert.equal(decoder.indexedFrameVersion,undefined);
    assert.equal(decoder.decodeIndexedFrame,undefined);
  }
});

test('strict frame capability sends normalized data and preserves native presentation time', async () => {
  const calls=[];
  const decoder=createMediaDecoder({...base(),decodeIndexedFrameV1:async(...args)=>{calls.push(args);return frame(33333);}});
  assert.equal(decoder.indexedFrameVersion,1);
  assert.deepEqual(await decoder.decodeIndexedFrame('file:///video.mp4',{timeUs:33333,maxWidth:64}),{uri:'file:///fixture.jpg',actualTimeUs:33333,timing:'presentation',width:64,height:64});
  assert.deepEqual(calls,[['file:///video.mp4',{timeUs:33333,maxWidth:64,maxHeight:1920}]]);
});

test('strict frame rejects a neighbor, invalid timestamp, or fractional timestamp instead of rounding it into success', async () => {
  for(const time of [0,33334,33333.1,-1,NaN,Infinity]){
    const decoder=createMediaDecoder({...base(),decodeIndexedFrameV1:async()=>frame(time)});
    await assert.rejects(decoder.decodeIndexedFrame('file:///video.mp4',{timeUs:33333}),error=>error.code==='decode-failed');
  }
});

test('invalid request and pre-abort never enter native strict decode', async () => {
  let calls=0;
  const decoder=createMediaDecoder({...base(),decodeIndexedFrameV1:async()=>{calls++;return frame(0);}});
  await assert.rejects(decoder.decodeIndexedFrame('file:///video.mp4',{timeUs:-1}),error=>error.code==='out-of-range');
  const controller=new AbortController();controller.abort();
  await assert.rejects(decoder.decodeIndexedFrame('file:///video.mp4',{timeUs:0,signal:controller.signal}),error=>error.code==='cancelled');
  assert.equal(calls,0);
});

test('abort detaches strict native work and drops late completion', async () => {
  let finish;
  const decoder=createMediaDecoder({...base(),decodeIndexedFrameV1:()=>new Promise(resolve=>{finish=resolve;})});
  const controller=new AbortController();
  const result=decoder.decodeIndexedFrame('file:///video.mp4',{timeUs:33333,signal:controller.signal});
  await Promise.resolve();
  controller.abort();
  await assert.rejects(result,error=>error.code==='cancelled');
  finish(frame(33333));
  await Promise.resolve();
});

test('native failure retains its stable code and never falls back to ordinary decode', async () => {
  const decoder=createMediaDecoder({...base(),decodeIndexedFrameV1:async()=>{throw {message:'[out-of-range] No exact indexed timestamp'};}});
  await assert.rejects(decoder.decodeIndexedFrame('file:///video.mp4',{timeUs:1}),error=>error.code==='out-of-range');
});
