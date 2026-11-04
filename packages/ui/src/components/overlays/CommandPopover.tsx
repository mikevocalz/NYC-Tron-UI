import {Modal,Pressable,ScrollView,Text,View} from "react-native";
import {placePopover,type Rect2D} from "./popover-position";
import {joinClasses} from "../styles";
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
}
/** RN Modal-backed portable overlay. Genuine WinUI/AppKit/SwiftUI/Compose menu adapters are separate. */
export function CommandPopover({visible,onDismiss,onSelect,anchor,usableRegions,items,width=268,maxHeight=420,
 className,unstyled=false}:CommandPopoverProps){
 const position=placePopover(anchor,usableRegions,width,Math.min(maxHeight,Math.max(56,items.length*60+16)));
 return <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}
    accessibilityViewIsModal>
    <View style={{flex:1}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss menu" onPress={onDismiss}
        style={{position:"absolute",top:0,right:0,bottom:0,left:0,backgroundColor:"rgba(0,0,0,0.24)"}}/>
      <View {...{className:joinClasses(!unstyled&&"rounded-control border border-border bg-surface-raised",className)}}
        style={{position:"absolute",left:position.x,top:position.y,width:position.width,
          maxHeight:position.height,overflow:"hidden",borderRadius:12,backgroundColor:"#242430",borderColor:"#444457",borderWidth:1}}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {items.map(item=><Pressable key={item.id} accessibilityRole="menuitem"
            accessibilityState={{disabled:item.disabled}}
            disabled={item.disabled}
            onPress={()=>{onSelect(item.id);onDismiss();}}
            style={{minHeight:56,paddingHorizontal:12,paddingVertical:7,justifyContent:"center",
              opacity:item.disabled?0.4:1,borderBottomWidth:1,borderColor:"#383847"}}>
            <Text style={{color:item.danger?"#FB7185":"#F5F5F7",fontWeight:"600"}}>{item.label}</Text>
            {item.description?<Text numberOfLines={2} style={{color:"#ADADBE",fontSize:12}}>{item.description}</Text>:null}
          </Pressable>)}
        </ScrollView>
      </View>
    </View>
 </Modal>;
}
