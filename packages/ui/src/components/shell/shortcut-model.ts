/**
 * Key bindings as portable strings: modifiers in a fixed order, then the key,
 * joined by "+", e.g. "Mod+Shift+S". `Mod` is Command on Apple keyboards and
 * Control elsewhere, so one binding serves both.
 */
export type Binding=string;

/** A command a {@linkcode KeyboardShortcutHUD} lists. */
export interface ShortcutCommand {
  readonly id:string;
  readonly label:string;
  /** Section heading, e.g. "File" or "Tools". */
  readonly group?:string;
  readonly binding?:Binding;
  /** The shipped binding. "Reset" restores it. */
  readonly defaultBinding?:Binding;
  /** Extra words search matches. */
  readonly keywords?:readonly string[];
}

const MODIFIERS=["Mod","Ctrl","Alt","Shift"] as const;
const NAMED=new Set(["Enter","Escape","Tab","Space","Backspace","Delete","Home","End","PageUp","PageDown",
  "ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Insert",...Array.from({length:12},(_,i)=>"F"+(i+1))]);
const FUNCTION_KEY=/^F([1-9]|1[0-2])$/;

/** The parts of a keydown event a binding needs. */
export interface KeyChord {
  readonly key:string;
  readonly ctrlKey?:boolean;
  readonly metaKey?:boolean;
  readonly altKey?:boolean;
  readonly shiftKey?:boolean;
}

/**
 * A source of hardware key chords for recording a binding where React
 * Native has no key events (iOS and Android). `@nyc-tron/hardware-keys`
 * provides one; pass it to KeyboardShortcutHUD as `recorder`.
 */
export interface ChordRecorder {
  /**
   * Start delivering every keydown to `onChord` until the returned
   * subscription is removed. The source consumes the keys while recording.
   */
  startRecording(onChord:(chord:KeyChord)=>void):{remove():void};
}

function canonicalKey(key:string):string|undefined{
  if(key===" "||key==="Spacebar")return "Space";
  if(key==="Esc")return "Escape";
  if(key==="Del")return "Delete";
  if(NAMED.has(key))return key;
  if(key.length===1&&/\S/.test(key))return key.toUpperCase();
  return undefined;
}

/**
 * Binding for a keydown, or undefined for a lone modifier or an unsupported
 * key. On Apple platforms Command is `Mod` and Control stays `Ctrl`;
 * elsewhere Control is `Mod`.
 */
export function bindingFromChord(chord:KeyChord,apple:boolean):Binding|undefined{
  if(["Shift","Control","Alt","Meta","OS","AltGraph","CapsLock"].includes(chord.key))return undefined;
  const key=canonicalKey(chord.key);
  if(!key)return undefined;
  const mod=apple?chord.metaKey:chord.ctrlKey;
  const ctrl=apple&&chord.ctrlKey;
  const parts=[mod&&"Mod",ctrl&&"Ctrl",chord.altKey&&"Alt",chord.shiftKey&&"Shift",key].filter(Boolean) as string[];
  return parts.join("+");
}

/** Canonical form of a binding string, or undefined when it is malformed. */
export function normalizeBinding(binding:string):Binding|undefined{
  const parts=binding.split("+").map(p=>p.trim());
  if(binding.endsWith("++"))parts.splice(parts.length-2,2,"+");
  const key=canonicalKey(parts.pop()??"");
  if(!key)return undefined;
  const mods=new Set<string>();
  for(const p of parts){
    const m=p==="Cmd"||p==="Command"||p==="Meta"?"Mod":p==="Control"?"Ctrl":p==="Option"?"Alt":p;
    if(!(MODIFIERS as readonly string[]).includes(m)||mods.has(m))return undefined;
    mods.add(m);
  }
  return [...MODIFIERS.filter(m=>mods.has(m)),key].join("+");
}

/**
 * Whether a binding is safe to assign: it needs Mod, Ctrl or Alt, unless it
 * is a function key. Bare letters would fire while typing in text fields.
 */
export function isAssignableBinding(binding:Binding):boolean{
  const normal=normalizeBinding(binding);
  if(!normal)return false;
  const parts=normal.split("+");
  const key=parts[parts.length-1]!;
  return FUNCTION_KEY.test(key)||parts.some(p=>p==="Mod"||p==="Ctrl"||p==="Alt");
}

/** The other command already using `binding`, if any. */
export function findConflict(commands:readonly ShortcutCommand[],id:string,binding:Binding):ShortcutCommand|undefined{
  const normal=normalizeBinding(binding);
  return normal===undefined?undefined:commands.find(c=>c.id!==id&&c.binding!==undefined&&normalizeBinding(c.binding)===normal);
}

/** Keycap labels for display: Apple glyphs on Apple platforms, words elsewhere. */
export function bindingKeycaps(binding:Binding,apple:boolean):string[]{
  const normal=normalizeBinding(binding);
  if(!normal)return [binding];
  const appleNames:Record<string,string>={Mod:"⌘",Ctrl:"⌃",Alt:"⌥",Shift:"⇧",Enter:"↩",Backspace:"⌫",Delete:"⌦",Escape:"esc",
    ArrowUp:"↑",ArrowDown:"↓",ArrowLeft:"←",ArrowRight:"→",Tab:"⇥"};
  const names:Record<string,string>={Mod:"Ctrl",ArrowUp:"Up",ArrowDown:"Down",ArrowLeft:"Left",ArrowRight:"Right",Escape:"Esc",PageUp:"Page Up",PageDown:"Page Down"};
  return normal.split("+").map(p=>(apple?appleNames[p]:names[p])??p);
}

/** Spoken form, e.g. "Command Shift S" or "Control Shift S". */
export function bindingSpoken(binding:Binding,apple:boolean):string{
  const normal=normalizeBinding(binding);
  if(!normal)return binding;
  const words:Record<string,string>={Mod:apple?"Command":"Control",Ctrl:"Control",Alt:apple?"Option":"Alt",
    ArrowUp:"Up arrow",ArrowDown:"Down arrow",ArrowLeft:"Left arrow",ArrowRight:"Right arrow",PageUp:"Page up",PageDown:"Page down"};
  return normal.split("+").map(p=>words[p]??p).join(" ");
}

/** The command bound to a keydown, for the app's own shortcut dispatcher. */
export function commandForChord(commands:readonly ShortcutCommand[],chord:KeyChord,apple:boolean):ShortcutCommand|undefined{
  const binding=bindingFromChord(chord,apple);
  return binding===undefined?undefined:commands.find(c=>c.binding!==undefined&&normalizeBinding(c.binding)===binding);
}
