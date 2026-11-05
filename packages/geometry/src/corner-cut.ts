/**
 * Geometry adapted from NYC-MON packages/ui/neon/corner-cut.ts.
 * Original UI uses the NeonBlade MIT-licensed vocabulary. Copyrights and
 * upstream notices are retained in THIRD_PARTY_NOTICES.md.
 *
 * Pure geometry, no palette, Skia, neon glow, Expo or renderer dependency.
 */
export type CutCorner="top-left"|"top-right"|"bottom-right"|"bottom-left"|"all";
const mask=(c:CutCorner)=>({
  tl:c==="top-left"||c==="all",tr:c==="top-right",
  br:c==="bottom-right"||c==="all",bl:c==="bottom-left"
});
export function cornerCutPolygon(
  width:number,height:number,cut:number,corner:CutCorner="bottom-right"
):Array<[number,number]>{
  if (![width,height,cut].every(Number.isFinite)||width<0||height<0)
    throw new RangeError("Invalid corner-cut geometry");
  const amount=Math.max(0,Math.min(cut,width/2,height/2));
  const c=mask(corner),p:Array<[number,number]>=[];
  if(c.tl)p.push([0,amount],[amount,0]);else p.push([0,0]);
  if(c.tr)p.push([width-amount,0],[width,amount]);else p.push([width,0]);
  if(c.br)p.push([width,height-amount],[width-amount,height]);else p.push([width,height]);
  if(c.bl)p.push([amount,height],[0,height-amount]);else p.push([0,height]);
  return p;
}
export function cornerCutClipPath(cut:number,corner:CutCorner="bottom-right"):string{
  if(!Number.isFinite(cut)||cut<0)throw new RangeError("Invalid cut length");
  const c=mask(corner),n=`${cut}px`,far=`calc(100% - ${n})`,p:string[]=[];
  if(c.tl)p.push(`0 ${n}`,`${n} 0`);else p.push("0 0");
  if(c.tr)p.push(`${far} 0`,`100% ${n}`);else p.push("100% 0");
  if(c.br)p.push(`100% ${far}`,`${far} 100%`);else p.push("100% 100%");
  if(c.bl)p.push(`${n} 100%`,`0 ${far}`);else p.push("0 100%");
  return `polygon(${p.join(", ")})`;
}
export function insetCut(cut:number,inset:number):number{
  if(!Number.isFinite(cut)||!Number.isFinite(inset)||inset<0)
    throw new RangeError("Invalid inset cut");
  return Math.max(0,cut-inset*(Math.SQRT2-1));
}
