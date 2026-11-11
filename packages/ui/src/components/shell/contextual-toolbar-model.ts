/**
 * One control a {@linkcode ContextualToolbar} may show. The host declares
 * every item once; the toolbar shows the ones that apply to the current
 * selection kind and moves the lowest-priority ones into "More" when the
 * row runs out of width.
 */
export interface ToolbarItemSpec {
  readonly id:string;
  /** Accessible name, menu text, and the visible text when there is no icon. */
  readonly label:string;
  /**
   * Higher stays visible longer. Ties give way in reverse declared order, so
   * the last declared item overflows first.
   * @default 0
   */
  readonly priority?:number;
  /**
   * Selection kinds this item applies to, e.g. `["text","mixed"]`. Kinds are
   * the host's own strings. Omit to show the item for every kind.
   */
  readonly appliesTo?:readonly string[];
  /** Present on toggles: the current pressed state. Omit for plain actions. */
  readonly pressed?:boolean;
  /**
   * Disables the item and says why, e.g. "Select one image to crop". Shown
   * when the item is focused, spoken as its hint and shown in the menu.
   */
  readonly disabledReason?:string;
}

/** Items that apply to `kind`, in declared order. */
export function itemsForSelection<T extends ToolbarItemSpec>(items:readonly T[],kind:string):T[]{
  return items.filter(i=>!i.appliesTo||i.appliesTo.includes(kind));
}

/** Throws on duplicate or empty ids and blank labels. */
export function validateToolbarItems(items:readonly ToolbarItemSpec[]):void{
  if(items.length>1000)throw new RangeError("Too many toolbar items");
  const seen=new Set<string>();
  for(const i of items){
    if(typeof i.id!=="string"||!i.id.trim()||i.id.length>256||seen.has(i.id))throw new TypeError("Duplicate or missing toolbar item id");
    if(typeof i.label!=="string"||!i.label.trim()||i.label.length>512)throw new TypeError(`Toolbar item ${i.id} needs a label`);
    if(i.priority!==undefined&&!Number.isFinite(i.priority))throw new RangeError(`Toolbar item ${i.id} has an invalid priority`);
    if(i.appliesTo&&(i.appliesTo.length>256||i.appliesTo.some(k=>typeof k!=="string"||!k.trim()||k.length>256)))throw new TypeError("Invalid toolbar selection kinds");
    if(i.pressed!==undefined&&typeof i.pressed!=="boolean"||i.disabledReason!==undefined&&(typeof i.disabledReason!=="string"||!i.disabledReason.trim()||i.disabledReason.length>2048))throw new TypeError("Invalid toolbar availability");
    seen.add(i.id);
  }
}

/** Geometry for {@linkcode splitOverflow}. All values in points. */
export interface OverflowInput {
  /** Measured width of each item. Unmeasured items count as `fallbackWidth`. */
  readonly widths:Readonly<Record<string,number>>;
  /** Width of the row the items must fit in. */
  readonly available:number;
  /** Space between neighbouring controls. */
  readonly gap:number;
  /** Width of the "More" trigger, reserved whenever anything overflows. */
  readonly overflowWidth:number;
  /** @default 44 */
  readonly fallbackWidth?:number;
}
/** Item ids kept in the row and moved into "More", each in declared order. */
export interface OverflowSplit {
  readonly visible:string[];
  readonly overflow:string[];
}

/**
 * Splits items between the row and the "More" menu. If everything fits, no
 * trigger is reserved. Otherwise the trigger's width is reserved first and
 * items leave lowest priority first until the rest fit, so the trigger
 * always has room. Both lists keep declared order.
 */
export function splitOverflow(items:readonly ToolbarItemSpec[],input:OverflowInput):OverflowSplit{
  const {widths,available,gap,overflowWidth,fallbackWidth=44}=input;
  if(![available,gap,overflowWidth,fallbackWidth].every(Number.isFinite)||available<0||gap<0||overflowWidth<0||fallbackWidth<=0)
    throw new RangeError("Invalid overflow geometry");
  const width=(id:string)=>{const w=Object.hasOwn(widths,id)?widths[id]:undefined;return w!==undefined&&Number.isFinite(w)&&w>=0?w:fallbackWidth;};
  const rowWidth=(ids:readonly string[])=>ids.reduce((sum,id,i)=>sum+width(id)+(i?gap:0),0);
  const all=items.map(i=>i.id);
  if(rowWidth(all)<=available)return {visible:all,overflow:[]};
  // Leaving order: lowest priority first, later declared first among equals.
  const leaving=items.map((item,index)=>({id:item.id,priority:item.priority??0,index}))
    .sort((a,b)=>a.priority-b.priority||b.index-a.index).map(e=>e.id);
  const gone=new Set<string>();
  const room=available-overflowWidth;
  for(const id of leaving){
    const kept=all.filter(x=>!gone.has(x));
    if(kept.length&&rowWidth(kept)+gap<=room)break;
    gone.add(id);
  }
  return {visible:all.filter(id=>!gone.has(id)),overflow:all.filter(id=>gone.has(id))};
}

/** Menu row description for an item moved into "More". */
export function overflowDescription(item:ToolbarItemSpec):string|undefined{
  if(item.disabledReason)return item.disabledReason;
  if(item.pressed!==undefined)return item.pressed?"On":"Off";
  return undefined;
}
