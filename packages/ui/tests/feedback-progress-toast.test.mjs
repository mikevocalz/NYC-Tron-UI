import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  assertProgressRange, blockFills, clampInt, createSystemFlag, isIndeterminate, litCount, percentLabel,
  progressA11y, progressFraction, quantize,
} from "../src/components/feedback/progress-model.ts";
import {
  DEFAULT_TOAST_DURATION, MIN_ACTION_TOAST_DURATION, createToastStore, resolveToastDuration, resolveToastLive,
  snackbarDuration,
} from "../src/components/feedback/toast-model.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/feedback/"+p,import.meta.url),"utf8").replace(/\r\n/g,"\n");

// ---------- progress-model (cases ported from NYC-MON progress-model.test.ts) ----------

test("progressFraction clamps into 0..1 over min..max",()=>{
  assert.equal(progressFraction(50,0,100),0.5);
  assert.equal(progressFraction(150,0,100),1);
  assert.equal(progressFraction(-5,0,100),0);
  assert.equal(progressFraction(undefined),0);
  assert.equal(progressFraction(15,10,20),0.5);
  assert.equal(progressFraction(-1,-2,0),0.5);
});

test("invalid ranges and values throw RangeError instead of reading as 0",()=>{
  assert.throws(()=>progressFraction(5,0,0),RangeError,"max <= min");
  assert.throws(()=>progressFraction(5,10,0),RangeError);
  assert.throws(()=>progressFraction(5,0,Number.POSITIVE_INFINITY),RangeError);
  assert.throws(()=>progressFraction(5,Number.NaN,10),RangeError);
  assert.throws(()=>progressFraction(Number.NaN,0,100),RangeError);
  assert.throws(()=>progressFraction(Number.POSITIVE_INFINITY,0,100),RangeError);
  assert.throws(()=>assertProgressRange(1,1),RangeError);
  assert.doesNotThrow(()=>assertProgressRange(0,1));
});

test("no value or the flag means indeterminate",()=>{
  assert.equal(isIndeterminate(undefined),true);
  assert.equal(isIndeterminate(40,true),true);
  assert.equal(isIndeterminate(40),false);
  assert.equal(isIndeterminate(0,false),false);
});

test("progressA11y: determinate reports min/max/now/text; indeterminate drops now and sets busy",()=>{
  const on=progressA11y({value:30,max:60,label:"Upload"});
  assert.deepEqual(on.accessibilityValue,{min:0,max:60,now:30,text:"50%"});
  assert.deepEqual(on.accessibilityState,{busy:false});
  assert.equal(on.accessibilityLabel,"Upload");
  assert.equal(on.fraction,0.5);
  const busy=progressA11y({indeterminate:true,value:20});
  assert.equal("now" in busy.accessibilityValue,false);
  assert.equal(busy.accessibilityState.busy,true);
  assert.equal(busy.accessibilityValue.text,"Loading");
  assert.equal(progressA11y({}).busy,true,"no value is indeterminate");
  assert.equal(progressA11y({busyText:"Preparing export"}).accessibilityValue.text,"Preparing export");
  assert.equal(progressA11y({value:500,max:100}).accessibilityValue.now,100,"clamped");
  assert.equal(progressA11y({value:1/3,max:1}).accessibilityValue.now,0.33);
  assert.throws(()=>progressA11y({value:1,max:-4}),RangeError);
});

test("valueText formats the spoken value with the clamped value and range",()=>{
  const seen=[];
  const out=progressA11y({value:9,min:0,max:8,valueText:(v,ctx)=>{seen.push(ctx);return `${v} of ${ctx.max} stops`;}});
  assert.equal(out.accessibilityValue.text,"8 of 8 stops");
  assert.deepEqual(seen,[{min:0,max:8,fraction:1}]);
  const busy=progressA11y({valueText:()=>{throw new Error("not called while busy");}});
  assert.equal(busy.accessibilityValue.text,"Loading");
});

test("litCount: started shows one, nearly done never shows all",()=>{
  assert.equal(litCount(0,10),0);
  assert.equal(litCount(0.01,10),1);
  assert.equal(litCount(0.55,10),5);
  assert.equal(litCount(0.999,10),9);
  assert.equal(litCount(1,10),10);
  assert.equal(litCount(0.5,0),0);
});

