/*
 * Portions ported from ProCraft for Android,
 * https://github.com/artcraft-android/procraft-android
 * android/app/src/main/java/io/github/artcraftandroid/procraft/ui/LayersPanel.kt
 * at commit c2f7518d03141c746a365f90d8df05a44ddef002 (`LayerRow`: a clipped
 * layer's row indented by 18 dp with a clip glyph before its thumbnail, and
 * group levels indented 21 dp each).
 *
 * Copyright (c) 2026 ArtCraft Team and the ProCraft contributors.
 * Licensed under the MIT License or the Apache License, Version 2.0, at your option.
 * See licenses/ProCraft-LICENSE-MIT.txt, licenses/ProCraft-LICENSE-APACHE.txt and
 * licenses/ProCraft-NOTICE.txt.
 *
 * Modified for NYC-Tron UI on 2026-11-05: rewritten from Kotlin to TypeScript
 * pure functions; base resolution follows the Prism rule (a clipped layer clips
 * to the nearest unclipped sibling below it), and the reasons a layer cannot
 * clip are spelled out instead of the option being hidden.
 */

/** The fields clipping needs from each layer. Index 0 is the topmost layer. */
export interface ClipLayer {
  readonly id:string;
  readonly name:string;
  readonly clipped:boolean;
  /** Group id, or `null`/`undefined` at the document root. Clipping only looks at siblings. */
  readonly parent?:string|null;
}

/** `setClipped` argument. */
export interface SetClippedOp {readonly id:string;readonly clipped:boolean}

/** How a layer takes part in clipping. */
export type ClipRole=
  |{readonly kind:"none"}
  |{readonly kind:"base";readonly clippedIds:readonly string[]}
  |{readonly kind:"clipped";readonly baseId:string;readonly baseName:string}
  /** Marked clipped but with no unclipped sibling below; the engine draws it unclipped. */
  |{readonly kind:"orphan"};

/** ProCraft's indent for a clipped row, 18 dp; it holds the clip glyph. */
export const CLIP_INDENT=18;
/** ProCraft's indent per group level, 21 dp. */
export const GROUP_INDENT=21;

/**
 * Each layer's clipping role. A clipped layer clips to the nearest unclipped
 * sibling below it (a higher index with the same parent); that sibling is a base.
 */
export function resolveClipping(layers:readonly ClipLayer[]):Map<string,ClipRole>{
  const roles=new Map<string,ClipRole>();
  const pending=new Map<string,string[]>();
  const parentOf=(l:ClipLayer)=>l.parent??null;
  // Walk bottom to top so each clipped layer meets its base first.
  const baseBelow=new Map<string|null,ClipLayer>();
  for(let i=layers.length-1;i>=0;i--){
    const layer=layers[i]!;
    if(roles.has(layer.id))throw new RangeError("Duplicate layer id: "+layer.id);
    const parent=parentOf(layer);
    if(!layer.clipped){
      baseBelow.set(parent,layer);
      roles.set(layer.id,{kind:"none"});
      continue;
    }
    const base=baseBelow.get(parent);
    if(!base){roles.set(layer.id,{kind:"orphan"});continue;}
    roles.set(layer.id,{kind:"clipped",baseId:base.id,baseName:base.name});
    const list=pending.get(base.id)??[];
    list.unshift(layer.id);
    pending.set(base.id,list);
  }
  for(const [baseId,clippedIds] of pending)roles.set(baseId,{kind:"base",clippedIds});
  return roles;
}

/**
 * Why `id` cannot be clipped, or `undefined` when it can. Unclipping is always
 * allowed. A layer with no unclipped sibling below it has nothing to clip to;
 * for the bottom layer of the document or a group that is always the case.
 * @throws RangeError when `id` is unknown.
 */
export function clipReason(layers:readonly ClipLayer[],id:string):string|undefined{
  const index=layers.findIndex(l=>l.id===id);
  if(index<0)throw new RangeError("Unknown layer: "+id);
  const layer=layers[index]!;
  if(layer.clipped)return undefined;
  const parent=layer.parent??null;
  const below=layers.slice(index+1).filter(l=>(l.parent??null)===parent);
  if(below.length===0)return "The bottom layer has no layer below to clip to";
  if(below.every(l=>l.clipped))return "Every layer below is already clipped";
  return undefined;
}

/** The base `id` would clip to if it were clipped now, or `undefined` when there is none. */
export function clipTarget(layers:readonly ClipLayer[],id:string):ClipLayer|undefined{
  const index=layers.findIndex(l=>l.id===id);
  if(index<0)throw new RangeError("Unknown layer: "+id);
  const parent=layers[index]!.parent??null;
  return layers.slice(index+1).find(l=>(l.parent??null)===parent&&!l.clipped);
}

/** Visible label of the clip switch: names the base when there is one. */
export function clipToggleLabel(layers:readonly ClipLayer[],id:string):string{
  const target=clipTarget(layers,id);
  return target?"Clip to "+target.name:"Clip to layer below";
}

/** Phrase a row appends to its spoken label, e.g. "clipped to Photo" or "clipping base for 2 layers". */
export function clipAccessibilityPhrase(role:ClipRole|undefined):string|undefined{
  if(!role)return undefined;
  if(role.kind==="clipped")return "clipped to "+role.baseName;
  if(role.kind==="base")return "clipping base for "+role.clippedIds.length+(role.clippedIds.length===1?" layer":" layers");
  if(role.kind==="orphan")return "clipped, but nothing below to clip to";
  return undefined;
}
