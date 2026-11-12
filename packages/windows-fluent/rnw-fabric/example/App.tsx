import {useEffect,useRef,useLayoutEffect} from "react";
import {Button,Text,View} from "react-native";
import {useStore} from "zustand";
import {createAcceptanceStore} from "./acceptance-store";
import {beginInspectorMount} from "./overlay-store";
import {NativeOverlays} from "./NativeOverlays";
import {NativeDragSourcePanel,NativeDragTargetPanel} from "./NativeDrag";
const acceptance=createAcceptanceStore(beginInspectorMount);
import {WindowsNavigationHost,createWindowsNavigationBinding} from "@nyc-tron/windows-fluent-fabric/navigation-host";
import {createWindowsNavigationController} from "@nyc-tron/windows-fluent/controller";
import {createNavigationStore,destinations} from "./route-store";
import {desktop,connectDesktop,failDesktop,openDocument,restoreDocument,changeDraft,saveDraft,markDraftUnsaved,extendDocumentTitleBar,runDocumentChrome} from "./desktop-store";

function Navigation({store}:{store:ReturnType<typeof createNavigationStore>}) {
 const state=useStore(store);
 const ref=useRef<ReturnType<typeof createWindowsNavigationBinding>|null>(null);
 if(!ref.current)ref.current=createWindowsNavigationBinding();
 const binding=ref.current;
 const settingsWasOpen=useRef(state.settingsOpen);
 useLayoutEffect(()=>{
  const props=(s:ReturnType<typeof store.getState>)=>({items:destinations,selectedId:s.selectedId,paneOpen:s.paneOpen,paneMode:"expanded" as const,paneTitle:"NYC-Tron",settingsVisible:true});
  const initial=store.getState();
  const controller=createWindowsNavigationController(binding.transport,props(initial),{
   onSelectionRequested:initial.requestRoute,onPaneOpenRequested:initial.setPaneOpen,onSettingsRequested:initial.openSettings,
  });
  const off=store.subscribe(next=>controller.update(props(next)));
  return ()=>{off();controller.dispose();};
 },[binding,store]);
 useLayoutEffect(()=>{
  if(settingsWasOpen.current&&!state.settingsOpen)binding.focusSettings();
  settingsWasOpen.current=state.settingsOpen;
 },[binding,state.settingsOpen]);
 return <WindowsNavigationHost binding={binding} onNativeError={state.reportNativeError} style={{alignSelf:"stretch",direction:state.direction}}/>;
}

// With the extended style the content starts at the top edge of the window.
// This strip keeps the system caption buttons' space clear and stays draggable
// natively; it draws no buttons of its own.
function DocumentTitleBar() {
 const titleBar=useStore(desktop,s=>s.titleBar);
 if(titleBar?.style!=="extended")return null;
 return <View accessible accessibilityLabel="Document title bar" style={{height:titleBar.height,paddingLeft:Math.max(12,titleBar.leading),paddingRight:titleBar.trailing,justifyContent:"center"}}>
  <Text numberOfLines={1}>NYC-Tron Document</Text>
 </View>;
}

export function DocumentWindow({windowId}:{windowId:string}) {
 const state=useStore(desktop);
 return <View style={{flex:1}}>
 <DocumentTitleBar/>
 <View style={{flex:1,padding:24,gap:16}}>
  <Text accessibilityRole="header">Native document window</Text>
  <View style={{flexDirection:"row",gap:8}}>
   <Button title="Title bar close" accessibilityLabel="Title bar close" onPress={()=>runDocumentChrome("close")}/>
   <Button title="Title bar minimize" accessibilityLabel="Title bar minimize" onPress={()=>runDocumentChrome("minimize")}/>
  </View>
  <Text>Window identity: {windowId}</Text>
  <Text accessibilityLiveRegion="polite">Shared draft: {state.title}</Text>
  <Text>The document store and undo owner stay above both native surfaces.</Text>
  <NativeDragTargetPanel windowId={windowId}/>
  <Button title="Save shared draft" accessibilityLabel="Save shared draft" onPress={saveDraft}/>
 </View>
 </View>;
}

