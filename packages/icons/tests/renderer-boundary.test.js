import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Exercise the component boundary without claiming a native renderer/device test.
const mocks = {
  react: `export const useEffect=()=>{}; export const useId=()=>":r1:"; export const useRef=value=>({current:value}); export default {createElement:(type,props,...children)=>({type,props,children})};`,
  "react-native": `class Value { constructor(value){this.value=value;} interpolate(config){return config;} } export const Animated={Value,View:"Animated.View"}; export const Easing={}; export const Platform=globalThis.__iconTestPlatform; export const Pressable="Pressable"; export const View="View";`,
  "react-native-svg": `export default "Svg"; export const Path="Path"; export const Defs="Defs"; export const G="G"; export const Mask="Mask"; export const Rect="Rect";`
};
// Mutable so one module instance can render as native and as web.
globalThis.__iconTestPlatform={OS:"ios"};
registerHooks({
  resolve(specifier,context,nextResolve) {
    return Object.hasOwn(mocks,specifier) ? {url:"icon-test:"+specifier,shortCircuit:true} : nextResolve(specifier,context);
  },
  load(url,context,nextLoad) {
    return url.startsWith("icon-test:") ? {format:"module",source:mocks[url.slice(10)],shortCircuit:true} : nextLoad(url,context);
  }
});
const {ForgeIcon,ForgeIconButton}=await import("../src/ForgeIcon.js");

test("host Rive renderer can supply artboards beyond authored SVG subset",()=>{
 const artboard={nativeArtboard:"chart-funnel"};
 let inputs;
 const result=ForgeIcon({name:"charts/chart-funnel",selected:true,reducedMotion:true,
   renderRive:value=>{inputs=value;return artboard;}});
 assert.equal(result,artboard);
 assert.equal(inputs.selected,true);
 assert.equal(inputs.reducedMotion,true);
 assert.equal(inputs.name,"charts/chart-funnel");
});
test("missing SVG without host artboard remains absent",()=>{
 assert.equal(ForgeIcon({name:"charts/chart-funnel"}),null);
 assert.equal(ForgeIcon({name:"charts/chart-funnel",renderRive:()=>null}),null);
 assert.ok(ForgeIcon({name:"navigation/home",renderRive:()=>null}));
});
test("loading icon button advertises the same disabled state it enforces",()=>{
 const button=ForgeIconButton({name:"file/save",label:"Save",loading:true,onPress(){}});
 assert.equal(button.props.disabled,true);
 assert.deepEqual(button.props.accessibilityState,{selected:false,disabled:true,busy:true});
 assert.throws(()=>ForgeIconButton({name:"file/save",label:" ",onPress(){}}),TypeError);
});

// Walk the element tree, invoking function components so the SVG layer is inspected.
function render(node){
 if(!node||typeof node!=="object")return node;
 if(typeof node.type==="function")return render(node.type({...node.props,children:node.children}));
 return {...node,children:(node.children??[]).flat().map(render)};
}
function find(node,predicate,out=[]){
 if(!node||typeof node!=="object")return out;
 if(predicate(node))out.push(node);
 for(const child of node.children??[])find(child,predicate,out);
 return out;
}
test("decorative icons hide from assistive technology; labelled icons are one image",()=>{
 const decorative=render(ForgeIcon({name:"navigation/home"}));
 assert.equal(decorative.props.accessible,false);
 assert.equal(decorative.props.accessibilityElementsHidden,true);
 assert.equal(decorative.props.importantForAccessibility,"no-hide-descendants");
 assert.equal(decorative.props["aria-hidden"],true);
 for(const svg of find(decorative,n=>n.type==="Svg"))assert.equal(svg.props["aria-hidden"],true);
 const labelled=render(ForgeIcon({name:"navigation/home",accessibilityLabel:"Home"}));
 assert.equal(labelled.props.accessible,true);
 assert.equal(labelled.props.accessibilityRole,"image");
 assert.equal(labelled.props.role,"img");
 assert.equal(labelled.props.accessibilityLabel,"Home");
 assert.equal(labelled.props["aria-hidden"],undefined);
 const blank=render(ForgeIcon({name:"navigation/home",accessibilityLabel:"  "}));
 assert.equal(blank.props["aria-hidden"],true);
});
test("knockout detail is a mask cutout, not a painted surface color",()=>{
 const tree=render(ForgeIcon({name:"navigation/settings",selected:true,reducedMotion:true}));
 const masks=find(tree,n=>n.type==="Mask");
 assert.equal(masks.length,1,"only the filled settings variant uses knockouts");
 const group=find(tree,n=>n.type==="G")[0];
 assert.equal(group.props.mask,"url(#"+masks[0].props.id+")");
 const colors=find(tree,n=>n.type==="Path").flatMap(n=>[n.props.fill,n.props.stroke]);
 assert.ok(colors.every(c=>c==="none"||c==="currentColor"||c==="black"),colors.join());
 assert.ok(!JSON.stringify(tree).match(/#[0-9a-f]{6}/i),"no hardcoded hex in rendered icon");
});
test("icon button keeps its inner icon decorative",()=>{
 const button=ForgeIconButton({name:"file/save",label:"Save",accessibilityLabel:"Ignored",onPress(){}});
 const inner=render(button.children[0]({pressed:false}));
 assert.equal(inner.props["aria-hidden"],true);
});

// react-native-svg's web build spreads props onto the DOM <svg>; React warns
// for RN-only props there ("Received `false` for a non-boolean attribute
// `accessible`"). Web must carry only DOM/ARIA attributes.
const RN_ONLY=["accessible","accessibilityElementsHidden","importantForAccessibility","accessibilityRole","accessibilityLabel"];
test("web icons pass only ARIA attributes to the DOM, never RN-only props",()=>{
 globalThis.__iconTestPlatform.OS="web";
 try{
  for(const props of [{name:"navigation/home"},{name:"navigation/settings",selected:true,reducedMotion:true},
    {name:"navigation/home",accessibilityLabel:"Home"}]){
   const tree=render(ForgeIcon(props));
   for(const node of [tree,...find(tree,n=>n.type==="Svg")])
    for(const key of RN_ONLY)assert.equal(node.props[key],undefined,key+" reached "+node.type+" on web");
   for(const svg of find(tree,n=>n.type==="Svg")){
    assert.equal(svg.props["aria-hidden"],true);
    assert.notEqual(typeof svg.props.focusable,"boolean","focusable must be the SVG string attribute on web");
   }
  }
  assert.equal(render(ForgeIcon({name:"navigation/home"})).props["aria-hidden"],true);
  const labelled=render(ForgeIcon({name:"navigation/home",accessibilityLabel:"Home"}));
  assert.equal(labelled.props.role,"img");
  assert.equal(labelled.props["aria-label"],"Home");
  assert.equal(labelled.props["aria-hidden"],undefined);
 }finally{globalThis.__iconTestPlatform.OS="ios";}
});
