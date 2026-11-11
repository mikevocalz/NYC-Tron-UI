import { useRef, useLayoutEffect, type ReactNode, type ElementRef } from "react";
import { Modal, Pressable, ScrollView, Text, View, type PressableProps } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { NativeActionMenuProps } from "./NativeActionMenu.types.ts";
import { cycleFocusTarget } from "@nyc-tron/ui/components/overlays/focus-cycle";
import { useRestoreFocus } from "@nyc-tron/ui/components/overlays/focus-restore";
import { enabledMenuLeaves, findEnabledMenuAction, menuFocusTarget, normalizeMenuActions, type TronMenuAction } from "./menu-model.ts";

type MenuKeyEvent = Parameters<NonNullable<PressableProps["onKeyDown"]>>[0];
// This file runs on RN web: the native event is a browser KeyboardEvent.
const keyData=(event:MenuKeyEvent)=>event.nativeEvent as {
  key:string;shiftKey?:boolean;altKey?:boolean;ctrlKey?:boolean;metaKey?:boolean
};

/**
 * Working RN web presentation. Expo's MenuView intentionally does nothing
 * on web; never ship a web menu whose actions cannot fire.
 * Desktop Windows/macOS require separate native host adapters.
 */
export function NativeActionMenu({
  scope="native-actions",trigger,actions,onAction,longPress=false,disabled=false,accessibilityLabel,testID
}:NativeActionMenuProps){
  const local=useRef<StoreApi<{open:boolean}>|null>(null);
  if(!local.current)local.current=createStore(()=>({open:false}));
  const store=local.current;
  const open=useStore(store,state=>state.open);
  // Every close path (Escape, selection, backdrop) returns focus to the trigger.
  useRestoreFocus(open);
  const itemRefs=useRef(new Map<string,ElementRef<typeof View>>());
  const initialKey=useRef("Home");
  const normalized=normalizeMenuActions(actions);
  const canOpen=!disabled&&normalized.length>0;
  const committed=useRef<{scope:string;disabled:boolean;actions:typeof actions;onAction:typeof onAction}|null>(null);
  useLayoutEffect(()=>{committed.current={scope,disabled,actions,onAction};});
  useLayoutEffect(()=>{store.setState({open:false});},[scope,disabled,store]);
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const current=()=>canOpen&&committed.current?.scope===scope?committed.current:null;
  const close=()=>store.setState({open:false});
  const focus=(key:string,currentId?:string)=>{
    const id=menuFocusTarget(actions,currentId,key);
    if(id)itemRefs.current.get(id)?.focus();
  };
  const show=(key="Home")=>{
    if(!current())return;
    initialKey.current=key;
    store.setState({open:true});
  };
  const onMenuKey=(event:MenuKeyEvent,id:string)=>{
    const {key,shiftKey,altKey,ctrlKey,metaKey}=keyData(event);
    if(altKey||ctrlKey||metaKey)return;
    // Tab and Shift+Tab cycle through the enabled items and never leave the open menu.
    if(key==="Tab"){
      event.preventDefault();event.stopPropagation();
      const next=cycleFocusTarget(enabledMenuLeaves(actions).map(action=>action.id),id,!!shiftKey);
      if(next)itemRefs.current.get(next)?.focus();
      return;
    }
    if(key==="Escape"){
      event.preventDefault();event.stopPropagation();close();return;
    }
    // RN web's Pressable only synthesizes Space for button roles, not menu items.
    if(key===" "||key==="Spacebar"){
      event.preventDefault();event.stopPropagation();run(id);return;
    }
    if(menuFocusTarget(actions,id,key)){
      event.preventDefault();event.stopPropagation();focus(key,id);
    }
  };
  const run=(id:string)=>{
    const p=current();if(!p||!store.getState().open||!findEnabledMenuAction(p.actions,id))return;
    close();p.onAction(id);
  };
  // A disabled group disables everything under it, matching findEnabledMenuAction,
  // so assistive tech never announces an item that cannot fire.
  const render=(entries:readonly TronMenuAction[],depth:number,groupDisabled=false):ReactNode =>
    entries.map(action=><View key={action.id}>
      {action.subactions?.length?<>
        <Text accessibilityRole="header" style={{paddingHorizontal:16,paddingTop:10,fontWeight:"700"}}>
          {action.title}
        </Text>
        {render(action.subactions,depth+1,groupDisabled||!!action.disabled)}
      </>:<Pressable accessibilityRole="menuitem"
        ref={node=>{if(node)itemRefs.current.set(action.id,node);else itemRefs.current.delete(action.id);}}
        // RN web forwards the ARIA role; core RN's Role union omits menuitemcheckbox.
        {...{role:(action.checked===undefined?"menuitem":"menuitemcheckbox") as PressableProps["role"],
          onKeyDown:(event:MenuKeyEvent)=>onMenuKey(event,action.id)}}
        aria-checked={action.checked}
        accessibilityLabel={action.title}
        accessibilityState={{disabled:groupDisabled||!!action.disabled,checked:action.checked}}
        disabled={groupDisabled||!!action.disabled}
        onPress={()=>run(action.id)}
        style={{minHeight:44,flexDirection:"row",alignItems:"center",paddingHorizontal:16,
          paddingLeft:16+depth*8,opacity:groupDisabled||action.disabled ? 0.4 : 1,gap:12}}>
        <Text style={{flex:1}} {...{className: action.destructive ? "text-danger" : "text-text"}}>{action.title}</Text>
        {action.checked?<Text accessibilityElementsHidden>✓</Text>:null}
      </Pressable>}
    </View>);
  return <View testID={testID}>
    <Pressable style={{minWidth:44,minHeight:44,justifyContent:"center"}} accessibilityRole="button" accessibilityLabel={accessibilityLabel}
      aria-expanded={open}
      {...{"aria-haspopup":"menu" as const,onKeyDown:(event:MenuKeyEvent)=>{
        const {key,altKey,ctrlKey,metaKey}=keyData(event);
        if(!canOpen||altKey||ctrlKey||metaKey)return;
        if(key==="ArrowDown"||key==="ArrowUp"){
          event.preventDefault();show(key==="ArrowUp"?"End":"Home");
        }
      }}}
      accessibilityState={{disabled:!canOpen,expanded:open}}
      disabled={!canOpen}
      // Web keyboard and screen-reader activation only produce a press, so a
      // long-press menu must also open on press or it is unreachable there.
      onPress={()=>show()}
      onLongPress={longPress?()=>show():undefined}>
      {trigger}
    </Pressable>
    <Modal transparent visible={open}
      // A fading web Modal keeps its focus trap live while it fades and pulls
      // the restored focus back in; close instantly.
      animationType="none"
      accessibilityViewIsModal onRequestClose={close} onShow={()=>focus(initialKey.current)}>
      <View style={{flex:1,justifyContent:"center",padding:24}}>
        <Pressable accessibilityLabel="Close menu" accessibilityRole="button" onPress={close}
          // Pointer-only: Escape closes from the keyboard, so Tab never lands here.
          focusable={false}
          {...{className:"bg-text/30"}} style={{position:"absolute",left:0,right:0,top:0,bottom:0}}/>
        <View {...{className:"rounded-control bg-surface-raised border border-border"}}
          style={{maxHeight:"75%",overflow:"hidden",minWidth:220}}>
          <ScrollView accessibilityRole="menu" accessibilityLabel={accessibilityLabel}
            keyboardShouldPersistTaps="handled">
            {render(actions,0)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>;
}

