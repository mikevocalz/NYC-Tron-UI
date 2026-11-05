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
/** Vertical drag changes precision: pulling upward enables a finer adjustment. */
export function scrubValue(start:number,dx:number,dy:number,config:RangeConfig):number {
  assertRange(config);
  if(!Number.isFinite(start)||!Number.isFinite(dx)||!Number.isFinite(dy))throw new RangeError("Invalid gesture");
  const fine=dy < -28 ? 0.1 : dy > 28 ? 4 : 1;
  return snapValue(start+dx/8*config.step*fine,config);
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
