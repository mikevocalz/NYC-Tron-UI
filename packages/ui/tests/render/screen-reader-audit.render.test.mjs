import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import {auditAccessibility} from "../../src/components/shell/a11y-audit.ts";

// N-06 per-control screen-reader audit. Each control renders once on a
// mocked iOS host and the tree goes through auditAccessibility: names,
// adjustable values and actions, action handlers, target sizes. Child
// components (UnitInput, drag transports) stay unexpanded elements, so each
// control is audited for the props it sets itself. This is a static check of
// what VoiceOver/TalkBack would read, not a run with the screen reader on.
const src=resolve(dirname(fileURLToPath(import.meta.url)),"../../src/components");

function loader(os="ios"){
  let cursor=0;
  const slots=[];
  const element=(type,props,key)=>({type,props,key});
  const store=init=>{let value=init();return {getState:()=>value,setState:n=>{value={...value,...(typeof n==="function"?n(value):n)};},subscribe:()=>()=>{}};};
  const mocks={
    react:{
      useRef:v=>{const i=cursor++;return slots[i]??(slots[i]={current:v});},
      useEffect:()=>{cursor++;},useLayoutEffect:()=>{cursor++;},
      useMemo:fn=>{cursor++;return fn();},useCallback:fn=>{cursor++;return fn;},
      useId:()=>"id",use:ctx=>ctx?._value,useContext:ctx=>ctx?._value,
      useState:v=>{const i=cursor++;slots[i]??=[typeof v==="function"?v():v,()=>{}];return slots[i];},
      createContext:v=>({_value:v,Provider:"Provider"}),
    },
    "react/jsx-runtime":{jsx:element,jsxs:element,Fragment:"Fragment"},
    "react-native":{View:"View",Text:"Text",Pressable:"Pressable",TextInput:"TextInput",ScrollView:"ScrollView",Modal:"Modal",
      I18nManager:{isRTL:false},Platform:{OS:os,select:o=>o[os]??o.default},
      PanResponder:{create:()=>({panHandlers:{}})},AccessibilityInfo:{sendAccessibilityEvent(){}},StyleSheet:{create:s=>s,hairlineWidth:1}},
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
    runInNewContext(code,{exports,globalThis,require:name=>mocks[name]??load(resolve(dirname(path),name))},{filename:path});
    return exports;
  }
  return (file,name,props)=>{cursor=0;return load(resolve(src,file))[name](props);};
}

const noop=()=>{};
const controls=[
  ["shell/SliderField.tsx","SliderField",{label:"Opacity",value:40,min:0,max:100,step:1,onPreview:noop,onCommit:noop,defaultValue:100}],
  ["shell/RangeSlider.tsx","RangeSlider",{label:"Frequency band",value:[200,2000],min:20,max:20000,step:1,onPreview:noop,onCommit:noop}],
  ["shell/RotaryKnob.tsx","RotaryKnob",{label:"Pan",value:0,min:-100,max:100,step:1,onPreview:noop,onCommit:noop,defaultValue:0}],
  ["forge/inputs/InstrumentKnob.tsx","InstrumentKnob",{label:"Cutoff",value:0.5,min:0,max:1,step:0.01,onPreview:noop,onCommit:noop}],
  ["forge/inputs/InstrumentXYPad.tsx","InstrumentXYPad",{label:"Filter",x:0.5,y:0.5,onPreview:noop,onCommit:noop}],
  ["forge/inputs/PrecisionScrubber.tsx","PrecisionScrubber",{label:"Exposure",value:0,min:-5,max:5,step:0.1,onPreview:noop,onCommit:noop}],
  ["forge/WaveformLane.tsx","WaveformLane",{peaks:[0.1,0.5,0.9,0.4],progress:0.25,onSeekNormalized:noop}],
];

for(const [file,name,props] of controls){
  test(`${name} passes the screen-reader audit`,()=>{
    const render=loader("ios");
    const issues=auditAccessibility(render(file,name,props));
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
    el("View",{accessibilityElementsHidden:true,children:el("Pressable",{onPress:noop})}),
    el("Pressable",{onPress:noop,style:{minHeight:24},hitSlop:10,children:el("Text",{children:"Undo"})}),
  ]});
  const rules=auditAccessibility(tree).map(i=>i.rule).sort();
  assert.deepEqual(rules,["actions-without-handler","adjustable-without-actions","adjustable-without-value",
    "custom-action-without-label","image-without-label","missing-name","small-target"].sort());
  assert.deepEqual(auditAccessibility(tree,{ignore:["small-target","missing-name","image-without-label","adjustable-without-value",
    "adjustable-without-actions","actions-without-handler","custom-action-without-label"]}),[]);
});
