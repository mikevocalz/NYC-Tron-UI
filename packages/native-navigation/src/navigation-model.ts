/** Stable destination contract with no app theme or routing dependency. */
export interface NativeNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly glyph?: string;
  readonly disabled?: boolean;
}
export function validateNavigationItems(
  items: readonly NativeNavigationItem[], selectedId: string | null
): void {
  const ids=new Set<string>();
  if(items.length>20)throw new RangeError("Navigation rail supports up to 20 visible destinations");
  for(const item of items){
    if(!item.id||!item.label?.trim()||ids.has(item.id))
      throw new TypeError("Native navigation IDs and labels must be unique");
    ids.add(item.id);
  }
  if(selectedId!==null&&!ids.has(selectedId))
    throw new RangeError("Selected destination must be present");
}
