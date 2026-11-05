import { Pressable, ScrollView, Text, View } from "react-native";
import { resolveRailDimensions, validateNavigationItems } from "./navigation-model.js";
import type { NativeRailProps } from "./NativeNavigationRail.types.js";
/** Functional RN web presentation; web app shell should use its normal header. */
export function NativeNavigationRail({
 items,selectedId,onSelectionChange,expanded=false,enabled=true,
 width,height,foregroundColor,backgroundColor,activeColor
}:NativeRailProps){
 validateNavigationItems(items,selectedId);
 const dimensions=resolveRailDimensions(expanded,width,height);
 return <View style={{...dimensions,
    backgroundColor,alignItems:"stretch"}}>
  <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:"center",gap:6,padding:8}}>
   {items.map(item=>{
    const selected=item.id===selectedId;
    return <Pressable key={item.id}
      accessibilityRole="button" accessibilityLabel={item.label}
      accessibilityState={{selected,disabled:!enabled||!!item.disabled}}
      disabled={!enabled||!!item.disabled}
      onPress={()=>{if(!selected)onSelectionChange(item.id);}}
      style={{minWidth:44,minHeight:44,alignItems:"center",justifyContent:"center",
        flexDirection:expanded?"row":"column",gap:6,borderRadius:12,
        backgroundColor:selected?activeColor:undefined}}>
       <Text style={{fontSize:20,color:foregroundColor}}>{item.glyph||item.label.charAt(0)}</Text>
       {expanded?<Text numberOfLines={1} style={{flexShrink:1,color:foregroundColor}}>{item.label}</Text>:null}
    </Pressable>;
   })}
  </ScrollView>
 </View>;
}
