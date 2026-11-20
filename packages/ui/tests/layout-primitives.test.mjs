import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stackStyle } from "../src/components/layout/stack-style.ts";
import { space, border, font, leading } from "../src/tokens.ts";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const src=name=>readFileSync(new URL("../src/components/layout/"+name,import.meta.url),"utf8");
const code=name=>src(name).replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/[^\n]*/g,"");
const names=["Stack","Row","Spacer","Divider","Text"];

test("each layout primitive has its own subpath that points at its own file",()=>{
  for(const n of names){
    const e=pkg.exports["./components/layout/"+n];
    assert.ok(e,n);
    assert.equal(e.types,`./dist/components/layout/${n}.d.ts`);
    assert.equal(e["react-native"],`./dist/components/layout/${n}.js`);
    assert.equal(e.default,`./dist/components/layout/${n}.js`);
    assert.ok(src(n+".tsx").includes(`export function ${n}(`),n);
  }
  assert.ok(!readFileSync(new URL("../src/index.ts",import.meta.url),"utf8").match(/layout\//),"root barrel stays small");
});

test("primitives import only react-native, react types, tokens and package helpers",()=>{
  for(const f of [...names.map(n=>n+".tsx"),"stack-style.ts"]){
    for(const m of src(f).matchAll(/from\s+["']([^"']+)["']/g)){
      assert.match(m[1],/^(react-native|react|\.\.\/\.\.\/tokens\.ts|\.\.\/styles\.ts|\.\/(Stack\.tsx|stack-style\.ts))$/,`${f} imports ${m[1]}`);
    }
  }
});

test("no numeric literal feeds a spacing, size, radius, font or border style",()=>{
  const re=/\b(gap|padding\w*|margin\w*|width|height|flexBasis|fontSize|lineHeight|borderWidth|borderRadius)\s*:\s*-?\d/;
  for(const f of [...names.map(n=>n+".tsx"),"stack-style.ts"]) assert.doesNotMatch(src(f),re,f);
});

test("Stack and Row styles come from the space scale and the caller style goes last",()=>{
  assert.deepEqual(stackStyle("column",{}),{flexDirection:"column",gap:space[2]});
  assert.deepEqual(stackStyle("row",{gap:1.5,padding:4,paddingX:0.5,paddingY:0.25,align:"center",justify:"space-between",wrap:true}),{
    flexDirection:"row",gap:6,padding:16,paddingHorizontal:2,paddingVertical:1,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",
  });
  assert.equal(stackStyle("column",{gap:0}).gap,0);
  for(const n of ["Stack","Row"]) assert.match(src(n+".tsx"),/style=\{\[stackStyle\([^\]]*\),\s*style\]\}/,n);
  assert.equal(stackStyle("column",{wrap:false}).flexWrap,undefined);
});

test("Spacer, Divider and Text keep caller style last",()=>{
  assert.match(src("Spacer.tsx"),/,\s*style\]\}/);
  assert.match(src("Divider.tsx"),/style=\{\[line,\s*style\]\}/);
  assert.match(src("Text.tsx"),/style=\{\[sized,\s*style\]\}/);
});

test("Divider is decorative: border width token, border colour role, no accessibility role",()=>{
  const t=code("Divider.tsx");
  assert.equal(border[1],1);
  assert.match(t,/border\[1\]/);
  assert.match(t,/"bg-border"/);
  assert.doesNotMatch(t,/accessibilityRole|\brole=|accessible=/);
});

test("Text sizes are existing token pairs and add no weight or family",()=>{
  const t=code("Text.tsx");
  assert.match(t,/body:\s*\{\s*fontSize:\s*font\[12\],\s*lineHeight:\s*leading\[16\]/);
  assert.match(t,/caption:\s*\{\s*fontSize:\s*font\[11\],\s*lineHeight:\s*leading\[14\]/);
  assert.ok(font[12]&&font[11]&&leading[16]&&leading[14]);
  assert.doesNotMatch(t,/fontWeight|fontFamily|font-(semibold|bold|medium)/);
});

test("Text tones are the existing colour role classes",()=>{
  const t=src("Text.tsx");
  const roles=["text-text","text-text-muted","text-danger","text-primary","text-accent","text-info","text-success","text-on-primary","text-on-danger"];
  for(const c of roles) assert.ok(t.includes(`"${c}"`),c);
  assert.doesNotMatch(t,/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
});
