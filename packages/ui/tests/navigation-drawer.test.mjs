import test from "node:test";
import assert from "node:assert/strict";
import { drawerGeometry } from "../src/components/navigation/drawer-model.ts";

test("Windows expanded left pane reserves width and remains visible",()=>{
 const x=drawerGeometry({mode:"expanded",open:false});
 assert.deepEqual(x,{contentInsetLeft:280,paneWidth:280,
  showPane:true,showLabels:true,overlay:false,scrim:false});
});
test("Windows compact view is an icon-only rail until user expands",()=>{
 const small=drawerGeometry({mode:"compact",open:false});
 const large=drawerGeometry({mode:"compact",open:true});
 assert.equal(small.paneWidth,64);
 assert.equal(small.showLabels,false);
 assert.equal(large.paneWidth,280);
 assert.equal(large.contentInsetLeft,64);
 assert.equal(large.scrim,true);
});
test("minimal view opens as overlay without shrinking the user's work",()=>{
 const closed=drawerGeometry({mode:"minimal",open:false});
 const open=drawerGeometry({mode:"minimal",open:true});
 assert.equal(closed.contentInsetLeft,0);
 assert.equal(closed.showPane,false);
 assert.equal(open.paneWidth,280);
 assert.equal(open.overlay,true);
});
test("drawer validates native hit-target and width constraints",()=>{
 assert.throws(()=>drawerGeometry({mode:"compact",open:false,compactWidth:40}),/widths/);
 assert.throws(()=>drawerGeometry({mode:"expanded",open:false,compactWidth:280,expandedWidth:280}),/widths/);
 assert.throws(()=>drawerGeometry({mode:"top",open:false}),/mode/);
});
