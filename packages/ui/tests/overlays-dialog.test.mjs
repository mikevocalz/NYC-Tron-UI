import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  canDismiss, dialogMaxWidth, DIALOG_MAX_WIDTH, dialogFramePadding, dialogAnimation, alertInitialFocus,
  alertAction, prefersSystemAlert, composeDialogProperties, TABBABLE_SELECTOR,
} from "../src/components/overlays/dialog-model.ts";
import { createPortalStore } from "../src/components/overlays/portal-store.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/overlays/"+p,import.meta.url),"utf8").replace(/\r\n/g,"\n");
/** The block-comment header of a ported file, unwrapped to one line ("" when there is none). */
const header=text=>{const m=text.match(/^\/\*\n([\s\S]*?)\n \*\/\n/);return m?m[1].replace(/^ \* ?/gm,"").replace(/\n/g," "):"";};
const PROVENANCE=/^Behaviour adapted from NYC-MON packages\/ui\/\S+.* \(MIT\), mikevocalz\/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907\. Copyright \(c\) 2025 Gursel Cakar, MIT\. Notices: THIRD_PARTY_NOTICES\.md\. Modified for NYC-Tron UI \(2026-11\): \S/;

test("close requests: busy blocks everything, actions always close, the rest follow dismissible",()=>{
  for(const reason of ["backdrop","escape","back","action"]){
    assert.equal(canDismiss(reason,{busy:true}),false,reason);
    assert.equal(canDismiss(reason,{busy:true,dismissible:true,closeOnBackdrop:true}),false,reason);
  }
  assert.equal(canDismiss("action",{dismissible:false}),true);
  for(const reason of ["backdrop","escape","back"])assert.equal(canDismiss(reason),true,reason);
  for(const reason of ["backdrop","escape","back"])assert.equal(canDismiss(reason,{dismissible:false}),false,reason);
  // closeOnBackdrop defaults to dismissible and never overrides it.
  assert.equal(canDismiss("backdrop",{dismissible:true,closeOnBackdrop:false}),false);
  assert.equal(canDismiss("escape",{dismissible:true,closeOnBackdrop:false}),true);
  assert.equal(canDismiss("backdrop",{dismissible:false,closeOnBackdrop:true}),false);
  assert.equal(canDismiss("bogus"),false);
});

test("size scale and frame padding validate their input",()=>{
  assert.deepEqual({...DIALOG_MAX_WIDTH},{sm:400,md:560,lg:720});
  assert.ok(Object.isFrozen(DIALOG_MAX_WIDTH));
  assert.equal(dialogMaxWidth("sm"),400);
  for(const bad of ["xl","toString","",undefined,3])assert.throws(()=>dialogMaxWidth(bad),RangeError,String(bad));
  assert.deepEqual(dialogFramePadding(),{paddingTop:24,paddingBottom:24,paddingLeft:24,paddingRight:24});
  assert.deepEqual(dialogFramePadding({top:59,bottom:34},16),{paddingTop:75,paddingBottom:50,paddingLeft:16,paddingRight:16});
  assert.deepEqual(dialogFramePadding({left:0},0).paddingLeft,0);
  assert.throws(()=>dialogFramePadding({top:-1}),RangeError);
  assert.throws(()=>dialogFramePadding({top:Number.NaN}),RangeError);
  assert.throws(()=>dialogFramePadding({},-4),RangeError);
  assert.throws(()=>dialogFramePadding({},Infinity),RangeError);
});

test("motion: reduce motion and web never fade",()=>{
  assert.equal(dialogAnimation("ios",false),"fade");
  assert.equal(dialogAnimation("android",false),"fade");
  assert.equal(dialogAnimation("ios",true),"none");
  assert.equal(dialogAnimation("web",false),"none");
});

