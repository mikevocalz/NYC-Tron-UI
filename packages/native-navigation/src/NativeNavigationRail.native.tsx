import { Host } from "@expo/ui";
import { requireNativeView } from "expo";
import type { NativeSyntheticEvent } from "react-native";
import type { NativeRailProps } from "./NativeNavigationRail.types";
import { validateNavigationItems } from "./navigation-model";

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
  if(width!==undefined&&(!Number.isFinite(width)||width<64))
    throw new RangeError("Rail width must be >=64");
  if(height!==undefined&&(!Number.isFinite(height)||height<44))
    throw new RangeError("Rail height must be >=44");
  return <Host style={{width:width??(expanded?208:80),height:height??"100%"}}>
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
