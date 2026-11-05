import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

// #27: the Forge original puts the step buttons and timecode on one row under
// the slider. The rendered check is tests/browser/seekbar.spec.mjs.
const source=readFileSync(new URL("../src/components/forge/NativeSeekBar.tsx",import.meta.url),"utf8");

test("NativeSeekBar puts the frame buttons and timecode in one row under the slider",()=>{
 const host=source.slice(source.indexOf("<Host"),source.indexOf("</Host>"));
 assert.match(host,/<Slider\b/);
 assert.ok(!/<Button\b|<Text\b/.test(host),"the @expo/ui host carries only the slider");
 const after=source.slice(source.indexOf("</Host>"));
 const rowStart=after.indexOf('<View style={{flexDirection:"row"');
 const rowEnd=after.indexOf("</View>",rowStart);
 assert.ok(rowStart>0&&rowEnd>rowStart,"one row after the slider host");
 const row=after.slice(rowStart,rowEnd);
 assert.equal(row.match(/<Button\b/g)?.length,2,"both step buttons in the row");
 assert.equal(row.match(/<Text\b/g)?.length,1,"timecode in the row");
 const order=["−${stepFrames} frame","<Text","+${stepFrames} frame"].map(s=>row.indexOf(s));
 assert.deepEqual([...order].sort((a,b)=>a-b),order,"back, timecode, forward");
});
test("transport follows the app theme, not the OS scheme",()=>{
 assert.match(source,/import\s*\{\s*Host,Slider\s*\}\s*from\s*"@expo\/ui"/,"no @expo/ui Text or Button");
 assert.match(source,/import\s*\{[^}]*\bText\b[^}]*\}\s*from\s*"react-native"/);
 assert.match(source,/import\s*\{\s*Button\s*\}\s*from\s*"\.\.\/Button\.tsx"/);
 assert.match(source,/<Text selectable \{\.\.\.\{className:joinClasses\(!unstyled&&"text-text"\)\}\}/);
});
