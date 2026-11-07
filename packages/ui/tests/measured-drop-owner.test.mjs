import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createMeasuredDropOwner} from '../src/components/gestures/measured-drop-owner.ts';
test('canceled and superseded begin measurements cannot overwrite the newest drag',()=>{
 const owner=createMeasuredDropOwner(),a=owner.begin('geometry1');owner.cancel(a);assert.equal(owner.record(a,'geometry1',{x:1,y:2}),false);
 const b=owner.begin('geometry1'),c=owner.begin('geometry1');assert.equal(owner.record(b,'geometry1',{x:100,y:200}),false);assert.equal(owner.cancel(b),false);
 assert.equal(owner.record(c,'geometry1',{x:3,y:4}),true);assert.deepEqual(owner.release(c,'geometry1'),{x:3,y:4});
 assert.equal(owner.record(c,'geometry1',{x:999,y:999}),false,'begin callback cannot publish after release');
});
test('drop before initial measurement rejects instead of reusing a prior gesture origin',()=>{
 const owner=createMeasuredDropOwner(),old=owner.begin('same');owner.record(old,'same',{x:4,y:5});owner.cancel(old);
 const next=owner.begin('same');assert.equal(owner.release(next,'same'),undefined);assert.equal(owner.record(next,'same',{x:4,y:5}),false);
});
test('pending release callbacks are invalidated by cancel, geometry or a newer drag',()=>{
 const owner=createMeasuredDropOwner();
 const begin=boundary=>{const token=owner.begin(boundary);owner.record(token,boundary,{x:1,y:2});owner.release(token,boundary);return token;};
 const first=begin('old');owner.cancel(first);assert.equal(owner.current(first,'old','drop'),false);assert.equal(owner.finish(first,'old'),false);
 const second=begin('old'),newer=owner.begin('new');assert.equal(owner.finish(second,'old'),false);assert.equal(owner.current(newer,'new','drag'),true);
 assert.equal(owner.record(newer,'old',{x:9,y:9}),false);assert.equal(owner.finish(newer,'new'),true);assert.equal(owner.finish(newer,'new'),false);
});
test('a reentrant source switch cannot revive an old consumed drop token',()=>{
 const owner=createMeasuredDropOwner(),old=owner.begin('old');assert.equal(owner.finish(old,'old'),true);const current=owner.begin('new');assert.equal(owner.cancel(old),false);assert.equal(owner.finish(old,'old'),false);assert.equal(owner.current(current,'new'),true);
});
test('PDF/pivot rows retain item identity and geometry cancels admission instead of remounting',()=>{
 const pdf=readFileSync(new URL('../src/components/forge/pdf/PDFThumbnailSidebar.tsx',import.meta.url),'utf8'),pivot=readFileSync(new URL('../src/components/forge/spreadsheet/PivotFieldList.tsx',import.meta.url),'utf8');
 assert.match(pdf,/<ThumbnailRow[^>]*key=\{item.id\}/);assert.doesNotMatch(pdf,/<ThumbnailRow[^>]*key=\{owner/);
 assert.match(pivot,/<PivotField key=\{item.id\}/);assert.match(pdf,/current\(token,boundary\(\)\)/);assert.match(pivot,/current\(token,expected,'drop'\)/);
 assert.doesNotMatch(pdf,/minDistance:4,maxPointers:1,activeOffsetY/,'RNGH axis offsets must not combine minDistance');
});
