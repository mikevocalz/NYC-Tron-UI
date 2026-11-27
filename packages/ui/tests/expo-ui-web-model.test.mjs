import test from "node:test";
import assert from "node:assert/strict";
import { applyAriaPatch, ariaValue, EXPO_UI_TRON_VARIABLES, expoUiWebHostStyle, findAriaTarget } from "../src/components/expo-ui-web-model.ts";
import { EXPO_UI_TOKEN_MAP, TRON_THEME_TOKENS } from "../../core/src/theme.ts";

test("the Host style maps the same variables onto the same tokens as core's EXPO_UI_TOKEN_MAP",()=>{
  assert.deepEqual(Object.keys(EXPO_UI_TRON_VARIABLES).sort(),Object.keys(EXPO_UI_TOKEN_MAP).sort());
  for(const [variable,key] of Object.entries(EXPO_UI_TOKEN_MAP)){
    assert.equal(EXPO_UI_TRON_VARIABLES[variable],`var(${TRON_THEME_TOKENS.colors[key]})`,variable);
  }
  assert.ok(Object.isFrozen(EXPO_UI_TRON_VARIABLES));
});

test("an explicit tint keeps @expo/ui's generated primary scale",()=>{
  assert.equal(expoUiWebHostStyle()["--expo-ui-primary-500"],"var(--color-primary)");
  const seeded=expoUiWebHostStyle(true);
  assert.ok(!("--expo-ui-primary-500" in seeded));
  assert.equal(seeded["--expo-ui-gray-300"],"var(--color-text-muted)");
  assert.notEqual(expoUiWebHostStyle(),EXPO_UI_TRON_VARIABLES,"a fresh object each call");
});

test("ariaValue: set booleans become \"true\", empty and false values are absent",()=>{
  assert.equal(ariaValue(true),"true");
  for(const v of [false,undefined,null,"","  "])assert.equal(ariaValue(v),undefined,String(v));
  assert.equal(ariaValue(" a-desc b-err "),"a-desc b-err");
});

function fakeElement(initial={}){
  const attrs=new Map(Object.entries(initial));
  return {attrs,setAttribute:(n,v)=>attrs.set(n,String(v)),removeAttribute:n=>attrs.delete(n),getAttribute:n=>attrs.has(n)?attrs.get(n):null};
}

test("findAriaTarget looks down by default, up for ancestors, and is null off the DOM",()=>{
  const input=fakeElement(),dialog=fakeElement();
  const node={querySelector:s=>s==='input[role="switch"]'?input:null,closest:s=>s==="dialog"?dialog:null};
  assert.equal(findAriaTarget(node,'input[role="switch"]'),input);
  assert.equal(findAriaTarget(node,"dialog","ancestor"),dialog);
  assert.equal(findAriaTarget(node,"textarea"),null);
  assert.equal(findAriaTarget(null,"textarea"),null);
  assert.equal(findAriaTarget({},"textarea"),null,"a native host node has no querySelector");
});

test("applyAriaPatch sets values and removes only the attributes it set",()=>{
  const el=fakeElement({"aria-label":"Bottom sheet","aria-describedby":"theirs"});
  const owned=new Set();
  assert.deepEqual(applyAriaPatch(el,{"aria-label":"Filters","aria-invalid":"true"},owned),["aria-label","aria-invalid"]);
  assert.equal(el.attrs.get("aria-label"),"Filters");
  assert.deepEqual(applyAriaPatch(el,{"aria-label":"Filters","aria-invalid":"true"},owned),[],"no change, no writes");
  assert.deepEqual(applyAriaPatch(el,{"aria-invalid":undefined,"aria-describedby":undefined},owned),["aria-invalid"]);
  assert.ok(!el.attrs.has("aria-invalid"));
  assert.equal(el.attrs.get("aria-describedby"),"theirs","an attribute the patch never set is left alone");
});
