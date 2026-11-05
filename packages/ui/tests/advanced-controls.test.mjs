import test from "node:test";
import assert from "node:assert/strict";
import {assertRange,clamp,snapValue,scrubValue,normalize,pointFromDrag,gestureToAngle} from "../src/components/forge/inputs/precision.ts";
import {visibleTreeRows} from "../src/components/data/tree-grid.ts";
test("precision instruments quantize, clamp and respect detents",()=>{
 const r={min:-12,max:12,step:0.5,detents:[0,6]};
 assert.equal(snapValue(4.24,r),4);
 assert.equal(snapValue(0.18,r),0);
 assert.equal(snapValue(999,r),12);
 assert.equal(clamp(-20,-12,12),-12);
 assert.equal(normalize(5,0,10),0.5);
 assert.equal(gestureToAngle(0,0,10),-135);
 assert.throws(()=>assertRange({min:2,max:1,step:0.2}),/Expected/);
 assert.throws(()=>snapValue(Number.NaN,r),/Nonfinite/);
});
test("scrub fine/coarse and XY controls use bounded normalized coordinates",()=>{
 const r={min:0,max:100,step:1};
 assert.equal(scrubValue(30,80,0,r),40);
 assert.equal(scrubValue(30,80,-40,r),31);
 assert.equal(scrubValue(30,80,40,r),70);
 assert.deepEqual(pointFromDrag({x:.5,y:.5},100,-100,100,100),{x:1,y:1});
 assert.deepEqual(pointFromDrag({x:.5,y:.5},-100,100,100,100),{x:0,y:0});
 assert.throws(()=>pointFromDrag({x:.5,y:.5},0,0,0,100),/viewport/);
});
test("tree rows preserve hierarchy, expansion and reject duplicate ids",()=>{
 const nodes=[{id:"a",label:"Root",children:[{id:"b",label:"Child",children:[{id:"c",label:"Leaf"}]}]},{id:"d",label:"Peer"}];
 assert.deepEqual(visibleTreeRows(nodes,new Set()).map(x=>x.node.id),["a","d"]);
 const rows=visibleTreeRows(nodes,new Set(["a","b"]));
 assert.deepEqual(rows.map(x=>[x.node.id,x.depth]),[["a",0],["b",1],["c",2],["d",0]]);
 assert.throws(()=>visibleTreeRows([{id:"a",label:"A"},{id:"a",label:"B"}],new Set()),/duplicate/);
 assert.throws(()=>visibleTreeRows(nodes,new Set(["a","b"]),1),/depth/);
});
