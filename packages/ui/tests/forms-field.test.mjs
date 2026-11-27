import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  autoGrowHeight, counterIsNearLimit, counterState, counterText, defaultCountThreshold, describedBy,
  fieldControlProps, fieldHint, fieldIds, fieldLabelText, resolveRows, rowsHeight, safeId, shouldAnnounceCount,
} from "../src/components/forms/field-model.ts";
import { resolveTextareaConfig } from "../src/components/forms/Textarea.types.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/forms/"+p,import.meta.url),"utf8");
const FILES=["Field.tsx","Textarea.types.ts","Textarea.shared.tsx","Textarea.tsx","Textarea.kit.tsx","Textarea.native.tsx","field-model.ts"];
const TEXTAREAS=["Textarea.tsx","Textarea.native.tsx","Textarea.kit.tsx"];
/** The block-comment header of a ported file, unwrapped to one line ("" when there is none). */
const header=text=>{const m=text.match(/^\/\*\n([\s\S]*?)\n \*\/\n/);return m?m[1].replace(/^ \* ?/gm,"").replace(/\n/g," "):"";};
const PROVENANCE=/^Behaviour adapted from NYC-MON packages\/ui\/\S+.* \(MIT\), mikevocalz\/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907\. Copyright \(c\) 2025 Gursel Cakar, MIT\. Notices: THIRD_PARTY_NOTICES\.md\. Modified for NYC-Tron UI \(2026-11\): \S/;

// ---- ids and describedBy --------------------------------------------------

test("useId values become safe nativeID / DOM id tokens",()=>{
  assert.equal(safeId(":r0:"),"r0");
  assert.equal(safeId("«r1»"),"r1");
  assert.equal(safeId("_r_2_"),"_r_2_");
  assert.equal(safeId(":::"),"field","never an empty id");
});

test("field ids exist only for the text that is shown",()=>{
  assert.deepEqual(fieldIds(":r3:"),{inputId:"r3",labelId:"r3-label"});
  assert.deepEqual(fieldIds("notes",{description:"Max 200",error:"Enter notes"}),{
    inputId:"notes",labelId:"notes-label",descriptionId:"notes-description",errorId:"notes-error",
  });
  assert.equal(fieldIds("n",{description:""}).descriptionId,undefined);
});

test("describedBy joins in order, drops empties and repeats, and omits the attribute when empty",()=>{
  assert.equal(describedBy("a-error",undefined,"a-description",false,null,"a-count"),"a-error a-description a-count");
  assert.equal(describedBy("x y","y","",undefined,"x"),"x y");
  assert.equal(describedBy(),undefined);
  assert.equal(describedBy(undefined,"",false),undefined);
});

// ---- spoken name and hint ---------------------------------------------------

test("required is spoken in words, not only as a symbol",()=>{
  assert.equal(fieldLabelText("Notes"),"Notes");
  assert.equal(fieldLabelText(" Notes ",true),"Notes, required");
  assert.equal(fieldLabelText("Notas",true,"obligatorio"),"Notas, obligatorio");
  assert.equal(fieldLabelText("Notes",true,""),"Notes");
});

test("native hint puts the error first, in words, then the description",()=>{
  assert.equal(fieldHint({}),undefined);
  assert.equal(fieldHint({description:"Up to 200 characters"}),"Up to 200 characters.");
  assert.equal(fieldHint({error:"Enter a summary",description:"Shown on the card."}),
    "Error: Enter a summary. Shown on the card.");
  assert.equal(fieldHint({error:"Too long!",errorPrefix:""}),"Too long!");
  assert.equal(fieldHint({error:"  ",description:" "}),undefined);
});

test("control props wire label, description, error and state",()=>{
  const ids=fieldIds("bio",{description:"d",error:"e"});
  const p=fieldControlProps({ids,label:"Bio",description:"Shown publicly",error:"Enter a bio",
    required:true,disabled:false,invalid:true},"bio-count");
  assert.equal(p.nativeID,"bio");
  assert.equal(p.accessibilityLabelledBy,"bio-label");
  assert.equal(p["aria-labelledby"],"bio-label");
  assert.equal(p["aria-describedby"],"bio-error bio-description bio-count");
  assert.equal(p.accessibilityLabel,"Bio, required");
  assert.equal(p.accessibilityHint,"Error: Enter a bio. Shown publicly.");
  assert.equal(p["aria-required"],true);
  assert.equal(p["aria-invalid"],true);
  assert.equal(p["aria-disabled"],undefined);
  assert.deepEqual(p.accessibilityState,{disabled:false});
  const plain=fieldControlProps({ids:fieldIds("x"),required:false,disabled:true,invalid:false});
  assert.equal(plain["aria-describedby"],undefined);
  assert.equal(plain["aria-required"],undefined);
  assert.equal(plain["aria-invalid"],undefined);
  assert.equal(plain["aria-disabled"],true);
  assert.equal(plain.accessibilityLabel,undefined);
});

