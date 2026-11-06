import {normalizeSearchText} from "../overlays/command-filter.ts";

/**
 * What the inspector is showing properties for. Each state carries only
 * its own facts.
 * @see {@linkcode selectionHeading}
 */
export type InspectorSelection=
  | {readonly kind:"none"}
  | {readonly kind:"single";readonly title:string;readonly detail?:string}
  | {readonly kind:"multiple";readonly count:number;readonly noun:{readonly one:string;readonly other:string}};

/** Panel heading for a selection: the object's title, or "3 layers". */
export function selectionHeading(selection:InspectorSelection):string{
  switch(selection.kind){
    case "none":return "No selection";
    case "single":return selection.title;
    case "multiple":
      if(!Number.isInteger(selection.count)||selection.count<2)throw new RangeError("A multiple selection has at least two objects");
      return `${selection.count} ${selection.noun.other}`;
  }
}

/**
 * True when every word of `query` starts a word of the label or a keyword, or
 * appears inside the label. Case and accents are ignored; an empty query
 * matches everything.
 */
export function matchesQuery(query:string,label:string,keywords:readonly string[]=[]):boolean{
  const tokens=normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if(!tokens.length)return true;
  const text=normalizeSearchText(label);
  const words=[...text.split(/[\s\-_/.:]+/),...keywords.map(normalizeSearchText)].filter(Boolean);
  return tokens.every(t=>text.includes(t)||words.some(w=>w.startsWith(t)));
}

/** Live-region text for a filtered inspector. */
export function matchSummary(count:number,query:string):string{
  if(!query.trim())return "";
  if(count===0)return `No properties match "${query.trim()}"`;
  return count===1?"1 property matches":`${count} properties match`;
}

/** One registered {@linkcode PropertyRow}: the sections it sits in and whether it matches the query. */
export interface InspectorRowEntry {
  readonly sections:readonly string[];
  readonly match:boolean;
}
/** State shared between an inspector panel and its rows. */
export interface InspectorRegistryState {
  readonly rows:Readonly<Record<string,InspectorRowEntry>>;
}
/**
 * Store rows register into so sections can hide when nothing in them
 * matches. A zustand vanilla store satisfies it; this file stays free of
 * runtime imports so the contract tests run without an install.
 */
export interface InspectorRegistry {
  getState():InspectorRegistryState;
  setState(update:(state:InspectorRegistryState)=>InspectorRegistryState):void;
}

/** Add or update a row. Returns the cleanup that removes it. */
export function registerRow(registry:InspectorRegistry,id:string,entry:InspectorRowEntry):()=>void{
  const current=registry.getState().rows[id];
  if(!current||current.match!==entry.match||current.sections.join("\u0000")!==entry.sections.join("\u0000"))
    registry.setState(s=>({rows:{...s.rows,[id]:entry}}));
  return ()=>registry.setState(s=>{
    const {[id]:_,...rows}=s.rows;
    return {rows};
  });
}
/** Matching rows, optionally only those inside `section`. */
export function matchingRowCount(state:InspectorRegistryState,section?:string):number{
  return Object.values(state.rows).filter(r=>r.match&&(section===undefined||r.sections.includes(section))).length;
}
