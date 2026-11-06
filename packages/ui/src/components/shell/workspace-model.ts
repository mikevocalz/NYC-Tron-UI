import {validateDockLayout,type DockLayout} from "./dock-model.ts";

/** The one document a {@linkcode WorkspaceHost} edits. */
export interface WorkspaceDocument {
  /** Stable id. The canvas is keyed by it, so a new id mounts a new canvas. */
  readonly id:string;
  readonly title:string;
  /** Unsaved changes. Shown as a marker and spoken with the title. */
  readonly dirty?:boolean;
}

/**
 * One editing mode of a {@linkcode WorkspaceHost}, such as edit, color, audio,
 * review or presentation. A mode is a panel set plus the layout it starts in.
 */
export interface WorkspaceMode {
  readonly id:string;
  /** Tab text and the spoken name, e.g. "Color". */
  readonly label:string;
  /** Ids of the panels this mode may dock. Its layouts may only use these. */
  readonly panels:readonly string[];
  /** Layout used until the host stores one for this mode, and restored by a reset. */
  readonly defaultLayout:DockLayout;
}

/** Ctrl/Cmd+1 through Ctrl/Cmd+9 reach the first nine modes. */
export const MODE_SHORTCUT_COUNT=9;

/**
 * Throws when mode ids repeat or are empty, a label is blank, a mode names a
 * panel the host does not supply, or a default or stored layout uses a panel
 * outside its mode. Stored layouts for ids that are no longer modes are
 * ignored, so a host can keep them for undo.
 */
export function validateWorkspace(
  modes:readonly WorkspaceMode[],layouts:Readonly<Record<string,DockLayout>>,panelIds:readonly string[],
):void{
  if(!modes.length)throw new TypeError("A workspace needs at least one mode");
  const seen=new Set<string>();
  const known=new Set(panelIds);
  for(const mode of modes){
    if(typeof mode.id!=="string"||!mode.id||seen.has(mode.id))throw new TypeError("Duplicate or missing mode id");
    if(typeof mode.label!=="string"||!mode.label.trim())throw new TypeError(`Mode ${mode.id} needs a label`);
    seen.add(mode.id);
    for(const id of mode.panels)if(!known.has(id))throw new TypeError(`Mode ${mode.id} names unknown panel ${id}`);
    validateDockLayout(mode.defaultLayout,mode.panels);
    const stored=layouts[mode.id];
    if(stored)validateDockLayout(stored,mode.panels);
  }
}

/** The layout a mode shows: the host's stored one, else the mode's default. */
export function layoutForMode(mode:WorkspaceMode,layouts:Readonly<Record<string,DockLayout>>):DockLayout{
  return layouts[mode.id]??mode.defaultLayout;
}

/** The modifier and key fields {@linkcode modeShortcutIndex} reads from a keydown. */
export interface ShortcutKey {
  readonly key:string;
  /** `KeyboardEvent.code`, so layouts whose digit row types symbols (AZERTY) still work. */
  readonly code?:string;
  readonly ctrlKey:boolean;
  readonly metaKey:boolean;
  readonly altKey:boolean;
  readonly shiftKey:boolean;
}

/**
 * Index 0 to 8 for Ctrl+1..9 or Cmd+1..9, or null for anything else.
 * Exactly one of Ctrl and Cmd must be held, with no Alt or Shift.
 */
export function modeShortcutIndex(k:ShortcutKey):number|null{
  if(k.ctrlKey===k.metaKey||k.altKey||k.shiftKey)return null;
  const digit=/^[1-9]$/.test(k.key)?k.key:/^Digit[1-9]$/.test(k.code??"")?k.code!.slice(5):undefined;
  return digit===undefined?null:Number(digit)-1;
}

/** Visible shortcut text for the mode at `index`, or undefined past the ninth. */
export function modeShortcutLabel(index:number,apple:boolean):string|undefined{
  if(!Number.isInteger(index)||index<0||index>=MODE_SHORTCUT_COUNT)return undefined;
  return (apple?"⌘":"Ctrl+")+(index+1);
}

/** What a screen reader hears after a mode switch, e.g. "Color mode, 2 of 5". */
export function modeAnnouncement(modes:readonly WorkspaceMode[],id:string):string{
  const at=modes.findIndex(m=>m.id===id);
  if(at<0)return "";
  return `${modes[at]!.label} mode, ${at+1} of ${modes.length}`;
}

/** Spoken document title, with the unsaved state in words. */
export function documentLabel(document:WorkspaceDocument):string{
  return document.dirty?`${document.title}, unsaved changes`:document.title;
}
