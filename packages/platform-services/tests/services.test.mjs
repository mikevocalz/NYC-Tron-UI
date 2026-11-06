// Behavior of the JS halves with fake native modules: the haptics opt-out
// and rate limit, the playback policy and session, and documents payload
// handling. No device or OS service is involved.
import test from "node:test";
import assert from "node:assert/strict";
import {createHaptics} from "../src/haptics/haptics.ts";
import {HAPTIC_KINDS} from "../src/haptics/kinds.ts";
import {IDLE_PLAYBACK,nextPlaybackState,setPlaybackIntent,toSessionEvent} from "../src/playback/policy.ts";
import {createPlaybackSession} from "../src/playback/session.ts";
import {createDocuments,toPickedDocument} from "../src/documents/documents.ts";
import {documentPickerSource} from "../src/documents/picker-source.ts";

function memoryStorage(initial={}){
  const map=new Map(Object.entries(initial));
  return {getString:k=>map.get(k),set:(k,v)=>map.set(k,v),map};
}

test("haptics: the opt-out persists, is read back, and silences play",()=>{
  const played=[];
  const storage=memoryStorage();
  const native={play:k=>{played.push(k);return true;}};
  const haptics=createHaptics(native,{storage,now:()=>0});
  assert.equal(haptics.isAvailable,true);
  assert.equal(haptics.play("success"),true);
  haptics.setEnabled(false);
  assert.equal(storage.map.get("nyc-tron.haptics.enabled"),"false");
  assert.equal(haptics.play("error"),false);
  assert.deepEqual(played,["success"]);
  const next=createHaptics(native,{storage});
  assert.equal(next.store.getState().enabled,false,"a later launch keeps the choice");
});

test("haptics: same-kind feedback is rate limited, other kinds are not",()=>{
  let t=0;
  const played=[];
  const haptics=createHaptics({play:k=>{played.push(k);return true;}},{now:()=>t,minIntervalMs:30});
  haptics.play("detent");t=10;
  assert.equal(haptics.play("detent"),false);
  assert.equal(haptics.play("selection"),true);
  t=45;
  assert.equal(haptics.play("detent"),true);
  assert.deepEqual(played,["detent","selection","detent"]);
});

test("haptics: unknown kinds throw, web and unlinked builds no-op, a rejected play is not an app error",async()=>{
  const none=createHaptics(null);
  assert.equal(none.isAvailable,false);
  assert.equal(none.play("light"),false);
  assert.throws(()=>none.play("buzz"),/Unknown haptic kind "buzz"/);
  const failing=createHaptics({play:()=>Promise.reject(new Error("no motor"))});
  assert.equal(failing.play("heavy"),true);
  await new Promise(r=>setImmediate(r));
  assert.equal(HAPTIC_KINDS.length,10);
});

const playing=setPlaybackIntent(IDLE_PLAYBACK,"playing");

test("playback policy: an interruption pauses and resumes only when the OS says so",()=>{
  const began=nextPlaybackState(playing,{type:"interruption-began"});
  assert.equal(began.action,"pause");
  assert.equal(nextPlaybackState(began.state,{type:"interruption-ended",shouldResume:true}).action,"resume");
  const declined=nextPlaybackState(began.state,{type:"interruption-ended",shouldResume:false});
  assert.equal(declined.action,"none");
  assert.equal(declined.state.intent,"paused","the person presses play themselves");
  assert.equal(nextPlaybackState(IDLE_PLAYBACK,{type:"interruption-began"}).action,"none","nothing to pause");
});

test("playback policy: focus loss ducks, pauses transiently, or stops for good",()=>{
  const duck=nextPlaybackState(playing,{type:"focus-lost",transient:true,canDuck:true});
  assert.equal(duck.action,"duck");
  assert.equal(nextPlaybackState(duck.state,{type:"focus-gained"}).action,"unduck");
  const transient=nextPlaybackState(playing,{type:"focus-lost",transient:true,canDuck:false});
  assert.equal(transient.action,"pause");
  assert.equal(nextPlaybackState(transient.state,{type:"focus-gained"}).action,"resume");
  const lost=nextPlaybackState(playing,{type:"focus-lost",transient:false,canDuck:false});
  assert.equal(lost.action,"pause");
  assert.equal(nextPlaybackState(lost.state,{type:"focus-gained"}).action,"none","another app took over");
});

test("playback policy: losing the headset pauses and never resumes by itself",()=>{
  const lost=nextPlaybackState(playing,{type:"output-lost",reason:"headphones-unplugged"});
  assert.equal(lost.action,"pause");
  assert.equal(lost.state.intent,"paused");
  const suspended=nextPlaybackState(playing,{type:"interruption-began"}).state;
  const both=nextPlaybackState(suspended,{type:"output-lost",reason:"bluetooth-disconnected"});
  assert.equal(both.action,"none","already paused by the interruption");
  assert.equal(nextPlaybackState(both.state,{type:"interruption-ended",shouldResume:true}).action,"none",
    "an interruption ending after the headset left does not blast the speaker");
  assert.equal(nextPlaybackState(playing,{type:"media-services-reset"}).action,"reactivate");
});

