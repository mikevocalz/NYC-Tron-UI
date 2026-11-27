import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { requireCloseLabel, requireSheetTitle, resolveSnapPoints } from "../src/components/overlays/sheet-model.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/overlays/"+p,import.meta.url),"utf8");
const header=text=>{const m=text.match(/^\/\*\n([\s\S]*?)\n \*\/\n/);return m?m[1].replace(/^ \* ?/gm,"").replace(/\n/g," "):"";};
const PROVENANCE=/^Behaviour adapted from NYC-MON packages\/ui\/BottomSheet\.tsx \(MIT\), mikevocalz\/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907\. Copyright \(c\) 2025 Gursel Cakar, MIT\. Notices: THIRD_PARTY_NOTICES\.md\. Modified for NYC-Tron UI \(2026-11\): \S/;

test("snap points: half, full, fractions in (0, 1] and positive heights; empty means content-sized",()=>{
  assert.equal(resolveSnapPoints(undefined),undefined);
  assert.equal(resolveSnapPoints([]),undefined);
  const points=["half",{fraction:0.55},{fraction:1},{height:320},"full"];
  const out=resolveSnapPoints(points);
  assert.deepEqual(out,points);
  assert.notEqual(out,points,"returns a copy");
  for(const bad of [[{fraction:0}],[{fraction:1.2}],[{fraction:Number.NaN}],[{height:0}],[{height:-4}],
    [{height:Infinity}],["third"],[null],[{}],[{fraction:"0.5"}]]){
    assert.throws(()=>resolveSnapPoints(bad),RangeError,JSON.stringify(bad));
  }
  assert.throws(()=>resolveSnapPoints("half"),RangeError,"not an array");
});

test("title and close label are required, trimmed text",()=>{
  assert.equal(requireSheetTitle("  Filters "),"Filters");
  assert.equal(requireCloseLabel(" Close filters"),"Close filters");
  for(const bad of [undefined,""," \n",42]){
    assert.throws(()=>requireSheetTitle(bad),TypeError);
    assert.throws(()=>requireCloseLabel(bad),TypeError);
  }
});

test("Sheet wraps the universal BottomSheet on every platform with token-styled content",()=>{
  const t=src("Sheet.tsx");
  assert.match(t,/import \{BottomSheet,Host,RNHostView,type BottomSheetProps\} from "@expo\/ui";/);
  assert.doesNotMatch(t,/from ["']@expo\/ui\/(?:swift-ui|jetpack-compose)/,"one file for web and native: no native-only module");
  assert.doesNotMatch(t,/vaul/);
  for(const needle of [
    "isPresented={open&&!held}","snapPoints={snaps}","contentPadding={0}","showDragIndicator={dismissible}",
    "shouldDismissOnBackPress={dismissible}","shouldDismissOnClickOutside={dismissible}",
    'containerColor={web?"var(--color-surface-raised)":undefined}',
    '{$type:"interactiveDismissDisabled",isDisabled:true}',"modifiers={ios&&!dismissible?HOLD_OPEN_IOS:undefined}",
    'useWebAriaPatch(root,"dialog",{"aria-label":name},"ancestor")',
    'accessibilityRole="header"',"aria-level={2}",'accessibilityRole="button"',"accessibilityLabel={close}",
    "minWidth:44,minHeight:44","bg-surface-raised","text-text","pe-2 ps-4","focus-visible:ring-focus",
    "motion-reduce:transition-none",'keyboardShouldPersistTaps="handled"',
    "requireSheetTitle(title)","requireCloseLabel(closeLabel)","resolveSnapPoints(snapPoints)",
  ])assert.ok(t.includes(needle),needle);
  assert.match(t,/if\(now\.dismissible\)\{now\.onOpenChange\(false\);return;\}/,"system closes only when dismissible");
  assert.match(t,/onPress=\{\(\)=>latest\.current\.onOpenChange\(false\)\}/,"the close button always closes");
  assert.doesNotMatch(t,/stopPropagation|preventDefault/,"the web drag tracker only listens");
  assert.doesNotMatch(t,/["'`]#[0-9A-Fa-f]{3,8}["'`]/,"no hardcoded color");
  assert.doesNotMatch(t,/\b(pl|pr|ml|mr)-\d/,"logical spacing only");
  assert.doesNotMatch(t,/from\s+["'](?:@nitro-forge\/|\.\.\/forge\/)/,"Forge free");
  assert.doesNotMatch(t,/tailwind-variants|NightScope|district|\.\/tw["']/,"NYC-MON styling dropped");
  for(const f of ["Sheet.tsx","Sheet.types.ts","sheet-model.ts"])assert.match(header(src(f)),PROVENANCE,f+" provenance");
  const types=src("Sheet.types.ts");
  for(const prop of ["open:boolean","onOpenChange:(open:boolean)=>void","title:string","children?:ReactNode",
    "snapPoints?:readonly SheetSnapPoint[]","dismissible?:boolean","closeLabel:string"])assert.ok(types.includes(prop),prop);
});

test("package.json exports Sheet as one file for every platform",()=>{
  const e=pkg.exports["./components/overlays/Sheet"];
  assert.deepEqual(e,{
    types:"./dist/components/overlays/Sheet.d.ts",
    "react-native":"./dist/components/overlays/Sheet.js",
    default:"./dist/components/overlays/Sheet.js",
  });
  assert.ok(!("vaul" in {...pkg.dependencies,...pkg.peerDependencies,...pkg.devDependencies}),"no vaul: the universal web sheet is a <dialog>");
});
