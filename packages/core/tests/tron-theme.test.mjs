import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tronLightTheme, tronDarkTheme, tronThemeStylesheet } from "../src/presets/tron.ts";
import { createTronTheme, validateTheme, themeCssVariables, TRON_THEME_TOKENS } from "../src/theme.ts";

const read=url=>readFileSync(url,"utf8").replace(/\r\n/g,"\n");
// WCAG 2.1 relative luminance and contrast ratio.
const channel=v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;
const luminance=hex=>{
  assert.match(hex,/^#[0-9a-f]{6}$/i,`${hex} is a six-digit hex color`);
  const [r,g,b]=[1,3,5].map(i=>channel(parseInt(hex.slice(i,i+2),16)/255));
  return 0.2126*r+0.7152*g+0.0722*b;
};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
const presets=[["light",tronLightTheme],["dark",tronDarkTheme]];
const ALL_COLORS=Object.keys(TRON_THEME_TOKENS.colors);

test("default themes define every required and optional color and validate",()=>{
  for(const [name,theme] of presets){
    for(const key of ALL_COLORS)assert.equal(typeof theme.colors[key],"string",`${name} ${key}`);
    assert.deepEqual(validateTheme(theme),theme,`${name} is a fixed point of validateTheme`);
    assert.equal(Object.keys(themeCssVariables(theme)).length,ALL_COLORS.length+2,name);
  }
});

test("default themes meet WCAG 2.1 AA",()=>{
  for(const [name,theme] of presets){
    const c=theme.colors;
    const text=[["text","surfaceRaised"],["text","surfaceSunken"],["textMuted","surfaceRaised"],
      ["textMuted","surfaceSunken"],["onPrimary","primary"],["onDanger","danger"]];
    for(const [fg,bg] of text){
      const ratio=contrast(c[fg],c[bg]);
      assert.ok(ratio>=4.5,`${name}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1, needs 4.5:1`);
    }
    for(const ui of ["border","focus"])for(const bg of ["surfaceRaised","surfaceSunken"]){
      const ratio=contrast(c[ui],c[bg]);
      assert.ok(ratio>=3,`${name}: ${ui} against ${bg} is ${ratio.toFixed(2)}:1, needs 3:1`);
    }
    // Status and accent marks are non-text UI: 3:1 on both surfaces.
    for(const mark of ["primary","danger","accent","info","success"])for(const bg of ["surfaceRaised","surfaceSunken"]){
      const ratio=contrast(c[mark],c[bg]);
      assert.ok(ratio>=3,`${name}: ${mark} against ${bg} is ${ratio.toFixed(2)}:1, needs 3:1`);
    }
  }
});

test("createTronTheme deep-merges one group at a time and validates",()=>{
  const purple=createTronTheme(tronLightTheme,{colors:{primary:"#6d28d9"},shape:{controlRadius:4},motion:{fastMs:80}});
  assert.equal(purple.colors.primary,"#6d28d9");
  assert.equal(purple.colors.onPrimary,tronLightTheme.colors.onPrimary);
  assert.equal(purple.colors.success,tronLightTheme.colors.success,"optional colors are kept");
  assert.equal(purple.shape.controlRadius,4);
  assert.equal(purple.shape.cardRadius,12);
  assert.deepEqual(purple.motion,{fastMs:80,standardMs:240});
  assert.equal(purple.density,"comfortable");
  assert.equal(tronLightTheme.colors.primary,"#1f5fd1","the base theme is not mutated");
  assert.equal(createTronTheme(tronLightTheme,{density:"compact"}).density,"compact");
  assert.deepEqual(createTronTheme(tronDarkTheme),tronDarkTheme,"no overrides returns an equal theme");
  assert.equal(createTronTheme(tronLightTheme,{colors:{text:undefined}}).colors.text,"#15181d","undefined leaves the base value");
});

test("createTronTheme maps deprecated aliases onto current keys",()=>{
  const t=createTronTheme(tronLightTheme,{colors:{foreground:"#000000"},shape:{surfaceRadius:2}});
  assert.equal(t.colors.text,"#000000");
  assert.equal(t.colors.foreground,"#000000");
  assert.equal(t.shape.cardRadius,2);
  const both=createTronTheme(tronLightTheme,{colors:{text:"#111111",foreground:"#222222"}});
  assert.equal(both.colors.text,"#111111","the current key wins when both are given");
  const fromInput=createTronTheme({
    colors:{primary:"#ff0",onPrimary:"#000",surface:"#fff",background:"#eee",border:"#333",
      foreground:"#111",muted:"#555",focus:"#36f"},
    shape:{controlRadius:0,surfaceRadius:10,borderWidth:1},density:"touch",motion:{fastMs:1,standardMs:2},
  },{colors:{danger:"#c00"}});
  assert.equal(fromInput.colors.surfaceRaised,"#fff");
  assert.equal(fromInput.shape.cardRadius,10);
  assert.equal(fromInput.colors.danger,"#c00");
});

test("createTronTheme rejects an invalid merged theme",()=>{
  assert.throws(()=>createTronTheme(tronLightTheme,{colors:{text:""}}),/text/);
  assert.throws(()=>createTronTheme(tronLightTheme,{shape:{borderWidth:-1}}),/metric/);
  assert.throws(()=>createTronTheme(tronLightTheme,{motion:{fastMs:Number.NaN}}),/metric/);
});

test("theme.css is the generated stylesheet and matches the TypeScript values",()=>{
  const css=read(new URL("../src/presets/tron-theme.css",import.meta.url));
  assert.equal(css,tronThemeStylesheet(),"regenerate src/presets/tron-theme.css from tronThemeStylesheet()");
  const variant=name=>{
    const start=css.indexOf(`@variant ${name} {`);
    assert.ok(start>0,`${name} variant`);
    const body=css.slice(start,css.indexOf("}",start));
    return Object.fromEntries([...body.matchAll(/(--[a-z-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
  };
  assert.deepEqual(variant("light"),{...themeCssVariables(tronLightTheme)});
  assert.deepEqual(variant("dark"),{...themeCssVariables(tronDarkTheme)});
  const themeBlock=css.slice(css.indexOf("@theme {"),css.indexOf("}",css.indexOf("@theme {")));
  assert.match(themeBlock,/--radius-control: 8px;/);
  assert.match(themeBlock,/--radius-card: 12px;/);
});

test("core exports the presets and theme.css as their own subpaths, not from the barrel",()=>{
  const pkg=JSON.parse(read(new URL("../package.json",import.meta.url)));
  assert.equal(pkg.exports["./presets/tron"].default,"./dist/presets/tron.js");
  const css=pkg.exports["./theme.css"];
  assert.equal(Object.keys(css)[0],"style","Tailwind resolves the style condition first");
  assert.equal(css.style,"./dist/presets/tron-theme.css");
  assert.match(pkg.scripts.build,/tron-theme\.css/,"the build copies the stylesheet into dist");
  const index=read(new URL("../src/index.ts",import.meta.url));
  assert.ok(!index.includes("presets/"));
});

test("the default palette is documented with the values it ships",()=>{
  const doc=read(new URL("../../../docs/THEME_TOKENS.md",import.meta.url));
  const section=doc.slice(doc.indexOf("## Default theme and TronThemeProvider"));
  assert.ok(section.length>100,"THEME_TOKENS.md has the provider section");
  for(const [name,theme] of presets)for(const key of ALL_COLORS)
    assert.ok(section.includes(theme.colors[key]),`${name} ${key} ${theme.colors[key]} is in the docs table`);
});
