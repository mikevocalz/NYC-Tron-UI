import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  a11yChecked, checkboxSymbol, checkedValueText, documentOrder, isKeyboardPress, keyRepeat, nextCheckedState,
  radioSymbol, radioTabStop, requireName, switchGeometry, toggleableState, toggleKeyAction, validateDuration,
} from "../src/components/forms/toggle-model.ts";
import { nextChoiceIndex } from "../src/components/forms/choice-keys.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=p=>readFileSync(new URL("../src/components/forms/"+p,import.meta.url),"utf8");
const COMPONENTS=["Switch","Checkbox","Radio"];
const FILES=[...COMPONENTS.flatMap(c=>[c+".types.ts",c+".web.tsx",c+".native.tsx"]),"toggle-model.ts"];

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

test("web forks expose role and state to assistive tech",()=>{
  const sw=src("Switch.web.tsx"),cb=src("Checkbox.web.tsx"),r=src("Radio.web.tsx");
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
});

test("switch thumb moves by marginStart, so RTL mirrors it, and honours reduced motion",()=>{
  const sw=src("Switch.web.tsx");
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

test("checkbox draws its marks with views and shows errors in words",()=>{
  const cb=src("Checkbox.web.tsx");
  assert.match(cb,/borderLeftWidth:2,borderBottomWidth:2/,"check mark");
  assert.match(cb,/borderTopWidth:2/,"dash");
  assert.match(cb,/border-danger/);
  assert.match(cb,/\{error\}<\/Text>/,"error text is rendered, not only a color");
  assert.match(src("Checkbox.native.tsx"),/\{error\}<\/Text>/);
});

test("native forks are built on @expo/ui SwiftUI and Jetpack Compose controls",()=>{
  const sw=src("Switch.native.tsx"),cb=src("Checkbox.native.tsx"),r=src("Radio.native.tsx");
  for(const [f,t] of [["Switch",sw],["Checkbox",cb],["Radio",r]]){
    assert.match(t,/from "@expo\/ui"/,f+" Host");
    assert.match(t,/from "@expo\/ui\/swift-ui"/,f);
    assert.match(t,/from "@expo\/ui\/jetpack-compose"/,f);
    assert.match(t,/<Host /,f);
    assert.match(t,/layoutDirection=\{I18nManager\.isRTL/,f+" RTL reaches the native tree");
    assert.match(t,/Platform\.OS==="android"/,f);
    assert.doesNotMatch(src(f+".web.tsx"),/@expo\/ui/,f+" web fork has no native dependency");
  }
  assert.match(sw,/SwiftUIToggle/);
  assert.match(sw,/ComposeSwitch/);
  assert.match(sw,/toggleable\(value,toggle,\{role:"switch"/);
  assert.match(cb,/TriStateCheckbox/);
  assert.match(cb,/toggleable\(checked===true,toggle,\{role:"checkbox"/);
  assert.match(cb,/accessibilityAddTraits\(\["isToggle"\]\)/);
  assert.match(cb,/accessibilityValue\(checkedValueText\(checked\)\)/);
  assert.match(r,/RadioButton/);
  assert.match(r,/selectable\(checked,select,"radioButton"\)/);
  assert.match(r,/accessibilityAddTraits\(\["isSelected"\]\)/);
  assert.match(r,/accessibilityRole="radiogroup"/);
  for(const t of [sw,cb,r]){
    assert.match(t,/defaultMinSize\(\{minWidth:48,minHeight:48\}\)|defaultMinSize\(\{minHeight:48\}\)/,"48dp row");
    assert.match(t,/frame\(\{minHeight:44/,"44pt row");
  }
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

test("both forks of each toggle export the same runtime and type names",()=>{
  const expected={Switch:["Switch"],Checkbox:["Checkbox"],Radio:["Radio","RadioGroup","RadioGroupItem"]};
  for(const c of COMPONENTS){
    const web=src(c+".web.tsx"),native=src(c+".native.tsx");
    assert.deepEqual(runtimeExports(web),expected[c],c+" web");
    assert.deepEqual(runtimeExports(native),runtimeExports(web),c+" native matches web");
    assert.deepEqual(typeExports(native),typeExports(web),c+" types");
    assert.match(web,new RegExp(`from "\\./${c}\\.types\\.ts"`),c+" web uses the shared types");
    assert.match(native,new RegExp(`from "\\./${c}\\.types\\.ts"`),c+" native uses the shared types");
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
  for(const f of ["Switch.web.tsx","Checkbox.web.tsx","Switch.native.tsx","Checkbox.native.tsx"]){
    assert.match(src(f),/^\/\/ Behaviour adapted from NYC-MON packages\/ui\/[\w/.]+ \(MIT\)\./,f+" provenance");
  }
  assert.doesNotMatch(src("Radio.web.tsx"),/NYC-MON/,"Radio is built fresh");
});

test("package.json exposes the toggle subpaths with platform forks (added by the lead)",()=>{
  for(const c of COMPONENTS){
    const e=pkg.exports["./components/forms/"+c];
    assert.ok(e,"./components/forms/"+c);
    assert.match(e["react-native"],new RegExp(c+"\\.native\\.js$"));
    assert.match(e.browser,new RegExp(c+"\\.web\\.js$"));
    assert.match(e.default,new RegExp(c+"\\.web\\.js$"));
    assert.match(e.types,new RegExp(c+"\\.web\\.d\\.ts$"));
  }
});