test("alert dialogs: danger starts on Cancel, busy freezes, Cancel always closes",()=>{
  assert.equal(alertInitialFocus("danger"),"cancel");
  assert.equal(alertInitialFocus("default"),"confirm");
  assert.deepEqual(alertAction("confirm"),{call:"confirm",close:true});
  assert.deepEqual(alertAction("confirm",{closeOnConfirm:false}),{call:"confirm",close:false});
  assert.deepEqual(alertAction("cancel",{closeOnConfirm:false}),{call:"cancel",close:true});
  assert.deepEqual(alertAction("confirm",{busy:true}),{call:null,close:false});
  assert.deepEqual(alertAction("cancel",{busy:true}),{call:null,close:false});
});

test("system alert only where it can express the dialog",()=>{
  assert.equal(prefersSystemAlert("android",{hasChildren:false}),true);
  assert.equal(prefersSystemAlert("android",{hasChildren:false,closeOnConfirm:false}),true);
  assert.equal(prefersSystemAlert("ios",{hasChildren:false}),true);
  assert.equal(prefersSystemAlert("ios",{hasChildren:false,closeOnConfirm:false}),false,"SwiftUI closes on every press");
  assert.equal(prefersSystemAlert("ios",{hasChildren:false,busy:true}),false,"a busy SwiftUI alert could not come back while open stays true");
  assert.equal(prefersSystemAlert("ios",{hasChildren:false,busy:false}),true);
  assert.equal(prefersSystemAlert("android",{hasChildren:false,busy:true}),true,"Compose disables its buttons while busy");
  for(const os of ["ios","android"])assert.equal(prefersSystemAlert(os,{hasChildren:true}),false,os);
  for(const os of ["web","windows","macos","qnx"])assert.equal(prefersSystemAlert(os,{hasChildren:false}),false,os);
  assert.deepEqual(composeDialogProperties({}),{dismissOnBackPress:true,dismissOnClickOutside:true});
  assert.deepEqual(composeDialogProperties({closeOnBackdrop:false}),{dismissOnBackPress:true,dismissOnClickOutside:false});
  assert.deepEqual(composeDialogProperties({dismissible:false}),{dismissOnBackPress:false,dismissOnClickOutside:false});
  assert.deepEqual(composeDialogProperties({busy:true}),{dismissOnBackPress:false,dismissOnClickOutside:false});
  assert.ok(TABBABLE_SELECTOR.includes('[tabindex]:not([tabindex="-1"])'));
});

test("portal store keeps first-insertion order and stable snapshots",()=>{
  const store=createPortalStore();
  let calls=0;
  const off=store.subscribe(()=>calls++);
  assert.equal(store.entries("root"),store.entries("root"),"empty snapshot is stable");
  assert.deepEqual(store.entries("root"),[]);
  store.set("root","a","A1");
  store.set("root","b","B1");
  store.set("root","c","C1");
  const before=store.entries("root");
  assert.equal(store.entries("root"),before,"same array until a change");
  assert.deepEqual(before.map(e=>e.key),["a","b","c"]);
  store.set("root","a","A2");
  const after=store.entries("root");
  assert.notEqual(after,before);
  assert.deepEqual(after.map(e=>[e.key,e.node]),[["a","A2"],["b","B1"],["c","C1"]],"update keeps its place");
  const n=calls;
  store.set("root","a","A2");
  assert.equal(calls,n,"same content does not notify");
  assert.equal(store.entries("root"),after);
  store.remove("root","b");
  assert.deepEqual(store.entries("root").map(e=>e.key),["a","c"]);
  store.remove("root","b");
  store.remove("nowhere","x");
  assert.equal(calls,n+1,"removing a missing entry does not notify");
  store.set("toasts","t","T");
  assert.deepEqual(store.entries("root").map(e=>e.key),["a","c"],"hosts are separate");
  store.remove("root","a");store.remove("root","c");
  assert.deepEqual(store.entries("root"),[]);
  off();
  store.set("root","z","Z");
  assert.equal(calls,n+4,"unsubscribed listener stops");
  assert.throws(()=>store.set("","k","x"),RangeError);
  assert.throws(()=>store.set("root","","x"),RangeError);
});