// ---- counter ------------------------------------------------------------------

test("counter wording is words, with singular and over-limit cases",()=>{
  assert.equal(counterText(counterState(0)),"0 characters");
  assert.equal(counterText(counterState(1)),"1 character");
  assert.equal(counterText(counterState(10,200)),"190 characters left");
  assert.equal(counterText(counterState(199,200)),"1 character left");
  assert.equal(counterText(counterState(200,200)),"No characters left");
  assert.equal(counterText(counterState(201,200)),"1 character over the limit");
  assert.equal(counterText(counterState(205,200)),"5 characters over the limit");
});

test("announce threshold is 10% of the limit, clamped to 5..20 and to the limit",()=>{
  assert.equal(defaultCountThreshold(200),20);
  assert.equal(defaultCountThreshold(1000),20);
  assert.equal(defaultCountThreshold(80),8);
  assert.equal(defaultCountThreshold(20),5);
  assert.equal(defaultCountThreshold(3),3);
  assert.throws(()=>defaultCountThreshold(0),RangeError);
  assert.throws(()=>counterState(-1,10),RangeError);
  assert.throws(()=>counterState(1,1.5),RangeError);
});

test("counter is a live region only near the limit, and announces only on change",()=>{
  assert.equal(counterIsNearLimit(counterState(100,200),20),false);
  assert.equal(counterIsNearLimit(counterState(180,200),20),true);
  assert.equal(counterIsNearLimit(counterState(5),20),false,"no limit, nothing to warn about");
  assert.equal(shouldAnnounceCount(undefined,counterState(150,200),20),false);
  assert.equal(shouldAnnounceCount(21,counterState(181,200),20),true);
  assert.equal(shouldAnnounceCount(19,counterState(181,200),20),false,"same remaining count");
  assert.throws(()=>counterIsNearLimit(counterState(1,2),-1),RangeError);
});

// ---- rows ---------------------------------------------------------------------

test("rows default to 4, fix the height, or bound auto-grow",()=>{
  assert.deepEqual(resolveRows({}),{min:4,max:4,autoGrow:false});
  assert.deepEqual(resolveRows({rows:6}),{min:6,max:6,autoGrow:false});
  assert.deepEqual(resolveRows({minRows:2,maxRows:8}),{min:2,max:8,autoGrow:true});
  assert.deepEqual(resolveRows({maxRows:5}),{min:1,max:5,autoGrow:true});
  assert.deepEqual(resolveRows({minRows:3}),{min:3,max:100,autoGrow:true});
  assert.deepEqual(resolveRows({minRows:3,maxRows:3}),{min:3,max:3,autoGrow:false});
});

test("invalid row props throw RangeError",()=>{
  for(const bad of [{rows:0},{rows:1.5},{rows:101},{minRows:-1},{maxRows:Number.NaN},
    {minRows:5,maxRows:2},{rows:3,minRows:2},{rows:3,maxRows:4}]){
    assert.throws(()=>resolveRows(bad),RangeError,JSON.stringify(bad));
  }
});

test("row heights follow font scale and keep the 44pt minimum",()=>{
  const m={lineHeight:24,fontScale:1,inset:18};
  assert.equal(rowsHeight(4,m),114);
  assert.equal(rowsHeight(4,{...m,fontScale:2}),210,"text scaling grows the field");
  assert.equal(rowsHeight(1,{lineHeight:16,fontScale:1,inset:0}),44);
  assert.throws(()=>rowsHeight(2,{...m,lineHeight:0}),RangeError);
  assert.throws(()=>rowsHeight(2,{...m,fontScale:Number.POSITIVE_INFINITY}),RangeError);
  assert.throws(()=>rowsHeight(2,{...m,inset:-1}),RangeError);
});

test("auto-grow clamps the measured content and scrolls past the max",()=>{
  const m={lineHeight:20,fontScale:1,inset:10};
  const b=resolveRows({minRows:2,maxRows:4});
  assert.deepEqual(autoGrowHeight(0,b,m),{height:50,scroll:false});
  assert.deepEqual(autoGrowHeight(60,b,m),{height:70,scroll:false});
  assert.deepEqual(autoGrowHeight(200,b,m),{height:90,scroll:true});
  assert.deepEqual(autoGrowHeight(Number.NaN,b,m),{height:50,scroll:false});
});

