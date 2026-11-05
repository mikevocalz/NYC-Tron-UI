import {assertRange,clamp,gestureToAngle,normalize,snapValue,type RangeConfig} from "../forge/inputs/precision.ts";

export type {RangeConfig} from "../forge/inputs/precision.ts";

/**
 * Snapped value under a point on a slider track. `offset` is measured from
 * the track's left edge in points; in RTL the minimum is on the right.
 */
export function valueAtOffset(offset:number,length:number,range:RangeConfig,rtl=false):number{
  assertRange(range);
  if(!Number.isFinite(offset)||!Number.isFinite(length)||length<=0)throw new RangeError("Invalid track geometry");
  const t=clamp(offset/length,0,1);
  return snapValue(range.min+(rtl?1-t:t)*(range.max-range.min),range);
}

/** Position of a value along the track, 0..1 from the minimum end. */
export function fractionOf(value:number,range:RangeConfig):number{
  return normalize(clamp(value,range.min,range.max),range.min,range.max);
}

/** What a key does to a slider value, or null when it does not adjust. */
export type SliderKeyAction={readonly kind:"step";readonly steps:number}|{readonly kind:"min"}|{readonly kind:"max"};

/**
 * WAI-ARIA slider keys: arrows step (horizontal arrows flip in RTL),
 * PageUp/PageDown move ten steps, Home and End jump to the limits. Shift
 * multiplies an arrow by ten, Alt divides it by ten for fine work.
 */
export function sliderKeyAction(key:string,{rtl=false,shift=false,alt=false}:{rtl?:boolean;shift?:boolean;alt?:boolean}={}):SliderKeyAction|null{
  const scale=shift?10:alt?0.1:1;
  switch(key){
    case "ArrowUp":return {kind:"step",steps:scale};
    case "ArrowDown":return {kind:"step",steps:-scale};
    case "ArrowRight":return {kind:"step",steps:rtl?-scale:scale};
    case "ArrowLeft":return {kind:"step",steps:rtl?scale:-scale};
    case "PageUp":return {kind:"step",steps:10};
    case "PageDown":return {kind:"step",steps:-10};
    case "Home":return {kind:"min"};
    case "End":return {kind:"max"};
    default:return null;
  }
}

/** Apply a {@linkcode SliderKeyAction}. Fractional steps keep their precision instead of snapping back. */
export function applySliderKey(value:number,action:SliderKeyAction,range:RangeConfig):number{
  assertRange(range);
  if(action.kind==="min")return range.min;
  if(action.kind==="max")return range.max;
  const next=clamp(value+action.steps*range.step,range.min,range.max);
  return Math.abs(action.steps)<1?Number(next.toFixed(9)):snapValue(next,range);
}

/** One end of a {@linkcode RangeSlider}. */
export type RangeThumb="low"|"high";
/** The two values of a range, low first. */
export type RangeValue=readonly [low:number,high:number];

/** Order, clamp and snap a range, keeping at least `minGap` between the ends. */
export function normalizeRange([a,b]:RangeValue,range:RangeConfig,minGap=0):RangeValue{
  assertRange(range);
  if(!Number.isFinite(minGap)||minGap<0||minGap>range.max-range.min)throw new RangeError("Invalid minimum gap");
  let low=snapValue(Math.min(a,b),range),high=snapValue(Math.max(a,b),range);
  if(high-low<minGap){
    high=Math.min(range.max,low+minGap);
    low=Math.max(range.min,high-minGap);
  }
  return [low,high];
}

/**
 * Move one end. Ends never cross: the moving end stops `minGap` short of the
 * other, which does not move.
 */
export function moveRangeThumb(values:RangeValue,thumb:RangeThumb,next:number,range:RangeConfig,minGap=0):RangeValue{
  const [low,high]=normalizeRange(values,range,minGap);
  const snapped=snapValue(next,range);
  if(thumb==="low")return [Math.min(snapped,Number((high-minGap).toFixed(9))),high];
  return [low,Math.max(snapped,Number((low+minGap).toFixed(9)))];
}

/** The end a track press should move: the nearer one, or the high end on a tie above it. */
export function nearestThumb([low,high]:RangeValue,value:number):RangeThumb{
  const dl=Math.abs(value-low),dh=Math.abs(value-high);
  if(dl===dh)return value>high?"high":value<low?"low":"high";
  return dl<dh?"low":"high";
}

/** Knob pointer angle in degrees from 12 o'clock, clockwise, -135..135. */
export function knobAngle(value:number,range:RangeConfig):number{
  return gestureToAngle(clamp(value,range.min,range.max),range.min,range.max);
}

/** Angle from 12 o'clock, clockwise, of `point` around `center`, in -180..180. */
export function angleAround(point:{x:number;y:number},center:{x:number;y:number}):number{
  const dx=point.x-center.x,dy=point.y-center.y;
  if(!Number.isFinite(dx)||!Number.isFinite(dy))throw new RangeError("Invalid knob point");
  return Math.atan2(dx,-dy)*180/Math.PI;
}

/**
 * Circular (absolute) knob input, the stylus path: the value under the
 * pointer's angle. In the 90-degree gap at the bottom the value holds at the
 * end nearer to the previous value, so a pen crossing the gap cannot jump
 * from minimum to maximum.
 */
export function valueFromAngle(angle:number,previous:number,range:RangeConfig):number{
  assertRange(range);
  if(!Number.isFinite(angle))throw new RangeError("Invalid knob angle");
  if(angle>135||angle<-135){
    const mid=(range.min+range.max)/2;
    return previous>=mid?range.max:range.min;
  }
  return snapValue(range.min+(angle+135)/270*(range.max-range.min),range);
}

/**
 * Relative knob input for touch and mouse: upward or rightward travel raises
 * the value. `pixelsPerRange` of travel covers the whole range; `fine`
 * divides that by ten.
 */
export function valueFromDrag(start:number,dx:number,dy:number,range:RangeConfig,{pixelsPerRange=240,fine=false}:{pixelsPerRange?:number;fine?:boolean}={}):number{
  assertRange(range);
  if(![start,dx,dy,pixelsPerRange].every(Number.isFinite)||pixelsPerRange<=0)throw new RangeError("Invalid knob drag");
  const travel=dx-dy;
  const next=start+travel/pixelsPerRange*(range.max-range.min)*(fine?0.1:1);
  const bounded=clamp(next,range.min,range.max);
  return fine?Number(bounded.toFixed(9)):snapValue(bounded,range);
}
