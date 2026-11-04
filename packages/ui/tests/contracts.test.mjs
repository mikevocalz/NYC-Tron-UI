import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync,existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve,dirname } from "node:path";
import { resamplePeaks,peaksToBars } from "../src/components/forge/waveform.ts";
import { FRAME_RATES,formatTimecode,frameToPosition,positionToFrame } from "../src/components/forge/timebase.ts";
import { rgbaToHex } from "../src/components/forge/color.ts";
const pkgPath=new URL("../package.json",import.meta.url);
const root=dirname(fileURLToPath(pkgPath));
const pkg=JSON.parse(readFileSync(pkgPath,"utf8"));
test("all direct component export targets are actual independent files",()=>{
 for(const [subpath,target] of Object.entries(pkg.exports)){
   const entry=typeof target==="string"?target:target.default;
  assert.equal(typeof entry,"string",`Expected ESM export path for ${subpath}`);
  assert.ok(existsSync(resolve(root,entry)),`Missing compiled ${subpath}: ${entry}`);
 }
 assert.ok(pkg.exports["./components/forge/WaveformLane"]);
 assert.ok(!readFileSync(resolve(root,"src/index.ts"),"utf8").includes("./components/forge"));
});
test("Forge controls never import engine packages or app-specific palettes",()=>{
 for(const file of [
  "NativeSeekBar.tsx","WaveformLane.tsx","ColorChannels.tsx",
  "waveform.ts","color.ts","timebase.ts"
 ]){
  const text=readFileSync(resolve(root,"src/components/forge",file),"utf8");
  assert.ok(!/from\s+["'](?:@nitro-forge\/|@acme\/|@reactvision\/)/.test(text),file);
 }
});
test("waveform preserves real signal extrema and bounds view work",()=>{
 const peaks=[{min:-1,max:1},{min:-0.25,max:0.4}];
 assert.deepEqual(resamplePeaks(peaks,1),[{min:-1,max:1}]);
 const bars=peaksToBars(resamplePeaks(peaks,2),64);
 assert.deepEqual(bars[0],{top:0,height:64});
 assert.throws(()=>resamplePeaks(peaks,9000),/columns/);
});
test("frame math returns whole bounded frames and SMPTE display",()=>{
 assert.equal(positionToFrame(0.5,101),51);
 assert.equal(frameToPosition(15,30),0.5);
 assert.equal(formatTimecode(30,FRAME_RATES.VIDEO_30),"00:00:01:00");
 assert.match(formatTimecode(1800,FRAME_RATES.NTSC_2997,{dropFrame:true}),/;/);
});
test("RGBA math is document-agnostic and validates channels",()=>{
 assert.equal(rgbaToHex({r:255,g:0,b:0,alpha:1}),"#FF0000FF");
 assert.throws(()=>rgbaToHex({r:300,g:0,b:0,alpha:1}),/RGB/);
});
