import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {scrubPrecision,scrubModeFromOffset,scaleTicks,formatStepValue,scrubValue} from "../src/components/forge/inputs/precision.ts";
import {createScrubberModel,initialScrubberState} from "../src/components/forge/inputs/precision-scrubber-model.ts";

test("precision scrub normal/fine/coarse are absolute, deterministic and mode aware",()=>{
 const base={min:0,max:100,step:1,startValue:10,deltaPixels:80,pixelsPerStep:8};
 assert.equal(scrubPrecision(base),20);
 assert.equal(scrubPrecision({...base,mode:"fine"}),11);
 assert.equal(scrubPrecision({...base,mode:"coarse"}),100);
 assert.equal(scrubPrecision({...base,deltaPixels:0,startValue:10.125}),10.125);
 assert.equal(scrubPrecision({...base,deltaPixels:-800}),0);
 // Fine mode lands between steps; normal snaps to whole steps.
 assert.equal(scrubPrecision({...base,deltaPixels:24,mode:"fine"}),10.3);
 assert.equal(scrubPrecision({...base,deltaPixels:12}),12);
});
test("precision scrub accepts semantic detents and validates broken controls",()=>{
 assert.equal(scrubPrecision({min:0,max:100,step:1,startValue:40,deltaPixels:78,pixelsPerStep:8,detents:[50]}),50);
 // Within 6px of travel (0.75 of a step here) the detent catches; beyond it rounding wins.
 assert.equal(scrubPrecision({min:0,max:100,step:1,startValue:40,deltaPixels:75.2,pixelsPerStep:8,detents:[50]}),50);
 assert.equal(scrubPrecision({min:0,max:100,step:1,startValue:40,deltaPixels:72,pixelsPerStep:8,detents:[50]}),49);
 assert.equal(scrubPrecision({min:0,max:100,step:1,startValue:40,deltaPixels:75.2,pixelsPerStep:8,detents:[50],detentPixels:2}),49);
 // Fine mode never catches, so values beside a detent stay reachable.
 assert.equal(scrubPrecision({min:0,max:100,step:1,startValue:49.5,deltaPixels:32,pixelsPerStep:8,detents:[50],mode:"fine"}),49.9);
 assert.throws(()=>scrubPrecision({min:0,max:10,step:1,startValue:2,deltaPixels:4,detentPixels:-1}),RangeError);
 assert.throws(()=>scrubPrecision({min:5,max:1,step:1,startValue:2,deltaPixels:4}),RangeError);
 assert.throws(()=>scrubPrecision({min:0,max:10,step:0,startValue:2,deltaPixels:4}),RangeError);
 assert.throws(()=>scrubPrecision({min:0,max:10,step:1,startValue:2,deltaPixels:Number.NaN}),RangeError);
 assert.throws(()=>scrubPrecision({min:0,max:10,step:1,startValue:2,deltaPixels:4,pixelsPerStep:0}),RangeError);
 assert.throws(()=>scrubPrecision({min:0,max:10,step:1,startValue:2,deltaPixels:4,coarseMultiplier:-1}),RangeError);
});
test("one vertical threshold drives both the knob scrub and the precision scrubber",()=>{
 assert.equal(scrubModeFromOffset(-29),"fine");
 assert.equal(scrubModeFromOffset(-28),"normal");
 assert.equal(scrubModeFromOffset(28),"normal");
 assert.equal(scrubModeFromOffset(29),"coarse");
 assert.throws(()=>scrubModeFromOffset(Number.NaN),RangeError);
 // Knob behaviour is unchanged by the shared mode helper.
 assert.equal(scrubValue(30,80,-40,{min:0,max:100,step:1}),31);
 assert.equal(scrubValue(30,80,40,{min:0,max:100,step:1}),70);
});
test("scale ticks mark majors and the reached span",()=>{
 const ticks=scaleTicks(50,0,100);
 assert.equal(ticks.length,31);
 assert.equal(ticks.filter(t=>t.major).length,7);
 assert.equal(ticks.filter(t=>t.reached).length,16);
 assert.equal(ticks[0].position,0);
 assert.equal(ticks[30].position,1);
 assert.throws(()=>scaleTicks(0,0,1,1),RangeError);
 assert.equal(formatStepValue(0.123456,0.01),"0.123");
 assert.equal(formatStepValue(12,1),"12");
});

