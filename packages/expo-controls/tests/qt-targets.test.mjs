import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const packageRoot=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const uiRoot=resolve(packageRoot,"../ui");
const manifest=JSON.parse(readFileSync(resolve(packageRoot,"package.json"),"utf8"));
const uiManifest=JSON.parse(readFileSync(resolve(uiRoot,"package.json"),"utf8"));
const leaves=["NativeDropdown","Select","NativeActionMenu","NativePopover","NativeSliderField","NativeSplitButton","ContextMenu","FindReplacePopover","Tooltip"];

function sourcePath(root,target){
  const base=resolve(root,target.replace(/^\.\/dist\//,"src/").replace(/\.js$/,""));
  const path=[base+".tsx",base+".ts"].find(existsSync);
  assert.ok(path,`Missing emitted source for ${target}`);
  return path;
}

test("installed Qt root and every subpath win over the generic native condition",()=>{
  const consumer=mkdtempSync(resolve(tmpdir(),"tron-qt-consumer-"));
  try {
    const scope=resolve(consumer,"node_modules/@nyc-tron");
    mkdirSync(scope,{recursive:true});
    symlinkSync(packageRoot,resolve(scope,"expo-controls"),"dir");
    const assertTarget=(url,target)=>{
      // Before a build Node preserves the package symlink for a missing dist
      // file; after a build it returns that file's real path.
      const actual=fileURLToPath(url);
      assert.ok([resolve(packageRoot,target),resolve(scope,"expo-controls",target)].includes(actual),`${actual} resolves ${target}`);
    };
    const subpaths=Object.keys(manifest.exports);
    const script=`const paths=${JSON.stringify(subpaths)};
      const resolved=paths.map(path=>import.meta.resolve('@nyc-tron/expo-controls'+(path==='.'?'':path.slice(1))));
      console.log(JSON.stringify(resolved));`;
    for(const condition of ["qnx","marathon"]){
      const selected=JSON.parse(execFileSync(process.execPath,[`--conditions=${condition}`,"--conditions=react-native","--input-type=module","-e",script],{cwd:consumer,encoding:"utf8"}));
      subpaths.forEach((key,index)=>{
        const target=manifest.exports[key][condition];
        assert.ok(target,`${condition} ${key} has an explicit route`);
        assertTarget(selected[index],target);
        sourcePath(packageRoot,target);
      });
    }
    const mobile=JSON.parse(execFileSync(process.execPath,["--conditions=react-native","--input-type=module","-e",script],{cwd:consumer,encoding:"utf8"}));
    subpaths.forEach((key,index)=>assertTarget(mobile[index],manifest.exports[key]["react-native"]));
    const fallback=JSON.parse(execFileSync(process.execPath,["--input-type=module","-e",script],{cwd:consumer,encoding:"utf8"}));
    assertTarget(fallback[0],manifest.exports["."].qnx);
    assert.equal(manifest.main,manifest.exports["."].default);
  } finally {rmSync(consumer,{recursive:true,force:true});}
});

// Run the real source graph with a small RN host surface and no Expo, DOM,
// native menu module, GPU library or gesture-handler installed. The harness
// models refs/effect cleanup so controlled callbacks can be exercised. This
// is JavaScript behavior evidence, not a Qt renderer or device acceptance run.
function harness(os,{deferMeasurement=false,accessibilityInfo={}}={}){
  const frames=new Map(),hosts=new Map(),cache=new Map(),imports=new Set(),focus=[];
  const timers=new Map(),measurements=[],stores=[];
  const dimensions={width:900,height:700,scale:1,fontScale:1};
  const bounds={x:40,y:60,width:220,height:44};
  let nextTimer=0;
  const setTimer=(callback,delay)=>{const id=++nextTimer;timers.set(id,{callback,delay});return id;};
  let frame=null,effects=[],visited=new Set();
  const slot=()=>{const index=frame.cursor++;return [frame.slots,index];};
  const effect=(fn,deps)=>{
    const [slots,index]=slot(),before=slots[index];
    if(deps&&before?.deps&&deps.length===before.deps.length&&deps.every((dep,i)=>Object.is(dep,before.deps[i])))return;
    const next={deps,cleanup:undefined};slots[index]=next;
    effects.push(()=>{before?.cleanup?.();next.cleanup=fn();});
  };
  const element=(type,props,key)=>({type,props,key});
  const rn={
    View:"View",Text:"Text",TextInput:"TextInput",Pressable:"Pressable",ScrollView:"ScrollView",Modal:"Modal",Switch:"Switch",ActivityIndicator:"ActivityIndicator",
    Platform:{OS:os,select:values=>values[os]??values.native??values.default},
    // Upstream RN's documented fallback when the target has no native manager.
    I18nManager:{isRTL:false},
    AccessibilityInfo:accessibilityInfo,
    PanResponder:{create:handlers=>({panHandlers:handlers})},
    StyleSheet:{create:styles=>styles,hairlineWidth:1},
    useWindowDimensions:()=>dimensions,
  };
  const mocks={
    react:{
      createContext:value=>({Provider:"ContextProvider",value}),
      use:context=>context.value,
      useRef:value=>{const [slots,index]=slot();return slots[index]??=( {current:value} );},
      useEffect:effect,useLayoutEffect:effect,
      useMemo:(fn,deps)=>{const [slots,index]=slot(),before=slots[index];if(!before||!deps||deps.some((dep,i)=>!Object.is(dep,before.deps[i])))slots[index]={deps,value:fn()};return slots[index].value;},
      useId:()=>{const [slots,index]=slot();return slots[index]??="control-"+frames.size+"-"+index;},
      cloneElement:(child,props)=>({...child,props:{...child.props,...props}}),
    },
    "react/jsx-runtime":{jsx:element,jsxs:element,Fragment:"Fragment"},
    "react-native":new Proxy(rn,{get:(object,key)=>{assert.ok(key in object,`Missing RN target API: ${String(key)}`);return object[key];}}),
    "zustand/vanilla":{createStore:init=>{let state=init();const store={getState:()=>state,setState:next=>{state={...state,...(typeof next==="function"?next(state):next)};}};stores.push(store);return store;}},
    zustand:{useStore:(store,selector)=>selector(store.getState())},
  };
  function load(path){
    if(cache.has(path))return cache.get(path);
    const exports={};cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
    runInNewContext(code,{exports,AbortController,setTimeout:setTimer,clearTimeout:id=>timers.delete(id),require:name=>{
      imports.add(name);
      if(name in mocks)return mocks[name];
      if(name.startsWith("@nyc-tron/ui/")){
        const entry=uiManifest.exports["./"+name.slice("@nyc-tron/ui/".length)];
        assert.ok(entry,`Missing public UI export ${name}`);
        return load(sourcePath(uiRoot,typeof entry==="string"?entry:entry[os]??entry["react-native"]??entry.default));
      }
      assert.ok(name.startsWith("."),`Unexpected optional dependency ${name}`);
      return load(resolve(dirname(path),name));
    }},{filename:path});
    return exports;
  }
  function expand(node,path="root"){
    if(Array.isArray(node))return node.map((child,index)=>expand(child,path+"/"+(child?.key??index)));
    if(!node||typeof node!=="object"||!node.props)return node;
    if(typeof node.type==="function"){
      const previous=frame;
      frame=frames.get(path)??{slots:[],cursor:0};frames.set(path,frame);frame.cursor=0;visited.add(path);
      let result;
      try {result=node.type(node.props);} finally {frame=previous;}
      return expand(result,path+"/render");
    }
    let host=hosts.get(path);
    if(!host){host={focus:()=>focus.push(path),measureInWindow:callback=>{
      if(deferMeasurement)measurements.push(callback);else callback(bounds.x,bounds.y,bounds.width,bounds.height);
    }};hosts.set(path,host);}
    if(typeof node.props.ref==="function")node.props.ref(host);else if(node.props.ref)node.props.ref.current=host;
    return {...node,props:{...node.props,children:node.type==="Modal"&&!node.props.visible?null:expand(node.props.children,path+"/children")}};
  }
  return {
    imports,focus,timers,measurements,dimensions,bounds,stores,
    ui:relative=>load(resolve(uiRoot,"src",relative)),
    runTimers(){const pending=[...timers.entries()];timers.clear();for(const [,timer] of pending)timer.callback();},
    unmount(){for(const current of frames.values())current.slots.forEach(value=>value?.cleanup?.());frames.clear();hosts.clear();},
    leaf:name=>load(sourcePath(packageRoot,manifest.exports[name==="."?".":"./"+name][os])),
    render(Component,props){
      effects=[];visited=new Set();
      const tree=expand(element(Component,props));
      for(const [path,current] of frames)if(!visited.has(path)){current.slots.forEach(value=>value?.cleanup?.());frames.delete(path);}
      for(const run of effects)run();
      return tree;
    },
  };
}
function find(node,predicate){
  if(Array.isArray(node)){for(const child of node){const found=find(child,predicate);if(found)return found;}return;}
  if(!node||typeof node!=="object"||!node.props)return;
  if(predicate(node))return node;
  return find(node.props.children,predicate);
}
const noop=()=>{};
const popover={open:true,onOpenChange:noop,accessibilityLabel:"Settings",children:"Settings body",anchor:{x:40,y:60,width:220,height:44},usableRegions:[{x:0,y:0,width:900,height:700}]};

for(const os of ["qnx","marathon"]){
  test(`${os}: every shared leaf and root import with Expo absent`,()=>{
    const h=harness(os);
    const root=h.leaf(".");
    assert.deepEqual(Object.keys(root),["NativeDropdown"]);
    for(const name of leaves)assert.equal(typeof h.leaf(name)[name],"function",name);
    assert.equal(typeof h.leaf("menu-model").normalizeMenuActions,"function");
    const tooltip=h.leaf("Tooltip").Tooltip;
    assert.ok(h.render(tooltip,{label:"Help",children:{type:"Pressable",props:{}}}));
    assert.equal([...h.imports].some(name=>/^(@expo\/|expo(?:\/|$))/.test(name)),false);
    assert.equal(manifest.peerDependenciesMeta.expo.optional,true);
    assert.equal(manifest.peerDependenciesMeta["@expo/ui"].optional,true);
  });

  test(`${os}: grouped dropdown keeps app caption styling, controlled values and disabled choices`,()=>{
    const h=harness(os),changes=[],NativeDropdown=h.leaf("NativeDropdown").NativeDropdown;
    const props={label:"Workspace",labelClassName:"app-caption",value:"a",groups:[{heading:"Saved",options:[{value:"a",label:"Alpha"},{value:"b",label:"Beta"}]}],onValueChange:value=>changes.push(value),testID:"workspace",colorScheme:"dark",appearance:"menu"};
    let tree=h.render(NativeDropdown,props);
    assert.match(find(tree,node=>node.type==="Text"&&node.props.children==="Workspace").props.className,/app-caption/);
    assert.equal(tree.props.colorScheme,undefined);
    assert.equal(tree.props.appearance,undefined);
    find(tree,node=>node.props.testID==="workspace").props.onPress();
    tree=h.render(NativeDropdown,props);
    const list=find(tree,node=>node.props.testID==="workspace-list");
    assert.equal(list.props.role,"list","native RN accepts list with option children, not the web-only listbox role");
    assert.equal(list.props.accessible,true,"Qt exposes the named list container without flattening its options");
    assert.ok(find(tree,node=>node.type==="Text"&&node.props.children==="Saved"));
    find(tree,node=>node.props.role==="option"&&find(node,text=>text.props.children==="Beta")).props.onPress();
    assert.deepEqual(changes,["b"]);
    tree=h.render(NativeDropdown,{...props,value:"b"});
    assert.equal(find(tree,node=>node.props.testID==="workspace").props.accessibilityLabel,"Workspace, Beta");
    tree=h.render(NativeDropdown,{...props,disabled:true});
    find(tree,node=>node.props.testID==="workspace").props.onPress();
    tree=h.render(NativeDropdown,{...props,disabled:true});
    assert.equal(find(tree,node=>node.props.role==="option"),undefined);
    assert.throws(()=>h.render(NativeDropdown,{...props,value:"missing"}),/Selected value/);
  });

  test(`${os}: select keyboard skips disabled choices, commits once and dismisses`,()=>{
    const h=harness(os),changes=[],Select=h.leaf("Select").Select;
    const props={label:"Workspace",value:"a",options:[{value:"a",label:"Alpha"},{value:"locked",label:"Locked",disabled:true},{value:"b",label:"Beta"}],onValueChange:value=>changes.push(value),testID:"select"};
    let tree=h.render(Select,props);
    const key=value=>({nativeEvent:{key:value}});
    let trigger=find(tree,node=>node.props.testID==="select");
    trigger.props.onKeyDown(key("ArrowDown"));
    trigger.props.onKeyDown(key("ArrowDown"));
    trigger.props.onKeyDown(key("Enter"));
    assert.deepEqual(changes,["b"],"queued keys use the current store, skipping the locked option");
    trigger.props.onPress({nativeEvent:{type:"keyup"}});
    tree=h.render(Select,{...props,value:"b"});
    assert.equal(find(tree,node=>node.props.role==="option"),undefined,"the keyup press does not reopen it");
    trigger=find(tree,node=>node.props.testID==="select");
    trigger.props.onKeyDown(key("ArrowDown"));
    tree=h.render(Select,{...props,value:"b"});
    assert.equal(find(tree,node=>node.props.testID==="select-list").props.role,"list");
    const option=find(tree,node=>node.props.role==="option"&&!node.props.disabled);
    assert.equal(option.props.focusable,false,"pointer options keep keyboard focus on the trigger");
    let stopped=0;
    find(tree,node=>node.props.testID==="select").props.onKeyDown({...key("Escape"),stopPropagation:()=>stopped++});
    assert.equal(stopped,1);
    tree=h.render(Select,{...props,value:"b"});
    assert.equal(find(tree,node=>node.props.role==="option"),undefined);
    assert.deepEqual(changes,["b"]);
  });

  test(`${os}: tooltip delays, preserves anchor handlers/hint and clamps native bounds`,()=>{
    const h=harness(os),Tooltip=h.leaf("Tooltip").Tooltip,press=()=>{};
    h.bounds.x=850;h.bounds.y=650;h.bounds.width=40;h.bounds.height=30;
    const props={label:"Writes the document",delayMs:120,testID:"help",children:{type:"Pressable",props:{onPress:press,accessibilityHint:"Existing hint"}}};
    let tree=h.render(Tooltip,props);
    const child=find(tree,node=>node.type==="Pressable");
    assert.equal(child.props.onPress,press);
    assert.equal(child.props.accessibilityHint,"Existing hint. Writes the document");
    tree.props.onPointerEnter({nativeEvent:{pointerType:"mouse"}});
    assert.equal(h.timers.size,1);assert.equal([...h.timers.values()][0].delay,120);
    assert.equal(find(tree,node=>node.props.testID==="help"),undefined);
    h.runTimers();tree=h.render(Tooltip,props);
    let tip=find(tree,node=>node.props.testID==="help");
    assert.equal(tip.props.pointerEvents,"none");
    assert.equal(tip.props.style.opacity,0,"native layout is measured before making the bubble visible");
    tip.props.onLayout({nativeEvent:{layout:{width:200,height:60}}});
    tree=h.render(Tooltip,props);tip=find(tree,node=>node.props.testID==="help");
    assert.equal(tip.props.style.left,-158);assert.equal(tip.props.style.top,-64);
    assert.equal(tip.props.style.opacity,1);
    const oldLayout=tip.props.onLayout;
    tree.props.onFocus();tree.props.onPointerLeave();
    assert.ok(find(h.render(Tooltip,props),node=>node.props.testID==="help"),"keyboard focus keeps the hint visible when pointer leaves");
    tree.props.onKeyDown({nativeEvent:{key:"Escape"}});
    tree=h.render(Tooltip,props);
    assert.equal(find(tree,node=>node.props.testID==="help"),undefined);
    tree.props.onFocus();assert.equal(h.timers.size,0,"Escape suppresses until the input leaves");
    tree.props.onBlur();tree.props.onFocus();assert.equal(h.timers.size,1);
    h.runTimers();tree=h.render(Tooltip,props);oldLayout({nativeEvent:{layout:{width:10,height:10}}});
    assert.equal(find(h.render(Tooltip,props),node=>node.props.testID==="help").props.style.opacity,0,"old rendered layout cannot size a reopened tooltip");
    tree.props.onBlur();tree.props.onFocus();
    h.unmount();assert.equal(h.timers.size,0,"unmount cancels delayed work");
  });

  test(`${os}: tooltip rejects stale measurement and cancels touch, resize and disabled work`,()=>{
    const h=harness(os,{deferMeasurement:true}),Tooltip=h.leaf("Tooltip").Tooltip;
    const props={label:"Help",children:{type:"Pressable",props:{}}};
    let tree=h.render(Tooltip,props);
    tree.props.onTouchStart();h.runTimers();assert.equal(h.measurements.length,1);
    tree.props.onTouchMove();h.measurements.shift()(10,20,50,40);
    tree=h.render(Tooltip,props);assert.equal(find(tree,node=>node.props.role==="tooltip"),undefined);
    tree.props.onTouchEnd();tree.props.onFocus();
    tree=h.render(Tooltip,{...props,disabled:true});assert.equal(h.timers.size,0);
    tree.props.onFocus();assert.equal(h.timers.size,0);
    assert.equal(find(tree,node=>node.type==="Pressable").props.accessibilityHint,undefined);
    tree=h.render(Tooltip,props);tree.props.onPointerEnter({nativeEvent:{pointerType:"touch"}});assert.equal(h.timers.size,0);
    tree.props.onFocus();h.runTimers();assert.equal(h.measurements.length,1);
    h.dimensions.width=450;h.render(Tooltip,props);h.measurements.shift()(10,20,50,40);
    assert.equal(find(h.render(Tooltip,props),node=>node.props.role==="tooltip"),undefined);
    assert.throws(()=>h.render(Tooltip,{...props,delayMs:NaN}),/delayMs/);
    h.unmount();
  });

  test(`${os}: unavailable Qt preferences preserve initial values while supported signals stay live`,async()=>{
    const listeners=new Map(),removed=[];
    const unavailable=()=>Object.assign(new Error("No Qt provider"),{code:"ERR_QT_ACCESSIBILITY_UNSUPPORTED"});
    const h=harness(os,{accessibilityInfo:{
      isReduceMotionEnabled:()=>Promise.reject(unavailable()),
      isScreenReaderEnabled:()=>Promise.resolve(true),
      isHighTextContrastEnabled:()=>Promise.resolve(true),
      addEventListener:(event,callback)=>{
        if(event==="reduceMotionChanged")throw unavailable();
        listeners.set(event,callback);return {remove:()=>removed.push(event)};
      },
    }});
    const Layer=h.ui("components/shell/FocusAndA11yLayer.tsx").FocusAndA11yLayer;
    h.render(Layer,{initial:{reduceMotion:true},children:"Workspace"});
    await Promise.resolve();
    assert.equal(h.stores[0].getState().reduceMotion,true);
    assert.equal(h.stores[0].getState().screenReader,true);
    assert.equal(h.stores[0].getState().highContrast,true);
    listeners.get("highTextContrastChanged")(false);
    assert.equal(h.stores[0].getState().highContrast,false);
    h.unmount();assert.deepEqual(removed,["screenReaderChanged","highTextContrastChanged"]);
    listeners.get("screenReaderChanged")(false);
    assert.equal(h.stores[0].getState().screenReader,true,"late notifications cannot update the unmounted layer");
    const broken=harness(os,{accessibilityInfo:{addEventListener:()=>{throw new Error("Unexpected transport failure");}}});
    assert.throws(()=>broken.render(broken.ui("components/shell/FocusAndA11yLayer.tsx").FocusAndA11yLayer,{children:null}),/Unexpected transport failure/);
    const partialRemoved=[];
    const partial=harness(os,{accessibilityInfo:{addEventListener:event=>{
      if(event==="screenReaderChanged")throw new Error("Second subscription failed");
      return {remove:()=>partialRemoved.push(event)};
    }}});
    assert.throws(()=>partial.render(partial.ui("components/shell/FocusAndA11yLayer.tsx").FocusAndA11yLayer,{children:null}),/Second subscription failed/);
    assert.deepEqual(partialRemoved,["reduceMotionChanged"],"partial effect setup releases its acquired subscription");
    const failed=harness(os,{accessibilityInfo:{
      isReduceMotionEnabled:()=>Promise.reject(new Error("Unexpected async failure")),
      isHighTextContrastEnabled:()=>Promise.resolve(false),
      addEventListener:()=>({remove:()=>{}}),
    }});
    const FailedLayer=failed.ui("components/shell/FocusAndA11yLayer.tsx").FocusAndA11yLayer;
    failed.render(FailedLayer,{children:null});await Promise.resolve();
    assert.throws(()=>failed.render(FailedLayer,{children:null}),/Unexpected async failure/);
    failed.unmount();
  });

  test(`${os}: Qt announcements request priority without an unsupported queue`,()=>{
    const spoken=[];
    const h=harness(os,{accessibilityInfo:{announceForAccessibilityWithOptions:(text,options)=>spoken.push({text,options})}});
    h.ui("components/forge/announce.ts").announce("Saved");
    assert.equal(spoken.length,1);assert.equal(spoken[0].text,"Saved");
    assert.equal(spoken[0].options.priority,"low");assert.equal("queue" in spoken[0].options,false);
  });

  test(`${os}: shared slider commits one edit and cancels an abandoned drag`,()=>{
    const h=harness(os),commits=[],previews=[],NativeSliderField=h.leaf("NativeSliderField").NativeSliderField;
    const props={label:"Opacity",value:25,min:0,max:100,step:1,onCommit:value=>commits.push(value),onPreview:value=>previews.push(value),defaultValue:100};
    let tree=h.render(NativeSliderField,props);
    const track=find(tree,node=>node.props.accessibilityRole==="adjustable");
    assert.equal(track.props["aria-valuenow"],25);
    track.props.onAccessibilityAction({nativeEvent:{actionName:"increment"}});
    assert.deepEqual(commits,[26]);
    find(tree,node=>node.props.accessibilityLabel==="Reset Opacity").props.onPress();
    assert.deepEqual(commits,[26,100]);
    const event=x=>({nativeEvent:{pageX:x,pageY:60,touches:[{}]}});
    track.props.onPanResponderGrant(event(150));
    track.props.onPanResponderMove(event(205),{numberActiveTouches:1});
    assert.equal(previews.at(-1),75);
    track.props.onPanResponderRelease(event(205));
    track.props.onPanResponderRelease(event(205));
    assert.deepEqual(commits,[26,100,75],"release commits the preview only once");
    track.props.onPanResponderGrant(event(150));
    track.props.onPanResponderMove(event(205),{numberActiveTouches:1});
    track.props.onPanResponderTerminate();
    track.props.onPanResponderRelease(event(205));
    assert.equal(previews.at(-1),25,"cancellation restores the controlled value");
    assert.deepEqual(commits,[26,100,75]);
    tree=h.render(NativeSliderField,{...props,disabled:true});
    find(tree,node=>node.props.accessibilityRole==="adjustable").props.onAccessibilityAction({nativeEvent:{actionName:"increment"}});
    assert.deepEqual(commits,[26,100,75]);
  });

  test(`${os}: slider keyboard steps and bounds share the commit contract`,()=>{
    const h=harness(os),commits=[],Slider=h.leaf("NativeSliderField").NativeSliderField;
    const tree=h.render(Slider,{label:"Opacity",value:25,min:0,max:100,step:1,onCommit:value=>commits.push(value)});
    const track=find(tree,node=>node.props.accessibilityRole==="adjustable");
    for(const nativeEvent of [{key:"ArrowRight"},{key:"ArrowRight",shiftKey:true},{key:"Home"},{key:"End"},{key:"ArrowRight",ctrlKey:true}])track.props.onKeyDown({nativeEvent});
    assert.deepEqual(commits,[26,35,0,100]);
  });

  test(`${os}: action menu dispatches enabled leaves once and restores its trigger`,()=>{
    const h=harness(os),actions=[],NativeActionMenu=h.leaf("NativeActionMenu").NativeActionMenu;
    const props={trigger:"Actions",accessibilityLabel:"Document actions",actions:[{id:"open",title:"Open",checked:true},{id:"locked",title:"Locked",disabled:true}],onAction:id=>actions.push(id)};
    let tree=h.render(NativeActionMenu,props);
    find(tree,node=>node.props.accessibilityLabel==="Document actions"&&node.type==="Pressable").props.onPress();
    tree=h.render(NativeActionMenu,props);
    find(tree,node=>node.type==="Modal").props.onShow();
    find(tree,node=>node.props.accessibilityLabel==="Locked").props.onPress();
    assert.deepEqual(actions,[]);
    const item=find(tree,node=>node.props.accessibilityLabel==="Open");
    assert.equal(item.props.role,"menuitem","native RN does not accept the web-only menuitemcheckbox role");
    assert.equal(item.props.accessibilityState.checked,true,"the supported native menu item keeps its checked state");
    item.props.onKeyDown({nativeEvent:{key:"Enter"}});item.props.onPress();
    assert.deepEqual(actions,["open"]);
    h.render(NativeActionMenu,props);
    assert.equal(h.focus.length,2,"first item and then the trigger receive focus");
  });

  test(`${os}: menus navigate and activate from keys without duplicate action dispatch`,()=>{
    const h=harness(os),selected=[],ContextMenu=h.leaf("ContextMenu").ContextMenu;
    const props={accessibilityLabel:"Layer",children:"Layer",actions:[{id:"duplicate",title:"Duplicate"},{id:"delete",title:"Delete"}],onAction:id=>selected.push(id)};
    let tree=h.render(ContextMenu,props);
    find(tree,node=>typeof node.props.onLongPress==="function").props.onKeyDown({nativeEvent:{key:"F10",shiftKey:true}});
    tree=h.render(ContextMenu,props);
    find(tree,node=>node.type==="Modal").props.onShow();
    const first=find(tree,node=>node.props.accessibilityRole==="menuitem");
    first.props.onKeyDown({nativeEvent:{key:"ArrowDown"}});
    assert.equal(h.focus.length,2,"initial focus and ArrowDown reach real ref targets");
    first.props.onKeyDown({nativeEvent:{key:" "}});first.props.onPress();
    assert.deepEqual(selected,["duplicate"]);
    tree=h.render(ContextMenu,props);
    assert.equal(find(tree,node=>node.type==="Modal"),undefined);
    assert.equal(h.focus.length,3,"closing returns focus to the context target");
    find(tree,node=>typeof node.props.onLongPress==="function").props.onKeyDown({nativeEvent:{key:"ContextMenu"}});
    tree=h.render(ContextMenu,props);
    find(tree,node=>node.props.accessibilityRole==="menuitem").props.onKeyDown({nativeEvent:{key:"Escape"}});
    assert.equal(find(h.render(ContextMenu,props),node=>node.type==="Modal"),undefined);
    assert.deepEqual(selected,["duplicate"]);
  });

  test(`${os}: popover and context menu use shared Modal dismissal and actions`,()=>{
    const h=harness(os),closed=[],NativePopover=h.leaf("NativePopover").NativePopover;
    const tree=h.render(NativePopover,{...popover,onOpenChange:value=>closed.push(value)});
    const surface=find(tree,node=>node.props.role==="dialog");
    let prevented=0;
    surface.props.onKeyDown({nativeEvent:{key:"Tab"},preventDefault:()=>prevented++});
    assert.equal(prevented,0,"native Tab traversal is never replaced with DOM queries");
    surface.props.onKeyDown({nativeEvent:{key:"Escape"}});
    assert.deepEqual(closed,[false]);
    closed.length=0;
    find(tree,node=>node.type==="Modal").props.onRequestClose();
    assert.deepEqual(closed,[false]);
    const menu=harness(os),selected=[],ContextMenu=menu.leaf("ContextMenu").ContextMenu;
    const props={accessibilityLabel:"Layer",children:"Layer",actions:[{id:"duplicate",title:"Duplicate"},{id:"locked",title:"Locked",disabled:true}],onAction:id=>selected.push(id)};
    let context=menu.render(ContextMenu,props);
    find(context,node=>typeof node.props.onLongPress==="function").props.onLongPress({nativeEvent:{pageX:70,pageY:90}});
    context=menu.render(ContextMenu,props);
    assert.ok(find(context,node=>node.type==="Modal"));
    const action=find(context,node=>node.props.accessibilityRole==="menuitem");
    action.props.onPress();
    assert.deepEqual(selected,["duplicate"]);
    assert.equal(find(menu.render(ContextMenu,props),node=>node.type==="Modal"),undefined);
  });

  test(`${os}: split-button actions and find/replace content render without a mobile provider`,()=>{
    const h=harness(os),pressed=[],NativeSplitButton=h.leaf("NativeSplitButton").NativeSplitButton;
    const tree=h.render(NativeSplitButton,{label:"Save",onPress:()=>pressed.push("save"),actions:[{id:"copy",title:"Save a copy"}],onAction:id=>pressed.push(id)});
    find(tree,node=>node.type==="Pressable"&&node.props.accessibilityLabel==="Save").props.onPress();
    assert.deepEqual(pressed,["save"]);
    assert.ok(find(tree,node=>node.type==="Pressable"&&node.props.accessibilityLabel==="More Save options"));
    find(tree,node=>node.type==="Pressable"&&node.props.accessibilityLabel==="More Save options").props.onKeyDown({nativeEvent:{key:"ArrowDown"}});
    const expanded=h.render(NativeSplitButton,{label:"Save",onPress:()=>pressed.push("save"),actions:[{id:"copy",title:"Save a copy"}],onAction:id=>pressed.push(id)});
    find(expanded,node=>node.type==="Modal").props.onShow();
    const action=find(expanded,node=>node.props.accessibilityRole==="menuitem");
    action.props.onKeyDown({nativeEvent:{key:"Enter"}});action.props.onPress();
    assert.deepEqual(pressed,["save","copy"]);
    h.render(NativeSplitButton,{label:"Save",onPress:noop,actions:[{id:"copy",title:"Save a copy"}],onAction:noop});
    assert.equal(h.focus.length,2,"menu focus returns to the split button's menu half");
    const search=harness(os),closed=[],FindReplacePopover=search.leaf("FindReplacePopover").FindReplacePopover;
    const content=search.render(FindReplacePopover,{...popover,onOpenChange:open=>closed.push(open),document:{id:"document",revision:1},onFind:noop,onReplace:noop,onNavigate:noop});
    assert.ok(find(content,node=>node.type==="TextInput"&&node.props.accessibilityLabel==="Find text"));
    find(content,node=>node.type==="Pressable"&&node.props.accessibilityLabel==="Close find and replace").props.onPress();
    assert.deepEqual(closed,[false]);
  });
}
