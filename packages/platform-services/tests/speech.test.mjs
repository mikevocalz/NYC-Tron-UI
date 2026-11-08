import test from 'node:test';import assert from 'node:assert/strict';
import {createSpeechRecognizer,createSpeechConsent,normalizeSpeechStart,toSpeechRecognizerProbe,toSpeechSessionStart,toSpeechSessionEvent,toSpeechError,
  MAX_SPEECH_HINTS,MAX_SPEECH_SESSIONS} from '../src/speech/recognizer.ts';

let listener,sessionCounter=0;
const base=()=>({
  probe:async()=>({available:true,onDevice:true,networkPossible:true}),
  start:async()=>({session:`s${++sessionCounter}`}),
  stop:async()=>{},abort:async()=>{},
  addListener:(_e,fn)=>{listener=fn;return{remove(){}};},
});
const emit=(payload)=>listener(payload);
const granted=()=>({networkRecognition:true});

test('start options are validated before any native call',async()=>{
  let calls=0;
  const r=createSpeechRecognizer({...base(),start:async()=>{calls++;return {session:`s${++sessionCounter}`};}});
  await assert.rejects(r.start({locale:'not a locale!'}),{code:'out-of-range'});
  await assert.rejects(r.start({locale:'x'.repeat(36)}),{code:'out-of-range'});
  await assert.rejects(r.start({hints:Array.from({length:MAX_SPEECH_HINTS+1},()=> 'h')}),{code:'out-of-range'});
  await assert.rejects(r.start({hints:['']}),{code:'out-of-range'});
  await assert.rejects(r.start({maxSessionMs:10}),{code:'out-of-range'});
  await assert.rejects(r.start({onDeviceOnly:false}),{code:'consent-required'});
  assert.equal(calls,0,'nothing reaches native on a rejected start');
});

test('on-device is the default and needs no consent; network paths require it',async()=>{
  const calls=[];
  const r=createSpeechRecognizer({...base(),start:async req=>{calls.push(req);return {session:`s${++sessionCounter}`};}});
  const s=await r.start({locale:'en-US',hints:['NYC-Tron']});
  assert.deepEqual(calls,[{locale:'en-US',onDeviceOnly:true,hints:['NYC-Tron']}]);
  const a1=s.abort();emit({session:s.id,kind:'end',reason:'aborted'});await a1;
  await assert.rejects(r.start({onDeviceOnly:false}),{code:'consent-required'});
  const grantedR=createSpeechRecognizer({...base(),start:async req=>{calls.push(req);return {session:'s2'};}},{consent:granted()});
  const s2=await grantedR.start({onDeviceOnly:false});
  assert.equal(calls.at(-1).onDeviceOnly,false);
  const a2=s2.abort();emit({session:s2.id,kind:'end',reason:'aborted'});await a2;
});

test('consent defaults to deny and persists through storage',()=>{
  const mem=new Map();
  const storage={getString:k=>mem.get(k),set:(k,v)=>mem.set(k,v)};
  const c=createSpeechConsent({storage});
  assert.equal(c.networkRecognition,false);
  c.grantNetworkRecognition();
  assert.equal(c.networkRecognition,true);
  assert.equal(mem.get('nyc-tron.speech.network-recognition'),'granted');
  const c2=createSpeechConsent({storage});
  assert.equal(c2.networkRecognition,true,'grant survives a new controller');
  c2.revokeNetworkRecognition();
  assert.equal(createSpeechConsent({storage}).networkRecognition,false);
});

test('unavailable recognizer rejects honestly and malformed records throw',async()=>{
  const r=createSpeechRecognizer(null);
  assert.equal(r.isAvailable,false);
  await assert.rejects(r.probe(),{code:'unsupported-format'});
  await assert.rejects(r.start(),{code:'unsupported-format'});
  assert.throws(()=>toSpeechRecognizerProbe({available:true,onDevice:true}),{code:'recognition-failed'});
  assert.throws(()=>toSpeechSessionStart({session:''}),{code:'recognition-failed'});
  assert.equal(toSpeechError(Error('[permission] Denied')).code,'permission');
});

