/** Cycle/duplicate-safe projection. Expansion is presentation-only, not a second data store. */
export interface TreeGridNode {
  readonly id:string;
  readonly label:string;
  readonly values?:Readonly<Record<string,string|number|boolean|null>>;
  readonly children?:readonly TreeGridNode[];
}
export interface VisibleTreeRow { readonly node:TreeGridNode; readonly depth:number; readonly hasChildren:boolean; }
export function visibleTreeRows(nodes:readonly TreeGridNode[],expanded:ReadonlySet<string>,maxDepth=64):VisibleTreeRow[]{
  if(!Number.isSafeInteger(maxDepth)||maxDepth<0)throw new RangeError("Invalid tree depth");
  const seen=new Set<string>();
  const out:VisibleTreeRow[]=[];
  const walk=(items:readonly TreeGridNode[],depth:number)=>{
    if(depth>maxDepth)throw new RangeError("Tree exceeds maximum depth");
    for(const node of items){
      if(!node.id||seen.has(node.id))throw new Error("Invalid or duplicate tree id: "+node.id);
      seen.add(node.id);
      const hasChildren=Boolean(node.children?.length);
      out.push({node,depth,hasChildren});
      if(hasChildren&&expanded.has(node.id))walk(node.children!,depth+1);
    }
  };
  walk(nodes,0);
  return out;
}
