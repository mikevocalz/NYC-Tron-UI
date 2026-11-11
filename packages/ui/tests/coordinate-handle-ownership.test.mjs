import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCoordinateAdmission,createCoordinatePreviewOwner,finishCoordinateEdit,createMeasuredCoordinateOwner} from '../src/components/gestures/coordinate-admission.ts';
test('geometry or source replacement consumes old drag, release and queued admission',()=>{
 const gate=createCoordinateAdmission();gate.admit('a:1');assert.equal(gate.begin('a:1'),true);assert.equal(gate.current('a:1'),true);
 gate.admit('a:2');assert.equal(gate.current('a:1'),false);assert.equal(gate.finish('a:1'),false);assert.equal(gate.begin('a:1'),false);
 assert.equal(gate.begin('a:2'),true);assert.equal(gate.finish('a:2'),true);assert.equal(gate.finish('a:2'),false);
 gate.invalidate('a:1');assert.equal(gate.ready('a:2'),true);gate.invalidate('a:2');assert.equal(gate.begin('a:2'),false);
});
test('preview cleanup calls original host after replacement and stale cleanup cannot clear next host',()=>{
 const lease=createCoordinatePreviewOwner(),old=[],next=[];const a=v=>old.push(v),b=v=>next.push(v);
 lease.publish('a',a,{row:1});lease.publish('a',a,{row:2});lease.clear('a');assert.deepEqual(old,[{row:1},{row:2},null]);
 lease.publish('b',b,{row:3});lease.clear('a');assert.deepEqual(next,[{row:3}]);lease.clear();lease.clear();assert.deepEqual(next,[{row:3},null]);
});
test('callback replacement restores predecessor, including throwing and reentrant cleanup',()=>{
 const lease=createCoordinatePreviewOwner(),calls=[];const old=v=>{calls.push(['a',v]);if(v===null)lease.clear();};
 lease.publish('a',old,1);lease.publish('a',v=>calls.push(['b',v]),2);assert.deepEqual(calls,[['a',1],['a',null]]);
 const failure=new Error('host');lease.publish('c',v=>{if(v===null)throw failure;},3);assert.throws(()=>lease.clear(),e=>e===failure);lease.clear();
});
test('ruler and selection handles retain semantic keys and explicitly cancel coordinate admission',()=>{
 const source=path=>readFileSync(new URL('../src/components/forge/'+path,import.meta.url),'utf8');
 const ruler=source('document/ParagraphRuler.tsx'),selection=source('spreadsheet/CellSelectionOverlay.tsx');
 assert.match(ruler,/key=\{m.id\} boundary=\{owner\}/);assert.doesNotMatch(ruler,/key=\{owner/);assert.match(ruler,/useEditorBoundary\(\[boundary,width,disabled\]\)/);
 assert.match(selection,/<RangeHandle key=\{p.id\} boundary=\{owner\}/);assert.doesNotMatch(selection,/key=\{owner/);assert.match(selection,/publish\(owner,host.onPreview,next\)/);assert.match(selection,/return\(\)=>\{previews.current!.clear\(owner\)/);
 for(const text of [ruler,selection])assert.match(text,/gate.finish\(coordinates\)/);
});

test('raw preview source replacement stops old finish before shared cleanup or write',()=>{
 let current='old',preview=null;const calls=[];
 const finish=()=>finishCoordinateEdit(()=>current==='old',()=>{preview='old';current='new';preview='new';return {range:'old'};},()=>{preview=null;calls.push('clear');},result=>calls.push(result));
 finish();assert.equal(preview,'new');assert.deepEqual(calls,[]);
});
test('source replacement during preview cleanup stops the old final write',()=>{
 let current='old';const writes=[];
 finishCoordinateEdit(()=>current==='old',()=>({range:'old'}),()=>{current='new';},result=>writes.push(result));assert.deepEqual(writes,[]);
});

test('geometry measurements remain available while editing is pending and reject replaced-source events',()=>{
 const geometry=createMeasuredCoordinateOwner();geometry.admit('a');let width=160;
 const measure=(source,next)=>{const accepted=geometry.measure(source,next);if(accepted!==undefined)width=accepted;};
 measure('a',320);assert.equal(width,320); // Observation is independent of disabled/pending write admission.
 geometry.admit('b');measure('a',90);assert.equal(width,320);measure('b',640);assert.equal(width,640);geometry.invalidate('a');measure('b',480);assert.equal(width,480);
 geometry.invalidate('b');measure('b',90);assert.equal(width,480);
 const ruler=readFileSync(new URL('../src/components/forge/document/ParagraphRuler.tsx',import.meta.url),'utf8');assert.match(ruler,/measurement.current!.measure\(measurementBoundary,e.nativeEvent.layout.width\)/);assert.doesNotMatch(ruler,/onLayout=\{e=>\{if\(!guard.current\(\)\)/);
});