function fixture(overrides={}){
 let state=initialScrubberState(10,1);
 const store={getState:()=>state,setState:p=>{state={...state,...p};}};
 const commits=[], previews=[];
 const props={value:10,min:0,max:100,step:1,onPreview:v=>previews.push(v),onCommit:v=>{commits.push(v);},...overrides};
 const model=createScrubberModel(store,()=>props);
 return {model,commits,previews,props,state:()=>state};
}

test("a drag previews every change and commits once on release",async()=>{
 const f=fixture();
 f.model.begin({x:0,y:0});
 f.model.move({x:16,y:0},1);
 f.model.move({x:16,y:0},1);
 f.model.move({x:40,y:0},1);
 assert.deepEqual(f.previews,[12,15]);
 assert.deepEqual(f.commits,[]);
 await f.model.release({x:40,y:0});
 await f.model.release({x:40,y:0});
 assert.deepEqual(f.commits,[15]);
 assert.equal(f.state().active,false);
});
test("vertical travel switches to fine and coarse during the drag",()=>{
 const f=fixture();
 f.model.begin({x:0,y:0});
 f.model.move({x:8,y:-40},1);
 assert.equal(f.state().mode,"fine");
 // Fine starts where the switch happened, then moves in tenths.
 f.model.move({x:16,y:-40},1);
 assert.equal(f.state().preview,10.1);
 f.model.move({x:16,y:40},1);
 assert.equal(f.state().mode,"coarse");
 f.model.move({x:24,y:40},1);
 // Coarse moves ten steps per 8px from 10.1 and snaps to the step grid.
 assert.equal(f.state().preview,20);
});
test("crossing the fine/coarse threshold mid-drag continues from the current value",()=>{
 // 80px of normal travel reaches 20. Pulling up into fine must not rescale
 // those 80px to a tenth (the old jump back to 11).
 const f=fixture();
 f.model.begin({x:0,y:0});
 f.model.move({x:80,y:0},1);
 assert.equal(f.state().preview,20);
 f.model.move({x:80,y:-40},1);
 assert.equal(f.state().mode,"fine");
 assert.equal(f.state().preview,20,"no jump when the mode changes");
 f.model.move({x:88,y:-40},1);
 assert.equal(f.state().preview,20.1);
 // Back to normal re-anchors again on 20.1, so the value never leaps to 21.
 f.model.move({x:88,y:0},1);
 assert.equal(f.state().preview,20.1);
});
test("detents capture a drag that passes close to them",async()=>{
 const f=fixture({value:40,detents:[50]});
 f.model.begin({x:0,y:0});
 f.model.move({x:78,y:0},1);
 assert.equal(f.state().preview,50);
 await f.model.release({x:78,y:0});
 assert.deepEqual(f.commits,[50]);
});
test("a detent catches a drag that stops within detentPixels of it",async()=>{
 // 75.2px from 40 is raw 49.4: rounding alone lands on 49. The detent at 50
 // is 4.8px of travel away, inside the 6px default, so it must win.
 const f=fixture({value:40,detents:[50]});
 f.model.begin({x:0,y:0});
 f.model.move({x:75.2,y:0},1);
 assert.equal(f.state().preview,50);
 await f.model.release({x:75.2,y:0});
 assert.deepEqual(f.commits,[50]);
 const g=fixture({value:40});
 g.model.begin({x:0,y:0});
 g.model.move({x:75.2,y:0},1);
 assert.equal(g.state().preview,49,"without the detent the same drag rounds to 49");
});
test("cancel and a second pointer restore the controlled value without committing",async()=>{
 for(const interrupt of ["cancel","multitouch"]){
  const f=fixture();
  f.model.begin({x:0,y:0});
  f.model.move({x:80,y:0},1);
  if(interrupt==="cancel")f.model.cancel(); else f.model.move({x:90,y:0},2);
  assert.equal(f.state().preview,10);
  assert.equal(f.state().active,false);
  assert.deepEqual(f.previews,[20,10]);
  await f.model.release({x:80,y:0});
  assert.deepEqual(f.commits,[]);
 }
});
test("disabled controls never start or commit",async()=>{
 const f=fixture({disabled:true});
 f.model.begin({x:0,y:0});
 f.model.move({x:80,y:0},1);
 await f.model.release({x:80,y:0});
 await f.model.nudge(1);
 assert.deepEqual(f.commits,[]);
 assert.deepEqual(f.previews,[]);
});
test("nudges and text entry commit once; an unchanged value commits nothing",async()=>{
 const f=fixture();
 await f.model.nudge(1);
 await f.model.nudge(-1);
 f.model.startEditing(); f.model.changeDraft(" 42,5 "); await f.model.applyDraft();
 f.model.startEditing(); f.model.changeDraft("10"); await f.model.applyDraft();
 assert.deepEqual(f.commits,[11,9,42.5]);
 f.model.startEditing(); f.model.changeDraft("abc"); await f.model.applyDraft();
 assert.equal(f.state().error,"Enter a valid number");
 assert.equal(f.state().editing,false);
 assert.deepEqual(f.commits,[11,9,42.5]);
});
test("typed entry snaps to a tenth of the step and clamps to the range",async()=>{
 const f=fixture();
 f.model.startEditing(); f.model.changeDraft("42.537"); await f.model.applyDraft();
 f.model.startEditing(); f.model.changeDraft("250"); await f.model.applyDraft();
 assert.deepEqual(f.commits,[42.5,100]);
 const g=fixture({value:0.5,step:0.1,min:0,max:1});
 g.model.startEditing(); g.model.changeDraft("0.123"); await g.model.applyDraft();
 assert.deepEqual(g.commits,[0.12]);
});
test("a pending commit blocks new input and a rejection shows its message",async()=>{
 let resolve;
 const f=fixture({onCommit:()=>new Promise((_r,reject)=>{resolve=()=>reject(new Error("Engine refused"));})});
 const first=f.model.nudge(1);
 assert.equal(f.state().pending,true);
 f.model.begin({x:0,y:0});
 assert.equal(f.state().active,false);
 resolve();
 await first;
 assert.equal(f.state().pending,false);
 assert.equal(f.state().error,"Engine refused");
 assert.equal(f.state().preview,10);
});
test("the model follows new controlled values only while idle",()=>{
 const f=fixture();
 f.props.value=30; f.model.sync();
 assert.equal(f.state().preview,30);
 f.model.begin({x:0,y:0}); f.model.move({x:8,y:0},1);
 f.props.value=50; f.model.sync();
 assert.equal(f.state().preview,31);
});
test("component keeps forced-colors, adjustable a11y and no engine imports",()=>{
 const src=readFileSync(new URL("../src/components/forge/inputs/PrecisionScrubber.tsx",import.meta.url),"utf8");
 assert.match(src,/forcedColorAdjust:"none"/);
 assert.match(src,/CanvasText\)"/);
 assert.match(src,/Highlight\)"/);
 assert.match(src,/accessibilityRole="adjustable"/);
 assert.match(src,/name:"increment"/);
 assert.match(src,/name:"decrement"/);
 assert.match(src,/key==="Escape"&&model\.dragging/);
 assert.ok(!/from\s+["'](?:@nitro-forge\/|@acme\/|react-native-gesture-handler)/.test(src));
});
