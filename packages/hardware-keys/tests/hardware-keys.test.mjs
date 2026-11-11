// Contracts for @nyc-tron/hardware-keys.
//
// The hook finds the native module by name. If the name drifts, a platform
// drops out of autolinking, or the Swift side picks up ExpoUI again (#36),
// nothing fails at build time: keys silently never arrive. The source checks
// fail first. Hook and source behavior run the real TypeScript with mocked
// react / react-native / expo boundaries; that is not a device test.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {dirname,join,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import {NATIVE_MODULE_NAME,toChord} from "../src/payload.ts";
import {createBindingRegistry} from "../src/binding-registry.ts";
import {webKeySource,isEditableElement} from "../src/web-source.ts";
import {createKeyboardMap} from "../../ui/src/components/shell/keyboard-map.ts";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(join(root,path),"utf8");
const kotlinDir="android/src/main/java/com/nyctron/hardwarekeys";
const config=JSON.parse(read("expo-module.config.json"));

test("SwiftPM package is shipped and preserves the pod's platform and module identity",()=>{
  const pod=read("ios/NYCTronHardwareKeys.podspec"), spm=read("Package.swift");
  const floor=pod.match(/ios: '([^']+)'/)[1];
  const module=pod.match(/s\.name\s*=\s*'([^']+)'/)[1];
  assert.ok(spm.includes(`.iOS("${floor}")`));
  assert.ok(spm.includes(`name: "${module}"`));
  assert.ok(JSON.parse(read("package.json")).files.includes("Package.swift"));
  assert.match(spm,/path: "ios"/);
});

test("expo-module.config.json autolinks both platforms; android stays off the legacy list",()=>{
  assert.deepEqual(config.platforms,["apple","android"]);
  assert.deepEqual(config.apple?.modules,["NYCTronHardwareKeysModule"]);
  assert.equal(config.android?.modules,undefined);
});

test("apple: v2 module under the shared name, key commands on the root controller, no ExpoUI",()=>{
  const swift=read("ios/NYCTronHardwareKeysModule.swift");
  assert.match(swift,new RegExp(`@ExpoModule\\("${NATIVE_MODULE_NAME}"\\)\\s*\\npublic final class NYCTronHardwareKeysModule: Module`));
  assert.match(swift,/@Event\("chord"\)\s*\n\s*var onChord: \(KeyChordRecord\) -> Void/);
  for(const fn of ["isSupported","setBindings","setRecording"])assert.match(swift,new RegExp(`@JS[\\s\\S]*?func ${fn}\\(`));
  const router=read("ios/HardwareKeyRouter.swift");
  assert.match(router,/root\.addKeyCommand/);
  assert.match(router,/becomeFirstResponder\(\)/);
  assert.match(read("ios/Extensions/UIViewController+hardwareKeyCommand.swift"),/@objc\s*\n\s*func nyctronHardwareKeyCommand\(_ sender: UIKeyCommand\)/);
  assert.match(read("ios/HardwareKeyCaptureView.swift"),/override func pressesBegan/);
  assert.match(read("ios/NYCTronHardwareKeys.podspec"),/s\.dependency 'ExpoModulesCore'/);
  const swiftFiles=[...readdirSync(join(root,"ios")).filter(f=>f.endsWith(".swift")).map(f=>"ios/"+f),
    ...readdirSync(join(root,"ios/Extensions")).map(f=>"ios/Extensions/"+f)];
  for(const f of swiftFiles)assert.doesNotMatch(read(f),/import ExpoUI/,`${f} imports ExpoUI`);
  assert.doesNotMatch(read("ios/NYCTronHardwareKeys.podspec"),/s\.dependency 'ExpoUI'/);
});

test("android: v2 module compiled by the v2 plugin, unhandled-key listeners on every window",()=>{
  assert.match(read("android/build.gradle"),/expoModule\s*\{[^}]*\bv2 true\b/);
  const kotlin=read(`${kotlinDir}/NYCTronHardwareKeysModule.kt`);
  assert.match(kotlin,new RegExp(`@ExpoModule\\("${NATIVE_MODULE_NAME}"\\)\\s*\\nclass NYCTronHardwareKeysModule : Module\\(\\)`));
  assert.match(kotlin,/@Event\("chord"\)\s*\n\s*val onChord = event<KeyChordRecord>\(\)/);
  for(const fn of ["isSupported","setBindings","setRecording"])assert.match(kotlin,new RegExp(`@JS\\s*\\n\\s*fun ${fn}\\(`));
  const attacher=read(`${kotlinDir}/UnhandledKeyAttacher.kt`);
  assert.match(attacher,/addOnUnhandledKeyEventListener/);
  assert.match(attacher,/WindowInspector\.getGlobalWindowViews\(\)/);
  assert.match(attacher,/addOnWindowFocusChangeListener/);
});

