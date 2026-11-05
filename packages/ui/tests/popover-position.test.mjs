import test from "node:test";
import assert from "node:assert/strict";
import {placePopover} from "../src/components/overlays/popover-position.ts";
const panes=[{x:0,y:0,width:450,height:720},{x:474,y:0,width:450,height:720}];
test("popover stays entirely in hinge-safe pane, not across the occlusion",()=>{
 const pop=placePopover({x:420,y:100,width:22,height:40},panes,268,300);
 assert.equal(pop.region.x,0);
 assert.ok(pop.x+pop.width<=450-8+1e-9);
 const right=placePopover({x:480,y:620,width:20,height:40},panes,268,260);
 assert.equal(right.region.x,474);
 assert.ok(right.y<620);
});
test("narrow window clamps popup and invalid geometry is rejected",()=>{
 const small=placePopover({x:5,y:5,width:20,height:30},[{x:0,y:0,width:240,height:200}],300,500);
 assert.equal(small.width,224);
 assert.equal(small.height,184);
 assert.throws(()=>placePopover({x:0,y:0,width:10,height:10},[],100,100),/region/);
});
