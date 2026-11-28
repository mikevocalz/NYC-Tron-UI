import test from "node:test";
import assert from "node:assert/strict";
import {createValueGesture} from "../src/components/gestures/value-gesture.ts";
import {localPointerConfig} from "../src/components/gestures/local-pointer.ts";
import {adjustKey} from "../src/components/gestures/adjust-keys.ts";
import {createLocalStore} from "../src/components/local-store.ts";

// The gesture and store primitives the color controls are built on. The color
// controls and their tests moved to @nitro-forge/editor-controls.
test("value gesture previews, commits once on release and restores on cancel",()=>{
  const log=[];let disabled=false;
  const g=createValueGesture({disabled:()=>disabled,equals:(a,b)=>a===b,preview:v=>log.push(["p",v]),commit:v=>log.push(["c",v])});
  g.begin(10);g.update(10);g.update(12);g.update(12);g.update(15);g.release();g.release();
  assert.deepEqual(log,[["p",12],["p",15],["c",15]]);
  log.length=0;
  g.begin(10);g.update(20);g.cancel();g.release();
  assert.deepEqual(log,[["p",20],["p",10]]);
  log.length=0;
  // Released at the start value: nothing to commit.
  g.begin(10);g.update(20);g.update(10);g.release();
  assert.deepEqual(log,[["p",20],["p",10]]);
  log.length=0;
  g.begin(10);g.update(20);disabled=true;g.update(30);g.release();
  assert.deepEqual(log,[["p",20],["p",10]]);
  disabled=false;log.length=0;
  g.begin(1);g.update(2);disabled=true;g.release();
  assert.deepEqual(log,[["p",2],["p",1]]);
  disabled=true;log.length=0;
  g.begin(1);g.update(5);assert.equal(g.active,false);assert.deepEqual(log,[]);
});

function pointer(extra={}){
  const calls=[];
  const latest={current:{disabled:false,onBegin:p=>calls.push(["begin",p]),onMove:p=>calls.push(["move",p]),
    onRelease:p=>calls.push(["release",p]),onCancel:()=>calls.push(["cancel"]),...extra(calls)}};
  return {calls,latest,h:localPointerConfig(latest)};
}
const ev=(locationX,locationY,pageX,pageY,touches=[{pageX,pageY}])=>({nativeEvent:{locationX,locationY,pageX,pageY,touches}});
test("local pointer reports view-local points from the grant point plus page travel",()=>{
  const {calls,h,latest}=pointer(()=>({}));
  assert.equal(h.onStartShouldSetPanResponder(),true);
  h.onPanResponderGrant(ev(10,20,110,220));
  // A move over a child would report a child-relative locationX; it must be ignored.
  h.onPanResponderMove(ev(3,3,130,210));
  h.onPanResponderRelease(ev(0,0,150,200));
  h.onPanResponderRelease(ev(0,0,150,200));
  assert.deepEqual(calls,[["begin",{x:10,y:20}],["move",{x:30,y:10}],["release",{x:50,y:0}]]);
  assert.equal(h.onPanResponderTerminationRequest(),false);
  latest.current={...latest.current,disabled:true};
  assert.equal(h.onStartShouldSetPanResponder(),false);
});
test("a second pointer cancels unless the control pinches, and termination cancels",()=>{
  const a=pointer(()=>({}));
  a.h.onPanResponderGrant(ev(10,10,10,10));
  a.h.onPanResponderMove(ev(0,0,20,10,[{pageX:20,pageY:10},{pageX:60,pageY:10}]));
  a.h.onPanResponderRelease(ev(0,0,20,10));
  assert.deepEqual(a.calls.map(c=>c[0]),["begin","cancel"]);
  const b=pointer(calls=>({onPinch:(s,c)=>calls.push(["pinch",Math.round(s*100)/100,c]),onPinchEnd:()=>calls.push(["pinchEnd"])}));
  b.h.onPanResponderGrant(ev(100,50,200,150));
  b.h.onPanResponderMove(ev(0,0,0,0,[{pageX:180,pageY:150},{pageX:220,pageY:150}]));
  b.h.onPanResponderMove(ev(0,0,0,0,[{pageX:160,pageY:150},{pageX:240,pageY:150}]));
  b.h.onPanResponderMove(ev(0,0,250,150));
  b.h.onPanResponderRelease(ev(0,0,250,150));
  assert.deepEqual(b.calls,[["begin",{x:100,y:50}],["cancel"],["pinch",1,{x:100,y:50}],["pinch",2,{x:100,y:50}],["pinchEnd"]]);
  const c=pointer(()=>({}));
  c.h.onPanResponderGrant(ev(1,1,1,1));
  c.h.onPanResponderTerminate();
  c.h.onPanResponderTerminate();
  assert.deepEqual(c.calls.map(x=>x[0]),["begin","cancel"]);
});

test("adjust keys follow the ARIA slider pattern and flip horizontally under RTL",()=>{
  assert.deepEqual(adjustKey("ArrowRight"),{kind:"step",direction:1});
  assert.deepEqual(adjustKey("ArrowRight",true),{kind:"step",direction:-1});
  assert.deepEqual(adjustKey("ArrowUp",true),{kind:"step",direction:1});
  assert.deepEqual(adjustKey("PageDown"),{kind:"page",direction:-1});
  assert.deepEqual(adjustKey("Home"),{kind:"min"});
  assert.deepEqual(adjustKey("Escape"),{kind:"cancel"});
  assert.equal(adjustKey("a"),undefined);
  assert.equal(adjustKey(undefined),undefined);
});

test("local store notifies only on change and unsubscribes",()=>{
  const s=createLocalStore({n:1});
  let hits=0;
  const off=s.subscribe(()=>hits++);
  const same=s.get();
  s.set(same);
  s.set(p=>({n:p.n+1}));
  assert.equal(hits,1);assert.equal(s.get().n,2);
  off();s.set({n:3});assert.equal(hits,1);
});

