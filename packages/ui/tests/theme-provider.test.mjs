import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createTronTheme, expoUiCssVariables, themeCssVariables } from "@nyc-tron/core/theme";
import { tronDarkTheme, tronLightTheme } from "@nyc-tron/core/presets/tron";
import { resolveTronColorScheme, resolveTronTheme, tronProviderVariables } from "../src/components/theme/theme-provider-model.ts";

const read=path=>readFileSync(new URL("../src/components/theme/"+path,import.meta.url),"utf8").replace(/\r\n/g,"\n");
const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));

test("colorScheme resolves to a fixed appearance or the system's, light when unknown",()=>{
  assert.equal(resolveTronColorScheme("light","dark"),"light");
  assert.equal(resolveTronColorScheme("dark","light"),"dark");
  assert.equal(resolveTronColorScheme("system","dark"),"dark");
  assert.equal(resolveTronColorScheme("system","light"),"light");
  for(const unknown of [null,undefined,"unspecified"])assert.equal(resolveTronColorScheme("system",unknown),"light");
  assert.throws(()=>resolveTronColorScheme("sepia","light"),/color scheme/);
});

test("the default theme follows the scheme; an explicit theme always wins",()=>{
  assert.equal(resolveTronTheme(undefined,"light"),tronLightTheme);
  assert.equal(resolveTronTheme(undefined,"dark"),tronDarkTheme);
  const brand=createTronTheme(tronLightTheme,{colors:{primary:"#6d28d9"}});
  assert.equal(resolveTronTheme(brand,"dark"),brand);
});

test("the provider sets Tron tokens everywhere and the Expo UI variables on web",()=>{
  const web=tronProviderVariables(tronDarkTheme,"web");
  assert.deepEqual({...web},{...themeCssVariables(tronDarkTheme),...expoUiCssVariables(tronDarkTheme)});
  assert.equal(web["--color-primary"],"#7aa7ff");
  assert.equal(web["--expo-ui-primary-500"],"#7aa7ff");
  assert.equal(web["--radius-card"],"12px");
  const native=tronProviderVariables(tronDarkTheme,"native");
  assert.deepEqual({...native},{...themeCssVariables(tronDarkTheme)});
  assert.ok(Object.keys(native).every(name=>!name.startsWith("--expo-ui-")));
  assert.ok(Object.isFrozen(web)&&Object.isFrozen(native));
});

test("TronThemeProvider is its own platform-split subpath, off the root barrel",()=>{
  const base="./dist/components/theme/TronThemeProvider";
  assert.deepEqual(pkg.exports["./components/theme/TronThemeProvider"],{
    types:base+".web.d.ts",browser:base+".web.js","react-native":base+".native.js",default:base+".web.js",
  });
  const barrel=readFileSync(new URL("../src/index.ts",import.meta.url),"utf8");
  assert.ok(!barrel.includes("TronThemeProvider"),"the root barrel must not reach the optional uniwind and core peers");
  for(const file of ["TronThemeProvider.web.tsx","TronThemeProvider.native.tsx"]){
    const text=read(file);
    assert.match(text,/export function TronThemeProvider\(/,file);
    assert.match(text,/export \{ useTronTheme \}/,file);
    assert.match(text,/export type \{[^}]*TronThemeProviderProps[^}]*\}/,file);
  }
  assert.match(read("TronThemeProvider.web.tsx"),/platform="web"/);
  assert.match(read("TronThemeProvider.native.tsx"),/platform="native"/);
});

test("the provider scopes variables through Uniwind and adds no app state or Forge import",()=>{
  const shared=read("TronThemeProvider.shared.tsx");
  assert.match(shared,/ScopedVariables/);
  assert.match(shared,/useColorScheme\(\)/);
  assert.match(shared,/createContext<TronThemeContextValue\|null>\(null\)/,"useTronTheme returns null outside a provider");
  for(const file of ["TronThemeProvider.shared.tsx","TronThemeProvider.web.tsx","TronThemeProvider.native.tsx",
    "TronThemeProvider.types.ts","theme-provider-model.ts"]){
    const text=read(file);
    assert.ok(!/\buseState\b/.test(text),`${file} keeps no React state`);
    assert.ok(!/from\s+["']@nitro-forge\//.test(text),`${file} imports Forge`);
    assert.equal(text.match(/["'`]#[0-9A-Fa-f]{3,8}["'`]/g),null,`${file} hardcodes a color`);
  }
});