test('events route by session: partial, final with words, then one terminal',async()=>{
  const sessions=[];
  const r=createSpeechRecognizer({...base(),
    start:async()=>({session:`s${sessions.push(1)}`}),
    addListener:(_e,fn)=>{listener=fn;return{remove(){}};},
  });
  const seen=[];
  const s=await r.start();
  s.addListener(e=>seen.push(e));
  emit({session:s.id,kind:'partial',text:'hel'});
  emit({session:s.id,kind:'final',text:'hello',wordsJson:JSON.stringify([{text:'hello',startS:0,endS:0.4}])});
  emit({session:s.id,kind:'end',reason:'finished'});
  emit({session:s.id,kind:'partial',text:'late'}); // after terminal: dropped
  assert.deepEqual(seen.map(e=>e.type),['partial','final','end']);
  assert.equal(seen[1].words[0].text,'hello');
  await assert.rejects(s.stop(),{code:'not-found'},'a finished session rejects stop');
});

test('stop waits for the terminal event; abort resolves on end',async()=>{
  const r=createSpeechRecognizer(base());
  const s=await r.start();
  const done=s.stop();
  emit({session:s.id,kind:'final',text:'done'});
  emit({session:s.id,kind:'end',reason:'stopped'});
  await done;
  const s2=await r.start();
  const aborted=s2.abort();
  emit({session:s2.id,kind:'end',reason:'aborted'});
  await aborted;
  await assert.rejects(s2.stop(),{code:'not-found'});
});

test('an error event rejects pending stop/abort and reaches listeners',async()=>{
  const r=createSpeechRecognizer(base());
  const s=await r.start();
  const seen=[];s.addListener(e=>seen.push(e));
  const done=s.stop();
  emit({session:s.id,kind:'error',code:'permission',message:'Denied'});
  await assert.rejects(done,e=>e.code==='permission');
  assert.equal(seen.at(-1).type,'error');
});

test('malformed events are dropped, not fatal',async()=>{
  const r=createSpeechRecognizer(base());
  const s=await r.start();
  const seen=[];s.addListener(e=>seen.push(e));
  emit(null);emit({kind:'partial'});emit({session:s.id,kind:'bogus'});
  emit({session:s.id,kind:'partial'}); // missing text
  emit({session:s.id,kind:'final',text:'ok',wordsJson:'not json'});
  assert.deepEqual(seen.map(e=>e.type),['final']);
  assert.equal(seen[0].words,undefined,'unparseable wordsJson drops words, keeps text');
  emit({session:s.id,kind:'end'});
  await s.stop().catch(()=>{});
});

test('session cap and timeout bound intake',async()=>{
  const r=createSpeechRecognizer(base());
  const sessions=[];
  for(let i=0;i<MAX_SPEECH_SESSIONS;i++){const s=await r.start();sessions.push(s);}
  await assert.rejects(r.start(),{code:'busy'});
  for(const s of sessions){emit({session:s.id,kind:'end',reason:'aborted'});await s.abort().catch(()=>{});}
  const short=createSpeechRecognizer(base());
  const s=await short.start({maxSessionMs:1100});
  await assert.rejects(s.stop(),{code:'recognition-failed'});
});

test('a throwing listener does not starve the others or the waiters',async()=>{
  const r=createSpeechRecognizer(base());
  const s=await r.start();
  const seen=[];
  s.addListener(()=>{throw new Error('bad listener');});
  s.addListener(e=>seen.push(e));
  const done=s.stop();
  emit({session:s.id,kind:'end',reason:'stopped'});
  await done;
  assert.deepEqual(seen.map(e=>e.type),['end']);
});

test('a rejected native stop drops its waiter; the session stays usable',async()=>{
  let calls=0;
  const r=createSpeechRecognizer({...base(),stop:async()=>{calls++;throw Error('[not-found] gone');}});
  const s=await r.start();
  await assert.rejects(s.stop(),e=>e.code==='not-found');
  const a=s.abort();
  emit({session:s.id,kind:'end',reason:'aborted'});
  await a;
  assert.equal(calls,1);
});

test('native failures retain their stable code',async()=>{
  const r=createSpeechRecognizer({...base(),start:async()=>{throw Error('[consent-required] nope');}});
  await assert.rejects(r.start(),e=>e.code==='consent-required');
  const r2=createSpeechRecognizer({...base(),probe:async()=>{throw {code:'unsupported-format',message:'none'};}});
  await assert.rejects(r2.probe(),e=>e.code==='unsupported-format');
});
