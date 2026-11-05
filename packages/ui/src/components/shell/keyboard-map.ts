import {bindingFromChord,normalizeBinding,type Binding,type KeyChord,type ShortcutCommand} from "./shortcut-model.ts";

/**
 * One command in a {@linkcode KeyboardMap}. Extends the
 * {@linkcode ShortcutCommand} the KeyboardShortcutHUD lists, so one array
 * feeds both the sheet and the dispatcher.
 */
export interface KeyboardMapEntry extends ShortcutCommand {
  /**
   * Where the binding is live. `"global"` (the default) works everywhere;
   * any other name works only while that scope is active, and an active
   * scope's binding wins over the same binding in a scope further out.
   * @default "global"
   */
  readonly scope?:string;
  /**
   * Fire even while a text field has focus. Off by default: a field keeps
   * its own typing and editing keys (Mod+C, Mod+Z, arrows, Backspace).
   * @default false
   */
  readonly allowInTextInput?:boolean;
  /** A disabled command is listed but never dispatched. */
  readonly disabled?:boolean;
}

/** Two commands in one scope that share a binding. Only the first one dispatches. */
export interface KeyboardMapConflict {
  readonly binding:Binding;
  readonly scope:string;
  /** Ids in registration order; `ids[0]` is the one that dispatches. */
  readonly ids:readonly string[];
}

/** A binding the operating system takes before the app sees it. */
export interface ReservedBindingIssue {
  readonly id:string;
  readonly binding:Binding;
  /** What the system does with the chord, for the warning text. */
  readonly reason:string;
}

/** Context for one keydown: which scopes are active and whether a text field has focus. */
export interface KeyDispatchContext {
  /** Active scopes, innermost first. `"global"` is always active and need not be listed. */
  readonly activeScopes?:readonly string[];
  readonly textInputFocused?:boolean;
}

/** A binding a native key source should intercept, with the fields iOS needs for a UIKeyCommand. */
export interface NativeKeyBinding {
  readonly binding:Binding;
  /** Canonical key: one character, or a name such as `ArrowUp`, `Enter`, `F5`. */
  readonly key:string;
  readonly mod:boolean;
  readonly ctrl:boolean;
  readonly alt:boolean;
  readonly shift:boolean;
  /** Shown in the iPad Command-key overlay. */
  readonly title:string;
  /**
   * The chord may take priority over system and text-field behavior. False
   * for text editing chords, so a focused field still copies and undoes.
   */
  readonly overridesSystem:boolean;
}

const GLOBAL="global";

/** Chords a focused text field handles itself (normalized). */
const TEXT_EDITING=new Set(["Mod+A","Mod+C","Mod+V","Mod+X","Mod+Z","Mod+Shift+Z","Mod+Y","Mod+Shift+V",
  "Mod+ArrowLeft","Mod+ArrowRight","Mod+ArrowUp","Mod+ArrowDown","Alt+ArrowLeft","Alt+ArrowRight",
  "Mod+Backspace","Alt+Backspace","Mod+Delete","Alt+Delete"]);

const APPLE_RESERVED:Readonly<Record<string,string>>={
  "Mod+Q":"quits the app","Mod+H":"hides the app","Mod+Tab":"switches apps","Mod+Space":"opens Spotlight",
  "Mod+M":"minimizes the window","Mod+Alt+Escape":"opens Force Quit","Mod+Shift+3":"takes a screenshot",
  "Mod+Shift+4":"takes a screenshot","Mod+Shift+5":"opens screenshot tools","Ctrl+Space":"switches input source",
};
const OTHER_RESERVED:Readonly<Record<string,string>>={
  "Alt+F4":"closes the window","Alt+Tab":"switches apps","Mod+Alt+Delete":"opens the system menu",
  "Mod+Escape":"opens the system menu","Mod+Space":"switches keyboard layout","Alt+Shift+Tab":"switches apps",
};

/** True when a text field handles `binding` itself. */
export function isTextEditingBinding(binding:Binding):boolean{
  const normal=normalizeBinding(binding);
  return normal!==undefined&&TEXT_EDITING.has(normal);
}

/** What the OS does with `binding`, or undefined when the app receives it. */
export function reservedBindingReason(binding:Binding,apple:boolean):string|undefined{
  const normal=normalizeBinding(binding);
  return normal===undefined?undefined:(apple?APPLE_RESERVED:OTHER_RESERVED)[normal];
}

/**
 * True when `binding` would fire while typing: no Mod, Ctrl or Alt, and not
 * a function key or Escape. Those reach a focused field first.
 */
