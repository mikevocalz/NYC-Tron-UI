import {useRef} from "react";
import {Button,Text,View} from "react-native";
import {useStore} from "zustand";
import {TronNavigationView} from "@nyc-tron/windows-fluent-fabric";
import {createNavigationStore,destinations} from "./route-store";

export function App(){
 const ref=useRef<ReturnType<typeof createNavigationStore>|null>(null);
 if(!ref.current)ref.current=createNavigationStore();
 const state=useStore(ref.current);
 return <View style={{flex:1,flexDirection:"row"}}>
  <TronNavigationView
   items={destinations}
   selectedId={state.selectedId}
   paneOpen={state.paneOpen}
   paneMode="expanded"
   paneTitle="NYC-Tron"
   settingsVisible
   onSelectionRequested={state.requestRoute}
   onPaneOpenRequested={state.setPaneOpen}
   onSettingsRequested={state.openSettings}
   onNativeError={state.reportNativeError}
   style={{alignSelf:"stretch"}}
  />
  <View style={{flex:1,padding:24,gap:16}}>
   <Text accessibilityRole="header">Windows navigation acceptance</Text>
   <Text selectable accessibilityLiveRegion="polite">{state.status}</Text>
   <Text selectable>Committed route: {state.selectedId}</Text>
   {state.nativeError!==null&&<Text selectable accessibilityLiveRegion="assertive">{state.nativeError}</Text>}
   <Text selectable>Choose Workspace, then accept or reject the request. Native selection should follow only the committed route.</Text>
   <Button title="Accept navigation" accessibilityLabel="Accept navigation" disabled={state.pendingId===null} onPress={state.acceptRoute}/>
   <Button title="Reject navigation" accessibilityLabel="Reject navigation" disabled={state.pendingId===null} onPress={state.rejectRoute}/>
   <Button title={state.paneOpen?"Close pane":"Open pane"} accessibilityLabel={state.paneOpen?"Close pane":"Open pane"} onPress={()=>state.setPaneOpen(!state.paneOpen)}/>
   {state.settingsOpen&&<View accessibilityRole="summary">
    <Text selectable>Settings opened without changing the committed route.</Text>
    <Button title="Close settings" accessibilityLabel="Close settings" onPress={state.closeSettings}/>
   </View>}
  </View>
 </View>;
}