test("both platforms' records carry the fields JS reads and sends",()=>{
  const chordFields=["key","ctrlKey","metaKey","altKey","shiftKey","isRepeat","recording"];
  const bindingFields=["binding","key","mod","ctrl","alt","shift","title","overridesSystem"];
  const swiftChord=read("ios/KeyChordRecord.swift"),kotlinChord=read(`${kotlinDir}/KeyChordRecord.kt`);
  const swiftBinding=read("ios/KeyBindingRecord.swift"),kotlinBinding=read(`${kotlinDir}/KeyBindingRecord.kt`);
  for(const f of chordFields){
    assert.match(swiftChord,new RegExp(`var ${f}:`));assert.match(kotlinChord,new RegExp(`val ${f}:`));
  }
  for(const f of bindingFields){
    assert.match(swiftBinding,new RegExp(`var ${f}:`));assert.match(kotlinBinding,new RegExp(`val ${f}:`));
  }
  // Same named keys on both sides as shortcut-model accepts.
  for(const name of ["Enter","Escape","Tab","Space","Backspace","Delete","Home","End","PageUp","PageDown","ArrowUp","ArrowLeft","Insert"]){
    assert.match(read("ios/Extensions/UIKeyboardHIDUsage+keyName.swift"),new RegExp(`"${name}"`));
    assert.match(read(`${kotlinDir}/KitKeyName.kt`),new RegExp(`"${name}"`));
  }
});

test("payloads that are not chords are dropped",()=>{
  assert.equal(toChord(null),undefined);
  assert.equal(toChord({key:""}),undefined);
  assert.deepEqual(toChord({key:"S",metaKey:true,shiftKey:true,recording:true}),
    {key:"S",ctrlKey:false,metaKey:true,altKey:false,shiftKey:true,isRepeat:false,recording:true});
});

test("the registry pushes the union of every hook's bindings, first title wins, removal is idempotent",()=>{
  const pushes=[];
  const registry=createBindingRegistry(list=>pushes.push(list.map(b=>b.binding+":"+b.title)));
  const a=registry.register([{binding:"Mod+S",title:"Save"},{binding:"Mod+O",title:"Open"}]);
  const b=registry.register([{binding:"Mod+S",title:"Save copy"},{binding:"F1",title:"Help"}]);
  assert.deepEqual(pushes.at(-1),["Mod+S:Save","Mod+O:Open","F1:Help"]);
  a.remove();
  assert.deepEqual(pushes.at(-1),["Mod+S:Save copy","F1:Help"]);
  a.remove();
  assert.equal(pushes.length,3);
  b.remove();
  assert.deepEqual(pushes.at(-1),[]);
});

function fakeDocument(active){
  const listeners=new Set();
  const doc={activeElement:active,capture:undefined,addEventListener:(_t,l,c)=>{doc.capture=c;listeners.add(l);},removeEventListener:(_t,l)=>listeners.delete(l),
    fire(init){const e={ctrlKey:false,metaKey:false,altKey:false,shiftKey:false,repeat:false,defaultPrevented:false,prevented:false,
      preventDefault(){this.prevented=true;},...init};for(const l of [...listeners])l(e);return e;},listeners};
  return doc;
}

test("web source: handled keys prevent default, already-handled and IME keys are skipped",()=>{
  const doc=fakeDocument(null);
  globalThis.document=doc;
  try{
    const seen=[];
    const sub=webKeySource.addChordListener(c=>{seen.push(c.key);return c.key==="s";});
    assert.equal(doc.fire({key:"s",ctrlKey:true}).prevented,true);
    assert.equal(doc.fire({key:"x"}).prevented,false);
    doc.fire({key:"y",defaultPrevented:true});
    doc.fire({key:"z",isComposing:true});
    doc.fire({key:"m",target:{closest:sel=>sel==='[aria-modal="true"]'?{}:null}});
    assert.deepEqual(seen,["s","x"],"handled, composing and modal-dialog keys are skipped");
    assert.equal(doc.capture,true,"listens in the capture phase");
    sub.remove();
    assert.equal(doc.listeners.size,0);
  }finally{delete globalThis.document;}
  assert.ok(isEditableElement({tagName:"input",getAttribute:()=>"search"}));
  assert.ok(!isEditableElement({tagName:"INPUT",getAttribute:()=>"checkbox"}));
  assert.ok(isEditableElement({tagName:"DIV",isContentEditable:true}));
  assert.ok(!isEditableElement(null));
});

// Loads a source file with mocked module boundaries.
function load(file,mocks){
  const cache=new Map();
  const run=path=>{
    if(cache.has(path))return cache.get(path);
    const exports={};
    cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,
      target:ts.ScriptTarget.ES2022,verbatimModuleSyntax:false}}).outputText;
    runInNewContext(code,{exports,globalThis:mocks.globalThis??globalThis,Promise,Symbol,Map,
      require:name=>mocks[name]??run(resolve(dirname(path),name))},{filename:path});
    return exports;
  };
  return run(join(root,file));
}