test("portal hosts: newest host of a name is active, the previous takes over",()=>{
  const store=createPortalStore();
  assert.equal(store.hasHost("root"),false);
  const first=store.hostToken("root");
  assert.equal(store.hasHost("root"),true);
  assert.equal(store.isActiveHost("root",first.token),true);
  const mine=Symbol("screen");
  const second=store.hostToken("root",mine);
  assert.equal(second.token,mine);
  assert.equal(store.isActiveHost("root",first.token),false);
  assert.equal(store.isActiveHost("root",mine),true);
  second.unregister();
  second.unregister();
  assert.equal(store.isActiveHost("root",first.token),true);
  // StrictMode re-runs effects: register, unregister, register the same token.
  first.unregister();
  assert.equal(store.hasHost("root"),false);
  const again=store.hostToken("root",first.token);
  store.hostToken("root",first.token);
  assert.equal(store.isActiveHost("root",first.token),true,"a token is listed once");
  again.unregister();
  assert.equal(store.hasHost("root"),false);
  const off=store.registerHost("toasts");
  assert.equal(store.hasHost("toasts"),true);
  off();
  assert.equal(store.hasHost("toasts"),false);
  assert.throws(()=>store.hostToken(""),RangeError);
});

const valueExports=text=>{
  const names=new Set();
  for(const m of text.matchAll(/^export\s+(?:function|const|class|let)\s+(\w+)/gm))names.add(m[1]);
  for(const m of text.matchAll(/^export\s*\{([^}]*)\}/gm)){
    for(const part of m[1].split(",")){
      const name=part.trim();
      if(!name||name.startsWith("type "))continue;
      names.add(name.split(/\s+as\s+/).pop().trim());
    }
  }
  return [...names].sort();
};

test("Dialog and AlertDialog forks: same runtime names, native forks on @expo/ui",()=>{
  for(const name of ["Dialog","AlertDialog"]){
    const web=src(`${name}.web.tsx`),native=src(`${name}.native.tsx`);
    assert.deepEqual(valueExports(native),valueExports(web),name);
    assert.deepEqual(valueExports(web),[name]);
    assert.ok(native.includes('from "@expo/ui"'),name+" Host");
    assert.ok(native.includes('from "@expo/ui/swift-ui'),name+" SwiftUI");
    assert.ok(native.includes('from "@expo/ui/jetpack-compose"'),name+" Compose");
    assert.ok(!web.includes("@expo/ui"),name+" web fork stays RN-only");
    assert.ok(native.includes(`from "./${name}.web.tsx"`),name+" kit fallback for hosts without Expo UI");
    assert.ok(src(`${name}.types.ts`).includes(`export interface ${name}Props`));
  }
  const dialogNative=src("Dialog.native.tsx");
  assert.ok(dialogNative.includes("BasicAlertDialog")&&dialogNative.includes("BottomSheet"));
  assert.match(dialogNative,/import \{BottomSheet,Host,RNHostView\} from "@expo\/ui";/,"iOS uses the universal BottomSheet");
  assert.ok(!/BottomSheet[^\n]*from "@expo\/ui\/swift-ui"/.test(dialogNative),"not the SwiftUI-only sheet");
  assert.ok(dialogNative.includes("contentPadding={0}"),"the panel's token padding, not the sheet's 16pt inset");
  assert.ok(dialogNative.includes("modifiers={[interactiveDismissDisabled(holdOpen)]}"));
  assert.ok(dialogNative.includes("showDragIndicator={!holdOpen}"));
  assert.ok(dialogNative.includes("interactiveDismissDisabled"),"iOS sheet holds when not dismissible");
  assert.ok(dialogNative.includes("composeDialogProperties"),"Android back/outside follow the rules");
  const alertNative=src("AlertDialog.native.tsx");
  assert.ok(alertNative.includes('role="cancel"'));
  assert.ok(alertNative.includes('"destructive"'));
  assert.ok(alertNative.includes("prefersSystemAlert"));
  assert.ok(alertNative.includes("busy:props.busy"),"busy reaches the system-alert choice");
});

