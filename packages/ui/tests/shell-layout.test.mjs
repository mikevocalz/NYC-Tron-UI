import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {hingeBands,mirrorBands,resolveSplit,stepSplit,startSizeFor,sizeForEdge} from "../src/components/shell/splitter-model.ts";
import {movePanel,activatePanel,closePanel,resizeStack,dockTargetAt,clampFloatingRect,validateDockLayout,panelLocation,dockedPanelIds} from "../src/components/shell/dock-model.ts";
import {moveDocument,activeAfterClose,documentTabLabel,validateDocumentTabs} from "../src/components/shell/document-tabs-model.ts";
import {formatZoom,stepZoom,selectionSummary,formatElapsed,activityAnnouncement,progressPercent} from "../src/components/shell/status-model.ts";
import {arrowStep,rovingTarget} from "../src/components/shell/shell-keys.ts";
import {shownVariantId,toolIsActive} from "../src/components/shell/tool-rail-model.ts";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const limits={total:1000,minStart:120,minEnd:120,divider:9};

test("split clamps to both minimums",()=>{
  assert.equal(resolveSplit(50,limits).startSize,120);
  assert.equal(resolveSplit(990,limits).startSize,1000-120-9);
  const l=resolveSplit(300,limits);
  assert.deepEqual([l.startSize,l.dividerStart,l.dividerSize,l.endStart,l.endSize,l.hinge],[300,300,9,309,691,-1]);
  // Panes that cannot both fit keep the start minimum.
  assert.equal(resolveSplit(100,{...limits,total:200}).startSize,120);
  assert.throws(()=>resolveSplit(Number.NaN,limits),RangeError);
});

test("a vertical hinge on a side-by-side split becomes a band from the splitter's edge",()=>{
  const hinge={bounds:{x:540,y:0,width:28,height:900},orientation:"vertical",separating:true,occlusion:"full"};
  const flat={bounds:{x:200,y:0,width:0,height:900},orientation:"vertical",separating:false,occlusion:"none"};
  const across={bounds:{x:0,y:400,width:1200,height:0},orientation:"horizontal",separating:true,occlusion:"none"};
  const container={x:40,y:0,width:1000,height:900};
  assert.deepEqual(hingeBands(container,[hinge,flat,across],"horizontal"),[{start:500,end:528}]);
  assert.deepEqual(hingeBands({x:0,y:0,width:1200,height:900},[across],"vertical"),[{start:400,end:400}]);
  assert.deepEqual(mirrorBands([{start:500,end:528}],1000),[{start:472,end:500}]);
  assert.throws(()=>hingeBands({x:0,y:0,width:-1,height:1},[],"horizontal"),RangeError);
});

test("the divider seats on a hinge instead of resting on it",()=>{
  const bands=[{start:500,end:528}];
  const over=resolveSplit(505,limits,bands);
  assert.equal(over.hinge,0);
  assert.equal(over.startSize,500);
  assert.equal(over.dividerSize,28);
  assert.equal(over.endStart,528);
  // Near but not overlapping: free with no snap, seated with a drag snap.
  assert.equal(resolveSplit(470,limits,bands).hinge,-1);
  assert.equal(resolveSplit(480,limits,bands,24).hinge,0);
  // A zero-width fold still seats the divider, centred on it.
  const seam=resolveSplit(398,limits,[{start:400,end:400}]);
  assert.equal(seam.hinge,0);
  assert.equal(seam.dividerStart+seam.dividerSize/2,400);
});

test("a hinge that would break a minimum pushes the divider to the side that keeps it",()=>{
  const bands=[{start:100,end:140}];
  const l=resolveSplit(110,limits,bands);
  assert.equal(l.hinge,-1);
  assert.equal(l.startSize,140);
  assert.ok(l.dividerStart>=140,"the divider is clear of the hinge");
});

test("keyboard steps move into and back out of a hinge",()=>{
  const bands=[{start:500,end:528}];
  let l=resolveSplit(480,limits,bands);
  l=stepSplit(l,1,16,limits,bands);
  assert.equal(l.hinge,0);
  const out=stepSplit(l,1,16,limits,bands);
  assert.equal(out.hinge,-1);
  assert.ok(out.dividerStart>=528);
  const back=stepSplit(l,-1,16,limits,bands);
  assert.equal(back.hinge,-1);
  assert.ok(back.dividerStart+back.dividerSize<=500);
  assert.throws(()=>stepSplit(l,1,0,limits,bands),RangeError);
});

