import test from "node:test";
import assert from "node:assert/strict";
import { resolveNavigationShell, windowsPaneMode } from "../src/navigation.ts";
import { validateSpatialPanelSet } from "../src/spatial.ts";
import { validateTheme } from "../src/theme.ts";

test("native foldables retain physical-right navigation on narrow covers and RTL", () => {
  for (const isRTL of [true,false]) {
    const shell = resolveNavigationShell({
      runtime: "native", platform: "android", family: "foldable", isRTL
    });
    assert.equal(shell.edge, "right");
    assert.equal(shell.kind, "physical-right-rail");
  }
});
test("unknown with retained foldable capability stays on right rail", () => {
  const shell=resolveNavigationShell({
    runtime:"native",platform:"android",family:"unknown",lastKnownFamily:"dual-screen"
  });
  assert.equal(shell.kind, "physical-right-rail");
});
test("unknown native capability must not be misclassified as a phone", () => {
  assert.equal(resolveNavigationShell({runtime:"native",platform:"android",family:"unknown"}).kind,"unresolved");
});
test("native Windows desktop uses left collapsible drawer, not Android rail",()=>{
  assert.deepEqual(resolveNavigationShell({
    runtime:"native",platform:"windows",family:"desktop",isRTL:true
  }),{kind:"windows-drawer",edge:"left",collapsible:true,compactTabs:false});
  assert.equal(windowsPaneMode(1000,{compact:600,expanded:900}),"expanded");
  assert.equal(windowsPaneMode(700,{compact:600,expanded:900}),"compact");
  assert.equal(windowsPaneMode(400,{compact:600,expanded:900}),"minimal");
  assert.throws(()=>windowsPaneMode(-1,{compact:600,expanded:900}),/Invalid/);
});
test("macOS sidebar does not change Android and web shells",()=>{
  assert.equal(resolveNavigationShell({runtime:"native",platform:"macos",family:"desktop"}).kind,"macos-sidebar");
  assert.equal(resolveNavigationShell({runtime:"native",platform:"ios",family:"phone"}).kind,"bottom-tabs");
  assert.deepEqual(resolveNavigationShell({
    runtime:"web",family:"foldable",compactWeb:true,isRTL:true
  }),{kind:"web-header",edge:null,compactTabs:true});
});
test("spatial contracts reject duplicate IDs and invalid units",()=>{
  const panel={id:"lesson",role:"stage",anchor:"world",units:"meters",width:1,height:1,distance:2};
  assert.doesNotThrow(()=>validateSpatialPanelSet([panel]));
  assert.throws(()=>validateSpatialPanelSet([panel,panel]),/Duplicate/);
  assert.throws(()=>validateSpatialPanelSet([{...panel,width:-3}]),/positive meters/);
});
test("native theme contracts are semantic and app-owned",()=>{
  const theme={
    colors:{background:"var(--color-surface)",surface:"#fff",foreground:"#000",
      muted:"#444",border:"#333",primary:"#ff0",onPrimary:"#000",focus:"#3366ff"},
    shape:{controlRadius:0,surfaceRadius:12,borderWidth:2},
    density:"comfortable",motion:{fastMs:100,standardMs:180}
  };
  assert.equal(validateTheme(theme).colors.background,"var(--color-surface)");
  assert.throws(()=>validateTheme({...theme,shape:{...theme.shape,borderWidth:-1}}),/metric/);
});
