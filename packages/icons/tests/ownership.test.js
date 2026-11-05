import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getGlyph, glyphIds } from "../src/glyphs.js";

test("NYC-Tron icons own real authored geometry, not a copied full editor engine",()=>{
 const manifest=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
 assert.equal(manifest.private,true);
 assert.equal(manifest.name,"@nyc-tron/icons");
 assert.ok(manifest.exports["./native"]);
 for(const id of ["navigation/home","file/save","paint/paintbrush","video/timeline","spreadsheet/sheet","audio/audio","spatial/bluetooth"]){
   assert.ok(glyphIds.includes(id),id);
   assert.ok(getGlyph(id,"outline")?.length>0,id);
   assert.ok(getGlyph(id,"filled")?.length>0,id);
 }
 const deps=JSON.stringify(manifest);
 assert.ok(!deps.includes("@nitro-forge/"));
 assert.ok(!deps.includes("@reactvision/"));
});
