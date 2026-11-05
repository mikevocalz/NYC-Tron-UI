import test from "node:test";
import assert from "node:assert/strict";
import {rayPlaneHit,nearestSpatialHit,updatePinch,validateModelHandoff} from "../src/spatial-interactions.ts";
test("spatial rays return real meter coordinates and reject targets behind the controller",()=>{
 const ray={origin:{x:0,y:0,z:0},direction:{x:0,y:0,z:-1}};
 assert.deepEqual(rayPlaneHit(ray,{point:{x:0,y:0,z:-2},normal:{x:0,y:0,z:1}}),{x:0,y:0,z:-2});
 assert.equal(rayPlaneHit(ray,{point:{x:0,y:0,z:2},normal:{x:0,y:0,z:1}}),null);
 const hit=nearestSpatialHit(ray,[{id:"far",center:{x:0,y:0,z:-4},radius:.5},
   {id:"near",center:{x:0,y:0,z:-2},radius:.3}]);
 assert.equal(hit?.id,"near");
 assert.ok(Math.abs(hit.distance-1.7)<1e-6);
 assert.equal(nearestSpatialHit(ray,[{id:"behind",center:{x:0,y:0,z:4},radius:.2}]),null);
});
test("spatial pinch gestures have native hysteresis to prevent jitter",()=>{
 assert.equal(updatePinch("open",.03),"open");
 assert.equal(updatePinch("open",.02),"pinched");
 assert.equal(updatePinch("pinched",.04),"pinched");
 assert.equal(updatePinch("pinched",.06),"open");
 assert.throws(()=>updatePinch("open",-.1),/pinch/);
});
test("watch model inspection always deep-links into the app 3D viewer",()=>{
 assert.deepEqual(validateModelHandoff({modelId:"chair-42",destination:"app-3d-viewer",source:"watch",intent:"inspect"}).modelId,"chair-42");
 assert.throws(()=>validateModelHandoff({modelId:"",destination:"app-3d-viewer",source:"watch",intent:"inspect"}),/handoff/);
});
