import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGradientPreviewOwner} from '../src/components/forge/vector/gradient-preview-owner.ts';
test('geometry/source/admission cancellation clears only the preview host that owns it',()=>{
 const owner=createGradientPreviewOwner();const old=[],current=[];
 owner.publish('document:1:width200',v=>old.push(v),'old geometry');
 owner.clear('document:1:width200');
 assert.deepEqual(old,['old geometry',undefined]);
 owner.publish('document:2:width300',v=>current.push(v),'new geometry');
 owner.clear('document:1:width200');
 assert.deepEqual(current,['new geometry']);
 owner.clear('document:2:width300');owner.clear();
 assert.deepEqual(current,['new geometry',undefined]);
});
test('changing preview callback ownership cancels the previous lease before delivering new pixels',()=>{
 const owner=createGradientPreviewOwner();const calls=[];
 owner.publish('same',v=>calls.push(['old',v]),'a');
 owner.publish('same',v=>calls.push(['new',v]),'b');owner.clear();
 assert.deepEqual(calls,[['old','a'],['old',undefined],['new','b'],['new',undefined]]);
});
test('both gradient layers retain mounted identity across resize, source updates and disable',()=>{
 const shared=readFileSync(new URL('../src/components/forge/vector/GradientOnCanvasHandles.tsx',import.meta.url),'utf8');
 const photo=readFileSync(new URL('../src/components/forge/photo/LinearRadialGradientMask.tsx',import.meta.url),'utf8');
 assert.doesNotMatch(shared,/<GradientOnCanvasHandlesBody\s+[^>]*\bkey=/);
 assert.doesNotMatch(photo,/<GradientOnCanvasHandles\s+[^>]*\bkey=/);
 assert.doesNotMatch(photo,/disabled\s*\?\s*<View/);
 assert.match(photo,/disabledReason=\{disabled\?/);
 assert.match(shared,/gestureBoundary=\{owner\}/);
 assert.match(shared,/\[gestureBoundary,paint,transform,width,height,disabledReason,busy\]/);
 assert.match(shared,/drag.current=null;pressAt.current=null;clearPreview\(\)/);
 assert.match(shared,/const release=\(\)=>\{\s*const d=drag.current;\s*drag.current=null;\s*if\(!d\|\|d.cancelled\|\|disabledReason!==undefined\|\|busy\)return;/);
 assert.match(shared,/if\(!start\|\|Math.hypot/);
});
