import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Execute the exported components with mocked native hosts. These checks
// prove appearance forwarding and retained JS state, not OS pixels or a11y.
const components=resolve(dirname(fileURLToPath(import.meta.url)),"../src/components");
const ui=resolve(components,"../../../ui/src/components");
const compound=(name,parts)=>Object.assign({name},Object.fromEntries(parts.map(part=>[part,name+"."+part])));
function harness(file,os){
  const refs=[];
  let cursor=0;
  const element=(type,props,key)=>({type,props,key});
  const modifier=new Proxy({}, {get:(_,name)=>(...args)=>({name,args})});
  const mocks={
    react:{
      useRef:value=>refs[cursor++]??(refs[cursor-1]={current:value}),
      useEffect:()=>{},useLayoutEffect:()=>{},useMemo:fn=>fn(),
      isValidElement:value=>!!value?.type,
      cloneElement:(child,props)=>({...child,props:{...child.props,...props}}),
    },
    "react/jsx-runtime":{jsx:element,jsxs:element,Fragment:"Fragment"},
    "react-native":{View:"View",Text:"Text",Pressable:"Pressable",Platform:{OS:os},
      useWindowDimensions:()=>({width:900,height:700})},
    "zustand/vanilla":{createStore:init=>{let state=init();return{
      getState:()=>state,setState:next=>{state={...state,...next};},
    };}},
    zustand:{useStore:(store,selector)=>selector(store.getState())},
    "@expo/ui":{Host:"Host",Picker:compound("Picker",["Item"])},
    "@expo/ui/swift-ui":{
      Picker:"SwiftUIPicker",Section:"SwiftUISection",Text:"SwiftUIText",Slider:"SwiftUISlider",
      Button:"SwiftUIButton",HStack:"HStack",Menu:"SwiftUIMenu",Spacer:"Spacer",RNHostView:"SwiftUIHostView",
      Popover:compound("Popover",["Trigger","Content"]),
    },
    "@expo/ui/swift-ui/modifiers":modifier,
    "@expo/ui/jetpack-compose":{
      Text:"ComposeText",Slider:"ComposeSlider",TextField:"TextField",HorizontalDivider:"HorizontalDivider",
      ExposedDropdownMenu:"ExposedDropdownMenu",ExposedDropdownMenuBox:"ExposedDropdownMenuBox",
      DropdownMenu:compound("DropdownMenu",["Trigger","Items"]),
      DropdownMenuItem:compound("DropdownMenuItem",["Text"]),
      SplitButtonLayout:compound("SplitButtonLayout",["LeadingButton","TrailingButton"]),
      SplitButtonLeadingButton:"SplitButtonLeadingButton",SplitButtonTrailingButton:"SplitButtonTrailingButton",
      Box:"Box",RNHostView:"ComposeHostView",TooltipBox:compound("TooltipBox",["PlainTooltip"]),
    },
    "@expo/ui/jetpack-compose/modifiers":modifier,
    "@nyc-tron/ui/components/Select":{Select:"Select"},
    "@nyc-tron/ui/components/shell/UnitInput":{UnitInput:"UnitInput"},
    "@nyc-tron/ui/components/shell/SliderField":{SliderField:"SliderField"},
    "@nyc-tron/ui/components/overlays/AnchoredPopover":{AnchoredPopover:"AnchoredPopover"},
    "@nyc-tron/ui/components/overlays/useTriggerAnchor":{useTriggerAnchor:()=>({
      ref:{current:null},measured:true,anchor:{x:20,y:20,width:120,height:44},
    })},
  };
  const cache=new Map();
  function load(path){
    if(cache.has(path))return cache.get(path);
    const exports={};
    cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{
      compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},
    }).outputText;
    runInNewContext(code,{exports,require:name=>{
      if(name in mocks)return mocks[name];
      if(name.startsWith("@nyc-tron/ui/components/"))return load(resolve(ui,name.slice("@nyc-tron/ui/components/".length)+".ts"));
      return load(resolve(dirname(path),name));
    }},{filename:path});
    return exports;
  }
  const name=file.split(".")[0],Component=load(resolve(components,file))[name];
  return {render:props=>{cursor=0;return Component(props);}};
}
const children=node=>[node?.props?.children].flat(Infinity).filter(value=>value&&typeof value==="object");
function find(tree,predicate){
  if(!tree||typeof tree!=="object")return undefined;
  if(predicate(tree))return tree;
  if(typeof tree.type==="function")return find(tree.type(tree.props),predicate);
  for(const child of children(tree)){const found=find(child,predicate);if(found)return found;}
}
const noop=()=>{};
const dropdown={label:"Appearance",value:"system",onValueChange:noop,options:[{value:"system",label:"System"}]};
const slider={label:"Opacity",value:25,min:0,max:100,step:1,onCommit:noop};
const split={label:"Save",onPress:noop,actions:[{id:"copy",title:"Save a copy"}],onAction:noop};
const popover={open:true,onOpenChange:noop,accessibilityLabel:"Settings",children:"Content",
  anchor:{x:20,y:20,width:120,height:44},usableRegions:[{x:0,y:0,width:900,height:700}]};
