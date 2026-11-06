import type {DockLayout} from "./dock-model.ts";

/** Ids of the presets every studio workspace ships with. */
export const BUILT_IN_PRESET_IDS=["edit","color","audio","review","presentation"] as const;
/** One of {@linkcode BUILT_IN_PRESET_IDS}. */
export type BuiltInPresetId=typeof BUILT_IN_PRESET_IDS[number];

/** Longest preset name, in characters after trimming. */
export const PRESET_NAME_MAX=40;

/**
 * A workspace layout preset as a {@linkcode WorkspacePresetSwitcher} shows it.
 * Built-in presets cannot be renamed or deleted; every preset can be reset.
 */
export interface WorkspacePreset {
  readonly id:string;
  readonly name:string;
  readonly builtIn:boolean;
  /** The current layout differs from the preset's saved one, so Reset has work to do. */
  readonly modified:boolean;
}

/** Why a name was refused, or undefined when it is usable. */
export type PresetNameProblem="empty"|"too-long"|"duplicate";

/**
 * Checks a proposed name against the other presets. Names compare trimmed and
 * case-insensitively; `exceptId` skips the preset being renamed so keeping
 * its own name is allowed.
 */
export function presetNameProblem(name:string,presets:readonly WorkspacePreset[],exceptId?:string):PresetNameProblem|undefined{
  const trimmed=name.trim();
  if(!trimmed)return "empty";
  if([...trimmed].length>PRESET_NAME_MAX)return "too-long";
  const key=trimmed.toLocaleLowerCase();
  if(presets.some(p=>p.id!==exceptId&&p.name.trim().toLocaleLowerCase()===key))return "duplicate";
  return undefined;
}

/** The message shown under the name field for a {@linkcode PresetNameProblem}. */
export function presetNameMessage(problem:PresetNameProblem|undefined,name:string):string|undefined{
  switch(problem){
    case "empty":return "Enter a name.";
    case "too-long":return `Use ${PRESET_NAME_MAX} characters or fewer.`;
    case "duplicate":return `A preset named “${name.trim()}” already exists.`;
    default:return undefined;
  }
}

/** First free "<name> copy", "<name> copy 2", ... that fits the length cap. */
export function copyName(name:string,presets:readonly WorkspacePreset[]):string{
  const base=name.trim();
  for(let n=1;;n++){
    const suffix=n===1?" copy":` copy ${n}`;
    const room=PRESET_NAME_MAX-[...suffix].length;
    const candidate=[...base].slice(0,room).join("").trimEnd()+suffix;
    if(!presetNameProblem(candidate,presets))return candidate;
  }
}

/** Throws on duplicate or missing ids and blank names. */
export function validatePresetList(presets:readonly WorkspacePreset[]):void{
  const seen=new Set<string>();
  for(const p of presets){
    if(typeof p.id!=="string"||!p.id||seen.has(p.id))throw new TypeError("Duplicate or missing preset id");
    if(typeof p.name!=="string"||!p.name.trim())throw new TypeError(`Preset ${p.id} needs a name`);
    seen.add(p.id);
  }
}

/** Which actions the menu offers for the active preset. */
export interface PresetActions {
  readonly canRename:boolean;
  readonly canDelete:boolean;
  readonly canReset:boolean;
}
/** Built-ins are read-only; Reset needs a modified layout. */
export function presetActions(preset:WorkspacePreset|undefined):PresetActions{
  return {
    canRename:!!preset&&!preset.builtIn,
    canDelete:!!preset&&!preset.builtIn,
    canReset:!!preset&&preset.modified,
  };
}

/**
 * Structural equality for dock layouts, for computing
 * {@linkcode WorkspacePreset.modified}. Key order does not matter; floating
 * order does, because it is stacking order.
 */
export function layoutsEqual(a:DockLayout,b:DockLayout):boolean{
  return same(a,b);
}
function same(a:unknown,b:unknown):boolean{
  if(a===b)return true;
  if(typeof a!=="object"||typeof b!=="object"||!a||!b)return false;
  if(Array.isArray(a)!==Array.isArray(b))return false;
  const ka=Object.keys(a).filter(k=>(a as Record<string,unknown>)[k]!==undefined);
  const kb=Object.keys(b).filter(k=>(b as Record<string,unknown>)[k]!==undefined);
  if(ka.length!==kb.length)return false;
  return ka.every(k=>same((a as Record<string,unknown>)[k],(b as Record<string,unknown>)[k]));
}
