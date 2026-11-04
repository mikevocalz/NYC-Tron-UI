import test from "node:test";
import assert from "node:assert/strict";
import { resolveUsableRegions } from "../src/folds.ts";
const screen={x:60,y:30,width:900,height:700};
test("no reported folds never fabricate a hinge",()=>{
  assert.deepEqual(resolveUsableRegions({container:screen,features:[]}),
    [{x:0,y:0,width:900,height:700}]);
});
test("zero-width separating fold divides the content without losing width",()=>{
  assert.deepEqual(resolveUsableRegions({container:screen,features:[{
    bounds:{x:510,y:30,width:0,height:700},orientation:"vertical",
    separating:true,occlusion:"none"}]}),[
    {x:0,y:0,width:450,height:700},{x:450,y:0,width:450,height:700}
  ]);
});
test("nonoccluding nonseparating crease is not made into dead pixels",()=>{
  assert.deepEqual(resolveUsableRegions({container:screen,features:[{
    bounds:{x:510,y:30,width:0,height:700},orientation:"vertical",
    separating:false,occlusion:"none"}]}),[{x:0,y:0,width:900,height:700}]);
});
test("full occlusion removes only its measured stripe and handles offset origin",()=>{
  assert.deepEqual(resolveUsableRegions({container:screen,features:[{
    bounds:{x:500,y:30,width:20,height:700},orientation:"vertical",
    separating:true,occlusion:"full"}]}),[
    {x:0,y:0,width:440,height:700},{x:460,y:0,width:440,height:700}
  ]);
});
test("multiple reported hinges leave three nonoverlapping regions",()=>{
  const features=[300,600].map(x=>({
    bounds:{x:x+60,y:30,width:10,height:700},
    orientation:"vertical",separating:true,occlusion:"full"
  }));
  assert.deepEqual(resolveUsableRegions({container:screen,features}),[
    {x:0,y:0,width:300,height:700},
    {x:310,y:0,width:290,height:700},
    {x:610,y:0,width:290,height:700}
  ]);
});
test("hinges wholly outside the host do not modify regions",()=>{
  const features=[{
    bounds:{x:1400,y:30,width:40,height:700},
    orientation:"vertical",separating:true,occlusion:"full"
  }];
  assert.deepEqual(resolveUsableRegions({container:screen,features}),[
    {x:0,y:0,width:900,height:700}
  ]);
});
test("horizontal tabletop separator cuts usable height",()=>{
  const features=[{
    bounds:{x:60,y:380,width:900,height:0},
    orientation:"horizontal",separating:true,occlusion:"none"
  }];
  assert.deepEqual(resolveUsableRegions({container:screen,features}),[
    {x:0,y:0,width:900,height:350},
    {x:0,y:350,width:900,height:350}
  ]);
});
test("invalid container rejected; invalid feature ignored",()=>{
  assert.throws(()=>resolveUsableRegions({container:{...screen,width:-9},features:[]}),/Invalid/);
  assert.deepEqual(resolveUsableRegions({container:screen,features:[{
    bounds:{x:NaN,y:30,width:20,height:700},orientation:"vertical",
    separating:true,occlusion:"full"
  }]}),[{x:0,y:0,width:900,height:700}]);
});
