/**
 * Pure hinge/occlusion geometry. App adapters supply window-space logical
 * rects, normalized for density *once*, not physical pixels.
 * No synthetic hinge features or precise angles.
 */
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export interface FoldFeature {
  readonly bounds: Rect;
  readonly orientation: "vertical" | "horizontal";
  readonly separating: boolean;
  readonly occlusion: "none" | "full";
}
export interface UsableRegionsInput {
  /** Measured content container in window-space logical units. */
  readonly container: Rect;
  /** All current native fold/division features in the same units. */
  readonly features: readonly FoldFeature[];
}
export type UsableRect = Rect;
const valid = (v: Rect) =>
  [v.x,v.y,v.width,v.height].every(Number.isFinite) && v.width >= 0 && v.height >= 0;
const positive = (v: Rect) => v.width > 0 && v.height > 0;
const right = (v: Rect) => v.x + v.width;
const bottom = (v: Rect) => v.y + v.height;
function intersection(a: Rect,b:Rect): Rect|null {
  const x=Math.max(a.x,b.x), y=Math.max(a.y,b.y);
  const x1=Math.min(right(a),right(b)), y1=Math.min(bottom(a),bottom(b));
  return x1>x && y1>y ? {x,y,width:x1-x,height:y1-y}:null;
}
function subtract(region:Rect,blocked:Rect): Rect[] {
  const i=intersection(region,blocked);
  if(!i)return [region];
  return [
    {x:region.x,y:region.y,width:region.width,height:i.y-region.y},
    {x:region.x,y:bottom(i),width:region.width,height:bottom(region)-bottom(i)},
    {x:region.x,y:i.y,width:i.x-region.x,height:i.height},
    {x:right(i),y:i.y,width:right(region)-right(i),height:i.height}
  ].filter(positive);
}
function cutAtFeature(region:Rect,feature:FoldFeature):Rect[] {
  const b=feature.bounds;
  if(feature.orientation==="vertical"){
    if(bottom(b)<=region.y || b.y>=bottom(region) || b.x<=region.x || b.x>=right(region))return [region];
    const after=Math.min(right(region),b.x+b.width);
    return [
      {x:region.x,y:region.y,width:b.x-region.x,height:region.height},
      {x:after,y:region.y,width:right(region)-after,height:region.height}
    ].filter(positive);
  }
  if(right(b)<=region.x || b.x>=right(region) || b.y<=region.y || b.y>=bottom(region))return [region];
  const after=Math.min(bottom(region),b.y+b.height);
  return [
    {x:region.x,y:region.y,width:region.width,height:b.y-region.y},
    {x:region.x,y:after,width:region.width,height:bottom(region)-after}
  ].filter(positive);
}
export function resolveUsableRegions(input:UsableRegionsInput):UsableRect[] {
  if(!valid(input.container))throw new RangeError("Invalid container");
  const container=input.container;
  let regions:Rect[]=[{x:0,y:0,width:container.width,height:container.height}];
  for(const feature of input.features){
    if(!valid(feature.bounds))continue;
    if(!feature.separating && feature.occlusion==="none")continue;
    const local={...feature,bounds:{
      x:feature.bounds.x-container.x,y:feature.bounds.y-container.y,
      width:feature.bounds.width,height:feature.bounds.height
    }};
    regions=regions.flatMap(region=>{
      if(feature.occlusion==="full" && local.bounds.width>0 && local.bounds.height>0){
        // Remove the *actual* fully occluded region, not an imagined stripe.
        return subtract(region,local.bounds);
      }
      if(feature.separating)return cutAtFeature(region,local);
      return [region];
    });
  }
  return regions.filter(positive).sort((a,b)=>a.y-b.y || a.x-b.x);
}
