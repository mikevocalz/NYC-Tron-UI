import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  a11yChecked, checkboxDescription, checkboxSymbol, checkedValueText, documentOrder, isKeyboardPress, keepsFocusAfterSwap,
  keyRepeat, nextCheckedState, radioSymbol, radioTabStop, requireName, SWAP_FOCUS_WINDOW_MS, switchGeometry,
  toggleableState, toggleKeyAction, validateDuration,
} from "../src/components/forms/toggle-model.ts";
import { nextChoiceIndex } from "../src/components/forms/choice-keys.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/forms/"+p,import.meta.url),"utf8").replace(/\r\n/g,"\n");
const COMPONENTS=["Switch","Checkbox","Radio"];
/** Switch and Checkbox: universal @expo/ui file, native fork, kit. Radio keeps its web and native forks. */
const UNIVERSAL=["Switch","Checkbox"];
const kit=c=>UNIVERSAL.includes(c)?c+".kit.tsx":c+".web.tsx";
const FILES=[
  ...COMPONENTS.flatMap(c=>[c+".types.ts",kit(c),c+".native.tsx"]),
  ...UNIVERSAL.map(c=>c+".tsx"),"toggle-model.ts",
];
/** The block-comment header of a ported file, unwrapped to one line ("" when there is none). */
const header=text=>{const m=text.match(/^\/\*\n([\s\S]*?)\n \*\/\n/);return m?m[1].replace(/^ \* ?/gm,"").replace(/\n/g," "):"";};
const PROVENANCE=/^Behaviour adapted from NYC-MON packages\/ui\/\S+.* \(MIT\), mikevocalz\/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907\. Copyright \(c\) 2025 Gursel Cakar, MIT\. Notices: THIRD_PARTY_NOTICES\.md\. Modified for NYC-Tron UI \(2026-11\): \S/;

// ---- pure models ------------------------------------------------------------

test("checkbox press: indeterminate and unchecked go to checked, checked goes to unchecked",()=>{
  assert.equal(nextCheckedState("indeterminate"),true);
  assert.equal(nextCheckedState(false),true);
  assert.equal(nextCheckedState(true),false);
  assert.equal(a11yChecked("indeterminate"),"mixed");
  assert.equal(a11yChecked(true),true);
  assert.equal(a11yChecked(false),false);
});

test("native checkbox state is carried in words and symbols, not color",()=>{
  assert.equal(checkedValueText(true),"Checked");
  assert.equal(checkedValueText(false),"Not checked");
  assert.equal(checkedValueText("indeterminate"),"Partially checked");
  assert.deepEqual([true,false,"indeterminate"].map(checkboxSymbol),["checkmark.square.fill","square","minus.square.fill"]);
  assert.deepEqual([true,false,"indeterminate"].map(toggleableState),["on","off","indeterminate"]);
  assert.equal(radioSymbol(true),"largecircle.fill.circle");
  assert.equal(radioSymbol(false),"circle");
});

test("Android checkbox description carries name, description, error and state in words",()=>{
  assert.equal(checkboxDescription({name:"Email me",checked:true}),"Email me, Checked");
  assert.equal(checkboxDescription({name:"Terms",description:"Required to continue",error:"Accept the terms",checked:false}),
    "Terms, Required to continue, Accept the terms, Not checked");
  assert.equal(checkboxDescription({name:"All files",error:" ",checked:"indeterminate"}),"All files, Partially checked","blank parts dropped");
});

test("an iOS mixed-state swap keeps focus only right after the control's own press",()=>{
  assert.equal(keepsFocusAfterSwap(0,5000),false,"never pressed: a parent-driven swap leaves focus alone");
  assert.equal(keepsFocusAfterSwap(1000,1000),true);
  assert.equal(keepsFocusAfterSwap(1000,1000+SWAP_FOCUS_WINDOW_MS),true);
  assert.equal(keepsFocusAfterSwap(1000,1001+SWAP_FOCUS_WINDOW_MS),false,"an old press does not count");
  assert.equal(keepsFocusAfterSwap(2000,1000),false,"clock went backwards");
});

test("switch thumb travel is symmetric inside the track for both sizes",()=>{
  for(const size of ["sm","md"]){
    const g=switchGeometry(size);
    const inner=g.trackWidth-2*g.trackBorder;
    assert.equal(g.offStart,inner-g.thumb-g.onStart,size+" same gap at both ends, so RTL mirrors exactly");
    assert.ok(g.onStart>g.offStart,size);
    assert.ok(g.thumb>0&&g.thumb<g.trackHeight,size);
  }
  assert.deepEqual(switchGeometry("md"),{trackWidth:48,trackHeight:28,trackBorder:2,thumb:20,offStart:2,onStart:22});
  assert.throws(()=>switchGeometry("lg"),RangeError);
});