test("blockFills builds from the start edge with one partial block",()=>{
  assert.deepEqual(blockFills(0.5,4),[1,1,0,0]);
  const partial=blockFills(0.6,4);
  assert.deepEqual(partial.slice(0,2),[1,1]);
  assert.ok(Math.abs(partial[2]-0.4)<1e-9);
  assert.equal(partial[3],0);
  assert.deepEqual(blockFills(2,3),[1,1,1]);
});

test("quantize, clampInt and percentLabel",()=>{
  assert.equal(quantize(0.49,4),0.25);
  assert.equal(quantize(0.5,4),0.5);
  assert.equal(quantize(1,4),1);
  assert.equal(clampInt(20,2,8,5),8);
  assert.equal(clampInt(undefined,2,8,5),5);
  assert.equal(percentLabel(0.456),"46%");
  assert.equal(percentLabel(2),"100%");
});

test("createSystemFlag reads and listens only while subscribed",async()=>{
  let removed=0,receive;
  const flag=createSystemFlag(()=>Promise.resolve(true),r=>{receive=r;return {remove:()=>{removed++;}};});
  assert.equal(flag.get(),false);
  let calls=0;
  const off=flag.subscribe(()=>calls++);
  await Promise.resolve();await Promise.resolve();
  assert.equal(flag.get(),true);
  receive(false);
  assert.equal(flag.get(),false);
  receive(false);
  assert.equal(calls,2,"repeat values do not notify");
  off();
  assert.equal(removed,1);
  const sync=createSystemFlag(()=>true,()=>undefined);
  sync.subscribe(()=>{});
  assert.equal(sync.get(),true);
  const broken=createSystemFlag(()=>{throw new Error("unsupported");},()=>{throw new Error("unsupported");});
  assert.doesNotThrow(()=>broken.subscribe(()=>{}));
  assert.equal(broken.get(),false);
});

// ---------- toast-model ----------

function fakeClock(){
  let now=0,next=1;const timers=new Map();
  return {
    scheduler:{now:()=>now,set:(run,ms)=>{const id=next++;timers.set(id,{run,at:now+ms});return id;},clear:id=>{timers.delete(id);}},
    advance(ms){
      const end=now+ms;
      for(;;){
        const due=[...timers.entries()].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];
        if(!due)break;
        timers.delete(due[0]);now=due[1].at;due[1].run();
      }
      now=end;
    },
    get pending(){return timers.size;},
  };
}
const ids=store=>store.getSnapshot().visible.map(t=>t.id);
const noop=()=>{};

test("durations: default, action floor, sticky action and danger, invalid values",()=>{
  assert.equal(resolveToastDuration({}),DEFAULT_TOAST_DURATION);
  assert.equal(resolveToastDuration({},8000),8000);
  assert.equal(resolveToastDuration({duration:2000}),2000);
  assert.equal(resolveToastDuration({action:{label:"Undo",onPress:noop}}),Infinity,"an action stays until used or dismissed");
  assert.equal(resolveToastDuration({action:{label:"Undo",onPress:noop},duration:3000}),MIN_ACTION_TOAST_DURATION);
  assert.equal(resolveToastDuration({action:{label:"Undo",onPress:noop},duration:9000}),9000);
  assert.equal(resolveToastDuration({tone:"danger"}),Infinity);
  assert.equal(resolveToastDuration({tone:"danger",duration:7000}),7000);
  assert.equal(resolveToastDuration({duration:Infinity}),Infinity);
  for(const bad of [0,-1,Number.NaN])assert.throws(()=>resolveToastDuration({duration:bad}),RangeError,String(bad));
  assert.ok(MIN_ACTION_TOAST_DURATION>=6000);
});

test("live region: alert for danger unless set, status otherwise",()=>{
  assert.equal(resolveToastLive({}),"status");
  assert.equal(resolveToastLive({tone:"danger"}),"alert");
  assert.equal(resolveToastLive({tone:"danger",live:"status"}),"status");
  assert.equal(resolveToastLive({tone:"success",live:"alert"}),"alert");
});

test("Compose snackbar lengths are never shorter than asked",()=>{
  assert.equal(snackbarDuration(2000),"short");
  assert.equal(snackbarDuration(4000),"short");
  assert.equal(snackbarDuration(5000),"long");
  assert.equal(snackbarDuration(10000),"long");
  assert.equal(snackbarDuration(10001),"indefinite");
  assert.equal(snackbarDuration(Infinity),"indefinite");
});

