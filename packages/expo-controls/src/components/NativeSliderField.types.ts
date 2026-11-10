import type { NativeAppearanceProps } from "./native-appearance.ts";

/**
 * Props shared by every platform's {@linkcode NativeSliderField}. The value
 * is controlled: a drag previews through `onPreview` and commits once.
 */
export interface NativeSliderFieldProps extends NativeAppearanceProps {
  readonly label:string;
  readonly value:number;
  readonly min:number;
  readonly max:number;
  readonly step:number;
  /** During a drag, for a live preview. Never persist here. */
  readonly onPreview?:(value:number)=>void;
  /** Exactly once per finished drag, typed entry or reset. */
  readonly onCommit:(value:number)=>void;
  /** Shows a Reset button whenever the value differs from it. */
  readonly defaultValue?:number;
  /** Unit text after the value, e.g. "%". */
  readonly unit?:string;
  readonly disabled?:boolean;
  readonly testID?:string;
}

/**
 * Compose `Slider` takes the number of stops between the ends, not a step
 * size. Returns 0 (continuous) when the step does not divide the range into
 * at most 1000 stops.
 */
export function composeSteps(min:number,max:number,step:number):number{
  if(![min,max,step].every(Number.isFinite)||max<=min||step<=0)throw new RangeError("Expected finite min < max and step > 0");
  const stops=Math.round((max-min)/step);
  if(stops>1000||Math.abs(stops*step-(max-min))>step*1e-6)return 0;
  return Math.max(0,stops-1);
}
