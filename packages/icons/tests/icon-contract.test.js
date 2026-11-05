import test from "node:test";
import assert from "node:assert/strict";
import {iconGroups,iconIds,searchIcons,iconsInCategory,hasIconId} from "../src/catalog.js";
import {glyphIds,getGlyph} from "../src/glyphs.js";
import {resolveIconState,riveIconInputs} from "../src/state.js";
test("suite inventory spans office, drawing, media and XR tools",()=>{
 assert.ok(Object.keys(iconGroups).length>=20);
 assert.ok(iconIds.length>=1000);
 assert.equal(new Set(iconIds).size,iconIds.length);
 for(const id of ["paint/eraser","paint/highlighter","slides/slide-master",
   "spreadsheet/pivot-table","pdf/pdf-redact","video/speed-ramp",
   "audio/piano-roll","spatial/pen-pair","accessibility/reduced-motion"])
   assert.equal(hasIconId(id),true,id);
 assert.ok(searchIcons("pressure").length>0);
 assert.ok(iconsInCategory("typography").length>40);
});
test("first authored glyphs have explicit outline and filled variants",()=>{
 assert.ok(glyphIds.length>=35);
 for(const id of glyphIds){
   for(const variant of ["outline","filled"]){
     const paths=getGlyph(id,variant);
     assert.ok(paths?.length>0,id+" "+variant);
     for(const p of paths){
       assert.equal(p.length,2);
       assert.ok(typeof p[0]==="string"&&p[0].startsWith("M")||p[0]?.startsWith("m"),id);
       assert.ok(["stroke","fill","knockout"].includes(p[1]));
     }
   }
 }
 assert.equal(getGlyph("charts/chart-funnel"),undefined);
});
test("inactive always outline, selected always filled; reduced motion still filled",()=>{
 assert.equal(resolveIconState().variant,"outline");
 assert.equal(resolveIconState({selected:true}).variant,"filled");
 assert.equal(resolveIconState({selected:true,reducedMotion:true}).animated,false);
 assert.equal(resolveIconState({selected:true,reducedMotion:true}).variant,"filled");
 assert.equal(resolveIconState({disabled:true,selected:true}).opacity,0.52);
 assert.equal(resolveIconState().color,"currentColor");
 assert.equal(resolveIconState({selected:true}).color,"currentColor");
 assert.equal(resolveIconState({selected:true,color:"#111111"}).color,"#111111");
 assert.equal(resolveIconState({selected:true,selectedColor:"#123ABC"}).color,"#123ABC");
 assert.equal(riveIconInputs({selected:true}).Selected,true);
 assert.equal(riveIconInputs({reducedMotion:true}).ReduceMotion,true);
 assert.throws(()=>resolveIconState({size:0}),RangeError);
});

test("every authored glyph has a distinct selected variant",()=>{
 for(const id of glyphIds)assert.notDeepEqual(getGlyph(id,"outline"),getGlyph(id,"filled"),id);
});
test("namespaced lookups resolve only registered catalog IDs",async()=>{
 const {glyphCatalogIds}=await import("../src/glyphs.js");
 const expected=iconIds.filter(id=>glyphIds.includes(id.split("/").at(-1)));
 assert.deepEqual([...glyphCatalogIds],expected);
 assert.ok(getGlyph("navigation/home"));
 assert.ok(getGlyph("home"));
 assert.equal(getGlyph("status/home"),undefined);
 assert.equal(getGlyph("anything/lock"),undefined);
});
test("no built-in color palette; theme keys map to icon roles",async()=>{
 const tokens=await import("../src/tokens.js");
 assert.equal("iconColors" in tokens,false);
 for(const file of ["tokens.js","state.js","ForgeIcon.js"]){
   const body=(await import("node:fs")).readFileSync(new URL("../src/"+file,import.meta.url),"utf8");
   assert.doesNotMatch(body,/#[0-9a-f]{3,8}\b/i,file);
 }
 assert.deepEqual({...tokens.iconColorsFromTheme({text:"#101010",primary:"#2040FF",textMuted:"#777777"})},
   {color:"#101010",selectedColor:"#2040FF",disabledColor:"#777777"});
});
test("TypeScript declarations and runtime modules export the same names",async()=>{
 const fs=await import("node:fs");
 for(const mod of ["index","catalog","glyphs","state","tokens","TronIcon"]){
   const dts=fs.readFileSync(new URL("../src/"+mod+".d.ts",import.meta.url),"utf8")
     .replace(/export\s+type\s*\{[^}]*\}[^;]*;/g,"").replace(/export\s+(interface|type)\s+\w+[^]*?(?=\nexport|$)/g,"");
   const declared=new Set();
   for(const m of dts.matchAll(/export\s+(?:declare\s+)?(?:const|function)\s+(\w+)/g))declared.add(m[1]);
   for(const m of dts.matchAll(/export\s*\{([^}]*)\}/g))
     for(const part of m[1].split(","))if(part.trim())declared.add(part.trim().split(/\s+as\s+/).at(-1));
   if(mod==="TronIcon"){
     const runtime=fs.readFileSync(new URL("../src/TronIcon.js",import.meta.url),"utf8");
     for(const name of declared)assert.match(runtime,new RegExp("\\b"+name+"\\b"),mod+":"+name);
     continue;
   }
   const runtime=await import("../src/"+mod+".js");
   assert.deepEqual([...declared].sort(),Object.keys(runtime).sort(),mod);
 }
});
