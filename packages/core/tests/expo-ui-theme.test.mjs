import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateTheme, expoUiCssVariables, EXPO_UI_TOKEN_MAP, TRON_THEME_TOKENS } from "../src/theme.ts";

const doc=readFileSync(new URL("../../../docs/THEME_TOKENS.md",import.meta.url),"utf8");
const section=doc.slice(doc.indexOf("## Expo UI universal components on web"));

const theme=validateTheme({
  colors:{primary:"#ff0",onPrimary:"#000",surfaceRaised:"#fff",surfaceSunken:"#eee",border:"#333",
    text:"#111",textMuted:"#555",focus:"#36f"},
  shape:{controlRadius:0,cardRadius:12,borderWidth:2},
  density:"comfortable",motion:{fastMs:100,standardMs:180},
});

test("expoUiCssVariables maps every Expo UI variable to the theme's color",()=>{
  const vars=expoUiCssVariables(theme);
  assert.deepEqual(Object.keys(vars).sort(),Object.keys(EXPO_UI_TOKEN_MAP).sort());
  assert.equal(vars["--expo-ui-primary-500"],"#ff0");
  assert.equal(vars["--expo-ui-background"],"#eee");
  assert.equal(vars["--expo-ui-gray-200"],"#333");
  assert.equal(vars["--expo-ui-gray-900"],"#111");
  assert.ok(Object.isFrozen(vars));
  assert.ok(Object.isFrozen(EXPO_UI_TOKEN_MAP));
});

test("every Expo UI variable is documented against the Tron token it takes",()=>{
  assert.ok(section.length>0,"THEME_TOKENS.md has the Expo UI section");
  for(const [variable,key] of Object.entries(EXPO_UI_TOKEN_MAP)){
    const tron=TRON_THEME_TOKENS.colors[key];
    assert.ok(tron,`${key} is a Tron color key`);
    assert.match(section,new RegExp(`${variable}:\\s*var\\(${tron}\\)`),`${variable} -> ${tron} is in the CSS block`);
  }
});