test("textarea config validates maxLength and countThreshold",()=>{
  assert.deepEqual(resolveTextareaConfig({maxLength:200}),{bounds:{min:4,max:4,autoGrow:false},maxLength:200,threshold:20});
  assert.equal(resolveTextareaConfig({maxLength:200,countThreshold:0}).threshold,0);
  assert.equal(resolveTextareaConfig({}).threshold,0);
  for(const bad of [{maxLength:0},{maxLength:2.5},{countThreshold:-1},{countThreshold:1.5},{rows:0}]){
    assert.throws(()=>resolveTextareaConfig(bad),RangeError,JSON.stringify(bad));
  }
});

// ---- source contracts -----------------------------------------------------------

test("Field generates ids with useId and hands them to its control",()=>{
  const f=src("Field.tsx");
  assert.match(f,/useId\(\)/);
  for(const name of ["Field","Label","HelperText","useField","useFieldIds"]){
    assert.match(f,new RegExp(`export function ${name}\\b`),name);
  }
  assert.match(f,/typeof children==="function"/,"render prop");
  assert.match(f,/controlProps:fieldControlProps\(state\)/);
  assert.match(f,/<FieldContext value=\{state\}>/);
  assert.match(f,/nativeID=\{state\.ids\.labelId\}/);
});

test("Label speaks the required word; HelperText reuses ErrorMessage for errors",()=>{
  const f=src("Field.tsx");
  assert.match(f,/requiredText="required"/);
  assert.match(f,/aria-hidden importantForAccessibility="no"/,"the * mark is not read");
  assert.match(f,/fieldLabelText\(children,required,requiredText\)/);
  assert.match(f,/from "\.\.\/feedback\/ErrorMessage\.tsx"/);
  assert.match(f,/<ErrorMessage[^>]*message=\{children\}/);
  assert.match(f,/disabled&&"opacity-50"/);
  // ErrorMessage owns the polite live region; it must stay that way.
  const em=readFileSync(new URL("../src/components/feedback/ErrorMessage.tsx",import.meta.url),"utf8");
  assert.match(em,/accessibilityLiveRegion="polite"/);
});

