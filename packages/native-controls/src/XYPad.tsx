import { Host } from "@expo/ui";
import { requireNativeView } from "expo";
import type { NativeSyntheticEvent } from "react-native";

export interface XYPoint { readonly x:number; readonly y:number }
export interface XYPadProps {
 label:string; x:number; y:number; size?:number; enabled?:boolean;
 accentColor?:string; backgroundColor?:string;
 onPreview?:(value:XYPoint)=>void;
 onCommit:(value:XYPoint)=>void|Promise<unknown>;
 onError?:(error:unknown)=>void;
}
type XYEvent=NativeSyntheticEvent<XYPoint>;
type NativeXYProps=Pick<XYPadProps,"label"|"x"|"y"|"enabled"|"accentColor"|"backgroundColor"> & {
 onPreview?:(event:XYEvent)=>void; onCommit?:(event:XYEvent)=>void;
};
const NativeXYPadView=requireNativeView<NativeXYProps>("NYCTronInstruments","TronXYPadView");
export function XYPad({size=180,enabled=true,onPreview,onCommit,onError,...props}:XYPadProps){
 if(![props.x,props.y,size].every(Number.isFinite)||size<=0||
    props.x<0||props.x>1||props.y<0||props.y>1)throw new RangeError("Invalid native XYPad bounds");
 const read=(event:XYEvent):XYPoint|null=>{
  const {x,y}=event.nativeEvent;
  return Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=1&&y>=0&&y<=1?{x,y}:null;
 };
 return <Host style={{width:size,height:size}}>
   <NativeXYPadView {...props} enabled={enabled}
     onPreview={event=>{const value=read(event);if(value)onPreview?.(value);}}
     onCommit={event=>{
       const value=read(event);if(!value)return;
       try{Promise.resolve(onCommit(value)).catch(error=>onError?.(error));}
       catch(error){onError?.(error);}
     }}/>
 </Host>;
}
