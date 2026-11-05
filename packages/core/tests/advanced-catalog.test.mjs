import test from "node:test";
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {resolve} from "node:path";
import {advancedNativeCatalog,upstreamCandidates} from "../src/advanced-catalog.ts";
test("advanced catalog is honest, unique, and prototypes resolve to source",()=>{
 assert.equal(new Set(advancedNativeCatalog.map(c=>c.id)).size,advancedNativeCatalog.length);
 for(const c of advancedNativeCatalog){
  assert.ok(c.platforms.length);
  if(c.stage==="prototype")assert.ok(c.sourcePath&&existsSync(resolve(".",c.sourcePath)),c.id);
  if(c.stage==="planned")assert.equal(c.sourcePath,undefined,c.id);
 }
});
test("all upstream port candidates have explicit review classification",()=>{
 assert.equal(new Set(upstreamCandidates.map(s=>s.repo)).size,upstreamCandidates.length);
 assert.ok(upstreamCandidates.some(s=>s.license==="AGPL-3.0"));
 assert.ok(upstreamCandidates.some(s=>s.license==="REVIEW"));
 assert.ok(upstreamCandidates.every(s=>s.target&&s.license&&s.sourceType));
});
