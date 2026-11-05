import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {parseUnitExpression,formatUnitValue,unitScale,convertFromBase,UNIT_EXPRESSION_LIMITS} from "../src/components/shell/unit-expression.ts";
import {valueAtOffset,fractionOf,sliderKeyAction,applySliderKey,normalizeRange,moveRangeThumb,nearestThumb,knobAngle,angleAround,valueFromAngle,valueFromDrag} from "../src/components/shell/slider-model.ts";
import {selectionHeading,matchesQuery,matchSummary,createInspectorRegistry,registerRow,matchingRowCount} from "../src/components/shell/inspector-model.ts";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const mm={dimension:"length",unit:"mm",percentOf:800};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const ok=(text,ctx)=>{const r=parseUnitExpression(text,ctx);assert.ok(r.ok,text+": "+r.error);return r.value;};
const fails=(text,ctx,pattern)=>{const r=parseUnitExpression(text,ctx);assert.equal(r.ok,false,text);assert.match(r.error,pattern);return r;};

test("lengths convert at 96 pixels per inch and mix units in arithmetic",()=>{
  close(ok("1in",mm),96);
  close(ok("25.4mm",mm),96);
  close(ok("72pt",mm),96);
  close(ok("2.54cm",mm),96);
  close(ok("10",mm),10*96/25.4);
  close(ok("10 * 2",mm),20*96/25.4);
  close(ok("12mm + 4pt",mm),12*96/25.4+4*96/72);
  close(ok("(100% - 16px) / 2",mm),392);
  close(ok("-(3mm)",mm),-3*96/25.4);
  close(ok("1,5mm",mm),1.5*96/25.4);
  close(ok("2 × 3px",mm),6);
  close(ok("1in",{...mm,pixelsPerInch:300}),300);
});

test("time, level and ratio units need their context",()=>{
  const t={dimension:"time",unit:"s",frameRate:24,sampleRate:48000};
  close(ok("1.5s - 12f",t),1);
  close(ok("48000smp",t),1);
  close(ok("250ms",t),0.25);
  close(ok("-6dB",{dimension:"level",unit:"dB"}),-6);
  close(ok("50%",{dimension:"ratio",unit:"%"}),0.5);
  close(ok("2x",{dimension:"ratio",unit:"%"}),2);
  fails("12f",{dimension:"time",unit:"s"},/frame rate/);
  fails("100smp",{dimension:"time",unit:"s"},/sample rate/);
  fails("50%",{dimension:"length",unit:"px"},/reference size/);
  fails("3mm",{dimension:"time",unit:"s"},/not a time unit/);
});

test("the parser rejects bad input with a position instead of evaluating it",()=>{
  fails("",mm,/Enter a value/);
  fails("1+",mm,/ends early/);
  fails("5pxx",mm,/Unknown unit/);
  fails("3/0",mm,/divide by zero/);
  fails("2mm*3mm",mm,/multiply two/);
  fails("4 / 2mm",mm,/plain number/);
  fails("(1",mm,/Missing \)/);
  fails("1)",mm,/Unexpected/);
  assert.equal(fails("eval(1)",mm,/Unknown unit|Unexpected/).at,0);
  fails("alert`1`",mm,/Unexpected|Unknown/);
  fails("constructor",mm,/Unexpected|Unknown/);
  fails("1e999",mm,/out of range/);
});

test("parser work is bounded by length, tokens and nesting",()=>{
  fails("1".repeat(UNIT_EXPRESSION_LIMITS.maxLength+1),mm,/too long/);
  fails(Array(40).fill("1").join("+"),mm,/too long/);
  fails("(".repeat(9)+"1"+")".repeat(9),mm,/nested/);
  close(ok("(".repeat(7)+"1px"+")".repeat(7),mm),1);
  fails("-".repeat(20)+"1",mm,/nested/);
});

test("values format in the display unit and convert back",()=>{
  assert.equal(formatUnitValue(96,mm),"25.4 mm");
  assert.equal(formatUnitValue(96,mm,"px"),"96 px");
  assert.equal(formatUnitValue(0.5,{dimension:"ratio",unit:"%"}),"50%");
  assert.equal(formatUnitValue(1,{dimension:"time",unit:"f",frameRate:30}),"30 f");
  assert.equal(formatUnitValue(-0.0001,mm),"0 mm");
  close(convertFromBase(96,"in",mm),1);
  assert.throws(()=>unitScale("px",{...mm,pixelsPerInch:0}),RangeError);
});

