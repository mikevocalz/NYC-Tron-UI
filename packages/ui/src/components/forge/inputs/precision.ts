/** Pure input math. No app theme, document state or native transport dependencies. */
export type Point2D = Readonly<{ x: number; y: number }>;
export type RangeConfig = Readonly<{ min: number; max: number; step: number; detents?: readonly number[] }>;
export function assertRange({min,max,step}: RangeConfig):void {
  if (![min,max,step].every(Number.isFinite) || max<=min || step<=0)
    throw new RangeError("Expected finite min < max and step > 0");
}
export function clamp(value:number,min:number,max:number):number {
  if (!Number.isFinite(value)) throw new RangeError("Nonfinite instrument value");
  return Math.max(min,Math.min(max,value));
}
export function snapValue(value:number,config:RangeConfig):number {
  assertRange(config);
  const bounded=clamp(value,config.min,config.max);
  const detent=config.detents?.find(d=>Number.isFinite(d)&&d>=config.min&&d<=config.max&&Math.abs(bounded-d)<=config.step*0.4);
  if(detent!==undefined)return detent;
  const stepped=config.min+Math.round((bounded-config.min)/config.step)*config.step;
  return clamp(Number(stepped.toFixed(9)),config.min,config.max);
}
/**
 * Precision band chosen by vertical travel during a horizontal scrub.
 * `fine` subdivides the step into tenths, `coarse` multiplies it.
 * @see {@linkcode scrubModeFromOffset}
 */
export type ScrubMode="fine"|"normal"|"coarse";
/** Vertical travel, in pixels, that switches a scrub into fine (up) or coarse (down). */
export const SCRUB_MODE_THRESHOLD_PX=28;
/** Pulling upward past the threshold enables fine precision; pushing downward enables coarse. */
export function scrubModeFromOffset(dy:number):ScrubMode {
  if(!Number.isFinite(dy))throw new RangeError("Invalid gesture");
  return dy < -SCRUB_MODE_THRESHOLD_PX ? "fine" : dy > SCRUB_MODE_THRESHOLD_PX ? "coarse" : "normal";
}
/** Vertical drag changes precision: pulling upward enables a finer adjustment. */
export function scrubValue(start:number,dx:number,dy:number,config:RangeConfig):number {
  assertRange(config);
  if(!Number.isFinite(start)||!Number.isFinite(dx)||!Number.isFinite(dy))throw new RangeError("Invalid gesture");
  const mode=scrubModeFromOffset(dy);
  const fine=mode==="fine" ? 0.1 : mode==="coarse" ? 4 : 1;
  return snapValue(start+dx/8*config.step*fine,config);
}
/** Input for {@linkcode scrubPrecision}: the range, the value at gesture start and the horizontal travel. */
export interface PrecisionScrubInput extends RangeConfig {
  /** Value when the gesture began. The result is absolute, so re-renders cannot accumulate drift. */
  startValue:number;
  /** Horizontal travel since the gesture began, in pixels. */
  deltaPixels:number;
  /** Pixels of travel per nominal step. @default 8 */
  pixelsPerStep?:number;
  /** @default "normal" */
  mode?:ScrubMode;
  /** Steps per pixel-step in coarse mode. @default 10 */
  coarseMultiplier?:number;
}
/**
 * Mode-aware scrub for {@linkcode PrecisionScrubber}. Fine mode moves and snaps in
 * tenths of `step`; normal and coarse snap to `step`. A detent wins when the raw value
 * lies within half a quantum of it. Throws `RangeError` on a broken range or gesture.
 */
export function scrubPrecision(input:PrecisionScrubInput):number {
  assertRange(input);
  const {min,max,step,startValue,deltaPixels}=input;
  if(!Number.isFinite(startValue)||!Number.isFinite(deltaPixels))throw new RangeError("Invalid gesture");
  const px=input.pixelsPerStep ?? 8;
  const coarse=input.coarseMultiplier ?? 10;
  if(!Number.isFinite(px)||px<=0)throw new RangeError("pixelsPerStep must be positive");
  if(!Number.isFinite(coarse)||coarse<=0)throw new RangeError("coarseMultiplier must be positive");
  if(deltaPixels===0)return Number(clamp(startValue,min,max).toFixed(9));
  const mode=input.mode ?? "normal";
  const factor=mode==="fine" ? 0.1 : mode==="coarse" ? coarse : 1;
  const quantum=mode==="fine" ? step*0.1 : step;
  const raw=startValue+deltaPixels/px*step*factor;
  const snapped=min+Math.round((raw-min)/quantum)*quantum;
  const detent=input.detents?.find(d=>Number.isFinite(d)&&d>=min&&d<=max&&Math.abs(d-raw)<=quantum*0.5);
  return Number(clamp(detent ?? snapped,min,max).toFixed(9));
}
/** One mark on a {@linkcode PrecisionScrubber} scale. */
export interface ScaleTick {
  /** Position along the scale, 0..1. */
  position:number;
  major:boolean;
  /** True when the current value has reached or passed this tick. */
  reached:boolean;
}
/** Evenly spaced scale marks with every `majorEvery`th tick major. */
export function scaleTicks(value:number,min:number,max:number,count=31,majorEvery=5):ScaleTick[] {
  if(!Number.isInteger(count)||count<2||!Number.isInteger(majorEvery)||majorEvery<1)throw new RangeError("Invalid scale");
  const reachedUpTo=normalize(value,min,max);
  return Array.from({length:count},(_,i)=>{
    const position=i/(count-1);
    return {position,major:i%majorEvery===0,reached:position<=reachedUpTo};
  });
}
/** Display a value with as many decimals as the step needs (fine mode adds one). */
export function formatStepValue(value:number,step:number):string {
  const places=step>=1?1:step>=0.1?2:step>=0.01?3:4;
  return Number(value.toFixed(places)).toString();
}
export function normalize(value:number,min:number,max:number):number {
  if(![min,max,value].every(Number.isFinite)||max<=min)throw new RangeError("Invalid normalization");
  return clamp((value-min)/(max-min),0,1);
}
/** XY data is normalized 0..1, Y increases upwards for audio/creative controls. */
export function pointFromDrag(start:Point2D,dx:number,dy:number,width:number,height:number):Point2D {
  if(![start.x,start.y,dx,dy,width,height].every(Number.isFinite)||width<=0||height<=0)
    throw new RangeError("Invalid XY viewport");
  return {x:clamp(start.x+dx/width,0,1),y:clamp(start.y-dy/height,0,1)};
}
export function gestureToAngle(value:number,min:number,max:number):number {
  return -135+270*normalize(value,min,max);
}