function typesIntoField(binding:Binding):boolean{
  const parts=binding.split("+");
  const key=parts[parts.length-1]!;
  if(/^F([1-9]|1[0-2])$/.test(key)||key==="Escape")return false;
  return !parts.some(p=>p==="Mod"||p==="Ctrl"||p==="Alt");
}

/** Splits a normalized binding into the fields a native key source needs. */
export function toNativeKeyBinding(binding:Binding,title:string):NativeKeyBinding|undefined{
  const normal=normalizeBinding(binding);
  if(!normal)return undefined;
  const parts=normal.split("+");
  const key=parts.pop()!;
  return {binding:normal,key,mod:parts.includes("Mod"),ctrl:parts.includes("Ctrl"),alt:parts.includes("Alt"),
    shift:parts.includes("Shift"),title,overridesSystem:!TEXT_EDITING.has(normal)};
}

/**
 * A scoped registry over the commands an app binds to keys. It resolves a
 * keydown to at most one command: the innermost active scope wins, a
 * disabled command never fires, and a focused text field keeps its typing
 * and editing keys unless the command opts in with `allowInTextInput`.
 *
 * Use {@linkcode KeyboardMap.conflicts} and {@linkcode KeyboardMap.reserved}
 * to show the person what will not work before they rely on it.
 */
export interface KeyboardMap {
  readonly entries:readonly KeyboardMapEntry[];
  /** The command a keydown runs, or undefined. */
  resolve(chord:KeyChord,context?:KeyDispatchContext):KeyboardMapEntry|undefined;
  /** Same as {@linkcode KeyboardMap.resolve} for a binding string. */
  resolveBinding(binding:Binding,context?:KeyDispatchContext):KeyboardMapEntry|undefined;
  /** Bindings shared by two or more commands in one scope. */
  conflicts():KeyboardMapConflict[];
  /** Bindings the operating system intercepts. */
  reserved():ReservedBindingIssue[];
  /** Every distinct enabled binding, for a native key source to intercept. */
  nativeBindings():NativeKeyBinding[];
}

/**
 * Builds a {@linkcode KeyboardMap}. `apple` picks Command as `Mod` and the
 * Apple reserved list; elsewhere `Mod` is Control.
 * @throws when two entries share an id
 */
export function createKeyboardMap(entries:readonly KeyboardMapEntry[],apple:boolean):KeyboardMap{
  const seen=new Set<string>();
  for(const e of entries){
    if(seen.has(e.id))throw new Error(`Duplicate keyboard command id "${e.id}"`);
    seen.add(e.id);
  }
  // scope -> normalized binding -> ids in registration order
  const table=new Map<string,Map<Binding,string[]>>();
  const byId=new Map(entries.map(e=>[e.id,e]));
  for(const e of entries){
    if(e.disabled||!e.binding)continue;
    const normal=normalizeBinding(e.binding);
    if(!normal)continue;
    const scope=e.scope??GLOBAL;
    let row=table.get(scope);
    if(!row){row=new Map();table.set(scope,row);}
    const ids=row.get(normal);
    if(ids)ids.push(e.id);else row.set(normal,[e.id]);
  }
  const resolveBinding=(binding:Binding,context:KeyDispatchContext={}):KeyboardMapEntry|undefined=>{
    const normal=normalizeBinding(binding);
    if(!normal)return undefined;
    const scopes=[...(context.activeScopes??[]).filter(s=>s!==GLOBAL),GLOBAL];
    for(const scope of scopes){
      const id=table.get(scope)?.get(normal)?.[0];
      if(id===undefined)continue;
      const entry=byId.get(id)!;
      if(context.textInputFocused&&!entry.allowInTextInput&&(TEXT_EDITING.has(normal)||typesIntoField(normal)))return undefined;
      return entry;
    }
    return undefined;
  };
  return {
    entries,
    resolveBinding,
    resolve(chord,context){
      const binding=bindingFromChord(chord,apple);
      return binding===undefined?undefined:resolveBinding(binding,context);
    },
    conflicts(){
      const out:KeyboardMapConflict[]=[];
      for(const [scope,row] of table)for(const [binding,ids] of row)if(ids.length>1)out.push({binding,scope,ids:[...ids]});
      return out;
    },
    reserved(){
      return entries.flatMap(e=>{
        if(e.disabled||!e.binding)return [];
        const reason=reservedBindingReason(e.binding,apple);
        return reason?[{id:e.id,binding:normalizeBinding(e.binding)!,reason}]:[];
      });
    },
    nativeBindings(){
      const out=new Map<Binding,NativeKeyBinding>();
      for(const row of table.values())for(const [binding,ids] of row){
        if(out.has(binding))continue;
        const native=toNativeKeyBinding(binding,byId.get(ids[0]!)!.label);
        if(native)out.set(binding,native);
      }
      return [...out.values()];
    },
  };
}
