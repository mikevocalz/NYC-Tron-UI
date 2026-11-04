import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync,existsSync,readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve,dirname } from "node:path";
import { resamplePeaks,peaksToBars } from "../src/components/forge/waveform.ts";
import { FRAME_RATES,formatTimecode,frameToPosition,positionToFrame } from "../src/components/forge/timebase.ts";
import { rgbaToHex } from "../src/components/forge/color.ts";
import { sheetWindow,cellAddress,columnName,responsiveSheetMetrics,reanchorSheetScroll } from "../src/components/forge/sheet-window.ts";
import { dataTableLayout,tableContentWidth } from "../src/components/data/table-layout.ts";
const pkgPath=new URL("../package.json",import.meta.url);
const root=dirname(fileURLToPath(pkgPath));
const pkg=JSON.parse(readFileSync(pkgPath,"utf8"));
test("all direct component export targets are actual independent files",()=>{
 for(const [subpath,target] of Object.entries(pkg.exports)){
   const entry=typeof target==="string"?target:target.default;
  assert.equal(typeof entry,"string",`Expected ESM export path for ${subpath}`);
  const base=entry.replace("/dist/","/src/");
  const fallback=base.endsWith(".js")?base.slice(0,-3):base;
  assert.ok(
    existsSync(resolve(root,entry)) ||
    existsSync(resolve(root,fallback+".ts")) ||
    existsSync(resolve(root,fallback+".tsx")),
    `Missing source or compiled export ${subpath}: ${entry}`
  );
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

test("Spreadsheet window virtualizes both rows and columns without allocating full sheet",()=>{
  const viewport=sheetWindow({rowCount:1048576,columnCount:16384,
    scrollX:0,scrollY:0,viewportWidth:1000,viewportHeight:600,rowHeight:32,columnWidth:112});
  assert.ok(viewport.rows.end-viewport.rows.start<50);
  assert.ok(viewport.columns.end-viewport.columns.start<20);
  const moved=sheetWindow({rowCount:1048576,columnCount:16384,
    scrollX:1200,scrollY:1280,viewportWidth:1000,viewportHeight:600,rowHeight:32,columnWidth:112});
  assert.ok(moved.rows.start>0);
  assert.ok(moved.columns.start>0);
  assert.equal(columnName(26),"AA");
  assert.equal(cellAddress(0,26),"AA1");
  assert.equal(cellAddress(99,0),"A100");
});

test("data tables switch to labeled record cards in portrait and narrow split panes",()=>{
  for(const width of [280,320,360,390,430,480,599]){
    assert.equal(dataTableLayout({containerWidth:width}),"cards",String(width));
  }
  for(const width of [620,768,900,1024]){
    assert.equal(dataTableLayout({containerWidth:width}),"table",String(width));
  }
  assert.equal(dataTableLayout({containerWidth:null}),"cards");
  assert.equal(dataTableLayout({containerWidth:900,layout:"cards"}),"cards");
  assert.equal(dataTableLayout({containerWidth:320,layout:"table"}),"table");
  assert.equal(dataTableLayout({containerWidth:410,cardsBelow:400}),"table");
  assert.equal(tableContentWidth(400,7,144),1008);
  assert.equal(tableContentWidth(900,3,144),900);
});

test("Tally mobile grid keeps all spreadsheet columns, touch targets and formula input",()=>{
  for(const width of [280,320,360,390,480,539]){
    const m=responsiveSheetMetrics({width,rowHeight:32,columnWidth:100});
    assert.equal(m.compact,true,String(width));
    assert.ok(m.rowHeight>=44);
    assert.ok(m.columnWidth>=112);
    assert.equal(m.formulaBarHeight,92);
    const visible=sheetWindow({
      rowCount:1048576,columnCount:16384,scrollX:0,scrollY:0,
      viewportWidth:width,
      viewportHeight:600-m.formulaBarHeight,
      rowHeight:m.rowHeight,columnWidth:m.columnWidth,
      rowHeaderWidth:m.rowHeaderWidth,columnHeaderHeight:m.columnHeaderHeight
    });
    assert.ok(visible.columns.end-visible.columns.start<=8);
    assert.ok(visible.rows.end-visible.rows.start<=20);
    assert.equal(visible.totalWidth,m.rowHeaderWidth+16384*m.columnWidth);
  }
  const landscape=responsiveSheetMetrics({width:900,rowHeight:32,columnWidth:112});
  assert.equal(landscape.compact,false);
  assert.equal(landscape.rowHeight,32);
  assert.equal(landscape.formulaBarHeight,46);
  assert.throws(()=>responsiveSheetMetrics({width:-1}),/metrics/);
});

test("responsive implementation measures host panes, not window screen dimensions",()=>{
  const data=readFileSync(resolve(root,"src/components/data/DataTable.tsx"),"utf8");
  const grid=readFileSync(resolve(root,"src/components/forge/SpreadsheetGrid.tsx"),"utf8");
  assert.ok(data.includes("onLayout={onHostLayout}"));
  assert.ok(data.includes('displayMode === "cards"'));
  assert.ok(data.includes("getColumnLabel"));
  assert.ok(data.includes("ListEmptyComponent"));
  assert.ok(grid.includes("onLayout={event=>"));
  assert.ok(grid.includes('metrics.compact?"column":"row"'));
  assert.ok(grid.includes("onWindowChangeRef"));
  assert.ok(!data.includes("useWindowDimensions"));
  assert.ok(!grid.includes("useWindowDimensions"));
});

test("portrait-landscape and foldable split resize retain selected sheet region",()=>{
  const wide={rowHeight:32,columnWidth:112,rowHeaderWidth:52};
  const compact={rowHeight:44,columnWidth:112,rowHeaderWidth:48};
  const before={x:52+112*23.5,y:32*800.25};
  const after=reanchorSheetScroll(before,wide,compact);
  assert.equal(after.x,48+112*23.5);
  assert.equal(after.y,44*800.25);
  const back=reanchorSheetScroll(after,compact,wide);
  assert.deepEqual(back,before);
  assert.deepEqual(reanchorSheetScroll({x:0,y:0},wide,compact),{x:0,y:0});
  assert.throws(()=>reanchorSheetScroll({x:0,y:0},{...wide,rowHeight:0},compact),/anchors/);
});

const componentSources=(dir=resolve(root,"src/components"))=>
  readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()
    ? componentSources(resolve(dir,e.name))
    : /\.tsx?$/.test(e.name)?[resolve(dir,e.name)]:[]);
test("every semantic token a component uses is documented for consumers",()=>{
  const doc=readFileSync(resolve(root,"../../docs/THEME_TOKENS.md"),"utf8");
  const documented=new Set([...doc.matchAll(/--(?:color|radius)-([a-z-]+)/g)].map(m=>m[1]));
  const tokenClass=/\b(?:bg|text|border|ring|rounded)-((?:on-)?(?:primary|danger)|surface-(?:raised|sunken)|text(?:-muted)?|accent|border|focus|control|card)\b/g;
  const used=new Set();
  for(const file of componentSources()){
    for(const m of readFileSync(file,"utf8").matchAll(tokenClass))used.add(m[1]);
  }
  assert.ok(used.size>5);
  for(const token of used)assert.ok(documented.has(token),`Undocumented token ${token}`);
});
test("interactive controls keep screen-reader semantics",()=>{
  const read=p=>readFileSync(resolve(root,"src/components",p),"utf8");
  const rail=read("NavigationRail.tsx");
  assert.ok(rail.includes('accessibilityRole="tablist"'));
  assert.ok(rail.includes('accessibilityRole="tab"'));
  assert.ok(!rail.includes('accessibilityRole="menu"'));
  const wave=read("forge/WaveformLane.tsx");
  assert.ok(!/onSeekNormalized\((?:0|1)\)/.test(wave),"a11y steps must not jump to clip ends");
  assert.ok(wave.includes("accessibilityStep"));
  const table=read("data/DataTable.tsx");
  assert.ok(!table.includes("accessibilityLabel={`Record "),"record cards must not hide field values");
  assert.ok(!table.includes("Open record"));
});
test("components take colors from theme tokens, not hardcoded hex values",()=>{
  for(const file of componentSources()){
    const text=readFileSync(file,"utf8");
    const hex=text.match(/["'`]#[0-9A-Fa-f]{3,8}["'`]/g);
    assert.equal(hex,null,`${file} hardcodes ${hex}`);
  }
});