test("an end-edge size round-trips through the start-size model",()=>{
  const start=startSizeFor(300,"end",limits);
  assert.equal(start,1000-9-300);
  assert.equal(sizeForEdge(resolveSplit(start,limits),"end"),300);
});

const known=["layers","color","history","brushes"];
const base={left:{panels:["layers","color"],active:"layers",size:260},floating:[]};
const defaults={edgeSize:280,floatingRect:{x:10,y:10,width:300,height:200}};

test("panels move between edges and floating, activating where they land",()=>{
  let l=movePanel(base,"color","right",defaults);
  assert.deepEqual(l.left.panels,["layers"]);
  assert.deepEqual(l.right,{panels:["color"],active:"color",size:280});
  l=movePanel(l,"layers","floating",defaults);
  assert.equal(l.left,undefined,"an emptied stack is removed");
  assert.deepEqual(l.floating,[{id:"layers",rect:defaults.floatingRect}]);
  l=movePanel(l,"layers","right",defaults);
  assert.deepEqual(l.right.panels,["color","layers"]);
  assert.equal(l.right.active,"layers");
  assert.equal(panelLocation(l,"layers"),"right");
  validateDockLayout(l,known);
  assert.deepEqual(dockedPanelIds(l),["color","layers"]);
});

test("closing the active panel activates its neighbour and closing an unknown id is a no-op",()=>{
  const l=closePanel(base,"layers");
  assert.deepEqual(l.left,{panels:["color"],active:"color",size:260});
  assert.equal(closePanel(base,"missing"),base);
  assert.equal(activatePanel(base,"layers"),base);
  assert.equal(activatePanel(base,"color").left.active,"color");
  assert.equal(resizeStack(base,"left",300).left.size,300);
  assert.equal(resizeStack(base,"left",-1),base);
});

test("dock layouts reject duplicates, unknown panels and empty stacks",()=>{
  assert.throws(()=>validateDockLayout({...base,right:{panels:["layers"],active:"layers",size:200}},known),/twice/);
  assert.throws(()=>validateDockLayout({left:{panels:["ghost"],active:"ghost",size:200},floating:[]},known),/Unknown/);
  assert.throws(()=>validateDockLayout({left:{panels:[],active:"x",size:200},floating:[]},known),/Empty/);
  assert.throws(()=>validateDockLayout({left:{panels:["layers"],active:"color",size:200},floating:[]},known),/Active/);
});

test("drop targets and floating rects respect edges and usable regions",()=>{
  const size={width:1000,height:800};
  assert.equal(dockTargetAt({x:50,y:400},size),"left");
  assert.equal(dockTargetAt({x:950,y:400},size),"right");
  assert.equal(dockTargetAt({x:500,y:780},size),"bottom");
  assert.equal(dockTargetAt({x:500,y:300},size),"floating");
  assert.equal(dockTargetAt({x:-1,y:300},size),undefined);
  // Two screens of a book-posture foldable: the panel stays on the screen holding its centre.
  const regions=[{x:0,y:0,width:500,height:800},{x:528,y:0,width:472,height:800}];
  assert.deepEqual(clampFloatingRect({x:400,y:100,width:200,height:200},regions),{x:300,y:100,width:200,height:200});
  assert.deepEqual(clampFloatingRect({x:520,y:100,width:200,height:200},regions),{x:528,y:100,width:200,height:200});
  assert.deepEqual(clampFloatingRect({x:0,y:0,width:900,height:100},regions).width,500);
});

