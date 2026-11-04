import { Host,Column,Slider,Text } from "@expo/ui";
import { View,type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";
import { alphaPercent,assertRgba,rgbaToHex,type RgbaColor } from "./color.ts";
export interface ColorChannelsProps extends Omit<ViewProps,"children"> {
 readonly value:RgbaColor;
 readonly onValueChange:(value:RgbaColor)=>void;
 readonly showAlpha?:boolean;
 readonly disabled?:boolean;
 className?:string;
 unstyled?:boolean;
 previewClassName?:string;
}
/**
 * Controlled native RGBA sliders, SDK 58-only optional `@expo/ui` backend.
 * ICC/CMYK/HDR color science stays in the owning Forge engine.
 */
export function ColorChannels({
 value,onValueChange,showAlpha=true,disabled=false,
 className,unstyled=false,previewClassName,style,...props
}:ColorChannelsProps){
 assertRgba(value);
 const hex=rgbaToHex(value);
 const update=(key:"r"|"g"|"b",v:number)=>{
   if(!disabled)onValueChange({...value,[key]:Math.round(Math.max(0,Math.min(255,v)))});
 };
 return <View {...props}
   {...{className:joinClasses("w-full gap-2",!unstyled&&"rounded-control bg-surface-raised p-3",className)}}
   style={style}>
     <View
       accessibilityLabel={`Selected color ${hex}`}
       {...{className:joinClasses("h-8 w-full rounded-control",previewClassName)}}
       style={{backgroundColor:hex}}/>
     <Host style={{width:"100%"}}>
       <Column>
         <Text>{hex}</Text>
         <Text>{`Red ${value.r}`}</Text>
         <Slider value={value.r} min={0} max={255} step={1} disabled={disabled}
           onValueChange={n=>update("r",n)}/>
         <Text>{`Green ${value.g}`}</Text>
         <Slider value={value.g} min={0} max={255} step={1} disabled={disabled}
           onValueChange={n=>update("g",n)}/>
         <Text>{`Blue ${value.b}`}</Text>
         <Slider value={value.b} min={0} max={255} step={1} disabled={disabled}
           onValueChange={n=>update("b",n)}/>
         {showAlpha ? <>
           <Text>{`Opacity ${alphaPercent(value.alpha)}%`}</Text>
           <Slider value={value.alpha} min={0} max={1} step={0.01} disabled={disabled}
             onValueChange={n=>{if(!disabled)onValueChange({...value,alpha:Math.max(0,Math.min(1,n))});}}/>
         </>:null}
       </Column>
     </Host>
 </View>;
}
