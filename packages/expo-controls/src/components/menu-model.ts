/** Action semantics shared by native Expo and controlled RN web fallback. */
export interface TronMenuAction {
  readonly id: string;
  readonly title: string;
  readonly disabled?: boolean;
  readonly destructive?: boolean;
  readonly checked?: boolean;
  readonly subactions?: readonly TronMenuAction[];
  /** Inline sections are native section headings on iOS, dividers on Android. */
  readonly displayInline?: boolean;
}
export interface NativeMenuItem {
  readonly id: string;
  readonly title: string;
  readonly attributes?: { readonly disabled?: boolean; readonly destructive?: boolean };
  readonly state?: "on" | "off";
  subactions?: NativeMenuItem[];
  readonly displayInline?: boolean;
}
const ID=/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/;
/** Validation avoids ambiguous IDs, cyclic trees, and disabled actions firing. */
export function normalizeMenuActions(actions:readonly TronMenuAction[]):NativeMenuItem[]{
  const ids=new Set<string>();
  function visit(items:readonly TronMenuAction[],depth:number):NativeMenuItem[]{
    if(depth>4)throw new RangeError("Menu nesting exceeds four levels");
    return items.map(item=>{
      if(typeof item.title!=="string"||!item.title.trim())throw new TypeError("Menu title required");
      if(typeof item.id!=="string"||!ID.test(item.id)||ids.has(item.id))throw new TypeError("Duplicate or invalid menu ID");
      ids.add(item.id);
      if(item.subactions?.length && item.checked!==undefined)
        throw new TypeError("Action group cannot also be a checkbox");
      const nested=item.subactions?.length?visit(item.subactions,depth+1):undefined;
      return {
        id:item.id,title:item.title,
        ...(item.disabled||item.destructive?{attributes:{
          ...(item.disabled?{disabled:true}:{}),
          ...(item.destructive?{destructive:true}:{})
        }}:{}),
        ...(item.checked!==undefined?{state:item.checked?"on" as const:"off" as const}:{}),
        ...(nested?{subactions:nested}:{}),
        ...(item.displayInline?{displayInline:true}:{})
      };
    });
  }
  return visit(actions,0);
}
export function findEnabledMenuAction(
  actions:readonly TronMenuAction[],id:string
):TronMenuAction|undefined{
  for(const action of actions){
    if(action.id===id)return action.disabled?undefined:action;
    const result=action.subactions&&findEnabledMenuAction(action.subactions,id);
    if(result)return action.disabled?undefined:result;
  }
  return undefined;
}
