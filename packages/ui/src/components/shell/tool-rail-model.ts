import type {ReactNode} from "react";

/** Icon content, or a function that draws it for the active and resting states. */
export type ToolIcon=ReactNode|((state:{active:boolean})=>ReactNode);

/** One member of a {@linkcode RailTool} group, shown in its flyout. */
export interface RailToolVariant {
  readonly id:string;
  readonly label:string;
  readonly icon:ToolIcon;
  /** Display text for the keyboard shortcut, e.g. "Shift+B". The app owns the binding. */
  readonly shortcut?:string;
}
/** A tool button on a {@linkcode ToolRail}. With `variants` it is a group with a flyout. */
export interface RailTool {
  readonly id:string;
  readonly label:string;
  readonly icon:ToolIcon;
  readonly shortcut?:string;
  readonly disabled?:boolean;
  readonly variants?:readonly RailToolVariant[];
}

/** The id a group button selects: the app's choice, else its first variant. */
export function shownVariantId(tool:RailTool,groupSelection?:Readonly<Record<string,string>>):string{
  const variants=tool.variants??[];
  const chosen=groupSelection?.[tool.id];
  return variants.some(v=>v.id===chosen)?chosen!:variants[0]?.id??tool.id;
}
/** True when `activeToolId` is the tool or one of its variants. */
export function toolIsActive(tool:RailTool,activeToolId:string|undefined):boolean{
  return !!activeToolId&&(tool.id===activeToolId||!!tool.variants?.some(v=>v.id===activeToolId));
}

