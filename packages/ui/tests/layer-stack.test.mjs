import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 LAYER_TOUCH_TARGET,dragTargetIndex,formatOpacity,layerAccessibilityLabel,moveLayer,
 normalizeOpacity,opacityFromDrag,resolveRename,stepOpacity,validateLayers,
} from "../src/components/forge/layers/layer-model.ts";

const layers=[
 {id:"title",name:"Title",visible:true,opacity:1,kind:"text"},
 {id:"logo",name:"Logo",visible:false,opacity:0.4,kind:"vector",locked:true},
 {id:"photo",name:"Photo",visible:true,opacity:0.85,kind:"raster"},
];
const source=readFileSync(new URL("../src/components/forge/layers/LayerStack.tsx",import.meta.url),"utf8");
const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));

test("layer validation rejects rows the stack cannot render honestly",()=>{
 assert.doesNotThrow(()=>validateLayers(layers));
 assert.throws(()=>validateLayers([...layers,layers[0]]),/Duplicate/);
 assert.throws(()=>validateLayers([{...layers[0],id:""}]),/Duplicate or empty/);
 assert.throws(()=>validateLayers([{...layers[0],name:"  "}]),/blank/);
 for(const opacity of [-0.1,1.01,Number.NaN])assert.throws(()=>validateLayers([{...layers[0],opacity}]),/0\.\.1/);
 for(const kind of ["mask","toString"])assert.throws(()=>validateLayers([{...layers[0],kind}]),/kind/);
});
test("opacity math clamps, steps and drags in whole percent",()=>{
 assert.equal(normalizeOpacity(1.4),1);
 assert.equal(normalizeOpacity(-1),0);
 assert.equal(normalizeOpacity(0.333),0.33);
 assert.equal(stepOpacity(0.4,1),0.45);
 assert.equal(stepOpacity(0.02,-1),0);
 assert.equal(stepOpacity(1,1),1);
 assert.equal(opacityFromDrag(0.5,50,100),1);
 assert.equal(opacityFromDrag(0.5,-25,100),0.25);
 assert.equal(opacityFromDrag(0.5,22,0),1,"zero-width track falls back to the touch target width");
 assert.equal(formatOpacity(0.854),"85%");
 assert.throws(()=>opacityFromDrag(0.5,Number.NaN,100),RangeError);
});
test("drag targets and moves treat index 0 as the top layer",()=>{
 assert.equal(dragTargetIndex(2,-112,56,3),0);
 assert.equal(dragTargetIndex(0,20,56,3),0,"under half a row stays put");
 assert.equal(dragTargetIndex(0,30,56,3),1);
 assert.equal(dragTargetIndex(0,9999,56,3),2);
 assert.throws(()=>dragTargetIndex(3,0,56,3),RangeError);
 assert.deepEqual(moveLayer(layers,"photo",0).map(l=>l.id),["photo","title","logo"]);
 assert.deepEqual(moveLayer(layers,"title",2).map(l=>l.id),["logo","photo","title"]);
 assert.deepEqual(layers.map(l=>l.id),["title","logo","photo"],"input is not mutated");
 assert.throws(()=>moveLayer(layers,"nope",0),/Unknown/);
 assert.throws(()=>moveLayer(layers,"title",3),/range/);
});
test("rename drops blank and unchanged drafts",()=>{
 assert.equal(resolveRename("Logo","  Logo mark "),"Logo mark");
 assert.equal(resolveRename("Logo","Logo"),undefined);
 assert.equal(resolveRename("Logo","   "),undefined);
});
test("screen-reader labels carry position, visibility, opacity and lock",()=>{
 assert.equal(layerAccessibilityLabel(layers[1],1,3),"Logo, Shape layer, 2 of 3, hidden, 40% opacity, locked");
 assert.equal(layerAccessibilityLabel(layers[0],0,3),"Title, Text layer, 1 of 3, visible, 100% opacity");
});
test("opacity drag previews live, commits once on release and restores on cancel",()=>{
 assert.equal(LAYER_TOUCH_TARGET,44);
 assert.match(source,/onPanResponderTerminate:cancelOpacity/);
 assert.match(source,/cancelPreview\(p\.layer\.opacity,/);
 assert.match(source,/onPanResponderRelease:\(\)=>\{\s*const current=store\.getState\(\)\.opacity;\s*if\(current\?\.id===latest\.current\.layer\.id\)commitOpacity/);
 assert.equal(source.match(/onOpacityCommit\(/g)?.length,1,"one commit site");
 assert.match(source,/p\.onOpacityPreview\?\.\(p\.layer\.id,next\)/);
});
test("rows expose 44pt targets and screen-reader actions for every gesture",()=>{
 assert.match(source,/accessibilityRole="adjustable"/);
 assert.match(source,/\{name:"increment"\},\{name:"decrement"\}/);
 for(const action of ["moveUp","moveDown","rename","activate"])assert.match(source,new RegExp('name:"'+action+'"'));
 assert.match(source,/accessibilityRole="switch"/);
 assert.match(source,/onPanResponderTerminate:\(\)=>store\.setState\(\{drag:null\}\)/,"cancelled drag never reorders");
 assert.doesNotMatch(source,/#[0-9a-fA-F]{3,8}\b|rgba?\(/,"tokens only");
 assert.doesNotMatch(source,/from\s+["'](?:@nitro-forge\/|@acme\/|@reactvision\/)/);
});
test("layer subpaths ship explicit .js targets",()=>{
 for(const name of ["layers/LayerStack","layers/layer-model"]){
  const entry=pkg.exports["./components/forge/"+name];
  assert.ok(entry,name);
  assert.equal(entry.default,"./dist/components/forge/"+name+".js");
  assert.equal(entry["react-native"],entry.default);
  assert.equal(entry.types,"./dist/components/forge/"+name+".d.ts");
 }
});
