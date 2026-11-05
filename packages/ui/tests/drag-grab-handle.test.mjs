import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createDragController} from "../src/components/gestures/drag-controller.ts";
import {keyboardKey} from "../src/components/gestures/drag-transport.ts";
import {panResponderDragConfig} from "../src/components/gestures/pan-responder-config.ts";
import {buildDragGesture} from "../src/components/gestures/gesture-handler-config.ts";

test("preview only and one release commit are shared by dock and layer consumers",()=>{
 for(const consumer of ["dock","layer"]){
  const calls=[];
  const c=createDragController({disabled:()=>false,start:()=>calls.push("start"),move:()=>calls.push("preview"),commit:()=>calls.push(consumer),cancel:()=>calls.push("cancel")});
  c.begin(); c.move({x:1,y:2}); c.move({x:3,y:4});
  assert.deepEqual(calls,["start","preview","preview"]);
  c.release(); c.release();
  assert.deepEqual(calls,["start","preview","preview",consumer]);
 }
});
test("cancellation, termination, and becoming disabled never commit",()=>{
 let disabled=false, commits=0, cancellations=0;
 const c=createDragController({disabled:()=>disabled,start(){},move(){},commit:()=>commits++,cancel:()=>cancellations++});
 c.begin(); c.cancel(); c.release();
 assert.equal(commits,0); assert.equal(cancellations,1);
 c.begin(); disabled=true; c.move({x:3,y:4}); c.release();
 assert.equal(commits,0); assert.equal(cancellations,2);
 c.begin(); c.release(); assert.equal(commits,0); assert.equal(cancellations,2);
});
test("keyboard key reads web and native event shapes",()=>{
 assert.equal(keyboardKey({key:"Escape"}),"Escape");
 assert.equal(keyboardKey({nativeEvent:{key:"Escape"}}),"Escape");
 assert.equal(keyboardKey({}),undefined);
});

function responderFixture(disabled=false){
 const calls=[];
 const latest={current:{children:null,disabled,
  onBegin:p=>calls.push(["begin",p]),onMove:(p,t)=>calls.push(["move",p,t]),
  onRelease:p=>calls.push(["release",p]),onCancel:()=>calls.push(["cancel"])}};
 const event=(count=1)=>({nativeEvent:{pageX:30,pageY:40,touches:Array.from({length:count},()=>({}))}});
 return {calls,latest,event,h:panResponderDragConfig(latest)};
}
test("responder transport delivers page coordinates for one pointer",()=>{
 const f=responderFixture();
 assert.equal(f.h.onStartShouldSetPanResponder(f.event()),true);
 f.h.onPanResponderGrant(f.event());
 f.h.onPanResponderMove(f.event(),{numberActiveTouches:1});
 f.h.onPanResponderRelease(f.event(0));
 assert.deepEqual(f.calls,[["begin",{x:30,y:40}],["move",{x:30,y:40},1],["release",{x:30,y:40}]]);
});
test("responder transport rejects disabled/multitouch starts and cancels interruption",()=>{
 const f=responderFixture();
 assert.equal(f.h.onStartShouldSetPanResponder(f.event(2)),false);
 f.h.onPanResponderStart(f.event(2));
 assert.equal(f.h.onPanResponderTerminationRequest(),true);
 f.h.onPanResponderTerminate();
 assert.deepEqual(f.calls,[["cancel"],["cancel"]]);
 f.latest.current={...f.latest.current,disabled:true};
 assert.equal(f.h.onStartShouldSetPanResponder(f.event()),false);
});

