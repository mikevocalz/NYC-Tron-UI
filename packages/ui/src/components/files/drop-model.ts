/**
 * Platform-free rules shared by the web and native DropZone and FilePicker:
 * `accept` strings in the HTML input syntax, MIME allowlists, and the
 * enter/leave depth counter that keeps nested drag targets from flickering.
 */
export type AcceptRule=
  | {readonly kind:"extension";readonly value:string}
  | {readonly kind:"mime";readonly value:string}
  | {readonly kind:"mimeGroup";readonly value:string};

/** Parses ".docx,.nfd", "image/*" or "application/pdf" lists. Blank entries are ignored. */
export function parseAccept(accept:string|undefined):AcceptRule[] {
  if(!accept)return [];
  return accept.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean).map(entry=>
    entry.startsWith(".")?{kind:"extension",value:entry}
    : entry.endsWith("/*")?{kind:"mimeGroup",value:entry.slice(0,-1)}
    : {kind:"mime",value:entry});
}

export interface FileLike {readonly fileName?:string;readonly type?:string}

/** True when `accept` is empty or any of its rules matches the file's name or type. */
export function matchesAccept(file:FileLike,accept:string|undefined):boolean {
  const rules=parseAccept(accept);
  if(!rules.length)return true;
  const name=(file.fileName??"").toLowerCase();
  const type=(file.type??"").toLowerCase();
  return rules.some(rule=>
    rule.kind==="extension"?name.endsWith(rule.value)
    : rule.kind==="mimeGroup"?type.startsWith(rule.value)
    : type===rule.value);
}

/**
 * expo-drag-drop-content-view's `allowedMimeTypes` semantics: undefined allows
 * everything, an empty list allows nothing, strings match exactly, RegExps test.
 */
export function matchesMime(type:string,allowed:readonly (string|RegExp)[]|undefined):boolean {
  if(allowed===undefined)return true;
  return allowed.some(rule=>{
    if(typeof rule==="string")return rule===type;
    rule.lastIndex=0;
    return rule.test(type);
  });
}

/** Both filters together: what a drop or a pick keeps. */
export function acceptsFile(file:FileLike,accept:string|undefined,allowed?:readonly (string|RegExp)[]):boolean {
  return matchesAccept(file,accept)&&matchesMime(file.type||"application/octet-stream",allowed);
}

/**
 * `dragenter`/`dragleave` fire for every child the pointer crosses. Counting
 * depth reports one enter and one exit per drag over the whole zone.
 */
export function dragDepth(depth:number,event:"enter"|"leave"|"drop"):{depth:number;edge:"enter"|"exit"|null} {
  if(event==="drop")return {depth:0,edge:depth>0?"exit":null};
  if(event==="enter")return {depth:depth+1,edge:depth===0?"enter":null};
  const next=Math.max(0,depth-1);
  return {depth:next,edge:depth>0&&next===0?"exit":null};
}
