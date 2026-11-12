import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext} from "node:vm";
import ts from "@typescript/typescript6";
import * as sharedOverlays from "../../../core/src/overlays.ts";
import {auditAccessibility} from "../../src/components/shell/a11y-audit.ts";

// N-06 per-control screen-reader audit. Each control renders once on a
// mocked iOS host and the tree goes through auditAccessibility: names,
// adjustable values and actions, action handlers, target sizes. Child
// components (UnitInput, drag transports) expand into their real host props.
// This is a static check of
// what VoiceOver/TalkBack would read, not a run with the screen reader on.
const src=resolve(dirname(fileURLToPath(import.meta.url)),"../../src/components");

function loader(os="ios"){
  let cursor=0;
  const slots=[];
  const element=(type,props,key)=>({type,props,key});
  const store=init=>{let value=init();return {getState:()=>value,setState:n=>{value={...value,...(typeof n==="function"?n(value):n)};},subscribe:()=>()=>{}};};
  const mocks={
    // Resolve the real peer-free implementation after its shared-owner extraction.
    "@nyc-tron/core/overlays": sharedOverlays,
    react:{
      useRef:v=>{const i=cursor++;return slots[i]??(slots[i]={current:v});},
      useEffect:()=>{cursor++;},useLayoutEffect:()=>{cursor++;},
      useMemo:fn=>{cursor++;return fn();},useCallback:fn=>{cursor++;return fn;},
      useSyncExternalStore:(_sub,get)=>{cursor++;return get();},useId:()=>"id",use:ctx=>ctx?._value,useContext:ctx=>ctx?._value,
      useState:v=>{const i=cursor++;slots[i]??=[typeof v==="function"?v():v,()=>{}];return slots[i];},
      createContext:v=>({_value:v,Provider:"Provider"}),
      cloneElement:(el,extra)=>({...el,props:{...el.props,...extra}}),Children:{only:c=>Array.isArray(c)?c[0]:c,toArray:c=>[c].flat()},isValidElement:e=>!!e&&typeof e==="object"&&"props" in e,
    },
    "react/jsx-runtime":{jsx:element,jsxs:element,Fragment:"Fragment"},
    "react-native":{View:"View",Text:"Text",Pressable:"Pressable",TextInput:"TextInput",ScrollView:"ScrollView",Modal:"Modal",
      I18nManager:{isRTL:false},Platform:{OS:os,select:o=>o[os]??o.default},
      PanResponder:{create:()=>({panHandlers:{}})},AccessibilityInfo:{sendAccessibilityEvent(){}},StyleSheet:{create:s=>s,hairlineWidth:1}},
    "react-native-gesture-handler":{
      GestureDetector:"GestureDetector",usePanGesture:options=>options,
      useTapGesture:options=>options,useCompetingGestures:(...gestures)=>gestures,
    },
    "zustand/vanilla":{createStore:store},
    zustand:{useStore:(s,sel)=>sel?sel(s.getState()):s.getState()},
    "@nyc-tron/core/folds":{},
  };
  const cache=new Map();
  function load(path){
    if(cache.has(path))return cache.get(path);
    const exports={};
    cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,
      target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,verbatimModuleSyntax:false}}).outputText;
    runInNewContext(code,{exports,globalThis,AbortController,require:name=>mocks[name]??load(resolve(dirname(path),name))},{filename:path});
    return exports;
  }
  // Function components render in place so the audit sees the hosts they produce.
  const expand=(node,depth=0)=>{
    if(Array.isArray(node))return node.map(n=>expand(n,depth));
    if(!node||typeof node!=="object"||!node.props)return node;
    if(typeof node.type==="function"&&depth<40)return expand(node.type(node.props),depth+1);
    return {...node,props:{...node.props,children:expand(node.props.children,depth)}};
  };
  return (file,name,props)=>{cursor=0;return expand(load(resolve(src,file))[name](props));};
}

const noop=()=>{};
// Interactive elements with a name, to keep a passing audit from being vacuous.
function countNamedInteractive(node){
  if(Array.isArray(node))return node.reduce((n,c)=>n+countNamedInteractive(c),0);
  if(!node||typeof node!=="object"||!node.props)return 0;
  const p=node.props;
  const self=(typeof p.onPress==="function"||p.accessibilityRole==="adjustable"||p.accessibilityRole==="button"||p.accessibilityRole==="tab")
    &&!!(p.accessibilityLabel||p["aria-label"]||p.title)?1:0;
  return self+countNamedInteractive(p.children);
}
const controls=[
  ["shell/SliderField.tsx","SliderField",{label:"Opacity",value:40,min:0,max:100,step:1,onPreview:noop,onCommit:noop,defaultValue:100}],
  ["shell/RangeSlider.tsx","RangeSlider",{label:"Frequency band",value:[200,2000],min:20,max:20000,step:1,onPreview:noop,onCommit:noop}],
  ["shell/RotaryKnob.tsx","RotaryKnob",{label:"Pan",value:0,min:-100,max:100,step:1,onPreview:noop,onCommit:noop,defaultValue:0}],
  ["forge/inputs/InstrumentKnob.tsx","InstrumentKnob",{label:"Cutoff",value:0.5,min:0,max:1,step:0.01,onPreview:noop,onCommit:noop}],
  ["forge/inputs/InstrumentXYPad.tsx","InstrumentXYPad",{label:"Filter",x:0.5,y:0.5,onPreview:noop,onCommit:noop}],
  ["forge/inputs/PrecisionScrubber.tsx","PrecisionScrubber",{label:"Exposure",value:0,min:-5,max:5,step:0.1,onPreview:noop,onCommit:noop}],
  ["shell/PaneSplitter.tsx","PaneSplitter",{axis:"horizontal",start:"A",end:"B",size:300,onPreview:noop,onCommit:noop,label:"Resize panels",container:{x:0,y:0,width:800,height:600}},
    // Panes render once the host has measured itself.
    tree=>tree.props.onLayout({nativeEvent:{layout:{x:0,y:0,width:800,height:600}}})],
  ["forge/audio/LevelFader.tsx","LevelFader",{label:"Track 1 volume",value:0,onChange:noop,onCommit:noop}],
  ["forge/graphics/ImageCropOverlay.tsx","ImageCropOverlay",{rect:{x:0.1,y:0.1,width:0.5,height:0.5},width:320,height:240,onPreview:noop,onCommit:noop}],
  ["forge/layers/LayerStack.tsx","LayerStack",{layers:[{id:"a",name:"Background",visible:true,opacity:1,kind:"raster"},{id:"b",name:"Ink",visible:false,opacity:0.5,kind:"vector"}],
    selectedId:"a",onSelect:noop,onToggleVisible:noop,onOpacityPreview:noop,onOpacityCommit:noop,onMove:noop,onRemove:noop}],
  ["shell/DocumentTabBar.tsx","DocumentTabBar",{documents:[{id:"a",title:"Poster.nfd",dirty:true},{id:"b",title:"Logo.nfd"}],activeId:"a",onActivate:noop,onClose:noop,onReorder:noop}],
  ["Button.tsx","Button",{title:"Export",onPress:noop}],
  ["forge/WaveformLane.tsx","WaveformLane",{peaks:[{min:-0.1,max:0.1},{min:-0.5,max:0.5},{min:-0.9,max:0.9}],position:0.25,onSeekNormalized:noop}],
];

