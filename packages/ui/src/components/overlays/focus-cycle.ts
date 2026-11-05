/**
 * Tab and Shift+Tab inside an open overlay. Focus wraps at both ends and never
 * leaves the overlay; a focus position that is not in the list (for example
 * the overlay container itself) enters at the first or last stop.
 */
export function cycleFocusIndex(count:number,current:number,backwards:boolean):number{
  if(!Number.isInteger(count)||count<=0)return -1;
  if(current<0||current>=count)return backwards?count-1:0;
  return (current+(backwards?-1:1)+count)%count;
}

/** Same rule over stable IDs, so a list update never leaves a stale index. */
export function cycleFocusTarget(
  ids:readonly string[],currentId:string|undefined,backwards:boolean
):string|undefined{
  const next=cycleFocusIndex(ids.length,currentId===undefined?-1:ids.indexOf(currentId),backwards);
  return next<0?undefined:ids[next];
}