test("max visible: oldest first, the rest wait and start their timer when shown",()=>{
  const clock=fakeClock();
  const store=createToastStore({maxVisible:2,scheduler:clock.scheduler});
  store.show({id:"a",title:"Saved",duration:1000});
  store.show({id:"b",title:"Copied",duration:3000});
  store.show({id:"c",title:"Moved",duration:1000});
  assert.deepEqual(ids(store),["a","b"]);
  assert.equal(store.getSnapshot().queued,1);
  assert.equal(clock.pending,2,"queued toast has no timer");
  clock.advance(1000);
  assert.deepEqual(ids(store),["b","c"]);
  clock.advance(999);
  assert.deepEqual(ids(store),["b","c"],"c got its full second once shown");
  clock.advance(1);
  assert.deepEqual(ids(store),["b"]);
  clock.advance(1000);
  assert.deepEqual(ids(store),[]);
  assert.equal(clock.pending,0);
});

test("dedupe by id: replaces in place, bumps revision and restarts the timer",()=>{
  const clock=fakeClock();
  const store=createToastStore({scheduler:clock.scheduler});
  store.show({id:"sync",title:"Syncing 1 file",duration:2000});
  store.show({id:"other",title:"Other",duration:10000});
  clock.advance(1500);
  assert.equal(store.show({id:"sync",title:"Syncing 2 files",duration:2000}),"sync");
  const snap=store.getSnapshot();
  assert.deepEqual(ids(store),["sync","other"],"position kept");
  assert.equal(snap.visible[0].title,"Syncing 2 files");
  assert.equal(snap.visible[0].revision,1);
  clock.advance(1500);
  assert.deepEqual(ids(store),["sync","other"],"old timer was cancelled");
  clock.advance(500);
  assert.deepEqual(ids(store),["other"]);
  const generated=store.show({title:"No id"});
  assert.match(generated,/^toast-\d+$/);
  assert.notEqual(store.show({title:"No id"}),generated,"no id means no dedupe");
});

test("pause and resume keep the remaining time; every reason must be released",()=>{
  const clock=fakeClock();
  const store=createToastStore({scheduler:clock.scheduler});
  store.show({id:"a",title:"Saved",duration:4000});
  clock.advance(1000);
  store.pause("hover");
  store.pause("focus");
  assert.equal(store.getSnapshot().paused,true);
  assert.equal(clock.pending,0);
  clock.advance(60000);
  assert.deepEqual(ids(store),["a"]);
  store.resume("hover");
  clock.advance(60000);
  assert.deepEqual(ids(store),["a"],"focus still holds it");
  store.resume("focus");
  assert.equal(store.getSnapshot().paused,false);
  clock.advance(2999);
  assert.deepEqual(ids(store),["a"]);
  clock.advance(1);
  assert.deepEqual(ids(store),[]);
  store.resume("never-held");
  store.pause("x");store.pause("x");store.resume("x");
  assert.equal(store.getSnapshot().paused,false,"a reason is held once");
});

test("toasts shown while paused wait, then run their full time",()=>{
  const clock=fakeClock();
  const store=createToastStore({scheduler:clock.scheduler});
  store.pause("screen-reader");
  store.show({id:"a",title:"Saved",duration:1000});
  clock.advance(5000);
  assert.deepEqual(ids(store),["a"]);
  store.resume("screen-reader");
  clock.advance(1000);
  assert.deepEqual(ids(store),[]);
});

test("sticky toasts never time out; dismiss removes one or all",()=>{
  const clock=fakeClock();
  const store=createToastStore({scheduler:clock.scheduler});
  store.show({id:"undo",title:"Deleted 3 files",action:{label:"Undo",onPress:noop}});
  store.show({id:"err",title:"Couldn't upload",tone:"danger"});
  store.show({id:"ok",title:"Saved"});
  clock.advance(DEFAULT_TOAST_DURATION);
  assert.deepEqual(ids(store),["undo","err"]);
  assert.equal(store.getSnapshot().visible[1].live,"alert");
  assert.equal(store.dismiss("missing"),false);
  assert.equal(store.dismiss("undo"),true);
  assert.deepEqual(ids(store),["err"]);
  assert.equal(store.dismiss(),true);
  assert.deepEqual(ids(store),[]);
  assert.equal(store.dismiss(),false);
  assert.equal(clock.pending,0);
});

