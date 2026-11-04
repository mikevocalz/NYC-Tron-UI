import {Modal,Pressable,ScrollView,Text,View} from "react-native";
import {placePopover,type Rect2D} from "./popover-position.ts";
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
/** RN Modal-backed portable overlay. Genuine WinUI/AppKit/SwiftUI/Compose menu adapters are separate. */
export function CommandPopover({visible,onDismiss,onSelect,anchor,usableRegions,items,width=268,maxHeight=420,
 className,unstyled=false,surfaceColor,borderColor,textColor,mutedTextColor,dangerColor,
 accessibilityLabel="Commands"}:CommandPopoverProps){
 const styled=!unstyled;
 const position=placePopover(anchor,usableRegions,width,Math.min(maxHeight,Math.max(56,items.length*60+16)));
 return <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}
    accessibilityViewIsModal>
    <View style={{flex:1}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss menu" onPress={onDismiss}
        style={{position:"absolute",top:0,right:0,bottom:0,left:0,backgroundColor:"rgba(0,0,0,0.24)"}}/>
      <View accessibilityRole="menu" accessibilityLabel={accessibilityLabel}
        {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised",className)}}
        style={{position:"absolute",left:position.x,top:position.y,width:position.width,
          maxHeight:position.height,overflow:"hidden",
          ...(styled&&surfaceColor?{backgroundColor:surfaceColor}:null),
          ...(styled&&borderColor?{borderColor}:null)}}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {items.map(item=><Pressable key={item.id} accessibilityRole="menuitem"
            accessibilityState={{disabled:item.disabled}}
            disabled={item.disabled}
            onPress={()=>{onSelect(item.id);onDismiss();}}
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
