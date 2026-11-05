/**
 * A static screen-reader audit over a rendered element tree: the plain
 * `{type, props}` objects a test renderer or a mocked `jsx` produces. It
 * checks what VoiceOver and TalkBack read from React Native props, so it runs
 * in unit tests without a device. It does not replace a pass with the
 * screen reader on; it catches the regressions that never need one.
 */

/** One problem {@linkcode auditAccessibility} found. */
export interface A11yIssue {
  readonly rule:A11yRule;
  /** Element types from the root to the element, e.g. `View > Pressable`. */
  readonly path:string;
  /** The element's accessible name, when it has one. */
  readonly label?:string;
  readonly message:string;
}

/**
 * Rules {@linkcode auditAccessibility} checks.
 * - `missing-name`: an interactive element with no label and no text inside.
 * - `adjustable-without-value`: role adjustable with no value to read.
 * - `adjustable-without-actions`: role adjustable without increment and decrement actions.
 * - `actions-without-handler`: accessibility actions with no `onAccessibilityAction`.
 * - `custom-action-without-label`: a custom action the screen reader would read by its code name.
 * - `small-target`: an interactive element sized under the minimum without `hitSlop`.
 * - `image-without-label`: an image role that is neither labelled nor hidden.
 */
export type A11yRule="missing-name"|"adjustable-without-value"|"adjustable-without-actions"|"actions-without-handler"|
  "custom-action-without-label"|"small-target"|"image-without-label";

/** Options for {@linkcode auditAccessibility}. */
export interface A11yAuditOptions {
  /** Minimum touch target in points. @default 44 */
  minTarget?:number;
  /** Rules to skip, with the reason recorded at the call site. */
  ignore?:readonly A11yRule[];
}

interface Node {type:unknown;props?:Record<string,unknown>}

const INTERACTIVE_ROLES=new Set(["button","link","switch","checkbox","radio","tab","menuitem","adjustable","togglebutton","combobox","search"]);
const STANDARD_ACTIONS=new Set(["activate","increment","decrement","longpress","magicTap","escape"]);
// Uniwind/Tailwind size classes the kit uses for 44pt targets (11 * 4 = 44).
const TARGET_CLASS=/(^|\s)(min-h-11|h-11|size-11|min-h-12|h-12|size-12|min-h-14|h-14)(\s|$)/;

function typeName(type:unknown):string{
  if(typeof type==="string")return type;
  if(typeof type==="function")return (type as {displayName?:string;name?:string}).displayName??(type as {name?:string}).name??"Component";
  return "Element";
}

function textOf(node:unknown):string{
  if(typeof node==="string"||typeof node==="number")return String(node);
  if(Array.isArray(node))return node.map(textOf).join("");
  if(node&&typeof node==="object"&&"props" in node){
    const props=(node as Node).props??{};
    if(props.accessibilityElementsHidden||props.importantForAccessibility==="no-hide-descendants"||props["aria-hidden"])return "";
    return textOf(props.children);
  }
  return "";
}

function flatStyle(style:unknown):Record<string,unknown>{
  if(Array.isArray(style))return Object.assign({},...style.map(flatStyle));
  return style&&typeof style==="object"?style as Record<string,unknown>:{};
}

function isHidden(props:Record<string,unknown>):boolean{
  return props.accessibilityElementsHidden===true||props.importantForAccessibility==="no-hide-descendants"||
    props.importantForAccessibility==="no"||props["aria-hidden"]===true;
}

/**
 * Walks `tree` and returns every screen-reader problem it finds; an empty
 * array means the tree passed. Hidden subtrees are skipped.
 *
 * @example
 * const issues=auditAccessibility(renderSliderField(props));
 * assert.deepEqual(issues,[]);
 */
export function auditAccessibility(tree:unknown,options:A11yAuditOptions={}):A11yIssue[]{
  const minTarget=options.minTarget??44;
  const ignore=new Set(options.ignore??[]);
  const issues:A11yIssue[]=[];
  const report=(rule:A11yRule,path:string,label:string|undefined,message:string)=>{
    if(!ignore.has(rule))issues.push({rule,path,...(label?{label}:{}),message});
  };
  const visit=(node:unknown,trail:string)=>{
    if(Array.isArray(node)){node.forEach(n=>visit(n,trail));return;}
    if(!node||typeof node!=="object"||!("props" in node))return;
    const {type}=node as Node;
    const props=(node as Node).props??{};
    if(isHidden(props))return;
    const path=trail?trail+" > "+typeName(type):typeName(type);
    const role=(props.accessibilityRole??props.role) as string|undefined;
    const label=(props.accessibilityLabel??props["aria-label"]) as string|undefined;
    const interactive=typeof props.onPress==="function"||typeof props.onLongPress==="function"||(role!==undefined&&INTERACTIVE_ROLES.has(role));
    if(interactive&&!props.disabled){
      const name=(label??"").trim()||textOf(props.children).trim();
      if(!name)report("missing-name",path,undefined,"Interactive element has no accessibilityLabel and no text a screen reader can read.");
      const style=flatStyle(props.style);
      const cls=typeof props.className==="string"?props.className:"";
      const sized=(k:"Height"|"Width")=>{
        const v=(style["min"+k] as number|undefined)??(style[k.toLowerCase()] as number|undefined);
        return typeof v==="number"?v:undefined;
      };
      const h=sized("Height"),w=sized("Width");
      const small=(h!==undefined&&h<minTarget)||(w!==undefined&&w<minTarget);
      if(small&&!props.hitSlop&&!TARGET_CLASS.test(cls))
        report("small-target",path,label,`Touch target is under ${minTarget}pt and has no hitSlop.`);
    }
    if(role==="adjustable"){
      // React Native maps aria-valuenow/aria-valuetext onto the same value as accessibilityValue.
      const value=props.accessibilityValue as {now?:number;text?:string}|undefined;
      const hasValue=value?.now!==undefined||!!value?.text||props["aria-valuenow"]!==undefined||!!props["aria-valuetext"];
      if(!hasValue)report("adjustable-without-value",path,label,"Adjustable control has no accessibilityValue to read.");
      const names=new Set(((props.accessibilityActions??[]) as {name:string}[]).map(a=>a.name));
      if(!names.has("increment")||!names.has("decrement"))
        report("adjustable-without-actions",path,label,"Adjustable control needs increment and decrement actions for swipe up/down.");
    }
    const actions=(props.accessibilityActions??[]) as {name:string;label?:string}[];
    if(actions.length&&typeof props.onAccessibilityAction!=="function")
      report("actions-without-handler",path,label,"accessibilityActions are listed but onAccessibilityAction is missing.");
    for(const a of actions)if(!STANDARD_ACTIONS.has(a.name)&&!a.label)
      report("custom-action-without-label",path,label,`Custom action "${a.name}" has no label; it would be read by its code name.`);
    if(role==="image"&&!(label??"").trim())
      report("image-without-label",path,undefined,"Image role without a label; label it or hide it from screen readers.");
    visit(props.children,path);
  };
  visit(tree,"");
  return issues;
}