test("maxQueued drops the oldest waiting toast, never a visible one",()=>{
  const clock=fakeClock();
  const store=createToastStore({maxVisible:1,maxQueued:2,scheduler:clock.scheduler});
  for(const id of ["a","b","c","d"])store.show({id,title:id,duration:1000});
  assert.deepEqual(ids(store),["a"]);
  assert.equal(store.getSnapshot().queued,2);
  clock.advance(1000);
  assert.deepEqual(ids(store),["c"],"b was dropped");
  clock.advance(1000);
  assert.deepEqual(ids(store),["d"]);
});

test("store validation and change notifications",()=>{
  const clock=fakeClock();
  assert.throws(()=>createToastStore({maxVisible:0}),RangeError);
  assert.throws(()=>createToastStore({maxVisible:1.5}),RangeError);
  assert.throws(()=>createToastStore({maxQueued:-1}),RangeError);
  assert.throws(()=>createToastStore({defaultDuration:0}),RangeError);
  const store=createToastStore({scheduler:clock.scheduler});
  assert.throws(()=>store.show({title:"  "}),TypeError);
  assert.throws(()=>store.show({id:"",title:"x"}),TypeError);
  assert.throws(()=>store.show({title:"x",action:{label:"",onPress:noop}}),TypeError);
  assert.throws(()=>store.show({title:"x",duration:-5}),RangeError);
  let calls=0;
  const off=store.subscribe(()=>calls++);
  const before=store.getSnapshot();
  assert.equal(store.getSnapshot(),before,"snapshot is stable between changes");
  store.show({id:"a",title:"A",duration:100});
  assert.notEqual(store.getSnapshot(),before);
  clock.advance(100);
  assert.equal(calls,2);
  off();
  store.show({title:"B"});
  assert.equal(calls,2);
});

// ---------- source contracts ----------

const FORKS=["Spinner","ProgressBar","Toast"];
const valueExports=text=>{
  const names=new Set();
  for(const m of text.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z0-9_]+)/gm))names.add(m[1]);
  for(const m of text.matchAll(/^export\s+\{([^}]*)\}\s+from/gm))
    for(const part of m[1].split(","))if(part.trim())names.add(part.trim().split(/\s+as\s+/).pop());
  return [...names].sort();
};

