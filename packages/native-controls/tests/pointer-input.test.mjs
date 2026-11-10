import test from 'node:test';
import assert from 'node:assert/strict';
import {createPointerRouter} from '../src/pointer-input.ts';

const sample=(kind='pen',pointerId=1,timestampMs=1,extra={})=>({kind,pointerId,timestampMs,x:20,y:30,pressure:0,tiltX:0,tiltY:0,buttons:1,...extra});
const batch=(phase,samples,predicted=[])=>({phase,samples:Array.isArray(samples)?samples:[samples],predicted});
test('observed coalesced samples preserve zero force; predictions never enter strokes',()=>{
 const strokes=[],previews=[];const router=createPointerRouter({onStroke:s=>strokes.push(s),onPrediction:s=>previews.push(s)});
 router.handleBatch(batch('down',sample()));
 router.handleBatch(batch('move',[sample('pen',1,2),sample('pen',1,3)],[sample('pen',1,4)]));
 assert.deepEqual(strokes.flatMap(s=>s.samples.map(p=>p.timestampMs)),[1,2,3]);
 assert.equal(strokes[1].samples[0].pressure,0);assert.equal(previews.at(-1)[0].timestampMs,4);
 router.handleBatch(batch('up',sample('pen',1,4)));assert.deepEqual(previews.at(-1),[]);
});
test('pen cancels touch once; palm release and hover exit cannot finish a pen stroke',()=>{
 const strokes=[];const router=createPointerRouter({onStroke:s=>strokes.push(s)});
 router.handleBatch(batch('down',sample('touch',2)));
 router.handleBatch(batch('down',sample('pen',1,2)));
 router.handleBatch(batch('hover-exit',sample('pen',-1,3)));
 router.handleBatch(batch('down',sample('touch',3,4)));
 router.handleBatch(batch('up',sample('touch',2,5)));
 router.handleBatch(batch('move',sample('pen',1,6)));
 router.handleBatch(batch('up',sample('pen',1,7)));
 assert.deepEqual(strokes.map(s=>[s.phase,s.samples[0].kind]),[['down','touch'],['cancel','touch'],['down','pen'],['move','pen'],['up','pen']]);
});
test('hover suppresses palms until exit; missing pressure stays unavailable',()=>{
 const strokes=[],hovers=[];const router=createPointerRouter({onStroke:s=>strokes.push(s),onHover:s=>hovers.push(s)});
 router.handleBatch(batch('hover',sample('pen',-1,1,{pressure:null})));
 router.handleBatch(batch('down',sample('touch',2,2)));assert.equal(strokes.length,0);
 router.handleBatch(batch('hover-exit',sample('pen',-1,3)));
 router.handleBatch(batch('down',sample('touch',2,4,{pressure:null})));
 assert.equal(strokes[0].samples[0].pressure,null);assert.equal(hovers.at(-1),null);
});
test('cancel and dispose clear previews and cannot create a second commit',()=>{
 const strokes=[],previews=[],keys=[];const router=createPointerRouter({onStroke:s=>strokes.push(s),onPrediction:s=>previews.push(s),onKey:e=>keys.push(e)});
 router.handleBatch(batch('down',sample()));router.cancel();router.cancel();router.dispose();router.dispose();
 router.handleBatch(batch('up',sample('pen',1,3)));router.handleKey({key:'x'});
 assert.deepEqual(strokes.map(s=>s.phase),['down','cancel']);assert.deepEqual(previews.at(-1),[]);assert.equal(keys.length,0);
});
test('invalid, mixed-pointer, stale and out-of-order batches never reach the document',()=>{
 const strokes=[];const router=createPointerRouter({onStroke:s=>strokes.push(s)});
 router.handleBatch(batch('down',sample('pen',1,5)));
 for(const samples of [[sample('pen',1,4)],[sample('pen',1,6,{pressure:NaN})],[sample('pen',1,6),sample('pen',2,7)],[sample('pen',1,8),sample('pen',1,7)]])router.handleBatch(batch('move',samples));
 assert.equal(strokes.length,1);
});
test('disposal from document callback cannot leave predictions after cancellation',()=>{
 const previews=[];let router;router=createPointerRouter({onStroke:s=>{if(s.phase==='move')router.dispose();},onPrediction:s=>previews.push(s)});
 router.handleBatch(batch('down',sample()));router.handleBatch(batch('move',sample('pen',1,2),[sample('pen',1,3)]));
 assert.deepEqual(previews.at(-1),[]);assert.ok(previews.every(s=>s.length===0));
});
test('cancellation during preview clearing suppresses the interrupted actual delivery',()=>{
 const strokes=[];let interrupt=false;let router;
 router=createPointerRouter({onStroke:s=>strokes.push(s),onPrediction:()=>{if(interrupt){interrupt=false;router.cancel();}}});
 router.handleBatch(batch('down',sample()));interrupt=true;
 router.handleBatch(batch('move',sample('pen',1,2),[sample('pen',1,3)]));
 assert.deepEqual(strokes.map(s=>s.phase),['down','cancel']);
});
test('hardware keys and mouse hover route without fabricating force',()=>{
 const keys=[],hovers=[];const router=createPointerRouter({onStroke:()=>{},onKey:e=>keys.push(e),onHover:p=>hovers.push(p)});
 const event={phase:'down',key:'Escape',code:'Escape',shift:false,alt:false,control:false,meta:false,repeat:false};
 router.handleKey(event);router.handleBatch(batch('hover',sample('mouse',3,1,{pressure:null,tiltX:null,tiltY:null})));
 assert.deepEqual(keys,[event]);assert.equal(hovers[0].pressure,null);
});