export function App(){
 const ref=useRef<ReturnType<typeof createNavigationStore>|null>(null);
 if(!ref.current)ref.current=createNavigationStore();
 const state=useStore(ref.current);
 const document=useStore(desktop);
 const {stage,overlayMountKey}=useStore(acceptance);
 useEffect(()=>{void connectDesktop().catch(failDesktop);},[]);
 return <View style={{flex:1,flexDirection:"row",direction:"ltr"}}>
  <Navigation store={ref.current}/>
  <View style={{flex:1,padding:16,gap:10}}>
   <View style={{flexDirection:"row",gap:8,flexWrap:"wrap"}}>
    <Button title="Show lifecycle checks" accessibilityLabel="Show lifecycle checks" onPress={()=>acceptance.getState().showStage("lifecycle")}/>
    <Button title="Show native overlay checks" accessibilityLabel="Show native overlay checks" onPress={()=>acceptance.getState().showStage("overlays")}/>
    <Button title="Show native drag checks" accessibilityLabel="Show native drag checks" onPress={()=>{state.setPaneOpen(false);acceptance.getState().showStage("drag");}}/>
    <Button title="Show native navigation checks" accessibilityLabel="Show native navigation checks" onPress={()=>{state.setPaneOpen(true);acceptance.getState().showStage("navigation");}}/>
   </View>
   {stage==="overlays"&&<NativeOverlays key={overlayMountKey} mountKey={overlayMountKey}/>}
   {stage==="drag"&&<NativeDragSourcePanel/>}
   {stage==="navigation"&&<View style={{gap:12}}>
    <Text accessibilityRole="header">Native navigation accessibility</Text>
    <Text>Navigation direction: {state.direction}</Text>
    <Text>Committed route: {state.selectedId}</Text>
    <Button title={state.direction==="ltr"?"Use RTL navigation":"Use LTR navigation"} accessibilityLabel={state.direction==="ltr"?"Use RTL navigation":"Use LTR navigation"} onPress={()=>state.setDirection(state.direction==="ltr"?"rtl":"ltr")}/>
    <Button title={state.paneOpen?"Close pane":"Open pane"} accessibilityLabel={state.paneOpen?"Close pane":"Open pane"} onPress={()=>state.setPaneOpen(!state.paneOpen)}/>
    {state.settingsOpen&&<View accessibilityRole="summary">
     <Text>Settings opened without changing the committed route.</Text>
     <Button title="Close settings" accessibilityLabel="Close settings" onPress={state.closeSettings}/>
    </View>}
   </View>}
   <View style={{display:stage==="lifecycle"?"flex":"none",gap:10}}>
   <Text accessibilityRole="header">Windows navigation acceptance</Text>
   <Text selectable accessibilityLiveRegion="polite">{state.status}</Text>
   <Text selectable>Committed route: {state.selectedId}</Text>
   {state.nativeError!==null&&<Text selectable accessibilityLiveRegion="assertive">{state.nativeError}</Text>}
   <Text selectable>Choose Workspace, then accept or reject the request. Native selection should follow only the committed route.</Text>
   <Button title="Accept navigation" accessibilityLabel="Accept navigation" disabled={state.pendingId===null} onPress={state.acceptRoute}/>
   <Button title="Reject navigation" accessibilityLabel="Reject navigation" disabled={state.pendingId===null} onPress={state.rejectRoute}/>
   <Button title={state.paneOpen?"Close pane":"Open pane"} accessibilityLabel={state.paneOpen?"Close pane":"Open pane"} onPress={()=>state.setPaneOpen(!state.paneOpen)}/>
   <Text accessibilityLiveRegion="polite">{document.status}</Text>
   <Text>Native windows: {document.windows.windows.length}</Text>
   <Text>Minimized windows: {document.windows.windows.filter(w=>w.status==="minimized").length}</Text>
   <Text>Shared draft: {document.title}</Text>
   <Button title="Open document window" accessibilityLabel="Open document window" disabled={!document.ready} onPress={()=>void openDocument().catch(failDesktop)}/>
   <Button title="Change shared draft" accessibilityLabel="Change shared draft" onPress={changeDraft}/>
   <Button title="Save shared draft" accessibilityLabel="Save shared draft" onPress={saveDraft}/>
   <Button title="Restore document" accessibilityLabel="Restore document" onPress={()=>void restoreDocument().catch(failDesktop)}/>
   <View style={{flexDirection:"row",gap:12,flexWrap:"wrap"}}>
    <Text>{`Title bar style: ${document.titleBar?document.titleBar.style:"none"}`}</Text>
    <Text>{`Close guard decisions: ${document.closeDecisions}`}</Text>
    {(["close","minimize","restore"] as const).map(command=><Text key={command}>{`Title bar ${command} result: ${document.chrome[command]}`}</Text>)}
   </View>
   <View style={{flexDirection:"row",gap:8,flexWrap:"wrap"}}>
   <Button title="Use custom title bar" accessibilityLabel="Use custom title bar" onPress={()=>void extendDocumentTitleBar().catch(failDesktop)}/>
   <Button title="Mark draft unsaved" accessibilityLabel="Mark draft unsaved" onPress={markDraftUnsaved}/>
   <Button title="Title bar restore" accessibilityLabel="Title bar restore" onPress={()=>runDocumentChrome("restore")}/>
   </View>
   {state.settingsOpen&&<View accessibilityRole="summary">
    <Text selectable>Settings opened without changing the committed route.</Text>
    <Button title="Close settings" accessibilityLabel="Close settings" onPress={state.closeSettings}/>
   </View>}
   </View>
   {stage!=="lifecycle"&&stage!=="navigation"&&<View style={{gap:8}}>
    <Text accessibilityLiveRegion="polite">{document.status}</Text>
    <Text>Native windows: {document.windows.windows.length}</Text>
    <Button title="Open document window" accessibilityLabel="Open document window" onPress={()=>void openDocument().catch(failDesktop)}/>
   </View>}
  </View>
 </View>;
}