test("kit Textarea: multiline TextInput, auto-grow, counter, Field wiring and token styles",()=>{
  const t=src("Textarea.kit.tsx");
  assert.match(t,/<TextInput/);
  assert.match(t,/\bmultiline\b/);
  assert.match(t,/onContentSizeChange=/);
  assert.match(t,/maxLength=\{maxLength\}/);
  assert.match(t,/editable=\{!off\}/);
  assert.match(t,/useField\(\)/);
  assert.match(t,/fieldControlProps\(/);
  assert.match(t,/"aria-describedby"/);
  assert.match(t,/"aria-invalid"/);
  assert.match(t,/useWindowDimensions\(\)\.fontScale/,"heights follow text scaling");
  assert.match(t,/rounded-control border bg-surface-sunken/);
  assert.match(t,/bad\?"border-danger":"border-border focus:border-focus"/,"one border token at a time");
  assert.match(t,/focus:ring-focus/);
  assert.doesNotMatch(t,/from ["']@expo\/ui/,"kit has no Expo UI dependency");
  const shared=src("Textarea.shared.tsx");
  assert.match(shared,/accessibilityLiveRegion=\{near\?"polite":"none"\}/);
  assert.match(shared,/announceForAccessibility/);
});

test("universal Textarea renders @expo/ui's TextInput on web with the Field wiring on the textarea",()=>{
  const t=src("Textarea.tsx");
  assert.match(t,/import \{ Host, TextInput as UniversalTextInput, useNativeState, type TextInputRef \} from "@expo\/ui";/);
  assert.doesNotMatch(t,/@expo\/ui\/(?:swift-ui|jetpack-compose)/,"loads no native-only module");
  assert.match(t,/<UniversalTextInput[^>]*\bmultiline\b/);
  assert.match(t,/maxLength=\{maxLength\} editable=\{!off\}/);
  assert.match(t,/useField\(\)/);
  assert.match(t,/fieldControlProps\(/);
  assert.match(t,/useWebAriaPatch\(host,"textarea",\{/);
  for(const attr of ["id:","\"aria-labelledby\"","\"aria-describedby\"","\"aria-required\"","\"aria-invalid\"","\"aria-disabled\""])
    assert.ok(t.includes(attr),"writes "+attr);
  assert.match(t,/onContentSizeChange=\{bounds\.autoGrow\?/,"auto-grow from the measured content");
  assert.match(t,/useWindowDimensions\(\)\.fontScale/,"heights follow text scaling");
  assert.match(t,/UNIVERSAL_WEB_INSET=24/);
  assert.match(t,/expoUiWebHostStyle\(\)/,"maps --expo-ui-* onto Tron tokens");
  assert.match(t,/borderColor:"var\(--color-danger\)"/,"invalid border is the danger token");
  assert.match(t,/<TextareaCounter/);
});

test("native Textarea: universal TextInput on iOS, Compose OutlinedTextField on Android",()=>{
  const n=src("Textarea.native.tsx");
  assert.match(n,/import \{ Host, TextInput as UniversalTextInput, useNativeState, type TextInputRef \} from "@expo\/ui";/);
  assert.match(n,/from "@expo\/ui\/swift-ui\/modifiers"/);
  assert.match(n,/from "@expo\/ui\/jetpack-compose"/);
  assert.match(n,/<Host\b[^>]*matchContents/);
  assert.match(n,/<UniversalTextInput[^>]*\bmultiline\b/);
  assert.match(n,/lineLimit\(\{min:bounds\.min,max:bounds\.max\}\)/);
  assert.match(n,/swiftUIHint\(hint\)/,"description, error and counter reach VoiceOver");
  assert.match(n,/accessibilityLabel=\{label\}/,"label text reaches VoiceOver");
  assert.match(n,/minLines=\{bounds\.min\} maxLines=\{bounds\.max\}/);
  assert.match(n,/isError=\{bad\}/);
  assert.match(n,/enabled=\{!off\}/);
  assert.match(n,/editable=\{!off\}/);
  assert.match(n,/semantics\(\{contentDescription/,"label text reaches TalkBack");
});

function runtimeExports(text){
  const names=new Set();
  for(const m of text.matchAll(/export (?:function|const|class) (\w+)/g))names.add(m[1]);
  for(const m of text.matchAll(/export \{([^}]*)\}/g)){
    for(const part of m[1].split(",")){
      const p=part.trim();if(!p||p.startsWith("type "))continue;
      names.add(p.split(/\s+as\s+/).pop().trim());
    }
  }
  return [...names].sort();
}

test("every Textarea implementation exports the same runtime names",()=>{
  for(const f of TEXTAREAS){
    assert.deepEqual(runtimeExports(src(f)),["Textarea"],f);
    assert.match(src(f),/export type \{[^}]*TextareaProps[^}]*\}/,f);
  }
});

test("forms files stay theme neutral, Forge free and logical-direction",()=>{
  for(const f of FILES){
    const text=src(f);
    assert.doesNotMatch(text,/from ["'][^"']*forge\/|@nitro-forge\//,f+" imports Forge");
    assert.doesNotMatch(text,/#[0-9a-fA-F]{3,8}\b/,f+" has a hex color");
    assert.doesNotMatch(text,/\b(pl|pr|ml|mr|left|right)-\d/,f+" uses physical spacing");
    assert.doesNotMatch(text,/tailwind-variants|reanimated|solito|lucide|neon|district/,f+" kept NYC-MON styling");
    assert.doesNotMatch(text,/accessibilityRole=/,f+" needs no accessibilityRole");
    assert.match(header(text),PROVENANCE,f+" provenance names source, upstream commit, copyright and changes");
  }
  assert.doesNotMatch(src("Field.tsx"),/@expo\/ui/,"Field stays kit-only");
  assert.doesNotMatch(src("Textarea.kit.tsx"),/from ["']@expo\/ui/,"kit has no Expo UI dependency");
});

test("package.json exposes Field and routes Textarea to universal, native and kit builds",()=>{
  const field=pkg.exports["./components/forms/Field"];
  assert.ok(field,"./components/forms/Field");
  const ta=pkg.exports["./components/forms/Textarea"];
  assert.deepEqual(ta,{
    types:"./dist/components/forms/Textarea.d.ts",
    qnx:"./dist/components/forms/Textarea.kit.js",
    marathon:"./dist/components/forms/Textarea.kit.js",
    browser:"./dist/components/forms/Textarea.js",
    "react-native":"./dist/components/forms/Textarea.native.js",
    default:"./dist/components/forms/Textarea.js",
  });
  assert.deepEqual(Object.keys(ta),["types","qnx","marathon","browser","react-native","default"]);
});
