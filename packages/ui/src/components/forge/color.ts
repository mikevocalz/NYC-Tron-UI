/** Document-independent RGBA display model from Nitro Forge color-ui PR #26. */
export interface RgbaColor {
 readonly r:number;readonly g:number;readonly b:number;readonly alpha:number;
}
export function assertRgba(c:RgbaColor):void{
 if([c.r,c.g,c.b].some(n=>!Number.isInteger(n)||n<0||n>255))
  throw new RangeError("RGB channels must be integers 0..255");
 if(!Number.isFinite(c.alpha)||c.alpha<0||c.alpha>1)
  throw new RangeError("Alpha must be 0..1");
}
export function rgbaToHex(c:RgbaColor,includeAlpha=true):string{
 assertRgba(c);
 const hex=(n:number)=>Math.round(n).toString(16).padStart(2,"0").toUpperCase();
 const rgb=`#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
 return includeAlpha?rgb+hex(c.alpha*255):rgb;
}
export function alphaPercent(alpha:number):number{
 if(!Number.isFinite(alpha)||alpha<0||alpha>1)throw new RangeError("Invalid alpha");
 return Math.round(alpha*100);
}
