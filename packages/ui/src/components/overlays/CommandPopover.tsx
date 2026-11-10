import {useRef,useMemo,useLayoutEffect,type ComponentRef} from "react";
import {Modal,Platform,Pressable,ScrollView,Text,View,type PressableProps} from "react-native";
import {placePopover,hasUsableRegion,type Rect2D} from "./popover-position.ts";
import {cycleFocusTarget} from "./focus-cycle.ts";
import {useRestoreFocus} from "./focus-restore.ts";
import {joinClasses} from "../styles.ts";
import type { CommandMenuItem } from "@nyc-tron/core/overlays";
export type { CommandMenuItem } from "@nyc-tron/core/overlays";
export interface CommandPopoverProps{
 scope?:string;
 visible:boolean;
 onDismiss:()=>void;
 onSelect:(id:string)=>void;
 anchor:Rect2D;
 /** Use the usable nonoccluded regions from the foldable layout owner; never infer a hinge from width. */
 usableRegions:readonly Rect2D[];
 items:readonly CommandMenuItem[];
 width?:number;
 maxHeight?:number;
 className?:string;
 unstyled?:boolean;
 /** Optional overrides. When omitted the theme tokens (surface-raised, border,
  * text, text-muted, danger) apply, so light and dark follow the app theme. */
 surfaceColor?:string;
 borderColor?:string;
 textColor?:string;
 mutedTextColor?:string;
 dangerColor?:string;
 accessibilityLabel?:string;
 /** Surface ID; menu items append `-item-<id>` for native acceptance. */
 testID?:string;
}
type KeyEvent=Parameters<NonNullable<PressableProps["onKeyDown"]>>[0];
// Web and desktop hosts use the same key fields.
const keyOf=(event:KeyEvent)=>(event.nativeEvent??event) as unknown as {
 key:string;shiftKey?:boolean;altKey?:boolean;ctrlKey?:boolean;metaKey?:boolean};

/**
 * RN Modal-backed portable overlay. Genuine WinUI/AppKit/SwiftUI/Compose menu adapters are separate.
 * Web keyboard: focus starts on the first enabled item, arrows/Home/End move,
 * Tab and Shift+Tab cycle inside the menu, Escape closes, and focus returns to
 * whatever opened it.
 */
export function CommandPopover({scope="commands",visible,onDismiss,onSelect,anchor,usableRegions,items,width=268,maxHeight=420,
 className,unstyled=false,surfaceColor,borderColor,textColor,mutedTextColor,dangerColor,
 accessibilityLabel="Commands",testID}:CommandPopoverProps){
 const styled=!unstyled;
 const desktop=Platform.OS==="web"||String(Platform.OS)==="qnx"||String(Platform.OS)==="marathon";
 const refs=useRef(new Map<string,ComponentRef<typeof View>>());
 const available=hasUsableRegion(usableRegions);
 useRestoreFocus(visible&&available);
 const position=available?placePopover(anchor,usableRegions,width,Math.min(maxHeight,Math.max(56,items.length*60+16))):undefined;
 const token=useMemo(()=>({}),[scope,visible]);
 const settled=useRef<object|null>(null);
 const committed=useRef<{token:object;available:boolean;items:typeof items;onSelect:typeof onSelect;onDismiss:typeof onDismiss}|null>(null);
 useLayoutEffect(()=>{committed.current={token,available,items,onSelect,onDismiss};});
 useLayoutEffect(()=>()=>{committed.current=null;},[]);
 const current=()=>visible&&settled.current!==token&&committed.current?.token===token&&committed.current.available?committed.current:null;
 const dismiss=()=>{const p=current();if(p){settled.current=token;p.onDismiss();}};
 const select=(id:string)=>{const p=current();if(p?.items.some(i=>i.id===id&&!i.disabled)){
   settled.current=token;try{p.onSelect(id);}finally{p.onDismiss();}
 }};
 const enabledIds=items.filter(item=>!item.disabled).map(item=>item.id);
 const focusItem=(id:string|undefined)=>{if(id)refs.current.get(id)?.focus?.();};
 const onItemKey=(event:KeyEvent,id:string)=>{
  if(!current())return;
  const {key,shiftKey,altKey,ctrlKey,metaKey}=keyOf(event);
  if(altKey||ctrlKey||metaKey)return;
  if(key==="Escape"){
   event.preventDefault?.();event.stopPropagation?.();dismiss();return;
  }
  if(key==="Enter"||key===" "||key==="Spacebar"){
   event.preventDefault?.();event.stopPropagation?.();select(id);return;
  }
  let target:string|undefined;
  if(key==="Tab")target=cycleFocusTarget(enabledIds,id,!!shiftKey);
  else if(key==="ArrowDown"||key==="ArrowUp")target=cycleFocusTarget(enabledIds,id,key==="ArrowUp");
  else if(key==="Home")target=enabledIds[0];
  else if(key==="End")target=enabledIds[enabledIds.length-1];
  else return;
  event.preventDefault?.();event.stopPropagation?.();focusItem(target);
 };
 if(!position)return null;
 return <Modal visible={visible} transparent
    // A fading web Modal keeps its focus trap live while it fades and pulls
    // the restored focus back in; close instantly there.
    animationType={desktop?"none":"fade"} onRequestClose={dismiss}
    onShow={()=>{if(current()&&desktop)focusItem(enabledIds[0]);}}
    accessibilityViewIsModal>
    <View style={{flex:1}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss menu" onPress={dismiss}
        // Pointer-only: keyboard users close with Escape, so Tab never lands here.
        focusable={false}
        {...{className:styled?"bg-text/25":undefined}} style={{position:"absolute",top:0,right:0,bottom:0,left:0}}/>
      <View testID={testID} accessibilityRole="menu" accessibilityLabel={accessibilityLabel}
        {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised",className)}}
        style={{position:"absolute",left:position.x,top:position.y,width:position.width,
          maxHeight:position.height,overflow:"hidden",
          ...(styled&&surfaceColor?{backgroundColor:surfaceColor}:null),
          ...(styled&&borderColor?{borderColor}:null)}}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {items.map(item=><Pressable key={item.id} accessibilityRole="menuitem"
            testID={testID?`${testID}-item-${item.id}`:undefined}
            ref={node=>{if(node)refs.current.set(item.id,node);else refs.current.delete(item.id);}}
            accessibilityState={{disabled:item.disabled}}
            disabled={item.disabled}
            onPress={()=>select(item.id)}
            {...{onKeyDown:(event:KeyEvent)=>onItemKey(event,item.id)}}
            {...{className:joinClasses(styled&&"border-b border-border focus-visible:bg-primary/10")}}
            style={{minHeight:56,paddingHorizontal:12,paddingVertical:7,justifyContent:"center",
              opacity:item.disabled?0.4:1,...(styled&&borderColor?{borderColor}:null)}}>
            <Text {...{className:joinClasses(styled&&(item.danger?"text-danger":"text-text"))}}
              style={{fontWeight:"600",...(styled&&(item.danger?dangerColor:textColor)?{color:item.danger?dangerColor:textColor}:null)}}>{item.label}</Text>
            {item.description?<Text numberOfLines={2} {...{className:joinClasses(styled&&"text-text-muted")}}
              style={{fontSize:12,...(styled&&mutedTextColor?{color:mutedTextColor}:null)}}>{item.description}</Text>:null}
          </Pressable>)}
        </ScrollView>
      </View>
    </View>
 </Modal>;
}
