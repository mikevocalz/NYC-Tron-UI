/** One open document in a {@linkcode DocumentTabBar}. */
export interface DocumentTab {
  readonly id:string;
  readonly title:string;
  /** Unsaved changes. Shown as a marker and announced with the title. */
  readonly dirty?:boolean;
  /** @default true */
  readonly closable?:boolean;
}

/** Throws on a missing title or a duplicate id, before anything renders. */
export function validateDocumentTabs(tabs:readonly DocumentTab[]):void{
  if(tabs.length>1000)throw new RangeError("Too many document tabs");
  const seen=new Set<string>();
  for(const tab of tabs){
    if(typeof tab.id!=="string"||!tab.id.trim()||tab.id.length>256)throw new TypeError("Document tab id required");
    if(seen.has(tab.id))throw new TypeError(`Duplicate document tab ${tab.id}`);
    if(typeof tab.title!=="string"||!tab.title.trim()||tab.title.length>512)throw new TypeError(`Document tab ${tab.id} needs a title`);
    if(tab.dirty!==undefined&&typeof tab.dirty!=="boolean"||tab.closable!==undefined&&typeof tab.closable!=="boolean")throw new TypeError("Invalid document tab flags");
    seen.add(tab.id);
  }
}

/** Accessible name of a tab: the title, plus "unsaved changes" when dirty. */
export function documentTabLabel(tab:DocumentTab):string{
  return tab.dirty?tab.title+", unsaved changes":tab.title;
}

/**
 * Order of ids after moving `id` to `toIndex` (clamped). Returns the same
 * array when nothing moves, so callers can skip a no-op update.
 */
export function moveDocument(ids:readonly string[],id:string,toIndex:number):readonly string[]{
  const from=ids.indexOf(id);
  if(from<0||!Number.isFinite(toIndex))return ids;
  const to=Math.max(0,Math.min(ids.length-1,Math.trunc(toIndex)));
  if(to===from)return ids;
  const next=[...ids];
  next.splice(to,0,...next.splice(from,1));
  return next;
}

/**
 * Which tab to show after `closing` closes: the one that slides into its
 * place, else the one before it. Closing a background tab keeps `active`.
 * Undefined when no tab is left.
 */
export function activeAfterClose(ids:readonly string[],closing:string,active:string|undefined):string|undefined{
  if(closing!==active)return active;
  const at=ids.indexOf(closing);
  const rest=ids.filter(id=>id!==closing);
  if(!rest.length)return undefined;
  return rest[Math.min(Math.max(at,0),rest.length-1)];
}