test("switch animation length is validated like other numeric props",()=>{
  assert.equal(validateDuration(0),0);
  assert.equal(validateDuration(150),150);
  for(const bad of [-1,1001,Number.NaN,Infinity])assert.throws(()=>validateDuration(bad),RangeError);
});

test("web keys: Space toggles every kind, Enter only a switch, repeats are swallowed",()=>{
  for(const kind of ["switch","checkbox","radio"]){
    assert.equal(toggleKeyAction(" ",kind),"activate",kind);
    assert.equal(toggleKeyAction("Spacebar",kind),"activate",kind);
    assert.equal(toggleKeyAction(" ",kind,true),"swallow",kind);
    assert.equal(toggleKeyAction("Tab",kind),null,kind);
    assert.equal(toggleKeyAction("ArrowDown",kind),null,kind);
  }
  assert.equal(toggleKeyAction("Enter","switch"),"activate");
  assert.equal(toggleKeyAction("Enter","checkbox"),null,"Enter is left to the form");
  assert.equal(toggleKeyAction("Enter","radio"),null);
  assert.equal(keyRepeat({nativeEvent:{repeat:true}}),true);
  assert.equal(keyRepeat({repeat:true}),true);
  assert.equal(keyRepeat({}),false);
  assert.equal(keyRepeat(undefined),false);
});

test("a press that RN Web sends from a keyup is recognised, a click is not",()=>{
  assert.equal(isKeyboardPress({nativeEvent:{type:"keyup"}}),true);
  assert.equal(isKeyboardPress({type:"keydown"}),true);
  assert.equal(isKeyboardPress({nativeEvent:{type:"click"}}),false);
  assert.equal(isKeyboardPress({nativeEvent:{type:"pointerup"}}),false);
  assert.equal(isKeyboardPress(undefined),false);
});

test("every toggle needs a name; accessibilityLabel wins over the visible label",()=>{
  assert.equal(requireName("Switch","Wi-Fi",undefined),"Wi-Fi");
  assert.equal(requireName("Switch","Wi-Fi","Wireless network"),"Wireless network");
  assert.equal(requireName("Switch",undefined,"Mute"),"Mute");
  assert.equal(requireName("Switch","  ","Mute"),"Mute");
  assert.throws(()=>requireName("Checkbox",undefined,undefined),/Checkbox needs a label/);
  assert.throws(()=>requireName("Radio","",""),TypeError);
});

test("radio roving stop: checked enabled item, else first enabled, else none",()=>{
  const items=[{value:"a",disabled:true},{value:"b",disabled:false},{value:"c",disabled:false}];
  assert.equal(radioTabStop(items,"c"),"c");
  assert.equal(radioTabStop(items,""),"b","nothing checked: first enabled");
  assert.equal(radioTabStop(items,"a"),"b","checked but disabled: first enabled");
  assert.equal(radioTabStop(items,"zzz"),"b");
  assert.equal(radioTabStop(items.map(i=>({...i,disabled:true})),"b"),null);
  assert.equal(radioTabStop([],"a"),null);
});

test("radio arrow keys select along screen order, skip disabled items and flip in RTL",()=>{
  const off=[false,true,false];
  assert.equal(nextChoiceIndex(0,"ArrowDown",off,{axis:"both"}),2);
  assert.equal(nextChoiceIndex(2,"ArrowDown",off,{axis:"both"}),0,"wraps");
  assert.equal(nextChoiceIndex(0,"ArrowRight",off,{axis:"both",rtl:true}),2,"RTL: right is previous, wraps to last");
  assert.equal(nextChoiceIndex(0,"ArrowLeft",off,{axis:"both",rtl:true}),2);
  assert.equal(nextChoiceIndex(-1,"ArrowDown",off,{axis:"both"}),0,"nothing checked: first enabled");
});

test("radio entries follow DOM order when nodes are known, registration order otherwise",()=>{
  // Fake nodes ordered by a position index, as compareDocumentPosition reports.
  const node=pos=>({pos,compareDocumentPosition(other){return other.pos>pos?4:2;}});
  const reg=[{value:"c",disabled:false,node:node(3)},{value:"a",disabled:false,node:node(1)},{value:"b",disabled:false,node:node(2)}];
  assert.deepEqual(documentOrder(reg).map(e=>e.value),["a","b","c"]);
  const plain=[{value:"c",disabled:false},{value:"a",disabled:false}];
  assert.deepEqual(documentOrder(plain).map(e=>e.value),["c","a"]);
  assert.notEqual(documentOrder(plain),plain,"returns a copy");
});

