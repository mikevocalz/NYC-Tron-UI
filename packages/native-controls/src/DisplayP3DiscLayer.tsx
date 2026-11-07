import {Host} from "@expo/ui";
import {requireNativeView} from "expo";
import {View} from "react-native";

export interface DisplayP3DiscLayerProps {
  /** Disc diameter in layout units. */
  size:number;
  /** HSV brightness within Display P3 primaries, not an sRGB conversion. */
  value:number;
}
const NativeDisc=requireNativeView<{value:number}>("NYCTronInstruments","TronDisplayP3DiscView");
/** Input-free Display P3 background for ColorDiscPicker.renderDisc. Native color
 * management maps to the output display. Android hosts must opt their activity
 * into wideColorGamut; this view never changes an application's window contract.
 * Physical wide-gamut output is not implied by the availability of this view. */
export function DisplayP3DiscLayer({size,value}:DisplayP3DiscLayerProps){
  if(!Number.isFinite(size)||size<120||size>800||!Number.isFinite(value)||value<0||value>1)
    throw new RangeError("Display P3 disc requires size 120..800 and value 0..1");
  return <View pointerEvents="none" accessible={false} style={{width:size,height:size,borderRadius:size/2,overflow:"hidden"}}>
    <Host style={{width:size,height:size}}><NativeDisc value={value}/></Host>
  </View>;
}