const tooltip={label:"Save changes",children:{type:"Pressable",props:{accessibilityHint:"Keyboard shortcut"}}};

test("Host-backed controls leave appearance to the platform unless the app supplies it",()=>{
  for(const os of ["ios","android"]){
    const cases=[
      ["NativeDropdown.native.tsx",dropdown],["NativeSliderField.native.tsx",slider],
      ["NativeSplitButton.native.tsx",split],["NativePopover.native.tsx",popover],
      ["NativePopover.native.tsx",{...popover,anchor:undefined,trigger:{type:"Pressable",props:{}}}],
      ...(os==="android"?[["Tooltip.native.tsx",tooltip]]:[]),
    ];
    for(const [file,props] of cases){
      const h=harness(file,os);
      let previousKey;
      for(const colorScheme of [undefined,"dark","light",undefined]){
        const host=find(h.render({...props,colorScheme}),node=>node.type==="Host");
        assert.ok(host,`${os} ${file} owns a Host`);
        assert.equal(host.props.colorScheme,colorScheme,`${os} ${file}: explicit scheme reaches native host`);
        assert.equal(host.key,previousKey??host.key,"changing appearance does not introduce a remount key");
        previousKey=host.key;
      }
    }
  }
});

test("flat web dropdown forwards explicit appearance without leaking it onto the RN wrapper",()=>{
  const h=harness("NativeDropdown.tsx","web");
  for(const colorScheme of [undefined,"dark","light"]){
    const tree=h.render({...dropdown,colorScheme});
    assert.equal(tree.props.colorScheme,undefined);
    assert.equal(find(tree,node=>node.type==="Host").props.colorScheme,colorScheme);
  }
  const grouped=h.render({...dropdown,options:undefined,colorScheme:"dark",
    groups:[{heading:"Choices",options:dropdown.options}]});
  assert.equal(grouped.type,"Select");
  assert.equal(grouped.props.colorScheme,undefined,"token-styled fallback keeps app CSS ownership");
});

test("theme changes preserve an in-progress slider preview and its commit callback",()=>{
  for(const os of ["ios","android"]){
    const commits=[],h=harness("NativeSliderField.native.tsx",os);
    const props={...slider,onCommit:value=>commits.push(value)};
    const sliderType=os==="ios"?"SwiftUISlider":"ComposeSlider";
    find(h.render(props),node=>node.type===sliderType).props.onValueChange(42);
    const changed=find(h.render({...props,colorScheme:"dark"}),node=>node.type===sliderType);
    assert.equal(changed.props.value,42);
    if(os==="ios")changed.props.onEditingChanged(false);else changed.props.onValueChangeFinished();
    assert.deepEqual(commits,[42]);
  }
});

test("iOS slider labels are native Text content for the Expo SwiftUI slot",()=>{
  const control=find(harness("NativeSliderField.native.tsx","ios").render(slider),node=>node.type==="SwiftUISlider");
  // Expo 58 places this ReactNode directly inside SlotView. A plain string
  // produces the React Native 'Text strings must be rendered' runtime error.
  assert.equal(control.props.label.type,"SwiftUIText");
  assert.equal(control.props.label.props.children,slider.label);
});

test("theme changes retain an expanded Android split-button menu",()=>{
  const h=harness("NativeSplitButton.native.tsx","android");
  find(h.render(split),node=>node.type==="SplitButtonTrailingButton").props.onCheckedChange(true);
  const host=find(h.render({...split,colorScheme:"dark"}),node=>node.type==="Host");
  assert.equal(host.props.colorScheme,"dark");
  assert.equal(find(host,node=>node.type==="SplitButtonTrailingButton").props.checked,true);
});

test("token web fallbacks consume native appearance props and retain their authored content",()=>{
  for(const [file,props,type] of [["NativeSliderField.web.tsx",slider,"SliderField"],["NativePopover.web.tsx",popover,"AnchoredPopover"]]){
    const tree=harness(file,"web").render({...props,colorScheme:"dark"});
    assert.equal(tree.type,type);
    assert.equal(Object.hasOwn(tree.props,"colorScheme"),false);
    assert.equal(tree.props.label??tree.props.accessibilityLabel,props.label??props.accessibilityLabel);
  }
});

test("iOS tooltip remains an accessibility hint without creating a themed native surface",()=>{
  const tree=harness("Tooltip.native.tsx","ios").render({...tooltip,colorScheme:"dark"});
  assert.equal(find(tree,node=>node.type==="Host"),undefined);
  assert.equal(find(tree,node=>node.type==="Pressable").props.accessibilityHint,"Keyboard shortcut. Save changes");
});