test("document tabs reorder, close to a neighbour and announce unsaved changes",()=>{
  const ids=["a","b","c"];
  assert.deepEqual(moveDocument(ids,"a",2),["b","c","a"]);
  assert.equal(moveDocument(ids,"a",0),ids);
  assert.equal(moveDocument(ids,"z",1),ids);
  assert.deepEqual(moveDocument(ids,"c",-5),["c","a","b"]);
  assert.equal(activeAfterClose(ids,"b","b"),"c");
  assert.equal(activeAfterClose(ids,"c","c"),"b");
  assert.equal(activeAfterClose(ids,"a","c"),"c");
  assert.equal(activeAfterClose(["a"],"a","a"),undefined);
  assert.equal(documentTabLabel({id:"a",title:"Poster.psd",dirty:true}),"Poster.psd, unsaved changes");
  assert.throws(()=>validateDocumentTabs([{id:"a",title:"A"},{id:"a",title:"B"}]),/Duplicate/);
  assert.throws(()=>validateDocumentTabs([{id:"a",title:" "}]),/title/);
});

test("status text formats zoom, selection, elapsed time and activity",()=>{
  assert.equal(formatZoom(100),"100%");
  assert.equal(formatZoom(6.25),"6.3%");
  assert.throws(()=>formatZoom(0),RangeError);
  assert.equal(stepZoom(100,[25,50,100,200],1),200);
  assert.equal(stepZoom(100,[25,50,100,200],-1),50);
  assert.equal(stepZoom(75,[25,50,100,200],1),100);
  assert.equal(stepZoom(200,[25,50,100,200],1),200);
  assert.equal(selectionSummary(0),"No selection");
  assert.equal(selectionSummary(1,{one:"layer",other:"layers"}),"1 layer selected");
  assert.equal(selectionSummary(12,{one:"layer",other:"layers"}),"12 layers selected");
  assert.throws(()=>selectionSummary(-1),RangeError);
  assert.equal(formatElapsed(12_400),"0:12");
  assert.equal(formatElapsed(3_723_000),"1:02:03");
  assert.equal(activityAnnouncement({kind:"recording",elapsedMs:5000}),"Recording");
  assert.equal(activityAnnouncement({kind:"rendering",progress:0.4,label:"Exporting"}),"Exporting");
  assert.equal(progressPercent(0.426),43);
  assert.equal(progressPercent(undefined),undefined);
  assert.throws(()=>progressPercent(2),RangeError);
});

test("roving focus wraps, skips disabled stops and flips horizontal arrows in RTL",()=>{
  assert.equal(arrowStep("ArrowRight","horizontal",true),-1);
  assert.equal(arrowStep("ArrowDown","horizontal",false),null);
  const off=[false,true,false];
  assert.equal(rovingTarget(0,"ArrowRight",off,"horizontal",false),2);
  assert.equal(rovingTarget(2,"ArrowRight",off,"horizontal",false),0);
  assert.equal(rovingTarget(0,"ArrowLeft",off,"horizontal",true),2);
  assert.equal(rovingTarget(-1,"ArrowUp",off,"vertical",false),2);
  assert.equal(rovingTarget(0,"End",off,"vertical",false),2);
  assert.equal(rovingTarget(0,"Enter",off,"vertical",false),null);
});

test("tool groups show the chosen or active variant",()=>{
  const brush={id:"brush",label:"Brush",icon:null,variants:[{id:"pen",label:"Pen",icon:null},{id:"marker",label:"Marker",icon:null}]};
  assert.equal(shownVariantId(brush),"pen");
  assert.equal(shownVariantId(brush,{brush:"marker"}),"marker");
  assert.equal(shownVariantId(brush,{brush:"gone"}),"pen");
  assert.ok(toolIsActive(brush,"marker"));
  assert.ok(!toolIsActive(brush,"eraser"));
});

test("shell sources keep Android-safe roles and 44pt targets",()=>{
  for(const file of ["PaneSplitter.tsx","AdaptiveDock.tsx","DocumentTabBar.tsx","ToolRail.tsx","StatusBar.tsx","MenuButton.tsx"]){
    const text=readFileSync(resolve(root,"src/components/shell",file),"utf8");
    assert.ok(/min-h-11|minHeight:44|height:44/.test(text),file+" has 44pt targets");
    assert.ok(!/from\s+["']@nitro-forge\//.test(text),file);
  }
  const split=readFileSync(resolve(root,"src/components/shell/PaneSplitter.tsx"),"utf8");
  assert.ok(split.includes('role:"separator"'),"web window-splitter role");
  assert.ok(split.includes('accessibilityRole:"adjustable"'),"native adjustable divider");
  assert.ok(split.includes("accessibilityActions="));
});
