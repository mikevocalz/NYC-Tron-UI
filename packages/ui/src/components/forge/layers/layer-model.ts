/**
 * Engine-neutral layer list contract. The app (or its compositor) owns the
 * layer document; {@linkcode LayerStack} only previews gestures and reports
 * committed intent through callbacks.
 */

/** What a {@linkcode LayerRow} contains. Shown as a short label next to the name. */
export type LayerKind="raster"|"vector"|"text"|"group"|"adjustment";

/**
 * One row in a {@linkcode LayerStack}. Index 0 of the `layers` array is the
 * topmost layer and renders at the top of the list.
 */
export type LayerRow=Readonly<{
 /** Stable identity; must be unique within the stack. */
 id:string;
 /** Display name; must contain at least one non-space character. */
 name:string;
 /** Whether the compositor draws this layer. */
 visible:boolean;
 /** Layer opacity from 0 (transparent) to 1 (opaque). */
 opacity:number;
 /**
  * Locked layers can still be selected and hidden, but cannot be renamed,
  * reordered, or have their opacity changed.
  * @default false
  */
 locked?:boolean;
 /** What the layer contains. */
 kind:LayerKind;
}>;

/** Minimum touch target edge for every interactive part of a row, in points. */
export const LAYER_TOUCH_TARGET=44;
/** Opacity change applied by one screen-reader increment or decrement. */
export const LAYER_OPACITY_STEP=0.05;
/** Upper bound on rows; larger documents need a virtualized list. */
export const LAYER_STACK_MAX_ROWS=500;

const KIND_LABELS={
 raster:"Pixel",vector:"Shape",text:"Text",group:"Group",adjustment:"Adjustment",
} as const satisfies Record<LayerKind,string>;

/** Human-readable label for a {@linkcode LayerKind}. */
export function layerKindLabel(kind:LayerKind):string{
 return KIND_LABELS[kind];
}

/**
 * Throws a RangeError when the controlled `layers` prop cannot be rendered
 * honestly: duplicate or empty ids, blank names, unknown kinds, or opacity
 * outside 0..1.
 */
export function validateLayers(layers:readonly LayerRow[]):void{
 if(layers.length>LAYER_STACK_MAX_ROWS)throw new RangeError("Layer stack exceeds "+LAYER_STACK_MAX_ROWS+" rows");
 const seen=new Set<string>();
 for(const layer of layers){
  if(!layer.id||seen.has(layer.id))throw new RangeError("Duplicate or empty layer id: "+layer.id);
  seen.add(layer.id);
  if(!layer.name.trim())throw new RangeError("Layer name is blank: "+layer.id);
  if(!Number.isFinite(layer.opacity)||layer.opacity<0||layer.opacity>1)
   throw new RangeError("Layer opacity must be within 0..1: "+layer.id);
  if(!Object.hasOwn(KIND_LABELS,layer.kind))throw new RangeError("Unknown layer kind: "+String(layer.kind));
 }
}

/** Clamp to 0..1 and round to whole percent so previews and commits agree. */
export function normalizeOpacity(value:number):number{
 if(!Number.isFinite(value))throw new RangeError("Opacity must be a finite number");
 return Math.round(Math.min(1,Math.max(0,value))*100)/100;
}

/** Opacity after one screen-reader increment (+1) or decrement (-1). */
export function stepOpacity(value:number,direction:-1|1,step=LAYER_OPACITY_STEP):number{
 return normalizeOpacity(value+direction*step);
}

/**
 * Opacity under a horizontal drag. Dragging the full track width changes
 * opacity by 1. A track narrower than one touch target uses the touch target
 * width so tiny layouts are not hypersensitive.
 */
export function opacityFromDrag(start:number,dx:number,trackWidth:number):number{
 if(!Number.isFinite(dx)||!Number.isFinite(trackWidth))throw new RangeError("Invalid opacity drag");
 return normalizeOpacity(start+dx/Math.max(LAYER_TOUCH_TARGET,trackWidth));
}

/** Whole-percent text read by screen readers and shown in the row. */
export function formatOpacity(value:number):string{
 return Math.round(normalizeOpacity(value)*100)+"%";
}

/**
 * Index a dragged row lands on after moving `dy` points vertically. Rows are
 * `rowHeight` tall; the result is clamped to the list.
 */
export function dragTargetIndex(fromIndex:number,dy:number,rowHeight:number,count:number):number{
 if(!Number.isInteger(fromIndex)||fromIndex<0||fromIndex>=count)throw new RangeError("Drag start index out of range");
 if(!Number.isFinite(dy)||!Number.isFinite(rowHeight)||rowHeight<=0)throw new RangeError("Invalid drag metrics");
 return Math.min(count-1,Math.max(0,fromIndex+Math.round(dy/rowHeight)));
}

/**
 * Returns a new array with layer `id` moved to `toIndex` (0 = top). Apps can
 * use it to apply an `onMove` callback to their own state.
 * @throws RangeError when the id is unknown or the index is out of range.
 */
export function moveLayer<T extends Pick<LayerRow,"id">>(layers:readonly T[],id:string,toIndex:number):T[]{
 const from=layers.findIndex(l=>l.id===id);
 if(from<0)throw new RangeError("Unknown layer: "+id);
 if(!Number.isInteger(toIndex)||toIndex<0||toIndex>=layers.length)throw new RangeError("Layer index out of range: "+toIndex);
 const next=layers.slice();
 const [row]=next.splice(from,1);
 next.splice(toIndex,0,row!);
 return next;
}

/**
 * Trimmed name to commit, or `undefined` when the draft is blank or unchanged
 * and the rename should be dropped.
 */
export function resolveRename(current:string,draft:string):string|undefined{
 const next=draft.trim();
 return next&&next!==current?next:undefined;
}

/** Screen-reader label for a row's main element. */
export function layerAccessibilityLabel(layer:LayerRow,index:number,count:number):string{
 return [layer.name,layerKindLabel(layer.kind)+" layer",(index+1)+" of "+count,
  layer.visible?"visible":"hidden",formatOpacity(layer.opacity)+" opacity",
  layer.locked?"locked":undefined].filter(Boolean).join(", ");
}
