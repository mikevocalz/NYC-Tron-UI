import {useRef,type ComponentRef} from "react";
import {Modal,Platform,Pressable,ScrollView,Text,View,type PressableProps} from "react-native";
import {placePopover,type Rect2D} from "./popover-position.ts";
import {cycleFocusTarget} from "./focus-cycle.ts";
import {useRestoreFocus} from "./focus-restore.ts";
import {joinClasses} from "../styles.ts";
export type CommandMenuItem=Readonly<{id:string;label:string;description?:string;disabled?:boolean;danger?:boolean}>;
export interface CommandPopoverProps{
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
}
type KeyEvent=Parameters<NonNullable<PressableProps["onKeyDown"]>>[0];
// Only reached on RN web, where the native event is a browser KeyboardEvent.
const keyOf=(event:KeyEvent)=>event.nativeEvent as unknown as {
 key:string;shiftKey?:boolean;altKey?:boolean;ctrlKey?:boolean;metaKey?:boolean};

/**
 * RN Modal-backed portable overlay. Genuine WinUI/AppKit/SwiftUI/Compose menu adapters are separate.
 * Web keyboard: focus starts on the first enabled item, arrows/Home/End move,
 * Tab and Shift+Tab cycle inside the menu, Escape closes, and focus returns to
 * whatever opened it.
 */
export function CommandPopover({visible,onDismiss,onSelect,anchor,usableRegions,items,width=268,maxHeight=420,
 className,unstyled=false,surfaceColor,borderColor,textColor,mutedTextColor,dangerColor,
 accessibilityLabel="Commands"}:CommandPopoverProps){
 const styled=!unstyled;
 const refs=useRef(new Map<string,ComponentRef<typeof View>>());
 useRestoreFocus(visible);
 const position=placePopover(anchor,usableRegions,width,Math.min(maxHeight,Math.max(56,items.length*60+16)));
 const enabledIds=items.filter(item=>!item.disabled).map(item=>item.id);
 const focusItem=(id:string|undefined)=>{if(id)refs.current.get(id)?.focus();};
 const onItemKey=(event:KeyEvent,id:string)=>{
  const {key,shiftKey,altKey,ctrlKey,metaKey}=keyOf(event);
  if(altKey||ctrlKey||metaKey)return;
  let target:string|undefined;
  if(key==="Tab")target=cycleFocusTarget(enabledIds,id,!!shiftKey);
  else if(key==="ArrowDown"||key==="ArrowUp")target=cycleFocusTarget(enabledIds,id,key==="ArrowUp");
  else if(key==="Home")target=enabledIds[0];
  else if(key==="End")target=enabledIds[enabledIds.length-1];
  else return;
  event.preventDefault();event.stopPropagation();focusItem(target);
 };
 return <Modal visible={visible} transparent
    // A fading web Modal keeps its focus trap live while it fades and pulls
    // the restored focus back in; close instantly there.
    animationType={Platform.OS==="web"?"none":"fade"} onRequestClose={onDismiss}
    onShow={()=>{if(Platform.OS==="web")focusItem(enabledIds[0]);}}
    accessibilityViewIsModal>
    <View style={{flex:1}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss menu" onPress={onDismiss}
        // Pointer-only: keyboard users close with Escape, so Tab never lands here.
        focusable={false}
        style={{position:"absolute",top:0,right:0,bottom:0,left:0,backgroundColor:"rgba(0,0,0,0.24)"}}/>
      <View accessibilityRole="menu" accessibilityLabel={accessibilityLabel}
        {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised",className)}}
        style={{position:"absolute",left:position.x,top:position.y,width:position.width,
          maxHeight:position.height,overflow:"hidden",
          ...(styled&&surfaceColor?{backgroundColor:surfaceColor}:null),
          ...(styled&&borderColor?{borderColor}:null)}}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {items.map(item=><Pressable key={item.id} accessibilityRole="menuitem"
            ref={node=>{if(node)refs.current.set(item.id,node);else refs.current.delete(item.id);}}
            accessibilityState={{disabled:item.disabled}}
            disabled={item.disabled}
            onPress={()=>{onSelect(item.id);onDismiss();}}
            {...{onKeyDown:(event:KeyEvent)=>onItemKey(event,item.id)}}
            {...{className:joinClasses(styled&&"border-b border-border focus-visible:bg-surface-sunken")}}
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
