import {useEffect,useRef,useLayoutEffect} from "react";
import {Button,Text,View} from "react-native";
import {useStore} from "zustand";
import {WindowsNavigationHost,createWindowsNavigationBinding} from "@nyc-tron/windows-fluent-fabric/navigation-host";
import {createWindowsNavigationController} from "@nyc-tron/windows-fluent/controller";
import {createNavigationStore,destinations} from "./route-store";
import {desktop,connectDesktop,failDesktop,openDocument,restoreDocument,changeDraft,saveDraft} from "./desktop-store";

function Navigation({store}:{store:ReturnType<typeof createNavigationStore>}) {
 const state=useStore(store);
 const ref=useRef<ReturnType<typeof createWindowsNavigationBinding>|null>(null);
 if(!ref.current)ref.current=createWindowsNavigationBinding();
 const binding=ref.current;
 useLayoutEffect(()=>{
  const props=(s:ReturnType<typeof store.getState>)=>({items:destinations,selectedId:s.selectedId,paneOpen:s.paneOpen,paneMode:"expanded" as const,paneTitle:"NYC-Tron",settingsVisible:true});
  const initial=store.getState();
  const controller=createWindowsNavigationController(binding.transport,props(initial),{
   onSelectionRequested:initial.requestRoute,onPaneOpenRequested:initial.setPaneOpen,onSettingsRequested:initial.openSettings,
  });
  const off=store.subscribe(next=>controller.update(props(next)));
  return ()=>{off();controller.dispose();};
 },[binding,store]);
 return <WindowsNavigationHost binding={binding} onNativeError={state.reportNativeError} style={{alignSelf:"stretch"}}/>;
}

export function DocumentWindow({windowId}:{windowId:string}) {
 const state=useStore(desktop);
 return <View style={{flex:1,padding:24,gap:16}}>
  <Text accessibilityRole="header">Native document window</Text>
  <Text>Window identity: {windowId}</Text>
  <Text accessibilityLiveRegion="polite">Shared draft: {state.title}</Text>
  <Text>The document store and undo owner stay above both native surfaces.</Text>
  <Button title="Save shared draft" accessibilityLabel="Save shared draft" onPress={saveDraft}/>
 </View>;
}

export function App(){
 const ref=useRef<ReturnType<typeof createNavigationStore>|null>(null);
 if(!ref.current)ref.current=createNavigationStore();
 const state=useStore(ref.current);
 const document=useStore(desktop);
 useEffect(()=>{void connectDesktop().catch(failDesktop);},[]);
 return <View style={{flex:1,flexDirection:"row"}}>
  <Navigation store={ref.current}/>
  <View style={{flex:1,padding:24,gap:16}}>
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
   {state.settingsOpen&&<View accessibilityRole="summary">
    <Text selectable>Settings opened without changing the committed route.</Text>
    <Button title="Close settings" accessibilityLabel="Close settings" onPress={state.closeSettings}/>
   </View>}
  </View>
 </View>;
}
