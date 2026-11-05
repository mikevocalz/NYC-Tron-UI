import type {ReactNode} from "react";
import type {CommandMenuItem} from "../overlays/CommandPopover.tsx";

/** A plain command button. With `pressed` it is a toggle. */
export interface RibbonButton {
  readonly kind:"button";
  readonly id:string;
  readonly label:string;
  readonly icon?:ReactNode;
  readonly pressed?:boolean;
  readonly disabled?:boolean;
}
/** A command with a primary action and a flyout, drawn as a {@linkcode SplitButton}. */
export interface RibbonSplit {
  readonly kind:"split";
  readonly id:string;
  readonly label:string;
  readonly icon?:ReactNode;
  readonly items:readonly CommandMenuItem[];
  readonly disabled?:boolean;
}
/** One choice in a {@linkcode RibbonGallery}. */
export interface RibbonGalleryItem {
  readonly id:string;
  readonly label:string;
  readonly preview:ReactNode;
}
/** A row of visual choices, e.g. text styles, with the rest in a "More" menu. */
export interface RibbonGallery {
  readonly kind:"gallery";
  readonly id:string;
  readonly label:string;
  readonly items:readonly RibbonGalleryItem[];
  readonly selectedId?:string;
  /** How many choices show inline. @default 4 */
  readonly inline?:number;
}
/** Anything a {@linkcode RibbonGroup} can hold. */
export type RibbonCommand=RibbonButton|RibbonSplit|RibbonGallery;

/** A labelled cluster of commands within a tab. */
export interface RibbonGroup {
  readonly id:string;
  readonly label:string;
  readonly commands:readonly RibbonCommand[];
}
/**
 * One ribbon tab. A contextual tab (`contextualGroup`, e.g. "Picture") is
 * shown only while the app includes it, which it does for the matching
 * selection.
 */
export interface RibbonTab {
  readonly id:string;
  readonly label:string;
  readonly contextualGroup?:string;
  readonly groups:readonly RibbonGroup[];
}

/** Throws on duplicate tab, group or command ids, empty labels, or a gallery selection that is not an item. */
export function validateRibbon(tabs:readonly RibbonTab[]):void{
  const ids=new Set<string>();
  const claim=(id:string,what:string)=>{
    if(typeof id!=="string"||!id)throw new TypeError(`${what} id required`);
    if(ids.has(id))throw new TypeError(`Duplicate ribbon id ${id}`);
    ids.add(id);
  };
  const named=(label:string,what:string)=>{if(typeof label!=="string"||!label.trim())throw new TypeError(`${what} needs a label`);};
  for(const tab of tabs){
    claim(tab.id,"Tab");named(tab.label,"Tab "+tab.id);
    for(const group of tab.groups){
      claim(group.id,"Group");named(group.label,"Group "+group.id);
      for(const command of group.commands){
        claim(command.id,"Command");named(command.label,"Command "+command.id);
        if(command.kind==="gallery"&&command.selectedId!==undefined&&!command.items.some(i=>i.id===command.selectedId))
          throw new TypeError(`Gallery ${command.id} selects a missing item`);
      }
    }
  }
}

/** Accessible tab name; contextual tabs carry their group, e.g. "Format, Picture tools". */
export function ribbonTabLabel(tab:RibbonTab):string{
  return tab.contextualGroup?`${tab.label}, ${tab.contextualGroup} tools`:tab.label;
}

/** Gallery items shown inline: the first `inline`, swapping in the selected one if it is further down. */
export function inlineGalleryItems(gallery:RibbonGallery):readonly RibbonGalleryItem[]{
  const n=Math.max(1,gallery.inline??4);
  const first=gallery.items.slice(0,n);
  const selected=gallery.items.find(i=>i.id===gallery.selectedId);
  if(!selected||first.includes(selected))return first;
  return [...first.slice(0,n-1),selected];
}
