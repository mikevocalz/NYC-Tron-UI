import { Host,Column,Slider,Button,Text } from "@expo/ui";
import { View,type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";
import {
  clampFrame,formatTimecode,frameToPosition,positionToFrame,type FrameRate
} from "./timebase.ts";
/** Requires @expo/ui universal native APIs on a verified Expo SDK 58 host.
 * Not a WinUI, Spark SDK 55, audio decoder or Forge engine adapter.
 */
export interface NativeSeekBarProps extends Omit<ViewProps,"children"> {
  readonly frame:number;
  readonly durationFrames:number;
  readonly frameRate:FrameRate;
  readonly onSeek:(frame:number)=>void;
  readonly stepFrames?:number;
  readonly dropFrameTimecode?:boolean;
  readonly disabled?:boolean;
  className?:string;
  /** Controls RN wrapper only; native Expo Slider keeps OS behavior. */
  unstyled?:boolean;
}
export function NativeSeekBar({
 frame,durationFrames,frameRate,onSeek,stepFrames=1,
 dropFrameTimecode=false,disabled=false,className,unstyled=false,style,...props
}:NativeSeekBarProps){
 if(!Number.isSafeInteger(durationFrames)||durationFrames<0||
    !Number.isSafeInteger(stepFrames)||stepFrames<1)
  throw new RangeError("Invalid frame count or step");
 const current=clampFrame(frame,durationFrames);
 const off=disabled||durationFrames===0;
 const seek=(next:number)=>{if(!off)onSeek(clampFrame(next,durationFrames));};
 return <View {...props}
   {...{className:joinClasses("w-full",!unstyled&&"rounded-control bg-surface-raised p-3",className)}}
   style={style}>
   <Host style={{width:"100%"}}>
     <Column>
       <Slider
         min={0} max={1} value={frameToPosition(current,durationFrames)}
         disabled={off}
         onValueChange={p=>seek(positionToFrame(p,durationFrames))}
       />
       <Button label={`−${stepFrames} frame`} disabled={off} onPress={()=>seek(current-stepFrames)} />
       <Text>{`${formatTimecode(current,frameRate,{dropFrame:dropFrameTimecode})} / ${formatTimecode(durationFrames,frameRate,{dropFrame:dropFrameTimecode})}`}</Text>
       <Button label={`+${stepFrames} frame`} disabled={off} onPress={()=>seek(current+stepFrames)} />
     </Column>
   </Host>
 </View>;
}
