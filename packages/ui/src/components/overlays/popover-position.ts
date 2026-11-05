/** Popup placement in caller-provided, nonoccluded host/window coordinates. */
export type Rect2D=Readonly<{x:number;y:number;width:number;height:number}>;
export type PopupPosition=Readonly<{x:number;y:number;width:number;height:number;region:Rect2D}>;
const bound=(n:number,low:number,high:number)=>Math.max(low,Math.min(high,n));
export function placePopover(anchor:Rect2D,regions:readonly Rect2D[],desiredWidth:number,desiredHeight:number,
 padding=8):PopupPosition{
 const vals=[anchor.x,anchor.y,anchor.width,anchor.height,desiredWidth,desiredHeight,padding];
 if(!vals.every(Number.isFinite)||anchor.width<0||anchor.height<0||desiredWidth<=0||desiredHeight<=0||padding<0)
  throw new RangeError("Invalid popup geometry");
 const valid=regions.filter(r=>[r.x,r.y,r.width,r.height].every(Number.isFinite)&&r.width>0&&r.height>0);
 if(!valid.length)throw new RangeError("No usable popup region");
 const cx=anchor.x+anchor.width/2,cy=anchor.y+anchor.height/2;
 const containing=valid.filter(r=>cx>=r.x&&cx<=r.x+r.width&&cy>=r.y&&cy<=r.y+r.height);
 const region=(containing.length?containing:valid).sort((a,b)=>
   (b.width*b.height)-(a.width*a.height))[0];
 const w=Math.max(1,Math.min(desiredWidth,region.width-2*padding));
 const h=Math.max(1,Math.min(desiredHeight,region.height-2*padding));
 const left=bound(anchor.x,region.x+padding,region.x+region.width-w-padding);
 const below=anchor.y+anchor.height+padding,above=anchor.y-h-padding;
 const top=below+h<=region.y+region.height-padding?below:
   above>=region.y+padding?above:bound(below,region.y+padding,region.y+region.height-h-padding);
 return {x:left,y:top,width:w,height:h,region};
}

/**
 * Which side of the anchor a placement landed on. Native adapters (SwiftUI
 * popover, Compose menu) position themselves, so they take this preference
 * from the same usable-region computation instead of guessing from width.
 */
export function placementSide(anchor:Rect2D,position:PopupPosition):"below"|"above"|"overlap"{
 if(position.y>=anchor.y+anchor.height)return "below";
 if(position.y+position.height<=anchor.y)return "above";
 return "overlap";
}