test("each component has types, web and Expo UI native forks with the same runtime exports",()=>{
  for(const name of FORKS){
    const web=src(`${name}.web.tsx`),native=src(`${name}.native.tsx`);
    src(`${name}.types.ts`);
    assert.deepEqual(valueExports(native),valueExports(web),name);
    assert.ok(valueExports(web).includes(name),name);
    assert.match(native,/from "@expo\/ui"/,`${name}.native imports Host from @expo/ui`);
    assert.match(native,/<Host\b/,name);
    assert.ok(!/from "@expo\/ui/.test(web),`${name}.web stays plain React Native`);
  }
  assert.deepEqual(valueExports(src("Toast.web.tsx")),["Toast","ToastProvider","ToastViewport","createToastStore","useToast"]);
  assert.match(src("Spinner.native.tsx"),/ProgressView[\s\S]*CircularProgressIndicator/);
  assert.match(src("ProgressBar.native.tsx"),/ProgressView[\s\S]*LinearProgressIndicator/);
  assert.match(src("Toast.native.tsx"),/SnackbarHost/);
  assert.match(src("Toast.native.tsx"),/Platform\.OS==="android"\?<SnackbarViewport/,"iOS keeps the kit viewport");
});

test("feedback files use only react, react-native, @expo/ui and local modules",()=>{
  const files=["Spinner.types.ts","Spinner.web.tsx","Spinner.native.tsx","ProgressBar.types.ts","ProgressBar.shared.tsx",
    "ProgressBar.web.tsx","ProgressBar.native.tsx","Toast.types.ts","Toast.shared.tsx","Toast.web.tsx","Toast.native.tsx",
    "progress-model.ts","toast-model.ts"];
  for(const file of files){
    const text=src(file);
    for(const m of text.matchAll(/from\s+"([^"]+)"/g)){
      const spec=m[1];
      assert.ok(spec==="react"||spec==="react-native"||spec.startsWith("@expo/ui")||spec.startsWith("./")||spec.startsWith("../"),`${file}: ${spec}`);
      assert.ok(!spec.includes("forge"),`${file} must not import Forge`);
    }
    assert.ok(!/\b(?:pl|pr)-\d/.test(text),`${file}: use logical ps-/pe-`);
  }
  for(const model of ["progress-model.ts","toast-model.ts"])assert.ok(!/from\s+"react/.test(src(model)),`${model} stays pure`);
  // Block-comment provenance header, unwrapped to one line.
  const header=text=>{const m=text.match(/^\/\*\n([\s\S]*?)\n \*\/\n/);return m?m[1].replace(/^ \* ?/gm,"").replace(/\n/g," "):"";};
  const upstream=/ \(MIT\), mikevocalz\/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907\. Copyright \(c\) 2025 Gursel Cakar, MIT\. Notices: THIRD_PARTY_NOTICES\.md\. Modified for NYC-Tron UI \(2026-11\): \S/;
  for(const [file,source] of [["progress-model.ts","packages/ui/progress/progress-model.ts"],["ProgressBar.shared.tsx","packages/ui/progress/ProgressBar.tsx"],
    ["Toast.shared.tsx","packages/ui/Toast.tsx and packages/ui/ToastCard.tsx"],["toast-model.ts","packages/ui/Toast.tsx and packages/ui/ToastCard.tsx"]]){
    const h=header(src(file));
    assert.ok(h.startsWith("Behaviour adapted from NYC-MON "+source),`${file} names its source`);
    assert.match(h,upstream,`${file} names the upstream commit, copyright and changes`);
  }
});

test("progress semantics: progressbar role, busy state, value, label in words",()=>{
  const spinnerWeb=src("Spinner.web.tsx");
  assert.ok(spinnerWeb.includes('accessibilityRole="progressbar"'));
  assert.ok(spinnerWeb.includes("busy:true"));
  assert.ok(src("Spinner.types.ts").includes('@default "Loading"'));
  assert.match(src("Spinner.native.tsx"),/accessibilityLabel as swiftUILabel[\s\S]*contentDescription:name/);
  const kit=src("ProgressBar.shared.tsx");
  for(const part of ['accessibilityRole="progressbar"',"accessibilityValue={a11y.accessibilityValue}","busy:a11y.busy","bg-surface-sunken",
    "bg-primary","bg-success","bg-danger","flexDirection:\"row\"","Animated.loop","useReducedMotion","isReduceMotionEnabled"])assert.ok(kit.includes(part),part);
  assert.match(src("ProgressBar.types.ts"),/TypeError\("ProgressBar needs a label or accessibilityLabel"\)/);
  assert.match(src("ProgressBar.native.tsx"),/if\(a11y\.busy&&reduced\)return <KitProgressBar/,"native falls back to the still kit bar");
});

test("toast semantics: live regions, 44pt dismiss, external store, safe logical padding",()=>{
  const shared=src("Toast.shared.tsx");
  assert.ok(shared.includes('role="alert" accessibilityLiveRegion="assertive"'));
  assert.ok(shared.includes('role="status" accessibilityLiveRegion="polite"'));
  assert.ok(shared.includes("min-h-11 min-w-11"));
  assert.ok(shared.includes("minWidth:44,minHeight:44"));
  assert.ok(shared.includes("accessibilityLabel={dismissLabel??`Dismiss ${title}`}"));
  assert.ok(shared.includes("useSyncExternalStore")&&shared.includes("createContext"));
  assert.ok(!/useState\b/.test(shared),"the queue is not React state");
  assert.ok(shared.includes('store.pause("hover")')&&shared.includes('store.pause("focus")'));
  assert.ok(shared.includes('store.pause("screen-reader")'));
  assert.ok(shared.includes("paddingStart:16+")&&shared.includes("paddingEnd:16+"));
  assert.ok(shared.includes("announceForAccessibilityWithOptions"));
  assert.ok(shared.includes('data.key==="Escape"'));
  assert.ok(shared.includes("if(reduced){shown.setValue(1);return;}"),"no entrance motion with reduce motion on");
  assert.match(src("Toast.native.tsx"),/store\.pause\("snackbar"\)/,"Compose owns timing on Android");
});

test("package exports the feedback subpaths with web and native conditions (added by the lead)",()=>{
  for(const name of FORKS){
    const entry=pkg.exports[`./components/feedback/${name}`];
    assert.ok(entry,`./components/feedback/${name}`);
    assert.match(entry["react-native"],/\.native\.js$/,name);
    assert.match(entry.browser,/\.web\.js$/,name);
  }
});