for(const [file,name,props,prime] of controls){
  test(`${name} passes the screen-reader audit`,()=>{
    const render=loader("ios");
    if(prime)prime(render(file,name,props));
    const tree=render(file,name,props);
    const issues=auditAccessibility(tree);
    assert.ok(countNamedInteractive(tree)>0,`${name} rendered nothing interactive, so the audit proved nothing`);
    assert.deepEqual(issues,[],issues.map(i=>`${i.rule} at ${i.path}: ${i.message}`).join("\n"));
  });
}

test("the audit catches each rule on a broken tree",()=>{
  const el=(type,props)=>({type,props});
  const tree=el("View",{children:[
    el("Pressable",{onPress:noop,style:{width:24,height:24}}),
    el("View",{accessibilityRole:"adjustable",accessibilityLabel:"Gain"}),
    el("View",{accessibilityLabel:"Card",accessibilityActions:[{name:"pin"}]}),
    el("View",{accessibilityRole:"image"}),
    el("View",{accessibilityRole:"adjustable",accessibilityLabel:"Pan","aria-valuenow":0,
      accessibilityActions:[{name:"increment"},{name:"decrement"}],onAccessibilityAction:noop}),
    el("View",{accessibilityElementsHidden:true,children:el("Pressable",{onPress:noop})}),
    el("Pressable",{onPress:noop,style:{minHeight:24},hitSlop:10,children:el("Text",{children:"Undo"})}),
  ]});
  const rules=auditAccessibility(tree).map(i=>i.rule).sort();
  assert.deepEqual(rules,["actions-without-handler","adjustable-without-actions","adjustable-without-value",
    "custom-action-without-label","image-without-label","missing-name","small-target"].sort());
  assert.deepEqual(auditAccessibility(tree,{ignore:["small-target","missing-name","image-without-label","adjustable-without-value",
    "adjustable-without-actions","actions-without-handler","custom-action-without-label"]}),[]);
});

// RNW parses accessibilityValue min/max/now with folly::dynamic::asInt(), which
// throws "Loss of precision during arithmetic conversion: (__int64) 0.1" (gate
// T4 Windows lane). Native hosts get whole numbers or no numeric range.
test("PrecisionScrubber passes only whole-number range values to native hosts",()=>{
  const adjustable=node=>{
    if(Array.isArray(node)){for(const child of node){const hit=adjustable(child);if(hit)return hit;}return null;}
    if(!node||typeof node!=="object"||!node.props)return null;
    return node.props.accessibilityRole==="adjustable"?node:adjustable(node.props.children);
  };
  const fractional={label:"Hold delay",unit:" s",value:0.5,min:0.1,max:10,step:0.05,onPreview:noop,onCommit:noop};
  for(const os of ["windows","macos","ios","android"]){
    const host=adjustable(loader(os)("forge/inputs/PrecisionScrubber.tsx","PrecisionScrubber",fractional));
    assert.ok(host,`${os}: no adjustable host`);
    for(const key of ["aria-valuemin","aria-valuemax","aria-valuenow"])assert.equal(host.props[key],undefined,`${os}: ${key}`);
    assert.match(host.props["aria-valuetext"],/0\.5/,`${os}: the exact value stays readable`);
    assert.deepEqual(auditAccessibility(host),[]);
  }
  const whole=adjustable(loader("windows")("forge/inputs/PrecisionScrubber.tsx","PrecisionScrubber",{...fractional,unit:undefined,value:40,min:0,max:100,step:1}));
  assert.deepEqual([whole.props["aria-valuemin"],whole.props["aria-valuemax"],whole.props["aria-valuenow"]],[0,100,40]);
  const web=adjustable(loader("web")("forge/inputs/PrecisionScrubber.tsx","PrecisionScrubber",fractional));
  assert.deepEqual([web.props["aria-valuemin"],web.props["aria-valuemax"],web.props["aria-valuenow"]],[0.1,10,0.5]);
});
