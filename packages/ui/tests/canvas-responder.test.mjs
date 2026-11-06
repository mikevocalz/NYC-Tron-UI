import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
function load(os='web'){
 const exports={};const native={panHandlers:{native:true}};
 const code=ts.transpileModule(readFileSync(new URL('../src/components/gestures/canvas-responder.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 runInNewContext(code,{exports,require:()=>({Platform:{OS:os},PanResponder:{create:()=>native}})});
 return {create:exports.createCanvasResponder,native};
}
function surface(){
 const captured=new Set();const calls=[];
 const target={getBoundingClientRect:()=>({left:20,top:30}),focus:()=>calls.push('focus'),setPointerCapture:id=>captured.add(id),hasPointerCapture:id=>captured.has(id),releasePointerCapture:id=>captured.delete(id)};
 return {captured,calls,event:(x,y,extra={})=>({currentTarget:target,nativeEvent:{pointerId:1,button:0,clientX:x,clientY:y,pageX:x+100,pageY:y+200,...extra},preventDefault(){calls.push('prevent');}})};
}
test('native platforms retain the native responder',()=>{const {create,native}=load('ios');assert.equal(create({}),native);});
test('web Alt-drag keeps local coordinates and commits once with capture',()=>{
 const s=surface(),events=[];const h=load().create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:e=>events.push(['start',e.nativeEvent.locationX,e.nativeEvent.altKey]),onPanResponderMove:(e,g)=>events.push(['move',e.nativeEvent.locationY,g.dx,g.dy]),onPanResponderRelease:()=>events.push(['commit'])}).panHandlers;
 h.onPointerDown(s.event(25,40,{altKey:true}));assert.equal(s.captured.size,1);
 h.onPointerMove(s.event(45,70));h.onPointerUp(s.event(45,70));h.onLostPointerCapture(s.event(45,70));
 assert.equal(JSON.stringify(events),JSON.stringify([['start',5,true],['move',40,20,30],['commit']]));assert.equal(s.captured.size,0);assert.deepEqual(s.calls,['prevent','focus']);
});
test('a second pointer cancels without a commit and always releases capture',()=>{
 const s=surface();let commits=0,cancels=0;const h=load().create({onPanResponderRelease:()=>commits++,onPanResponderTerminate:()=>{cancels++;throw Error('cancel');}}).panHandlers;
 h.onPointerDown(s.event(25,40));assert.throws(()=>h.onPointerDown(s.event(30,40,{pointerId:2})),/cancel/);h.onPointerUp(s.event(25,40));assert.equal(cancels,1);assert.equal(commits,0);assert.equal(s.captured.size,0);
});
