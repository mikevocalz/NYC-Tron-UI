import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

// #27: the Forge original keeps the slider in the Column and puts the step
// buttons and timecode in one Row. The rendered check is tests/browser/seekbar.spec.mjs.
const source=readFileSync(new URL("../src/components/forge/NativeSeekBar.tsx",import.meta.url),"utf8");

test("NativeSeekBar puts the frame buttons and timecode in one Row under the slider",()=>{
 assert.match(source,/import\s*\{[^}]*\bRow\b[^}]*\}\s*from\s*"@expo\/ui"/);
 const column=source.slice(source.indexOf("<Column"),source.indexOf("</Column>"));
 const rowStart=column.indexOf("<Row");
 const rowEnd=column.indexOf("</Row>");
 assert.ok(rowStart>0&&rowEnd>rowStart,"one Row inside the Column");
 assert.equal(column.match(/<Row\b/g).length,1);
 assert.ok(column.indexOf("<Slider")<rowStart,"slider sits above the Row");
 const row=column.slice(rowStart,rowEnd);
 const outside=column.slice(0,rowStart)+column.slice(rowEnd);
 assert.equal(row.match(/<Button\b/g)?.length,2,"both step buttons in the Row");
 assert.equal(row.match(/<Text\b/g)?.length,1,"timecode in the Row");
 assert.ok(!/<Button\b|<Text\b/.test(outside),"no transport item left in the Column");
 const order=["−${stepFrames} frame","<Text","+${stepFrames} frame"].map(s=>row.indexOf(s));
 assert.deepEqual([...order].sort((a,b)=>a-b),order,"back, timecode, forward");
});
