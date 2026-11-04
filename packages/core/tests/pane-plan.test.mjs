import test from "node:test";
import assert from "node:assert/strict";
import { resolvePanePlan } from "../src/pane-plan.ts";

const host = { x: 30, y: 50, width: 1000, height: 700 };
const base = {
 container: host, features: [],
 master: { present: true, minWidth: 220, preferredWidth: 300 },
 detail: { minWidth: 460 },
 inspector: { open: true, minWidth: 210, preferredWidth: 280 },
};
const fold = (x, width = 18) => ({
 bounds:{ x, y:50, width, height:700 },
 orientation:"vertical", separating:true, occlusion:"full"
});
test("tiled master/detail on a wide viewport with contained overlay inspector",()=>{
 const p=resolvePanePlan(base);
 assert.equal(p.arrangement,"side-by-side");
 assert.deepEqual(p.master.rect,{x:0,y:0,width:300,height:700});
 assert.deepEqual(p.detail.rect,{x:300,y:0,width:700,height:700});
 assert.deepEqual(p.inspector.rect,{x:720,y:0,width:280,height:700});
 assert.equal(p.inspector.placement,"overlay");
});
test("narrow native host keeps the detail; master is controlled overlay",()=>{
 const a={...base,container:{...host,width:430},master:{...base.master,openOnCompact:false}};
 const closed=resolvePanePlan(a);
 assert.equal(closed.arrangement,"single");
 assert.equal(closed.master.placement,"hidden");
 assert.deepEqual(closed.detail.rect,{x:0,y:0,width:430,height:700});
 const open=resolvePanePlan({...a,master:{...a.master,openOnCompact:true}});
 assert.equal(open.master.placement,"overlay");
 assert.equal(open.master.rect.width,300);
 assert.equal(open.inspector.placement,"overlay");
});
test("real separating vertical hinge places book master and detail into distinct regions",()=>{
 const p=resolvePanePlan({...base,features:[fold(490,18)]});
 assert.equal(p.arrangement,"book");
 assert.deepEqual(p.master.rect,{x:0,y:0,width:460,height:700});
 assert.deepEqual(p.detail.rect,{x:478,y:0,width:522,height:700});
 assert.ok(p.inspector.rect.x>=p.detail.rect.x);
});
test("RTL master moves right but physical-right navigation is a separate policy",()=>{
 const p=resolvePanePlan({...base,isRTL:true});
 assert.equal(p.master.rect.x,700);
 assert.equal(p.detail.rect.x,0);
 assert.equal(p.inspector.edge,"left");
 const book=resolvePanePlan({...base,isRTL:true,features:[fold(490,18)]});
 assert.equal(book.arrangement,"book");
 assert.equal(book.master.rect.x,478);
 assert.equal(book.detail.rect.x,0);
});
test("top/bottom are used for tabletop without remaking the navigation shell",()=>{
 const h={...host,height:800};
 const p=resolvePanePlan({...base,container:h,posture:"tabletop",
  features:[{bounds:{x:30,y:438,width:1000,height:12},
    orientation:"horizontal",separating:true,occlusion:"full"}]});
 assert.equal(p.arrangement,"tabletop");
 assert.equal(p.detail.rect.y,0);
 assert.equal(p.master.rect.y,400);
});
test("multiple hinges never produce an overlapping master/detail/inspector",()=>{
 const p=resolvePanePlan({...base,features:[fold(330,12),fold(650,12)],
  master:{present:true,minWidth:200,preferredWidth:260}});
 assert.ok(p.regions.length>=3);
 assert.equal(p.arrangement,"book");
 const r1=p.master.rect,r2=p.detail.rect;
 assert.ok(r1.x+r1.width<=r2.x);
 assert.ok(p.inspector.rect.x>=r2.x);
});
test("narrow inspector becomes contained sheet in detail region",()=>{
 const p=resolvePanePlan({...base,container:{...host,width:190}});
 assert.equal(p.inspector.placement,"contained-sheet");
 assert.deepEqual(p.inspector.rect,{x:0,y:0,width:190,height:700});
});
test("invalid and missing device geometry does not invent regions",()=>{
 assert.throws(()=>resolvePanePlan({...base,container:{...host,width:0}}),/geometry/);
 assert.equal(resolvePanePlan({...base,features:[]}).regions.length,1);
 const p=resolvePanePlan({...base,master:{...base.master,present:false}});
 assert.equal(p.master.placement,"hidden");
 assert.deepEqual(p.detail.rect,{x:0,y:0,width:1000,height:700});
});
