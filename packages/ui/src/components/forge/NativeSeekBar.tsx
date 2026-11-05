import { Host,Slider } from "@expo/ui";
import { Text,View,type ViewProps } from "react-native";
import { Button } from "../Button.tsx";
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
  /** Drops the library recipe from the wrapper and timecode; the native Expo Slider keeps OS behavior. */
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
   {/* Only the slider is an @expo/ui host. The transport is app-token RN:
       @expo/ui Text colours itself from the OS scheme, so a dark app theme
       on a light-mode device drew black timecode on the dark surface (the
       same fix HsvPicker uses for its labels). */}
   <Host style={{width:"100%"}}>
     <Slider
       min={0} max={1} value={frameToPosition(current,durationFrames)}
       disabled={off}
       onValueChange={p=>seek(positionToFrame(p,durationFrames))}
     />
   </Host>
   {/* Transport row under the slider, as in the Forge original (PR #25):
       step back, timecode, step forward on one line (#27). The timecode
       takes the width between the buttons and wraps centered on a phone. */}
   <View style={{flexDirection:"row",alignItems:"center",gap:8,marginTop:8}}>
     <Button title={`−${stepFrames} frame`} variant="secondary" size="sm" disabled={off}
       onPress={()=>seek(current-stepFrames)} />
     <Text selectable {...{className:joinClasses(!unstyled&&"text-text")}}
       style={{flex:1,minWidth:0,textAlign:"center",fontVariant:["tabular-nums"]}}>
       {`${formatTimecode(current,frameRate,{dropFrame:dropFrameTimecode})} / ${formatTimecode(durationFrames,frameRate,{dropFrame:dropFrameTimecode})}`}
     </Text>
     <Button title={`+${stepFrames} frame`} variant="secondary" size="sm" disabled={off}
       onPress={()=>seek(current+stepFrames)} />
   </View>
 </View>;
}
