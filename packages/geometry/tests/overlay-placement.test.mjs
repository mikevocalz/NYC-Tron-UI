import test from 'node:test';
import assert from 'node:assert/strict';
import { computeOverlayPlacement as place } from '../src/overlay-placement.ts';
const r = {x: 100, y: 200, width: 80, height: 40};
const f = {width: 20, height: 10};
test('all twelve placements use host coordinates', () => {
  const expected = {top:[130,190], 'top-start':[100,190], 'top-end':[160,190], bottom:[130,240], 'bottom-start':[100,240], 'bottom-end':[160,240], left:[80,215], 'left-start':[80,200], 'left-end':[80,230], right:[180,215], 'right-start':[180,200], 'right-end':[180,230]};
  for (const [p, [x,y]] of Object.entries(expected)) assert.deepEqual(place(r,f,p),{x,y});
});
test('RTL reverses horizontal alignment but preserves physical side', () => {
  assert.deepEqual(place(r,f,'bottom-start',true),{x:160,y:240});
  assert.deepEqual(place(r,f,'top-end',true),{x:100,y:190});
  assert.deepEqual(place(r,f,'left-start',true),{x:80,y:200});
});
test('oversized overlays and zero-width anchors retain alignment', () => {
  assert.deepEqual(place({...r,width:0},{width:120,height:10},'bottom'),{x:40,y:240});
  assert.deepEqual(place(r,{width:120,height:10},'bottom-end'),{x:60,y:240});
});
test('reject invalid geometry, placement and overflow', () => {
  for (const width of [-1,NaN,Infinity]) assert.throws(()=>place({...r,width},f,'top'),RangeError);
  assert.throws(()=>place(r,f,'middle'),RangeError);
  assert.throws(()=>place({...r,x:Number.MAX_VALUE,width:Number.MAX_VALUE},f,'right'),RangeError);
});
