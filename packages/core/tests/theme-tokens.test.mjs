import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateTheme, themeCssVariables, TRON_THEME_TOKENS, TRON_NATIVE_METRICS } from "../src/theme.ts";

const doc=readFileSync(new URL("../../../docs/THEME_TOKENS.md",import.meta.url),"utf8");
const table=doc.slice(0,doc.indexOf("## Reference"));
const documentedVars=new Set([...table.matchAll(/`(--(?:color|radius)-[a-z-]+)`/g)].map(m=>m[1]));

test("every TronTheme key maps to a documented token, and every token has a key",()=>{
  // TRON_THEME_TOKENS is type-checked to cover every TronThemeColors key.
  const mapped=[...Object.entries(TRON_THEME_TOKENS.colors),...Object.entries(TRON_THEME_TOKENS.shape)];
  for(const [key,variable] of mapped){
    assert.ok(documentedVars.has(variable),`${key} -> ${variable} is not documented`);
    assert.ok(table.includes("`"+key+"`"),`THEME_TOKENS.md does not name the TronTheme key ${key}`);
  }
  assert.deepEqual(new Set(mapped.map(([,v])=>v)),documentedVars);
  for(const metric of TRON_NATIVE_METRICS)assert.ok(doc.includes("`"+metric+"`"),`native metric ${metric} undocumented`);
});

const legacy={
  colors:{background:"var(--color-surface)",surface:"#fff",foreground:"#000",
    muted:"#444",border:"#333",primary:"#ff0",onPrimary:"#000",focus:"#3366ff"},
  shape:{controlRadius:0,surfaceRadius:12,borderWidth:2},
  density:"comfortable",motion:{fastMs:100,standardMs:180},
};
test("deprecated keys still validate and read back through both names",()=>{
  const t=validateTheme(legacy);
  assert.equal(t.colors.surfaceRaised,"#fff");
  assert.equal(t.colors.surface,"#fff");
  assert.equal(t.colors.text,"#000");
  assert.equal(t.colors.foreground,"#000");
  assert.equal(t.colors.textMuted,"#444");
  assert.equal(t.colors.surfaceSunken,"var(--color-surface)");
  assert.equal(t.shape.cardRadius,12);
  assert.equal(t.shape.surfaceRadius,12);
  const vars=themeCssVariables(t);
  assert.equal(vars["--color-surface-raised"],"#fff");
  assert.equal(vars["--radius-card"],"12px");
  assert.ok(!("--color-danger" in vars),"absent optional tokens are not invented");
});
test("current keys, conflicts and missing values",()=>{
  const current={
    colors:{primary:"#1f5fd1",onPrimary:"#fff",surfaceRaised:"#fff",surfaceSunken:"#f1f3f6",
      border:"#c9ced6",text:"#15181d",textMuted:"#5a626e",danger:"#b42318",onDanger:"#fff",
      accent:"#1f7a6d",focus:"#1f5fd1"},
    shape:{controlRadius:8,cardRadius:12,borderWidth:1},density:"touch",motion:{fastMs:120,standardMs:240},
  };
  const vars=themeCssVariables(validateTheme(current));
  assert.deepEqual(new Set(Object.keys(vars)),documentedVars);
  assert.throws(()=>validateTheme({...current,colors:{...current.colors,surface:"#000"}}),/conflicts/);
  assert.doesNotThrow(()=>validateTheme({...current,colors:{...current.colors,surface:"#fff"}}));
  const {text,...noText}=current.colors;
  assert.throws(()=>validateTheme({...current,colors:noText}),/text/);
  assert.throws(()=>validateTheme({...current,shape:{...current.shape,borderWidth:-1}}),/metric/);
});
