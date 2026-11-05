import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createWindowsNavigationController } from "../src/controller.ts";
import { validateWindowsNavigationState } from "../src/types.ts";

const sample = {
  items: [
    {id:"home",label:"Home",glyph:"\ue80f"},
    {id:"lessons",label:"Lessons",glyph:"\ue8f1"},
    {id:"disabled",label:"Unavailable",disabled:true},
  ],
  footerItems:[{id:"settings",label:"Settings"}],
  selectedId:"home",
  paneMode:"compact",
  paneOpen:false,
  paneTitle:"Moyo Learn",
  settingsVisible:true,
};
function createMockHost() {
 const calls=[];
 let handler=null;
 const host = {
   setDestinations:(items,footer)=>calls.push(["items",items,footer]),
   setSelectedId:id=>calls.push(["selection",id]),
   setPaneMode:mode=>calls.push(["mode",mode]),
   setPaneOpen:open=>calls.push(["open",open]),
   setPaneTitle:title=>calls.push(["title",title]),
   setSettingsVisible:visible=>calls.push(["settings",visible]),
   subscribe:cb=>{
     handler=cb;
     return ()=>{handler=null;};
   },
 };
 return {host,calls,fire:event=>handler?.(event),isSubscribed:()=>handler!==null};
}
test("initial navigation state is sent once and not double-routed",()=>{
 const mock=createMockHost(), events=[];
 const controller=createWindowsNavigationController(mock.host,sample,{
   onSelectionRequested:id=>events.push(["selection",id]),
   onPaneOpenRequested:open=>events.push(["pane",open]),
   onSettingsRequested:()=>events.push(["settings"]),
 });
 assert.equal(mock.calls.length,6);
 mock.fire({type:"destinationInvoked",id:"home"});
 mock.fire({type:"destinationInvoked",id:"disabled"});
 mock.fire({type:"destinationInvoked",id:"absent"});
 mock.fire({type:"destinationInvoked",id:"lessons"});
 mock.fire({type:"paneOpenChanged",open:true});
 mock.fire({type:"settingsInvoked"});
 assert.deepEqual(events,[["selection","lessons"],["pane",true],["settings"]]);
 controller.update({...sample,selectedId:"lessons",paneOpen:true});
 assert.deepEqual(mock.calls.slice(-2),[["selection","lessons"],["open",true]]);
 controller.dispose();
 assert.equal(mock.isSubscribed(),false);
 mock.fire({type:"destinationInvoked",id:"settings"});
 assert.equal(events.length,3);
 assert.throws(()=>controller.update(sample),/disposed/);
});
test("updates retain app-controlled route and skip redundant host renders",()=>{
 const mock=createMockHost();
 const controller=createWindowsNavigationController(mock.host,sample,{
   onSelectionRequested:()=>{},onPaneOpenRequested:()=>{}
 });
 controller.update(sample);
 assert.equal(mock.calls.length,6);
 controller.update({...sample,paneMode:"minimal"});
 assert.deepEqual(mock.calls.at(-1),["mode","minimal"]);
 controller.dispose();
});
test("invalid destination IDs, unknown selections and invalid modes fail fast",()=>{
 assert.throws(()=>validateWindowsNavigationState({...sample,
  footerItems:[{id:"home",label:"Repeated"}]}),/unique/);
 assert.throws(()=>validateWindowsNavigationState({...sample,selectedId:"bad"}),/must exist/);
 assert.throws(()=>validateWindowsNavigationState({...sample,paneMode:"top"}),/pane/);
});
test("native shell is real WinUI NavigationView outside Fabric composition",()=>{
 const base="packages/windows-fluent/windows/NYCTron.Fluent.WinUI3/";
 const xaml=readFileSync(base+"TronNavigationShell.xaml","utf8");
 const implementation=readFileSync(base+"TronNavigationShell.xaml.cs","utf8");
 assert.match(xaml,/<NavigationView\s+x:Name="Navigation"/);
 assert.match(xaml,/PaneOpened="OnPaneOpened"/);
 assert.match(xaml,/ItemInvoked="OnItemInvoked"/);
 for(const token of ["NavigationViewPaneDisplayMode.Left",
  "NavigationViewPaneDisplayMode.LeftCompact",
  "NavigationViewPaneDisplayMode.LeftMinimal",
  "NavigationViewPaneDisplayMode.Auto"]){
   assert.ok(implementation.includes(token),token);
 }
 assert.match(implementation,/SetHostedContent\(UIElement\?/);
 assert.doesNotMatch(implementation,/Windows\.UI\.Xaml/);
});
