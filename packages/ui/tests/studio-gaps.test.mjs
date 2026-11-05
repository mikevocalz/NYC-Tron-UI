import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 LAYER_NAME_MIN_WIDTH,LAYER_OPACITY_READOUT_WIDTH,LAYER_OPACITY_SLIDER_WIDTH,layerOpacityMode,layerRowMinWidth,
} from "../src/components/forge/layers/layer-model.ts";
import {measureAnchor,windowRegions} from "../src/components/overlays/measure-anchor.ts";
import {isTriggerPopover,popoverTriggerState,renderPopoverTrigger} from "../src/components/overlays/anchored-popover-types.ts";
import {flattenOptionGroups,validateOptionGroups} from "../src/components/forms/option-groups.ts";

// Gaps nitro-forge's Design Studio (#36) found on v0.1.0-alpha.2.
const full={thumbnail:true,removable:true};

test("a row with thumbnail and remove keeps the slider only when it fits beside a 96pt name",()=>{
 // handle 44 + visibility 44 + thumbnail 32 + name 96 + slider 120 + remove 44
 assert.equal(layerRowMinWidth(full,"slider"),380);
 assert.equal(layerRowMinWidth(full,"readout"),44+44+32+LAYER_NAME_MIN_WIDTH+LAYER_OPACITY_READOUT_WIDTH+44);
 assert.ok(layerRowMinWidth(full,"readout")<=320,"the readout row fits the narrowest panel Forge docks");
 assert.equal(layerOpacityMode(320,full),"readout");
 assert.equal(layerOpacityMode(360,full),"readout");
 assert.equal(layerOpacityMode(379,full),"readout");
 assert.equal(layerOpacityMode(380,full),"slider");
 assert.equal(layerOpacityMode(390,full),"slider");
});
test("rows without a thumbnail or remove need less room before giving up the slider",()=>{
 const plain={thumbnail:false,removable:false};
 assert.equal(layerRowMinWidth(plain,"slider"),44+44+LAYER_NAME_MIN_WIDTH+LAYER_OPACITY_SLIDER_WIDTH);
 assert.equal(layerOpacityMode(320,plain),"slider");
 assert.equal(layerOpacityMode(300,plain),"readout");
});
test("an unmeasured stack keeps the slider it drew before layout",()=>{
 assert.equal(layerOpacityMode(undefined,full),"slider");
 assert.equal(layerOpacityMode(Number.NaN,full),"slider");
});
test("LayerStack switches presentation from its own measured width and keeps one commit path",()=>{
 const source=readFileSync(new URL("../src/components/forge/layers/LayerStack.tsx",import.meta.url),"utf8");
 assert.match(source,/onLayout=\{e=>\{store\.setState\(\{width:e\.nativeEvent\.layout\.width\}\);onLayout\?\.\(e\);\}\}/);
 assert.match(source,/layerOpacityMode\(width,\{thumbnail:thumbnailSlot,removable:onRemove!==undefined\}\)/);
 assert.match(source,/<PrecisionScrubber label=\{layer\.name\+" opacity"\}/);
 assert.match(source,/onCommit=\{value=>commit\(value\/100\)\}/);
 assert.doesNotMatch(source,/useWindowDimensions|Dimensions\.get/,"the stack measures its pane, never the window");
});

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
