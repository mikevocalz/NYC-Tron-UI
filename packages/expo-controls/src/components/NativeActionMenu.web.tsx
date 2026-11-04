import { useRef } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { NativeActionMenuProps } from "./NativeActionMenu.types";
import { findEnabledMenuAction, normalizeMenuActions, type TronMenuAction } from "./menu-model";

/**
 * Working RN web presentation. Expo's MenuView intentionally does nothing
 * on web; never ship a web menu whose actions cannot fire.
 * Desktop Windows/macOS require separate native host adapters.
 */
export function NativeActionMenu({
  trigger,actions,onAction,longPress=false,disabled=false,accessibilityLabel,testID
}:NativeActionMenuProps){
  const local=useRef<StoreApi<{open:boolean}>|null>(null);
  if(!local.current)local.current=createStore(()=>({open:false}));
  const store=local.current;
  const open=useStore(store,state=>state.open);
  const normalized=normalizeMenuActions(actions);
  const canOpen=!disabled&&normalized.length>0;
  const close=()=>store.setState({open:false});
  const run=(id:string)=>{
    if(!findEnabledMenuAction(actions,id))return;
    close();
    onAction(id);
  };
  const render=(entries:readonly TronMenuAction[],depth:number):React.ReactNode =>
    entries.map(action=><View key={action.id}>
      {action.subactions?.length?<>
        <Text accessibilityRole="header" style={{paddingHorizontal:16,paddingTop:10,fontWeight:"700"}}>
          {action.title}
        </Text>
        {render(action.subactions,depth+1)}
      </>:<Pressable accessibilityRole="menuitem"
        accessibilityLabel={action.title}
        accessibilityState={{disabled:!!action.disabled,checked:action.checked}}
        disabled={!!action.disabled}
        onPress={()=>run(action.id)}
        style={{minHeight:44,flexDirection:"row",alignItems:"center",paddingHorizontal:16,
          paddingLeft:16+depth*8,opacity:action.disabled?.4:1,gap:12}}>
        <Text style={{flex:1}}>{action.title}</Text>
        {action.checked?<Text accessibilityElementsHidden>✓</Text>:null}
      </Pressable>}
    </View>);
  return <View testID={testID}>
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled:!canOpen,expanded:open}}
      disabled={!canOpen}
      onPress={!longPress?()=>store.setState({open:true}):undefined}
      onLongPress={longPress?()=>store.setState({open:true}):undefined}>
      {trigger}
    </Pressable>
    <Modal transparent visible={open} animationType="fade"
      accessibilityViewIsModal onRequestClose={close}>
      <View style={{flex:1,justifyContent:"center",padding:24}}>
        <Pressable accessibilityLabel="Close menu" accessibilityRole="button" onPress={close}
          style={{position:"absolute",left:0,right:0,top:0,bottom:0,
            backgroundColor:"rgba(0,0,0,0.32)"}}/>
        <View style={{maxHeight:"75%",borderRadius:12,backgroundColor:"#fff",
          overflow:"hidden",minWidth:220}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {render(actions,0)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>;
}
