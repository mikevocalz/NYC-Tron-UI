import { Host } from "@expo/ui";
import { requireNativeView } from "expo";
import type { NativeSyntheticEvent } from "react-native";

export interface ArcKnobProps {
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  size?: number;
  enabled?: boolean;
  accentColor?: string;
  textColor?: string;
  onPreview?: (value: number) => void;
  /** One native commit per completed gesture; the engine owns persisted state. */
  onCommit: (value: number) => void | Promise<unknown>;
  onError?: (error: unknown) => void;
}
type ValueEvent = NativeSyntheticEvent<{ value: number }>;
type NativeArcProps = Pick<ArcKnobProps, "label"|"value"|"minimum"|"maximum"|"step"|"enabled"|"accentColor"|"textColor"> & {
  onPreview?: (event: ValueEvent) => void;
  onCommit?: (event: ValueEvent) => void;
};
const NativeArcKnobView = requireNativeView<NativeArcProps>("NYCTronInstruments", "TronArcKnobView");
export function ArcKnob({size=112,enabled=true,onPreview,onCommit,onError,...props}:ArcKnobProps) {
  if (![props.minimum,props.maximum,props.step,props.value,size].every(Number.isFinite) ||
      props.maximum<=props.minimum || props.step<=0 || size<=0) {
    throw new RangeError("Invalid native ArcKnob bounds or size");
  }
  const committed=(event:ValueEvent)=>{
    const value=event.nativeEvent.value;
    if(!Number.isFinite(value))return;
    try { Promise.resolve(onCommit(value)).catch(error=>onError?.(error)); }
    catch(error) { onError?.(error); }
  };
  return <Host style={{width:size,height:size}}>
    <NativeArcKnobView {...props} enabled={enabled}
      onPreview={event=>{const v=event.nativeEvent.value;if(Number.isFinite(v))onPreview?.(v);}}
      onCommit={committed} />
  </Host>;
}