const r={min:0,max:100,step:1};
test("slider positions, keys and steps",()=>{
  assert.equal(valueAtOffset(50,200,r),25);
  assert.equal(valueAtOffset(50,200,r,true),75);
  assert.equal(valueAtOffset(-10,200,r),0);
  assert.equal(fractionOf(150,r),1);
  assert.deepEqual(sliderKeyAction("ArrowRight",{rtl:true}),{kind:"step",steps:-1});
  assert.deepEqual(sliderKeyAction("ArrowUp",{shift:true}),{kind:"step",steps:10});
  assert.deepEqual(sliderKeyAction("PageDown"),{kind:"step",steps:-10});
  assert.equal(sliderKeyAction("Enter"),null);
  assert.equal(applySliderKey(50,{kind:"step",steps:1},r),51);
  assert.equal(applySliderKey(50,{kind:"step",steps:0.1},r),50.1);
  assert.equal(applySliderKey(99,{kind:"step",steps:10},r),100);
  assert.equal(applySliderKey(50,{kind:"min"},r),0);
  assert.throws(()=>valueAtOffset(1,0,r),RangeError);
});

test("range ends never cross and keep the minimum gap",()=>{
  assert.deepEqual(normalizeRange([70,20],r),[20,70]);
  assert.deepEqual(normalizeRange([50,52],r,10),[50,60]);
  assert.deepEqual(normalizeRange([95,98],r,10),[90,100]);
  assert.deepEqual(moveRangeThumb([20,70],"low",90,r),[70,70]);
  assert.deepEqual(moveRangeThumb([20,70],"low",90,r,5),[65,70]);
  assert.deepEqual(moveRangeThumb([20,70],"high",10,r,5),[20,25]);
  assert.equal(nearestThumb([20,70],30),"low");
  assert.equal(nearestThumb([20,70],60),"high");
  assert.equal(nearestThumb([50,50],80),"high");
  assert.equal(nearestThumb([50,50],10),"low");
  assert.throws(()=>normalizeRange([0,1],r,200),RangeError);
});

test("knob angle maps both ways and holds an end across the bottom gap",()=>{
  assert.equal(knobAngle(0,r),-135);
  assert.equal(knobAngle(100,r),135);
  close(angleAround({x:10,y:0},{x:0,y:0}),90);
  close(angleAround({x:0,y:-10},{x:0,y:0}),0);
  assert.equal(valueFromAngle(0,10,r),50);
  assert.equal(valueFromAngle(-135,10,r),0);
  assert.equal(valueFromAngle(170,90,r),100);
  assert.equal(valueFromAngle(-170,10,r),0);
  assert.equal(valueFromDrag(50,0,-24,r),60);
  assert.equal(valueFromDrag(50,0,-24,r,{fine:true}),51);
  assert.equal(valueFromDrag(50,0,500,r),0);
});

test("inspector headings, search matching and summaries",()=>{
  assert.equal(selectionHeading({kind:"single",title:"Harbor photo"}),"Harbor photo");
  assert.equal(selectionHeading({kind:"multiple",count:3,noun:{one:"layer",other:"layers"}}),"3 layers");
  assert.throws(()=>selectionHeading({kind:"multiple",count:1,noun:{one:"a",other:"b"}}),RangeError);
  assert.ok(matchesQuery("","Opacity"));
  assert.ok(matchesQuery("opa","Opacity"));
  assert.ok(matchesQuery("city","Opacity"));
  assert.ok(matchesQuery("alpha","Opacity",["alpha","transparency"]));
  assert.ok(matchesQuery("blend mo","Blend mode"));
  assert.ok(matchesQuery("cafe","Café overlay"));
  assert.ok(!matchesQuery("stroke","Opacity"));
  assert.equal(matchSummary(0,"zz"),'No properties match "zz"');
  assert.equal(matchSummary(1,"opa"),"1 property matches");
  assert.equal(matchSummary(4,""),"");
});

test("the row registry counts matches per section, nested sections included",()=>{
  const reg=createInspectorRegistry();
  const off1=registerRow(reg,"a",{sections:["layer","blend"],match:true});
  registerRow(reg,"b",{sections:["layer"],match:false});
  registerRow(reg,"c",{sections:["effects"],match:true});
  assert.equal(matchingRowCount(reg.getState()),2);
  assert.equal(matchingRowCount(reg.getState(),"layer"),1);
  assert.equal(matchingRowCount(reg.getState(),"blend"),1);
  off1();
  assert.equal(matchingRowCount(reg.getState(),"layer"),0);
});

test("inspector and input sources keep Android-safe roles, 44pt targets and no eval",()=>{
  for(const file of ["UnitInput.tsx","SliderField.tsx","RangeSlider.tsx","RotaryKnob.tsx","InspectorPanel.tsx","InspectorSection.tsx","PropertyRow.tsx","InspectorSearch.tsx"]){
    const text=readFileSync(resolve(root,"src/components/shell",file),"utf8");
    assert.ok(/min-h-11|minHeight:44|height:44/.test(text),file+" has 44pt targets");
  }
  const parser=readFileSync(resolve(root,"src/components/shell/unit-expression.ts"),"utf8");
  assert.ok(!/\beval\(|new Function|Function\(/.test(parser.replace(/\/\*[\s\S]*?\*\//g,"")),"no dynamic evaluation");
  const native=readFileSync(resolve(root,"../expo-controls/src/components/NativeSliderField.native.tsx"),"utf8");
  assert.ok(native.includes("onEditingChanged")&&native.includes("onValueChangeFinished"),"commits when the OS drag ends");
});
