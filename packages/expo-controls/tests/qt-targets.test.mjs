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
const leaves=["NativeDropdown","Select","NativeActionMenu","NativePopover","NativeSliderField","NativeSplitButton","ContextMenu","FindReplacePopover"];

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
function harness(os){
  const frames=new Map(),hosts=new Map(),cache=new Map(),imports=new Set(),focus=[];
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
    PanResponder:{create:handlers=>({panHandlers:handlers})},
    StyleSheet:{create:styles=>styles,hairlineWidth:1},
    useWindowDimensions:()=>({width:900,height:700,scale:1,fontScale:1}),
  };
  const mocks={
    react:{
      useRef:value=>{const [slots,index]=slot();return slots[index]??=( {current:value} );},
      useEffect:effect,useLayoutEffect:effect,
      useMemo:(fn,deps)=>{const [slots,index]=slot(),before=slots[index];if(!before||!deps||deps.some((dep,i)=>!Object.is(dep,before.deps[i])))slots[index]={deps,value:fn()};return slots[index].value;},
      useId:()=>{const [slots,index]=slot();return slots[index]??="control-"+frames.size+"-"+index;},
      cloneElement:(child,props)=>({...child,props:{...child.props,...props}}),
    },
    "react/jsx-runtime":{jsx:element,jsxs:element,Fragment:"Fragment"},
    "react-native":new Proxy(rn,{get:(object,key)=>{assert.ok(key in object,`Missing RN target API: ${String(key)}`);return object[key];}}),
    "zustand/vanilla":{createStore:init=>{let state=init();return {getState:()=>state,setState:next=>{state={...state,...(typeof next==="function"?next(state):next)};}};}},
    zustand:{useStore:(store,selector)=>selector(store.getState())},
  };
  function load(path){
    if(cache.has(path))return cache.get(path);
    const exports={};cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
    runInNewContext(code,{exports,AbortController,setTimeout,clearTimeout,require:name=>{
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
    if(!host){host={focus:()=>focus.push(path),measureInWindow:callback=>callback(40,60,220,44)};hosts.set(path,host);}
    if(typeof node.props.ref==="function")node.props.ref(host);else if(node.props.ref)node.props.ref.current=host;
    return {...node,props:{...node.props,children:node.type==="Modal"&&!node.props.visible?null:expand(node.props.children,path+"/children")}};
  }
  return {
    imports,focus,
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
  test(`${os}: every shared leaf and root import with Expo absent; Tooltip fails only when rendered`,()=>{
    const h=harness(os);
    const root=h.leaf(".");
    assert.deepEqual(Object.keys(root),["NativeDropdown"]);
    for(const name of leaves)assert.equal(typeof h.leaf(name)[name],"function",name);
    assert.equal(typeof h.leaf("menu-model").normalizeMenuActions,"function");
    const tooltip=h.leaf("Tooltip").Tooltip;
    assert.equal(typeof tooltip,"function");
    assert.throws(()=>tooltip({label:"Help",children:{}}),/no QNX\/Marathon implementation/);
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

  test(`${os}: action menu dispatches enabled leaves once and restores its trigger`,()=>{
    const h=harness(os),actions=[],NativeActionMenu=h.leaf("NativeActionMenu").NativeActionMenu;
    const props={trigger:"Actions",accessibilityLabel:"Document actions",actions:[{id:"open",title:"Open"},{id:"locked",title:"Locked",disabled:true}],onAction:id=>actions.push(id)};
    let tree=h.render(NativeActionMenu,props);
    find(tree,node=>node.props.accessibilityLabel==="Document actions"&&node.type==="Pressable").props.onPress();
    tree=h.render(NativeActionMenu,props);
    find(tree,node=>node.type==="Modal").props.onShow();
    find(tree,node=>node.props.accessibilityLabel==="Locked").props.onPress();
    assert.deepEqual(actions,[]);
    const item=find(tree,node=>node.props.accessibilityLabel==="Open");
    item.props.onPress();item.props.onPress();
    assert.deepEqual(actions,["open"]);
    h.render(NativeActionMenu,props);
    assert.equal(h.focus.length,2,"first item and then the trigger receive focus");
  });

  test(`${os}: popover and context menu use shared Modal dismissal and actions`,()=>{
    const h=harness(os),closed=[],NativePopover=h.leaf("NativePopover").NativePopover;
    const tree=h.render(NativePopover,{...popover,onOpenChange:value=>closed.push(value)});
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
    const search=harness(os),closed=[],FindReplacePopover=search.leaf("FindReplacePopover").FindReplacePopover;
    const content=search.render(FindReplacePopover,{...popover,onOpenChange:open=>closed.push(open),document:{id:"document",revision:1},onFind:noop,onReplace:noop,onNavigate:noop});
    assert.ok(find(content,node=>node.type==="TextInput"&&node.props.accessibilityLabel==="Find text"));
    find(content,node=>node.type==="Pressable"&&node.props.accessibilityLabel==="Close find and replace").props.onPress();
    assert.deepEqual(closed,[false]);
  });
}