function nativeFixture(){
 const callbacks={}, options={}, tapCallbacks={};
 const chain=(store,opts)=>{const p=new Proxy({},{get:(_t,name)=>value=>{
  if(name.startsWith("on"))store[name]=value; else if(opts)opts[name]=value; return p;}});return p;};
 const pan=chain(callbacks,options), tap=chain(tapCallbacks);
 const Gesture={Pan:()=>pan,Tap:()=>tap,Race:(...g)=>g};
 const calls=[];
 const latest={current:{children:null,
  onBegin:p=>calls.push(["begin",p]),onMove:(p,t)=>calls.push(["move",p,t]),
  onRelease:p=>calls.push(["release",p]),onCancel:()=>calls.push(["cancel"])}};
 const race=buildDragGesture(Gesture,latest,false);
 return {callbacks,tapCallbacks,options,calls,race,pan,tap};
}
test("native transport uses RNGH with one pointer and JS callbacks",()=>{
 const f=nativeFixture();
 assert.deepEqual(f.options,{enabled:true,minDistance:0,maxPointers:1,runOnJS:true});
 assert.deepEqual(f.race,[f.pan,f.tap]);
 f.callbacks.onBegin({absoluteX:10,absoluteY:20});
 f.callbacks.onStart({});
 f.callbacks.onUpdate({absoluteX:30,absoluteY:40,numberOfPointers:1});
 f.callbacks.onEnd({absoluteX:30,absoluteY:40},true);
 f.callbacks.onFinalize({},true);
 assert.deepEqual(f.calls,[["begin",{x:10,y:20}],["move",{x:30,y:40},1],["release",{x:30,y:40}]]);
});
test("native failure and extra pointers cancel without committing",()=>{
 for(const action of ["failedEnd","failedFinalize","multitouch"]){
  const f=nativeFixture();
  f.callbacks.onBegin({absoluteX:10,absoluteY:20});
  f.callbacks.onStart({});
  f.calls.length=0;
  if(action==="failedEnd")f.callbacks.onEnd({},false);
  if(action==="failedFinalize")f.callbacks.onFinalize({},false);
  if(action==="multitouch")f.callbacks.onTouchesDown({numberOfTouches:2});
  assert.deepEqual(f.calls,[["cancel"]]);
 }
});
test("no-MOVE tap releases once and a losing pan finalize cannot cancel it",()=>{
 const f=nativeFixture();
 f.callbacks.onBegin({absoluteX:10,absoluteY:20});
 f.tapCallbacks.onBegin({numberOfPointers:1});
 f.tapCallbacks.onTouchesDown({numberOfTouches:1});
 f.tapCallbacks.onEnd({absoluteX:10,absoluteY:20},true);
 f.callbacks.onFinalize({},false);
 assert.deepEqual(f.calls,[["begin",{x:10,y:20}],["release",{x:10,y:20}]]);
});
test("multitouch or losing tap cannot start a second transaction",()=>{
 for(const success of [false,true]){
  const f=nativeFixture();
  f.tapCallbacks.onBegin({numberOfPointers:1});
  if(success)f.tapCallbacks.onTouchesDown({numberOfTouches:2});
  f.tapCallbacks.onEnd({absoluteX:10,absoluteY:20},success);
  assert.deepEqual(f.calls,[]);
 }
});
test("simultaneous two-finger touch-down stays rejected when begin follows touches",()=>{
 const f=nativeFixture();
 f.tapCallbacks.onTouchesDown({numberOfTouches:2});
 f.tapCallbacks.onBegin({numberOfPointers:2});
 f.tapCallbacks.onEnd({absoluteX:10,absoluteY:20},true);
 assert.deepEqual(f.calls,[]);
});
test("handle keeps its label, Escape cancel and the optional-peer boundary",()=>{
 const handle=readFileSync(new URL("../src/components/DragGrabHandle.tsx",import.meta.url),"utf8");
 assert.match(handle,/accessibilityLabel=\{label\}/);
 assert.match(handle,/keyboardKey\(event\)==="Escape"\)controller\.cancel\(\)/);
 assert.match(handle,/touches===1\)controller\.move\(point\);else controller\.cancel\(\)/);
 for(const file of ["DragGrabHandle.tsx","forge/inputs/PrecisionScrubber.tsx","gestures/PanResponderDrag.tsx","gestures/gesture-handler-config.ts"]){
  const src=readFileSync(new URL("../src/components/"+file,import.meta.url),"utf8");
  assert.ok(!/^import\s+(?!type)[^;]*from\s+["']react-native-gesture-handler["']/m.test(src),file+" loads the optional peer");
  assert.ok(!/@nitro-forge\//.test(src),file);
 }
});
