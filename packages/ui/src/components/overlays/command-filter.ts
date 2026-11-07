import type { CommandMenuItem } from "./CommandPopover.tsx";

/** A CommandPopover item plus the fields only search needs. */
export type PaletteCommand=CommandMenuItem&Readonly<{
  /** Extra search terms that are not shown, such as "save" for "Write file". */
  keywords?:readonly string[];
  /** Section name shown before the label and matched by search. */
  group?:string;
}>;

const ID=/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/;

/** Rejects duplicate or malformed IDs and empty labels before anything renders. */
export function validateCommands(commands:readonly PaletteCommand[]):void{
  if(commands.length>1000)throw new RangeError("Too many palette commands");
  const seen=new Set<string>();
  for(const command of commands){
    if(typeof command.id!=="string"||command.id.length>256||!ID.test(command.id)||seen.has(command.id))
      throw new TypeError("Duplicate or invalid command ID");
    if(typeof command.label!=="string"||!command.label.trim()||command.label.length>512)throw new TypeError("Command label required");
    if(command.keywords&&(command.keywords.length>256||command.keywords.some(k=>typeof k!=="string"||k.length>512)))throw new TypeError("Invalid command keywords");
    if(command.disabled!==undefined&&typeof command.disabled!=="boolean")throw new TypeError("Invalid command availability");
    seen.add(command.id);
  }
}

/** Case- and accent-insensitive comparison form. */
export function normalizeSearchText(text:string):string{
  return text.normalize("NFKD").replace(/\p{M}/gu,"").toLocaleLowerCase("en-US").trim();
}

// Lower is better. A token must match somewhere or the command is dropped.
function tokenRank(token:string,label:string,words:readonly string[],extra:readonly string[]):number{
  if(label.startsWith(token))return 0;
  if(words.some(word=>word.startsWith(token)))return 1;
  if(label.includes(token))return 2;
  if(extra.some(term=>term.startsWith(token)))return 3;
  if(extra.some(term=>term.includes(token)))return 4;
  return Number.POSITIVE_INFINITY;
}

/**
 * Every whitespace-separated token must match the label, a keyword, the
 * group or the description. Results sort by how well the label matches; ties
 * keep the caller's order. An empty query returns every command unchanged.
 * Disabled commands stay in the results so people can see they exist.
 */
export function filterCommands(commands:readonly PaletteCommand[],query:string):PaletteCommand[]{
  const tokens=normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if(!tokens.length)return [...commands];
  const ranked:{command:PaletteCommand;score:number;index:number}[]=[];
  commands.forEach((command,index)=>{
    const label=normalizeSearchText(command.label);
    const words=label.split(/[\s\-_/.:]+/).filter(Boolean);
    const extra=[...(command.keywords??[]),command.group??"",command.description??""]
      .map(normalizeSearchText).filter(Boolean);
    let score=0;
    for(const token of tokens){
      const rank=tokenRank(token,label,words,extra);
      if(rank===Number.POSITIVE_INFINITY)return;
      score+=rank;
    }
    ranked.push({command,score,index});
  });
  return ranked.sort((a,b)=>a.score-b.score||a.index-b.index).map(entry=>entry.command);
}

/** Arrow/Home/End movement over enabled results; wraps like the native menus. */
export function nextActiveCommand(
  results:readonly PaletteCommand[],currentId:string|undefined,key:string
):string|undefined{
  const enabled=results.filter(command=>!command.disabled);
  if(!enabled.length)return undefined;
  if(key==="Home")return enabled[0]!.id;
  if(key==="End")return enabled[enabled.length-1]!.id;
  if(key!=="ArrowDown"&&key!=="ArrowUp")return undefined;
  const index=enabled.findIndex(command=>command.id===currentId);
  if(index<0)return enabled[key==="ArrowUp"?enabled.length-1:0]!.id;
  return enabled[(index+(key==="ArrowDown"?1:-1)+enabled.length)%enabled.length]!.id;
}

/** The highlighted command after the results change: keep it if still enabled, else the first enabled one. */
export function reconcileActiveCommand(
  results:readonly PaletteCommand[],currentId:string|undefined
):string|undefined{
  if(currentId&&results.some(command=>command.id===currentId&&!command.disabled))return currentId;
  return results.find(command=>!command.disabled)?.id;
}
