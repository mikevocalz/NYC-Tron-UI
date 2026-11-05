import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Exercise the component boundary without claiming a native renderer/device test.
const mocks = {
  react: `export const useEffect=()=>{}; export const useRef=value=>({current:value}); export default {createElement:(type,props,...children)=>({type,props,children})};`,
  "react-native": `class Value { constructor(value){this.value=value;} interpolate(config){return config;} } export const Animated={Value,View:"Animated.View"}; export const Easing={}; export const Pressable="Pressable"; export const View="View";`,
  "react-native-svg": `export default "Svg"; export const Path="Path";`
};
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
 assert.ok(ForgeIcon({name:"home",renderRive:()=>null}));
});
test("loading icon button advertises the same disabled state it enforces",()=>{
 const button=ForgeIconButton({name:"save",label:"Save",loading:true,onPress(){}});
 assert.equal(button.props.disabled,true);
 assert.deepEqual(button.props.accessibilityState,{selected:false,disabled:true,busy:true});
 assert.throws(()=>ForgeIconButton({name:"save",label:" ",onPress(){}}),TypeError);
});
