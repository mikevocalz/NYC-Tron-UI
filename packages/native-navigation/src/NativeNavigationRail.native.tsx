import { Host } from "@expo/ui";
import { requireNativeView } from "expo";
import type { NativeSyntheticEvent } from "react-native";
import type { NativeRailProps } from "./NativeNavigationRail.types.js";
import { resolveRailDimensions, validateNavigationItems } from "./navigation-model.js";

type SelectEvent=NativeSyntheticEvent<{id:string}>;
type NativeProps={
  destinationIds:string[];destinationLabels:string[];destinationGlyphs:string[];
  disabledIds:string[];selectedId:string;expanded:boolean;enabled:boolean;
  activeColor?:string;foregroundColor?:string;backgroundColor?:string;
  onSelect?:(event:SelectEvent)=>void;
};
const NativeView=requireNativeView<NativeProps>("NYCTronNavigation","TronNavigationRailView");
export function NativeNavigationRail({
  items,selectedId,onSelectionChange,expanded=false,enabled=true,
  width,height,activeColor,foregroundColor,backgroundColor,
}:NativeRailProps){
  validateNavigationItems(items,selectedId);
  const dimensions=resolveRailDimensions(expanded,width,height);
  return <Host style={dimensions}>
    <NativeView
      destinationIds={items.map(i=>i.id)}
      destinationLabels={items.map(i=>i.label)}
      destinationGlyphs={items.map(i=>i.glyph??"")}
      disabledIds={items.filter(i=>i.disabled).map(i=>i.id)}
      selectedId={selectedId??""} expanded={expanded} enabled={enabled}
      {...(activeColor?{activeColor}:{})}
      {...(foregroundColor?{foregroundColor}:{})}
      {...(backgroundColor?{backgroundColor}:{})}
      onSelect={e=>{
        const id=e.nativeEvent.id;
        if(!enabled||id===selectedId)return;
        const item=items.find(candidate=>candidate.id===id);
        if(item&&!item.disabled)onSelectionChange(id);
      }}
    />
  </Host>;
}
