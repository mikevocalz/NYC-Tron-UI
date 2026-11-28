import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {measureAnchor,windowRegions} from "../src/components/overlays/measure-anchor.ts";
import {isTriggerPopover,popoverTriggerState,renderPopoverTrigger} from "../src/components/overlays/anchored-popover-types.ts";
import {flattenOptionGroups,validateOptionGroups} from "../src/components/forms/option-groups.ts";

// Gaps nitro-forge's Design Studio (#36) found on v0.1.0-alpha.2. The LayerStack
// half moved to @nitro-forge/editor-controls with the layer controls.

test("measureAnchor resolves the window frame, or undefined when it cannot measure",async()=>{
 assert.deepEqual(await measureAnchor({measureInWindow:cb=>cb(10,20,30,40)}),{x:10,y:20,width:30,height:40});
 assert.equal(await measureAnchor(null),undefined);
 assert.equal(await measureAnchor({}),undefined);
 assert.equal(await measureAnchor({measureInWindow:cb=>cb(Number.NaN,0,1,1)}),undefined);
 assert.equal(await measureAnchor({measureInWindow:cb=>cb(0,0,-1,1)}),undefined);
 assert.deepEqual(windowRegions(390,844),[{x:0,y:0,width:390,height:844}]);
 assert.deepEqual(windowRegions(0,0),[{x:0,y:0,width:1,height:1}]);
});
test("popover props take exactly one of anchor or trigger",()=>{
 const base={open:false,onOpenChange:()=>{},accessibilityLabel:"Opacity",children:null};
 assert.equal(isTriggerPopover({...base,trigger:"x"}),true);
 assert.equal(isTriggerPopover({...base,anchor:{x:0,y:0,width:1,height:1},usableRegions:[]}),false);
 assert.throws(()=>isTriggerPopover(base),TypeError);
 assert.throws(()=>isTriggerPopover({...base,trigger:"x",anchor:{x:0,y:0,width:1,height:1},usableRegions:[]}),TypeError);
});
test("trigger state toggles through onOpenChange and announces expanded",()=>{
 const calls=[];
 const closed=popoverTriggerState(false,next=>calls.push(next));
 closed.toggle();
 popoverTriggerState(true,next=>calls.push(next)).toggle();
 assert.deepEqual(calls,[true,false]);
 assert.deepEqual(closed.triggerProps,{accessibilityState:{expanded:false},"aria-expanded":false,"aria-haspopup":"dialog"});
 assert.equal(renderPopoverTrigger("node",closed),"node");
 assert.equal(renderPopoverTrigger(state=>state.open?"open":"closed",closed),"closed");
});

test("option groups flatten in display order and reject blank headings or empty groups",()=>{
 const groups=[{heading:"Sans",options:["a","b"]},{heading:"Serif",options:["c"]}];
 assert.deepEqual(flattenOptionGroups(groups),["a","b","c"]);
 assert.doesNotThrow(()=>validateOptionGroups(groups));
 assert.throws(()=>validateOptionGroups([{heading:" ",options:["a"]}]),/blank/);
 assert.throws(()=>validateOptionGroups([{heading:"Empty",options:[]}]),/no options/);
});
test("Select renders headed groups as a named grouped listbox",()=>{
 const source=readFileSync(new URL("../src/components/Select.tsx",import.meta.url),"utf8");
 assert.match(source,/role=\{"group" as never\} aria-labelledby=\{headingId\}/);
 assert.match(source,/role=\{\(web\?"presentation":"heading"\) as never\}/);
 assert.match(source,/throw new TypeError\("Select takes `options` or `groups`, not both"\)/);
});
test("compact TabBar sizes to its tabs; the icon never shrinks",()=>{
 const source=readFileSync(new URL("../src/components/TabBar.tsx",import.meta.url),"utf8");
 assert.match(source,/compact\?"min-w-0 shrink flex-row items-stretch":"w-full min-w-0 flex-row items-stretch"/);
 assert.match(source,/"min-w-0 shrink grow-0 basis-auto flex-row gap-1\.5 px-2"/);
 assert.match(source,/className:"shrink-0 items-center justify-center"/);
});