test("kit Dialog source contract: modal semantics, keyboard, focus, tokens",()=>{
  const web=src("Dialog.web.tsx");
  for(const file of ["Dialog.web.tsx","Dialog.native.tsx","Dialog.types.ts","dialog-model.ts",
    "AlertDialog.web.tsx","AlertDialog.native.tsx","AlertDialog.types.ts"]){
    assert.match(header(src(file)),PROVENANCE,file+" provenance names source, upstream commit, copyright and changes");
  }
  assert.match(header(web),/^Behaviour adapted from NYC-MON packages\/ui\/Dialog\.tsx \(MIT\)/);
  for(const needle of ["role={role}","aria-modal","aria-labelledby={titleId}","accessibilityViewIsModal",
    'accessibilityRole="header"',"accessibilityState={{busy}}","onAccessibilityEscape","onRequestClose={onRequestClose}",
    'data.key==="Escape"','data.key!=="Tab"',"cycleFocusIndex(","useRestoreFocus(open)","TABBABLE_SELECTOR",
    "isReduceMotionEnabled","reduceMotionChanged","animationType={animationType}","focusable={false}",
    "maxWidth","bg-surface-raised","border-border","rounded-card","bg-surface-sunken","text-text-muted"]){
    assert.ok(web.includes(needle),needle);
  }
  assert.ok(!/\bp[lr]-\d/.test(web),"logical spacing only");
  for(const file of ["Dialog.web.tsx","Dialog.native.tsx","Dialog.types.ts","AlertDialog.web.tsx","AlertDialog.native.tsx",
    "AlertDialog.types.ts","Portal.tsx","portal-store.ts","dialog-model.ts"]){
    const text=src(file);
    assert.ok(!/from\s+["'](?:@nitro-forge\/|\.\.\/forge\/)/.test(text),file+" imports Forge");
    assert.equal(text.match(/["'`]#[0-9A-Fa-f]{3,8}["'`]/g),null,file+" hardcodes a color");
    assert.ok(!/tailwind-variants|react-native-reanimated|solito|lucide|\.\/tw["']/.test(text),file+" keeps an NYC-MON dependency");
  }
});

test("kit AlertDialog contract: Button actions, danger variant, Cancel focus, busy",()=>{
  const web=src("AlertDialog.web.tsx");
  assert.ok(web.includes('from "../Button.tsx"'));
  assert.ok(web.includes('role="alertdialog"'));
  assert.ok(web.includes('variant={tone==="danger"?"danger":"primary"}'));
  assert.ok(web.includes("loading={busy}")&&web.includes("disabled={busy}"));
  assert.ok(web.includes('cancelLabel="Cancel"'));
  assert.ok(web.includes("closeOnBackdrop=false"),"a stray tap never answers");
  assert.ok(web.includes("alertInitialFocus(tone)"));
  assert.ok(web.includes("new RangeError"),"confirm label is required and must name the action");
});

test("Portal reads its registry through useSyncExternalStore, not useState",()=>{
  const portal=src("Portal.tsx");
  assert.ok(portal.includes("useSyncExternalStore"));
  assert.ok(!portal.includes("useState"));
  assert.ok(portal.includes('name="root"')&&portal.includes('host="root"'));
  assert.ok(portal.includes("present?null:<>{children}</>"),"in-place fallback without a host");
  assert.ok(portal.includes('pointerEvents:"box-none"'));
  assert.ok(!/import[^;]*\bModal\b/.test(portal)&&!portal.includes("<Modal"),"Portal never uses Modal");
  assert.ok(!src("portal-store.ts").includes('from "react'),"store is framework-free");
});

// Expected to fail until the lead adds these entries to package.json.
test("overlay subpaths are exported with web and native forks",()=>{
  for(const sub of ["Dialog","AlertDialog"]){
    const entry=pkg.exports["./components/overlays/"+sub];
    assert.ok(entry,sub);
    assert.match(entry["react-native"],/\.native\.js$/,sub);
    assert.match(entry.browser,/\.web\.js$/,sub);
    assert.match(entry.default,/\.web\.js$/,sub);
    assert.match(entry.types,/\.web\.d\.ts$/,sub);
  }
  assert.ok(pkg.exports["./components/overlays/Portal"],"Portal");
});
