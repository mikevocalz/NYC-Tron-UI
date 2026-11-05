/** Which presets a {@linkcode PresetGallery} shows. */
export type PresetFilter="all"|"favorites";

/** The minimal preset fields the gallery logic reads. */
export interface PresetLike {
  readonly id:string;
  readonly name:string;
  readonly favorite?:boolean;
}

/** Throws on a duplicate id or an empty name. */
export function validatePresets(presets:readonly PresetLike[]):void{
  const seen=new Set<string>();
  for(const p of presets){
    if(typeof p.id!=="string"||!p.id||seen.has(p.id))throw new TypeError("Duplicate or missing preset id");
    if(typeof p.name!=="string"||!p.name.trim())throw new TypeError(`Preset ${p.id} needs a name`);
    seen.add(p.id);
  }
}

/** Presets for a filter, in the app's order. */
export function filterPresets<T extends PresetLike>(presets:readonly T[],filter:PresetFilter):T[]{
  return filter==="favorites"?presets.filter(p=>p.favorite):[...presets];
}

/** Columns that fit `width` with tiles at least `minTile` wide and `gap` between them. Never below one. */
export function galleryColumns(width:number,minTile:number,gap:number):number{
  if(![width,minTile,gap].every(Number.isFinite)||minTile<=0||gap<0)throw new RangeError("Invalid gallery geometry");
  if(width<=0)return 1;
  return Math.max(1,Math.floor((width+gap)/(minTile+gap)));
}

/**
 * Grid focus movement: Left/Right step (flipped in RTL), Up/Down move a row,
 * Home/End jump to the ends. Movement stops at the edges instead of
 * wrapping, as in a grid. Returns null for other keys.
 */
export function gridFocusTarget(index:number,key:string,count:number,columns:number,rtl=false):number|null{
  if(count<=0||columns<1)return null;
  const clampIdx=(i:number)=>Math.max(0,Math.min(count-1,i));
  switch(key){
    case "ArrowRight":return clampIdx(index+(rtl?-1:1));
    case "ArrowLeft":return clampIdx(index+(rtl?1:-1));
    case "ArrowDown":return index+columns<count?index+columns:index;
    case "ArrowUp":return index-columns>=0?index-columns:index;
    case "Home":return 0;
    case "End":return count-1;
    default:return null;
  }
}
