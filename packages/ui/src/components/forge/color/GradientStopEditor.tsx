import { useRef } from "react";
import { View, type ViewProps } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Select } from "../../Select.tsx";
import { Button } from "../../Button.tsx";
import { UnitInput } from "../../shell/UnitInput.tsx";
import { ColorChannelFields } from "./ColorChannelFields.tsx";
import type { ChannelModel } from "./channel-fields.ts";
import { rgbToHsv,hsvToRgb } from "../color.ts";
import { addStop,moveStop,removeStop,validateGradient,addStopAvailability,removeStopAvailability } from "../vector/gradient-handles-model.ts";
import type { GradientPaint } from "../vector/vector-types.ts";
/** Gradient stop selection and paint commit are owned by the consuming document. */
export interface GradientStopEditorProps extends Omit<ViewProps,"children"> {
 readonly value:GradientPaint;
 readonly selectedIndex:number;
 readonly onSelect:(index:number)=>void;
 /** One paint transaction; returned selection avoids a stale index after insertion/deletion. */
 readonly onCommit:(paint:GradientPaint,selectedIndex:number)=>void;
 readonly disabled?:boolean;readonly unstyled?:boolean;
}
/** Edits stop positions and RGBA, inserts interpolated stops and prevents fewer than two stops. */
export function GradientStopEditor({value,selectedIndex,onSelect,onCommit,disabled=false,unstyled=false,...props}:GradientStopEditorProps){
 validateGradient(value);
 if(!Number.isInteger(selectedIndex)||!value.stops[selectedIndex])throw new RangeError("Select an existing gradient stop");
 const local=useRef<StoreApi<{model:ChannelModel}>|null>(null);local.current??=createStore(()=>({model:'rgb' as ChannelModel}));
 const store=local.current,model=useStore(store,s=>s.model),stop=value.stops[selectedIndex]!;
 const add=addStopAvailability(value),remove=removeStopAvailability(value,selectedIndex);
 const color={r:stop.color[0],g:stop.color[1],b:stop.color[2],alpha:stop.color[3]/255};
 return <View {...props} style={[{gap:8},props.style]}>
  <Select label="Gradient stop" value={String(selectedIndex)} options={value.stops.map((stop,index)=>({value:String(index),label:`Stop ${index+1} at ${Math.round(stop.offset*1000)/10} percent`}))} disabled={disabled} unstyled={unstyled} onValueChange={index=>{if(!disabled)onSelect(Number(index));}}/>
  <UnitInput label="Stop position percent" value={stop.offset*100} min={(value.stops[selectedIndex-1]?.offset??0)*100} max={(value.stops[selectedIndex+1]?.offset??1)*100} step={.1} precision={2} disabled={disabled} unstyled={unstyled} onCommit={offset=>{if(!disabled)onCommit(moveStop(value,selectedIndex,offset/100),selectedIndex);}}/>
  <ColorChannelFields value={rgbToHsv(color)} model={model} onModelChange={model=>store.setState({model})} disabled={disabled} unstyled={unstyled} onCommit={next=>{
    if(disabled)return;const c=hsvToRgb(next);onCommit({...value,stops:value.stops.map((item,index)=>index===selectedIndex?{...item,color:[c.r,c.g,c.b,Math.round(c.alpha*255)]}:item)},selectedIndex);
  }}/>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
   <Button title="Add gradient stop" disabled={disabled||!add.enabled} unstyled={unstyled} onPress={()=>{if(disabled||!add.enabled)return;const next=addStop(value,(stop.offset+(value.stops[selectedIndex+1]?.offset??1))/2);onCommit(next.paint,next.index);}}/>
   <Button title="Remove gradient stop" disabled={disabled||!remove.enabled} unstyled={unstyled} onPress={()=>{if(!disabled&&remove.enabled)onCommit(removeStop(value,selectedIndex),Math.min(selectedIndex,value.stops.length-2));}}/>
  </View>
 </View>;
}