test("playback payloads are validated; unknown types are dropped",()=>{
  assert.deepEqual(toSessionEvent({type:"interruption-ended",shouldResume:true,transient:false}),{type:"interruption-ended",shouldResume:true});
  assert.deepEqual(toSessionEvent({type:"output-lost",reason:"lasers"}),{type:"output-lost",reason:"device-unavailable"});
  assert.equal(toSessionEvent({type:"route-added"}),undefined);
  assert.equal(toSessionEvent(null),undefined);
});

test("playback session: native events drive onAction; activate reports refusal",async()=>{
  const listeners=new Set();
  const native={activate:async o=>o.category!=="ambient"||o.mixWithOthers,deactivate:async()=>{},
    addListener:(_n,l)=>{listeners.add(l);return {remove:()=>listeners.delete(l)};}};
  const actions=[];
  const session=createPlaybackSession(native,{onAction:a=>actions.push(a)});
  assert.equal(await session.activate({category:"playback"}),true);
  session.setIntent("playing");
  listeners.forEach(l=>l({type:"interruption-began"}));
  listeners.forEach(l=>l({type:"bogus"}));
  listeners.forEach(l=>l({type:"interruption-ended",shouldResume:true}));
  assert.deepEqual(actions,["pause","resume"]);
  await session.dispose();
  assert.equal(listeners.size,0);
  const web=createPlaybackSession(null,{onAction:a=>actions.push(a)});
  assert.equal(await web.activate({category:"playback"}),false);
  web.setIntent("playing");
  assert.equal(web.dispatch({type:"output-lost",reason:"headphones-unplugged"}),"pause");
});

test("documents: records are validated, cancel is [], modes are checked",async()=>{
  const calls=[];
  const native={pick:async o=>{calls.push(o);return [{uri:"content://a/1",name:"Poster.nfd",size:2048,mimeType:null,bookmark:"content://a/1"},{name:"no uri"}];},
    restoreAccess:async b=>b==="gone"?null:{uri:"file:///moved.nfd",bookmark:"fresh",stale:true},releaseAccess:async()=>{},share:async()=>true};
  const docs=createDocuments(native);
  const picked=await docs.pick({types:[".nfd"],mode:"open-in-place"});
  assert.deepEqual(picked,[{uri:"content://a/1",name:"Poster.nfd",size:2048,bookmark:"content://a/1"}]);
  assert.deepEqual(calls[0],{types:[".nfd"],multiple:false,mode:"open-in-place"});
  await assert.rejects(docs.pick({mode:"copy"}),/Unknown pick mode "copy"/);
  assert.deepEqual(await docs.restoreAccess("old"),{uri:"file:///moved.nfd",bookmark:"fresh",stale:true});
  assert.equal(await docs.restoreAccess("gone"),undefined);
  assert.equal(await docs.share({}),false,"nothing to share");
  assert.equal(await docs.share({text:"Poster ready"}),true);
  const none=createDocuments(null);
  assert.deepEqual(await none.pick(),[]);
  assert.equal(toPickedDocument({uri:"",name:"x"}),undefined);
});

test("documentPickerSource maps FilePicker's accept string to picker types",async()=>{
  const seen=[];
  const source=documentPickerSource({pick:async o=>{seen.push(o);return [];}},"open-in-place");
  await source.pick({accept:" .docx, image/png ,",multiple:true});
  assert.deepEqual(seen[0],{types:[".docx","image/png"],multiple:true,mode:"open-in-place"});
});

test("playback disposal drains activation, ignores stale callbacks and releases focus once",async()=>{
  let finish,listener;
  const calls=[];
  const native={activate:()=>{calls.push("activate");return new Promise(resolve=>{finish=resolve;});},
    deactivate:async()=>{calls.push("deactivate");},addListener:(_n,l)=>{listener=l;return {remove:()=>calls.push("remove")};}};
  const session=createPlaybackSession(native,{onAction:()=>{throw Error("late callback");}});
  const activation=session.activate({category:"playback"});
  await Promise.resolve();
  session.setIntent("playing");
  const disposal=session.dispose();
  assert.equal(session.dispose(),disposal);
  listener({type:"interruption-began"});
  session.setIntent("playing");
  assert.equal(session.store.getState().intent,"paused");
  await assert.rejects(session.activate({category:"playback"}),/disposed/);
  assert.deepEqual(calls,["activate","remove"]);
  finish(true);
  await activation;await disposal;
  assert.deepEqual(calls,["activate","remove","deactivate"]);
});

test("haptics: synchronous native failures are harmless and invalid intervals reject",()=>{
  const haptics=createHaptics({play:()=>{throw Error("missing activity");},prepare:()=>{throw Error("missing activity");}});
  assert.equal(haptics.play("light"),false);
  assert.doesNotThrow(()=>haptics.prepare("light"));
  for(const minIntervalMs of [-1,NaN,Infinity])assert.throws(()=>createHaptics(null,{minIntervalMs}),RangeError);
});
