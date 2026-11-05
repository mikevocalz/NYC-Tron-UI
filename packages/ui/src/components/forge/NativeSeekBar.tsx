import { Host,Column,Row,Spacer,Slider,Button,Text } from "@expo/ui";
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
     <Column spacing={8}>
       <Slider
         min={0} max={1} value={frameToPosition(current,durationFrames)}
         disabled={off}
         onValueChange={p=>seek(positionToFrame(p,durationFrames))}
       />
       {/* Transport row under the slider, as in the Forge original (PR #25):
           step back, timecode, step forward on one line (#27). Center
           alignment because the universal Row defaults to top (Compose Row
           does too, SwiftUI HStack centers); flexible spacers pin the buttons
           to the edges so the timecode can wrap centered on a phone. */}
       <Row alignment="center" spacing={8}>
         <Button label={`−${stepFrames} frame`} disabled={off} onPress={()=>seek(current-stepFrames)} />
         <Spacer flexible />
         <Text textStyle={{textAlign:"center"}}>{`${formatTimecode(current,frameRate,{dropFrame:dropFrameTimecode})} / ${formatTimecode(durationFrames,frameRate,{dropFrame:dropFrameTimecode})}`}</Text>
         <Spacer flexible />
         <Button label={`+${stepFrames} frame`} disabled={off} onPress={()=>seek(current+stepFrames)} />
       </Row>
     </Column>
   </Host>
 </View>;
}