// ---- source contracts ---------------------------------------------------------

test("kit implementations expose role and state to assistive tech",()=>{
  const sw=src(kit("Switch")),cb=src(kit("Checkbox")),r=src(kit("Radio"));
  assert.match(sw,/accessibilityRole="switch"/);
  assert.match(sw,/accessibilityState=\{\{[^}]*checked:value,disabled\}\}/);
  assert.match(cb,/accessibilityRole="checkbox"/);
  assert.match(cb,/checked:a11yChecked\(checked\)/,"mixed for indeterminate");
  assert.match(cb,/"aria-invalid"/);
  assert.match(cb,/"aria-describedby"/);
  assert.match(r,/accessibilityRole="radiogroup"/);
  assert.match(r,/accessibilityRole="radio"/);
  assert.match(r,/accessibilityState=\{\{[^}]*checked,disabled:off\}\}/);
  assert.match(r,/tabIndex:/,"roving tabindex");
  assert.match(r,/nextChoiceIndex\(/);
  assert.match(r,/domIsRTL\(/);
  for(const [f,t] of [["Switch",sw],["Checkbox",cb],["Radio",r]]){
    assert.match(t,/onKeyDown/,f+" web keyboard");
    assert.match(t,/isKeyboardPress\(event\)/,f+" ignores RN Web's keyup press");
    assert.match(t,/minHeight:44/,f+" 44pt target");
    assert.match(t,/minWidth:44/,f+" 44pt target");
    assert.match(t,/unstyled/,f);
    assert.match(t,/focus-visible:ring-focus/,f+" visible focus");
  }
  for(const c of UNIVERSAL){
    assert.match(src(kit(c)),/color:_color/,c+" kit ignores the Expo UI tint");
    assert.doesNotMatch(src(kit(c)),/from ["']@expo\/ui/,c+" kit has no Expo UI dependency");
  }
});

test("kit switch thumb moves by marginStart, so RTL mirrors it, and honours reduced motion",()=>{
  const sw=src(kit("Switch"));
  assert.match(sw,/marginStart:anim\.interpolate/);
  assert.doesNotMatch(sw,/translateX/);
  assert.match(sw,/isReduceMotionEnabled/);
  assert.match(sw,/reduceMotionChanged/);
  assert.match(sw,/motion-reduce:transition-none/);
  assert.match(sw,/bg-primary/);
  assert.match(sw,/bg-surface-sunken border-border/);
  assert.match(sw,/bg-on-primary/);
  assert.match(sw,/bg-surface-raised/);
});

test("checkbox draws kit marks with views and shows errors in words everywhere",()=>{
  const cb=src(kit("Checkbox"));
  assert.match(cb,/borderLeftWidth:2,borderBottomWidth:2/,"check mark");
  assert.match(cb,/borderTopWidth:2/,"dash");
  assert.match(cb,/border-danger/);
  for(const f of [kit("Checkbox"),"Checkbox.tsx","Checkbox.native.tsx"])
    assert.match(src(f),/\{error\}<\/Text>/,f+": error text is rendered, not only a color");
  for(const f of ["Checkbox.tsx","Checkbox.native.tsx"])assert.match(src(f),/accessibilityLiveRegion="polite"/,f);
});

test("universal files render @expo/ui's universal controls and stay web safe",()=>{
  for(const c of UNIVERSAL){
    const t=src(c+".tsx");
    assert.match(t,new RegExp(`import \\{ Host, ${c} as Universal${c} \\} from "@expo/ui";`),c);
    assert.doesNotMatch(t,/@expo\/ui\/(?:swift-ui|jetpack-compose)/,c+" loads no native-only module");
    assert.match(t,/<Host matchContents colorScheme=\{colorScheme\} seedColor=\{color\}/,c+" tint only from an explicit color");
    assert.match(t,/expoUiWebHostStyle\(color!==undefined\)/,c+" maps --expo-ui-* onto Tron tokens");
    assert.match(t,/minHeight:44,minWidth:44/,c+" 44pt target");
    assert.match(t,/<Pressable focusable=\{false\}/,c+" label toggles without a second tab stop");
    assert.match(t,/requireName\(/,c);
  }
  const sw=src("Switch.tsx"),cb=src("Checkbox.tsx");
  assert.match(sw,/useWebAriaPatch\(control,'input\[role="switch"\]',\{"aria-label":name\}\)/);
  assert.match(sw,/switchGeometry\(size\);validateDuration\(animationMs\)/,"kit props validated everywhere");
  assert.match(cb,/useWebAriaPatch\(control,'input\[type="checkbox"\]'/);
  assert.match(cb,/"aria-describedby":ariaValue\(/);
  assert.match(cb,/"aria-invalid":ariaValue\(!!error\)/);
  assert.doesNotMatch(cb,/KitCheckbox/,"web keeps one tree for every state, so focus is never lost to a remount");
  assert.match(cb,/"aria-checked":mixed\?"mixed":undefined/,"mixed reaches the input");
  assert.match(cb,/applyIndeterminate\(findAriaTarget\(control\.current,'input\[type="checkbox"\]'\),mixed\)/);
  assert.match(cb,/\{mixed\?<MixedMark disabled=\{disabled\}\/>:null\}/,"a dash is drawn while mixed");
  assert.match(cb,/pointerEvents="none" aria-hidden/,"the dash neither takes clicks nor is read");
  assert.match(cb,/backgroundColor:"var\(--expo-ui-primary-500\)"/,"box follows the Host primary or explicit color");
  assert.match(cb,/backgroundColor:"var\(--color-on-primary\)"/);
  for(const [f,t] of [["Switch",sw],["Checkbox",cb]]){
    assert.match(t,/ignoreSafeArea="all"/,f+" no safe-area or keyboard padding on the web Host");
    assert.match(t,/styled&&"rounded-control has-\[:focus-visible\]:ring-2 has-\[:focus-visible\]:ring-focus"/,f+" visible keyboard focus, styled only");
  }
});

test("native forks add names through SwiftUI and Compose modifiers on the universal controls",()=>{
  const sw=src("Switch.native.tsx"),cb=src("Checkbox.native.tsx"),r=src("Radio.native.tsx");
  for(const [f,t] of [["Switch",sw],["Checkbox",cb]]){
    assert.match(t,new RegExp(`import \\{ Host, ${f} as Universal${f} \\} from "@expo/ui";`),f);
    assert.match(t,/from "@expo\/ui\/swift-ui\/modifiers"/,f);
    assert.match(t,/from "@expo\/ui\/jetpack-compose\/modifiers"/,f);
    assert.match(t,/swiftUIAccessibilityLabel\(name\)/,f+" VoiceOver name");
    assert.match(t,/labelsHidden\(\)/,f+" no second SwiftUI label");
    assert.match(t,/semantics\(\{contentDescription:/,f+" TalkBack name");
    assert.match(t,/importantForAccessibility="no-hide-descendants"/,f+" kit label is not read twice");
    assert.match(t,/seedColor=\{color\}/,f+" tint only from an explicit color");
  }
  assert.match(cb,/TriStateCheckbox/,"Android mixed state");
  assert.match(cb,/if\(android\)\{\n\s*\/\/ Every state on one TriStateCheckbox/,"Android draws every state on one control, so TalkBack focus stays");
  assert.match(cb,/semantics\(\{contentDescription:checkboxDescription\(\{name,description,error,checked\}\)\}\)/,"Android description includes the error");
  assert.match(cb,/const kit=props\.checked==="indeterminate"&&Platform\.OS!=="android";/,"iOS mixed falls back to the kit");
  assert.match(cb,/return kit\?<KitCheckbox \{\.\.\.own\}\/>:<NativeCheckbox \{\.\.\.own\}\/>;/);
  assert.match(cb,/keepsFocusAfterSwap\(pressedAt\.current,Date\.now\(\)\)/,"focus follows only this control's own press");
  assert.match(cb,/AccessibilityInfo\.setAccessibilityFocus\(tag\)/,"VoiceOver focus moves to the new control");
  assert.match(cb,/useImperativeHandle\(props\.ref,/,"the app ref follows the mounted control");
  assert.match(r,/from "@expo\/ui\/swift-ui"/);
  assert.match(r,/from "@expo\/ui\/jetpack-compose"/);
  assert.match(r,/RadioButton/);
  assert.match(r,/selectable\(checked,select,"radioButton"\)/);
  assert.match(r,/accessibilityAddTraits\(\["isSelected"\]\)/);
  assert.match(r,/accessibilityRole="radiogroup"/);
  for(const [f,t] of [["Switch",sw],["Checkbox",cb],["Radio",r]]){
    assert.match(t,/<Host /,f);
    assert.match(t,/I18nManager\.isRTL/,f+" RTL reaches the native tree");
    assert.match(t,/layoutDirection=\{/,f+" RTL reaches the native tree");
    assert.match(t,/Platform\.OS==="android"/,f);
    assert.match(t,/defaultMinSize\(\{minWidth:48,minHeight:48\}\)|defaultMinSize\(\{minHeight:48\}\)/,f+" 48dp row");
    assert.match(t,/frame\(\{minHeight:44/,f+" 44pt row");
  }
  assert.doesNotMatch(src(kit("Radio")),/from ["']@expo\/ui/,"Radio web fork has no native dependency");
});

function runtimeExports(text){
  const names=new Set();
  for(const m of text.matchAll(/^export (?:function|const|class) (\w+)/gm))names.add(m[1]);
  for(const m of text.matchAll(/^export \{([^}]*)\}/gm)){
    for(const part of m[1].split(",")){
      const p=part.trim();if(!p||p.startsWith("type "))continue;
      names.add(p.split(/\s+as\s+/).pop().trim());
    }
  }
  return [...names].sort();
}
function typeExports(text){
  return [...text.matchAll(/^export type \{([^}]*)\}/gm)].flatMap(m=>m[1].split(",").map(s=>s.trim()).filter(Boolean)).sort();
}

test("every implementation of each toggle exports the same runtime and type names",()=>{
  const expected={Switch:["Switch"],Checkbox:["Checkbox"],Radio:["Radio","RadioGroup","RadioGroupItem"]};
  for(const c of COMPONENTS){
    const files=[kit(c),c+".native.tsx",...(UNIVERSAL.includes(c)?[c+".tsx"]:[])];
    const base=src(files[0]);
    assert.deepEqual(runtimeExports(base),expected[c],c+" "+files[0]);
    for(const f of files){
      const t=src(f);
      assert.deepEqual(runtimeExports(t),expected[c],f);
      assert.deepEqual(typeExports(t),typeExports(base),f+" types");
      assert.match(t,new RegExp(`from "\\./${c}\\.types\\.ts"`),f+" uses the shared types");
    }
  }
});

test("toggle files stay theme neutral, Forge free and logical-direction",()=>{
  for(const f of FILES){
    const text=src(f);
    assert.doesNotMatch(text,/from ["'][^"']*forge\/|@nitro-forge\//,f+" imports Forge");
    assert.doesNotMatch(text,/["'`]#[0-9a-fA-F]{3,8}["'`]/,f+" has a hex color");
    assert.doesNotMatch(text,/\b(pl|pr|ml|mr)-\d/,f+" uses physical spacing");
    assert.doesNotMatch(text,/from ["'](?:tailwind-variants|react-native-reanimated|solito|lucide[^"']*|\.\.?\/tw)["']/,f+" kept an NYC-MON dependency");
  }
  for(const c of UNIVERSAL)for(const f of [c+".tsx",c+".native.tsx",kit(c)]){
    assert.match(header(src(f)),PROVENANCE,f+" provenance names source, upstream commit, copyright and changes");
  }
  assert.doesNotMatch(src("Radio.web.tsx"),/NYC-MON/,"Radio is built fresh");
});

test("package.json routes Switch and Checkbox to universal, native and kit builds",()=>{
  for(const c of UNIVERSAL){
    const e=pkg.exports["./components/forms/"+c];
    assert.ok(e,"./components/forms/"+c);
    assert.deepEqual(Object.keys(e),["types","qnx","marathon","browser","react-native","default"],c+" condition order");
    assert.equal(e.types,`./dist/components/forms/${c}.d.ts`);
    assert.equal(e.qnx,`./dist/components/forms/${c}.kit.js`);
    assert.equal(e.marathon,`./dist/components/forms/${c}.kit.js`);
    assert.equal(e.browser,`./dist/components/forms/${c}.js`);
    assert.equal(e["react-native"],`./dist/components/forms/${c}.native.js`);
    assert.equal(e.default,`./dist/components/forms/${c}.js`);
  }
  const r=pkg.exports["./components/forms/Radio"];
  assert.match(r["react-native"],/Radio\.native\.js$/);
  assert.match(r.browser,/Radio\.web\.js$/);
  assert.match(r.default,/Radio\.web\.js$/);
  assert.match(r.types,/Radio\.web\.d\.ts$/);
});
