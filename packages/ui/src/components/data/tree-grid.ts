/** Cycle/duplicate-safe projection. Expansion is presentation-only, not a second data store. */
export interface TreeGridNode {
  readonly id:string;
  readonly label:string;
  readonly values?:Readonly<Record<string,string|number|boolean|null>>;
  readonly children?:readonly TreeGridNode[];
}
/**
 * One row of {@linkcode visibleTreeRows}. `position` and `setSize` count the
 * row among its siblings (1-based), which is what screen readers announce as
 * "3 of 7"; they do not depend on which other branches are expanded.
 */
export interface VisibleTreeRow {
  readonly node:TreeGridNode;
  readonly depth:number;
  readonly hasChildren:boolean;
  /** Parent id, or `undefined` for a root row. */
  readonly parentId?:string;
  /** 1-based position among siblings. */
  readonly position:number;
  /** Sibling count, including this row. */
  readonly setSize:number;
}
export function visibleTreeRows(nodes:readonly TreeGridNode[],expanded:ReadonlySet<string>,maxDepth=64):VisibleTreeRow[]{
  if(!Number.isSafeInteger(maxDepth)||maxDepth<0)throw new RangeError("Invalid tree depth");
  const seen=new Set<string>();
  const out:VisibleTreeRow[]=[];
  const walk=(items:readonly TreeGridNode[],depth:number,parentId:string|undefined)=>{
    if(depth>maxDepth)throw new RangeError("Tree exceeds maximum depth");
    items.forEach((node,index)=>{
      if(!node.id||seen.has(node.id))throw new Error("Invalid or duplicate tree id: "+node.id);
      seen.add(node.id);
      const hasChildren=Boolean(node.children?.length);
      out.push(parentId===undefined
        ?{node,depth,hasChildren,position:index+1,setSize:items.length}
        :{node,depth,hasChildren,parentId,position:index+1,setSize:items.length});
      if(hasChildren&&expanded.has(node.id))walk(node.children!,depth+1,node.id);
    });
  };
  walk(nodes,0,undefined);
  return out;
}

/** Screen-reader label for a {@linkcode VisibleTreeRow}: "Budget, level 2, 3 of 7". */
export function treeRowAccessibilityLabel(row:VisibleTreeRow):string{
  return `${row.node.label}, level ${row.depth+1}, ${row.position} of ${row.setSize}`;
}

/** A column as the {@linkcode orderTreeColumns} helper sees it. */
export interface TreeColumnLike { readonly id:string }
/** Result of {@linkcode orderTreeColumns}: pinned columns stay outside the horizontal scroller. */
export interface OrderedTreeColumns<C extends TreeColumnLike> {
  /** Every column in resolved order, ignoring pins. */
  readonly ordered:readonly C[];
  readonly pinned:readonly C[];
  readonly scrollable:readonly C[];
}
/**
 * Applies a controlled `columnOrder` and `pinnedColumnIds`. Unknown ids are
 * ignored and columns missing from `columnOrder` keep their authored order
 * after the ordered ones, so a stale persisted order never hides a column.
 * Pinned columns render in the same relative order as the unpinned ones.
 */
export function orderTreeColumns<C extends TreeColumnLike>(
  columns:readonly C[],columnOrder?:readonly string[],pinnedColumnIds?:readonly string[],
):OrderedTreeColumns<C>{
  const byId=new Map<string,C>();
  for(const c of columns){
    if(!c.id||byId.has(c.id))throw new Error("Invalid or duplicate column id: "+c.id);
    byId.set(c.id,c);
  }
  const ordered:C[]=[];
  const placed=new Set<string>();
  for(const id of columnOrder??[]){
    const c=byId.get(id);
    if(c&&!placed.has(id)){ordered.push(c);placed.add(id);}
  }
  for(const c of columns)if(!placed.has(c.id))ordered.push(c);
  const pinned=new Set(pinnedColumnIds??[]);
  return {ordered,pinned:ordered.filter(c=>pinned.has(c.id)),scrollable:ordered.filter(c=>!pinned.has(c.id))};
}
/** Moves `id` to `toIndex` inside a column order; used for reorder controls. */
export function moveColumn(order:readonly string[],id:string,toIndex:number):string[]{
  const from=order.indexOf(id);
  if(from<0)throw new Error("Unknown column id: "+id);
  if(!Number.isSafeInteger(toIndex))throw new RangeError("Column index must be an integer");
  const next=order.filter(x=>x!==id);
  next.splice(Math.max(0,Math.min(next.length,toIndex)),0,id);
  return next;
}

