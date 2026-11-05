import test from "node:test";
import assert from "node:assert/strict";
import { cornerCutPolygon,cornerCutClipPath,insetCut } from "../src/corner-cut.ts";
test("corner cut produces same platform-independent polygon geometry",()=>{
  assert.deepEqual(cornerCutPolygon(100,60,20,"bottom-right"),[
    [0,0],[100,0],[100,40],[80,60],[0,60]]);
  assert.match(cornerCutClipPath(20,"bottom-right"),/calc\(100% - 20px\)/);
});
test("cut corners clamp to half width and height",()=>{
  assert.deepEqual(cornerCutPolygon(10,10,100,"top-left").slice(0,2),[[0,5],[5,0]]);
  assert.equal(insetCut(0,3),0);
  assert.throws(()=>cornerCutPolygon(-1,50,4),/Invalid/);
});