test("useKeySource registers the map's native bindings and dispatches resolved chords",()=>{
  const effects=[];
  const layouts=[],refs=[];
  let cursor=0;
  const {useKeySource}=load("src/useHardwareKeyboard.ts",{react:{
    useRef:v=>refs[cursor++]??(refs[cursor-1]={current:v}),
    useLayoutEffect:fn=>layouts.push(fn),useEffect:fn=>effects.push(fn),
  }});
  let layoutCleanup;
  const render=(source,options)=>{cursor=0;useKeySource(source,options);};
  const commit=()=>{layoutCleanup?.();layoutCleanup=layouts.pop()();};
  const map=createKeyboardMap([{id:"save",label:"Save",binding:"Mod+S"},{id:"brush",label:"Brush",binding:"B"}],false);
  let listener,registered,removed=0,typing=false;
  const source={addChordListener:l=>{listener=l;return {remove:()=>removed++};},
    registerBindings:list=>{registered=list.map(b=>b.binding);return {remove:()=>removed++};},isTextInputFocused:()=>typing};
  const ran=[];
  render(source,{map,onCommand:e=>ran.push(e.id)});
  commit();
  const cleanup=effects.pop()();
  assert.deepEqual(registered,["Mod+S","B"]);
  assert.equal(listener({key:"s",ctrlKey:true}),true);
  typing=true;
  assert.equal(listener({key:"b"}),false,"typing into a field never runs a bare-letter tool");
  assert.deepEqual(ran,["save"]);
  typing=false;
  render(source,{map,onCommand:e=>ran.push("updated:"+e.id)});
  assert.equal(listener({key:"s",ctrlKey:true}),true);
  assert.deepEqual(ran,["save","save"],"uncommitted render does not replace the callback");
  commit();
  assert.equal(listener({key:"s",ctrlKey:true}),true);
  assert.equal(ran.at(-1),"updated:save","existing subscription uses the committed callback");
  render(source,{map,enabled:false,onCommand:()=>assert.fail("disabled callback")});
  commit();
  assert.equal(listener({key:"s",ctrlKey:true}),false,"disabled commit blocks the old listener before passive cleanup");
  render(source,{map,onCommand:()=>assert.fail("unmounted callback")});
  commit();
  layoutCleanup();
  assert.equal(listener({key:"s",ctrlKey:true}),false,"layout cleanup blocks late chords");
  cleanup();
  assert.equal(removed,2);
  render(undefined,{map,onCommand:()=>{}});
  commit();
  assert.equal(effects.pop()(),undefined,"no module linked: no subscription, no throw");
});

test("native source: v2 global first, recording chords go to the recorder only, setRecording is reference-counted",async()=>{
  const calls=[];
  const listeners=new Set();
  const emit=payload=>[...listeners].forEach(l=>l(payload));
  const native={isSupported:()=>true,setBindings:l=>{calls.push(["bindings",l.length]);},setRecording:a=>{calls.push(["recording",a]);},
    addListener:(_n,l)=>{listeners.add(l);return {remove(){listeners.delete(l);}};}};
  const fakeGlobal={expoV2:{modules:{[NATIVE_MODULE_NAME]:native}}};
  const src=load("src/native-source.ts",{globalThis:fakeGlobal,expo:{requireOptionalNativeModule:()=>null},
    "react-native":{TextInput:{State:{currentlyFocusedInput:()=>null}}}});
  assert.equal(src.isHardwareKeysAvailable(),true);
  const recorder=src.getHardwareKeyRecorder();
  const got=[];
  const a=recorder.startRecording(c=>got.push(c.key));
  const b=recorder.startRecording(()=>{});
  emit({key:"K",metaKey:true,recording:true});
  emit({key:"J",metaKey:true,recording:false});
  assert.deepEqual(got,["K"]);
  a.remove();b.remove();b.remove();
  await Promise.resolve();
  assert.deepEqual(calls.filter(c=>c[0]==="recording"),[["recording",true],["recording",false]]);
  const source=src.nativeKeySource();
  assert.equal(src.nativeKeySource(),source,"one source per runtime so effects do not resubscribe");
  const dispatched=[];
  source.addChordListener(c=>{dispatched.push(c.key);return true;});
  emit({key:"S",ctrlKey:true,recording:false});
  emit({key:"S",ctrlKey:true,recording:true});
  assert.deepEqual(dispatched,["S"]);
  const none=load("src/native-source.ts",{globalThis:{},expo:{requireOptionalNativeModule:()=>null},"react-native":{TextInput:{}}});
  assert.equal(none.isHardwareKeysAvailable(),false);
  assert.equal(none.getHardwareKeyRecorder(),undefined);
  assert.equal(none.nativeKeySource(),undefined);
});