/** Focus, range anchor, selection and expansion as one controlled snapshot. */
export interface TreeGridNavState {
  readonly focusId?:string;
  /** Start of a Shift range; moves only on a plain (non-Shift) focus change or Space. */
  readonly anchorId?:string;
  readonly selectedIds:readonly string[];
  readonly expandedIds:readonly string[];
}
/** The subset of a keyboard event {@linkcode treeGridKey} reads. */
export interface TreeGridKeyInput {
  readonly key:string;
  readonly shiftKey?:boolean;
}
/** Ids between two visible rows, inclusive, in visible order. */
export function treeRangeIds(rows:readonly VisibleTreeRow[],fromId:string,toId:string):string[]{
  const a=rows.findIndex(r=>r.node.id===fromId);
  const b=rows.findIndex(r=>r.node.id===toId);
  if(a<0||b<0)return b<0?[]:[toId];
  const [lo,hi]=a<b?[a,b]:[b,a];
  return rows.slice(lo,hi+1).map(r=>r.node.id);
}
/** Adds or removes one id, keeping the existing order of the others. */
export function toggleTreeSelection(selected:readonly string[],id:string):string[]{
  return selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];
}
/**
 * Pure keyboard reducer for {@linkcode TreeGrid}. Follows the WAI-ARIA
 * treegrid pattern: ArrowUp/ArrowDown/Home/End move focus (Shift extends a
 * range from the anchor), ArrowRight expands or enters the first child,
 * ArrowLeft collapses or returns to the parent, Space toggles the focused row
 * (Shift+Space selects the anchor-to-focus range). Returns `undefined` when
 * the key is not handled so the caller can let it propagate.
 */
export function treeGridKey(
  rows:readonly VisibleTreeRow[],state:TreeGridNavState,input:TreeGridKeyInput,
):TreeGridNavState|undefined{
  if(!rows.length)return undefined;
  const index=Math.max(0,rows.findIndex(r=>r.node.id===state.focusId));
  const current=rows[index]!;
  const shift=input.shiftKey===true;
  const moveTo=(i:number):TreeGridNavState=>{
    const target=rows[Math.max(0,Math.min(rows.length-1,i))]!.node.id;
    if(!shift)return {...state,focusId:target,anchorId:target};
    const anchor=state.anchorId??current.node.id;
    return {...state,focusId:target,anchorId:anchor,selectedIds:treeRangeIds(rows,anchor,target)};
  };
  switch(input.key){
    case "ArrowDown":return moveTo(index+1);
    case "ArrowUp":return moveTo(index-1);
    case "Home":return moveTo(0);
    case "End":return moveTo(rows.length-1);
    case "ArrowRight":{
      if(!current.hasChildren)return undefined;
      if(!state.expandedIds.includes(current.node.id)){
        return {...state,focusId:current.node.id,expandedIds:[...state.expandedIds,current.node.id]};
      }
      const child=rows[index+1];
      return child?.parentId===current.node.id?{...state,focusId:child.node.id,anchorId:child.node.id}:undefined;
    }
    case "ArrowLeft":{
      if(current.hasChildren&&state.expandedIds.includes(current.node.id)){
        return {...state,focusId:current.node.id,expandedIds:state.expandedIds.filter(x=>x!==current.node.id)};
      }
      return current.parentId===undefined?undefined:{...state,focusId:current.parentId,anchorId:current.parentId};
    }
    case " ":
    case "Spacebar":{
      const id=current.node.id;
      if(shift)return {...state,focusId:id,selectedIds:treeRangeIds(rows,state.anchorId??id,id)};
      return {...state,focusId:id,anchorId:id,selectedIds:toggleTreeSelection(state.selectedIds,id)};
    }
    default:return undefined;
  }
}
