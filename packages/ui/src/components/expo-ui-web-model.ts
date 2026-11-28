/**
 * Pure helpers for the components that render @expo/ui 58's universal
 * components on web (Switch, Checkbox, Textarea, Sheet). No React or React
 * Native import, so the rules are unit tested directly.
 */

/**
 * The `--expo-ui-*` variables that @expo/ui 58's universal web Switch,
 * Checkbox and TextInput styles read (`src/universal/webUtils.ts`), mapped to
 * the Tron variables documented in docs/THEME_TOKENS.md. The universal web
 * BottomSheet reads none of them; Sheet passes its surface as
 * `containerColor` instead.
 *
 * The universal web `Host` writes a generated primary scale (from its
 * `seedColor`, default iOS blue) inline on its own element, which beats any
 * stylesheet rule an app puts on `:root`. These components therefore pass
 * this map as the Host's `style`, which @expo/ui merges after that scale.
 */
export const EXPO_UI_TRON_VARIABLES:Readonly<Record<string,string>>=Object.freeze({
  /** TextInput field fill, Checkbox box fill. */
  "--expo-ui-background":"var(--color-surface-sunken)",
  /** Switch and Checkbox label text. */
  "--expo-ui-foreground":"var(--color-text)",
  /** TextInput border. */
  "--expo-ui-gray-200":"var(--color-border)",
  /** Switch off track, Checkbox unchecked border. */
  "--expo-ui-gray-300":"var(--color-text-muted)",
  /** TextInput placeholder. */
  "--expo-ui-gray-500":"var(--color-text-muted)",
  /** TextInput text. */
  "--expo-ui-gray-900":"var(--color-text)",
  /** Switch on track, Checkbox checked fill and hover border, TextInput focus border, every focus shadow. */
  "--expo-ui-primary-500":"var(--color-primary)",
});

/**
 * Host `style` for a universal component on web. With `seeded` (the app
 * passed an explicit color, which becomes the Host's `seedColor`) the
 * primary variable is left to @expo/ui's generated scale.
 */
export function expoUiWebHostStyle(seeded=false):Record<string,string>{
  const out:Record<string,string>={...EXPO_UI_TRON_VARIABLES};
  if(seeded)delete out["--expo-ui-primary-500"];
  return out;
}

/** An attribute value for a DOM patch: booleans become "true"/"false" only when set. */
export function ariaValue(value:string|boolean|undefined|null):string|undefined{
  if(value===undefined||value===null||value===false)return undefined;
  if(value===true)return "true";
  const trimmed=value.trim();
  return trimmed?trimmed:undefined;
}

/** Attributes to set on a DOM element. `undefined` restores an attribute this patch set before. */
export type AriaPatch=Readonly<Record<string,string|undefined>>;

/**
 * Attributes a patch has written, each with the value the element had
 * before the first write (`null` when it had none).
 */
export type AriaPatchOwned=Map<string,string|null>;

interface AttributeTarget{
  setAttribute(name:string,value:string):void;
  removeAttribute(name:string):void;
  getAttribute(name:string):string|null;
}
const isTarget=(value:unknown):value is AttributeTarget=>
  !!value&&typeof (value as AttributeTarget).setAttribute==="function"&&
  typeof (value as AttributeTarget).removeAttribute==="function"&&
  typeof (value as AttributeTarget).getAttribute==="function";

/**
 * Finds the element to patch from a host node (a DOM element on React Native
 * Web): the first descendant matching `selector`, or with `"ancestor"` the
 * nearest ancestor. Null when the node is not a DOM element (native hosts,
 * server rendering) or nothing matches.
 */
export function findAriaTarget(node:unknown,selector:string,where:"descendant"|"ancestor"="descendant"):AttributeTarget|null{
  const n=node as {querySelector?:(s:string)=>unknown;closest?:(s:string)=>unknown}|null|undefined;
  const found=where==="ancestor"?n?.closest?.(selector):n?.querySelector?.(selector);
  return isTarget(found)?found:null;
}

/**
 * Applies `patch` to `target`. The first write of an attribute records the
 * value the element had (in `owned`); when the patch later leaves that
 * attribute `undefined`, the recorded value is put back, or the attribute is
 * removed if it had none. Attributes the patch never wrote, such as React
 * Native Web's own `aria-label`, are never touched. Returns the names that
 * changed.
 */
export function applyAriaPatch(target:AttributeTarget,patch:AriaPatch,owned:AriaPatchOwned):string[]{
  const changed:string[]=[];
  for(const [name,value] of Object.entries(patch)){
    if(value!==undefined){
      if(!owned.has(name))owned.set(name,target.getAttribute(name));
      if(target.getAttribute(name)!==value){target.setAttribute(name,value);changed.push(name);}
    }else if(owned.has(name)){
      const original=owned.get(name)??null;
      owned.delete(name);
      if(target.getAttribute(name)===original)continue;
      if(original===null)target.removeAttribute(name);
      else target.setAttribute(name,original);
      changed.push(name);
    }
  }
  return changed;
}

/**
 * Sets the DOM `indeterminate` property of a checkbox input, which has no
 * attribute form. Returns whether the property changed; false off the DOM.
 */
export function applyIndeterminate(target:unknown,mixed:boolean):boolean{
  const input=target as {indeterminate?:unknown}|null|undefined;
  if(!input||typeof input.indeterminate!=="boolean"||input.indeterminate===mixed)return false;
  input.indeterminate=mixed;
  return true;
}
